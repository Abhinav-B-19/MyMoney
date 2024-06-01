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
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import fetchDataApi from "@/api/fetchDataApi";
import { useAuth } from "@/context/AuthContext";
import TaskActivityIndicator from "../../TaskActivityIndicator";
import postNewData from "@/api/postNewData";
import updateTransactionData from "@/api/updateTransactionData";
import { useAccount } from "@/context/AccountContext";
import AccountCard from "./AccountCard";
import { useTransaction } from "@/context/TransactionContext";

interface Account {
  id: string;
  name: string;
  balance: number;
  icon: string;
  isIgnored: boolean;
}

interface AccountsProps {
  setIsAccountsScreenFocused: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteSuccess: () => void;
}

const Accounts: React.FC<AccountsProps> = ({
  setIsAccountsScreenFocused,
  onDeleteSuccess,
}) => {
  const { authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedAccountId, setEditedAccountId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAccount, setNewAccount] = useState<Account>({
    name: "",
    balance: 0,
    icon: "credit-card",
  });
  const { contextAccounts, setContextAccounts } = useAccount();
  const icons = [
    "account-balance",
    "account-circle",
    "account-balance-wallet",
    "credit-card",
    "attach-money",
    "savings",
  ];
  const { transactionsContext, setTransactionsContext } = useTransaction();
  // const [separatedTransactions, setSeparatedTransactions] = useState({});
  const [accountBalances, setAccountBalances] = useState({});

  useFocusEffect(
    useCallback(() => {
      console.log("Accounts is focused");
      setIsAccountsScreenFocused(true);
      const initialBalances = {};
      // Iterate over contextAccounts and populate initialBalances
      contextAccounts.forEach((account) => {
        initialBalances[account.name] = account.balance;
        console.log(initialBalances);
      });
      // Set the initial balances for accountBalance
      // setAccountBalances(initialBalances);

      // console.log("initial accountBalances: ", accountBalances);

      return () => {
        console.log("Accounts is unfocused");
        setIsAccountsScreenFocused(false);
      };
    }, [contextAccounts])
  );

  useEffect(() => {
    // const separated = separateTransactionsByAccount();
    // setSeparatedTransactions(separated);
    const balances = calculateBalances();
    setAccountBalances(balances);
    console.log("accountBalances: ", accountBalances);
  }, [transactionsContext, contextAccounts]);

  useEffect(() => {
    fetchingDataApi();
  }, []);

  const calculateBalances = () => {
    // Initialize the balances for each account
    const initialBalances = {};

    // Process each transaction
    transactionsContext
      .filter((transaction) => transaction.userId === authUser)
      .forEach((transaction) => {
        const amount = parseFloat(transaction.transactionAmount);

        // Update balances based on transaction type
        if (transaction.transactionType.toLowerCase() === "expense") {
          initialBalances[transaction.account] =
            (initialBalances[transaction.account] || 0) - amount;
        } else if (transaction.transactionType.toLowerCase() === "income") {
          initialBalances[transaction.account] =
            (initialBalances[transaction.account] || 0) + amount;
        } else if (transaction.transactionType.toLowerCase() === "transfer") {
          initialBalances[transaction.account] =
            (initialBalances[transaction.account] || 0) - amount;
          initialBalances[transaction.toAccount] =
            (initialBalances[transaction.toAccount] || 0) + amount;
        }
      });

    return initialBalances;
  };

  const fetchingDataApi = async () => {
    try {
      const response = await fetchDataApi("accounts", authUser);
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
        setContextAccounts(response.data);
      } else {
        console.error("Failed to fetch accounts:", response.error);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleAddAccount = () => {
    setNewAccount({
      name: "",
      balance: 0,
      icon: "account-balance",
    });
    setModalVisible(true);
  };

  const handleSaveAccount = async () => {
    if (!newAccount.name || !newAccount.icon) {
      alert("Please fill in all fields.");
      return;
    }

    const accountExists = contextAccounts.some(
      (account) => account.name.toLowerCase() === newAccount.name.toLowerCase()
    );

    if (accountExists) {
      alert("Account already exists.");
      return;
    }

    setIsLoading(true);
    const updatedAccount = {
      ...newAccount,
      userId: authUser,
      isIgnored: false,
    };
    try {
      await postNewData("accounts", updatedAccount);
      fetchingDataApi();
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setIsLoading(false);
    }

    setModalVisible(false);
    setNewAccount({
      name: "",
      balance: 0,
      icon: "account-balance",
    });
  };

  const handleDeleteSuccess = () => {
    fetchingDataApi();
  };

  const handleEditAccount = (accountId: string) => {
    const editedAccount = contextAccounts.find(
      (account) => account.id === accountId
    );
    console.log(editedAccount);

    if (editedAccount) {
      setNewAccount(editedAccount);
      setIsEditMode(true);
      setModalVisible(true);
      setEditedAccountId(accountId);
    } else {
      console.log("Account not found");
    }
  };

  const handleUpdateAccount = async () => {
    if (!newAccount.name || !newAccount.icon) {
      alert("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    const updatedAccount = { ...newAccount, userId: authUser };
    try {
      if (editedAccountId) {
        await updateTransactionData(
          "accounts",
          editedAccountId,
          updatedAccount
        );
      }
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setIsLoading(false);
      fetchingDataApi();
    }
    setModalVisible(false);
    setNewAccount({
      name: "",
      balance: 0,
      icon: "account-balance",
    });
  };

  const handleIgnoreAccount = (accountId: string) => {
    const editedAccount = contextAccounts.find(
      (account) => account.id === accountId
    );

    if (editedAccount?.isIgnored) {
      // Directly perform the operation if the account is already ignored
      const updatedAccount = {
        ...editedAccount,
        isIgnored: false, // Restore the account
      };

      updateAccount(updatedAccount, accountId);
    } else {
      // Show alert if the account is not ignored
      Alert.alert(
        "Ignore this account?",
        "Unless used, this account will not appear anywhere else. You can restore it at any time. Do you want to proceed?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              const updatedAccount = {
                ...editedAccount,
                isIgnored: true, // Ignore the account
              };

              updateAccount(updatedAccount, accountId);
            },
          },
        ]
      );
    }
  };

  const updateAccount = async (updatedAccount, accountId) => {
    try {
      await updateTransactionData("accounts", accountId, updatedAccount);

      setContextAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.id === accountId ? updatedAccount : account
        )
      );
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const totalBalance = contextAccounts.reduce(
    (total, account) => total + account.balance,
    0
  );

  const totalIncome = contextAccounts.reduce((total, account) => {
    if (account.balance > 0) {
      return total + account.balance;
    }
    return total;
  }, 0);

  const totalExpense = contextAccounts.reduce((total, account) => {
    if (account.balance < 0) {
      return total + account.balance;
    }
    return total;
  }, 0);

  const totalIncomeTrail = transactionsContext.reduce((total, transaction) => {
    if (transaction.transactionType.toLowerCase() === "income") {
      return total + parseFloat(transaction.transactionAmount);
    }
    return total;
  }, 0);

  const totalExpenseTrail = transactionsContext.reduce((total, transaction) => {
    if (transaction.transactionType.toLowerCase() === "expense") {
      return total + parseFloat(transaction.transactionAmount);
    }
    return total;
  }, 0);

  const totalBalanceTrail = totalIncomeTrail - totalExpenseTrail;

  console.log(
    "totalBalanceTrail: ",
    totalBalanceTrail,
    "totalIncomeTrail: ",
    totalIncomeTrail,
    "totalExpenseTrail: ",
    totalExpenseTrail
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <TaskActivityIndicator style={styles.loadingIndicator} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.sectionHeader}>Overall</Text>
        <View style={styles.overallSection}>
          <View style={styles.overallContainer}>
            <View style={styles.labelValuePairRow}>
              <View style={styles.labelValuePair}>
                <Text style={styles.overallLabel}>Expense so far:</Text>
                <Text style={[styles.overallValue, { color: "red" }]}>
                  ${totalExpense}
                </Text>
              </View>
              <View style={styles.verticalLine} />
              <View style={styles.labelValuePair}>
                <Text style={styles.overallLabel}>Income so far:</Text>
                <Text style={[styles.overallValue, { color: "green" }]}>
                  ${totalIncome}
                </Text>
              </View>
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.overallItem}>
              <View style={styles.labelValuePair}>
                <Text style={styles.overallLabel}>Total balance:</Text>
                <Text
                  style={[
                    styles.overallValue,
                    { color: totalBalance < 0 ? "red" : "green" },
                  ]}
                >
                  ${totalBalance}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.accountSection}>
          <Text style={styles.sectionHeader}>Accounts</Text>
          {contextAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              accountBalance={accountBalances[account.name]}
              onDeleteSuccess={handleDeleteSuccess}
              onEditPress={handleEditAccount}
              onIgnorePress={handleIgnoreAccount}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddAccount}>
          <Text style={styles.addButtonText}>ADD NEW ACCOUNT</Text>
        </TouchableOpacity>

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
                    if (e.target === e.currentTarget) {
                      setModalVisible(false);
                    }
                  }}
                >
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add New Account</Text>
                    <View style={styles.inputContainerRow}>
                      <Text style={styles.inputLabel}>Initial amount</Text>
                      <TextInput
                        style={styles.textInput}
                        value={String(newAccount.balance)} // Convert to string to display negative numbers properly
                        placeholder="0"
                        onChangeText={(text) =>
                          setNewAccount({
                            ...newAccount,
                            balance: parseFloat(text) || 0, // Parse float to handle negative numbers
                          })
                        }
                        keyboardType="numeric"
                      />
                    </View>
                    <Text style={styles.messageText}>
                      *Initial amount will not be reflected in analysis.
                    </Text>
                    <View style={styles.inputContainerRow}>
                      <Text style={styles.inputLabel}>Name</Text>
                      <TextInput
                        style={styles.textInput}
                        value={newAccount.name}
                        onChangeText={(text) =>
                          setNewAccount({ ...newAccount, name: text })
                        }
                      />
                    </View>
                    <View style={styles.iconContainerRow}>
                      <Text style={styles.inputLabel}>Icon </Text>
                      <ScrollView horizontal style={styles.iconScrollView}>
                        {icons.map((icon) => (
                          <TouchableOpacity
                            key={icon}
                            style={[
                              styles.iconContainer,
                              newAccount.icon === icon &&
                                styles.iconContainerActive,
                            ]}
                            onPress={() =>
                              setNewAccount({ ...newAccount, icon })
                            }
                          >
                            <MaterialIcons
                              name={icon}
                              size={24}
                              color="black"
                            />
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
                          style={[styles.button, styles.buttonUpdate]}
                          onPress={handleUpdateAccount}
                        >
                          <Text style={styles.textStyle}>Update</Text>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={[styles.button, styles.buttonSave]}
                          onPress={handleSaveAccount}
                        >
                          <Text style={styles.textStyle}>Save</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  overallSection: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "gray",
    paddingBottom: 4,
  },
  overallContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
  },
  overallItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  overallLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  overallValue: {
    fontSize: 16,
  },
  labelValuePairRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  labelValuePair: {
    flexDirection: "column",
    alignItems: "center",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    marginTop: 20,
  },
  horizontalLine: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  verticalLine: {
    borderLeftColor: "gray",
    borderLeftWidth: 1,
    marginHorizontal: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  },
  accountSection: {
    marginBottom: 16,
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  accountName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    position: "relative",
    bottom: 5,
    alignSelf: "center",
    backgroundColor: "#2196F3",
    borderRadius: 10,
    width: "50%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    // fontSize: 16,
    fontWeight: "bold",
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
    backgroundColor: "#fff",
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
    borderWidth: 1,
    borderColor: "#ccc",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainerRow: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    alignContent: "center",
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginRight: 10,
  },
  messageText: {
    color: "#666",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    width: "70%",
    fontSize: 16,
    color: "#333",
  },
  iconContainerRow: {
    width: "100%",
    alignItems: "center",
  },
  iconScrollView: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: 10,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 8,
    marginVertical: 8,
  },
  iconContainerActive: {
    borderColor: "blue",
    backgroundColor: "#f0f8ff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    padding: 14,
    elevation: 2,
    minWidth: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonClose: {
    backgroundColor: "red",
    borderColor: "red",
  },
  buttonSave: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  buttonUpdate: {
    backgroundColor: "green",
    borderColor: "green",
  },
  textStyle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Accounts;
