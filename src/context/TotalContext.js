import React, { createContext, useContext, useState } from "react";

const TotalContext = createContext();

export const useTotal = () => useContext(TotalContext);

export const TotalProvider = ({ children }) => {
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [overallTotal, setOverallTotal] = useState(0);

  return (
    <TotalContext.Provider
      value={{
        expenseTotal,
        setExpenseTotal,
        incomeTotal,
        setIncomeTotal,
        overallTotal,
        setOverallTotal,
      }}
    >
      {children}
    </TotalContext.Provider>
  );
};
