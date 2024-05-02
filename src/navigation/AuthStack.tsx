import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import Dashboard from "../screens/Dashboard";
// import Profile from "../screens/Profile";
import MoneyTrackerPage from "@/screens/MoneyTrackerPage";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MoneyTrackerPage"
        component={MoneyTrackerPage}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      /> */}
    </Stack.Navigator>
  );
}
