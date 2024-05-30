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
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { currencies } from "@/constants/currencies";
import { useUserContext } from "@/context/UserContext";

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
    toAccount?: string;
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

  const { userCurrency } = useUserContext();

  const [dontAskAgain, setDontAskAgain] = useState(false);

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
    toAccount: "",
    category: "",
    isSplitTransaction: false,
  };

  const [formData, setFormData] = useState({
    ...defaultFormData,
    ...mergedInitialFormData,
  });

  useEffect(() => {
    const loadDontAskAgainPreference = async () => {
      try {
        const value = await AsyncStorage.getItem("@dontAskAgain");
        if (value !== null) {
          setDontAskAgain(JSON.parse(value));
        }
      } catch (error) {
        console.error("Error loading 'Don't Ask Again' preference:", error);
      }
    };

    loadDontAskAgainPreference();
  }, []);

  useEffect(() => {
    const { transactionType, account, toAccount, title, transactionAmount } =
      formData;
    let disabled = false;

    if (transactionType === "Transfer") {
      disabled = !(
        transactionType &&
        account &&
        toAccount &&
        title &&
        transactionAmount
      );
    } else {
      disabled = !(transactionType && account && title && transactionAmount);
    }

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
    try {
      if (isNaN(formData.transactionAmount)) {
        // handleEqualPress();
        Alert.alert(
          "Invalid Transaction Amount",
          "Please calculate the amount before continuing.",
          [{ text: "OK" }]
        );
      } else {
        const updatedFormData = { ...formData };
        await postNewData("transactions", updatedFormData);
        handleBack();
      }
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      if (isNaN(formData.transactionAmount)) {
        // handleEqualPress();
        Alert.alert(
          "Invalid Transaction Amount",
          "Please calculate the amount before continuing.",
          [{ text: "OK" }]
        );
      } else {
        const updatedFormData = { ...formData };
        const id = updatedFormData.id;

        await updateTransactionData("transactions", id, updatedFormData);
        handleBack();
      }
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

  const handleAccountSelect = (account: string, field: string) => {
    Keyboard.dismiss(); // Dismiss the keyboard
    if (field === "account") {
      setFormData({ ...formData, account: account });
    } else if (field === "toAccount") {
      setFormData({ ...formData, toAccount: account });
    }
    setIsSelectingVisible(false);
  };

  const handleTransactionTypeSelect = (transactionType: string) => {
    console.log(transactionType);
    setFormData({ ...formData, transactionType });
  };

  const handleToggleSplitTransaction = () => {
    setFormData({
      ...formData,
      isSplitTransaction: !formData.isSplitTransaction,
    });
  };

  const handleCurrencySelect = async (currency: string) => {
    if (dontAskAgain || currency === userCurrency) {
      setFormData({ ...formData, currency });
      setIsSelectingVisible(false);
    } else {
      Alert.alert(
        "Currency Mismatch",
        `The selected currency (${currency}) is different from your default currency (${userCurrency}). Do you want to continue?`,
        [
          {
            text: "Cancel",
            onPress: () => setIsSelectingVisible(false),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              setFormData({ ...formData, currency });
              setIsSelectingVisible(false);
            },
          },
          {
            text: "Don't Ask Again",
            onPress: async () => {
              try {
                await AsyncStorage.setItem(
                  "@dontAskAgain",
                  JSON.stringify(true)
                );
                setDontAskAgain(true);
              } catch (error) {
                console.error(
                  "Error saving 'Don't Ask Again' preference:",
                  error
                );
              }
              setFormData({ ...formData, currency });
              setIsSelectingVisible(false);
            },
          },
        ]
      );
    }
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
    setCalculatorInput((prevInput) => prevInput + operator);
    setoperationInput(calculatorInput + operator);
    handleChange("transactionAmount", calculatorInput + operator);
  };

  const handleEqualPress = () => {
    try {
      // Evaluate the calculator input and update the form data
      const result = eval(calculatorInput).toString();
      setCalculatorInput(result);
      handleChange("transactionAmount", result);
    } catch (error) {
      console.error("Error evaluating input:", error);
    }
  };

  const handleDeleteLast = () => {
    setCalculatorInput((prevInput) => prevInput.slice(0, -1));
    handleChange("transactionAmount", calculatorInput.slice(0, -1));
  };

  const handleDontAskAgainReset = async () => {
    try {
      await AsyncStorage.removeItem("@dontAskAgain");
      setDontAskAgain(false);
    } catch (error) {
      console.error("Error resetting 'Don't Ask Again' preference:", error);
    }
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
                formData.transactionType === "Transfer" &&
                  styles.selectedTransactionTypeButton,
              ]}
              onPress={() => handleTransactionTypeSelect("Transfer")}
            >
              <Text
                style={[
                  styles.buttonText,
                  formData.transactionType === "Transfer" &&
                    styles.selectedButtonText,
                ]}
              >
                Transfer
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.selectContainer}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {formData.transactionType === "Transfer"
                  ? "From Account"
                  : "Account"}
              </Text>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  formData.account && styles.selectedButton,
                ]}
                onPress={() => {
                  setSelectingField("account");
                  setIsSelectingVisible(true);
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    formData.account && styles.selectedButtonText,
                  ]}
                >
                  {(formData.account || "Select1Account").toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>

            {formData.transactionType !== "Transfer" && (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Category</Text>
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    formData.category && styles.selectedButton,
                  ]}
                  onPress={() => {
                    setSelectingField("category");
                    setIsSelectingVisible(true);
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      formData.category && styles.selectedButtonText,
                    ]}
                  >
                    {(formData.category || "Select Category").toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {formData.transactionType === "Transfer" && (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>To Account</Text>
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    formData.toAccount && styles.selectedButton,
                  ]}
                  onPress={() => {
                    setSelectingField("toAccount");
                    setIsSelectingVisible(true);
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      formData.toAccount && styles.selectedButtonText,
                    ]}
                  >
                    {(formData.toAccount || "Select2Account").toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Title"
            onChangeText={(text) => handleChange("title", text)}
            value={formData.title}
            onSubmitEditing={() => Keyboard.dismiss()}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={(text) => handleChange("description", text)}
            value={formData.description}
            onSubmitEditing={() => Keyboard.dismiss()}
            autoCapitalize="words"
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
            <View style={styles.resetContainer}>
              <TouchableOpacity
                style={[
                  styles.resetButton,
                  !dontAskAgain && styles.resetButtonDisabled,
                ]}
                onPress={handleDontAskAgainReset}
                disabled={!dontAskAgain}
              >
                <Text style={styles.resetButtonText}>
                  Reset "Don't Ask Again"
                </Text>
              </TouchableOpacity>
            </View>
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
                {formatTime(formData.time)}
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
                contextAccounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={styles.selectableItem}
                    onPress={() => handleAccountSelect(account.name, "account")}
                  >
                    <Text style={styles.selectableItemText}>
                      {account.name}
                    </Text>
                  </TouchableOpacity>
                ))}

              {selectingField === "toAccount" &&
                contextAccounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={styles.selectableItem}
                    onPress={() =>
                      handleAccountSelect(account.name, "toAccount")
                    }
                  >
                    <Text style={styles.selectableItemText}>
                      {account.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              {selectingField === "currency" &&
                currencies.map((currency) => (
                  <TouchableOpacity
                    key={currency.value}
                    style={styles.selectableItem}
                    onPress={() => handleCurrencySelect(currency.symbol)}
                  >
                    <Text style={styles.selectableItemText}>
                      {currency.label} ({currency.symbol})
                    </Text>
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
    marginBottom: 15,
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
    marginBottom: 15,
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
    fontSize: 14,
    color: COLORS.PRIMARY,
  },
  selectedButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  selectedButtonText: {
    color: "#ffffff",
  },
  // selectContainer: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginBottom: 15,
  //   backgroundColor: "gray",
  // },
  dateAndTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 15,
    padding: 5,
  },

  // fieldContainer: {
  //   flex: 1,
  //   justifyContent: "space-evenly",
  //   height: 60,
  //   alignItems: "center",
  // },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  fieldContainer: {
    flex: 1,
    alignItems: "center",
  },
  selectButton: {
    flexGrow: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  pickerButton: {
    paddingVertical: 10,
    borderWidth: 1,
    width: "50%",
    borderColor: COLORS.PRIMARY,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
    marginRight: 10,
  },
  pickerButtonText: {
    fontSize: 13,
    padding: 1,
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
    paddingBottom: 5,
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
  resetContainer: {
    alignItems: "center",
    paddingLeft: 10,
  },
  resetButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: 10,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 16,
    color: COLORS.WHITE,
  },
  resetButtonDisabled: {
    backgroundColor: "gray",
  },
});

export default AddTransactionDetails;
