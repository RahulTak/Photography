import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.jpphotography.in/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach headers and handle dynamic auth tokens
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Attach CDN url if present
    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
    if (cdnUrl) {
      config.headers.set("X-CDN-URL", cdnUrl);
    }

    // 2. Future-ready auth token support: Retrieve token from browser localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Uniform error handling and response logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    // Standardized network error mapping
    const status = error.response?.status;
    const data = error.response?.data;
    
    console.error(`[API Response Error] ${status || "Network"} ${error.config?.url}`, data || error.message);
    
    // Future-ready token refresh hook (e.g. on 401 Unauthorized)
    if (status === 401) {
      console.warn("Unauthorized API call. Triggering refresh token workflow...");
    }

    return Promise.reject(error);
  }
);
export default apiClient;
