import { Invoice } from "@/types/invoice";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import moment from "moment-timezone";

interface Props {
  order: Invoice;
  handlePress?: () => void;
  numStatus: number;
}

export default function ItemOrder({ order, handlePress, numStatus }: Props) {
  const getStatusIcon = () => {
    switch (numStatus) {
      case 5:
        return <Ionicons name="checkmark-done" size={18} color="white" />;
      case 0:
        return <Ionicons name="time" size={18} color="white" />;
      case 6:
        return <Ionicons name="checkmark-done" size={18} color="white" />;
      case 7:
        return <Ionicons name="close-circle" size={18} color="white" />;
      case 11:
        return <Ionicons name="close-circle" size={18} color="white" />;
      default:
        return <Ionicons name="time" size={18} color="white" />;
    }
  };

  const getStatusLabelAndColor = () => {
    switch (numStatus) {
      case 5:
        return { label: "Order New", bgColor: "bg-amber-500" };
      case 0:
        return { label: "Delivering", bgColor: "bg-blue-600" };
      case 6:
        return { label: "Delivered", bgColor: "bg-emerald-600" };
      case 7:
        return { label: "Reject", bgColor: "bg-red-500" };
      case 10:
        return { label: "Cancelled", bgColor: "bg-red-500" };
      default:
        return { label: "Unknown", bgColor: "bg-gray-500" };
    }
  };

  const { label, bgColor } = getStatusLabelAndColor();

  return (
    <TouchableOpacity
      className="w-full mb-3 overflow-hidden bg-white border border-gray-100 rounded-xl"
      onPress={handlePress}>
      <View className="p-4">
        {/* Header: Order ID, Date and Status */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center space-x-3">
            <Text className="text-base font-semibold text-gray-800">
              #{order.id}
            </Text>
            <Text className="text-sm text-gray-500">
              {moment(order.creationDate).format("HH:mm A, DD/MM/YYYY")}
            </Text>
          </View>
          <View
            className={`flex-row items-center ${bgColor} px-3 py-1.5 rounded-full`}>
            {getStatusIcon()}
            <Text className="ml-1.5 text-sm font-medium text-white">
              {label}
            </Text>
          </View>
        </View>

        {/* Content: Image and Price */}
        <View className="flex-row items-center">
          <Image
            source={{
              uri:
                order.myBidDTO?.lotDTO?.imageLinkJewelry ||
                order.linkBillTransaction,
            }}
            className="w-20 h-20 rounded-lg"
            resizeMode="cover"
          />
          <View className="flex-1 ml-4">
            <Text className="text-lg font-bold text-gray-900">
              {(order.totalPrice || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
