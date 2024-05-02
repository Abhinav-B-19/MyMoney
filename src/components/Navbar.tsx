import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { IconButton } from "react-native-paper";
import { auth, db } from "@/firebase/firebase";

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const handleSignout = async () => {
    await auth.signOut();
  };
  const Modal = () => {
    Alert.alert("Auth App", "Do you really want to logout", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
      },
      { text: "Logout", onPress: handleSignout },
    ]);
  };
  return (
    <View style={styles.navbar}>
      <View style={styles.leftButtons}>
        <IconButton
          icon="menu"
          onPress={() => {
            // Handle menu button press
            console.log("Navbar clicked");
          }}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightButtons}>
        <IconButton icon="account-circle" onPress={Modal} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 30,
  },
  leftButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 30,
  },
});

export default Navbar;
