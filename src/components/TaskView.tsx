import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";

interface TaskViewProps {
  text: string;
  description: string;
  imageUri: string;
  amount: number;
  transactionType: string;
}

const TrackerView: React.FC<TaskViewProps> = (props) => {
  const amountColor = props.transactionType === "credit" ? "green" : "red";

  return (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <View style={styles.circle}>
          <Image source={{ uri: props.imageUri }} style={styles.image} />
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
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TrackerView;
