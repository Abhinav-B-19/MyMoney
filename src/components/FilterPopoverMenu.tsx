import React, { useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ViewModeOptions, ShowTotalOptions } from "@/constants/filterOptions";

interface FilterPopoverMenuProps {
  onSelectFilter: (filter: string) => void;
  onSelectTotalDisplay: (option: boolean) => void;
  selectedViewMode: string;
  selectedTotalOption: boolean;
}

const FilterPopoverMenu: React.FC<FilterPopoverMenuProps> = ({
  onSelectFilter,
  onSelectTotalDisplay,
  selectedViewMode,
  selectedTotalOption,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Display Options</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.label}>View mode:</Text>
          <View style={styles.options}>
            {Object.keys(ViewModeOptions).map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => onSelectFilter(ViewModeOptions[option])}
              >
                <Text
                  style={[
                    styles.option,
                    selectedViewMode === ViewModeOptions[option] &&
                      styles.selectedOption,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Show total:</Text>
          <View style={styles.options}>
            {Object.keys(ShowTotalOptions).map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => onSelectTotalDisplay(ShowTotalOptions[option])}
              >
                <Text
                  style={[
                    styles.option,
                    selectedTotalOption === ShowTotalOptions[option] &&
                      styles.selectedOption,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  options: {
    flexDirection: "column",
  },
  option: {
    fontSize: 16,
    marginLeft: 10,
    color: "#007bff",
  },
  selectedOption: {
    fontWeight: "bold",
  },
});

export default FilterPopoverMenu;
