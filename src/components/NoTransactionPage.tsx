import React from "react";
import { View, Image, StyleSheet } from "react-native";

const NoTransactionPage = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/NoTransaction.png")} // Replace './path/to/your/image.jpg' with the actual path to your image
        resizeMode="contain" // Adjust the image content mode as needed
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300, // Adjust the width as needed
    height: 300, // Adjust the height as needed
  },
});

export default NoTransactionPage;
