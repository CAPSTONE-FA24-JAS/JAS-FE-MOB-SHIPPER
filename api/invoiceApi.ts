//////// get order for shipper

import { Invoice } from "@/types/invoice";
import { dataResponse, Response } from "@/types/response";
import axios from "axios";
import apiClient from "./config";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";
interface formData {
  invoiceId: string;
  imageLink: Blob;
}

// Get orders Delivering for shipper
export const getInvoicesReceivedByShipper = async (shipperId: number) => {
  try {
    console.log("Fetching invoices received by shipper...", shipperId);
    const response = await apiClient.get<Response<dataResponse<Invoice>>>(
      `${API_URL}/api/Invoices/GetInvoicesRecivedByShipper?shipperId=${shipperId}`
    );

    const { data } = response.data;
    console.log("Invoices data:", data);

    if (response.data.code === 404 || !data) {
      console.log("No invoices found");
      return { dataResponse: [] }; // Return empty array if no data
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.toJSON());
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch invoices received by shipper"
      );
    } else {
      console.error("Error fetching invoices received by shipper:", error);
      throw error;
    }
  }
};

// Get orders for shipper by status: Order New (5), Delivered (6), Cancelled (10)
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

    if (response.data.code === 404 || !response.data.data) {
      // Handle the case where no data is found
      console.log("No orders found");
      return { dataResponse: [] }; // Return an empty array to indicate no orders
    }

    const { data } = response.data;
    console.log("====================================");
    console.log("dataNe", JSON.stringify(data));
    console.log("====================================");
    console.log("data", data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.toJSON());
      throw new Error(
        error.response?.data?.message || "Failed to fetch invoices for shipper"
      );
    } else {
      console.error("Error getting invoice for shipper:", error);
      throw error;
    }
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

export const getInvoiceDeliveringOfShipper = async (shipperId: number) => {
  try {
    console.log("Getting invoice by status of shipper...", shipperId);
    const response = await apiClient.get<Response<dataResponse<Invoice>>>(
      `${API_URL}/api/Invoices/getDeliveringInvoicesByShipper?shipperId=${shipperId}`
    );

    const { data } = response.data;
    console.log("data", data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.toJSON());
      throw new Error(
        error.response?.data?.message || "Failed to fetch invoices for shipper"
      );
    } else {
      console.error("Error getting invoice for shipper:", error);
      throw error;
    }
  }
};

export const UpdateRejectedInvoiceByShipper = async (
  invoiceId: number,
  reason: string
) => {
  try {
    const response = await apiClient.put<Response<dataResponse<Invoice>>>(
      `${API_URL}/api/Invoices/UpdateRejectedInvoiceByShipper?invoiceId=${invoiceId}&reason=${reason}`
    );

    const { data } = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.toJSON());
      throw new Error(
        error.response?.data?.message || "Failed to update rejected invoice"
      );
    } else {
      console.error("Error updating rejected invoice:", error);
      throw error;
    }
  }
};
