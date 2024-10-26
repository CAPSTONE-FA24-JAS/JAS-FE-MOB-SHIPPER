import React from "react";
import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="order/[id]"
        options={{ headerShown: true, title: "Detail Order" }}
      />
    </Stack>
  );
}
