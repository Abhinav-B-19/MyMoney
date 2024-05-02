// import React from "react";
// import { View, StyleSheet, Text } from "react-native";
// import { IconButton } from "react-native-paper";
// import { format, subMonths, addMonths } from "date-fns";

// type MonthPickerProps = {
//   date: Date;
//   onDateChange: (newDate: Date) => void;
// };

// const MonthPicker: React.FC<MonthPickerProps> = ({ date, onDateChange }) => {
//   const handlePrev = () => {
//     const newDate = subMonths(date, 1);
//     onDateChange(newDate);
//   };

//   const handleAfter = () => {
//     const newDate = addMonths(date, 1);
//     onDateChange(newDate);
//   };

//   return (
//     <View style={styles.row}>
//       <IconButton icon={"arrow-left"} onPress={handlePrev} />
//       <Text>{format(date, "MMMM, yyyy")}</Text>
//       <IconButton icon={"arrow-right"} onPress={handleAfter} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between", //space-around
//     alignItems: "center",
//     paddingHorizontal: 15,
//   },
// });

// export default MonthPicker;
