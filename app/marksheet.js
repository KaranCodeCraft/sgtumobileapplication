import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import axios from "axios";
import ApiContext from "@/context/ApiContext";

const Marksheet = () => {
  const [marksheet, setMarksheet] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url, id } = useContext(ApiContext);

  useEffect(() => {
    const fetchMarksheet = async () => {
      try {
        const result = await axios.get(`${url}/result/${id}`);
        setMarksheet(result.data.result);
      } catch (error) {
        console.error("Error fetching marksheet:", error);
        Alert.alert("Error", "Failed to fetch marksheet data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarksheet();
  }, [url, id]);

  const handleViewDetails = (semesterNumber) => {
    Alert.alert(
      "Semester Details",
      `Viewing details for Semester: ${semesterNumber}`
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-lg text-gray-700 mt-4">
          Fetching Marksheet...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-xl font-bold text-gray-800 mb-4">Marksheet</Text>
      {marksheet.length > 0 ? (
        <FlatList
          data={marksheet}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="p-4 bg-white mb-2 rounded-lg shadow flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-semibold text-gray-700">
                  Semester: {item.semesterNumber}
                </Text>
                <Text className="text-base text-gray-600">
                  Result: {item.status}
                </Text>
              </View>
              <Button
                title="View"
                onPress={() => handleViewDetails(item.semesterNumber)}
              />
            </View>
          )}
        />
      ) : (
        <Text className="text-base text-gray-600 text-center">
          No marks available.
        </Text>
      )}
    </View>
  );
};

export default Marksheet;
