import React, { createContext, useState, useEffect } from "react";
import { storeModeOptions, getModeOptions } from "@/utils/utils";

const ViewModeContext = createContext();

export const ViewModeProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState("daily");
  const [showTotal, setShowTotal] = useState(true);

  useEffect(() => {
    const initializeModeOptions = async () => {
      const modeOptions = await getModeOptions();
      console.log("Loaded modeOptions: ", modeOptions);

      if (modeOptions.viewMode !== null) {
        setViewMode(modeOptions.viewMode);
      } else {
        const defaultViewMode = "daily";
        setViewMode(defaultViewMode);
        await storeModeOptions(defaultViewMode, modeOptions.showTotal);
      }

      if (modeOptions.showTotal !== null) {
        setShowTotal(modeOptions.showTotal);
      } else {
        const defaultShowTotal = true;
        setShowTotal(defaultShowTotal);
        await storeModeOptions(modeOptions.viewMode, defaultShowTotal);
      }
    };

    initializeModeOptions();
  }, []);

  const updateModeOptions = async (newViewMode, newShowTotal) => {
    setViewMode(newViewMode);
    setShowTotal(newShowTotal);
    await storeModeOptions(newViewMode, newShowTotal);
  };

  return (
    <ViewModeContext.Provider
      value={{
        viewMode,
        setViewMode,
        showTotal,
        setShowTotal,
        updateModeOptions,
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
};

export default ViewModeContext;
