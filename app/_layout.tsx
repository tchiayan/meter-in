import { Stack } from "expo-router";
// Import the functions you need from the SDKs you need
import { initializeApp  } from "firebase/app";
//@ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFeBW-Jl9GZF5LYOXbNmvu5iU6634cj1w",
  authDomain: "check-in-steadcom.firebaseapp.com",
  projectId: "check-in-steadcom",
  storageBucket: "check-in-steadcom.appspot.com",
  messagingSenderId: "804570767049",
  appId: "1:804570767049:web:f75919ef7e6b91aea23718",
  measurementId: "G-PB3LP9XJWQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeAuth(app , {
  persistence: getReactNativePersistence(AsyncStorage)
});

if(process.env.NODE_ENV === 'production') {
  const analytics = getAnalytics(app);
}

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerTitle: "Meter Check In",
      headerStyle: {
        backgroundColor: "#000482"
      }, 
      headerTintColor: "white"
    }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
