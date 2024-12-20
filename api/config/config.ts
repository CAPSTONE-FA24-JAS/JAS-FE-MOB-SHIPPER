// src/api/config.ts

const API_URL = process.env.EXPO_PUBLIC_API_URL;
console.log("API_URL:", API_URL); // Check if API_URL is defined

if (!API_URL) {
  throw new Error("API_URL is not defined. Check your .env file.");
}

export const apiConfig = {
  baseURL: API_URL,
  headers: {
    "content-type": "application/json",
  },
};
