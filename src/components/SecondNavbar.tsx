import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
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

  useEffect(() => {
    console.log("viewMode in sn: ", viewMode);
  }, []);

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

  const handleModalBackgroundPress = () => {
    // Close the modal when clicking outside the modalContent
    closeModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <FlatList
          data={[""]}
          scrollEnabled={false} // Set scrollEnabled to false
          renderItem={() => (
            <Picker
              date={date}
              onDateChange={handleDateChange}
              mode={viewMode}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <IconButton
          style={styles.iconSection}
          icon={"filter"}
          onPress={handleFilterChange}
        />
      </View>
      <View style={styles.bottomSection}>
        <View style={[styles.bottomSectionItem, styles.halfSection]}>
          <Text style={styles.sectionText}>Expense</Text>
          <Text style={styles.expenseTotal}>{expenseTotal}</Text>
        </View>
        <View style={[styles.bottomSectionItem, styles.halfSection]}>
          <Text style={styles.sectionText}>Income</Text>
          <Text style={styles.incomeTotal}>{incomeTotal}</Text>
        </View>
        {selectedTotalOption && (
          <View style={[styles.bottomSectionItem, styles.halfSection]}>
            <Text style={styles.sectionText}>Total</Text>
            <Text style={overallTotal >= 0 ? styles.green : styles.red}>
              {overallTotal}
            </Text>
          </View>
        )}
      </View>
      <Modal visible={showModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={handleModalBackgroundPress}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <FilterPopoverMenu
                  onSelectFilter={handleSelectFilter}
                  onSelectTotalDisplay={handleSelectTotalDisplay}
                  selectedViewMode={viewMode}
                  selectedTotalOption={selectedTotalOption}
                />
                <Button onPress={closeModal}>Close</Button>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderBottomWidth: 1.5,
    borderBottomColor: "#ccc",
  },
  iconSection: {
    alignItems: "flex-end",
    paddingRight: 10,
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
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
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
  sectionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  expenseTotal: {
    fontSize: 14,
    color: "red",
  },
  incomeTotal: {
    fontSize: 14,
    color: "green",
  },
});

export default SecondNavbar;
