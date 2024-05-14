import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
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
  const { authUser, setAuthUser } = useAuth();
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
    ...mergedInitialFormData, // Use mergedInitialFormData
  });

  // useEffect(() => {
  //   console.log("Initial Form Data:", initialFormData);
  //   console.log("Merged Form Data:", mergedInitialFormData);
  // }, []);

  // useEffect(() => {
  //   console.log("isDataPassed: ", isDataPassed);
  //   console.log("mergedInitialFormData: ", mergedInitialFormData);
  // }, [initialFormData]);

  useEffect(() => {
    // Check if transactionType, account, title, and amount are not empty
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
    // Check if the form data has been modified
    const isModified =
      JSON.stringify(formData) !== JSON.stringify(defaultFormData);
    setIsDataModified(isModified);
  }, [formData]);

  // useEffect(() => {
  //   console.log("Form Data Updated:", formData); // Log whenever formData changes
  // }, [formData]);

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
    console.log("showDatePicker");
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    handleChange("date", date);
    hideDatePicker();
  };

  // const handleChange = (name: string, value: string) => {
  //   setFormData({ ...formData, [name]: value });
  // };
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
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Convert transactionType to appropriate values
    const transactionType =
      formData.transactionType === "credit" ? "credit" : "debit";

    // Create a new formData object with updated transactionType
    const updatedFormData = { ...formData, transactionType };

    console.log("Form data:", updatedFormData);

    try {
      const response = await postNewData(updatedFormData);
      console.log(response);
      handleBack();
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setIsLoading(false); // Set loading to false when submit ends (success or failure)
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Convert transactionType to appropriate values
      const transactionType =
        formData.transactionType === "credit" ? "credit" : "debit";

      // Create a new formData object with updated transactionType
      const updatedFormData = { ...formData, transactionType };

      // Extract the ID of the transaction
      const id = updatedFormData.id;

      console.log("Form data in save:", id);

      // Call updateTransactionData with the ID and updated data
      const updateResponse = await updateTransactionData(id, updatedFormData);
      console.log(updateResponse);

      handleBack(); // Navigate back after saving
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsLoading(false); // Set loading to false when submit ends (success or failure)
    }
  };

  const handleBack = () => {
    navigation.goBack();
    // if (isDataModified) {
    //   Alert.alert(
    //     "Unsaved Changes",
    //     "Do you want to discard the changes and go back?",
    //     [
    //       {
    //         text: "No",
    //         style: "cancel",
    //       },
    //       {
    //         text: "Yes",
    //         onPress: () => navigation.goBack(),
    //       },
    //     ]
    //   );
    // } else {
    //   navigation.goBack();
    // }
  };

  const handleCategorySelect = (category: string) => {
    setFormData({ ...formData, category });
    setIsSelectingVisible(false);
  };

  const handleAccountSelect = (account: string) => {
    setFormData({ ...formData, account });
    setIsSelectingVisible(false);
  };

  // const handleTransactionTypeSelect = (transactionType: string) => {
  //   setFormData({ ...formData, transactionType });
  // };
  const handleTransactionTypeSelect = (transactionType: string) => {
    setFormData({ ...formData, transactionType });
  };

  const handleToggleSplitTransaction = () => {
    setFormData({
      ...formData,
      isSplitTransaction: !formData.isSplitTransaction,
    });
  };

  return (
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
        <View style={styles.dateInputContainer}>
          <TextInput
            style={styles.dateInput}
            placeholder="Date"
            onChangeText={(text) => handleChange("date", text)}
            value={formatDate(formData.date)}
            editable={false} // Disable editing
          />
          <TouchableOpacity
            style={styles.calendarIcon}
            onPress={showDatePicker}
          >
            <MaterialCommunityIcons
              name="calendar"
              size={24}
              color={COLORS.PRIMARY}
            />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </TouchableOpacity>
        </View>
        {/* <TextInput
          style={styles.input}
          placeholder="Transaction Amount"
          onChangeText={(text) => handleChange("transactionAmount", text)}
        /> */}
        {/* <TextInput
          style={styles.input}
          placeholder="Transaction Amount"
          onChangeText={(text) => handleChange("transactionAmount", text)}
          value={formData.transactionAmount.toString()}
        />

        <TextInput
          style={styles.input}
          placeholder="Currency"
          onChangeText={(text) => handleChange("currency", text)}
          value={formData.currency}
        /> */}
        <View style={styles.currencyContainer}>
          <TextInput
            style={[styles.input, styles.currencyInput]}
            placeholder="Currency"
            editable={false}
            onChangeText={(text) => handleChange("currency", text)}
            value={formData.currency}
          />
          <TextInput
            style={[styles.input, styles.amountInput]}
            placeholder="Transaction Amount"
            onChangeText={(text) => handleChange("transactionAmount", text)}
            value={formData.transactionAmount.toString()}
          />
        </View>
      </View>

      {isSelectingVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectingField === "category"
              ? categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.modalOption}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text style={styles.modalOptionText}>{category}</Text>
                  </TouchableOpacity>
                ))
              : accounts.map((account, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.modalOption}
                    onPress={() => handleAccountSelect(account)}
                  >
                    <Text style={styles.modalOptionText}>{account}</Text>
                  </TouchableOpacity>
                ))}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.toggleButton,
          formData.isSplitTransaction && styles.selectedButton,
        ]}
        onPress={handleToggleSplitTransaction}
      >
        <Text style={styles.buttonText}>
          Split Transaction: {formData.isSplitTransaction ? "Yes" : "No"}
        </Text>
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      ) : isDataPassed ? (
        <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.submitButton,
            submitDisabled && styles.disabledButton, // Apply styles for disabled button
          ]}
          onPress={submitDisabled ? null : handleSubmit}
          disabled={submitDisabled}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center content horizontally
    paddingHorizontal: 20,
    paddingTop: 40,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    position: "absolute",
    left: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    color: COLORS.PRIMARY,
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 100, // Adjust the marginTop as needed
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  // transactionTypeButton: {
  //   padding: 10,
  //   borderRadius: 5,
  //   alignItems: "center",
  //   width: "30%",
  //   borderWidth: 1,
  //   borderColor: COLORS.SECONDARY,
  // },
  transactionTypeButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "30%",
  },

  selectedTransactionTypeButton: {
    backgroundColor: COLORS.ACCENT,
  },

  // buttonText: {
  //   fontSize: 16,
  //   color: COLORS.SECONDARY, // Default text color
  // },

  selectedButtonText: {
    color: COLORS.WHITE, // Text color for selected button
  },

  input: {
    height: 40,
    borderColor: COLORS.PRIMARY,
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  transactionTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  selectedButton: {
    backgroundColor: COLORS.ACCENT,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
  },
  selectButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  toggleButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: 10,
    width: "50%",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
  },
  submitButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "50%",
    marginTop: 20,
    alignSelf: "center", // Align the button to the center horizontally
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999, // Set a high z-index value
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignSelf: "center",
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  modalOptionText: {
    fontSize: 16,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.PRIMARY,
    marginBottom: 10,
  },
  dateInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: COLORS.BLACK,
  },
  calendarIcon: {
    padding: 10,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  currencyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  currencyInput: {
    width: "25%",
  },
  amountInput: {
    width: "70%",
  },
});

export default AddTransactionDetails;
