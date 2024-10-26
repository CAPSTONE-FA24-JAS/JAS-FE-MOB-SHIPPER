import { getInvoiceForShipper } from "@/api/invoiceApi";
import ItemOrder from "@/components/ItemOrder";
import { Invoice } from "@/types/invoice";
import { router, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { View, FlatList, RefreshControl } from "react-native";

const HomePage = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<Invoice[]>([]);

  useFocusEffect(
    useCallback(() => {
      getInvoiceForShipper(10, 5).then((data) => {
        setOrders(data.dataResponse);
      });
    }, [getInvoiceForShipper])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getInvoiceForShipper(10, 5).then((data) => {
      setOrders(data.dataResponse);
      setRefreshing(false);
    });
  }, []);

  const handlePress = useCallback((orderId: string) => {
    console.log("Item pressed");
    router.push({
      pathname: `/(app)/order/[id]`,
      params: { id: orderId },
    });
  }, []);

  const renderItem = ({ item }: { item: Invoice }) => (
    <ItemOrder
      order={item}
      handlePress={() => handlePress(item.id.toString())}
    />
  );

  return (
    <View className="flex-1 p-2">
      <FlatList
        data={orders}
        renderItem={renderItem}
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

export default HomePage;
