// components/Page/HomeScreen/OrderList.tsx

import React from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
} from "react-native";
import ItemOrder from "@/components/ItemOrder";
import { Invoice } from "@/types/invoice";

interface OrderListProps {
  orders: Invoice[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  onRefresh: () => void;
  handlePress: (orderId: string, imageOrder: string) => void;
  numStatus: number;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  loading,
  error,
  refreshing,
  onRefresh,
  handlePress,
  numStatus,
}) => {
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">No orders found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-2">
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <ItemOrder
            numStatus={numStatus}
            order={item}
            handlePress={() =>
              handlePress(
                item.id.toString(),
                item?.myBidDTO?.lotDTO?.imageLinkJewelry
              )
            }
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingVertical: 10,
        }}
      />
    </View>
  );
};

export default OrderList;
