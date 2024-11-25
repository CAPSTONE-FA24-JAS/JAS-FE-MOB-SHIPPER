import { UserAccount } from "@/types/login_type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  token?: string;
  userResponse?: UserAccount;
  isPending?: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isPending: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ token: string; userResponse: UserAccount }>
    ) => {
      console.log("Login action dispatched with payload:", action.payload);
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userResponse = action.payload.userResponse;
    },
    logout: (state) => {
      // Reset the entire state upon logout
      state.isAuthenticated = false;
      state.token = undefined;
      state.userResponse = undefined;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
