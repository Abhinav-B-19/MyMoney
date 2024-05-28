import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "@/context/UserContext";

const ProfileScreen: React.FC = () => {
  const [authUser, setAuthUser] = useState<any>(null);
  const { userCountry, userCurrency } = useUserContext();
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        console.log(`Successfully fetched user data: ${user.uid}`);
      } else {
        // User is signed out
        setAuthUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              const auth = getAuth();
              await signOut(auth);
            } catch (error) {
              console.error("Error signing out:", error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile Page</Text>
      </View>

      {authUser ? (
        <View style={styles.userInfo}>
          <Text style={styles.userDetail}>
            Email:{" "}
            <Text style={styles.userDetailValue}>
              {authUser.email ?? "Not provided"}
            </Text>
          </Text>
          <Text style={styles.userDetail}>
            Email Verified:{" "}
            <Text style={styles.userDetailValue}>
              {authUser.emailVerified ? "Yes" : "No"}
            </Text>
          </Text>
          <Text style={styles.userDetail}>
            Display Name:{" "}
            <Text style={styles.userDetailValue}>
              {authUser.displayName ?? "Not provided"}
            </Text>
          </Text>
          <Text style={styles.userDetail}>
            Phone Number:{" "}
            <Text style={styles.userDetailValue}>
              {authUser.phoneNumber ?? "Not provided"}
            </Text>
          </Text>
          <Text style={styles.userDetail}>
            Photo URL:{" "}
            {authUser.photoURL ? (
              <Image
                source={{ uri: authUser.photoURL }}
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.userDetailValue}>Not provided</Text>
            )}
          </Text>
          <Text style={styles.userDetail}>
            Creation Time:{" "}
            <Text style={styles.userDetailValue}>
              {authUser.metadata.creationTime
                ? new Date(authUser.metadata.creationTime).toLocaleString()
                : "Not available"}
            </Text>
          </Text>
          <Text style={styles.userDetail}>
            Last Sign-In Time:{" "}
            <Text style={styles.userDetailValue}>
              {authUser.metadata.lastSignInTime
                ? new Date(authUser.metadata.lastSignInTime).toLocaleString()
                : "Not available"}
            </Text>
          </Text>
          <Text style={styles.userDetail}>
            Country:{" "}
            <Text style={styles.userDetailValue}>
              {userCountry ?? "Not provided"}
            </Text>
          </Text>
          <Text style={styles.userDetail}>
            Currency:{" "}
            <Text style={styles.userDetailValue}>
              {userCurrency ?? "Not provided"}
            </Text>
          </Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading user information...</Text>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleSignout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 20,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 35,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  userInfo: {
    marginTop: 20,
  },
  userDetail: {
    fontSize: 18,
    marginVertical: 5,
    color: "#555",
  },
  userDetailValue: {
    fontWeight: "bold",
    color: "#000",
  },
  loadingText: {
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: "#ff5252",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default ProfileScreen;
