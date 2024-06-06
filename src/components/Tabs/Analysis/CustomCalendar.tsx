import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CustomCalendarProps {
  selectedDate: Date;
  onDatePress: (date: Date) => void;
  extractedData: { date: string; amount: number }[];
  flowType: string;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate,
  onDatePress,
  extractedData,
  flowType,
}) => {
  const month = selectedDate.toLocaleString("default", { month: "long" });
  const year = selectedDate.getFullYear();
  const daysInMonth = new Date(year, selectedDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, selectedDate.getMonth(), 1).getDay();
  const weeks = [];
  let week = [];

  useEffect(() => {
    console.log("flowType: ", flowType);
  }, [extractedData]);

  // Fill the first week with nulls until the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    week.push(null);
  }

  // Fill the rest of the weeks with days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    week.push(i);
  }

  // Fill the last week with nulls if necessary to make the table 7x6
  while (week.length < 7) {
    week.push(null);
  }
  weeks.push(week);

  // Function to determine text color based on flow type
  const determineTextColor = (amount: number | null): string => {
    if (amount === null) return "red"; // Red dot for no data
    return flowType === "Income flow" ? "green" : "red";
  };

  // Function to get amount for a specific date
  const getAmountForDate = (date: number): number | null => {
    const selectedMonth = selectedDate.getMonth() + 1; // Month is zero-indexed
    const selectedYear = selectedDate.getFullYear();
    const dateString = `${selectedMonth}/${date}/${selectedYear}`;
    const extracted = extractedData.find((item) => item.date === dateString);
    return extracted ? extracted.amount : null;
  };

  // Function to get amount string for display with +/- sign
  const getAmountString = (amount: number | null): string => {
    if (amount === null) return "_";
    // "●"
    const sign = flowType === "Income flow" ? "+" : "-";
    return `${sign}${Math.abs(amount)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.month}>
        {month} {year}
      </Text>
      <View style={styles.week}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <Text key={index} style={[styles.day, styles.brightText]}>
            {day}
          </Text>
        ))}
      </View>
      {weeks.map((week, index) => (
        <View key={index} style={styles.week}>
          {week.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.day, day === null ? styles.emptyDay : null]}
              onPress={() =>
                day !== null &&
                onDatePress(new Date(year, selectedDate.getMonth(), day))
              }
              disabled={day === null}
            >
              <Text style={[styles.dayText, styles.lightText]}>{day}</Text>
              {day !== null && (
                <Text
                  style={[
                    styles.amountText,
                    {
                      color: determineTextColor(getAmountForDate(day)),
                    },
                  ]}
                >
                  {getAmountString(getAmountForDate(day))}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  month: {
    fontSize: 20,
    marginBottom: 10,
  },
  week: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: -5,
  },
  day: {
    width: 50,
    height: 50,
    textAlign: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ede", // somewhat brighter border color
    marginBottom: 5,
    paddingTop: 5,
  },
  emptyDay: {
    backgroundColor: "#f5f5f5",
  },
  dayText: {
    fontSize: 16,
  },
  amountText: {
    fontSize: 12,
  },
  brightText: {
    color: "#111", // brighter text color for days
  },
  lightText: {
    color: "#999", // lighter text color for dates
  },
});

export default CustomCalendar;
