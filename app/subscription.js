import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UploadPageComingSoon = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Subscription Page Coming Soon!</Text>
        <Text style={styles.message}>We're working hard to bring you this feature. Stay tuned!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // Tailwind's bg-gray-100
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 24,
    backgroundColor: '#ffffff', // Tailwind's bg-white
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937', // Tailwind's text-gray-800
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#4b5563', // Tailwind's text-gray-600
  },
});

export default UploadPageComingSoon;