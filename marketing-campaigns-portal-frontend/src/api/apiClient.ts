import axios from "axios";
import useNotification from "../hooks/useNotification";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
  });
  
  // Global Error Handling
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const notify = useNotification();
      notify.notifyError(error.response?.data?.message || "An unexpected error occurred.");
      return Promise.reject(error);
    }
  );

  // Filters API
export const createFilter = (filterData: any) => apiClient.post("/filters", filterData);
export const getFilters = () => apiClient.get("/filters");
export const applyFilter = (filterId: string) => apiClient.get(`/filters/apply/${filterId}`);
export const createCampaign = (campaignData: any) => apiClient.post("/campaigns", campaignData);
export const getCampaigns = () => apiClient.get("/campaigns"); 

// Update API Client for Templates
export const createTemplate = (templateData: any) => apiClient.post("/templates", templateData);
export const getTemplates = () => apiClient.get("/templates");
export const getTemplateById = (id: string) => apiClient.get(`/templates/${id}`);
export const updateTemplate = (id: string, templateData: any) => apiClient.put(`/templates/${id}`, templateData);
export const deleteTemplate = (id: string) => apiClient.delete(`/templates/${id}`);


export default apiClient;