import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("budgets")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    category: v.string(),
    amount: v.number(),
    period: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const budgetId = await ctx.db.insert("budgets", {
      user_id: args.userId,
      category: args.category,
      amount: args.amount,
      period: args.period,
      start_date: args.startDate,
      end_date: args.endDate,
    });
    return budgetId;
  },
});

export const update = mutation({
  args: {
    id: v.id("budgets"),
    category: v.optional(v.string()),
    amount: v.optional(v.number()),
    period: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Convert to snake_case to match schema
    const data: any = {};
    if (updates.category !== undefined) data.category = updates.category;
    if (updates.amount !== undefined) data.amount = updates.amount;
    if (updates.period !== undefined) data.period = updates.period;
    if (updates.startDate !== undefined) data.start_date = updates.startDate;
    if (updates.endDate !== undefined) data.end_date = updates.endDate;

    await ctx.db.patch(id, data);
    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("budgets"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
