import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Checkbox } from "react-native-paper";
import { useAppDispatch } from "../redux/redux-hooks";
import { COLORS } from "../constants/colors";
import { auth, db } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

interface Props {
  navigation: any;
}

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    });

    return unsubscribe;
  }, [navigation]);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userData = {
      firstName,
      lastName,
      userName: `${firstName} ${lastName}`,
      email,
      password,
    };

    setLoading(true);
    await createUserWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false);
        // alert("Account Created successfully :)");
        setDoc(doc(db, "users", user.uid), {
          Name: userData.userName,
          Email: userData.email,
          CreatedAt: new Date().toUTCString(),
        }).then(() => {
          alert("User Uploaded successfully :)");
        });
        // navigation.navigate("MoneyTrackerPage");
      })
      .catch((err: any) => {
        alert(err.message);
      });

    console.log("Sign up button pressed");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#003f5c"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#003f5c"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#003f5c"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#003f5c"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#003f5c"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>
          {loading ? "CREATING ACCOUNT...." : "SIGN UP"}
        </Text>
      </TouchableOpacity>
      <View style={styles.loginText}>
        <Text>Already a user?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginButton}>Login in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: COLORS.PRIMARY,
  },
  input: {
    width: "95%",
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLORS.WARNING,
  },
  button: {
    width: "95%",
    height: 50,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    flexDirection: "row",
    marginTop: 20,
  },
  loginButton: {
    marginLeft: 5,
    color: COLORS.PRIMARY,
    textDecorationLine: "underline",
  },
});

export default SignUpScreen;
