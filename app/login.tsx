import { View, Text, Image, StyleSheet, TextInput, Alert } from "react-native";
import React, { useContext, useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import ApiContext from "@/context/ApiContext";
import * as SecureStore from "expo-secure-store";

const Login = () => {
  const { setUser } = useContext(ApiContext); // Use context to set user
  const [aadhar, setAadhar] = useState(""); // State to store aadhar number
  const [mobile, setMobile] = useState(""); // State to store mobile number

  const router = useRouter();

  const handleLogin = async () => {
    if (!aadhar || !mobile) {
      return Alert.alert("Please fill all the fields");
    }
    try {
      // Make the API call to login
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
        // Store token and set user in context
        // Alert.alert(data)
        await SecureStore.setItemAsync("token", data.token);
        setUser(data.user.name);
        Alert.alert(`Login Successful ${data.user.name}`);
        router.push("/home"); // Navigate to the home screen
      } else {
        Alert.alert("Invalid Credentials");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Please try again later");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("@/Assets/logo.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.title}>Login Page</Text>
      <TextInput
        placeholder="Aadhar number"
        style={styles.input}
        onChangeText={setAadhar}
        value={aadhar}
      />
      <TextInput
        placeholder="Registration Number"
        style={styles.input}
        onChangeText={setMobile}
        value={mobile}
      />
      <Button name={"login"} onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "grey",
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    padding: 20,
  },
  imageWrapper: {
    height: 200,
    width: 200,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    overflow: "hidden",
    marginBottom: 30,
  },
  image: {
    height: 200,
    width: 200,
  },
  title: {
    marginBottom: 20,
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});

export default Login;
