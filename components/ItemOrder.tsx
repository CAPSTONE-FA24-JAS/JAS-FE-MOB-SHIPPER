import { Order } from "@/app/(app)/(tabs)";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function ItemOrder({
  orderId,
  orderDate,
  total,
  status,
  handlePress,
}: Order) {
  const getStatusIcon = () => {
    switch (status) {
      case "delivered":
        return <Ionicons name="checkmark-done" size={24} color="green" />;
      case "processing":
        return <Ionicons name="time" size={24} color="orange" />;
      case "cancelled":
        return <Ionicons name="close-circle" size={24} color="red" />;
    }
  };

  return (
    <TouchableOpacity
      className="w-full mb-3 rounded-sm bg-slate-100"
      onPress={handlePress}>
      <View className="flex flex-row items-center p-2 rounded-sm bg-slate-50">
        {getStatusIcon()}
        <Text className="ml-2 text-sm capitalize">{status}</Text>
      </View>
      <View className="p-2">
        <InforLine label="Order ID:" value={orderId} />
        <InforLine label="Order Date:" value={orderDate} />
        <InforLine label="Total:" value={total} />
      </View>
    </TouchableOpacity>
  );
}

const InforLine = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <View className="flex-row gap-2">
    <Text className="text-sm font-medium text-slate-900">{label}</Text>
    <Text className="text-sm">{value}</Text>
  </View>
);
