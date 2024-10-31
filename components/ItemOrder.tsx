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
  const {
    id,
    creationDate,
    totalPrice,
    status,
    myBidDTO,
    addressToShip,
    winnerName,
    linkBillTransaction,
  } = order;

  const getStatusIcon = () => {
    switch (numStatus) {
      case 5:
        return <Ionicons name="checkmark-done" size={20} color="white" />;
      case 0:
        return <Ionicons name="time" size={20} color="white" />;
      case 6:
        return <Ionicons name="checkmark-done" size={20} color="white" />;
      case 11:
        return <Ionicons name="close-circle" size={20} color="white" />;
      default:
        return <Ionicons name="time" size={20} color="white" />;
    }
  };

  const getStatusLabelAndColor = () => {
    switch (numStatus) {
      case 5:
        return { label: "Order New", bgColor: "bg-yellow-500" };
      case 0:
        return { label: "Delivering", bgColor: "bg-blue-500" };
      case 6:
        return { label: "Delivered", bgColor: "bg-green-800" };
      case 10:
        return { label: "Cancelled", bgColor: "bg-red-600" };
      default:
        return { label: "Unknown", bgColor: "bg-gray-600" };
    }
  };

  const { label, bgColor } = getStatusLabelAndColor();

  return (
    <TouchableOpacity
      className="w-full mb-4 border-2 border-gray-200 rounded-lg bg-white shadow-md"
      onPress={handlePress}
    >
      <View className="flex-row p-3">
        {/* Image Section */}
        <Image
          source={{
            uri: myBidDTO?.lotDTO?.imageLinkJewelry || linkBillTransaction,
          }}
          className="w-32 h-32 rounded-md"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4">
          <View className="flex-row justify-between ">
            <Text className="text-gray-500 text-xs">
              {moment(creationDate).format("HH:mm A, DD/MM/YYYY")}
            </Text>
            <View
              className={`flex-row items-center ${bgColor} px-2 py-1 rounded-md`}
            >
              {getStatusIcon()}
              <Text className="ml-1 text-white font-semibold">{label}</Text>
            </View>
          </View>
          {/* Order Details */}
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold max-w-[200px] text-gray-800">
              {myBidDTO?.lotDTO?.title || "Unknown Item"}
            </Text>
            <Text className="font-semibold text-gray-600 text-lg">#{id}</Text>
          </View>
          {/* <View className="flex-row items-center justify-between"> */}
          <View>
            <Text className="font-semibold text-gray-600">
              Winner: {order.winnerName || "N/A"}
            </Text>
            <Text className="font-semibold text-gray-600">
              Address: {addressToShip || "N/A"}
            </Text>
          </View>
          <Text className="font-semibold text-gray-800 text-right mb-2 text-lg">
            {`${totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}`}
          </Text>
          {/* </View> */}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Sub-component for displaying information lines
const InforLine = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <View className="flex-row mt-1">
    <Text className="text-sm font-medium text-gray-600">{label} </Text>
    <Text className="text-sm text-gray-800">{value}</Text>
  </View>
);
