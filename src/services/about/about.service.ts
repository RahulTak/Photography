import apiClient from "../api-client";
import { API_ENDPOINTS } from "../endpoints";
import { ABOUT_CONTENT } from "@/constants/about";
import { aboutDataSchema, teamMemberSchema, awardSchema } from "@/schemas/about.schema";
import { AboutData, TeamMember, Award } from "@/types";

export const aboutService = {
  // GET /about
  getAboutData: async (): Promise<AboutData> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ABOUT);
      const parsed = aboutDataSchema.safeParse(response.data);
      if (parsed.success) {
        return parsed.data;
      }
      throw new Error("Validation mismatch");
    } catch (error) {
      console.warn("About API failed: returning local ABOUT_CONTENT fallback.");
      return {
        hero: ABOUT_CONTENT.hero,
        founders: ABOUT_CONTENT.founders,
        missionVision: ABOUT_CONTENT.missionVision,
        timeline: ABOUT_CONTENT.timeline,
        awards: ABOUT_CONTENT.awards,
        team: ABOUT_CONTENT.team,
        process: ABOUT_CONTENT.process,
      } as unknown as AboutData;
    }
  },

  // GET /team
  getTeam: async (): Promise<TeamMember[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TEAM);
      if (Array.isArray(response.data)) {
        return response.data.map((item) => teamMemberSchema.parse(item));
      }
      throw new Error("Invalid response format");
    } catch (error) {
      console.warn("Team API failed: returning local team fallback constants.");
      return [...ABOUT_CONTENT.team] as TeamMember[];
    }
  },

  // GET /awards
  getAwards: async (): Promise<Award[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AWARDS);
      if (Array.isArray(response.data)) {
        return response.data.map((item) => awardSchema.parse(item));
      }
      throw new Error("Invalid response format");
    } catch (error) {
      console.warn("Awards API failed: returning local awards fallback constants.");
      return [...ABOUT_CONTENT.awards] as Award[];
    }
  }
};
export default aboutService;
