import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import ApiContext from "@/context/ApiContext";

const Notifications = () => {
  const { url, token, notification, fetchnotifcation } = useContext(ApiContext);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        fetchnotifcation();
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (noti) => {
    setSelectedNotification(noti);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-gray-600 text-lg mt-2">
          Fetching Notifications...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-center text-2xl font-bold text-orange-500 mb-4">
        Notifications
      </Text>
      {notification.length > 0 ? (
        <FlatList
          data={notification}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleNotificationClick(item)}>
              <View className="bg-white rounded-lg p-4 mb-4 shadow">
                <Text className="text-lg font-semibold text-gray-800">
                  {item.title}
                </Text>
                <Text className="text-gray-600 mt-1">
                  {item.message.split(" ").slice(0, 10).join(" ")}...
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text className="text-center text-gray-500 text-lg">
          No notifications available.
        </Text>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-11/12 rounded-lg p-6">
            <Text className="text-xl font-bold text-gray-800 mb-2">
              {selectedNotification?.title}
            </Text>
            <Text className="text-gray-700 mb-4">
              {selectedNotification?.description}
            </Text>
            <TouchableOpacity
              className="bg-blue-500 px-6 py-2 rounded-md"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Notifications;