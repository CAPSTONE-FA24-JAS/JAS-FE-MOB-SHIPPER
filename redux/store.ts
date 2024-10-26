import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

export const useAppDispatch = () => useDispatch<AppDispatch>();
