import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import ApiContext from "@/context/ApiContext";
import * as SecureStore from "expo-secure-store";
import Button from "@/components/Button";

const Login = () => {
  const { setUser } = useContext(ApiContext);
  const [aadhar, setAadhar] = useState("");
  const [mobile, setMobile] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    if (!aadhar || !mobile) {
      return Alert.alert("Please fill all the fields");
    }
    try {
      const response = await fetch(`https://api.sgtu.co.in/api/aadhaar-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aadhaarNumber: aadhar,
          enrollmentNumber: mobile,
        }),
      });

      const data = await response.json();

      if (response.status.toString() === "200") {
        await SecureStore.setItemAsync("token", data.token);
        setUser(data.user.name);
        Alert.alert(`Login Successful ${data.user.name}`);
        router.push("/home");
      } else {
        Alert.alert("Invalid Credentials");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Please try again later");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-6">
      <View className="h-48 w-48 bg-white rounded-full overflow-hidden justify-center items-center mb-6">
        <Image
          source={require("@/Assets/logo.png")}
          className="h-full w-10/12 bg-inherit"
          resizeMode="cover"
        />
      </View>
      <Text className="text-blue-600 font-bold text-2xl mb-4">Login Page</Text>
      <TextInput
        placeholder="Aadhar number"
        className="w-4/5 h-12 border border-gray-400 mb-4 px-4 rounded-lg bg-white shadow"
        onChangeText={setAadhar}
        value={aadhar}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Registration Number"
        className="w-4/5 h-12 border border-gray-400 mb-4 px-4 rounded-lg bg-white shadow"
        onChangeText={setMobile}
        value={mobile}
        keyboardType="numeric"
      />
      {/* <Button name={"login"} onPress={handleLogin} /> */}
      <TouchableOpacity
        className="w-4/5 mt-6 flex justify-center items-center bg-orange-400 py-2 px-6 rounded-lg"
        onPress={handleLogin}
      >
        <Text className="text-white font-bold text-lg">Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-4/5 mt-6 flex justify-center items-center bg-blue-500 py-2 px-6 rounded-lg"
        onPress={() => router.push("/signup")}
      >
        <Text className="text-white font-bold text-lg">Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;