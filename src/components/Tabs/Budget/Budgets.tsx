import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Modal,
  TextInput,
} from "react-native";
import { useCategory } from "@/context/CategoryContext";
import DateContext from "@/context/DateContext";
import BudgetCard from "./BudgetCard"; // Import the BudgetCard component

const Budgets: React.FC<{ onScroll: (event: any) => void }> = ({
  onScroll,
}) => {
  const { selectedDate, handleDateChange } = useContext(DateContext);
  const { contextCategories } = useCategory();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState("");
  const [budgetedTransactions, setBudgetedTransactions] = useState([]);
  const [nonBudgetedTransactions, setNonBudgetedTransactions] = useState([]);
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
    console.log(selectedDate);
    handleDateChangeAndUpdate(selectedDate);
  }, [selectedDate]);

  const handleDateChangeAndUpdate = (newDate: Date) => {
    handleDateChange(newDate);
    const budgetedTransactionsFiltered = contextCategories.filter(
      (transaction) => transaction.isBudgeted
    );
    const nonBudgetedTransactionsFiltered = contextCategories.filter(
      (transaction) => !transaction.isBudgeted
    );
    setBudgetedTransactions(budgetedTransactionsFiltered);
    setNonBudgetedTransactions(nonBudgetedTransactionsFiltered);
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
            <Text style={styles.noBudgetText}>
              Currently, no budget is applied for this month. Set budget-limits
              for this month, or copy your budget-limits from past months.
            </Text>
          ) : (
            budgetedTransactions.map((transaction, index) => (
              <BudgetCard
                key={index}
                category={transaction.name}
                amount={transaction.amount}
                isBudgeted={transaction.isBudgeted}
                selectedDate={selectedDate}
                months={months}
                selectedCategory={transaction} // Pass selectedCategory to BudgetCard
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
              isBudgeted={transaction.isBudgeted}
              selectedDate={selectedDate}
              months={months}
              selectedCategory={transaction}
            />
          ))}
        </View>
      </View>
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
