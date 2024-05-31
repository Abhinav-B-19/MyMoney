import React, { useState, useContext, createContext } from "react";

const TransactionContext = createContext();

export function useTransaction() {
  return useContext(TransactionContext);
}

export function TransactionProvider(props) {
  const [transactionsContext, setTransactionsContext] = useState([]);

  const value = {
    transactionsContext,
    setTransactionsContext,
  };

  return (
    <TransactionContext.Provider value={value}>
      {props.children}
    </TransactionContext.Provider>
  );
}
