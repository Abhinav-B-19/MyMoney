import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Account {
  id: string;
  name: string;
  balance: number;
  icon: string;
}

interface AccountCardProps {
  account: Account;
  onEditPress: (accountId: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onEditPress }) => {
  const { id, name, balance, icon } = account;

  return (
    <TouchableOpacity onPress={() => onEditPress(id)}>
      <View style={styles.accountItem}>
        <MaterialIcons name={icon} size={24} color="black" />
        <Text style={styles.accountName}>{name}</Text>
        <Text style={styles.accountBalance}>${balance}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  accountName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AccountCard;
