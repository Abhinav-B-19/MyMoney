import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { IconButton } from "react-native-paper";
import {
  format,
  subMonths,
  addMonths,
  subDays,
  addDays,
  subWeeks,
  addWeeks,
  startOfWeek,
  endOfWeek,
} from "date-fns";

type PickerProps = {
  date: Date;
  onDateChange: (newDate: Date) => void;
  mode: "monthly" | "weekly" | "daily"; // Define the mode type
};

const Picker: React.FC<PickerProps> = ({ date, onDateChange, mode }) => {
  const startOfWeekDate = startOfWeek(date);
  const endOfWeekDate = endOfWeek(date);

  // useEffect(() => {
  //   console.log(
  //     "picker Picker: ",
  //     mode,
  //     date,
  //     "startOfWeekDate: ",
  //     startOfWeekDate,
  //     "endOfWeekDate: ",
  //     endOfWeekDate
  //   );
  // });

  const handlePrev = () => {
    let newDate: Date;
    switch (mode) {
      case "monthly":
        newDate = subMonths(date, 1);
        break;
      case "weekly":
        newDate = subWeeks(date, 1);
        break;
      case "daily":
        newDate = subDays(date, 1);
        break;
      default:
        newDate = date;
        break;
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    let newDate: Date;
    switch (mode) {
      case "monthly":
        newDate = addMonths(date, 1);
        break;
      case "weekly":
        newDate = addWeeks(date, 1);
        break;
      case "daily":
        newDate = addDays(date, 1);
        break;
      default:
        newDate = date;
        break;
    }
    onDateChange(newDate);
  };

  return (
    <View style={styles.row}>
      <IconButton icon={"arrow-left"} onPress={handlePrev} />
      <Text>
        {mode === "daily"
          ? format(date, "MMMM d, yyyy")
          : mode === "weekly"
          ? `${format(startOfWeekDate, "MMM d")} - ${format(
              endOfWeekDate,
              "MMM d"
            )}`
          : format(date, "MMMM, yyyy")}
      </Text>
      <IconButton icon={"arrow-right"} onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
});

export default Picker;
