// components/Page/HomeScreen/StatusTabs.tsx

import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface StatusTabsProps {
  selectedStatus: number;
  onSelectStatus: (status: number) => void;
  counts?: { [key: number]: number }; // A mapping of status code to count
}

const statuses = [
  { label: "Order New", code: 5 },
  { label: "Delivering", code: 0 },
  { label: "Delivered", code: 6 },
  { label: "Cancelled", code: 10 },
];

const StatusTabs: React.FC<StatusTabsProps> = ({
  selectedStatus,
  onSelectStatus,
  counts = {},
}) => {
  return (
    <View className="flex-row justify-around p-2">
      {statuses.map((status) => (
        <TouchableOpacity
          key={status.code}
          className={`relative ${
            selectedStatus === status.code ? "bg-blue-500" : "bg-gray-500"
          } px-4 py-2 rounded-md`}
          onPress={() => onSelectStatus(status.code)}
        >
          <Text className="text-white font-semibold">{status.label}</Text>

          {/* Badge for count */}
          {counts[status.code] > 0 && (
            <View className="absolute top-0 right-0 -mt-2 -mr-2 bg-yellow-500 rounded-full px-2 py-1">
              <Text className="text-white text-xs font-bold">
                {counts[status.code]}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StatusTabs;
