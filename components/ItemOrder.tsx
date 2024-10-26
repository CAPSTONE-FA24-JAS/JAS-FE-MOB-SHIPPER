import { getInvoiceById } from "@/api/invoiceApi";
import { Invoice } from "@/types/invoice";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface props {
  order: Invoice;
  handlePress?: () => void;
}

export default function ItemOrder({ order, handlePress }: props) {
  const { id, creationDate, totalPrice, status } = order;
  const getStatusIcon = () => {
    switch (status) {
      case "Delivering":
        return <Ionicons name="checkmark-done" size={24} color="green" />;
      case "Canceled":
        return <Ionicons name="time" size={24} color="orange" />;
      case "Delivered":
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
        <InforLine label="Order ID:" value={id} />
        <InforLine label="Order Date:" value={creationDate} />
        <InforLine label="Total:" value={totalPrice} />
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
