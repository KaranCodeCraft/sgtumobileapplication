import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import {
  User,
  Phone,
  Mail,
  BookOpen,
  CheckCircle,
  FileText,
} from "lucide-react-native";
import axios from "axios";
import { Buffer } from "buffer";
import ApiContext from "@/context/ApiContext";

const Profile = () => {
  const { user, token, url } = useContext(ApiContext);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📷 Fetch Profile Photo from API
  const fetchPhoto = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${url}student/photo-download?studentId=${user._id}`,
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
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Fetch photo on component mount
  useEffect(() => {
    fetchPhoto();
  }, []);

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-500 text-lg font-semibold">
          No student data available.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-6">
      {/* Profile Header */}
      <View className="items-center mb-8">
        <View className="w-36 h-36 rounded-full border-4 border-blue-500 shadow-lg overflow-hidden">
          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <Image
              source={{
                uri: photo || "https://via.placeholder.com/150",
              }}
              className="w-full h-full"
            />
          )}
        </View>
        <Text className="text-3xl font-bold text-gray-900 mt-4">
          {user.name}
        </Text>
        <Text className="text-lg text-gray-600">{user.enrollmentNumber}</Text>
      </View>

      {/* Student Details */}
      <View className="bg-gray-50 p-5 rounded-lg shadow-md mb-4">
        <Text className="text-xl font-semibold text-gray-800 mb-3 flex flex-row items-center">
          <User className="mr-2" /> Profile Information
        </Text>
        <DetailItem label="Aadhar Number" value={user.aadharNumber} />
        <DetailItem
          label="Mobile Number"
          value={user.mobileNumber}
          icon={Phone}
        />
        <DetailItem label="Email" value={user.email} icon={Mail} />
        <DetailItem label="Session" value={user.session} />
        <DetailItem label="Course" value={user.course} icon={BookOpen} />
        <DetailItem label="Stream" value={user.stream} />
      </View>

      {/* Registration & Subscription Details */}
      <View className="bg-gray-50 p-5 rounded-lg shadow-md mb-4">
        <Text className="text-xl font-semibold text-gray-800 mb-3 flex flex-row items-center">
          <CheckCircle className="mr-2" /> Registration & Subscription
        </Text>
        <DetailItem
          label="Registration Date"
          value={new Date(user.appRegisDetails?.date).toDateString()}
        />
        <DetailItem
          label="Registration Status"
          value={user.appRegisDetails?.status ? "Active" : "Inactive"}
        />
        <DetailItem
          label="Subscription Active"
          value={user.subscriptionDetails?.isActive ? "Yes" : "No"}
        />
        <DetailItem
          label="Subscription Expiry"
          value={new Date(user.subscriptionDetails?.expiryDate).toDateString()}
        />
      </View>

      {/* Uploaded Documents */}
      <View className="bg-gray-50 p-5 rounded-lg shadow-md">
        <Text className="text-xl font-semibold text-gray-800 mb-3 flex flex-row items-center">
          <FileText className="mr-2" /> Uploaded Documents
        </Text>
        <DetailItem
          label="Aadhar"
          value={user.document?.aadhar ? "Uploaded" : "Not Uploaded"}
        />
        <DetailItem
          label="PAN"
          value={user.document?.pan ? "Uploaded" : "Not Uploaded"}
        />
        <DetailItem
          label="Inter Marksheet"
          value={user.document?.interMarksheet ? "Uploaded" : "Not Uploaded"}
        />
      </View>
    </ScrollView>
  );
};

// 🎨 Reusable DetailItem Component for better UI
const DetailItem = ({ label, value, icon: Icon }) => (
  <View className="flex-row items-center mb-2">
    {Icon && <Icon className="text-blue-500 mr-2" size={18} />}
    <Text className="font-semibold text-gray-700">{label}: </Text>
    <Text className="text-gray-600">{value || "N/A"}</Text>
  </View>
);

export default Profile;
