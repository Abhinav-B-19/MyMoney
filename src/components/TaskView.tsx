import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"; // Import the required icons
import carIcon from "../../assets/Category/car.png";
import entertainmentIcon from "../../assets/Category/entertainment.png";
import fitnessIcon from "../../assets/Category/fitness.png";
import foodIcon from "../../assets/Category/food.png";
import groceriesIcon from "../../assets/Category/groceries.png";
import medicalIcon from "../../assets/Category/medical.png";
import shoppingIcon from "../../assets/Category/shopping.png";
import travelIcon from "../../assets/Category/travel.png";
import emptyIcon from "../../assets/Category/empty.png";
import updateTransactionData from "@/api/updateTransactionData";

interface TaskViewProps {
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
  isSplitTransaction: boolean;
  onPress?: () => void;
}

const TrackerView: React.FC<TaskViewProps> = ({ onPress, ...props }) => {
  const [isSplitTransaction, setIsSplitTransaction] = useState<boolean>(
    props.isSplitTransaction
  );

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

  const handleToggleSplitTransaction = () => {
    Alert.alert(
      "Change Transaction Type",
      "Are you sure you want to change the transaction type?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
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
              isSplitTransaction: !isSplitTransaction,
            };

            const updateResponse = await updateTransactionData(
              "transactions",
              props.id,
              updatedFormData
            );
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <View style={styles.circle}>
            <Image
              source={categoryImages[props.category] || emptyIcon}
              style={styles.image}
              accessibilityLabel={props.category}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.itemText} numberOfLines={2}>
              {props.title}
            </Text>
            <View style={styles.amountContainer}>
              <Text
                style={[
                  styles.amountText,
                  {
                    color:
                      props.transactionType === "Expense"
                        ? "#FF6347"
                        : "#32CD32",
                  },
                ]}
              >
                {props.transactionType === "Expense" ? "-" : "+"}{" "}
                {props.currency} {Math.abs(props.transactionAmount)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleToggleSplitTransaction}
          >
            <View style={styles.iconBackground}>
              {isSplitTransaction ? (
                <FontAwesome name="group" size={20} color="#00008B" />
              ) : (
                <FontAwesome5 name="user" size={20} color="#00008B" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 10,
    position: "relative",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 15,
  },
  currency: {
    fontSize: 14,
    marginRight: 10,
    fontWeight: "bold",
    color: "#666",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  iconButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }], // Center the icon container
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ADD8E6",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TrackerView;
