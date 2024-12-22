import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

const SignUp = () => {
  const router = useRouter();
  const [aadhar, setAadhar] = useState("");
  const [registration, setRegistration] = useState("");
  const [dob, setDob] = useState("");

  const handleSignUp = () => {
    if (!aadhar || !registration || !dob) {
      return Alert.alert("Please fill all the fields");
    }
    // Add signup logic here
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
        placeholder="Registration Number"
        className="w-4/5 h-12 border border-gray-400 mb-4 px-4 rounded-lg bg-white shadow"
        onChangeText={setRegistration}
        value={registration}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Date of Birth (DD/MM/YYYY)"
        className="w-4/5 h-12 border border-gray-400 mb-4 px-4 rounded-lg bg-white shadow"
        onChangeText={setDob}
        value={dob}
        keyboardType="default"
      />

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
      {/* <TouchableOpacity
        className="w-4/5 mt-6 flex justify-center items-center bg-blue-500 py-2 px-6 rounded-lg"
        onPress={() => router.push("/login")}
      >
        <Text className="text-white font-bold text-lg">Login</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default SignUp;