import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import ApiContext from "@/context/ApiContext";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

const Login = () => {
  const { setUser, url, verifyToken, setToken, setId } = useContext(ApiContext); // ApiContext provides API URL, user state, and token verification function
  const [aadharNumber, setaadharNumber] = useState(""); // State for Aadhar number
  const [enrollmentNumber, setEnrollmentNumber] = useState(""); // State for enrollment number
  const [isVerifying, setIsVerifying] = useState(true); // State to handle token verification
  const router = useRouter(); // Router for navigation
  const [logging, setLogging] = useState(false)

  // Function to handle login
  const handleLogin = async () => {
    if (!aadharNumber || !enrollmentNumber) {
      return Alert.alert("Please fill all the fields"); // Ensure all fields are filled
    }
    setLogging(true)
    try {
      // API call to login endpoint
      const response = await axios.post(`${url}student/login`, {
        enrollmentNumber,
        aadharNumber: Number(aadharNumber),
      });

      // Save token in SecureStore
      await SecureStore.setItemAsync("token", response.data.token.toString());
      await SecureStore.setItemAsync("id", response.data.id.toString());
      setToken(response.data.token)
      setId(response.data.id);
      // Set user state
      setUser(response.data.name);

      // Notify user of successful login
      Alert.alert(`Login Successful: ${response.data.name}`);
      setLogging(false)
      // Navigate to the home page
      router.push("/home");
    } catch (error) {
      // Handle API errors
      if (error.response) {
        Alert.alert(error.response.data.message); // Display API error message
      } else {
        Alert.alert("Something went wrong. Please try again."); // Handle general errors
      }
    }finally{
      setLogging(false);
    }
  };

  // Automatically verify token when component gains focus
  useFocusEffect(
    React.useCallback(() => {
      // Define the async function inside the effect
      const checkToken = async () => {
        try {
          const token = await SecureStore.getItemAsync("token"); // Retrieve token from SecureStore
          if (!token) {
            setIsVerifying(false); // Stop verifying if token is missing
            return;
          }

          const isValid = await verifyToken(token); // Call verifyToken function
          if (isValid) {
            router.push("/home"); // Navigate to the home page if token is valid
          }
        } catch (error) {
          console.error("Error verifying token:", error); // Log errors
        } finally {
          setIsVerifying(false); // Stop verifying
        }
      };

      checkToken(); // Call the async function
    }, [router, verifyToken]) // Dependencies
  );

  // Show loading spinner while verifying token
  if (isVerifying) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ fontSize: 18, marginTop: 20 }}>Verifying...</Text>
      </View>
    );
  }

  // Render login form
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-6">
      <View className="h-48 w-48 bg-white rounded-full overflow-hidden justify-center items-center mb-6">
        <Image
          source={require("@/Assets/logo.png")} // Path to logo image
          className="h-full w-10/12 bg-inherit"
          resizeMode="cover"
        />
      </View>
      <Text className="text-blue-600 font-bold text-2xl mb-4">Login Page</Text>
      <TextInput
        placeholder="Aadhar Number"
        className="w-4/5 h-14 border border-gray-700 mb-6 px-4 rounded-lg bg-white shadow"
        onChangeText={setaadharNumber} // Update Aadhar number state
        value={aadharNumber}
        keyboardType="number-pad"
      />
      <TextInput
        placeholder="Enrollment Number"
        className="w-4/5 h-14 border border-gray-700 mb-4 px-4 rounded-lg bg-white shadow"
        onChangeText={setEnrollmentNumber} // Update enrollment number state
        value={enrollmentNumber}
      />
      <TouchableOpacity
        className="w-4/5 mt-8 flex justify-center items-center bg-orange-400 py-3 px-6 rounded-lg"
        onPress={handleLogin} // Trigger login function
        disabled={logging}
      >
        <Text className="text-white font-bold text-lg">
          {logging ? "logging In" : "Login"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-4/5 mt-6 flex justify-center items-center bg-blue-500 py-3 px-6 rounded-lg"
        onPress={() => router.push("/signup")} // Navigate to sign-up page
        disabled={logging}
      >
        <Text className="text-white font-bold text-lg">Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
