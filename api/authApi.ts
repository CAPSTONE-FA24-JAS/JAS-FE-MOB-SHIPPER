// authApi.ts

import { login } from "@/redux/slices/auth";
import { AppDispatch } from "@/redux/store";
import { AuthType } from "@/types/auth";
import { Data } from "@/types/login_type";
import { Response } from "@/types/response";
import axios from "axios";
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

export const LoginApi = async (
  email: string,
  password: string,
  dispatch: AppDispatch
): Promise<Data["user"] | null> => {
  // Adjusted return type
  try {
    console.log("Starting login...", email, password);

    const response = await axios.post<Response<Data>>(
      `${API_URL}/api/Authentication/Login`,
      {
        email,
        password,
      }
    );

    const { data } = response.data;
    console.log("====================================");
    console.log("Login Data:", JSON.stringify(data));
    console.log("====================================");

    dispatch(
      login({
        token: data.accessToken,
        userResponse: { ...data.user },
      })
    );
    console.log("Login successful.");

    return data.user; // Return user data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.toJSON());
    } else {
      console.error("Login error:", error);
    }
    throw error;
  }
};
