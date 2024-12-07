// components/Page/HomeScreen/StatusTabs.tsx

import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface StatusTabsProps {
  selectedStatus: number;
  onSelectStatus: (status: number) => void;
  counts?: { [key: number]: number }; // A mapping of status code to count
}

const statuses = [
  { label: "Order New", code: 5 },
  { label: "Delivering", code: 0 },
  { label: "Delivered", code: 6 },
  { label: "Reject", code: 7 },
];

const StatusTabs: React.FC<StatusTabsProps> = ({
  selectedStatus,
  onSelectStatus,
  counts = {},
}) => {
  return (
    <View className="h-9">
      <ScrollView horizontal className="gap-2 " disableIntervalMomentum={true}>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status.code}
            className={`relative ${
              selectedStatus === status.code ? "bg-blue-500" : "bg-gray-500"
            } px-6 py-2 rounded-md`}
            onPress={() => onSelectStatus(status.code)}>
            <Text className="font-semibold text-white">{status.label}</Text>

            {/* Badge for count */}
            {counts[status.code] > 0 && (
              <View className="absolute top-0 right-0 px-2 py-1 -mt-2 -mr-2 bg-yellow-500 rounded-full">
                <Text className="text-xs font-bold text-white">
                  {counts[status.code]}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default StatusTabs;
