// app/(auths)/login.tsx

// import { LoginApi } from "@/api/authApi";
import { LoginApi } from "@/api/authApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { logout } from "@/redux/slices/auth";

import { AppDispatch } from "@/redux/store";
import { Feather } from "@expo/vector-icons";
import { Link, useRouter, Href } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from "react-native-paper";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const [rightIcon, setRightIcon] = useState<"eye" | "eye-off">("eye");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load thông tin đã lưu khi component được render lần đầu
  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("rememberedEmail");
        const savedPassword = await AsyncStorage.getItem("rememberedPassword");
        const rememberStatus = await AsyncStorage.getItem("rememberMe");

        if (savedEmail && savedPassword && rememberStatus === "true") {
          setUsername(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Failed to load remembered credentials:", error);
      }
    };

    loadRememberedCredentials();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      showErrorMessage("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);

      // Gọi API đăng nhập
      const userData = await LoginApi(username, password, dispatch);

      // Kiểm tra roleId
      if (userData?.roleId !== 6) {
        showErrorMessage("You must be a shipper to log in.");
        dispatch(logout());
        setLoading(false);
        return;
      }

      // Nếu "Remember Me" được bật, lưu thông tin đăng nhập vào AsyncStorage
      if (rememberMe) {
        await AsyncStorage.setItem("rememberedEmail", username);
        await AsyncStorage.setItem("rememberedPassword", password);
        await AsyncStorage.setItem("rememberMe", "true");
      } else {
        // Nếu không, xóa thông tin đã lưu
        await AsyncStorage.removeItem("rememberedEmail");
        await AsyncStorage.removeItem("rememberedPassword");
        await AsyncStorage.removeItem("rememberMe");
      }

      setLoading(false);
      showSuccessMessage("Login successful! Redirecting...");
      router.replace({ pathname: "/(app)/(tabs)" });
    } catch (error) {
      showErrorMessage("Invalid username or password.");
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  const handlePasswordVisibility = () => {
    setRightIcon(rightIcon === "eye" ? "eye-off" : "eye");
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }} className="bg-[#FFFFFF]">
      <View className="flex w-full h-full mx-auto my-auto bg-white">
        <View className="w-full h-full mx-auto my-auto">
          <Image
            source={require("../../assets/bg-jas/header_login.png")}
            className="w-full h-[40%] items-center mx-auto mb-2"
          />
          <View className="flex-row w-full mx-10 mb-10">
            <View className=" w-[50%]">
              <Text className="text-[#666666] text-5xl">Sign in</Text>
              <Text className="w-full text-lg text-gray-400 ">
                Welcome back
              </Text>
            </View>
            <View className="flex-row w-[30%]">
              <Image
                source={require("../../assets/icons/fb-icon.png")}
                className="w-[60px] h-[60px] items-center rounded-full mx-auto mr-2"
              />
              <Image
                source={require("../../assets/icons/gg-icon.png")}
                className="w-[60px] h-[60px] items-center rounded-full mx-auto "
              />
            </View>
          </View>
          <View className="w-full h-full mx-auto">
            <View className="px-3 mb-4">
              <TextInput
                placeholder="Email"
                value={username}
                onChangeText={setUsername}
                className="border-[1px] border-slate-300 px-4 py-4 rounded-lg text-lg mx-7"
              />
            </View>
            <View className="px-3 my-3">
              <View className="relative mx-7 border-[1px] border-slate-300 p-2 rounded-lg">
                <TextInput
                  placeholder="Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  value={password}
                  onChangeText={setPassword}
                  className="py-2 ml-3 text-lg text-slate-400"
                  style={{ paddingRight: 40 }}
                />
                <TouchableOpacity
                  onPress={handlePasswordVisibility}
                  className="absolute right-4 top-[40%] transform -translate-y-1/2"
                >
                  <Feather name={rightIcon} size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-center px-3 mx-7 my-3">
              <Checkbox
                status={rememberMe ? "checked" : "unchecked"}
                onPress={() => setRememberMe(!rememberMe)}
                color="gray"
              />
              <Text style={{ fontSize: 16, marginLeft: 8, color: "gray" }}>
                Remember Me
              </Text>
            </View>

            <View className="flex-row items-center justify-between mx-10 mt-6">
              <TouchableOpacity
                className="w-[150px] bg-[#4765F9] rounded-md"
                onPress={handleLogin}
              >
                <Text className="py-3 text-xl font-semibold text-center text-white uppercase px-9">
                  Sign in
                </Text>
              </TouchableOpacity>
              <Text className="text-lg text-gray-500">Forgot Password?</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;
