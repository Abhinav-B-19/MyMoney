import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InitialScreenOnStart } from "./src/navigation/InitialScreenOnStart";
import AuthStack from "./src/navigation/AuthStack";
import { useAuth } from "@/context/AuthContext";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/firebase/firebase";
import { useUserContext } from "@/context/UserContext";
import { getUserInfo } from "@/utils/utils";

const Stack = createNativeStackNavigator();
const { Navigator, Screen } = createStackNavigator();

const AppNavigator: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const { authUser, setAuthUser } = useAuth();
  const { setUserCountry, setUserCurrency } = useUserContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user", "uid: ", user.uid);
        setAuthUser(user.uid);
        // console.log("setAuthUser: ", authUser);
        setUser(user);
        checkUserInfo();
      } else {
        setAuthUser(null);
        setUser(null);
      }
    });
  }, []);

  const checkUserInfo = async () => {
    const info = await getUserInfo();
    console.log("User Info: ", info);

    if (info.country || info.currency) {
      setUserCountry(info.country);
      setUserCurrency(info.currency);
    }
  };

  return (
    // <AuthProvider>
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
    // </AuthProvider>
  );
};

export default AppNavigator;
