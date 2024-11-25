import React from "react";
import { Alert, Button, StyleSheet } from "react-native";
import { Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/auth"; // Action logout từ Redux
import { useRouter } from "expo-router";

const LogoutScreen: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    // Hiển thị xác nhận đăng xuất
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            // Thực hiện logout
            dispatch(logout());
            router.replace({ pathname: "/(app)/login" }); // Điều hướng về trang login
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you sure you want to log out?</Text>
      <Button title="Log Out" onPress={handleLogout} color="#FF3B30" />
    </View>
  );
};

export default LogoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
