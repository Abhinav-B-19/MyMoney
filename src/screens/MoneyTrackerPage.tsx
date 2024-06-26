// MoneyTrackerPage.tsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, StyleSheet, Text, RefreshControl } from "react-native";
import {
  isSameDay,
  isSameWeek,
  isSameMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { FlatList } from "react-native-gesture-handler";
import TrackerView from "@/components/TaskView";
import DateContext from "../context/DateContext";
import ViewModeContext from "@/context/ViewModeContext";
import fetchDataApi from "@/api/fetchDataApi";
import TaskActivityIndicator from "@/components/TaskActivityIndicator";
import EditTaskViewPopOver, {
  EditTaskViewPopOverProps,
} from "@/components/EditTaskViewPopOver";
import { useAuth } from "@/context/AuthContext";
import { useTotal } from "@/context/TotalContext";
import { COLORS } from "@/constants/colors";
import moment from "moment";
import NoTransactionPage from "@/components/NoTransactionPage";
import { useFocusEffect } from "@react-navigation/native";
import { useTransaction } from "@/context/TransactionContext";
import { useDataLoading } from "@/utils/utilsFunctions";
import { separateCollectionByViewMode } from "@/utils/utilsFunctions";

const MoneyTrackerPage: React.FC<{ onScroll: (event: any) => void }> = ({
  onScroll,
}) => {
  const [selectedTracker, setSelectedTracker] =
    useState<EditTaskViewPopOverProps | null>(null);
  const { selectedDate, handleDateChange } = useContext(DateContext);
  // const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const viewModeContext = useContext(ViewModeContext);

  const [collection, setCollection] = useState([]);
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const { authUser, setAuthUser } = useAuth();
  const { setExpenseTotal, setIncomeTotal, setOverallTotal } = useTotal();
  const { transactionsContext, setTransactionsContext } = useTransaction();
  const apiEndpoint = "transactions";
  const { isLoading, data } = useDataLoading(apiEndpoint, authUser);

  useEffect(() => {
    handleDateChangeAndUpdate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    console.log("setAuthUser: ", authUser);
  }, [authUser]);

  useFocusEffect(
    useCallback(() => {
      console.log("Screen is focused");

      fetchingDataApi();
      return () => {
        console.log("Screen is unfocused");
      };
    }, [])
  );

  useEffect(() => {
    const filteredCollection = separateCollectionByViewMode(
      collection,
      viewModeContext.viewMode,
      date
    );
    if (Array.isArray(filteredCollection)) {
      calculateTotals(filteredCollection);
    }
  }, [collection, viewModeContext.viewMode, date]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    console.log("Refreshing data...");

    try {
      fetchingDataApi();
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }

    setIsRefreshing(false);
  };

  const fetchingDataApi = async () => {
    try {
      const response = await fetchDataApi("transactions", authUser);
      if (response.status === 200 || response.status === 201) {
        setCollection(response.data);
        setTransactionsContext(response.data);
        // setIsLoading(false);
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
      const amount = parseFloat(item.transactionAmount);
      if (item.transactionType === "Expense") {
        totalExpense += amount;
      } else if (item.transactionType === "Income") {
        totalIncome += amount;
      }
    });
    setExpenseTotal(totalExpense);
    setIncomeTotal(totalIncome);
    const total = totalIncome - totalExpense;
    setOverallTotal(total);
  };

  const handleDateChangeAndUpdate = (newDate: Date) => {
    handleDateChange(newDate);
    setDate(newDate);
  };

  const handleFilterChange = (filter: string) => {
    console.log("Selected Filter in handleFilterChange:", filter);
  };

  const handleTotalDisplay = (filter: string) => {
    console.log("Selected Filter in handleFilterChange:", filter);
  };

  const handleTrackerPress = (userID: string, id: string) => {
    const selected = collection.find(
      (item) => item.userID === userID && item.id === id
    );
    if (selected) {
      setSelectedTracker(selected);
    }
  };

  const handleDeleteSuccess = useCallback(() => {
    fetchingDataApi();
    setSelectedTracker(null);
  }, []);

  const separatedCollection = separateCollectionByViewMode(
    collection,
    viewModeContext.viewMode,
    date
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <TaskActivityIndicator style={styles.loadingIndicator} />
      </View>
    );
  }

  if (separatedCollection.length === 0) {
    return <NoTransactionPage onRefresh={onRefresh} />;
  }

  const groupedExpenses = separateCollectionByDate(separatedCollection);

  return (
    <>
      <FlatList
        onScroll={onScroll}
        scrollEventThrottle={3}
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 50 }}
        data={Object.entries(groupedExpenses)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.content}>
            <Text style={styles.dateHeader}>{item[0]}</Text>
            <FlatList
              data={item[1]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TrackerView
                  key={item.id}
                  category={item.category}
                  description={item.description}
                  transactionType={item.transactionType}
                  onPress={() => handleTrackerPress(item.userID, item.id)}
                  id={item.id}
                  userId={item.userId}
                  title={item.title}
                  date={item.date}
                  transactionAmount={item.transactionAmount}
                  currency={item.currency}
                  account={item.account}
                  toAccount={item.toAccount}
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
      />
      {selectedTracker && (
        <View style={styles.overlay}>
          <EditTaskViewPopOver
            {...selectedTracker}
            onClose={() => {
              setSelectedTracker(null);
              fetchingDataApi();
            }}
            onEdit={() => console.log("Edit button clicked")}
            onDelete={() => console.log("Delete button clicked")}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </View>
      )}
    </>
  );
};

const separateCollectionByDate = (collection) => {
  const groupedExpenses = {};
  collection.forEach((expense) => {
    const date = moment(expense.date).format("DD-MM-YYYY");
    if (!groupedExpenses[date]) {
      groupedExpenses[date] = [];
    }
    groupedExpenses[date].push(expense);
  });
  return groupedExpenses;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
