import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
        const storedToken = await SecureStore.getItemAsync("token");
        setToken(storedToken);
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading your panel...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.greetingText}>Welcome, {user || "Student"}!</Text>
      <Text style={styles.subText}>Choose an option below:</Text>

      <View style={styles.optionContainer}>
        {/* Notifications */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("./notifications")}
        >
          <Ionicons name="notifications" size={50} color="#4CAF50" />
          <Text style={styles.cardText}>Notifications</Text>
        </TouchableOpacity>

        {/* View Marksheet */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("./marksheet")}
        >
          <Ionicons name="document-text" size={50} color="#2196F3" />
          <Text style={styles.cardText}>View Marksheet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    color: "#555",
  },
  logoutButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#ff5252",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    width: 140,
    height: 140,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
    color: "#555",
  },
});

export default StudentPanel;
