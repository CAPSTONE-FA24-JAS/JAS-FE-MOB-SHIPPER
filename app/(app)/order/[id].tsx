import {
  getInvoiceById,
  updateInvoiceDeliveredStatus,
  updateInvoicePickupStatus,
  UpdateRejectedInvoiceByShipper,
} from "@/api/invoiceApi";
import { Invoice } from "@/types/invoice";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function OrderDetail() {
  const { id, imageOrder, numStatus } = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const cancelReasons = [
    "Customer not available",
    "Wrong delivery address",
    "Package damaged during transit",
    "Customer refused to accept",
    "Weather conditions",
    "Other",
  ];

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

  const getStatusIcon = () => {
    switch (numStatus) {
      case "5":
        return <Ionicons name="checkmark-done" size={20} color="white" />;
      case "0":
        return <Ionicons name="time" size={20} color="white" />;
      case "6":
        return <Ionicons name="checkmark-done" size={20} color="white" />;
      case "11":
        return <Ionicons name="close-circle" size={20} color="white" />;
      default:
        return <Ionicons name="time" size={20} color="white" />;
    }
  };

  const getStatusLabelAndColor = () => {
    switch (Number(numStatus)) {
      case 5:
        return { label: "Order New", bgColor: "bg-yellow-500" };
      case 0:
        return { label: "Delivering", bgColor: "bg-blue-500" };
      case 6:
        return { label: "Delivered", bgColor: "bg-green-800" };
      case 7:
        return { label: "Reject", bgColor: "bg-red-500" };
      default:
        return { label: "Unknown", bgColor: "bg-gray-600" };
    }
  };

  const { label, bgColor } = getStatusLabelAndColor();

  const openImagePicker = (imageType: "pickup" | "delivery") => {
    setCurrentImageType(imageType);
    setModalVisible(true);
  };

  const removeImage = (imageType: "pickup" | "delivery") => {
    Alert.alert("Delete", "Are you sure to delete this picture?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
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

  const handleCancelOrder = async () => {
    const finalReason =
      selectedReason === "Other" ? customReason : selectedReason;

    if (!finalReason.trim()) {
      Alert.alert("Error", "Please select or enter a reason for cancellation");
      return;
    }

    Alert.alert("Confirmation", "Are you sure you want to cancel this order?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true);
            if (orderData?.id) {
              await UpdateRejectedInvoiceByShipper(orderData?.id, finalReason);
              Alert.alert("Success", "Order cancelled successfully", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            } else {
              Alert.alert("Error", "Failed to cancel order. Please try again.");
            }
          } catch (error) {
            Alert.alert("Error", "Failed to cancel order. Please try again.");
          } finally {
            setIsLoading(false);
            setCancelModalVisible(false);
          }
        },
      },
    ]);
  };

  const renderImageUploadSection = (
    imageType: "pickup" | "delivery",
    image: string
  ) => {
    const label = imageType === "pickup" ? "Picked up:" : "Delivered:";

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
              <Text className="mt-2 text-sm text-gray-500">Add Picture</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const handleConfirmPickup = async () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to confirm this order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              setIsLoading(true);
              await updateInvoicePickupStatus(
                String(orderData?.id),
                pickupImage
              );
              Alert.alert("Success", "Order pickup confirmed successfully", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to confirm pickup. Please try again."
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleConfirmDelivered = async () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to confirm this order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              setIsLoading(true);
              await updateInvoiceDeliveredStatus(
                String(orderData?.id),
                deliveryImage
              );
              Alert.alert("Success", "Order delivery confirmed successfully", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to confirm delivery. Please try again."
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const LoadingOverlay = () =>
    isLoading ? (
      <View className="absolute top-0 bottom-0 left-0 right-0 z-50 items-center justify-center w-full h-full bg-black/50">
        <ActivityIndicator size="large" color="#FF6600" />
        <Text className="mt-2 text-white">Processing...</Text>
      </View>
    ) : null;

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar style="auto" />
      <ScrollView className="flex-1">
        <View className="p-4 m-2 bg-white rounded-lg shadow-md">
          <View className="flex-row items-center mb-4">
            <Ionicons
              name="document-text-outline"
              size={24}
              color={`#${
                numStatus === "5"
                  ? "FFCC00"
                  : numStatus === "0"
                  ? "0000FF"
                  : numStatus === "6"
                  ? "008000"
                  : numStatus === "7"
                  ? "FF0000"
                  : "808080"
              }`}
            />
            <Text
              className={`ml-2 text-lg font-bold  ${
                numStatus === "5"
                  ? "text-[#FFCC00]"
                  : numStatus === "0"
                  ? "text-[#0000FF]"
                  : numStatus === "6"
                  ? "text-[#008000]"
                  : numStatus === "7"
                  ? "text-[#FF0000]"
                  : "text-[#808080]"
              }`}>
              {numStatus === "5"
                ? "Order New"
                : numStatus === "0"
                ? "Delivering"
                : numStatus === "6"
                ? "Delivered"
                : numStatus === "7"
                ? "Reject"
                : "Unknown"}
            </Text>
          </View>
          <Image
            source={{
              uri: Array.isArray(imageOrder)
                ? imageOrder[0]
                : imageOrder ||
                  "https://us.123rf.com/450wm/koblizeek/koblizeek2204/koblizeek220400315/185376169-no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-placeholder.jpg",
            }}
            className="w-56 h-56 mx-auto mb-2 rounded-lg"
          />

          <Text className="pb-2 mt-2 mb-4 text-lg font-semibold text-gray-600 uppercase border-b-2 border-gray-400 ">
            Product Infomation
          </Text>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Status:</Text>
            <View className="rounded-full ">
              <View
                className={`flex-row items-center ${bgColor} px-2 py-1 rounded-md`}>
                {getStatusIcon()}
                <Text className="ml-1 font-semibold text-white">{label}</Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Order ID:</Text>
            <Text className="text-base font-bold text-gray-800">#{id} </Text>
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Name Product:</Text>
            <Text className="text-base font-bold text-gray-800  w-[70%] text-right">
              {orderData?.productName ||
                orderData?.myBidDTO.lotDTO.title ||
                "N/A"}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Total Price:</Text>
            <Text className="text-base font-bold text-gray-800">
              {orderData?.totalPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
          <Text className="pb-2 mt-2 mb-4 text-lg font-semibold text-gray-600 uppercase border-b-2 border-gray-400 ">
            Delivery Infomation
          </Text>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Customer:</Text>
            <Text className="text-base font-bold text-gray-800">
              {orderData?.winnerName || "N/A"}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Phone Number:</Text>
            <Text className="text-base font-bold text-gray-800">
              {orderData?.winnerPhone || "N/A"}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Email:</Text>
            <Text className="text-base font-bold text-gray-800">
              {orderData?.winnerEmail || "N/A"}
            </Text>
          </View>
          <Text className="pb-2 mt-2 mb-4 text-lg font-semibold text-gray-600 uppercase border-b-2 border-gray-400 ">
            Delivery Path
          </Text>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Pickup Point:</Text>
            <Text className="text-base font-bold text-gray-800">
              Công ty JAS
            </Text>
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base text-gray-600">Delivery Point:</Text>
            <Text className="text-base w-[70%] text-right font-bold text-gray-800">
              {orderData?.addressToShip || "N/A"}
            </Text>
          </View>

          <Text className="pb-2 mt-2 mb-4 text-lg font-semibold text-gray-600 uppercase border-b-2 border-gray-400 ">
            Images confirm{" "}
          </Text>
          <View className="flex-row justify-between">
            {renderImageUploadSection("pickup", pickupImage)}
            {(isPickup || isDelivered) &&
              renderImageUploadSection("delivery", deliveryImage)}
          </View>
          {orderData?.status == "Rejected" && orderData?.note ? (
            <>
              <Text className="pb-2 mt-2 mb-4 text-lg font-semibold text-gray-600 uppercase border-b-2 border-gray-400 ">
                Reason
              </Text>
              <Text className="text-base text-gray-600">
                {orderData?.note || "N/A"}
              </Text>
            </>
          ) : null}
        </View>
      </ScrollView>

      {!isPickup && !isDelivered ? (
        <TouchableOpacity
          className="items-center justify-center p-4 bg-orange-500"
          onPress={handleConfirmPickup}
          disabled={isLoading}>
          <Text className="text-lg font-bold text-white">
            {isLoading ? "Processing..." : "Confirm Pickup"}
          </Text>
        </TouchableOpacity>
      ) : null}

      {isPickup && !isDelivered && orderData?.status !== "Rejected" ? (
        <View className="flex-row">
          <TouchableOpacity
            className="items-center justify-center flex-1 p-4 bg-red-500"
            onPress={() => setCancelModalVisible(true)}
            disabled={isLoading}>
            <Text className="text-lg font-bold text-white">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center justify-center flex-1 p-4 bg-orange-500"
            onPress={handleConfirmDelivered}
            disabled={isLoading}>
            <Text className="text-lg font-bold text-white">
              {isLoading ? "Processing..." : "Complete"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <Modal
        animationType="slide"
        transparent={true}
        visible={cancelModalVisible}
        onRequestClose={() => setCancelModalVisible(false)}>
        <TouchableOpacity
          className="justify-center flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setCancelModalVisible(false)}>
          <View className="p-4 mx-4 bg-white rounded-lg">
            <Text className="mb-4 text-lg font-bold">Cancel Order Reason</Text>

            {cancelReasons.map((reason) => (
              <TouchableOpacity
                key={reason}
                className={`p-3 mb-2 border rounded-lg ${
                  selectedReason === reason
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300"
                }`}
                onPress={() => setSelectedReason(reason)}>
                <Text
                  className={`text-base ${
                    selectedReason === reason
                      ? "text-orange-500"
                      : "text-gray-700"
                  }`}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            {selectedReason === "Other" && (
              <TextInput
                className="p-3 mt-2 mb-4 text-base border border-gray-300 rounded-lg"
                multiline
                placeholder="Enter your reason..."
                value={customReason}
                onChangeText={setCustomReason}
              />
            )}

            <View className="flex-row justify-end mt-4 space-x-2">
              <TouchableOpacity
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onPress={() => {
                  setCancelModalVisible(false);
                  setSelectedReason("");
                  setCustomReason("");
                }}>
                <Text className="font-medium text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 bg-red-500 rounded-lg"
                onPress={handleCancelOrder}>
                <Text className="font-medium text-white">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

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
              <Text className="ml-3 text-base text-gray-700">
                Take a picture
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-200"
              onPress={() => pickImage("library")}>
              <Ionicons name="images" size={24} color="#FF6600" />
              <Text className="ml-3 text-base text-gray-700">
                Choose from gallery
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
      <LoadingOverlay />
    </View>
  );
}
