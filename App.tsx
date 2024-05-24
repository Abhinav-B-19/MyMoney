import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import AppNavigator from "./AppNavigator";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/context/AuthContext";
import { TotalProvider } from "@/context/TotalContext";
import { CategoryProvider } from "@/context/CategoryContext";
import NetInfo from "@react-native-community/netinfo";
import { checkFirstTimeOrLongTime } from "@/utils/utils";

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Check network connectivity when the component mounts
    checkInternetConnection();
    checkFirstTimeOrLongTime();
  }, []);

  const checkInternetConnection = async () => {
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected);
  };

  const retryCheckConnection = () => {
    checkInternetConnection();
  };

  if (!isConnected) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <NoInternetConnectionScreen onRetry={retryCheckConnection} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <CategoryProvider>
        <TotalProvider>
          <Provider store={store}>
            <PaperProvider>
              <AppNavigator />
            </PaperProvider>
          </Provider>
        </TotalProvider>
      </CategoryProvider>
    </AuthProvider>
  );
};

const NoInternetConnectionScreen = ({ onRetry }) => {
  return (
    <View>
      <Text>No Internet Connection</Text>
      <Button title="Retry" onPress={onRetry} />
    </View>
  );
};

export default App;
