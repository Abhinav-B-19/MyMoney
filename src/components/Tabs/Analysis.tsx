import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import { separateCollectionByViewMode } from "@/utils/utilsFunctions";
import ViewModeContext from "@/context/ViewModeContext";
import DateContext from "@/context/DateContext";
import { useTransaction } from "@/context/TransactionContext";
import PieChart from "react-native-pie-chart";
import AnalysisCard from "../AnalysisCard";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAccount } from "@/context/AccountContext";
import { BarChart } from "react-native-chart-kit";

const Analysis: React.FC = () => {
  const [selectedOption, setSelectedOption] =
    useState<string>("Expense overview");
  const [seriesData, setSeriesData] = useState<any[]>([]);
  const [sliceColors, setSliceColors] = useState<string[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const viewModeContext = useContext(ViewModeContext);
  const { selectedDate, handleDateChange } = useContext(DateContext);
  const { transactionsContext } = useTransaction();
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [percentages, setPercentages] = useState<any[]>([]);
  const [barGraphData, setBarGraphData] = useState<any>({
    expenseBarChartData: [],
    incomeBarChartData: [],
  });
  const { contextAccounts } = useAccount();

  const options = [
    "Expense overview",
    "Income overview",
    "Expense flow",
    "Income flow",
    "Account analysis",
  ];

  useEffect(() => {
    handleDateChangeAndUpdate(selectedDate);
    getPieChartData();
    const graphData = getBarChartData();
    setBarGraphData(graphData);
  }, [contextAccounts, selectedOption, selectedDate]);

  const handleSelect = (index: number, value: string) => {
    setSelectedOption(value);
    console.log(`Selected option: ${value}`);
  };

  const handleDateChangeAndUpdate = (newDate: Date) => {
    handleDateChange(newDate);
  };

  const getPieChartData = () => {
    const separatedCollection = separateCollectionByViewMode(
      transactionsContext,
      viewModeContext.viewMode,
      selectedDate
    );

    if (!selectedOption || !separatedCollection) {
      setSeriesData([]);
      setSliceColors([]);
      setCategoryNames([]);
      return;
    }

    const filteredData = separatedCollection.filter((item) => {
      if (selectedOption === "Expense overview") {
        return item.transactionType.toLowerCase() === "expense";
      } else if (selectedOption === "Income overview") {
        return item.transactionType.toLowerCase() === "income";
      }
      return false;
    });

    if (!filteredData || filteredData.length === 0) {
      setSeriesData([]);
      setSliceColors([]);
      setCategoryNames([]);
      return;
    }

    const categoryTotal = {};
    filteredData.forEach((item) => {
      const category = item.category;
      const amount = parseFloat(item.transactionAmount);
      if (categoryTotal[category]) {
        categoryTotal[category] += amount;
      } else {
        categoryTotal[category] = amount;
      }
    });

    const pieChartData = Object.entries(categoryTotal).map(
      ([category, amount], index) => ({
        value: amount,
        color: getRandomColor(),
        name: category,
        series: index,
        sliceColor: getRandomColor(),
        externalName: category,
      })
    );

    const newSeriesData = pieChartData.map((data) => data.value);
    const newSliceColors = pieChartData.map((data) => data.color);
    const newCategoryNames = pieChartData.map((data) => data.name);

    // console.log(newSeriesData, newSliceColors, newCategoryNames);

    const percentages = calculatePercentage(pieChartData);
    console.log("percentages: ", percentages);
    setPercentages(percentages);

    setSeriesData(newSeriesData);
    setSliceColors(newSliceColors);
    setCategoryNames(newCategoryNames);

    setFilteredData(filteredData);
  };

  const calculatePercentage = (seriesData: any[]) => {
    // Calculate the total sum of values
    const totalSum = seriesData.reduce((acc, curr) => acc + curr.value, 0);

    // Calculate the percentage for each category
    const percentages = seriesData.map((data) => ({
      ...data,
      percentage: ((data.value / totalSum) * 100).toFixed(2),
    }));

    return percentages;
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getBarChartData = () => {
    const separatedCollection = separateCollectionByViewMode(
      transactionsContext,
      viewModeContext.viewMode,
      selectedDate
    );

    if (!selectedOption || !separatedCollection) {
      return {
        expenseBarChartData: { datasets: [{ data: [] }], labels: [] },
        incomeBarChartData: { datasets: [{ data: [] }], labels: [] },
      };
    }

    if (selectedOption === "Account analysis") {
      const filterExpenseData = separatedCollection.filter(
        (item) => item.transactionType.toLowerCase() === "expense"
      );

      const filterIncomeData = separatedCollection.filter(
        (item) => item.transactionType.toLowerCase() === "income"
      );

      const expenseAccountTotal = {};
      const incomeAccountTotal = {};

      filterExpenseData.forEach((item) => {
        const account = item.account;
        const amount = parseFloat(item.transactionAmount);
        if (expenseAccountTotal[account]) {
          expenseAccountTotal[account] += amount;
        } else {
          expenseAccountTotal[account] = amount;
        }
      });

      filterIncomeData.forEach((item) => {
        const account = item.account;
        const amount = parseFloat(item.transactionAmount);
        if (incomeAccountTotal[account]) {
          incomeAccountTotal[account] += amount;
        } else {
          incomeAccountTotal[account] = amount;
        }
      });

      const expenseBarChartData = {
        datasets: [
          {
            data: contextAccounts.map(
              (account) => expenseAccountTotal[account.name] || 0
            ),
          },
        ],
        labels: contextAccounts.map((account) => account.name),
      };

      const incomeBarChartData = {
        datasets: [
          {
            data: contextAccounts.map(
              (account) => incomeAccountTotal[account.name] || 0
            ),
          },
        ],
        labels: contextAccounts.map((account) => account.name),
      };

      console.log(expenseBarChartData, incomeBarChartData);

      return { expenseBarChartData, incomeBarChartData };
    } else {
      return {
        expenseBarChartData: { datasets: [{ data: [] }], labels: [] },
        incomeBarChartData: { datasets: [{ data: [] }], labels: [] },
      };
    }
  };

  useEffect(() => {
    handleDateChangeAndUpdate(selectedDate);
    getPieChartData();
    const graphData = getBarChartData();
    setBarGraphData(graphData);
  }, [contextAccounts, selectedOption, selectedDate]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <ModalDropdown
          options={options}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownMenu}
          dropdownTextStyle={styles.dropdownItemText}
          dropdownTextHighlightStyle={styles.dropdownItemHighlight}
          onSelect={handleSelect}
          defaultIndex={0}
          defaultValue="Expense overview"
        />
        <View style={styles.analysisContainer}>
          {selectedOption === "Expense overview" ||
          selectedOption === "Income overview" ? (
            seriesData.length > 0 ? (
              <>
                <View style={styles.chartAndLegendContainer}>
                  <View style={styles.pieChartContainer}>
                    <PieChart
                      series={seriesData}
                      sliceColor={sliceColors}
                      widthAndHeight={200}
                      coverRadius={0.65}
                      coverFill={"#FFFFFF"}
                    />
                    <View style={styles.pieChartTextContainer}>
                      <Text style={styles.pieChartText}>{selectedOption}</Text>
                    </View>
                  </View>
                  <View style={styles.legendContainer}>
                    {categoryNames.map((category, index) => (
                      <View key={index} style={styles.legendItem}>
                        <View
                          style={[
                            styles.legendColor,
                            { backgroundColor: sliceColors[index] },
                          ]}
                        />
                        <Text style={styles.legendText}>{category}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.separator} />
                <View style={styles.contentContainer}>
                  {filteredData.map((item, index) => (
                    <AnalysisCard
                      key={index}
                      title={item.title}
                      description={item.description}
                      date={item.date}
                      transactionAmount={item.transactionAmount}
                      currency={item.currency}
                      account={item.account}
                      toAccount={item.toAccount}
                      category={item.category}
                      transactionType={item.transactionType}
                      isSplitTransaction={item.isSplitTransaction}
                      percentage={
                        percentages[index]
                          ? parseFloat(percentages[index].percentage)
                          : 0
                      }
                    />
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                  No data available for overview
                </Text>
              </View>
            )
          ) : selectedOption === "Account analysis" ? (
            <View style={styles.barChartContainer}>
              <Text style={styles.chartTitle}>EXPENSE ANALYSIS</Text>
              <BarChart
                style={styles.barChart}
                data={barGraphData.expenseBarChartData}
                width={350}
                height={200}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundGradientFrom: "#FFFFFA",
                  backgroundGradientTo: "#FFFFFA",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(145, 47, 64, ${opacity})`,
                }}
              />

              <Text style={styles.chartTitle}>INCOME ANALYSIS</Text>
              <BarChart
                style={styles.barChart}
                data={barGraphData.incomeBarChartData}
                width={350}
                height={200}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundGradientFrom: "#FFFFFA",
                  backgroundGradientTo: "#FFFFFA",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(85, 118, 163, ${opacity})`,
                }}
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                No data available for account analysis
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingTop: 10,
    marginBottom: 20,
  },
  dropdown: {
    borderRadius: 5,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 16,
    padding: 10,
    textAlign: "center",
  },
  dropdownMenu: {
    width: 200,
    borderRadius: 5,
  },
  dropdownItemText: {
    fontSize: 16,
    padding: 10,
  },
  dropdownItemHighlight: {
    backgroundColor: "#3498db",
    color: "#fff",
  },
  analysisContainer: {
    flex: 1,
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartAndLegendContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  pieChartContainer: {
    flex: 2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginRight: 20,
    position: "relative",
  },
  pieChartTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  pieChartText: {
    fontSize: 14,
    color: "gray",
  },
  legendContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingRight: 25,
    paddingBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    marginTop: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
    marginVertical: 10,
  },
  contentContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  noDataText: {
    fontSize: 16,
    color: "gray",
  },
  barChartContainer: {
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 20,
    width: "100%",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#080705",
    margin: 20,
  },
  barChart: {
    marginTop: 10,
  },
});

export default Analysis;
