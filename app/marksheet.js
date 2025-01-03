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
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import ApiContext from "@/context/ApiContext";

const Marksheet = () => {
  const [marksheet, setMarksheet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfUri, setPdfUri] = useState(null);
  const { url, id } = useContext(ApiContext);

 

  const handleDownloadAndShare = async (semesterNumber) => {
    try {
      const pdfUrl = `${url}result/${id}?semesterNumber=${semesterNumber}`;
      console.log("Downloading PDF from:", pdfUrl);

      // Define a path to save the file locally
      const downloadPath = `${FileSystem.documentDirectory}semester_${semesterNumber}.pdf`;

      // Download the file and save it to the local path
      const { uri } = await FileSystem.downloadAsync(pdfUrl, downloadPath);
      console.log("PDF downloaded to:", uri);

      // Share the file using expo-sharing
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Download Complete", "PDF saved to your device.");
      }
    } catch (error) {
      console.error("Error downloading and sharing PDF:", error);
      Alert.alert("Error", "Failed to download and share the PDF.");
    }
  };


   useEffect(() => {
     const fetchMarksheet = async () => {
       try {
         const result = await axios.get(`${url}result/${id}`);
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

  if (pdfUri) {
    return (
      <View className="flex-1">
        <WebView source={{ uri: pdfUri }} style={{ flex: 1 }} />
        <View className="p-4">
          <Button
            title="Back to Marksheet"
            onPress={() => setPdfUri(null)}
            color="#1d4ed8"
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-xl font-bold text-gray-800 mb-4">Marksheet</Text>
      {marksheet.length > 0 ? (
        <FlatList
          data={marksheet}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
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
                onPress={() => handleDownloadAndShare(item.semesterNumber)}
                color="#1d4ed8"
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
