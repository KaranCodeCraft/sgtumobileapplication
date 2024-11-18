import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from '@react-navigation/native';
import ApiContext from "@/context/ApiContext";

const index = () => {
  const { verifyToken } = useContext(ApiContext);
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  const checkToken = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      // Assume verifyToken is a function that verifies the token
      const isValid = await verifyToken(token);
      if (isValid) {
        Alert.alert('verification Sucessfull !!');
        router.push('/home');
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    setIsVerifying(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      checkToken();
    }, [])
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
      <Text style={styles.headerText}>loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, // Add padding to avoid content touching the edges
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default index;
