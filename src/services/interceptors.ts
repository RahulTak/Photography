import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

export const setupInterceptors = (axiosInstance: AxiosInstance): AxiosInstance => {
  // Request Interceptor
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add custom headers if required, e.g. CDN keys
      const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
      if (cdnUrl) {
        config.headers.set("X-CDN-URL", cdnUrl);
      }
      
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error: AxiosError) => {
      console.error("[API Request Error]", error);
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
      return response;
    },
    (error: AxiosError) => {
      console.error(`[API Response Error] ${error.response?.status} ${error.config?.url}`, error.message);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
