import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkFirstTimeOrLongTime = async (): Promise<void> => {
  try {
    // Get the last opened timestamp from AsyncStorage
    const lastOpenedTimestamp = await AsyncStorage.getItem(
      "lastOpenedTimestamp"
    );

    // Get the current timestamp
    const currentTimestamp = new Date().getTime();

    if (lastOpenedTimestamp) {
      // App has been opened before
      const differenceInMs = currentTimestamp - Number(lastOpenedTimestamp);

      // Check if it's been a long time (e.g., more than 1 day since last opened)
      const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      const isLongTime = differenceInMs > oneDayInMs;

      if (isLongTime) {
        // Handle case where it's been a long time since last opened
        console.log("Long time since last opened");
      } else {
        // Handle case where it's not been a long time since last opened
        console.log("Not a long time since last opened");
      }
    } else {
      // App is being opened for the first time
      console.log("First time opening the app");
    }

    // Store the current timestamp as the last opened timestamp
    await AsyncStorage.setItem("lastOpenedTimestamp", String(currentTimestamp));
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getUserInfo = async (): Promise<{
  country: string | null;
  currency: string | null;
}> => {
  try {
    const userInfoString = await AsyncStorage.getItem("userInfo");
    const userInfo =
      userInfoString !== null ? JSON.parse(userInfoString) : null;
    const country = userInfo !== null ? userInfo.country : null;
    const currency = userInfo !== null ? userInfo.currency : null;
    return { country, currency };
  } catch (e) {
    console.error("Failed to load user info", e);
    return { country: null, currency: null };
  }
};

export const setUserInfo = async (
  country: string,
  currency: string
): Promise<void> => {
  try {
    const userInfo = { country, currency };
    await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
  } catch (e) {
    console.error("Failed to save user info", e);
  }
};

export const storeModeOptions = async (
  viewMode?: string,
  showTotal?: boolean
) => {
  try {
    if (viewMode !== undefined) {
      await AsyncStorage.setItem("@viewMode", viewMode);
    }
    if (showTotal !== undefined) {
      await AsyncStorage.setItem("@showTotal", JSON.stringify(showTotal));
    }
  } catch (error) {
    console.error("Error storing filter options:", error);
  }
};

export const getModeOptions = async (): Promise<{
  viewMode: string | null;
  showTotal: boolean | null;
}> => {
  try {
    const viewMode = await AsyncStorage.getItem("@viewMode");
    const showTotal = await AsyncStorage.getItem("@showTotal");

    return {
      viewMode: viewMode !== null ? viewMode : null,
      showTotal: showTotal !== null ? JSON.parse(showTotal) : null,
    };
  } catch (error) {
    console.error("Error retrieving stored mode options:", error);
    return { viewMode: null, showTotal: null };
  }
};
