import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import postNewData from "@/api/postNewData";

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
  // const { authUser, setAuthUser } = useAuth();

  const [formData, setFormData] = useState({
    // userId: authUser,
    title: "",
    description: "",
    date: new Date().toISOString(),
    transactionAmount: "",
    transactionType: "expense",
    currency: "\u20B9",
    account: "",
    category: "",
    isSplitTransaction: false,
    ...initialFormData, // Merge with default values if provided
  });

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
  const [selectingField, setSelectingField] = useState(""); // Track which field is being selected
  const [isSelectingVisible, setIsSelectingVisible] = useState(false); // Track whether the selection options are visible
  const navigation = useNavigation();

  const handleChange = (name: string, value: string) => {
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
    console.log("Form data:", formData);

    try {
      const response = await postNewData(formData);
      console.log(response);

      // Implement logic to handle successful submission
      // For example, navigate to another screen
      // navigation.navigate("SuccessScreen");
      handleBack();
    } catch (error) {
      console.error("Error posting data:", error);
      // Implement logic to handle errors
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCategorySelect = (category: string) => {
    setFormData({ ...formData, category });
    setIsSelectingVisible(false); // Close the selection options
  };

  const handleAccountSelect = (account: string) => {
    setFormData({ ...formData, account });
    setIsSelectingVisible(false); // Close the selection options
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Transaction Details</Text>
      <View style={styles.form}>
        <View style={styles.transactionTypeContainer}>
          <TouchableOpacity
            style={[
              styles.transactionTypeButton,
              formData.transactionType === "income" && styles.selectedButton,
            ]}
            onPress={() => handleTransactionTypeSelect("income")}
          >
            <Text style={styles.buttonText}>Income</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.transactionTypeButton,
              formData.transactionType === "expense" && styles.selectedButton,
            ]}
            onPress={() => handleTransactionTypeSelect("expense")}
          >
            <Text style={styles.buttonText}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.transactionTypeButton,
              formData.transactionType === "transfer" && styles.selectedButton,
            ]}
            onPress={() => handleTransactionTypeSelect("transfer")}
          >
            <Text style={styles.buttonText}>Transfer</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selectContainer}>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              setSelectingField("category"); // Update selectingField state to "category"
              setIsSelectingVisible(true); // Open the selection options
            }}
          >
            <Text style={styles.buttonText}>
              {formData.category || "Select Category"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              setSelectingField("account"); // Update selectingField state to "account"
              setIsSelectingVisible(true); // Open the selection options
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
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          onChangeText={(text) => handleChange("description", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Date"
          onChangeText={(text) => handleChange("date", text)}
          value={formatDate(formData.date)}
        />
        <TextInput
          style={styles.input}
          placeholder="Transaction Amount"
          onChangeText={(text) => handleChange("transactionAmount", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Currency"
          onChangeText={(text) => handleChange("currency", text)}
          value={formData.currency}
        />
      </View>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {isSelectingVisible && ( // Only render selection options if isSelectingVisible is true
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectingField === "category"
              ? // Render category options if selectingField is "category"
                categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.modalOption}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text style={styles.modalOptionText}>{category}</Text>
                  </TouchableOpacity>
                ))
              : // Render account options if selectingField is "account"
                accounts.map((account, index) => (
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
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  form: {
    width: "80%",
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  transactionTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  transactionTypeButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "30%",
  },
  selectedButton: {
    backgroundColor: "green",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  selectButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  toggleButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    // width: "100%",
  },
  submitButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "blue",
  },
  modalContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignSelf: "center", // Center the modal horizontally
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  modalOptionText: {
    fontSize: 16,
  },
});

export default AddTransactionDetails;
