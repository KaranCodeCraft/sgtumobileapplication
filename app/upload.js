import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import ApiContext from "@/context/ApiContext";
import axios from "axios";
import { Buffer } from "buffer";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";

const UploadDocuments = () => {
  const { token, user, url } = useContext(ApiContext);
  const studentId = user?._id;
   const [photo, setPhoto] = useState(null);
  const [documents, setDocuments] = useState({
    aadhar: { uploaded: false, uri: null },
    pan: { uploaded: false, uri: null },
    interMarksheet: { uploaded: false, uri: null },
  });

  const documentDownloadUrl =
    "https://api.sikkimglobaltechnicaluniversity.co.in/student/document-download";
  const photoUploadUrl =
    "https://api.sikkimglobaltechnicaluniversity.co.in/student/photo-upload";
  const documentUploadUrl =
    "https://api.sikkimglobaltechnicaluniversity.co.in/student/document-upload";


  const fetchPhoto = async () => {
    try {
      const response = await axios.get(
        `${url}student/photo-download?studentId=${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "arraybuffer", // Get raw binary data
        }
      );

      // Convert binary image to base64 format
      const base64Image = `data:image/jpeg;base64,${Buffer.from(
        response.data,
        "binary"
      ).toString("base64")}`;

      setPhoto(base64Image);
    } catch (error) {
      console.error("Error fetching photo:", error);
    }
  };

 const fetchDocument = async (docName) => {
    try {
     const response = await axios.get(documentDownloadUrl, {
       params: { studentId, docName },
       headers: { Authorization: `Bearer ${token}` },
       responseType: "arraybuffer",
     });

     // Convert ArrayBuffer to Base64
     const base64String = Buffer.from(response.data, "binary").toString(
       "base64"
     );
     const uri = `data:application/pdf;base64,${base64String}`;

     setDocuments((prev) => ({ ...prev, [docName]: { uploaded: true, uri } }));
   } catch (error) {
    //  console.error(`Failed to fetch ${docName}:`, error);
     setDocuments((prev) => ({
       ...prev,
       [docName]: { uploaded: false, uri: null },
     }));
   }
 };


  useEffect(() => {
      fetchPhoto();
      fetchDocument("aadhar");
      fetchDocument("pan");
      fetchDocument("interMarksheet");
    
  }, []);

  const handlePhotoUpload = async () => {    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      formData.append("studentId", studentId);

      try {
        await axios.post(photoUploadUrl, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        await fetchPhoto();
        Alert.alert("Success", "Photo uploaded successfully");
      } catch (error) {
        Alert.alert("Upload failed", error.message);
      }
    }
  };

  const handleDocumentUpload = async (docName) => {
    try {
      console.log("1: Opening Document Picker...");
      let result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.canceled) {
        console.log("2: Document picking was canceled.");
        return;
      }

      console.log("2: Document picked successfully.");

      const uri = result.assets[0].uri;
      console.log("3: File URI:", uri);

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: `${docName}.pdf`,
        type: "application/pdf",
      });
      formData.append("studentId", studentId);
      formData.append("docName", docName);

      console.log("4: FormData created", formData);

      const response = await axios.post(documentUploadUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("5: Upload Response", response.data);

      await fetchDocument(docName);
      Alert.alert("Success", "Document uploaded successfully");
    } catch (error) {
      console.error(
        "Error uploading document:",
        error.response ? error.response.data : error.message
      );

      if (error.response) {
        console.log("6: Error Response Data:", error.response.data);
        console.log("7: Error Status Code:", error.response.status);
        console.log("8: Error Headers:", error.response.headers);
      }

      Alert.alert("Upload failed", error.message);
    }
  };


  const handleViewPDF = async (base64Uri) => {
    // console.log("View PDF clicked");

    if (!base64Uri) return;

    try {
      const fileUri = `${FileSystem.cacheDirectory}temp.pdf`;

      // Write base64 data to a file
      await FileSystem.writeAsStringAsync(fileUri, base64Uri.split(",")[1], {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (Platform.OS === "android") {
        // Print the PDF file
        await Print.printAsync({ uri: fileUri });
      } else {
        // iOS also supports direct printing
        await Print.printAsync({ uri: fileUri });
      }
    } catch (error) {
      console.error("Error printing PDF:", error);
    }
  };

  return (
    <ScrollView>
      {/* Photo Section */}
      <View className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <Text className="text-lg font-bold mb-2">Student Photo</Text>
        {photo ? (
          <Image
            source={{
              uri: photo || "https://via.placeholder.com/150",
            }}
            className="w-24 h-24 rounded-lg mb-2"
          />
        ) : (
          <Text className="text-gray-500 mb-2">No photo uploaded</Text>
        )}
        <TouchableOpacity
          className="bg-blue-500 py-2 px-4 rounded-lg items-center"
          onPress={handlePhotoUpload}
        >
          <Text className="text-white font-bold">Upload Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Aadhar Section */}
      <View className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <Text className="text-lg font-bold mb-2">Aadhar Card</Text>
        {documents.aadhar.uploaded ? (
          <TouchableOpacity
            className="flex-row items-center mb-2"
            onPress={() => handleViewPDF(documents.aadhar.uri)}
          >
            <Ionicons name="document" size={24} color="blue" />
            <Text className="text-blue-500 ml-2">View Aadhar</Text>
          </TouchableOpacity>
        ) : (
          <Text className="text-gray-500 mb-2">No Aadhar uploaded</Text>
        )}
        <TouchableOpacity
          className="bg-blue-500 py-2 px-4 rounded-lg items-center"
          onPress={() => handleDocumentUpload("aadhar")}
        >
          <Text className="text-white font-bold">Upload Aadhar</Text>
        </TouchableOpacity>
      </View>

      {/* PAN Section */}
      <View className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <Text className="text-lg font-bold mb-2">PAN Card</Text>
        {documents.pan.uploaded ? (
          <TouchableOpacity
            className="flex-row items-center mb-2"
            onPress={() => handleViewPDF(documents.pan.uri)}
          >
            <Ionicons name="document" size={24} color="blue" />
            <Text className="text-blue-500 ml-2">View PAN</Text>
          </TouchableOpacity>
        ) : (
          <Text className="text-gray-500 mb-2">No PAN uploaded</Text>
        )}
        <TouchableOpacity
          className="bg-blue-500 py-2 px-4 rounded-lg items-center"
          onPress={() => handleDocumentUpload("pan")}
        >
          <Text className="text-white font-bold">Upload PAN</Text>
        </TouchableOpacity>
      </View>

      {/* Intermarksheet Section */}
      <View className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <Text className="text-lg font-bold mb-2">Inter Marksheet</Text>
        {documents.interMarksheet.uploaded ? (
          <TouchableOpacity
            className="flex-row items-center mb-2"
            onPress={() => handleViewPDF(documents.interMarksheet.uri)}
          >
            <Ionicons name="document" size={24} color="blue" />
            <Text className="text-blue-500 ml-2">View Marksheet</Text>
          </TouchableOpacity>
        ) : (
          <Text className="text-gray-500 mb-2">No Marksheet uploaded</Text>
        )}
        <TouchableOpacity
          className="bg-blue-500 py-2 px-4 rounded-lg items-center"
          onPress={() => handleDocumentUpload("interMarksheet")}
        >
          <Text className="text-white font-bold">Upload Marksheet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UploadDocuments;