// app/(tabs)/index.tsx

import {
  getInvoiceForShipper,
  getInvoicesReceivedByShipper,
} from "@/api/invoiceApi";
import Header from "@/components/Page/HomeScreen/Header";
import StatusTabs from "@/components/Page/HomeScreen/StatusTabs";
import OrderList from "@/components/Page/HomeScreen/OrderList";
import { Invoice } from "@/types/invoice";
import { router, useFocusEffect } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Import icon library

const STATUSES = [5, 0, 6, 10]; // Moved outside to prevent re-creation

const HomePage = () => {
  const [selectedStatus, setSelectedStatus] = useState(5); // Default to "Order New"
  const [orders, setOrders] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<{ [key: number]: number }>({}); // State to store counts for each status

  console.log("ordersNE", orders);

  const handleSelectStatus = (status: number) => {
    setSelectedStatus(status);
    fetchOrders(status); // Call fetchOrders when the status changes
  };

  const handlePressBell = () => {
    console.log("Bell icon pressed");
    // Navigate to notifications screen if implemented
  };

  // Function to fetch count for each status
  const fetchStatusCounts = useCallback(async () => {
    try {
      const statusCounts: { [key: number]: number } = {};

      // Fetch counts for each status
      for (const status of STATUSES) {
        let data;
        if (status === 0) {
          data = await getInvoicesReceivedByShipper(10);
        } else {
          data = await getInvoiceForShipper(10, status);
        }
        statusCounts[status] = data.dataResponse ? data.dataResponse.length : 0;
      }

      setCounts(statusCounts); // Update state with counts
    } catch (error) {
      console.error("Error fetching status counts:", error);
    }
  }, []); // No dependencies since STATUSES is fixed

  useEffect(() => {
    // Fetch counts once when the component mounts
    fetchStatusCounts();
  }, [fetchStatusCounts]);

  const fetchOrders = useCallback(async (status: number) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (status === 0) {
        data = await getInvoicesReceivedByShipper(10);
      } else {
        data = await getInvoiceForShipper(10, status);
      }
      setOrders(data.dataResponse || []); // Ensure `dataResponse` is correctly handled
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOrders(selectedStatus);
    }, [selectedStatus, fetchOrders])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders(selectedStatus);
    setRefreshing(false);
  }, [selectedStatus, fetchOrders]);

  const handlePress = useCallback((orderId: string, imageOrder: string) => {
    console.log("Item pressed");
    router.push({
      pathname: `/(app)/order/[id]`,
      params: {
        id: orderId,
        imageOrder: imageOrder,
        numStatus: selectedStatus,
      },
    });
  }, []);

  // Handle manual refresh of all status counts
  const handleReloadAll = async () => {
    setLoading(true); // Optional: Set a loading state if needed
    await fetchStatusCounts();
    setLoading(false);
  };

  console.log("counts", counts);

  return (
    <View className="flex-1 pt-10 bg-white">
      <Header onPressBell={handlePressBell} />
      <View className="flex-row justify-end mb-2">
        <TouchableOpacity
          onPress={handleReloadAll}
          className="flex-row items-center justify-center bg-gray-300 w-1/4  px-4 py-2 rounded-md mx-4 "
        >
          <MaterialIcons name="refresh" size={20} color="black" />
          <Text className="ml-2 text-black font-semibold">Reload</Text>
        </TouchableOpacity>
      </View>
      <StatusTabs
        selectedStatus={selectedStatus}
        onSelectStatus={handleSelectStatus}
        counts={counts}
      />
      <OrderList
        orders={orders}
        loading={loading}
        error={error}
        refreshing={refreshing}
        onRefresh={onRefresh}
        handlePress={handlePress}
        numStatus={selectedStatus}
      />
    </View>
  );
};

export default HomePage;
