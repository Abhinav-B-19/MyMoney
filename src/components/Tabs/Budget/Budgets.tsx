import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Modal,
} from "react-native";
import { useCategory } from "@/context/CategoryContext";
import DateContext from "@/context/DateContext";
import BudgetCard from "./BudgetCard"; // Import the BudgetCard component
import SetFromPastMonthOverlay from "./SetFromPastMonthOverlay";
import { handleDateChangeAndUpdate } from "@/utils/utilsFunctions";
import fetchDataApi from "@/api/fetchDataApi";
import { useTransaction } from "@/context/TransactionContext";
import { useAuth } from "@/context/AuthContext";

const Budgets: React.FC<{ onScroll: (event: any) => void }> = ({
  onScroll,
}) => {
  const { selectedDate, handleDateChange } = useContext(DateContext);
  const { contextCategories, setContextCategories } = useCategory();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState("");
  const [budgetedTransactions, setBudgetedTransactions] = useState([]);
  const [nonBudgetedTransactions, setNonBudgetedTransactions] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const { transactionsContext, setTransactionsContext } = useTransaction();
  const { authUser } = useAuth();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const { budgetedTransactionsFiltered, nonBudgetedTransactionsFiltered } =
      handleDateChangeAndUpdate(selectedDate, contextCategories);

    setBudgetedTransactions(budgetedTransactionsFiltered);
    setNonBudgetedTransactions(nonBudgetedTransactionsFiltered);
  }, [selectedDate, contextCategories]);

  const copyBudgetFromPastMonth = () => {
    console.log("copyBudgetFromPastMonth");
  };

  const fetchingDataApi = async () => {
    try {
      const response = await fetchDataApi("categories", authUser);
      if (response.status === 200 || response.status === 201) {
        setContextCategories(response.data);
      } else {
        console.error("Failed to fetch categories:", response.error);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleUpdate = () => {
    console.log("on handleUpdate fn in budget");
    fetchingDataApi();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      onScroll={onScroll}
      scrollEventThrottle={3}
    >
      <View style={styles.container}>
        {/* Budgeted Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Budgeted categories</Text>
          {budgetedTransactions.length === 0 ? (
            <View>
              <Text style={styles.noBudgetText}>
                Currently, no budget is applied for this month. Set
                budget-limits for this month, or copy your budget-limits from
                past months.
              </Text>
            </View>
          ) : (
            budgetedTransactions.map((transaction, index) => (
              <BudgetCard
                key={index}
                category={transaction.name}
                amount={transaction.amount}
                isBudgeted={transaction.isBudgeted}
                selectedDate={selectedDate}
                months={months}
                selectedCategory={transaction}
                onUpdate={handleUpdate}
              />
            ))
          )}
        </View>

        {/* Not Budgeted This Month */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Not budgeted this month:</Text>
          {nonBudgetedTransactions.map((transaction, index) => (
            <BudgetCard
              key={index}
              category={transaction.name}
              amount={transaction.amount}
              isBudgeted={
                transaction.budgetLimits.some(
                  (limit) =>
                    limit.month === selectedDate.getMonth() + 1 &&
                    limit.year === selectedDate.getFullYear()
                )
                  ? true
                  : false
              }
              selectedDate={selectedDate}
              months={months}
              selectedCategory={transaction}
              onUpdate={handleUpdate}
            />
          ))}
        </View>
        <Button
          title="Set from past month"
          onPress={() => setOverlayVisible(true)}
        />
      </View>

      {/* Overlay Screen */}
      <Modal
        visible={overlayVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setOverlayVisible(false)}
      >
        <SetFromPastMonthOverlay
          onClose={() => setOverlayVisible(false)}
          onCopy={copyBudgetFromPastMonth}
        />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  categoryContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  categoryName: {
    fontSize: 16,
  },
  inputTitle: {
    paddingRight: 10,
    // margin: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  monthContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
    width: "85%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "gray",
    paddingBottom: 4,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 8,
  },
  noBudgetText: {
    fontStyle: "italic",
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
  lightText: {
    color: "#888", // Lighter font color
    marginRight: 10, // Add margin for spacing
  },
});

export default Budgets;
