import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
// Import the images statically
import carIcon from "../../assets/Category/car.png";
import entertainmentIcon from "../../assets/Category/entertainment.png";
import fitnessIcon from "../../assets/Category/fitness.png";
import foodIcon from "../../assets/Category/food.png";
import groceriesIcon from "../../assets/Category/groceries.png";
import medicalIcon from "../../assets/Category/medical.png";
import shoppingIcon from "../../assets/Category/shopping.png";
import travelIcon from "../../assets/Category/travel.png";

interface TaskViewProps {
  text: string;
  category: string;
  description: string;
  amount: number;
  transactionType: string;
  id: string;
  userId: string;
  title: string;
  date: string;
  transactionAmount: number;
  currency: string;
  account: string;
  isSplitTransaction: boolean;
  onPress?: () => void;
}

const TrackerView: React.FC<TaskViewProps> = ({ onPress, ...props }) => {
  const amountColor = props.transactionType === "credit" ? "green" : "red";
  // useEffect(() => {
  //   console.log(props.title, props.category);
  // }, [props.category]);

  // Map category names to their corresponding imported images
  const categoryImages = {
    food: foodIcon,
    groceries: groceriesIcon,
    travel: travelIcon,
    car: carIcon,
    entertainment: entertainmentIcon,
    fitness: fitnessIcon,
    medical: medicalIcon,
    shopping: shoppingIcon,
    room: require("../../assets/Category/empty.png"),
    utilities: require("../../assets/Category/empty.png"),
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <View style={styles.circle}>
            {/* Use the mapped image based on the category */}
            <Image
              source={categoryImages[props.category]}
              style={styles.image}
              accessibilityLabel={props.category} // Set accessibilityLabel to the category
              defaultSource={require("../../assets/Category/empty.png")}
            />
            {/* <Image
              source={carIcon}
              style={styles.image}
              accessibilityLabel="car" // Set accessibilityLabel to the appropriate label
              defaultSource={require("../../assets/Category/empty.png")}
            /> */}
          </View>
          <Text style={styles.itemText} numberOfLines={2}>
            {props.text}
          </Text>
          <Text style={[styles.amountText, { color: amountColor }]}>
            {props.transactionType === "debit" ? "-" : "+"}
            {Math.abs(props.amount)}
          </Text>
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
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: {
    width: "60%",
    fontSize: 16,
    marginLeft: 10,
  },
  expandedView: {
    marginTop: 10,
  },
  additionalContent: {
    fontSize: 14,
    color: "#666",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TrackerView;
