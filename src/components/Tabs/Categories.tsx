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
import postNewData from "@/api/postNewData";
import updateTransactionData from "@/api/updateTransactionData";
updateTransactionData;
import { useCategory } from "@/context/CategoryContext";
interface Category {
  id: string;
  transactionType: string;
  name: string;
  icon: string;
}

interface CategoriesProps {
  setIsCategoriesScreenFocused: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteSuccess: () => void;
}

const Categories: React.FC<CategoriesProps> = ({
  setIsCategoriesScreenFocused,
  onDeleteSuccess,
}) => {
  const { authUser, setAuthUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedCategoryId, setEditedCategoryId] = useState<string | null>(null);
  // const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState<Category>({
    transactionType: "Income",
    name: "",
    icon: "attach-money",
  });
  const { contextCategories, setContextCategories } = useCategory();
  const icons = [
    "attach-money",
    "money-off",
    "euro-symbol",
    "account-balance-wallet",
    "Income-card",
  ];

  useFocusEffect(
    useCallback(() => {
      console.log("Categories is focused");
      setIsCategoriesScreenFocused(true);
      // console.log("categories:", categories);

      return () => {
        console.log("Categories is unfocused");
        setIsCategoriesScreenFocused(false);
      };
    }, [contextCategories])
  );

  useEffect(() => {
    fetchingDataApi();
  }, []);

  const fetchingDataApi = async () => {
    try {
      const response = await fetchDataApi("categories", authUser);
      if (response.status === 200 || response.status === 201) {
        // console.log(response.data);
        setIsLoading(false);
        // setCategories(response.data);
        setContextCategories(response.data);
      } else {
        console.error("Failed to fetch categories:", response.error);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = () => {
    console.log("Add button pressed");
    setModalVisible(true);
  };

  const handleSaveCategory = async () => {
    if (!newCategory.name || !newCategory.icon) {
      alert("Please fill in all fields.");
      return;
    }

    // Check if a category with the same type and name already exists
    const categoryExists = contextCategories.some(
      (category) =>
        category.transactionType === newCategory.transactionType &&
        category.name.toLowerCase() === newCategory.name.toLowerCase()
    );

    if (categoryExists) {
      alert("Category already exists.");
      return;
    }

    setIsLoading(true);
    const updatedCategory = { ...newCategory, userId: authUser };
    console.log(updatedCategory);
    try {
      await postNewData("categories", updatedCategory);
      // Refresh categories list after adding a new category
      fetchingDataApi();
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setIsLoading(false);
    }

    setModalVisible(false);
    setNewCategory({
      transactionType: "Income",
      name: "",
      icon: "attach-money",
    });
  };

  const handleDeleteSuccess = () => {
    fetchingDataApi(); // Refresh category list after deletion
    // onDeleteSuccess(); // Notify parent component about successful deletion
  };

  const handleEditCategory = (categoryId: string) => {
    const editedCategory = contextCategories.find(
      (category) => category.id === categoryId
    );

    if (editedCategory) {
      setNewCategory(editedCategory);
      setIsEditMode(true); // Set edit mode to true
      setModalVisible(true);
      setEditedCategoryId(categoryId); // Store the id of the edited category
    } else {
      console.log("Category not found");
    }
  };

  const handleUpdateCategory = async () => {
    if (!newCategory.name || !newCategory.icon) {
      alert("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    const updatedCategory = { ...newCategory, userId: authUser };
    console.log(updatedCategory);
    try {
      if (editedCategoryId) {
        await updateTransactionData(
          "categories",
          editedCategoryId,
          updatedCategory
        ); // Use editedCategoryId
      }
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setIsLoading(false);
      fetchingDataApi();
    }
    setModalVisible(false);
    setNewCategory({
      transactionType: "Income",
      name: "",
      icon: "attach-money",
    });
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
          {contextCategories
            .filter((category) => category.transactionType === "Income")
            .map((category) => (
              <CategoryViewItem
                key={category.id}
                category={category}
                userId={authUser}
                iconName={category.icon}
                onDeleteSuccess={handleDeleteSuccess}
                onEditPress={handleEditCategory}
              />
            ))}
        </View>
        <View style={styles.categorySection}>
          <Text style={styles.sectionHeader}>Expense Categories</Text>
          {contextCategories
            .filter((category) => category.transactionType === "Expense")
            .map((category) => (
              <CategoryViewItem
                key={category.id}
                category={category}
                userId={authUser}
                iconName={category.icon}
                onDeleteSuccess={handleDeleteSuccess}
                onEditPress={handleEditCategory}
              />
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
                    <Text style={styles.inputLabel}>transactionType:</Text>
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
                    {isEditMode ? (
                      <Pressable
                        style={[styles.button, styles.buttonUpdate]} // Add a new style for update button
                        onPress={handleUpdateCategory} // Call handleUpdateCategory when update button is pressed
                      >
                        <Text style={styles.textStyle}>Update</Text>
                        {/* Change button text to Update */}
                      </Pressable>
                    ) : (
                      <Pressable
                        style={[styles.button, styles.buttonSave]} // Use buttonSave style for Save button
                        onPress={handleSaveCategory}
                      >
                        <Text style={styles.textStyle}>Save</Text>
                        {/* Button text remains Save for new category */}
                      </Pressable>
                    )}
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
  buttonUpdate: {
    backgroundColor: "green",
  },
});

export default Categories;
