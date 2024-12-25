import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const OtpVerification = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(""); // Store OTP input
  const [loading, setLoading] = useState(false); // For loading state
  const [timer, setTimer] = useState(30); // Timer to resend OTP after some time

  // Simulate OTP verification with an API call (adjust to your real API)
  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      return Alert.alert("Please enter a valid 6-digit OTP");
    }
    try {
      setLoading(true);
      // Simulating API request for OTP verification
      const response = await fetch("http://localhost:5000/student/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: otp, // Send the OTP entered by the user
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Assuming the API returns a token and a success message
        await SecureStore.setItemAsync("token", data.token);
        Alert.alert("OTP Verified Successfully");
        router.push("/home"); // Redirect to home after successful OTP verification
      } else {
        Alert.alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP logic (simulate resend by resetting timer)
  const handleResendOtp = () => {
    if (timer === 0) {
      // Reset the timer for resend
      setTimer(30);
      // Call an API to resend the OTP (simulating here)
      Alert.alert("OTP resent successfully");
    } else {
      Alert.alert(
        `Please wait for ${timer} seconds before requesting another OTP.`
      );
    }
  };

  // Timer countdown logic
  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval); // Cleanup timer when component unmounts
    }
  }, [timer]);

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
      <TouchableOpacity
        className="w-4/5 mt-4 flex justify-center items-center bg-blue-500 py-2 px-6 rounded-lg"
        onPress={handleResendOtp}
        disabled={timer > 0} // Disable resend if timer is not zero
      >
        <Text className="text-white font-bold text-lg">
          {timer === 0 ? "Resend OTP" : `Resend OTP in ${timer}s`}
        </Text>
      </TouchableOpacity>

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