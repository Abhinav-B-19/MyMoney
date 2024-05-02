import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import Navbar from "@/components/Navbar";
import SecondNavbar from "@/components/SecondNavbar";
import MoneyTrackerPage from "@/screens/MoneyTrackerPage";
import Categories from "./Tabs/Categories";
import Accounts from "./Tabs/Accounts";
import Analysis from "./Tabs/Analysis";
import Budgets from "./Tabs/Budgets";
import DateContext from "../context/DateContext";

type RootTabParamList = {
  Records: undefined;
  Categories: undefined;
  Accounts: undefined;
  Analysis: undefined;
  Budgets: undefined;
};

type BottomTabScreenProps<T extends keyof RootTabParamList> = {
  navigation: BottomTabNavigationProp<RootTabParamList, T>;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const MyTabs: React.FC<BottomTabScreenProps<"Records">> = ({ navigation }) => {
  const { selectedDate, handleDateChange } = useContext(DateContext);

  return (
    <View style={styles.container}>
      <Navbar title="Money Tracker" />
      <SecondNavbar
        topSectionText="Top Section"
        bottomSectionText="Bottom Section"
        onDateChange={handleDateChange}
      />
      <Tab.Navigator>
        <Tab.Screen
          name="Records"
          component={MoneyTrackerPage}
          options={{
            headerShown: false,
            tabBarLabel: "Records",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Categories"
          component={Categories} //{AnimatedStyleUpdateExample} //{HomeScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Categories",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Accounts"
          component={Accounts} //{HomeScreen}
          options={{
            headerShown: false,
            tabBarLabel: "Accounts",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Analysis"
          component={Analysis}
          options={{
            headerShown: false,
            tabBarLabel: "Analysis",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="bell" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Budgets"
          component={Budgets}
          options={{
            headerShown: false,
            tabBarLabel: "Budgets",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
      {/* </DateContext.Provider> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MyTabs;
