import React from "react";
import { ActivityIndicator, StyleSheet, View, ViewStyle } from "react-native";

interface TaskActivityIndicatorProps {
  style?: ViewStyle;
}

const TaskActivityIndicator: React.FC<TaskActivityIndicatorProps> = ({
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TaskActivityIndicator;
