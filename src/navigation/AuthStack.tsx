import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import MyTabs from "@/components/MyTabs";
import DateContext from "../context/DateContext";
import ViewModeContext from "../context/ViewModeContext";
import AddTransactionDetails from "@/screens/AddTransactionDetails";
import ProfileScreen from "@/screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("daily");

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
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
    </ViewModeContext.Provider>
  );
}
