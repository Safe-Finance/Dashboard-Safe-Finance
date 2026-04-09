"use client";

import { useMemo } from "react";

export interface BudgetCategory {
  name: string;
  spent: number;
  budget: number;
}

const mockBudgetCategories: BudgetCategory[] = [
  { name: "Housing", spent: 2000, budget: 2500 },
  { name: "Transportation", spent: 450, budget: 500 },
  { name: "Food", spent: 800, budget: 1000 },
  { name: "Utilities", spent: 300, budget: 350 },
  { name: "Entertainment", spent: 250, budget: 300 },
];

export function useBudgetData() {
  const budgetCategories = useMemo(() => mockBudgetCategories, []);

  const totalBudget = useMemo(
    () => budgetCategories.reduce((sum, category) => sum + category.budget, 0),
    [budgetCategories],
  );

  const totalSpent = useMemo(
    () => budgetCategories.reduce((sum, category) => sum + category.spent, 0),
    [budgetCategories],
  );

  const overallPercentage = useMemo(
    () => (totalSpent / totalBudget) * 100,
    [totalSpent, totalBudget],
  );

  return { budgetCategories, totalBudget, totalSpent, overallPercentage, isLoading: false };
}
