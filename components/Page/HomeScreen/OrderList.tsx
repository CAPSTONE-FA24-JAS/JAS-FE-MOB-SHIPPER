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
  handlePress: (orderId: string, imageOrder: string, numStatus: number) => void;
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
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center flex-1">
        <Text className="text-red-500">{error}</Text>
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
                item?.myBidDTO?.lotDTO?.imageLinkJewelry,
                numStatus
              )
            }
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 10,
          ...(orders.length === 0 && {
            justifyContent: "center",
            alignItems: "center",
          }),
        }}
        ListEmptyComponent={() => (
          <Text className="text-gray-500">No orders found</Text>
        )}
      />
    </View>
  );
};

export default OrderList;
