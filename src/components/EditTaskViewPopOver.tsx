import React from "react";
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

export interface EditTaskViewPopOverProps {
  userId: string;
  id: string;
  title: string;
  description: string;
  date: string;
  transactionAmount: number;
  account: string;
  category: string;
  transactionType: string;
  onClose: () => void; // Function to handle close action
  onEdit: () => void; // Function to handle edit action
  onDelete: () => void;
  onDeleteSuccess: () => void;
}

const EditTaskViewPopOver: React.FC<EditTaskViewPopOverProps> = (props) => {
  const navigation = useNavigation();
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
            const response = await deleteTransData(props.userId, props.id);
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

  const deleteApi = async () => {
    console.log("in delete api");
    try {
      const response = await deleteTransData(props.userId, props.id);
      if (response && response.status === 200) {
        console.log("Task deleted successfully.");
        // Additional actions after successful deletion, if needed
      } else {
        console.error(
          "Failed to delete task:",
          response ? response.error : "Unknown error"
        );
        // Handle deletion failure, if needed
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      // Handle error, if needed
    }
  };

  const handleEdit = () => {
    console.log(props.id, props.userId);
    navigation.navigate("AddTransactionDetails", {
      initialFormData: {
        title: props.title,
        description: props.description,
        date: props.date,
        transactionAmount: props.transactionAmount,
        transactionType: props.transactionType,
        currency: "\u20B9",
        account: props.account,
        category: props.category,
        // isSplitTransaction: props.,
      },
    });
  };

  return (
    <TouchableOpacity style={styles.touchable} testID="touchable">
      <View style={styles.item}>
        <TouchableOpacity
          onPress={props.onClose}
          style={styles.closeButton}
          testID="closeButton"
        >
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
        <View style={styles.itemContent}>
          <View style={styles.iconContainer}>
            <View style={styles.iconButton}>
              <IconButton
                icon="pencil"
                size={20}
                onPress={handleEdit}
                testID="editButton"
              />
            </View>
            <View style={styles.iconButton}>
              <IconButton
                icon="trash-can"
                size={20}
                onPress={handleDelete}
                testID="deleteButton"
              />
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.itemText} numberOfLines={2} testID="taskTitle">
              {props.title}
            </Text>
          </View>
        </View>
        <ScrollView style={styles.expandedView}>
          <Text style={styles.additionalContent}>
            Transaction Type: {props.transactionType}
          </Text>
          <Text style={styles.additionalContent}>
            {props.transactionType === "income" ? "+" : "-"}{" "}
            {props.transactionAmount}
          </Text>

          <Text style={styles.additionalContent}>Account: {props.account}</Text>
          <Text style={styles.additionalContent}>
            Category: {props.category}
          </Text>
          <Text style={styles.additionalContent}>
            Description: {props.description}
          </Text>
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: "70%",
    opacity: 1,
  },
  item: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
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
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "#ffffff",
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconButton: {
    backgroundColor: "#ffffff",
    marginLeft: 10,
  },
  expandedView: {
    maxHeight: 200,
    marginTop: 10,
  },
  additionalContent: {
    marginTop: 5,
    fontSize: 14,
    color: "#666666",
  },
});

export default EditTaskViewPopOver;
