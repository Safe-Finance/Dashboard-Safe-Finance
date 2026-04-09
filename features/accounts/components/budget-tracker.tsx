"use client";

import { useBudgetData } from "../hooks/use-budget-data";
import { BudgetTrackerView } from "./budget-tracker-view";

export function BudgetTracker() {
  const { budgetCategories, totalBudget, totalSpent, overallPercentage, isLoading } = useBudgetData();

  return (
    <BudgetTrackerView 
      budgetCategories={budgetCategories} 
      totalBudget={totalBudget} 
      totalSpent={totalSpent} 
      overallPercentage={overallPercentage} 
      isLoading={isLoading} 
    />
  );
}
