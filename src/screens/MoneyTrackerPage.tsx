import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
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
import fetchTransData from "@/api/fetchTransData";
import TaskActivityIndicator from "@/components/TaskActivityIndicator";
import EditTaskViewPopOver, {
  EditTaskViewPopOverProps,
} from "@/components/EditTaskViewPopOver";
import { useAuth } from "@/context/AuthContext";
import { useTotal } from "@/context/TotalContext";

const MoneyTrackerPage: React.FC = () => {
  const [selectedTracker, setSelectedTracker] =
    useState<EditTaskViewPopOverProps | null>(null);
  const { selectedDate, handleDateChange } = useContext(DateContext);
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [date, setDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<
    (typeof ViewModeOptions)[keyof typeof ViewModeOptions]
  >(ViewModeOptions.MONTHLY);

  const viewModeContext = useContext(ViewModeContext);

  const [collection, setCollection] = useState([]);
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const { authUser, setAuthUser } = useAuth();
  const {
    expenseTotal,
    setExpenseTotal,
    incomeTotal,
    setIncomeTotal,
    overallTotal,
    setOverallTotal,
  } = useTotal();

  useEffect(() => {
    // console.log("in page: ", viewModeContext.viewMode);
    handleDateChangeAndUpdate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    console.log("setAuthUser: ", authUser);
  }, [authUser]);

  useEffect(() => {
    fetchDataIfNeeded();
  }, []);

  useEffect(() => {
    calculateTotals();
    // console.log(collection);
  }, [collection]);

  useEffect(() => {
    // filterData();
    console.log("viewMode in tracker: ", viewMode);
    // Use filteredData to render the filtered data based on the selected view mode
  }, [viewMode]);

  const fetchDataIfNeeded = async () => {
    try {
      const response = await fetchTransData(authUser);
      if (response.status === 200 || response.status === 201) {
        setCollection(response.data);
        setIsLoading(false);
        setInitialDataFetched(true);
      } else {
        console.error("Failed to fetch transactions:", response.error);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const calculateTotals = () => {
    let totalExpense = 0;
    let totalIncome = 0;

    collection.forEach((item) => {
      if (item.transactionType === "debit") {
        totalExpense += item.transactionAmount;
      } else if (item.transactionType === "credit") {
        totalIncome += item.transactionAmount;
      }
    });

    setExpenseTotal(totalExpense);
    setIncomeTotal(totalIncome);
    setOverallTotal(totalIncome - totalExpense);
  };

  const setApiData = async () => {
    try {
      const response = await fetchTransData("authUser");
      if (response.status === 200 || response.status === 201) {
        setCollection(response.data);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch transactions:", response.error);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleDateChangeAndUpdate = (newDate: Date) => {
    handleDateChange(newDate);
    setDate(newDate);
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
  // const filterData = () => {
  //   switch (viewMode) {
  //     case ViewModeOptions.DAILY:
  //       console.log("in DAILY");
  //       return collection.filter((col) => isSameDay(col.date, date));
  //     case ViewModeOptions.WEEKLY:
  //       console.log("in WEEKLY");
  //       const startOfWeekDate: any = startOfWeek(date);
  //       const endOfWeekDate = endOfWeek(date);
  //       return collection.filter((col) =>
  //         isSameWeek(col.date, startOfWeekDate)
  //       );
  //     case ViewModeOptions.MONTHLY:
  //       console.log("in MONTHLY");
  //     default:
  //       return collection.filter((col) => isSameMonth(col.date, date));
  //   }
  // };

  // Function to toggle view mode
  const toggleViewMode = (
    mode: (typeof ViewModeOptions)[keyof typeof ViewModeOptions]
  ) => {
    setViewMode(mode);
  };

  // const separateCollectionByDate = () => {
  //   // Filter the collection to include only items from the current month
  //   const currentMonthCollection = collection.filter((item) =>
  //     isSameMonth(item.date, date)
  //   );

  //   const separatedCollection: { [key: string]: typeof collection } = {};
  //   currentMonthCollection.forEach((item) => {
  //     const dateString = format(item.date, "MMM dd, yyyy"); // Format date as "Apr 30, 2024"
  //     if (separatedCollection[dateString]) {
  //       separatedCollection[dateString].push(item);
  //     } else {
  //       separatedCollection[dateString] = [item];
  //     }
  //   });
  //   return separatedCollection;
  // };

  const separateCollectionByDate = () => {
    let filteredCollection = collection;

    switch (viewMode) {
      case "DAILY": //case ViewModeOptions.DAILY:
        console.log("in DAILY");
        filteredCollection = collection.filter((item) =>
          isSameDay(item.date, date)
        );
        break;
      case "WEEKLY": //case ViewModeOptions.WEEKLY:
        console.log("in WEEKLY");
        const startOfWeekDate = startOfWeek(date);
        const endOfWeekDate = endOfWeek(date);
        filteredCollection = collection.filter(
          (item) =>
            isSameWeek(item.date, startOfWeekDate, { weekStartsOn: 1 }) &&
            item.date <= endOfWeekDate
        );
        break;
      case "MONTHLY": //case ViewModeOptions.MONTHLY:
        console.log("in MONTHLY");
        filteredCollection = collection.filter((item) =>
          isSameMonth(item.date, date)
        );
      default:
        // console.log("in MONTHLY");
        // filteredCollection = collection.filter((item) =>
        //   isSameMonth(item.date, date)
        // );
        break;
    }

    const separatedCollection: { [key: string]: typeof collection } = {};
    filteredCollection.forEach((item) => {
      const dateString = format(item.date, "MMM dd, yyyy"); // Format date as "Apr 30, 2024"
      if (separatedCollection[dateString]) {
        separatedCollection[dateString].push(item);
      } else {
        separatedCollection[dateString] = [item];
      }
    });

    return separatedCollection;
  };

  const handleTrackerPress = (userID: string, id: string) => {
    // console.log("Clicked tracker:", userID, id); // Log to check the values
    const selected = collection.find(
      (item) => item.userID === userID && item.id === id
    ); // Find the selected tracker item
    // console.log("Selected tracker:", selected); // Log to check the selected tracker
    if (selected) {
      setSelectedTracker(selected); // Set the selected tracker to open the EditTaskViewPopOver
    }
  };

  const handleDeleteSuccess = () => {
    // Close the popover or perform any other action needed
    fetchDataIfNeeded();
    setSelectedTracker(null); // Reset selectedTracker to close the popover
  };

  // Get separated collection data
  const separatedCollection = separateCollectionByDate();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <TaskActivityIndicator style={styles.loadingIndicator} />
      </View>
    );
  }

  return (
    <>
      <FlatList
        style={styles.container}
        data={Object.entries(separatedCollection)}
        keyExtractor={(item, index) => index.toString()} // Use the index as the key
        renderItem={({ item }) => (
          <View style={styles.content}>
            <Text style={styles.dateHeader}>{item[0]}</Text>
            <FlatList
              data={item[1]}
              keyExtractor={(item) => item.id} // Use a unique identifier as the key
              renderItem={({ item }) => (
                <TrackerView
                  key={item.id} // Ensure userID is unique
                  text={item.title}
                  category={item.category}
                  description={`Description ${item.description}`}
                  // imageUri={`../../assets/Category/${item.category}.png`}
                  amount={item.transactionAmount}
                  transactionType={item.transactionType}
                  onPress={() => handleTrackerPress(item.userID, item.id)}
                  id={item.id}
                  userId={item.userId}
                  title={item.title}
                  date={item.date}
                  transactionAmount={item.transactionAmount}
                  currency={item.currency}
                  account={item.account}
                  isSplitTransaction={item.isSplitTransaction}
                />
              )}
            />
          </View>
        )}
      />
      {selectedTracker && (
        <View style={styles.overlay}>
          <EditTaskViewPopOver
            {...selectedTracker}
            onClose={() => setSelectedTracker(null)} // Pass function to close the popover
            onEdit={() => console.log("Edit button clicked")} // Log when edit button is clicked
            onDelete={() => console.log("Delete button clicked")}
            onDeleteSuccess={handleDeleteSuccess} // Log when delete button is clicked
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  loadingIndicator: {
    marginTop: 20,
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
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },

  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },

  closeButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default MoneyTrackerPage;
