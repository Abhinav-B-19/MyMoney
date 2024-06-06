// chartDataUtils.ts
import { separateCollectionByViewMode } from "@/utils/utilsFunctions";
import { Transaction } from "@/context/TransactionContext";
import { Account } from "@/context/AccountContext";
import { Category } from "@/context/CategoryContext";

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
  contextAccounts: Account[] = []
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

export const getCategoryBarChartData = (
  transactionsContext: Transaction[],
  viewMode: string,
  selectedDate: Date,
  selectedOption: string,
  contextCategories: Category[] = []
) => {
  const separatedCollection = separateCollectionByViewMode(
    transactionsContext,
    viewMode,
    selectedDate
  );

  if (!selectedOption || !separatedCollection) {
    return {
      barChartData: { datasets: [{ data: [] }], labels: [] },
    };
  }

  let filteredData;
  if (selectedOption === "Expense flow") {
    filteredData = separatedCollection.filter(
      (item) => item.transactionType.toLowerCase() === "expense"
    );
  } else if (selectedOption === "Income flow") {
    filteredData = separatedCollection.filter(
      (item) => item.transactionType.toLowerCase() === "income"
    );
  }

  if (!filteredData) {
    return {
      barChartData: { datasets: [{ data: [] }], labels: [] },
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

  const barChartData = {
    labels: contextCategories.map((category) => category.name),
    datasets: [
      {
        data: contextCategories.map(
          (category) => categoryTotal[category.name] || 0
        ),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
  };

  console.log(barChartData.datasets);
  console.log(barChartData.labels);

  return barChartData;
};

// ======================================
export const getFlowChartData = (
  transactionsContext: Transaction[],
  viewMode: string,
  selectedDate: Date,
  selectedOption: string
) => {
  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();

  const dailyFlowData = Array.from({ length: daysInMonth }, () => ({
    value: 0,
  }));

  const separatedCollection = separateCollectionByViewMode(
    transactionsContext,
    viewMode,
    selectedDate
  );

  if (!selectedOption || !separatedCollection) {
    return {
      datasets: [
        {
          data: [],
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Default to black color
          strokeWidth: 2,
        },
      ],
      labels: [],
    };
  }

  let filteredData = [];
  const option = selectedOption.trim().toLowerCase(); // Normalize selectedOption
  console.log(
    selectedOption.trim().toLowerCase(),
    "\nfilteredData: ",
    filteredData
  );

  if (option === "expense flow") {
    filteredData = separatedCollection.filter(
      (item) => item.transactionType.toLowerCase() === "expense"
    );
  } else if (option === "income flow") {
    filteredData = separatedCollection.filter(
      (item) => item.transactionType.toLowerCase() === "income"
    );
  }

  console.log("filteredData in getFlowChartData:  ", filteredData);

  if (!filteredData) {
    return {
      datasets: [
        {
          data: [],
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Default to black color
          strokeWidth: 2,
        },
      ],
      labels: [],
    };
  }

  filteredData.forEach((item) => {
    const transactionDate = new Date(item.date);
    if (
      transactionDate.getMonth() === selectedDate.getMonth() &&
      transactionDate.getFullYear() === selectedDate.getFullYear()
    ) {
      const day = transactionDate.getDate() - 1; // Zero-based index
      if (day >= 0 && day < daysInMonth) {
        const amount = parseFloat(item.transactionAmount);
        const lowerCaseSelectedOption = selectedOption.toLowerCase(); // Convert to lowercase
        const lowerCaseTransactionType = item.transactionType.toLowerCase(); // Convert to lowercase
        if (
          lowerCaseSelectedOption === "expense flow" &&
          lowerCaseTransactionType === "expense"
        ) {
          dailyFlowData[day].value += amount;
        } else if (
          lowerCaseSelectedOption === "income flow" &&
          lowerCaseTransactionType === "income"
        ) {
          dailyFlowData[day].value += amount;
        }
      }
    }
  });

  const labels = [];
  let currentDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  );
  while (currentDate.getMonth() === selectedDate.getMonth()) {
    const month = currentDate.toLocaleString("default", { month: "short" });
    const day = currentDate.getDate().toString().padStart(2, "0"); // Ensure two digits with leading zero if needed
    labels.push(`${month} ${day}`);

    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 7);
    if (
      nextDate.getMonth() !== selectedDate.getMonth() ||
      nextDate.getDate() > daysInMonth
    ) {
      break;
    } else {
      currentDate = nextDate;
    }
  }

  const label = selectedOption; // Set label based on selectedOption

  const datasets = [
    {
      data: dailyFlowData.map((data) => data.value),
      color: (opacity = 1) =>
        option === "income flow"
          ? `rgba(0, 255, 0, ${opacity})` // Green for income
          : `rgba(255, 0, 0, ${opacity})`, // Red for expense
      strokeWidth: 2,
    },
  ];

  return { datasets, labels };
};
