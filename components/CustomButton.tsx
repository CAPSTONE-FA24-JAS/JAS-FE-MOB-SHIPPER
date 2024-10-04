import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  textStyles?: object;
  containerStyles?: object;
}

const CustomButton = ({
  onPress,
  title,
  textStyles = {},
  containerStyles = {},
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      style={[containerStyles]}
      activeOpacity={0.7}
      className="items-center justify-center bg-white rounded-md min-h-14"
      onPress={onPress}>
      <Text
        className="text-lg font-semibold text-[#007bff]"
        style={[textStyles]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
