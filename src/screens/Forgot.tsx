import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS } from "@/constants/colors";
import { auth } from "../firebase/firebase";
import { Feather } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState<string>("");

  const handlePassword = async () => {
    await sendPasswordResetEmail(auth, email)
      .then(() => alert("password reset email sent 🚀"))
      .catch((error: any) => console.log(error.message));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/forgot.png")}
          style={{ width: 300, height: 220 }}
        />
      </View>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.text}>Forgot your password?</Text>
        </View>
        <View style={styles.emailContainer}>
          <Feather
            name="mail"
            size={20}
            color="gray"
            style={{ marginLeft: 15 }}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter email address here"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={false}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handlePassword}
        >
          <Text style={styles.send}>Send password reset link</Text>
        </TouchableOpacity>
        <View style={styles.spam}>
          <Text style={{ fontSize: 12, color: "#000", fontWeight: "400" }}>
            Check your email spam folder to find password reset link
          </Text>
        </View>
        {/* Buttons for navigating to login and signup screens */}
        <View style={styles.navigationButtonsContainer}>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.navigationButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.navigationButtonText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: "8%",
  },
  imageContainer: {
    marginTop: 55,
  },
  emailContainer: {
    marginTop: 15,
    width: "100%",
    height: 50,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: COLORS.DARK,
    fontSize: 16,
    paddingHorizontal: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: "5%",
    width: "100%",
    height: 50,
    backgroundColor: COLORS.ACCENT,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    color: COLORS.WHITE,
    fontSize: 18,
  },
  send: {
    color: COLORS.WHITE,
    fontSize: 18,
  },
  spam: {
    marginTop: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 17,
    fontWeight: "bold",
  },
  formContainer: {
    width: "100%",
  },
  // Styles for navigation buttons
  navigationButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navigationButton: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  navigationButtonText: {
    color: COLORS.WHITE,
    fontWeight: "bold",
    fontSize: 16,
  },
});
