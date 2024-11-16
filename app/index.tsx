import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Button from "@/components/Button";
import { useRouter } from "expo-router";

const index = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
    // Handle login logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>SGTU Application</Text>
      <Button name="Login" onPress={handleLogin} />
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
