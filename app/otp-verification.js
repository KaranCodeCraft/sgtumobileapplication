import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import ApiContext from "@/context/ApiContext";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const OtpVerification = () => {
  const router = useRouter();
  const { url } = useContext(ApiContext);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); 
  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      return Alert.alert("Please enter a valid 6-digit OTP");
    }
    try {
      const reference_id = await SecureStore.getItemAsync("referenceId");
      setLoading(true);

      let data = {
        otp,
        reference_id,
      };
      const response = await axios.post(`${url}student/verifyOtp`, data);

      if (response.status === 200) {
        Alert.alert("OTP Verified Successfully");
        router.push("/home"); 
      } else {
        Alert.alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        Alert.alert(error.response.data.message);
      } else {
        Alert.alert("Something went wrong. Please try again.");
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-6">
      {/* OTP Input Section */}
      <Text className="text-blue-600 font-bold text-2xl mb-4">Enter OTP</Text>

      <TextInput
        placeholder="Enter OTP"
        className="w-4/5 h-12 border border-gray-400 mb-4 px-4 rounded-lg bg-white shadow"
        onChangeText={setOtp}
        value={otp}
        keyboardType="numeric"
        maxLength={6} // Ensure OTP is 6 digits
      />

      {/* Submit OTP */}
      <TouchableOpacity
        className="w-4/5 mt-6 flex justify-center items-center bg-orange-400 py-2 px-6 rounded-lg"
        onPress={handleOtpSubmit}
        disabled={loading} // Disable while waiting for API response
      >
        <Text className="text-white font-bold text-lg">
          {loading ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      {/* Resend OTP */}
      {/* <TouchableOpacity
        className="w-4/5 mt-4 flex justify-center items-center bg-blue-500 py-2 px-6 rounded-lg"
        onPress={handleResendOtp}
        disabled={timer > 0} 
      >
        <Text className="text-white font-bold text-lg">
          {timer === 0 ? "Resend OTP" : `Resend OTP in ${timer}s`}
        </Text>
      </TouchableOpacity> */}

      {/* Redirect to Sign Up */}
      <Text
        className="text-center text-gray-600 text-sm mt-4"
        onPress={() => router.push("/signup")}
      >
        Didn't receive OTP?{" "}
        <Text className="text-blue-600 font-medium">Try Again</Text>
      </Text>
    </View>
  );
};

export default OtpVerification;