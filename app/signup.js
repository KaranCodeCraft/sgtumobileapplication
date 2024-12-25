import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import ApiContext from "@/context/ApiContext";
import * as SecureStore from "expo-secure-store";

const SignUp = () => {
  const router = useRouter();
  const [aadhar, setAadhar] = useState("");
  const [registration, setRegistration] = useState("");
  const { url } = useContext(ApiContext);

  const handleSignUp = async () => {
    if (!aadhar || !registration) {
      return Alert.alert("Please fill all the fields");
    }
    try {
      const response = await fetch(`${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aadhaarNumber: aadhar,
          enrollmentNumber: registration,
        }),
      });

      const data = await response.json();

      if (response.status.toString() === "200") {
        await SecureStore.setItemAsync("token", data.token);
        // Optionally, you could store user data if returned in the response
        Alert.alert(
          `Sign-Up Successful. OTP sent to your registered mobile number.`
        );
        // After the sign-up process, redirect to the OTP verification page
        router.push("/otp-verification");
      } else {
        Alert.alert("Failed to sign up. Please check your details.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("An error occurred. Please try again later.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-6">
      {/* Logo Section */}
      <View className="h-48 w-48 bg-white rounded-full overflow-hidden justify-center items-center mb-6">
        <Image
          source={require("@/Assets/logo.png")}
          className="h-full w-10/12 bg-inherit"
          resizeMode="cover"
        />
      </View>

      {/* Title */}
      <Text className="text-blue-600 font-bold text-2xl mb-4">Sign Up</Text>

      {/* Input Fields */}
      <TextInput
        placeholder="Aadhar Number"
        className="w-4/5 h-12 border border-gray-400 mb-4 px-4 rounded-lg bg-white shadow"
        onChangeText={setAadhar}
        value={aadhar}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Enrollment Number"
        className="w-4/5 h-12 border border-gray-400 mb-4 px-4 rounded-lg bg-white shadow"
        onChangeText={setRegistration}
        value={registration}
        keyboardType="numeric"
      />

      {/* OTP Information */}
      <Text className="text-gray-600 text-sm mb-4">
        OTP will be sent to your registered mobile number for verification.
      </Text>

      {/* Sign Up Button */}
      <TouchableOpacity
        className="w-4/5 mt-6 flex justify-center items-center bg-orange-400 py-2 px-6 rounded-lg"
        onPress={handleSignUp}
      >
        <Text className="text-white font-bold text-lg">Sign Up</Text>
      </TouchableOpacity>

      {/* Redirect to Login */}
      <Text
        className="text-center text-gray-600 text-sm mt-4"
        onPress={() => router.push("/login")}
      >
        Already have an account?
        <Text className="text-blue-600 font-medium">Login</Text>
      </Text>
    </View>
  );
};

export default SignUp;
