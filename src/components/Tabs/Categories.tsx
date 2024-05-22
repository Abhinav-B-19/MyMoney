import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import CategoryViewItem from "../CategoryViewItem";
import fetchDataApi from "@/api/fetchDataApi";
import { useAuth } from "@/context/AuthContext";
import TaskActivityIndicator from "../TaskActivityIndicator";

interface Category {
  type: string;
  name: string;
  icon: string;
}

interface CategoriesProps {
  setIsCategoriesScreenFocused: React.Dispatch<React.SetStateAction<boolean>>;
}

const Categories: React.FC<CategoriesProps> = ({
  setIsCategoriesScreenFocused,
}) => {
  const { authUser, setAuthUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const fetchingDataApi = async () => {
    try {
      const response = await fetchDataApi("categories", authUser);
      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        setIsLoading(false);
        setCategories(response.data);
      } else {
        console.error("Failed to fetch transactions:", response.error);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const [categories, setCategories] = useState<Category[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState<Category>({
    type: "Income",
    name: "",
    icon: "attach-money",
  });

  const icons = [
    "attach-money",
    "money-off",
    "euro-symbol",
    "account-balance-wallet",
    "credit-card",
  ];

  useFocusEffect(
    useCallback(() => {
      console.log("Categories is focused");
      setIsCategoriesScreenFocused(true);
      console.log("categories:", categories);

      return () => {
        console.log("Categories is unfocused");
        setIsCategoriesScreenFocused(false);
      };
    }, [categories])
  );

  useEffect(() => {
    fetchingDataApi();
  }, []);

  const handleAddCategory = () => {
    console.log("Add button pressed");
    setModalVisible(true);
  };

  const handleSaveCategory = () => {
    setCategories([...categories, newCategory]);
    console.log(newCategory);
    setModalVisible(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <TaskActivityIndicator style={styles.loadingIndicator} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.categorySection}>
          <Text style={styles.sectionHeader}>Income Categories</Text>
          {categories
            .filter((category) => category.transactionType === "Income")
            .map((category) => (
              <CategoryViewItem key={category.id} category={category} />
            ))}
        </View>
        <View style={styles.categorySection}>
          <Text style={styles.sectionHeader}>Expense Categories</Text>
          {categories
            .filter((category) => category.transactionType === "Expense")
            .map((category) => (
              <CategoryViewItem key={category.id} category={category} />
            ))}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Text style={styles.addButtonText}>ADD NEW CATEGORY</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.modalContainer}>
              <Pressable
                onPress={(e) => {
                  // Check if the press is within the modal content
                  if (e.target === e.currentTarget) {
                    // Close the modal only if the press is on the overlay
                    setModalVisible(false);
                  }
                }}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Add New Category</Text>
                  <View style={styles.inputContainerRow}>
                    <Text style={styles.inputLabel}>Type:</Text>
                    <View style={styles.buttonGroup}>
                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          newCategory.transactionType === "Income" &&
                            styles.typeButtonActive,
                        ]}
                        onPress={() =>
                          setNewCategory({
                            ...newCategory,
                            transactionType: "Income",
                          })
                        }
                      >
                        <Text
                          style={[
                            styles.typeButtonText,
                            newCategory.transactionType === "Income" &&
                              styles.typeButtonTextActive,
                          ]}
                        >
                          Income
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          newCategory.transactionType === "Expense" &&
                            styles.typeButtonActive,
                        ]}
                        onPress={() =>
                          setNewCategory({
                            ...newCategory,
                            transactionType: "Expense",
                          })
                        }
                      >
                        <Text
                          style={[
                            styles.typeButtonText,
                            newCategory.transactionType === "Expense" &&
                              styles.typeButtonTextActive,
                          ]}
                        >
                          Expense
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.inputContainerRow}>
                    <Text style={styles.inputLabel}>Name:</Text>
                    <TextInput
                      style={styles.textInput}
                      value={newCategory.name}
                      onChangeText={(text) =>
                        setNewCategory({ ...newCategory, name: text })
                      }
                    />
                  </View>
                  <View style={styles.inputContainerRow}>
                    <Text style={styles.inputLabel}>Icon:</Text>
                    <ScrollView
                      horizontal
                      contentContainerStyle={styles.iconScrollContainer}
                    >
                      {icons.map((icon) => (
                        <TouchableOpacity
                          key={icon}
                          style={[
                            styles.iconContainer,
                            newCategory.icon === icon &&
                              styles.iconContainerActive,
                          ]}
                          onPress={() =>
                            setNewCategory({ ...newCategory, icon })
                          }
                        >
                          <MaterialIcons name={icon} size={24} color="black" />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.buttonRow}>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.textStyle}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, styles.buttonSave]}
                      onPress={handleSaveCategory}
                    >
                      <Text style={styles.textStyle}>Save</Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    marginTop: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 50,
  },
  categorySection: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "gray",
    paddingBottom: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 5,
    alignSelf: "center",
    backgroundColor: "blue",
    borderRadius: 10,
    width: "50%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#f0f0f0", // Light gray background
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputContainerRow: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    alignContent: "center",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  typeButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ccc",
    width: "48%",
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "blue",
  },
  typeButtonText: {
    fontSize: 16,
    color: "#000",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 8,
    width: "80%",
  },
  iconScrollContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 4,
  },
  iconContainerActive: {
    borderColor: "blue",
    backgroundColor: "#f0f8ff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonSave: {
    backgroundColor: "blue",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Categories;
