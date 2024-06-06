import React from "react";
import { View, Text, ScrollView } from "react-native";

const Budgets: React.FC<{ onScroll: (event: any) => void }> = ({
  onScroll,
}) => {
  return (
    <ScrollView
      // contentContainerStyle={styles.scrollContainer}
      onScroll={onScroll}
      scrollEventThrottle={3}
    >
      <View>
        <Text>Budgets Screen</Text>
      </View>
    </ScrollView>
  );
};

export default Budgets;
