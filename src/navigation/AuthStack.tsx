import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import MyTabs from "@/components/MyTabs";
import DateContext from "../context/DateContext";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (newDate: Date) => {
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
      </Stack.Navigator>
    </DateContext.Provider>
  );
}
