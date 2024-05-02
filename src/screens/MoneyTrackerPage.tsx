import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import {
  addDays,
  addMonths,
  isSameDay,
  isSameWeek,
  isSameMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { FlatList } from "react-native-gesture-handler";
import { ViewModeOptions } from "@/constants/filterOptions";
import { format } from "date-fns";
import TrackerView from "@/components/TaskView";
import DateContext from "../context/DateContext";
import ViewModeContext from "@/context/ViewModeContext";

const MoneyTrackerPage: React.FC = () => {
  const { selectedDate, handleDateChange } = useContext(DateContext);

  const [expenses, setExpenses] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [date, setDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<
    (typeof ViewModeOptions)[keyof typeof ViewModeOptions]
  >(ViewModeOptions.MONTHLY);

  const viewModeContext = useContext(ViewModeContext);
  const [collection, setCollection] = useState([
    {
      id: "0",
      title: "test",
      description: "Sample transaction description",
      date: new Date(),
      transactionAmount: 100,
      transactionType: "credit",
      currency: "USD",
      account: "Credit Card",
      category: "room",
      isSplitTransaction: false,
    },
    {
      id: "1",
      title: "test 1",
      description: "Another sample transaction description",
      date: new Date(),
      transactionAmount: 50,
      transactionType: "debit",
      currency: "USD",
      account: "Savings",
      category: "food",
      isSplitTransaction: false,
    },
    {
      id: "2",
      title: "test 2",
      description: "Yet another sample transaction description",
      date: addMonths(new Date(), 1),
      transactionAmount: 100,
      transactionType: "credit",
      currency: "USD",
      account: "Cash",
      category: "transport",
      isSplitTransaction: false,
    },
    {
      id: "3",
      title: "test 3",
      description: "Description of test 3",
      date: addDays(new Date(), 5),
      transactionAmount: 200,
      transactionType: "debit",
      currency: "EUR",
      account: "Checking",
      category: "utilities",
      isSplitTransaction: true,
    },
    {
      id: "4",
      title: "test 4",
      description: "Description of test 4",
      date: new Date(),
      transactionAmount: 150,
      transactionType: "credit",
      currency: "GBP",
      account: "Credit Card",
      category: "entertainment",
      isSplitTransaction: false,
    },
    {
      id: "5",
      title: "test 5",
      description: "Description of test 5",
      date: addMonths(new Date(), 2),
      transactionAmount: 300,
      transactionType: "credit",
      currency: "USD",
      account: "Savings",
      category: "travel",
      isSplitTransaction: false,
    },
    {
      id: "6",
      title: "test 6",
      description: "Description of test 6",
      date: addMonths(new Date(), 3),
      transactionAmount: 250,
      transactionType: "debit",
      currency: "USD",
      account: "Checking",
      category: "clothing",
      isSplitTransaction: false,
    },
    {
      id: "7",
      title: "test 7",
      description: "Description of test 7",
      date: addMonths(new Date(), 4),
      transactionAmount: 180,
      transactionType: "credit",
      currency: "EUR",
      account: "Credit Card",
      category: "health",
      isSplitTransaction: false,
    },
    {
      id: "8",
      title: "test 8",
      description: "Description of test 8",
      date: addMonths(new Date(), 5),
      transactionAmount: 120,
      transactionType: "debit",
      currency: "GBP",
      account: "Savings",
      category: "education",
      isSplitTransaction: true,
    },
    {
      id: "9",
      title: "test 9",
      description: "Description of test 9",
      date: addMonths(new Date(), 6),
      transactionAmount: 350,
      transactionType: "credit",
      currency: "USD",
      account: "Cash",
      category: "gifts",
      isSplitTransaction: false,
    },
    {
      id: "10",
      title: "test 10",
      description: "Description of test 10",
      date: addMonths(new Date(), 7),
      transactionAmount: 400,
      transactionType: "debit",
      currency: "EUR",
      account: "Checking",
      category: "electronics",
      isSplitTransaction: false,
    },
    {
      id: "11",
      title: "test 11",
      description: "Description of test 11",
      date: addDays(new Date(), 1),
      transactionAmount: 90,
      transactionType: "credit",
      currency: "USD",
      account: "Credit Card",
      category: "groceries",
      isSplitTransaction: true,
    },
    {
      id: "12",
      title: "test 12",
      date: addDays(new Date(), 3),
      transactionAmount: 90,
      transactionType: "credit",
      currency: "USD",
      account: "Credit Card",
      category: "groceries",
      isSplitTransaction: true,
    },
  ]);

  useEffect(() => {
    console.log("in page init: ", viewModeContext.viewMode);
  }, []);

  useEffect(() => {
    console.log("in page: ", viewModeContext.viewMode);
    handleDateChangeAndUpdate(selectedDate);
  }, [selectedDate, viewModeContext.viewMode]);

  const handleDateChangeAndUpdate = (newDate: Date) => {
    handleDateChange(newDate);
    setDate(newDate);
  };

  const handleAddExpense = (amount: number) => {
    setExpenses(expenses + amount);
    setBalance(balance - amount);
  };

  const handleAddIncome = (amount: number) => {
    setIncome(income + amount);
    setBalance(balance + amount);
  };

  const handleFilterChange = (filter: string) => {
    console.log("Selected Filter in handleFilterChange:", filter);
    // Handle the filter change here
  };

  const handleTotalDisplay = (filter: string) => {
    console.log("Selected Filter in handleFilterChange:", filter);
    // Handle the filter change here
  };

  // Filter data based on the selected view mode
  const filterData = () => {
    switch (viewMode) {
      case ViewModeOptions.DAILY:
        return collection.filter((col) => isSameDay(col.date, date));
      case ViewModeOptions.WEEKLY:
        const startOfWeekDate: any = startOfWeek(date);
        const endOfWeekDate = endOfWeek(date);
        return collection.filter((col) =>
          isSameWeek(col.date, startOfWeekDate)
        );
      case ViewModeOptions.MONTHLY:
      default:
        return collection.filter((col) => isSameMonth(col.date, date));
    }
  };

  // Function to toggle view mode
  const toggleViewMode = (
    mode: (typeof ViewModeOptions)[keyof typeof ViewModeOptions]
  ) => {
    setViewMode(mode);
  };

  const separateCollectionByDate = () => {
    // Filter the collection to include only items from the current month
    const currentMonthCollection = collection.filter((item) =>
      isSameMonth(item.date, date)
    );

    const separatedCollection: { [key: string]: typeof collection } = {};
    currentMonthCollection.forEach((item) => {
      const dateString = format(item.date, "MMM dd, yyyy"); // Format date as "Apr 30, 2024"
      if (separatedCollection[dateString]) {
        separatedCollection[dateString].push(item);
      } else {
        separatedCollection[dateString] = [item];
      }
    });
    return separatedCollection;
  };

  // Get separated collection data
  const separatedCollection = separateCollectionByDate();

  return (
    <FlatList
      style={styles.container}
      data={Object.entries(separatedCollection)}
      keyExtractor={(item) => item[0]} // Using date string as key
      renderItem={({ item }) => (
        <View style={styles.content}>
          <Text style={styles.dateHeader}>{item[0]}</Text>
          <FlatList
            data={item[1]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TrackerView
                key={item.id}
                text={item.title}
                description={`Description ${item.description}`}
                imageUri="your-image-uri-here"
                amount={item.transactionAmount}
                transactionType={item.transactionType}
              />
            )}
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 15,
    paddingRight: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default MoneyTrackerPage;
