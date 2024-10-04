// app/index.tsx

import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, ImageBackground, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  const router = useRouter();
  const { width, height } = Dimensions.get("window");

  const isLandscape = width > height;

  const handleExplorePress = () => {
    console.log("Button Pressed");
    try {
      router.push("/(app)");
      console.log("Navigating to /login");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        resizeMode="cover"
        style={{ flex: 1, width: "100%", height: "100%" }}>
        <SafeAreaView
          style={{
            flex: 1,
            paddingHorizontal: 8,
            justifyContent: "space-between",
          }}>
          <Animated.View
            entering={FadeInDown.delay(300)
              .mass(0.5)
              .stiffness(80)
              .springify(20)}></Animated.View>

          <Animated.View
            entering={FadeInDown.delay(300)
              .mass(0.5)
              .stiffness(80)
              .springify(20)}
            style={{ marginBottom: 40, shadowOpacity: 0.8 }}>
            <CustomButton
              onPress={handleExplorePress}
              title="BẮT ĐẦU KHÁM PHÁ"
            />
          </Animated.View>

          <StatusBar style="light" />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default App;
