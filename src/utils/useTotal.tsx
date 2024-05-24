import React, { useEffect, useState } from "react";

const useTotal = (collection: any[]) => {
  const [expenseTotal, setExpenseTotal] = useState<number>(0);
  const [incomeTotal, setIncomeTotal] = useState<number>(0);
  const [overallTotal, setOverallTotal] = useState<number>(0);

  useEffect(() => {
    let totalExpense = 0;
    let totalIncome = 0;

    collection.forEach((item) => {
      if (item.transactionType === "Expense") {
        totalExpense += item.transactionAmount;
      } else if (item.transactionType === "Income") {
        totalIncome += item.transactionAmount;
      }
    });

    setExpenseTotal(totalExpense);
    setIncomeTotal(totalIncome);
    setOverallTotal(totalIncome - totalExpense);
  }, [collection]);

  return { expenseTotal, incomeTotal, overallTotal };
};

export default useTotal;
