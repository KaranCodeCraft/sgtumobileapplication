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
import axios from "axios";

const SignUp = () => {
  const router = useRouter();
  const [aadharNumber, setaadharNumber] = useState("");
  const [enrollmentNumber, setenrollmentNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { url } = useContext(ApiContext);

  const handleSignUp = async () => {
    setIsSubmitting(true);
    try {
      let data = {
        enrollmentNumber,
        aadharNumber: Number(aadharNumber),
      };

      const response = await axios.post(`${url}student/register`, data);
      if (response.status === 200) {
        const referenceId = response.data.referenceId.toString();
        await SecureStore.setItemAsync(
          "referenceId",
          referenceId
        );
        Alert.alert("Success", response.data.message);
        router.push("/otp-verification");
      } else {
        Alert.alert("Error", "Unexpected response from the server.");
      }
    } catch (error) {
      if (error.response) {
        Alert.alert(error.response.data.message);
      } else {
        Alert.alert(error.message);
        Alert.alert("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
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
        onChangeText={setaadharNumber}
        value={aadharNumber}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Enrollment Number"
        className="w-4/5 h-12 border border-gray-400 mb-4 px-4 rounded-lg bg-white shadow"
        onChangeText={setenrollmentNumber}
        value={enrollmentNumber}
      />

      {/* OTP Information */}
      <Text className="text-gray-600 text-sm mb-4">
        OTP will be sent to your registered mobile number for verification.
      </Text>

      {/* Sign Up Button */}
      <TouchableOpacity
        className="w-4/5 mt-6 flex justify-center items-center bg-orange-400 py-2 px-6 rounded-lg"
        onPress={handleSignUp}
        disabled={isSubmitting}
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