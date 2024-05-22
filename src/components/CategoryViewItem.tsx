import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Category {
  type: string;
  name: string;
  icon: string;
}

interface CategoryViewItemProps {
  category: Category;
}

const CategoryViewItem: React.FC<CategoryViewItemProps> = ({ category }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const dropdownRef = useRef<View>(null);

  const handleOpenDropdown = (event: any) => {
    console.log("Dropdown opened");
    setIsDropdownVisible(true);
    setPopupPosition({
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    });
  };

  const handleCloseDropdown = () => {
    setIsDropdownVisible(false);
  };

  const onLayoutDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownWidth(width);
      });
    }
  };

  return (
    <View style={styles.categoryItem}>
      <View style={styles.leftSection}>
        <MaterialIcons name={category.icon} size={24} color="black" />
        <Text style={styles.categoryText}>{category.name}</Text>
      </View>
      <TouchableOpacity onPress={handleOpenDropdown}>
        <MaterialIcons name="more-horiz" size={24} color="black" />
      </TouchableOpacity>

      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseDropdown}
      >
        <Pressable style={styles.overlay} onPress={handleCloseDropdown}>
          <View
            ref={dropdownRef}
            style={[
              styles.dropdownMenu,
              { left: popupPosition.x - dropdownWidth, top: popupPosition.y },
            ]}
            onLayout={onLayoutDropdown}
          >
            <Pressable
              style={styles.dropdownItem}
              onPress={() => {
                console.log("Edit");
                handleCloseDropdown();
              }}
            >
              <Text>Edit</Text>
            </Pressable>
            <Pressable
              style={styles.dropdownItem}
              onPress={() => {
                console.log("Delete");
                handleCloseDropdown();
              }}
            >
              <Text>Delete</Text>
            </Pressable>
            <Pressable
              style={styles.dropdownItem}
              onPress={handleCloseDropdown}
            >
              <Text>Ignore</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  dropdownMenu: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    position: "absolute",
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default CategoryViewItem;
