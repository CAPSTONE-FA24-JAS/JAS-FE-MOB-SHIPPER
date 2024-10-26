import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import {
  getInvoiceById,
  updateInvoiceDeliveredStatus,
  updateInvoicePickupStatus,
} from "@/api/invoiceApi";
import { Invoice } from "@/types/invoice";

export default function OrderDetail() {
  const { id } = useLocalSearchParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageType, setCurrentImageType] = useState<
    "pickup" | "delivery"
  >("pickup");
  const [orderData, setOrderData] = useState<Invoice>();
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [pickupImage, setPickupImage] = useState<string>("");
  const [deliveryImage, setDeliveryImage] = useState<string>("");

  // Check if order is picked up (status is "delivering")
  const isPickup =
    orderData?.statusInvoiceDTOs?.some(
      (status) => status.status === "Recieved"
    ) || false;

  // Check if order is delivered
  const isDelivered =
    orderData?.statusInvoiceDTOs?.some(
      (status) => status.status === "Delivered"
    ) || false;

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const data = await getInvoiceById(id.toString());
        setOrderData(data);

        // Set pickup image if exists
        const pickupStatus = data?.statusInvoiceDTOs?.find(
          (status) => status.status === "Recieved"
        );
        if (pickupStatus?.imageLink) {
          setPickupImage(pickupStatus.imageLink);
        }

        // Set delivery image if exists
        const deliveryStatus = data?.statusInvoiceDTOs?.find(
          (status) => status.status === "Delivered"
        );
        if (deliveryStatus?.imageLink) {
          setDeliveryImage(deliveryStatus.imageLink);
        }
      } catch (error) {
        console.error("Error fetching invoice data:", error);
        Alert.alert("Error", "Failed to load invoice data");
      }
    };

    fetchInvoiceData();
  }, [id]);

  useEffect(() => {
    checkCameraPermissions();
  }, []);

  // Rest of the component remains the same...
  const checkCameraPermissions = async () => {
    try {
      const { status: existingStatus } =
        await Camera.getCameraPermissionsAsync();

      if (existingStatus === "granted") {
        setHasCameraPermission(true);
        return;
      }

      const { status: newStatus } =
        await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(newStatus === "granted");

      if (newStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera access is required to take photos. Please enable it in your device settings.",
          [
            {
              text: "OK",
              onPress: () => console.log("Camera permission denied"),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error checking camera permissions:", error);
      Alert.alert(
        "Error",
        "There was an error checking camera permissions. Please try again."
      );
    }
  };

  const openImagePicker = (imageType: "pickup" | "delivery") => {
    setCurrentImageType(imageType);
    setModalVisible(true);
  };

  const removeImage = (imageType: "pickup" | "delivery") => {
    Alert.alert("Xóa ảnh", "Bạn có chắc chắn muốn xóa ảnh này?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          if (imageType === "pickup") {
            setPickupImage("");
          } else {
            setDeliveryImage("");
          }
        },
      },
    ]);
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
        if (!hasCameraPermission) {
          const permissionResult = await checkCameraPermissions();
          if (!hasCameraPermission) {
            return;
          }
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
          console.error("Error using camera:", cameraError);
          Alert.alert(
            "Camera Error",
            "There was an error accessing the camera. Please try again."
          );
        }
      }

      if (result && !result.canceled && result.assets.length > 0) {
        const newImage = result.assets[0].uri;
        updateImage(newImage);
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

  const updateImage = (newImage: string) => {
    if (currentImageType === "pickup") {
      setPickupImage(newImage);
    } else {
      setDeliveryImage(newImage);
    }
  };

  const renderImageUploadSection = (
    imageType: "pickup" | "delivery",
    image: string
  ) => {
    const label = imageType === "pickup" ? "Nhận hàng:" : "Đã giao hàng:";

    // If picked up, show pickup image without edit controls
    if (imageType === "pickup" && isPickup) {
      return (
        <View className="mt-5">
          <Text className="mb-2 text-base text-gray-600">{label}</Text>
          <View className="flex-row items-center">
            {image ? (
              <View className="relative">
                <Image
                  source={{ uri: image }}
                  className="w-32 h-32 rounded-lg"
                />
              </View>
            ) : (
              <View className="items-center justify-center w-32 h-32 border border-gray-300 rounded-lg">
                <Text className="text-sm text-gray-500">No image</Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    if (imageType === "delivery" && isDelivered) {
      return (
        <View className="mt-5">
          <Text className="mb-2 text-base text-gray-600">{label}</Text>
          <View className="flex-row items-center">
            {image ? (
              <View className="relative">
                <Image
                  source={{ uri: image }}
                  className="w-32 h-32 rounded-lg"
                />
              </View>
            ) : (
              <View className="items-center justify-center w-32 h-32 border border-gray-300 rounded-lg">
                <Text className="text-sm text-gray-500">No image</Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    return (
      <View className="mt-5">
        <Text className="mb-2 text-base text-gray-600">{label}</Text>
        <View className="flex-row items-center">
          {image ? (
            <View className="relative">
              <Image source={{ uri: image }} className="w-32 h-32 rounded-lg" />
              <TouchableOpacity
                className="absolute p-1 bg-red-500 rounded-full top-2 right-2"
                onPress={() => removeImage(imageType)}>
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="items-center justify-center w-32 h-32 border border-gray-300 rounded-lg"
              onPress={() => openImagePicker(imageType)}>
              <Ionicons name="camera" size={24} color="#666" />
              <Text className="mt-2 text-sm text-gray-500">Thêm ảnh</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const handleConfirmPickup = () => {
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
            console.log("Order Pickup Confirmed");
            updateInvoicePickupStatus(String(orderData?.id), pickupImage).then(
              () => {
                console.log("Order Pickup Status Updated");
                Alert.alert("Success", "Order pickup confirmed successfully");
              }
            );
          },
        },
      ]
    );
  };

  const handleConfirmDeliveried = () => {
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
            console.log("Order Pickup Confirmed");
            updateInvoiceDeliveredStatus(
              String(orderData?.id),
              deliveryImage
            ).then(() => {
              console.log("Order Pickup Status Updated");
              Alert.alert("Success", "Order delivery confirmed successfully");
            });
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
                {orderData?.status}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Tổng tiền:</Text>
            <Text className="text-base font-bold text-gray-800">
              {orderData?.totalPrice}
            </Text>
          </View>

          <View className="mt-3">
            <Text className="mb-1 text-base text-gray-600">Điểm đi:</Text>
            <Text className="text-base text-gray-800">Công ty JAS</Text>
          </View>

          <View className="mt-3">
            <Text className="mb-1 text-base text-gray-600">Điểm đến:</Text>
            <Text className="text-base text-gray-800">
              {orderData?.addressToShipId}
            </Text>
          </View>

          {renderImageUploadSection("pickup", pickupImage)}
          {(isPickup || isDelivered) &&
            renderImageUploadSection("delivery", deliveryImage)}
        </View>
      </ScrollView>

      {!isPickup && !isDelivered ? (
        <TouchableOpacity
          className="items-center justify-center p-4 bg-orange-500"
          onPress={handleConfirmPickup}>
          <Text className="text-lg font-bold text-white">Xác nhận</Text>
        </TouchableOpacity>
      ) : (
        ""
      )}

      {isPickup && !isDelivered ? (
        <TouchableOpacity
          className="items-center justify-center p-4 bg-orange-500"
          onPress={handleConfirmDeliveried}>
          <Text className="text-lg font-bold text-white">Hoàn Thành</Text>
        </TouchableOpacity>
      ) : (
        ""
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          className="justify-end flex-1 bg-transparent bg-opacity-50"
          activeOpacity={1}
          onPress={() => setModalVisible(false)}>
          <View className="p-5 bg-white rounded-t-3xl">
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
