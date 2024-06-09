import { useState, useEffect } from "react";
import fetchDataApi from "@/api/fetchDataApi";
import {
  isSameDay,
  isSameWeek,
  isSameMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import moment from "moment";

export const useDataLoading = (apiEndpoint: string, authUser: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataApi(apiEndpoint, authUser);
        if (response.status === 200 || response.status === 201) {
          setData(response.data);
          setIsLoading(false);
        } else {
          console.error(`Failed to fetch ${apiEndpoint}:`, response.error);
        }
      } catch (error) {
        console.error(`Error fetching ${apiEndpoint}:`, error);
      }
    };

    fetchData();

    return () => {
      console.log(`${apiEndpoint} cleanup`);
    };
  }, [apiEndpoint, authUser]);

  return { isLoading, data };
};

export const separateCollectionByViewMode = (collection, viewMode, date) => {
  let filteredCollection = collection;

  switch (viewMode) {
    case "daily":
      filteredCollection = collection.filter((item) =>
        isSameDay(new Date(item.date), date)
      );
      break;
    case "weekly":
      const startOfWeekDate = startOfWeek(date, { weekStartsOn: 0 });
      const endOfWeekDate = endOfWeek(date, { weekStartsOn: 0 });
      filteredCollection = collection.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfWeekDate && itemDate <= endOfWeekDate;
      });
      break;
    case "monthly":
      filteredCollection = collection.filter((item) =>
        isSameMonth(new Date(item.date), date)
      );
      break;
    default:
      break;
  }

  return getFlatExpenses(filteredCollection);
};

const getFlatExpenses = (filteredData: any[]) => {
  const sortedExpenses = filteredData.sort((a, b) => {
    return moment(b.date).diff(moment(a.date));
  });

  return sortedExpenses;
};

// Add this function in your utilsFunctions.js or wherever it's defined
export const calculateCategorySpending = (
  transactionsContext,
  authUser,
  categoryName,
  selectedDate
) => {
  let totalSpent = 0;

  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  transactionsContext
    .filter((transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      return (
        transaction.userId === authUser &&
        transaction.category.toLowerCase() === categoryName.toLowerCase() &&
        transaction.transactionType.toLowerCase() === "expense" &&
        transactionDate.getMonth() === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      );
    })
    .forEach((transaction) => {
      const amount = parseFloat(transaction.transactionAmount);
      totalSpent += amount;
    });

  return totalSpent;
};

export const handleDateChangeAndUpdate = (
  newDate: Date,
  contextCategories: Transaction[]
) => {
  const budgetedTransactionsFiltered = contextCategories.filter(
    (transaction) =>
      transaction.isBudgeted &&
      transaction.budgetLimits.some(
        (limit) =>
          limit.month === newDate.getMonth() + 1 &&
          limit.year === newDate.getFullYear()
      )
  );
  const nonBudgetedTransactionsFiltered = contextCategories.filter(
    (transaction) =>
      !transaction.isBudgeted ||
      !transaction.budgetLimits.some(
        (limit) =>
          limit.month === newDate.getMonth() + 1 &&
          limit.year === newDate.getFullYear()
      )
  );

  // Return the filtered transactions
  return {
    budgetedTransactionsFiltered,
    nonBudgetedTransactionsFiltered,
  };
};
