import { View, Text, Image, StyleSheet, TextInput, Alert } from "react-native";
import React, { useContext, useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import ApiContext from "@/context/ApiContext";

const Login = () => {
  const {setUser} = useContext(ApiContext)
  const [aadhar , setAadhar] = useState("")
  const [mobile , setMobile] = useState("")

  const router = useRouter();
  const handleLogin = async() => {
    if(!aadhar||!mobile) return Alert.alert("Please fill all the fields")
    try {
      const response = await fetch(`https://api.sgtu.co.in/api/auth/local`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: aadhar,
          password: mobile,
        }),
      })
      const data = await response.json();
      if (response.status.toString() == "200") {
        setUser(data.user.username);
        Alert.alert(`Login Succesfull ${data.user.username}`);
        router.push("./home");
      } else {
        Alert.alert("Invalid Credentials");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Please try Again Later")
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
      <TextInput placeholder="Aadhar number" style={styles.input} onChangeText={(e)=>setAadhar(e)}/>
      <TextInput placeholder="Registered Mobile Number" style={styles.input} onChangeText={(e)=>setMobile(e)}/>
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