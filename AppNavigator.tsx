import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import MoneyTrackerPage from "./src/screens/MoneyTrackerPage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { InitialScreenOnStart } from "./src/navigation/InitialScreenOnStart";
import AuthStack from "./src/navigation/AuthStack";

import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/firebase/firebase";

const Stack = createNativeStackNavigator();
const { Navigator, Screen } = createStackNavigator();

const AppNavigator: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("user", "uid: ", user.uid);
      setUser(user);
    });
  }, []);
  return (
    // <NavigationContainer>
    //   <Navigator
    //     initialRouteName="LoginScreen"
    //     screenOptions={{ headerShown: false }}
    //   >
    //     <Screen name="LoginScreen" component={LoginScreen} />
    //     <Screen name="SignUpScreen" component={SignUpScreen} />
    //     <Screen name="MoneyTrackerPage" component={MoneyTrackerPage} />
    //   </Navigator>
    // </NavigationContainer>

    <NavigationContainer>
      <Navigator initialRouteName="InitialScreenOnStart">
        {user ? (
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="InitialScreenOnStart"
            component={InitialScreenOnStart}
            options={{ headerShown: false }}
          />
        )}
      </Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
