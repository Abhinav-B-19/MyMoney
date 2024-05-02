import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, Modal } from "react-native";
import MonthPicker from "./MonthPicker";
import { addMonths } from 'date-fns'
import { Divider, IconButton, Button } from "react-native-paper";
import FilterPopoverMenu from "./FilterPopoverMenu";
import { ViewModeOptions, ShowTotalOptions } from "@/constants/filterOptions";

interface SecondNavbarProps {
  topSectionText: string;
  bottomSectionText: string;
  onDateChange: (newDate: Date) => void;
  onSelectFilter: (filter: string) => void;
  onSelectTotalDisplay: (option: boolean) => void;
}

const SecondNavbar: React.FC<SecondNavbarProps> = ({
  topSectionText,
  bottomSectionText,
  onDateChange,
  onSelectFilter,
  onSelectTotalDisplay
}) => {
  const [selectedViewMode, setSelectedViewMode] = useState(Object.values(ViewModeOptions)[0]);
  const [selectedTotalOption, setSelectedTotalOption] = useState(Object.values(ShowTotalOptions)[0]);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date()); // Initialize date state with current date

  const expense = Math.floor(Math.random() * 1000);
  const income = Math.floor(Math.random() * 1000);
  const total = expense + income;

  const handleDateChange = (newDate: Date) => {
    setDate(newDate); // Update date state when date changes
    onDateChange(newDate);
  };

  useEffect(() => {
    console.log(selectedViewMode, selectedTotalOption)
  })

  const handleFilterChange = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSelectFilter = (filter: string) => {
    setSelectedViewMode(filter);
    onSelectFilter(filter);
    closeModal();
  };

  const handleSelectTotalDisplay = (option: boolean) => {
    setSelectedTotalOption(option);
    onSelectTotalDisplay(option);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.section, styles.redSection]}>
        <FlatList
          ListHeaderComponent={<MonthPicker date={date} onDateChange={handleDateChange} />}
        />
        <IconButton icon={"filter"} style={styles.filterIcon} onPress={handleFilterChange}/>
      </View>
      <View style={styles.blueSection}>
  <View style={[styles.bottomSectionItem, styles.halfSection]}>
    <Text>Expense</Text>
    <Text>{expense}</Text>
  </View>
  <View style={[styles.bottomSectionItem, styles.halfSection]}>
    <Text>Income</Text>
    <Text>{income}</Text>
  </View>
  {selectedTotalOption && ( // Wrap the conditional rendering with {}
    <View style={[styles.bottomSectionItem, styles.halfSection]}>
      <Text>Total</Text>
      <Text>{total}</Text>
    </View>
  )}
</View>
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FilterPopoverMenu 
              onSelectFilter={handleSelectFilter} 
              onSelectTotalDisplay={handleSelectTotalDisplay} 
              selectedViewMode={selectedViewMode} 
              selectedTotalOption={selectedTotalOption} 
            />
            <Button onPress={closeModal}>Close</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 20,
  },
  redSection: {
    backgroundColor: "pink",
  },
  blueSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  bottomSectionItem: {
    alignItems: "center",
    flex: 1,
  },
  halfSection: {
    backgroundColor: "white",
    height: 50,
  },
  filterIcon: {
    marginHorizontal: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});

export default SecondNavbar;
