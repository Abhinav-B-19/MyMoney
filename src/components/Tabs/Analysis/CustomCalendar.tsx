import React, { useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ViewModeContext from "@/context/ViewModeContext";

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
  const viewModeContext = useContext(ViewModeContext);

  useEffect(() => {
    // console.log("extractedData: ", extractedData);
  }, [extractedData]);

  for (let i = 0; i < firstDayOfMonth; i++) {
    week.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    week.push(i);
  }

  while (week.length < 7) {
    week.push(null);
  }
  weeks.push(week);

  const determineTextColor = (amount: number | null): string => {
    if (amount === null) return "red";
    return flowType === "Income flow" ? "green" : "red";
  };

  const getAmountForDate = (date: number): number | null => {
    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedYear = selectedDate.getFullYear();
    const dateString = `${selectedMonth}/${date}/${selectedYear}`;

    const filteredTransactions = extractedData.filter(
      (item) =>
        item.date === dateString &&
        ((flowType === "Income flow" && item.transactionType === "Income") ||
          (flowType === "Expense flow" && item.transactionType === "Expense"))
    );

    if (filteredTransactions.length === 0) {
      return null;
    }

    // Calculate total amount
    const totalAmount = filteredTransactions.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    return totalAmount;
  };

  const getAmountString = (amount: number | null): string => {
    if (amount === null) return "_";
    // "●"
    const sign = flowType === "Income flow" ? "+" : "-";
    return `${sign}${Math.abs(amount)}`;
  };

  const renderMonthlyView = () => (
    <>
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
    </>
  );

  const renderWeeklyView = () => {
    const startOfWeek = selectedDate.getDate() - selectedDate.getDay();
    const daysOfWeek = Array.from(
      { length: 7 },
      (_, i) => new Date(selectedDate.setDate(startOfWeek + i))
    );

    return (
      <View style={styles.week}>
        {daysOfWeek.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={styles.day}
            onPress={() => onDatePress(date)}
          >
            <Text style={[styles.dayText, styles.lightText]}>
              {date.getDate()}
            </Text>
            <Text
              style={[
                styles.amountText,
                {
                  color: determineTextColor(getAmountForDate(date.getDate())),
                },
              ]}
            >
              {getAmountString(getAmountForDate(date.getDate()))}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderDailyView = () => {
    const currentDate = selectedDate.getDate();
    const dayOfWeek = selectedDate.getDay();
    const startOfWeek = currentDate - dayOfWeek;
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(year, selectedDate.getMonth(), startOfWeek + i);
      return {
        date: date.getDate(),
        isCurrentDate: date.getDate() === currentDate,
      };
    });

    return (
      <View style={styles.week}>
        {weekDates.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.day, day.isCurrentDate ? styles.selectedDay : null]}
            onPress={() =>
              onDatePress(new Date(year, selectedDate.getMonth(), day.date))
            }
          >
            <Text style={[styles.dayText, styles.lightText]}>{day.date}</Text>
            {day.isCurrentDate && (
              <Text
                style={[
                  styles.amountText,
                  {
                    color: determineTextColor(getAmountForDate(day.date)),
                  },
                ]}
              >
                {getAmountString(getAmountForDate(day.date))}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
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
      {viewModeContext.viewMode === "monthly" && renderMonthlyView()}
      {viewModeContext.viewMode === "weekly" && renderWeeklyView()}
      {viewModeContext.viewMode === "daily" && renderDailyView()}
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
    borderColor: "#ede",
    marginBottom: 5,
    paddingTop: 5,
  },
  emptyDay: {
    backgroundColor: "#f5f5f5",
  },
  selectedDay: {
    backgroundColor: "#d3d3d3",
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
