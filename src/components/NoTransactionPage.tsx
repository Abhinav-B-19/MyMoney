import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  RefreshControl,
  Dimensions,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { COLORS } from "@/constants/colors";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const NoTransactionPage = ({ onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const renderNoTransactionItem = () => {
    return (
      <View style={styles.noTransactionContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/NoTransaction.png")}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.PRIMARY]}
          />
        }
        data={[{ key: "noTransaction" }]}
        renderItem={({ item }) => renderNoTransactionItem()}
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
  flatList: {
    flex: 1,
    width: "100%",
  },
  noTransactionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "40%",
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default NoTransactionPage;
