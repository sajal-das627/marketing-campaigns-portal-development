import axios from "axios";
import useNotification from "../hooks/useNotification";
import { CampaignData } from "types/campaign";
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

  
  export const fetchDashboardStats = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/dashboard`);
    return response.data;
  };
    
    // Global Error Handling
    apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        const notify = useNotification();
        notify.notifyError(error.response?.data?.message || "An unexpected error occurred.");
        return Promise.reject(error);
      }
    );



  // Get all filters with pagination, search, and sorting
  export const getFilters = async (page = 1, search = "", sortBy = "", order = "asc", limit = 10) => {
    const params: any = { page, limit };
  
    if (search) params.search = search;
    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order; // Default sorting order
    }
  
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/filters`, { params });
    return response.data;
  };
// Get single filter by ID
  export const getSingleFilter = async (filterId: string) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/filters/apply/${filterId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching filter ${filterId}:`, error);
      throw error;
    }
  };
// duplicateFilter
  export const duplicateFilter = async (filterId: string) => {
    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/filters/${filterId}/duplicate`);
    return response.data;
  };
// deleteFilter
  export const deleteFilter = async (filterId: string) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/filters/${filterId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error deleting filter");
    }
  };
// updateFilter
  export const updateFilter = async (filterId: string, updatedData: any) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/filters/${filterId}`, updatedData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error updating filter");
    }
  };    

//Campaign Listing & Filter
  export const fetchCampaigns = async (filters: any) => {
    const params: any = {}; // ✅ Only add non-empty values
 
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.type) params.type = filters.type;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    params.page = filters.page ?? 1; // ✅ Default page
    params.limit = filters.limit ?? 10; // ✅ Default limit
 
    console.log("Sending API Request:", params); // ✅ Debugging
 
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/campaigns`, { params });
 
    console.log("API Response:", response.data); // ✅ Debug response
 
    return response.data;
  };
  
  export const toggleCampaignStatus = async (campaignId: string) => {
    const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/campaigns/${campaignId}/pause-resume`);
    console.log("API Response from Server:", response.data); // ✅ Debug API response
    return response.data.campaign; // ✅ Ensure it returns the updated campaign
  };
  

  export const duplicateCampaignApi = async (campaignId: string) => {
    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/campaigns/${campaignId}/duplicate`);
    return response.data.campaign; // ✅ Ensure it returns new campaign
  };
  
  
  export const deleteCampaignApi = async (campaignId: string) => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/campaigns/${campaignId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!response.ok) {
      throw new Error("Failed to delete campaign");
    }
  
    return campaignId;
  };

      // ✅ Update Campaign
  export const updateCampaignApi = async (campaignId: string, updatedData: any) => {
    const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/campaigns/${campaignId}/edit`, updatedData);
    return response.data;
  };
  // filter data for view on create campaign
  export const fetchFilterData = (filterId: string) => apiClient.get(`/filters/${filterId}`);

  // Filters API
export const createFilter = (filterData: any) => apiClient.post("/filters", filterData);
// export const getFilters = () => apiClient.get("/filters");
export const applyFilter = (filterId: string) => apiClient.get(`/filters/apply/${filterId}`);
export const createCampaign = (campaignData: CampaignData) => apiClient.post("/campaigns", campaignData);
export const getCampaigns = () => apiClient.get("/campaigns"); 
export const apiFetchCampaignById  = (campaignId: string) => apiClient.get(`/campaigns/${campaignId}`);

// Update API Client for Templates
export const createTemplate = (templateData: any) => apiClient.post("/templates", templateData);
export const getTemplates = () => apiClient.get("/templates");
export const getTemplateById = (id: string) => apiClient.get(`/templates/${id}`);
export const updateTemplate = (id: string, templateData: any) => apiClient.put(`/templates/${id}`, templateData);
export const deleteTemplate = (id: string) => apiClient.delete(`/templates/${id}`);


export default apiClient;