// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZ_RNMcSCj_pOk8hBpVE8xn14pIq9gg4M",
  authDomain: "mymoney-auth-ts.firebaseapp.com",
  projectId: "mymoney-auth-ts",
  storageBucket: "mymoney-auth-ts.appspot.com",
  messagingSenderId: "858934085043",
  appId: "1:858934085043:web:c9769ddf42087daa21b7c6",
  measurementId: "G-WFDJLL1QRK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
// let app, auth;

// if (!getApps().length) {
//   try {
//     app = initializeApp(firebaseConfig);
//     auth = initializeAuth(app, {
//       persistence: getReactNativePersistence(AsyncStorage),
//     });
//   } catch (error) {
//     console.log("Error initializing app: " + error);
//   }
// } else {
//   app = getApp();
//   auth = getAuth(app);
// }

// const db = getFirestore(app);

export { db, auth };

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
