import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import {
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
import { COLORS } from "@/constants/colors";

const MoneyTrackerPage: React.FC = () => {
  const [selectedTracker, setSelectedTracker] =
    useState<EditTaskViewPopOverProps | null>(null);
  const { selectedDate, handleDateChange } = useContext(DateContext);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const viewModeContext = useContext(ViewModeContext);

  const [collection, setCollection] = useState([]);
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const { authUser, setAuthUser } = useAuth();
  const { setExpenseTotal, setIncomeTotal, setOverallTotal } = useTotal();

  useEffect(() => {
    handleDateChangeAndUpdate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    console.log("setAuthUser: ", authUser);
  }, [authUser]);

  useEffect(() => {
    fetchDataIfNeeded();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true); // Set refreshing state to true
    console.log("Refreshing data...");

    try {
      // Call fetchTransData to refresh data
      const response = await fetchTransData(authUser);
      if (response.status === 200 || response.status === 201) {
        setCollection(response.data);
        setIsLoading(false);
        console.log("Data refreshed successfully");
      } else {
        console.error("Failed to fetch transactions:", response.error);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }

    setIsRefreshing(false); // Set refreshing state back to false
  };

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

  const calculateTotals = (filteredCollection) => {
    let totalExpense = 0;
    let totalIncome = 0;

    filteredCollection.forEach((item) => {
      const amount = parseFloat(item.transactionAmount); // Convert transactionAmount to a number
      if (item.transactionType === "debit") {
        totalExpense += amount;
      } else if (item.transactionType === "credit") {
        totalIncome += amount;
      }
    });
    setExpenseTotal(totalExpense);
    setIncomeTotal(totalIncome);
    const total = totalIncome - totalExpense;
    setOverallTotal(total);
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

  const separateCollectionByViewMode = () => {
    let filteredCollection = collection;

    switch (viewModeContext.viewMode) {
      case "daily": //case ViewModeOptions.DAILY:
        // console.log("in DAILY");
        filteredCollection = collection.filter((item) =>
          isSameDay(item.date, date)
        );
        break;
      case "weekly":
        // console.log("in WEEKLY");
        const startOfWeekDate = startOfWeek(date, { weekStartsOn: 0 }); // Adjust week start day if necessary
        const endOfWeekDate = endOfWeek(date, { weekStartsOn: 0 });
        // console.log("Start of Week:", format(startOfWeekDate, "MMM d"));
        // console.log("End of Week:", format(endOfWeekDate, "MMM d"));

        filteredCollection = collection.filter((item) => {
          const itemDate = new Date(item.date); // Convert item date to Date object
          const isWithinWeek =
            itemDate >= startOfWeekDate && itemDate <= endOfWeekDate;
          // console.log(`Item Date: ${itemDate}, isWithinWeek: ${isWithinWeek}`);
          return isWithinWeek;
        });
        // console.log("Filtered Collection:", filteredCollection);
        break;
      case "monthly": //case ViewModeOptions.MONTHLY:
        // console.log("in MONTHLY");
        filteredCollection = collection.filter((item) =>
          isSameMonth(item.date, date)
        );
      default:
        break;
    }
    // console.log(filteredCollection);
    calculateTotals(filteredCollection);
    const separatedCollection: { [key: string]: typeof collection } = {};
    filteredCollection.forEach((item) => {
      const dateString = format(item.date, "MMM dd, yyyy"); // Format date as "Apr 30, 2024"
      if (separatedCollection[dateString]) {
        separatedCollection[dateString].push(item);
      } else {
        separatedCollection[dateString] = [item];
      }
    });
    // console.log("separatedCollection: ", separatedCollection);
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

  // const handleDeleteSuccess = () => {
  //   // Close the popover or perform any other action needed
  //   fetchDataIfNeeded();
  //   setSelectedTracker(null); // Reset selectedTracker to close the popover
  // };
  const handleDeleteSuccess = useCallback(() => {
    // Close the popover or perform any other action needed
    fetchDataIfNeeded(); // Consider refetching data if needed
    setSelectedTracker(null); // Reset selectedTracker to close the popover
  }, [fetchDataIfNeeded]);

  // Get separated collection data
  const separatedCollection = separateCollectionByViewMode();

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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY]}
          />
        }
        // onScroll={(event) => {
        //   const offsetY = event.nativeEvent.contentOffset.y;

        //   if (offsetY === 0) {
        //     // FlatList is at the top of the screen
        //     console.log("Pulling down");
        //     // Call your onRefresh function here
        //   } else {
        //     // User is scrolling, but not at the top
        //     console.log("Scrolling");
        //   }
        // }}
      />
      {/* {selectedTracker && (
        <View style={styles.overlay}>
          <EditTaskViewPopOver
            {...selectedTracker}
            onClose={() => setSelectedTracker(null)} // Pass function to close the popover
            onEdit={() => console.log("Edit button clicked")} // Log when edit button is clicked
            onDelete={() => console.log("Delete button clicked")}
            onDeleteSuccess={handleDeleteSuccess} // Log when delete button is clicked
          />
        </View>
      )} */}
      {selectedTracker && (
        <View style={styles.overlay}>
          <EditTaskViewPopOver
            {...selectedTracker}
            onClose={() => setSelectedTracker(null)} // Pass function to close the popover
            onEdit={() => console.log("Edit button clicked")} // Log when edit button is clicked
            onDelete={() => console.log("Delete button clicked")}
            onDeleteSuccess={handleDeleteSuccess} // Pass the callback function directly
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
