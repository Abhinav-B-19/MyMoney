import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import deleteTransData from "@/api/deleteTransData";

interface Category {
  id: string;
  transactionType: string;
  name: string;
  icon: string;
  isIgnored: boolean;
}

interface CategoryViewItemProps {
  category: Category;
  userId: string;
  iconName: string;
  onDeleteSuccess: () => void;
  onEditPress: (categoryId: string) => void;
  onIgnorePress: (categoryId: string) => void;
}

const CategoryViewItem: React.FC<CategoryViewItemProps> = ({
  category,
  userId,
  iconName,
  onDeleteSuccess,
  onEditPress,
  onIgnorePress,
}) => {
  const { id, name, isIgnored } = category;

  const [isDropdownVisible, setIsDropdownVisible] = React.useState(false);
  const [popupPosition, setPopupPosition] = React.useState({ x: 0, y: 0 });
  const [dropdownWidth, setDropdownWidth] = React.useState(0);
  const dropdownRef = React.useRef<View>(null);

  const handleOpenDropdown = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setIsDropdownVisible(true);
    setPopupPosition({
      x: pageX + 35,
      y: pageY - 15,
    });
  };

  const handleCloseDropdown = () => {
    setIsDropdownVisible(false);
  };

  const handleEditDropdown = () => {
    setIsDropdownVisible(false);
    onEditPress(id);
  };

  const handleDeleteDropdown = () => {
    setIsDropdownVisible(false);
    // Show confirmation alert
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            // Perform delete action
            const response = await deleteTransData("categories", userId, id);
            if (response && response.status === 200) {
              onDeleteSuccess();
            } else {
              console.error(
                "Failed to delete category:",
                response ? response.error : "Unknown error"
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleIgnoreDropdown = () => {
    setIsDropdownVisible(false);
    onIgnorePress(id);
  };

  const onLayoutDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownWidth(width);
      });
    }
  };

  return (
    <View
      style={[styles.categoryItem, isIgnored && styles.ignoredCategoryItem]}
    >
      <View style={styles.leftSection}>
        <MaterialIcons
          name={iconName}
          size={24}
          color={isIgnored ? "#ccc" : "black"}
        />
        <Text
          style={[styles.categoryText, isIgnored && styles.ignoredCategoryText]}
        >
          {name}
        </Text>
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
            <Pressable style={styles.dropdownItem} onPress={handleEditDropdown}>
              <Text>Edit</Text>
            </Pressable>
            <Pressable
              style={styles.dropdownItem}
              onPress={handleDeleteDropdown}
            >
              <Text>Delete</Text>
            </Pressable>
            <Pressable
              style={styles.dropdownItem}
              onPress={handleIgnoreDropdown}
            >
              <Text>{isIgnored ? "Restore" : "Ignore"}</Text>
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
    backgroundColor: "white",
  },
  ignoredCategoryItem: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    marginLeft: 8,
    color: "black",
  },
  ignoredCategoryText: {
    textDecorationLine: "line-through",
    color: "#ccc",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  dropdownMenu: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "#ccc",
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default CategoryViewItem;
