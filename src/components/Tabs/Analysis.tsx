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
  }, [selectedDate, selectedOption]);

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

    console.log("in getPieChartData", selectedOption, separatedCollection);

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

    console.log("filteredData: ", filteredData);

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
          {selectedOption && seriesData.length > 0 ? (
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
              <Text style={styles.noDataText}>No data available</Text>
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
    // width: 200,
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
    // backgroundColor: "gray",
  },
  pieChartContainer: {
    flex: 2,
    // backgroundColor: "#f5f5f5",
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
    // fontWeight: "bold",
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
    // flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    // padding: 10,
    // marginTop: 20,
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
});

export default Analysis;
