import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import carIcon from "../../assets/Category/car.png";
import entertainmentIcon from "../../assets/Category/entertainment.png";
import fitnessIcon from "../../assets/Category/fitness.png";
import foodIcon from "../../assets/Category/food.png";
import groceriesIcon from "../../assets/Category/groceries.png";
import medicalIcon from "../../assets/Category/medical.png";
import shoppingIcon from "../../assets/Category/shopping.png";
import travelIcon from "../../assets/Category/travel.png";
import emptyIcon from "../../assets/Category/empty.png";
import transferIcon from "../../assets/Category/transfer.png";
import updateTransactionData from "@/api/updateTransactionData";
import { COLORS } from "@/constants/colors";

interface TaskViewProps {
  userId: string;
  id: string;
  title: string;
  description: string;
  date: string;
  transactionAmount: number;
  currency: string;
  account: string;
  toAccount: string;
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
              toAccount: props.toAccount,
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

  const imageSource =
    props.transactionType === "Transfer"
      ? transferIcon
      : categoryImages[props.category] || emptyIcon;

  const amountSign =
    props.transactionType === "Expense"
      ? "-"
      : props.transactionType === "Income"
      ? "+"
      : "";

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Image
              source={imageSource}
              style={styles.image}
              accessibilityLabel={props.category}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleText} numberOfLines={2}>
              {props.title}
            </Text>
            {props.transactionType === "Income" ||
            props.transactionType === "Expense" ? (
              <View style={styles.accountContainer}>
                <Image
                  source={transferIcon}
                  style={styles.logoImage}
                  accessibilityLabel={
                    props.transactionType === "Income" ? "Income" : "Expense"
                  }
                />
                <Text style={styles.accountText}>{props.account}</Text>
              </View>
            ) : (
              <View style={styles.accountContainer}>
                <Image
                  source={transferIcon}
                  style={styles.logoImage}
                  accessibilityLabel="Transfer"
                />
                <Text style={styles.accountText}>
                  {props.account} → {props.toAccount}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.amountContainer}>
            <Text
              style={[
                styles.amountText,
                {
                  color:
                    props.transactionType === "Transfer"
                      ? COLORS.ACCENT
                      : props.transactionType === "Expense"
                      ? "#FF6347"
                      : "#32CD32",
                },
              ]}
            >
              {amountSign} {props.currency}
              {Math.abs(props.transactionAmount)}
            </Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={handleToggleSplitTransaction}
            >
              <View style={styles.toggleIcon}>
                {isSplitTransaction ? (
                  <FontAwesome name="group" size={20} color="#00008B" />
                ) : (
                  <FontAwesome5 name="user" size={20} color="#00008B" />
                )}
              </View>
            </TouchableOpacity>
          </View>
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
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  textContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  titleText: {
    fontSize: 16,
    marginBottom: 5,
  },
  accountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  accountText: {
    fontSize: 14,
    color: "#666",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  toggleButton: {
    marginLeft: 10,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ADD8E6",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TrackerView;
