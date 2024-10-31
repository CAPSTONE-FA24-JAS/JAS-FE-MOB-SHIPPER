// components/Header.tsx
import React from "react";
import { View, Text } from "react-native";
import { IconButton } from "react-native-paper";

interface HeaderProps {
  onPressBell?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPressBell }) => {
  return (
    <View className="flex-row items-center justify-between p-4 bg-white">
      <Text className="text-xl font-semibold">Xin chào, Khiêm</Text>
      <IconButton icon="bell" size={24} onPress={onPressBell} />
    </View>
  );
};

export default Header;
