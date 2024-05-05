import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Checkbox } from "react-native-paper";
import { useAppDispatch } from "../redux/redux-hooks";
import { COLORS } from "../constants/colors";
import { auth, db } from "@/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const { width, height } = Dimensions.get("window");

let top;
if (Platform.OS == "ios") {
  top = height * 0.02;
} else {
  top = 0;
}

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Reset the state when the component is focused (navigated back to)
      setEmail("");
      setPassword("");
    });

    return unsubscribe;
  }, [navigation]);

  const handleLoginPress = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false);
        alert("Login successful :)");
        // navigation.navigate("MoneyTrackerPage");
      })
      .catch((err) => {
        alert(err.message);
        setLoading(false);
      });
    console.log("login pressed");
  };

  return (
    <View style={styles.container}>
      {/* Replace text logo with image */}
      <Image
        source={require("../../assets/myMoney-logo.png")}
        style={styles.logo}
      />
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          value={email}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setPassword(text)}
          autoCapitalize="none"
          value={password}
        />
      </View>
      <View style={styles.forgotContainer}>
        <TouchableOpacity onPress={() => navigation.push("Forgot")}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLoginPress}>
        <Text style={styles.loginText}>{loading ? "LOADING" : "LOGIN"}</Text>
      </TouchableOpacity>
      {/* "Remember me" checkbox */}
      <View style={styles.rememberMeContainer}>
        <Checkbox.Android
          testID="checkboxTest"
          status={rememberMe ? "checked" : "unchecked"} // Use status prop to set checkbox state
          onPress={() => setRememberMe(!rememberMe)} // Toggle checkbox state onPress
        />
        <Text>Remember me</Text>
      </View>
      <View style={styles.signUpText}>
        <Text>New user?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signUpButton}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    backgroundColor: COLORS.WARNING,
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: COLORS.PRIMARY,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
  },
  signUpText: {
    flexDirection: "row",
    marginTop: 30,
  },
  forgotContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  forgotText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.Account,
  },
  signUpButton: {
    marginLeft: 5,
    color: COLORS.PRIMARY,
    textDecorationLine: "underline",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default LoginScreen;
