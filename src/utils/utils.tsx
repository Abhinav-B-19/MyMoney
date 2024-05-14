// utils.ts

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
