// authApi.ts

import { login } from "@/redux/slices/auth";
import { AppDispatch } from "@/redux/store";
import { AuthType } from "@/types/auth";
import { Response } from "@/types/response";
import axios from "axios";
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

export const LoginApi = async (
  email: string,
  password: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    console.log("Bắt đầu đăng nhập...", email, password);

    const response = await axios.post<Response<AuthType>>(
      `${API_URL}/api/Authentication/Login`,
      {
        email,
        password,
      }
    );

    const { data } = response.data;
    console.log("====================================");
    console.log("dataNe", JSON.stringify(data));
    console.log("====================================");

    dispatch(login(data));

    console.log("Đăng nhập thành công.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.toJSON()); // Thêm log chi tiết về lỗi Axios
    } else {
      console.error("Lỗi đăng nhập:", error);
    }
    throw error;
  }
};

// export const registerApi = async (signupUser: SignUpUser): Promise<void> => {
//   try {
//     console.log("Starting registration...", signupUser);

//     const url = `${API_URL}/api/Authentication/Register`;
//     const response = await axios.post<Response<DataSignUpResponse>>(
//       url,
//       signupUser
//     );

//     if (response.data.isSuccess === true) {
//       console.log("Registration successful. Redirecting to login...");
//       router.push("/login"); // Chuyển hướng đến trang đăng nhập
//     } else {
//       // Nếu đăng ký không thành công, ném ra lỗi với thông báo từ API
//       throw new Error(response.data.message || "Registration failed.");
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("Axios error:", error.toJSON());
//     } else {
//       console.error("Registration error:", error);
//     }
//     throw error;
//   }
// };
