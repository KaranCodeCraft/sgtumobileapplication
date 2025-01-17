import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  Platform
} from "react-native";
import axios from "axios";
import ApiContext from "@/context/ApiContext";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const Marksheet = () => {
  const [marksheet, setMarksheet] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url, id } = useContext(ApiContext);

const handleDownload = async () => {
  const filename = "resultsem1.pdf";
  const result = await FileSystem.downloadAsync(
    `${url}result/676c09cd926a4033af2f1475?semesterNumber=1`,
    FileSystem.documentDirectory + filename
  );
  console.log("Download Result:", result);

  const mimetype = result.headers["content-type"] || "application/pdf"; // Fallback MIME type
  save(result.uri, filename, mimetype);
};

const downloadfromapi = async () => {
  const filename = "sgtu.pdf";
  const result = await FileSystem.downloadAsync(
    `${url}result/676c09cd926a4033af2f1475?semesterNumber=1`,
    FileSystem.documentDirectory + filename,
    {
      headers: {
        myheader: "Myvalue",
      },
    }
  );
  console.log("Download from API:", result);

  const mimetype = result.headers["content-type"] || "application/pdf"; // Fallback MIME type
  save(result.uri, filename, mimetype);
};

const save = async (uri, filename, mimetype) => {
  if (!mimetype) {
    mimetype = "application/pdf"; // Default MIME type
  }
  console.log("Saving file with MIME Type:", mimetype);

  if (Platform.OS === "android") {
    try {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          mimetype
        ).then(async (fileUri) => {
          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
          console.log("File saved to:", fileUri);
        });
      } else {
        console.warn("Permission denied. Sharing file...");
        Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error("Error saving file:", error);
    }
  } else {
    console.log("Sharing file on non-Android platform...");
    Sharing.shareAsync(uri);
  }
};


  useEffect(() => {
    const fetchMarksheet = async () => {
      try {
        const result = await axios.get(`${url}result/${id}`);
        setMarksheet(result.data.result);
      } catch (error) {
        console.error("Error fetching marksheet:", error);
        //  Alert.alert("Error", "Failed to fetch marksheet data.");
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

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-extrabold text-center mt-4 text-orange-500 underline mb-4">
        Marksheet
      </Text>
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
                onPress={() => downloadfromapi(item.semesterNumber)}
                color="#1d4ed8"
              />
              {/* <Button
                // title="Share"
                // onPress={() => handleDownload(item.semesterNumber)}
                // color="#1d4ed8"
              /> */}
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
