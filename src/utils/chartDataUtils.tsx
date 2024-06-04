// chartDataUtils.ts
import { separateCollectionByViewMode } from "@/utils/utilsFunctions";
import { Transaction } from "@/context/TransactionContext";
import { Account } from "@/context/AccountContext";

export const getPieChartData = (
  transactionsContext: Transaction[],
  viewMode: string,
  selectedDate: Date,
  selectedOption: string
) => {
  const separatedCollection = separateCollectionByViewMode(
    transactionsContext,
    viewMode,
    selectedDate
  );

  if (!selectedOption || !separatedCollection) {
    return {
      seriesData: [],
      sliceColors: [],
      categoryNames: [],
      percentages: [],
      filteredData: [],
    };
  }

  const filteredData = separatedCollection.filter((item) => {
    if (selectedOption === "Expense overview") {
      return item.transactionType.toLowerCase() === "expense";
    } else if (selectedOption === "Income overview") {
      return item.transactionType.toLowerCase() === "income";
    }
    return false;
  });

  if (!filteredData || filteredData.length === 0) {
    return {
      seriesData: [],
      sliceColors: [],
      categoryNames: [],
      percentages: [],
      filteredData: [],
    };
  }

  const categoryTotal: Record<string, number> = {};
  filteredData.forEach((item) => {
    const category = item.category;
    const amount = parseFloat(item.transactionAmount);
    if (categoryTotal[category]) {
      categoryTotal[category] += amount;
    } else {
      categoryTotal[category] = amount;
    }
  });

  const pieChartData = Object.entries(categoryTotal).map(
    ([category, amount], index) => ({
      value: amount,
      color: getRandomColor(),
      name: category,
      series: index,
      sliceColor: getRandomColor(),
      externalName: category,
    })
  );

  const seriesData = pieChartData.map((data) => data.value);
  const sliceColors = pieChartData.map((data) => data.color);
  const categoryNames = pieChartData.map((data) => data.name);

  const percentages = calculatePercentage(pieChartData);

  return { seriesData, sliceColors, categoryNames, percentages, filteredData };
};

export const calculatePercentage = (seriesData: any[]) => {
  const totalSum = seriesData.reduce((acc, curr) => acc + curr.value, 0);
  const percentages = seriesData.map((data) => ({
    ...data,
    percentage: ((data.value / totalSum) * 100).toFixed(2),
  }));

  return percentages;
};

export const getBarChartData = (
  transactionsContext: Transaction[],
  viewMode: string,
  selectedDate: Date,
  selectedOption: string,
  contextAccounts: Account[]
) => {
  const separatedCollection = separateCollectionByViewMode(
    transactionsContext,
    viewMode,
    selectedDate
  );

  if (!selectedOption || !separatedCollection) {
    return {
      expenseBarChartData: { datasets: [{ data: [] }], labels: [] },
      incomeBarChartData: { datasets: [{ data: [] }], labels: [] },
    };
  }

  if (selectedOption === "Account analysis") {
    const filterExpenseData = separatedCollection.filter(
      (item) => item.transactionType.toLowerCase() === "expense"
    );

    const filterIncomeData = separatedCollection.filter(
      (item) => item.transactionType.toLowerCase() === "income"
    );

    const expenseAccountTotal = {};
    const incomeAccountTotal = {};

    filterExpenseData.forEach((item) => {
      const account = item.account;
      const amount = parseFloat(item.transactionAmount);
      if (expenseAccountTotal[account]) {
        expenseAccountTotal[account] += amount;
      } else {
        expenseAccountTotal[account] = amount;
      }
    });

    filterIncomeData.forEach((item) => {
      const account = item.account;
      const amount = parseFloat(item.transactionAmount);
      if (incomeAccountTotal[account]) {
        incomeAccountTotal[account] += amount;
      } else {
        incomeAccountTotal[account] = amount;
      }
    });

    const expenseBarChartData = {
      datasets: [
        {
          data: contextAccounts.map(
            (account) => expenseAccountTotal[account.name] || 0
          ),
        },
      ],
      labels: contextAccounts.map((account) => account.name),
    };

    const incomeBarChartData = {
      datasets: [
        {
          data: contextAccounts.map(
            (account) => incomeAccountTotal[account.name] || 0
          ),
        },
      ],
      labels: contextAccounts.map((account) => account.name),
    };

    return { expenseBarChartData, incomeBarChartData };
  } else {
    return {
      expenseBarChartData: { datasets: [{ data: [] }], labels: [] },
      incomeBarChartData: { datasets: [{ data: [] }], labels: [] },
    };
  }
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
