import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import deleteTransData from "@/api/deleteTransData";

interface Account {
  id: string;
  name: string;
  balance: number;
  icon: string;
  isIgnored: string;
  userId: string;
}

interface AccountCardProps {
  account: Account;
  onDeleteSuccess: () => void;
  onEditPress: (accountId: string) => void;
  onIgnorePress: (accountId: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onDeleteSuccess,
  onEditPress,
  onIgnorePress,
}) => {
  const { id, name, userId, balance, icon, isIgnored } = account;

  // Determine the color based on the balance value
  const balanceColor = balance < 0 ? "red" : "green";

  // Determine whether to show plus or minus
  const sign = balance >= 0 ? "+" : "-";

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const dropdownRef = useRef<View>(null);
  const cardStyle = isIgnored ? styles.ignoredCard : null;
  const titleStyle = isIgnored ? styles.ignoredTitle : null;

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

  const handleEditPress = () => {
    setIsDropdownVisible(false);
    onEditPress(id);
  };

  const handleDeletePress = () => {
    setIsDropdownVisible(false);
    // Show confirmation alert
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete this account?",
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
            const response = await deleteTransData("accounts", userId, id);
            if (response && response.status === 200) {
              onDeleteSuccess();
            } else {
              console.error(
                "Failed to delete account:",
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
    <View style={[styles.accountItem, cardStyle]}>
      <MaterialIcons name={icon} size={50} color="gray" />
      <View style={styles.accountDetails}>
        <Text style={[styles.accountName, titleStyle]}>{name}</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Balance:</Text>
          <Text style={[styles.balanceAmount, { color: balanceColor }]}>
            {`${sign} $${Math.abs(balance)}`}
          </Text>
        </View>
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
            <Pressable style={styles.dropdownItem} onPress={handleEditPress}>
              <Text>Edit</Text>
            </Pressable>
            <Pressable style={styles.dropdownItem} onPress={handleDeletePress}>
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
  accountItem: {
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
  accountDetails: {
    flex: 1,
    marginLeft: 10,
  },
  accountName: {
    fontSize: 16,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 16,
    color: "black",
    marginRight: 5,
  },
  balanceAmount: {
    fontSize: 16,
    marginTop: 5,
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
  ignoredCard: {
    opacity: 0.5,
  },
  ignoredTitle: {
    textDecorationLine: "line-through",
  },
});

export default AccountCard;
