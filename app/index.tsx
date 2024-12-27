import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import ApiContext from "@/context/ApiContext";

const Index = () => {
  const { verifyToken } = useContext(ApiContext);
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  const checkToken = React.useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      // Alert.alert();
      if (token) {
        const isValid = await verifyToken(token);
        if (isValid) {
          // Alert.alert("Verification Successful!");
          router.push("/home");
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
      Alert.alert("Error", "An error occurred while verifying the token.");
    } finally {
      setIsVerifying(false);
    }
  }, [router, verifyToken]);

  useFocusEffect(
    React.useCallback(() => {
      checkToken();
    }, [checkToken])
  );

  if (isVerifying) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.headerText}>Verifying...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.headerText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Index;