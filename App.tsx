import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import AppNavigator from "./AppNavigator";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { AuthProvider } from "@/context/AuthContext";
import { TotalProvider } from "@/context/TotalContext";
import { CategoryProvider } from "@/context/CategoryContext";
import { AccountProvider } from "@/context/AccountContext";
import NetInfo from "@react-native-community/netinfo";
import UserInfoModal from "@/components/UserInfoModal";
import { getUserInfo, setUserInfo } from "@/utils/utils";
import { UserProvider } from "@/context/UserContext";

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [userInfo, setUserInfoState] = useState<{
    country: string | null;
    currency: string | null;
  }>({ country: null, currency: null });

  useEffect(() => {
    checkInternetConnection();
    checkUserInfo();
  }, []);

  const checkInternetConnection = async () => {
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected);
  };

  const checkUserInfo = async () => {
    const info = await getUserInfo();
    console.log("User Info: ", info);

    if (!info.country || !info.currency) {
      setIsModalVisible(true);
    } else {
      setUserInfoState(info);
    }
  };

  const handleModalClose = async () => {
    setIsModalVisible(false);
    const info = await getUserInfo();
    setUserInfoState(info);
  };

  const handleUserInfoSave = async (country: string, currency: string) => {
    console.log("User Info: ", country, currency);
    await setUserInfo(country, currency);
    handleModalClose();
  };

  if (!isConnected) {
    return (
      <View style={styles.centeredContainer}>
        <NoInternetConnectionScreen onRetry={checkInternetConnection} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <UserProvider>
        <CategoryProvider>
          <AccountProvider>
            <TotalProvider>
              <Provider store={store}>
                <PaperProvider>
                  <AppNavigator />
                  <UserInfoModal
                    isVisible={isModalVisible}
                    onClose={handleModalClose}
                    onSave={handleUserInfoSave}
                  />
                </PaperProvider>
              </Provider>
            </TotalProvider>
          </AccountProvider>
        </CategoryProvider>
      </UserProvider>
    </AuthProvider>
  );
};

const NoInternetConnectionScreen: React.FC<{ onRetry: () => void }> = ({
  onRetry,
}) => {
  return (
    <View style={styles.centeredContainer}>
      <Text>No Internet Connection</Text>
      <Button title="Retry" onPress={onRetry} />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
