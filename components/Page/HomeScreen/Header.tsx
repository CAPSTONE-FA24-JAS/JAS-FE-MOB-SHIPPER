// components/Header.tsx
import { RootState } from "@/redux/store";
import React from "react";
import { View, Text } from "react-native";
import { IconButton } from "react-native-paper";
import { useSelector } from "react-redux";

interface HeaderProps {
  onPressBell?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPressBell }) => {
  const shiperName = useSelector(
    (state: RootState) => state.auth?.userResponse?.firstName
  );

  return (
    <View className="flex-row items-center justify-between p-4 bg-white">
      <Text className="text-xl font-semibold">
        Xin chào, {shiperName || "Shipper"}
      </Text>
      <IconButton icon="bell" size={24} onPress={onPressBell} />
    </View>
  );
};

export default Header;
