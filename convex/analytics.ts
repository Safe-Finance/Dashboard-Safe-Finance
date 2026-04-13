import { v } from "convex/values";
import { query } from "./_generated/server";

export const getChartData = query({
  args: {
    userId: v.id("users"),
    months: v.number(),
  },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();

    // Group transactions by month and year
    const grouped = new Map<string, { income: number; expenses: number }>();

    // Get the last `args.months` months
    const now = new Date();
    const targetMonths: string[] = [];
    for (let i = args.months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toLocaleString('en-US', { month: 'short' });
      const year = d.getFullYear();
      const key = `${monthStr} ${year}`;
      targetMonths.push(key);
      grouped.set(key, { income: 0, expenses: 0 });
    }

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const monthStr = txDate.toLocaleString('en-US', { month: 'short' });
      const year = txDate.getFullYear();
      const key = `${monthStr} ${year}`;

      if (grouped.has(key)) {
        const current = grouped.get(key)!;
        if (tx.type === "income" || tx.type === "credit") {
          current.income += Math.abs(tx.amount);
        } else {
          current.expenses += Math.abs(tx.amount);
        }
      }
    });

    return targetMonths.map((month) => ({
      month: month.split(' ')[0], // We keep only the month name for the chart key
      fullMonth: month,
      ...grouped.get(month)!,
    }));
  },
});
