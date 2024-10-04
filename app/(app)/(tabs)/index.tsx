import ItemOrder from "@/components/ItemOrder";
import { router } from "expo-router";
import React, { useState, useCallback } from "react";
import { View, FlatList, RefreshControl } from "react-native";

export interface Order {
  orderId: string;
  orderDate: string;
  total: string;
  status: "delivered" | "processing" | "cancelled";
  handlePress?: () => void;
}

const HelloWorld = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([
    {
      orderId: "123456",
      orderDate: "2021-10-10",
      total: "$100",
      status: "delivered",
    },
    {
      orderId: "234567",
      orderDate: "2021-10-11",
      total: "$150",
      status: "processing",
    },
    {
      orderId: "345678",
      orderDate: "2021-10-12",
      total: "$200",
      status: "cancelled",
    },
    {
      orderId: "456789",
      orderDate: "2021-10-13",
      total: "$120",
      status: "delivered",
    },
    {
      orderId: "567890",
      orderDate: "2021-10-14",
      total: "$180",
      status: "processing",
    },
    {
      orderId: "678901",
      orderDate: "2021-10-15",
      total: "$90",
      status: "delivered",
    },
  ]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate fetching new data
    setTimeout(() => {
      const newOrder: Order = {
        orderId: Math.random().toString(36).substr(2, 9),
        orderDate: new Date().toISOString().split("T")[0],
        total: `$${Math.floor(Math.random() * 200 + 50)}`,
        status: ["delivered", "processing", "cancelled"][
          Math.floor(Math.random() * 3)
        ] as Order["status"],
      };
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      setRefreshing(false);
    }, 2000);
  }, []);

  const handlePress = useCallback((orderId: string) => {
    console.log("Item pressed");
    router.push({
      pathname: "/(app)/order/[id]", //idk why it warning
      params: { id: orderId },
    });
  }, []);

  const renderItem = ({ item }: { item: Order }) => (
    <ItemOrder
      orderId={item.orderId}
      orderDate={item.orderDate}
      total={item.total}
      status={item.status}
      handlePress={() => handlePress(item.orderId)}
    />
  );

  return (
    <View className="flex-1 p-2">
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.orderId}
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

export default HelloWorld;
