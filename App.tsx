import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import AppNavigator from "./AppNavigator";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/context/AuthContext";
import { TotalProvider } from "@/context/TotalContext";
const App: React.FC = () => {
  return (
    <AuthProvider>
      <TotalProvider>
        <Provider store={store}>
          <PaperProvider>
            {/* <GestureHandlerRootView> */}
            <AppNavigator />
            {/* </GestureHandlerRootView> */}
          </PaperProvider>
        </Provider>
      </TotalProvider>
    </AuthProvider>
  );
};

export default App;
