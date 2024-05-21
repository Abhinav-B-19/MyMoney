// Categories.tsx

import React, { useContext, useEffect, useCallback } from "react";
import { View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SecondNavbar from "@/components/SecondNavbar";

interface CategoriesProps {
  setIsCategoriesScreenFocused: React.Dispatch<React.SetStateAction<boolean>>;
}

const Categories: React.FC<CategoriesProps> = ({
  setIsCategoriesScreenFocused,
}) => {
  useFocusEffect(
    useCallback(() => {
      console.log("Categories is focused");
      setIsCategoriesScreenFocused(true);
      return () => {
        console.log("Categories is unfocused");
        setIsCategoriesScreenFocused(false);
      };
    }, [])
  );
  return (
    <View>
      <Text>Categories Screen</Text>
    </View>
  );
};

export default Categories;
