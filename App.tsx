import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import AppNavigator from "./AppNavigator";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        {/* <GestureHandlerRootView> */}
        <AppNavigator />
        {/* </GestureHandlerRootView> */}
      </PaperProvider>
    </Provider>
  );
};

export default App;
