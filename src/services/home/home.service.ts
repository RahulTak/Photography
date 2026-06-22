import apiClient from "../api-client";

export const homeService = {
  getHomeContent: async (): Promise<any> => {
    try {
      const response = await apiClient.get("/home");
      return response.data;
    } catch (error) {
      console.warn("Home API failed: returning fallback constants.");
      // Dynamically load fallback content to avoid circular dependencies
      const { HOME_CONTENT } = await import("@/constants/content");
      return HOME_CONTENT;
    }
  },
  updateHomeContent: async (payload: any): Promise<any> => {
    const response = await apiClient.put("/home", payload);
    return response.data;
  },
};
export default homeService;
