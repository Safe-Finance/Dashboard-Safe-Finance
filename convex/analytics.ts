import { v } from "convex/values"
import { query } from "./_generated/server"

export const getFinancialSummary = query({
  args: {
    userId: v.id("users"),
    startDate: v.optional(v.string()), // ISO date
    endDate: v.optional(v.string()), // ISO date
  },
  handler: async (ctx, args) => {
    const userAccounts = await ctx.db
      .query("accounts")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect()

    const accountIds = userAccounts.map((a) => a._id)

    let transactionsQuery = ctx.db.query("transactions")

    const allTransactions = await transactionsQuery.collect()
    
    // Filter by account and date manually since we don't have a complex index yet
    const filteredTransactions = allTransactions.filter(t => {
      const isUserTransaction = t.account_id ? accountIds.includes(t.account_id) : false
      const afterStart = args.startDate ? t.date >= args.startDate : true
      const beforeEnd = args.endDate ? t.date <= args.endDate : true
      return isUserTransaction && afterStart && beforeEnd
    })

    // Spending by Category
    const categoryMap = new Map<string, number>()
    let totalIncome = 0
    let totalExpenses = 0

    filteredTransactions.forEach((t) => {
      const amount = Number(t.amount)
      if (amount < 0) {
        const absAmount = Math.abs(amount)
        const category = t.category || "Outros"
        categoryMap.set(category, (categoryMap.get(category) || 0) + absAmount)
        totalExpenses += absAmount
      } else {
        totalIncome += amount
      }
    })

    const spendingByCategory = Array.from(categoryMap.entries()).map(([category, total]) => ({
      category,
      total,
    })).sort((a, b) => b.total - a.total)

    // Top Expenses
    const topExpenses = filteredTransactions
      .filter((t) => Number(t.amount) < 0)
      .sort((a, b) => Number(a.amount) - Number(b.amount)) // more negative first
      .slice(0, 5)
      .map((t) => ({
        description: t.description,
        amount: Math.abs(Number(t.amount)),
        date: t.date,
        category: t.category || "Outros",
      }))

    return {
      spendingByCategory,
      topExpenses,
      incomeVsExpenses: {
        income: totalIncome,
        expenses: totalExpenses,
      },
      // Simplified for now, can add monthlyBalance and transactionTrends if needed
      monthlyBalance: [],
      transactionTrends: [],
    }
  },
})
