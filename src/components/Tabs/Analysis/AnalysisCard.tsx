import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import carIcon from "../../../../assets/Category/car.png";
import entertainmentIcon from "../../../../assets/Category/entertainment.png";
import fitnessIcon from "../../../../assets/Category/fitness.png";
import foodIcon from "../../../../assets/Category/food.png";
import groceriesIcon from "../../../../assets/Category/groceries.png";
import medicalIcon from "../../../../assets/Category/medical.png";
import shoppingIcon from "../../../../assets/Category/shopping.png";
import travelIcon from "../../../../assets/Category/travel.png";
import emptyIcon from "../../../../assets/Category/empty.png";
import transferIcon from "../../../../assets/Category/transfer.png";
import { COLORS } from "@/constants/colors";
import * as Progress from "react-native-progress";

interface AnalysisCardProps {
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
  percentage: number;
  isFirstCard?: boolean;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  title,
  description,
  date,
  transactionAmount,
  currency,
  account,
  toAccount,
  category,
  transactionType,
  isSplitTransaction,
  percentage,
  isFirstCard,
}) => {
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

  const imageSource =
    transactionType === "Transfer"
      ? transferIcon
      : categoryImages[category] || emptyIcon;

  const amountSign =
    transactionType === "Expense"
      ? "-"
      : transactionType === "Income"
      ? "+"
      : "";

  return (
    <View style={[styles.container, isFirstCard && styles.firstCardContainer]}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Image
            source={imageSource}
            style={styles.image}
            accessibilityLabel={category}
          />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{category}</Text>
            <Text
              style={[
                styles.amountText,
                {
                  color:
                    transactionType === "Expense"
                      ? COLORS.EXPENSE_COLOR
                      : transactionType === "Income"
                      ? COLORS.INCOME_COLOR
                      : COLORS.TRANSFER_COLOR,
                },
              ]}
            >
              {amountSign} {currency}
              {Math.abs(transactionAmount)}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <Progress.Bar
              progress={percentage / 100}
              width={200}
              animated={true}
            />
            <Text style={styles.percentageText}>{percentage}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  firstCardContainer: {
    marginTop: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  amountText: {
    fontSize: 16,
    right: 50,
    fontWeight: "bold",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  percentageText: {
    fontSize: 16,
    color: COLORS.ACCENT,
    fontWeight: "bold",
  },
});

export default AnalysisCard;
