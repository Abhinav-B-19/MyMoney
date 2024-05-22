import React, { useEffect, useState } from "react";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import deleteTransData from "@/api/deleteTransData";
import { COLORS } from "@/constants/colors";
import updateTransactionData from "@/api/updateTransactionData";

export interface EditTaskViewPopOverProps {
  userId: string;
  id: string;
  title: string;
  description: string;
  date: string;
  transactionAmount: number;
  currency: string;
  account: string;
  category: string;
  transactionType: string;
  isSplitTransaction: boolean; // New prop for indicating split transaction
  onClose: () => void; // Function to handle close action
  onEdit: () => void; // Function to handle edit action
  onDelete: () => void;
  onDeleteSuccess: () => void;
}

const EditTaskViewPopOver: React.FC<EditTaskViewPopOverProps> = (props) => {
  const navigation = useNavigation();
  const [isSplitTransaction, setIsSplitTransaction] = useState<boolean>(
    props.isSplitTransaction
  );

  const handleDelete = async () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete the transaction record?",
      [
        {
          text: "No",
          onPress: () => console.log("No Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            const response = await deleteTransData(
              "transactions",
              props.userId,
              props.id
            );
            if (response && response.status === 200) {
              console.log("Task deleted successfully.");
              props.onDeleteSuccess(); // Call the callback
            } else {
              console.error(
                "Failed to delete task:",
                response ? response.error : "Unknown error"
              );
              // Handle deletion failure, if needed
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate("AddTransactionDetails", {
      initialFormData: {
        userId: props.userId,
        id: props.id,
        title: props.title,
        description: props.description,
        date: props.date,
        transactionAmount: props.transactionAmount,
        transactionType: props.transactionType,
        currency: props.currency,
        account: props.account,
        category: props.category,
        isSplitTransaction: props.isSplitTransaction,
      },
    });
    props.onClose();
  };

  const toggleSplitTransaction = () => {
    setIsSplitTransaction(!isSplitTransaction);
  };

  const compareSplitTransaction = async () => {
    try {
      // Check if the initial isSplitTransaction prop and the toggled state are different
      const isDifferent = props.isSplitTransaction !== isSplitTransaction;

      if (isDifferent) {
        Alert.alert(
          "Change isSplitTransaction",
          "Are you sure you want to change the isSplitTransaction status?",
          [
            {
              text: "No",
              onPress: () => console.log("Cancelled"),
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: async () => {
                setIsSplitTransaction(!isSplitTransaction);
                const updatedFormData = {
                  id: props.id,
                  userId: props.userId,
                  title: props.title,
                  description: props.description,
                  date: props.date,
                  transactionAmount: props.transactionAmount,
                  transactionType: props.transactionType,
                  currency: props.currency,
                  account: props.account,
                  category: props.category,
                  isSplitTransaction: !isSplitTransaction, // Toggle the value
                };

                // Log the updated form data
                console.log(updatedFormData);

                // Update the transaction data via API
                const updateResponse = await updateTransactionData(
                  "transactions",
                  props.id,
                  updatedFormData
                );
                props.onClose();
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error occurred while updating transaction data:", error);
      // Handle the error accordingly, such as showing an error message to the user
    }
  };

  return (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <TouchableOpacity
          onPress={() => {
            // compareSplitTransaction();
            props.onClose();
          }}
          style={styles.closeButton}
          testID="closeButton"
        >
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.itemText} numberOfLines={2} testID="taskTitle">
            {props.title}
          </Text>
          <View style={styles.amountContainer}>
            <Text style={[styles.currency, { fontWeight: "bold" }]}>
              {props.currency}
            </Text>
            <Text
              style={[
                styles.amountText,
                {
                  color:
                    props.transactionType === "debit" ? "#FF6347" : "#32CD32",
                },
              ]}
            >
              {props.transactionType === "debit" ? "-" : "+"}
              {Math.abs(props.transactionAmount)}
            </Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <View style={styles.iconButton}>
            <IconButton
              icon="pencil"
              size={18} // Decreased icon size
              onPress={handleEdit}
              testID="editButton"
            />
          </View>
          <View style={styles.iconButton}>
            <IconButton
              icon="trash-can"
              size={18} // Decreased icon size
              onPress={handleDelete}
              testID="deleteButton"
            />
          </View>
        </View>
      </View>
      <ScrollView style={styles.expandedView}>
        <Text style={styles.additionalContent}>
          Transaction Type: {props.transactionType}
        </Text>
        <Text style={styles.additionalContent}>Account: {props.account}</Text>
        <Text style={styles.additionalContent}>Category: {props.category}</Text>
        <Text style={styles.additionalContent}>
          Description: {props.description}
        </Text>
      </ScrollView>

      {/* Button indicating isSplitTransaction status */}
      {/* <TouchableOpacity
          style={[
            styles.splitTransactionButton,
            {
              backgroundColor: isSplitTransaction
                ? COLORS.PRIMARY
                : COLORS.SECONDARY,
            },
          ]}
          onPress={toggleSplitTransaction}
        >
          <Text style={styles.splitTransactionButtonText}>
            {isSplitTransaction ? "Split Transaction" : "Single Transaction"}
          </Text>
        </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: "#E6E6E6",
    padding: 10,
    borderRadius: 50,
  },
  buttonText: {
    color: "#333333",
    fontWeight: "bold",
    fontSize: 16,
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    marginLeft: 40,
    marginTop: 5, // Adjusted margin to push title slightly below
  },
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currency: {
    fontSize: 14,
    marginRight: 10, // Increased marginRight for more space
    color: "#666",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    // backgroundColor: "#E6E6E6",
    borderRadius: 10,
  },
  expandedView: {
    marginTop: 10,
  },
  additionalContent: {
    marginTop: 10,
    fontSize: 16,
    color: "#333333",
  },
  splitTransactionButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  splitTransactionButtonText: {
    color: COLORS.WHITE,
    fontWeight: "bold",
  },
});

export default EditTaskViewPopOver;
