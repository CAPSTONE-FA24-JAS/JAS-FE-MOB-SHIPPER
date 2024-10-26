// src/api/index.ts
import axios from "axios";
import { apiConfig } from "./config";

const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: apiConfig.headers,
});

console.log("apiClient.baseURL:", apiConfig.baseURL);

export default apiClient;
