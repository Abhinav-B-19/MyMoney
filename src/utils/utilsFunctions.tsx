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
  categoryName
) => {
  let totalSpent = 0;

  transactionsContext
    .filter(
      (transaction) =>
        transaction.userId === authUser &&
        transaction.category.toLowerCase() === categoryName.toLowerCase() &&
        transaction.transactionType.toLowerCase() === "expense"
    )
    .forEach((transaction) => {
      const amount = parseFloat(transaction.transactionAmount);
      totalSpent += amount;
    });

  return totalSpent;
};
