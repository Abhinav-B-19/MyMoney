import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import postNewData from "@/api/postNewData";
import { COLORS } from "@/constants/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import updateTransactionData from "@/api/updateTransactionData";
import Calculator from "@/components/Calculator";
import { useCategory } from "@/context/CategoryContext";
import { useAccount } from "@/context/AccountContext";

interface TransactionDetailsProps {
  initialFormData?: {
    userId?: string;
    title?: string;
    description?: string;
    date?: string;
    transactionAmount?: string;
    transactionType?: string;
    currency?: string;
    account?: string;
    category?: string;
    isSplitTransaction?: boolean;
  };
}

const AddTransactionDetails: React.FC<TransactionDetailsProps> = ({
  initialFormData = {},
}) => {
  const { authUser } = useAuth();
  const route = useRoute();

  const { initialFormData: routeInitialFormData } = route.params ?? {};
  const mergedInitialFormData = { ...initialFormData, ...routeInitialFormData };
  const isDataPassed = Object.keys(mergedInitialFormData).length > 0;

  const [selectingField, setSelectingField] = useState("");
  const [isSelectingVisible, setIsSelectingVisible] = useState(false);
  const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [isDataModified, setIsDataModified] = useState(false);

  const [calculatorInput, setCalculatorInput] = useState(
    mergedInitialFormData.transactionAmount || ""
  );
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [operationInput, setoperationInput] = useState("");

  const defaultFormData = {
    userId: authUser,
    title: "",
    description: "",
    date: new Date().toISOString(),
    time: new Date(),
    transactionAmount: "",
    transactionType: "Expense",
    currency: "\u20B9",
    account: "",
    category: "",
    isSplitTransaction: false,
  };

  const [formData, setFormData] = useState({
    ...defaultFormData,
    ...mergedInitialFormData,
  });

  useEffect(() => {
    const { transactionType, account, title, transactionAmount } = formData;
    const disabled = !(
      transactionType &&
      account &&
      title &&
      transactionAmount
    );
    setSubmitDisabled(disabled);
  }, [formData]);

  useEffect(() => {
    const isModified =
      JSON.stringify(formData) !== JSON.stringify(defaultFormData);
    setIsDataModified(isModified);

    // Filter categories based on the selected transaction type
    const categoriesByType = contextCategories.filter(
      (category) => category.transactionType === formData.transactionType
    );
    setFilteredCategories(categoriesByType);
  }, [formData]);

  const { contextCategories, setContextCategories } = useCategory();

  // const [accounts, setAccounts] = useState<string[]>([
  //   "DEBIT CARD",
  //   "CREDIT CARD",
  //   "SAVINGS",
  //   "CASH",
  // ]);
  const { contextAccounts, setContextAccounts } = useAccount();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    handleChange("date", date);
    hideDatePicker();
  };

  const handleTimeConfirm = (time) => {
    const formattedTime = new Date(time); //formatTime(time);
    handleChange("time", formattedTime); // Update form state with the Date object
    hideTimePicker();
  };

  const handleChange = (name: string, value: string | number | Date) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const transactionType =
      formData.transactionType === "Income" ? "Income" : "Expense";

    const updatedFormData = { ...formData, transactionType };

    try {
      await postNewData("transactions", updatedFormData);
      handleBack();
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const transactionType =
        formData.transactionType === "Income" ? "Income" : "Expense";

      const updatedFormData = { ...formData, transactionType };
      const id = updatedFormData.id;

      await updateTransactionData("transactions", id, updatedFormData);
      handleBack();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCategorySelect = (category: string) => {
    Keyboard.dismiss();
    setFormData({ ...formData, category });
    setIsSelectingVisible(false);
  };

  const handleAccountSelect = (account: string) => {
    Keyboard.dismiss(); // Dismiss the keyboard
    setFormData({ ...formData, account });
    setIsSelectingVisible(false);
  };

  const handleTransactionTypeSelect = (transactionType: string) => {
    setFormData({ ...formData, transactionType });
  };

  const handleToggleSplitTransaction = () => {
    setFormData({
      ...formData,
      isSplitTransaction: !formData.isSplitTransaction,
    });
  };

  const currencies = ["₹", "$", "€", "£", "¥"];

  const handleCurrencySelect = (currency: string) => {
    setFormData({ ...formData, currency });
    setIsSelectingVisible(false);
  };

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    if (isSelectingVisible) {
      setIsSelectingVisible(false);
    }
  };

  const formatTime = (timeString: string) => {
    const currentDate = new Date(timeString);
    const currentTime = currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return currentTime;
  };

  const handleNumberPress = (number: string) => {
    setCalculatorInput((prevInput) => prevInput + number);
    handleChange("transactionAmount", calculatorInput + number);
  };

  const handleOperatorPress = (operator: string) => {
    // Update the calculator input with the operator
    setCalculatorInput((prevInput) => prevInput + operator);
    handleChange("transactionAmount", calculatorInput + operator);
    setoperationInput(operator);
  };

  const handleEqualPress = () => {
    try {
      const result = eval(calculatorInput);
      setCalculatorInput(result.toString());
      handleChange("transactionAmount", result.toString());
    } catch (error) {
      console.error("Invalid expression", error);
    }
  };

  const handleDeleteLast = () => {
    setCalculatorInput((prevInput) => prevInput.slice(0, -1));
    handleChange("transactionAmount", calculatorInput.slice(0, -1));
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={COLORS.PRIMARY}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Add Transaction Details</Text>
          <TouchableOpacity
            style={[styles.button, submitDisabled && styles.disabledButton]}
            onPress={isDataPassed ? handleUpdate : handleSave}
            disabled={submitDisabled}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.selectedButtonText}>
                {isDataPassed ? "UPDATE" : "SAVE"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.form}>
          <View style={styles.transactionTypeContainer}>
            <TouchableOpacity
              style={[
                styles.transactionTypeButton,
                formData.transactionType === "Income" &&
                  styles.selectedTransactionTypeButton,
              ]}
              onPress={() => handleTransactionTypeSelect("Income")}
            >
              <Text
                style={[
                  styles.buttonText,
                  formData.transactionType === "Income" &&
                    styles.selectedButtonText,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.transactionTypeButton,
                formData.transactionType === "Expense" &&
                  styles.selectedTransactionTypeButton,
              ]}
              onPress={() => handleTransactionTypeSelect("Expense")}
            >
              <Text
                style={[
                  styles.buttonText,
                  formData.transactionType === "Expense" &&
                    styles.selectedButtonText,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.transactionTypeButton,
                formData.transactionType === "transfer" &&
                  styles.selectedTransactionTypeButton,
              ]}
              onPress={() => handleTransactionTypeSelect("transfer")}
            >
              <Text
                style={[
                  styles.buttonText,
                  formData.transactionType === "transfer" &&
                    styles.selectedButtonText,
                ]}
              >
                Transfer
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.selectContainer}>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                setSelectingField("category");
                setIsSelectingVisible(true);
              }}
            >
              <Text style={styles.buttonText}>
                {(formData.category || "Select Category").toUpperCase()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                setSelectingField("account");
                setIsSelectingVisible(true);
              }}
            >
              <Text style={styles.buttonText}>
                {(formData.account || "Select Account").toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Title"
            onChangeText={(text) => handleChange("title", text)}
            value={formData.title}
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={(text) => handleChange("description", text)}
            value={formData.description}
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <View style={styles.splitTransactionContainer}>
            <Text style={styles.label}>Split Transaction:</Text>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                formData.isSplitTransaction && styles.selectedToggleButton,
              ]}
              onPress={handleToggleSplitTransaction}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  formData.isSplitTransaction &&
                    styles.selectedToggleButtonText,
                ]}
              >
                {formData.isSplitTransaction ? "Yes" : "No"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.amountContainer}>
            <TouchableOpacity
              style={styles.currencySelector}
              onPress={() => {
                setSelectingField("currency");
                setIsSelectingVisible(true);
              }}
            >
              <Text style={styles.currencySelectorText}>
                {formData.currency}
              </Text>
            </TouchableOpacity>
            <View style={styles.amountInputContainer}>
              {/* <Text style={styles.operationContainer}>{operationInput}</Text> */}
              <TextInput
                style={[styles.amountInput, { color: "black" }]} // Add custom color style
                placeholder="Amount"
                keyboardType="numeric"
                onChangeText={(text) => handleChange("transactionAmount", text)}
                value={formData.transactionAmount}
                onSubmitEditing={() => Keyboard.dismiss()}
                editable={false}
              />
              <TouchableOpacity
                onPress={handleDeleteLast}
                style={styles.deleteButton}
              >
                <MaterialCommunityIcons
                  name="backspace-outline"
                  size={24}
                  color={COLORS.PRIMARY}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Calculator
            onNumberPress={handleNumberPress}
            onOperatorPress={handleOperatorPress}
            onEqualPress={handleEqualPress}
          />

          <View style={styles.dateAndTimeContainer}>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={showDatePicker}
            >
              <Text style={styles.pickerButtonText}>
                {formatDate(formData.date)}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
            />
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={showTimePicker}
            >
              <Text style={styles.pickerButtonText}>
                {formatTime(formData.time)} {/* Use the 'time' state value */}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={handleTimeConfirm}
              onCancel={hideTimePicker}
            />
          </View>
        </View>

        {isSelectingVisible && (
          <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.selectionModal}>
              {selectingField === "category" &&
                filteredCategories.map((category) =>
                  category.isIgnored ? null : (
                    <TouchableOpacity
                      key={category.id} // Assuming 'id' is a unique identifier for each category
                      style={styles.selectableItem}
                      onPress={() => handleCategorySelect(category.name)} // Assuming 'name' is the category name
                    >
                      <Text style={styles.selectableItemText}>
                        {category.name}
                      </Text>
                      {/* Assuming 'name' is the category name */}
                    </TouchableOpacity>
                  )
                )}
              {selectingField === "account" &&
                contextAccounts.map((account) =>
                  account.isIgnored ? null : (
                    <TouchableOpacity
                      key={account.id}
                      style={styles.selectableItem}
                      onPress={() => handleAccountSelect(account.name)}
                    >
                      <Text style={styles.selectableItemText}>
                        {account.name}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              {selectingField === "currency" &&
                currencies.map((currency) => (
                  <TouchableOpacity
                    key={currency}
                    style={styles.selectableItem}
                    onPress={() => handleCurrencySelect(currency)}
                  >
                    <Text style={styles.selectableItemText}>{currency}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 20,
    justifyContent: "space-between",
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
  },
  form: {
    flex: 1,
  },
  transactionTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  transactionTypeButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    alignItems: "center",
  },
  selectedTransactionTypeButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  selectedButtonText: {
    color: "#ffffff",
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateAndTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
    padding: 5,
  },

  selectButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  pickerButton: {
    paddingVertical: 10,
    borderWidth: 1,
    width: "50%",
    borderColor: COLORS.PRIMARY,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
    marginRight: 10,
  },
  pickerButtonText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  currencySelector: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  currencySelectorText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "red",
    marginRight: 50,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 5,
  },
  operationContainer: {
    // backgroundColor: "white",
    textAlign: "center",
    paddingLeft: 5,
    fontSize: 20,
    overflow: "hidden",
    color: "gray",
  },
  amountInput: {
    flex: 1,
    padding: 10,
    marginRight: 50,
    fontSize: 25,
    overflow: "scroll",
    // backgroundColor: "yellow",
  },
  deleteButton: {
    position: "absolute",
    right: 10,
  },

  splitTransactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    marginRight: 8,
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 4,
    padding: 8,
  },
  selectedToggleButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  toggleButtonText: {
    color: COLORS.PRIMARY,
  },
  selectedToggleButtonText: {
    color: "#fff",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  selectionModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: COLORS.PRIMARY,
    padding: 20,
  },
  selectableItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.PRIMARY,
  },
  selectableItemText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
});

export default AddTransactionDetails;
