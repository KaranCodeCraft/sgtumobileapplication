import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";

const Marksheet = () => {
  const [marksheet, setMarksheet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarksheet = async () => {
      try {
        // Replace with your API call to fetch marksheet
        const dummyData = [
          { id: "1", subject: "Mathematics", marks: "95/100" },
          { id: "2", subject: "Physics", marks: "88/100" },
          { id: "3", subject: "Chemistry", marks: "92/100" },
          { id: "4", subject: "Sonali", marks: "Franchisee Manager" },
        ];
        setMarksheet(dummyData);
      } catch (error) {
        console.error("Error fetching marksheet:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarksheet();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Fetching Marksheet...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Marksheet</Text>
      {marksheet.length > 0 ? (
        <FlatList
          data={marksheet}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.subject}</Text>
              <Text style={styles.cardDescription}>Marks: {item.marks}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No marks available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});

export default Marksheet;