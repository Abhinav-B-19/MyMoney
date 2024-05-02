import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import Navbar from "@/components/Navbar";
import SecondNavbar from "@/components/SecondNavbar";
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

const MoneyTrackerPage: React.FC = () => {
  const { selectedDate, handleDateChange } = useContext(DateContext);
  // const [selectedDate, setSelectedDate] = useState(new Date());

  // const handleDateChange = (newDate: Date) => {
  //   setSelectedDate(newDate);
  // };
  const [expenses, setExpenses] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [date, setDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<
    (typeof ViewModeOptions)[keyof typeof ViewModeOptions]
  >(ViewModeOptions.MONTHLY);
  const [showTotal, setShowTotal] = useState<boolean>(true); // Set the default value to true

  const [collection, setCollection] = useState([
    {
      id: "0",
      title: "test",
      date: new Date(),
      numberOfWords: 4,
      transactionAmount: 100,
      transactionType: "credit",
    },
    {
      id: "1",
      title: "test 1",
      date: new Date(),
      numberOfWords: 8,
      transactionAmount: 50,
      transactionType: "debit",
    },
    {
      id: "2",
      title: "test 3",
      date: addMonths(new Date(), 1),
      numberOfWords: 4,
      transactionAmount: 100,
      transactionType: "credit",
    },
    {
      id: "3",
      title: "test 3",
      date: addMonths(new Date(), 1),
      numberOfWords: 5,
      transactionAmount: 100,
      transactionType: "credit",
    },
    {
      id: "4",
      title: "test 4",
      date: addMonths(new Date(), 2),
      numberOfWords: 6,
      transactionAmount: 100,
      transactionType: "credit",
    },
    {
      id: "5",
      title: "test 5",
      date: addMonths(new Date(), 3),
      numberOfWords: 7,
      transactionAmount: 100,
      transactionType: "credit",
    },
    {
      id: "6",
      title: "test 6",
      date: addMonths(new Date(), 4),
      numberOfWords: 8,
      transactionAmount: 100,
      transactionType: "credit",
    },
    {
      id: "7",
      title: "test 7",
      date: addMonths(new Date(), 5),
      numberOfWords: 9,
      transactionAmount: 100,
      transactionType: "credit",
    },
    {
      id: "8",
      title: "test 8",
      date: addMonths(new Date(), 6),
      numberOfWords: 10,
      transactionAmount: 100,
      transactionType: "credit",
    },
    {
      id: "9",
      title: "test 9",
      date: addMonths(new Date(), 7),
      numberOfWords: 11,
      transactionAmount: 100,
      transactionType: "credit",
    },
    {
      id: "10",
      title: "test 10",
      date: addDays(new Date(), 1),
      numberOfWords: 8,
      transactionAmount: 100,
      transactionType: "credit",
    },
    {
      id: "11",
      title: "test 11",
      date: addDays(new Date(), 2),
      numberOfWords: 8,
      transactionAmount: 100,
      transactionType: "credit",
    },
    {
      id: "12",
      title: "test 12",
      date: addDays(new Date(), 3),
      numberOfWords: 8,
      transactionAmount: 100,
      transactionType: "credit",
    },
  ]);

  useEffect(() => {
    // console.log("Expenses:", expenses);
    // console.log("\nIncome:", income);
    // console.log("\nBalance:", balance);
    console.log("\nDate:", date);
    // console.log("\nView Mode:", viewMode);
    // console.log("\nShow Total:", showTotal);
    console.log("\nselectedDate: ", selectedDate);
    console.log("\nhandleDateChange: ", handleDateChange);
    setDate(selectedDate);
  }, [
    expenses,
    income,
    balance,
    date,
    viewMode,
    showTotal,
    collection,
    selectedDate,
    handleDateChange,
  ]);

  // const handleDateChange = (newDate: Date) => {
  //   setDate(newDate);
  //   console.log("Updated Date:", newDate);
  // };

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
        const startOfWeekDate = startOfWeek(date);
        const endOfWeekDate = endOfWeek(date);
        return collection.filter((col) =>
          isSameWeek(col.date, { weekStartsOn: startOfWeekDate })
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

    const separatedCollection: {
      [key: string]: {
        id: string;
        title: string;
        numberOfWords: number;
        transactionAmount: number;
        transactionType: string;
      }[];
    } = {};
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
                description={`Number of Words: ${item.numberOfWords}`}
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
    // paddingTop: 5,
  },
  content: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 15,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default MoneyTrackerPage;
