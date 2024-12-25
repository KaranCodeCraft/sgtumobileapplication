import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import ApiContext from "@/context/ApiContext";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

const StudentPanel = () => {
  const { user } = useContext(ApiContext); // Access the `user` from context
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null); // State to store token
  const [loading, setLoading] = useState<boolean>(true); // State for loading

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // const storedToken = await SecureStore.getItemAsync("token");
        // setToken(storedToken);
      } catch (error) {
        console.error("Error fetching token", error);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("token"); // Remove the token from secure storage
      Alert.alert("Logged Out", "You have been logged out successfully.");
      router.replace("/login"); // Navigate to login screen
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1  items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-lg text-gray-600 mt-4">
          Loading your panel...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 px-6">
      {/* University Logo */}
      <Image
        source={require("@/Assets/logo.png")}
        className="w-36 h-36 mb-6"
        resizeMode="contain"
      />

      {/* Logout Button */}
      <TouchableOpacity
        className="absolute top-10 right-6 bg-red-500 p-3 rounded-full shadow-md"
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Welcome Text */}
      <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
        Welcome, {user || "Student"}!
      </Text>
      <Text className="text-base text-gray-600 text-center mb-6">
        Choose an option below:
      </Text>

      {/* Options */}
      <View className="w-full flex flex-col items-baseline mb-2">
        {/* First Row of Buttons */}
        <View className="flex flex-row justify-between w-full px-6 py-2">
          {/* Notifications */}
          <TouchableOpacity
            className="w-36 h-36 bg-white rounded-lg justify-center items-center shadow-md"
            onPress={() => router.push("./notifications")}
          >
            <Ionicons name="notifications" size={50} color="#4CAF50" />
            <Text className="text-sm text-gray-700 mt-2 text-center">
              Notifications
            </Text>
          </TouchableOpacity>

          {/* View Marksheet */}
          <TouchableOpacity
            className="w-36 h-36 bg-white rounded-lg justify-center items-center shadow-md"
            onPress={() => router.push("./marksheet")}
          >
            <Ionicons name="document-text" size={50} color="#2196F3" />
            <Text className="text-sm text-gray-700 mt-2 text-center">
              View Marksheet
            </Text>
          </TouchableOpacity>
        </View>

        {/* Second Row of Buttons */}
        <View className="flex flex-row justify-between w-full px-6 py-2">
          {/* Upload Documents */}
          <TouchableOpacity
            className="w-36 h-36 bg-white rounded-lg justify-center items-center shadow-md"
            onPress={() => router.push("./upload")}
          >
            <Ionicons name="cloud-upload-outline" size={50} color="#FF9800" />
            <Text className="text-sm text-gray-700 mt-2 text-center">
              Upload Documents
            </Text>
          </TouchableOpacity>

          {/* Manage Subscription */}
          <TouchableOpacity
            className="w-36 h-36 bg-white rounded-lg justify-center items-center shadow-md"
            onPress={() => router.push("./subscription")}
          >
            <Ionicons name="person-add" size={50} color="#9C27B0" />
            <Text className="text-sm text-gray-700 mt-2 text-center">
              Manage Subscription
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StudentPanel;
