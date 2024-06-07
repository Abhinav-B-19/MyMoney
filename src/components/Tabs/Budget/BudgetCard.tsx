import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TextInput,
  Pressable,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Import MaterialIcons from Expo vector icons
import { COLORS } from "@/constants/colors";
import carIcon from "../../../../assets/Category/car.png";
import entertainmentIcon from "../../../../assets/Category/entertainment.png";
import fitnessIcon from "../../../../assets/Category/fitness.png";
import foodIcon from "../../../../assets/Category/food.png";
import groceriesIcon from "../../../../assets/Category/groceries.png";
import medicalIcon from "../../../../assets/Category/medical.png";
import shoppingIcon from "../../../../assets/Category/shopping.png";
import travelIcon from "../../../../assets/Category/travel.png";
import emptyIcon from "../../../../assets/Category/empty.png";
import { calculateCategorySpending } from "@/utils/utilsFunctions";
import { useAuth } from "@/context/AuthContext";
import { useTransaction } from "@/context/TransactionContext";

interface BudgetCardProps {
  category: string;
  amount: number;
  isBudgeted: boolean;
  selectedDate: Date;
  months: string[];
  selectedCategory: any;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  category,
  amount,
  isBudgeted,
  selectedDate,
  months,
  selectedCategory,
}) => {
  const categoryImages = {
    food: foodIcon,
    groceries: groceriesIcon,
    travel: travelIcon,
    car: carIcon,
    entertainment: entertainmentIcon,
    fitness: fitnessIcon,
    medical: medicalIcon,
    shopping: shoppingIcon,
  };

  const imageSource = categoryImages[category.toLowerCase()] || emptyIcon;

  const [budgetLimit, setBudgetLimit] = useState<string>(
    selectedCategory && selectedCategory.budgetLimit
      ? selectedCategory.budgetLimit.toString()
      : ""
  );

  const [spent, setSpent] = useState<number>(0);
  const [limit, setLimit] = useState<number>(parseInt(budgetLimit) || 0);
  const [remaining, setRemaining] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = React.useState(false);
  const [popupPosition, setPopupPosition] = React.useState({ x: 0, y: 0 });
  const [dropdownWidth, setDropdownWidth] = React.useState(0);
  const dropdownRef = React.useRef<View>(null);
  const { authUser } = useAuth();
  const { transactionsContext } = useTransaction();

  useEffect(() => {
    const fetchSpendingData = async () => {
      const spending = await calculateCategorySpending(
        transactionsContext,
        authUser,
        category,
        selectedDate
      );
      setSpent(spending);

      const currentLimit = selectedCategory?.budgetLimits?.find(
        (budget) =>
          budget.month === selectedDate.getMonth() + 1 &&
          budget.year === selectedDate.getFullYear()
      )?.limit;

      if (currentLimit) {
        setLimit(currentLimit);
        setRemaining(currentLimit - spending);
        setProgress((spending / currentLimit) * 100);
      }
    };

    fetchSpendingData();
  }, [transactionsContext, authUser, category, selectedDate]);

  const handleSetBudget = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleConfirmBudget = () => {
    const budgetData = {
      month: selectedDate.getMonth() + 1,
      year: selectedDate.getFullYear(),
      limit: parseInt(budgetLimit),
    };
    setLimit(parseInt(budgetLimit));
    setRemaining(parseInt(budgetLimit) - spent);
    setProgress((spent / parseInt(budgetLimit)) * 100);
    closeModal();
  };

  const handleOpenDropdown = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setIsDropdownVisible(true);
    setPopupPosition({
      x: pageX + 35,
      y: pageY - 15,
    });
  };

  const handleCloseDropdown = () => {
    setIsDropdownVisible(false);
  };

  const onLayoutDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownWidth(width);
      });
    }
  };

  const handleChangeLimitDropdown = () => {
    handleSetBudget();
    handleCloseDropdown();
  };

  const handleRemoveBudgetDropdown = () => {
    handleCloseDropdown();
    Alert.alert(
      "Remove this budget",
      "Budget over this category will be removed for this month, are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setLimit(0);
            setRemaining(spent);
            setProgress(0);
            console.log("Budget removed");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={imageSource} style={styles.image} />
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.textContainer}>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
          {!isBudgeted ? (
            <View style={styles.buttonContainer}>
              <Button title="SET BUDGET" onPress={handleSetBudget} />
            </View>
          ) : (
            <TouchableOpacity onPress={handleOpenDropdown}>
              <MaterialIcons name="more-horiz" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
        {isBudgeted && (
          <View style={styles.budgetDetailsContainer}>
            <Text style={styles.amountText}>Limit: ${limit}</Text>
            <Text style={styles.amountText}>Spent: ${spent}</Text>
            <Text style={styles.amountText}>Remaining: ${remaining}</Text>
            <View style={styles.progressMarkerContainer}>
              <Text style={styles.monthText}>
                ({months[selectedDate.getMonth()]} {selectedDate.getFullYear()})
              </Text>
              <View style={styles.limitTextContainer}>
                <Text style={styles.limitText}>{limit}</Text>
              </View>
              <View style={styles.progressMarker} />
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
          </View>
        )}
      </View>
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Budget</Text>
            <View style={styles.modelCategoryContainer}>
              <Image source={imageSource} style={styles.image} />
              <Text style={styles.modelCategoryText}>{category}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Limit</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Enter limit"
                keyboardType="numeric"
                value={budgetLimit}
                onChangeText={(text) => setBudgetLimit(text)}
              />
            </View>
            <View style={styles.monthContainer}>
              <Text style={styles.lightText}>
                Month: {selectedDate ? months[selectedDate.getMonth()] : ""}{" "}
                {selectedDate ? selectedDate.getFullYear() : ""}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={closeModal} />
              <Button
                title="Set"
                onPress={() => {
                  handleConfirmBudget();
                  closeModal();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseDropdown}
      >
        <Pressable style={styles.overlay} onPress={handleCloseDropdown}>
          <View
            ref={dropdownRef}
            style={[
              styles.dropdownMenu,
              { left: popupPosition.x - dropdownWidth, top: popupPosition.y },
            ]}
            onLayout={onLayoutDropdown}
          >
            <Pressable
              style={styles.dropdownItem}
              onPress={handleChangeLimitDropdown}
            >
              <Text>Change limit</Text>
            </Pressable>
            <Pressable
              style={styles.dropdownItem}
              onPress={handleRemoveBudgetDropdown}
            >
              <Text>Remove budget</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.ACCENT,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cardContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  amountText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
    width: "85%",
    marginRight: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modelCategoryContainer: {
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    borderRadius: 5,
    height: 70,
    flexDirection: "row",
    marginBottom: 20,
  },
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
  modelCategoryText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 20,
  },
  categoryName: {
    fontSize: 16,
  },
  inputTitle: {
    paddingRight: 10,
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
  lightText: {
    color: "#888", // Lighter font color
    marginRight: 10, // Add margin for spacing
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  dropdownMenu: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "#ccc",
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    width: "100%",
    marginTop: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.ACCENT,
  },
  budgetDetailsContainer: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 10,
  },
  progressMarkerContainer: {
    position: "absolute",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
    right: 0,
    top: 5,
    backgroundColor: "#fff",
  },
  progressMarker: {
    backgroundColor: "transparent",
    width: 0,
    height: 0,
    borderLeftWidth: 0,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: COLORS.ACCENT,
    transform: [{ rotate: "180deg" }], // Rotate to point upwards
  },
  limitTextContainer: {
    backgroundColor: COLORS.ACCENT,
    padding: 5,
    marginLeft: 5,
  },
  limitText: {
    color: "#fff",
  },
  monthText: {
    color: "#888", // Lighter font color
    marginBottom: 10,
  },
});

export default BudgetCard;
