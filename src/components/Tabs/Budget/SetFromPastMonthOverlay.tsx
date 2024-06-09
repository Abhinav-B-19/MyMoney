import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Picker from "@/components/Picker";
import ViewModeContext from "@/context/ViewModeContext";
import { Ionicons } from "@expo/vector-icons";
import { handleDateChangeAndUpdate } from "@/utils/utilsFunctions";
import { useCategory } from "@/context/CategoryContext";

interface SetFromPastMonthOverlayProps {
  onClose: () => void;
  onCopy: () => void;
}

const SetFromPastMonthOverlay: React.FC<SetFromPastMonthOverlayProps> = ({
  onClose,
  onCopy,
}) => {
  const { viewMode } = useContext(ViewModeContext);
  const [initialDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const { contextCategories, setContextCategories } = useCategory();
  const [budgetedTransactionsFiltered, setBudgetedTransactionsFiltered] =
    useState([]);

  useEffect(() => {
    setDate(new Date());
  }, []);

  useEffect(() => {
    const { budgetedTransactionsFiltered } = handleDateChangeAndUpdate(
      date,
      contextCategories
    );
    setBudgetedTransactionsFiltered(budgetedTransactionsFiltered);
  }, [date]);

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const renderBudgetLimit = ({ item }) => {
    const currentMonth = date.getMonth() + 1; // Months are zero-based, so add 1
    const currentYear = date.getFullYear();

    const currentBudgetLimit = item.budgetLimits.find(
      (budget) => budget.month === currentMonth && budget.year === currentYear
    );

    const isCurrentMonth = !!currentBudgetLimit;

    if (isCurrentMonth) {
      return (
        <View style={styles.budgetItem}>
          <Text style={styles.budgetText}>
            {item.name}: ${currentBudgetLimit.limit}
          </Text>
          <Ionicons name={"checkmark-circle"} size={24} color={"green"} />
        </View>
      );
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Copy Budget</Text>
        <Text style={styles.warningText}>
          Month: {initialDate.toLocaleString("default", { month: "long" })}{" "}
          {initialDate.getFullYear()}
        </Text>
        <Text style={styles.modalText}>
          Select a previous month you want to copy from
        </Text>
        <View style={styles.modalBudgetContainer}>
          <Picker date={date} onDateChange={handleDateChange} mode={viewMode} />
          <View style={styles.divider} />
          {budgetedTransactionsFiltered.length === 0 ? (
            <View style={styles.budgetItem}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="gray"
              />
              <Text style={[styles.budgetText, { color: "gray" }]}>
                No budget limit set for this month
              </Text>
            </View>
          ) : (
            <FlatList
              data={budgetedTransactionsFiltered}
              renderItem={renderBudgetLimit}
              keyExtractor={(item) => `${item.month}-${item.year}`}
            />
          )}
        </View>
        <View style={styles.warningContainer}>
          <Ionicons name="information-circle-outline" size={24} color="gray" />
          <Text style={styles.warningText}>
            Copying will overwrite all previously applied budget-limits for this
            month.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.buttonText}>CLOSE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={onCopy}>
            <Text style={styles.buttonText}>COPY ALL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  warningText: {
    color: "gray",
    fontSize: 16,
    marginLeft: 10,
  },
  modalBudgetContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: "100%",
    padding: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    width: "40%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  budgetItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
    maxWidth: "100%",
  },
  budgetText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default SetFromPastMonthOverlay;
