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
  const [isLoading, setIsLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [isDataModified, setIsDataModified] = useState(false);

  const defaultFormData = {
    userId: authUser,
    title: "",
    description: "",
    date: new Date().toISOString(),
    transactionAmount: "",
    transactionType: "debit",
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
  }, [formData]);

  const [categories, setCategories] = useState<string[]>([
    "car",
    "fitness",
    "entertainment",
    "food",
    "groceries",
    "medical",
    "shopping",
    "travel",
  ]);
  const [accounts, setAccounts] = useState<string[]>([
    "DEBIT CARD",
    "CASH",
    "SBI",
    "AXIS",
  ]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    handleChange("date", date);
    hideDatePicker();
  };

  const handleChange = (name: string, value: string | number | Date) => {
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async () => {
    setIsLoading(true);
    const transactionType =
      formData.transactionType === "credit" ? "credit" : "debit";

    const updatedFormData = { ...formData, transactionType };

    try {
      await postNewData(updatedFormData);
      handleBack();
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const transactionType =
        formData.transactionType === "credit" ? "credit" : "debit";

      const updatedFormData = { ...formData, transactionType };
      const id = updatedFormData.id;

      await updateTransactionData(id, updatedFormData);
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
    setFormData({ ...formData, category });
    setIsSelectingVisible(false);
  };

  const handleAccountSelect = (account: string) => {
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

  const currencies = ["₹", "$", "€", "£", "¥"]; // Add any other currencies you need

  const handleCurrencySelect = (currency: string) => {
    setFormData({ ...formData, currency });
    setIsSelectingVisible(false);
  };

  const handleOutsidePress = () => {
    if (isSelectingVisible) {
      setIsSelectingVisible(false);
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
        </View>
        <View style={styles.form}>
          <View style={styles.transactionTypeContainer}>
            <TouchableOpacity
              style={[
                styles.transactionTypeButton,
                formData.transactionType === "credit" &&
                  styles.selectedTransactionTypeButton,
              ]}
              onPress={() => handleTransactionTypeSelect("credit")}
            >
              <Text
                style={[
                  styles.buttonText,
                  formData.transactionType === "credit" &&
                    styles.selectedButtonText,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.transactionTypeButton,
                formData.transactionType === "debit" &&
                  styles.selectedTransactionTypeButton,
              ]}
              onPress={() => handleTransactionTypeSelect("debit")}
            >
              <Text
                style={[
                  styles.buttonText,
                  formData.transactionType === "debit" &&
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
                {formData.category || "Select Category"}
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
                {formData.account || "Select Account"}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Title"
            onChangeText={(text) => handleChange("title", text)}
            value={formData.title}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={(text) => handleChange("description", text)}
            value={formData.description}
          />
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={showDatePicker}
          >
            <Text style={styles.datePickerButtonText}>
              {formatDate(formData.date)}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
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
            <TextInput
              style={styles.amountInput}
              placeholder="Amount"
              keyboardType="numeric"
              onChangeText={(text) => handleChange("transactionAmount", text)}
              value={formData.transactionAmount}
            />
          </View>

          {/* <TouchableOpacity
            style={styles.splitTransactionToggle}
            onPress={handleToggleSplitTransaction}
          >
            <Text style={styles.splitTransactionToggleText}>
              {formData.isSplitTransaction
                ? "Split Transaction: Yes"
                : "Split Transaction: No"}
            </Text>
          </TouchableOpacity> */}
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

          {isDataPassed && (
            <TouchableOpacity
              style={[styles.button, submitDisabled && styles.disabledButton]}
              onPress={handleSave}
              disabled={submitDisabled}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.selectedButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          )}
          {!isDataPassed && (
            <TouchableOpacity
              style={[styles.button, submitDisabled && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={submitDisabled}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.selectedButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {isSelectingVisible && (
          <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.selectionModal}>
              {selectingField === "category" &&
                categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={styles.selectableItem}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text style={styles.selectableItemText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              {selectingField === "account" &&
                accounts.map((account) => (
                  <TouchableOpacity
                    key={account}
                    style={styles.selectableItem}
                    onPress={() => handleAccountSelect(account)}
                  >
                    <Text style={styles.selectableItemText}>{account}</Text>
                  </TouchableOpacity>
                ))}
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
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
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
  datePickerButton: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 5,
    padding: 10,
  },
  splitTransactionToggle: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  splitTransactionToggleText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
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
    paddingVertical: 15,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
    alignItems: "center",
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
