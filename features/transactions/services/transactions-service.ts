import { db } from "@/lib/db";
import { transactions, accounts } from "@/lib/schema";
import { eq, and, desc, between, sql } from "drizzle-orm";

export interface TransactionFilters {
  accountId?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  limit?: number;
}

export class TransactionsService {
  static async list(userId: number, filters: TransactionFilters) {
    const { accountId, startDate, endDate, category, limit = 20 } = filters;
    const conditions = [];

    if (accountId) {
      // Verify account ownership
      const [account] = await db
        .select()
        .from(accounts)
        .where(and(eq(accounts.id, accountId), eq(accounts.user_id, userId)))
        .limit(1);

      if (!account) {
        throw new Error("Conta não encontrada ou acesso negado");
      }
      conditions.push(eq(transactions.account_id, accountId));
    }

    if (startDate && endDate) {
      conditions.push(between(transactions.date, new Date(startDate), new Date(endDate)));
    }

    if (category) {
      conditions.push(eq(transactions.category, category));
    }

    // Base query: if no accountId, we must join with accounts to filter by userId
    if (!accountId) {
      return db
        .select({
          transaction: transactions,
          accountName: accounts.name,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.account_id, accounts.id))
        .where(and(eq(accounts.user_id, userId), ...conditions))
        .orderBy(desc(transactions.date))
        .limit(limit);
    }

    return db
      .select()
      .from(transactions)
      .where(and(...conditions))
      .orderBy(desc(transactions.date))
      .limit(limit);
  }

  static async create(data: {
    account_id: number;
    description: string;
    amount: string | number;
    type: string;
    category?: string;
    date?: string;
    userId: number;
  }) {
    // Verify account ownership
    const [account] = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.id, data.account_id), eq(accounts.user_id, data.userId)))
      .limit(1);

    if (!account) {
      throw new Error("Conta não encontrada ou acesso negado");
    }

    const amountValue = Number.parseFloat(data.amount.toString());
    const balanceChange = data.type === "credit" ? amountValue : -amountValue;

    return db.transaction(async (tx) => {
      const [newTransaction] = await tx
        .insert(transactions)
        .values({
          account_id: data.account_id,
          description: data.description,
          amount: String(data.amount),
          type: data.type,
          category: data.category || "Geral",
          date: data.date ? new Date(data.date) : new Date(),
        })
        .returning();

      await tx
        .update(accounts)
        .set({
          balance: sql`${accounts.balance} + ${balanceChange}`,
          updated_at: new Date(),
        })
        .where(eq(accounts.id, data.account_id));

      return newTransaction;
    });
  }
}
