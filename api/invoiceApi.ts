//////// get order for shipper

import { Invoice } from "@/types/invoice";
import { dataResponse, Response } from "@/types/response";
import axios from "axios";
import apiClient from "./config";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";
interface formData {
  invoiceId: string;
  imageLink: Blob;
}

export const getInvoiceForShipper = async (
  shipperId: number,
  status: number
) => {
  try {
    console.log("Getting invoice for shipper...", shipperId, status);
    console.log(
      "url",
      `${API_URL}/api/Invoices/GetInvoiceByStatusOfShipper?shipperId=${shipperId}&status=${status}`
    );

    const response = await apiClient.get<Response<dataResponse<Invoice>>>(
      `${API_URL}/api/Invoices/GetInvoiceByStatusOfShipper?shipperId=${shipperId}&status=${status}`
    );

    console.log("====================================");

    const { data } = response.data;
    console.log("====================================");
    console.log("dataNe", JSON.stringify(data));
    console.log("====================================");
    console.log("data", data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.toJSON());
    } else {
      console.error("Error getting invoice for shipper:", error);
    }
    throw error;
  }
};

export const getInvoiceById = async (id: string) => {
  try {
    console.log("Getting invoice by id...", id);
    const response = await apiClient.get<Response<Invoice>>(
      `${API_URL}/api/Invoices/GetDetailInvoice?invoiceId=${id}`
    );

    const { data } = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.toJSON());
    } else {
      console.error("Error getting invoice by id:", error);
    }
    throw error;
  }
};

export const updateInvoicePickupStatus = async (
  invoiceId: string,
  imageUri: string
) => {
  try {
    console.log("Updating invoice pickup status...", invoiceId);

    // Create form data
    const formData = new FormData();
    formData.append("invoiceId", invoiceId);

    // Append image file
    // Extract filename from URI
    const filename = imageUri.split("/").pop() || "image.jpg";
    // Determine the file type (mime type)
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("imageDelivery", {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await apiClient.put<Response<Invoice>>(
      `${API_URL}/api/Invoices/UpdateImageRecivedJewelryByShipper?invoiceId=${invoiceId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const { data } = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.toJSON());
      // You might want to handle specific error status codes here
      throw new Error(
        error.response?.data?.message || "Failed to update invoice status"
      );
    } else {
      console.error("Error updating invoice pickup status:", error);
      throw error;
    }
  }
};

export const updateInvoiceDeliveredStatus = async (
  invoiceId: string,
  imageUri: string
) => {
  try {
    console.log("Updating invoice pickup status...", invoiceId);

    // Create form data
    const formData = new FormData();
    formData.append("invoiceId", invoiceId);

    // Append image file
    // Extract filename from URI
    const filename = imageUri.split("/").pop() || "image.jpg";
    // Determine the file type (mime type)
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("imageDelivery", {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await apiClient.put<Response<Invoice>>(
      `${API_URL}/api/Invoices/UpdateSuccessfulDeliveryByShipper?InvoiceId=${invoiceId}&Status=6`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const { data } = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.toJSON());
      // You might want to handle specific error status codes here
      throw new Error(
        error.response?.data?.message || "Failed to update invoice status"
      );
    } else {
      console.error("Error updating invoice pickup status:", error);
      throw error;
    }
  }
};
