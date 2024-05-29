import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useContext, useEffect } from "react";
import MyTabs from "@/components/MyTabs";
import DateContext from "../context/DateContext";
import ViewModeContext from "../context/ViewModeContext";
import AddTransactionDetails from "@/screens/AddTransactionDetails";
import ProfileScreen from "@/screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  const { viewMode, setViewMode, showTotal, setShowTotal, updateModeOptions } =
    useContext(ViewModeContext);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    console.log("Current viewMode: ", viewMode);
    console.log("Current showTotal: ", showTotal);
  }, [viewMode, showTotal]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  return (
    <DateContext.Provider value={{ selectedDate, handleDateChange }}>
      <Stack.Navigator>
        <Stack.Screen
          name="MyTabs"
          component={MyTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTransactionDetails"
          component={AddTransactionDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </DateContext.Provider>
  );
}
