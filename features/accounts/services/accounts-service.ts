import { db } from "@/lib/db";
import { accounts, users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export class AccountsService {
  static async getByUserId(userId: number) {
    // Verify user exists first to ensure data integrity
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return db.select().from(accounts).where(eq(accounts.user_id, userId));
  }

  static async create(data: {
    user_id: number;
    name: string;
    type: string;
    balance?: string | number;
    currency?: string;
  }) {
    const [user] = await db.select().from(users).where(eq(users.id, data.user_id)).limit(1);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const [account] = await db
      .insert(accounts)
      .values({
        user_id: data.user_id,
        name: data.name,
        type: data.type,
        balance: String(data.balance || 0),
        currency: data.currency || "BRL",
      })
      .returning();

    return account;
  }

  static async delete(id: number, userId: number) {
    const [account] = await db
      .delete(accounts)
      .where(and(eq(accounts.id, id), eq(accounts.user_id, userId)))
      .returning();
    
    if (!account) {
      throw new Error("Conta não encontrada ou permissão negada");
    }

    return account;
  }
}
