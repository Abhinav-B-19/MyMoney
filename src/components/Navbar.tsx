import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { auth } from "@/firebase/firebase";

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const navigation = useNavigation();

  const goToProfile = () => {
    navigation.navigate("ProfileScreen");
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
        <IconButton icon="account-circle" onPress={goToProfile} />
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
