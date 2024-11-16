import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import ApiContext from "@/context/ApiContext"; // Import ApiContext

const Home = () => {
  const { url } = useContext(ApiContext); // Access the `url` from context

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome Student</Text>
      <Text style={styles.urlText}>API URL: {url}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  urlText: {
    fontSize: 16,
    color: "#555",
  },
});

export default Home;
