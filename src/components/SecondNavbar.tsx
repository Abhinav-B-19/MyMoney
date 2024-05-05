import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Text, FlatList, Modal } from "react-native";
import { IconButton, Button } from "react-native-paper";
import FilterPopoverMenu from "./FilterPopoverMenu";
import { ViewModeOptions, ShowTotalOptions } from "@/constants/filterOptions";
import ViewModeContext from "@/context/ViewModeContext";
import Picker from "./Picker";
import { useTotal } from "@/context/TotalContext";

interface SecondNavbarProps {
  topSectionText: string;
  bottomSectionText: string;
  onDateChange: (newDate: Date) => void;
}

const SecondNavbar: React.FC<SecondNavbarProps> = ({
  topSectionText,
  bottomSectionText,
  onDateChange,
}) => {
  const { viewMode, setViewMode } = useContext(ViewModeContext);

  const [selectedViewMode, setSelectedViewMode] = useState(
    Object.values(ViewModeOptions)[0]
  );
  const [selectedTotalOption, setSelectedTotalOption] = useState(
    Object.values(ShowTotalOptions)[0]
  );
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date());

  const { expenseTotal, incomeTotal, overallTotal } = useTotal();

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  const handleFilterChange = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSelectFilter = (filter: string) => {
    setSelectedViewMode(filter);
    setViewMode(filter);
    closeModal();
  };

  const handleSelectTotalDisplay = (option: boolean) => {
    setSelectedTotalOption(option);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.section, styles.topSection]}>
        <FlatList
          ListHeaderComponent={
            <Picker
              date={date}
              onDateChange={handleDateChange}
              mode={viewMode}
            />
          }
          data={[]}
          renderItem={() => <View />}
        />
        <IconButton
          icon={"filter"}
          style={styles.filterIcon}
          onPress={handleFilterChange}
        />
      </View>
      <View style={styles.bottomSection}>
        <View style={[styles.bottomSectionItem, styles.halfSection]}>
          <Text>Expense</Text>
          <Text style={styles.red}>{expenseTotal}</Text>
        </View>
        <View style={[styles.bottomSectionItem, styles.halfSection]}>
          <Text>Income</Text>
          <Text style={styles.green}>{incomeTotal}</Text>
        </View>
        {selectedTotalOption && (
          <View style={[styles.bottomSectionItem, styles.halfSection]}>
            <Text>Total</Text>
            <Text style={overallTotal >= 0 ? styles.green : styles.red}>
              {overallTotal}
            </Text>
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
  topSection: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#ccc",
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  bottomSectionItem: {
    alignItems: "center",
    flex: 1,
  },
  halfSection: {
    backgroundColor: "white",
    height: 40,
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
  green: {
    color: "green",
  },
  red: {
    color: "red",
  },
});

export default SecondNavbar;
