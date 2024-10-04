import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";

export default function OrderDetail() {
  const { id } = useLocalSearchParams();
  const [pickupImages, setPickupImages] = useState<string[]>([]);
  const [deliveryImages, setDeliveryImages] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageType, setCurrentImageType] = useState<
    "pickup" | "delivery"
  >("pickup");
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.getCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.granted);
    })();
  }, []);

  const orderData = {
    orderId: "#1000858",
    status: "Giao hàng",
    weight: "10000 đ",
    pickupAddress: "Công Ty JAS",
    deliveryAddress: "hehehehe",
    cod: "90.000 đ",
    fee: "32.000 đ",
  };

  const openImagePicker = (imageType: "pickup" | "delivery") => {
    setCurrentImageType(imageType);
    setModalVisible(true);
  };

  const pickImage = async (source: "library" | "camera") => {
    let result: ImagePicker.ImagePickerResult | null = null;

    try {
      if (source === "library") {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }
      if (source === "camera") {
        console.log("Camera permission:", hasCameraPermission);

        if (hasCameraPermission == !true) {
          Alert.alert(
            "Permission Denied",
            "We need camera permissions to take photos."
          );
          return;
        }

        try {
          result = await ImagePicker.launchCameraAsync({
            cameraType: ImagePicker.CameraType.back,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
        } catch (cameraError) {
          console.error("Error using ImagePicker camera:", cameraError);
        }
      }
      if (result && !result.canceled && result.assets.length > 0) {
        const newImage = result.assets[0].uri;
        updateImages(newImage);
        setModalVisible(false);
      }
    } catch (error: any) {
      console.error("Error picking image:", error);
      Alert.alert(
        "Error",
        `There was an error selecting the image: ${error.message}`
      );
    }
  };

  const updateImages = (newImage: string) => {
    if (currentImageType === "pickup") {
      if (pickupImages.length < 3) {
        setPickupImages([...pickupImages, newImage]);
      } else {
        Alert.alert(
          "Limit Reached",
          "You can only upload up to 3 images for pickup."
        );
      }
    } else {
      if (deliveryImages.length < 3) {
        setDeliveryImages([...deliveryImages, newImage]);
      } else {
        Alert.alert(
          "Limit Reached",
          "You can only upload up to 3 images for delivery."
        );
      }
    }
  };

  const renderImageUploadSection = (imageType: "pickup" | "delivery") => {
    const images = imageType === "pickup" ? pickupImages : deliveryImages;
    const label = imageType === "pickup" ? "Nhận hàng:" : "Đã giao hàng:";

    return (
      <View className="mt-5">
        <Text className="mb-2 text-base text-gray-600">{label}</Text>
        <View className="flex-row flex-wrap">
          {images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              className="w-20 h-20 mb-2 mr-2 rounded-lg"
            />
          ))}
          {images.length < 3 && (
            <TouchableOpacity
              className="items-center justify-center w-20 h-20 border border-gray-300 rounded-lg"
              onPress={() => openImagePicker(imageType)}>
              <Ionicons name="camera" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const handleConfirm = () => {
    console.log("Confirm button pressed");
    console.log("Order ID:", id);
    console.log("Pickup Images:", pickupImages);
    console.log("Delivery Images:", deliveryImages);

    Alert.alert(
      "Confirmation",
      "Are you sure you want to confirm this order?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Confirmation cancelled"),
        },
        {
          text: "Confirm",
          onPress: () => {
            console.log("Order confirmed");
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar style="auto" />
      <ScrollView className="flex-1">
        <View className="p-4 m-2 bg-white rounded-lg shadow-md">
          <View className="flex-row items-center mb-4">
            <Ionicons name="document-text-outline" size={24} color="#FF6600" />
            <Text className="ml-2 text-lg font-bold text-orange-500">
              Đơn mới
            </Text>
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Mã đơn hàng:</Text>
            <Text className="text-base font-bold text-gray-800">{id} </Text>
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Trạng thái:</Text>
            <View className="px-3 py-1 bg-blue-100 rounded-full">
              <Text className="font-bold text-blue-600">
                {orderData.status}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Tiền thu hộ:</Text>
            <Text className="text-base font-bold text-gray-800">
              {orderData.cod}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Phí vận chuyển:</Text>
            <Text className="text-base font-bold text-gray-800">
              {orderData.fee}
            </Text>
          </View>

          <View className="mt-3">
            <Text className="mb-1 text-base text-gray-600">Điểm đi:</Text>
            <Text className="text-base text-gray-800">
              {orderData.pickupAddress}
            </Text>
          </View>

          <View className="mt-3">
            <Text className="mb-1 text-base text-gray-600">Điểm đến:</Text>
            <Text className="text-base text-gray-800">
              {orderData.deliveryAddress}
            </Text>
          </View>

          {renderImageUploadSection("pickup")}
          {renderImageUploadSection("delivery")}
        </View>
      </ScrollView>

      <TouchableOpacity
        className="items-center justify-center p-4 bg-orange-500"
        onPress={handleConfirm}>
        <Text className="text-lg font-bold text-white">Xác nhận</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          className="justify-end flex-1 bg-transparent bg-opacity-50"
          activeOpacity={1}
          onPress={() => setModalVisible(false)}>
          <View className="p-5 bg-slate-100 rounded-t-3xl">
            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-200"
              onPress={() => pickImage("camera")}>
              <Ionicons name="camera" size={24} color="#FF6600" />
              <Text className="ml-3 text-base text-gray-700">Chụp ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-200"
              onPress={() => pickImage("library")}>
              <Ionicons name="images" size={24} color="#FF6600" />
              <Text className="ml-3 text-base text-gray-700">
                Chọn từ thư viện
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center justify-center p-4 mt-2"
              onPress={() => setModalVisible(false)}>
              <Text className="text-base font-bold text-orange-500">Hủy</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
