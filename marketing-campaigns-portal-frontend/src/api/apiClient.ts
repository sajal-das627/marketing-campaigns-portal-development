import axios from "axios";
import useNotification from "../hooks/useNotification";
import { CampaignData } from "types/campaign";
import { Template } from "types/template";
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
export const getFilters = async (page = 1, search = "", sortBy = "", order = "asc", limit = 10, isDraft?: boolean) => {
  const params: any = { page, limit: 10 };

  if (search) params.search = search;
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order; // Default sorting order
  }
  if (typeof isDraft === "boolean") {
    params.isDraft = isDraft;
  }

  const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/filters`, { params });
  return response.data;
};

// Get a single filter by ID (edit mode)
export const getFilterById = async (filterId: string) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/filters/${filterId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch filter");
  }
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
// createOrUpdateFilter
export const createOrUpdateFilter = (filterData: any) => {
  return axios.post(`${process.env.REACT_APP_API_BASE_URL}/filters`, filterData);
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

//criteria blocks
export const createCriteriaBlocks = async (data: any) => {
  const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/criteria-blocks`, data);
  return response.data;
}

export const getCriteriaBlocks = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/criteria-blocks`);
  return response.data;
}


// ✅ Update Campaign
export const updateCampaignApi = async (campaignId: string, updatedData: any) => {
  const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/campaigns/${campaignId}/edit`, updatedData);
  return response.data;
};


// fetchTemplates
export const fetchTemplates = (params: any) => {
  return axios.get(`${process.env.REACT_APP_API_BASE_URL}/templates`, { params });
};
// recentlyUsedTemplates
export const fetchRecentlyUsedTemplates = (params: any) => {
  return axios.get(`${process.env.REACT_APP_API_BASE_URL}/templates/recent`, { params });
};

// fetchFavoriteTemplates
export const fetchFavoriteTemplates = async (params: any) => {
  const query = new URLSearchParams(params).toString();
  return axios.get(`${process.env.REACT_APP_API_BASE_URL}/templates/favorites?${query}`);
};

// fetchTemplateById
export const toggleFavoriteTemplate = (templateId: string) => {
  return axios.put(`${process.env.REACT_APP_API_BASE_URL}/templates/${templateId}/favorite`);
};
// fetchTemplateById
export const fetchTemplateById = async (id: string) => {
  return axios.get(`${process.env.REACT_APP_API_BASE_URL}/templates/${id}`);
};
// Update template by ID
export const updateTemplateById = async (id: string, data: any) => {
  return axios.put(`${process.env.REACT_APP_API_BASE_URL}/templates/${id}`, data);
};
//  deleteTemplateById
export const deleteTemplateById = (id: string) => {
  return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/templates/${id}`);

}
//  rstore template by ID
export const restoreTemplateById = (templateId: string) => {
  return axios.patch(`${process.env.REACT_APP_API_BASE_URL}/templates/${templateId}/restore`);
};
// duplicateTemplateById
export const duplicateTemplateById = (templateId: string) => {
  return axios.post(`${process.env.REACT_APP_API_BASE_URL}/templates/${templateId}/duplicate`);
};


// filter data for view on create campaign
export const fetchFilterData = (filterId: string) => apiClient.get(`/filters/${filterId}`);
// Filters API
export const createFilter = (filterData: any) => apiClient.post("/filters", filterData);
// export const getFilters = () => apiClient.get("/filters");
export const applyFilter = (filterId: string) => apiClient.get(`/filters/apply/${filterId}`);
export const createCampaign = (campaignData: CampaignData) => apiClient.post("/campaigns", campaignData);
export const getCampaigns = () => apiClient.get("/campaigns");
export const apiFetchCampaignById = (campaignId: string) => apiClient.get(`/campaigns/${campaignId}`);

// Update API Client for Templates
// export const createTemplate = (templateData: any) => apiClient.post("/templates", templateData);
export const createTemplate = (data: any) => {
  return axios.post(`${process.env.REACT_APP_API_BASE_URL}/templates/`, data);
};

// fetchTemplatesByCategory
export const fetchTemplatesByCategory = async (
  category: string,
  type: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/templates/category/${category}`,
      {
        params: { type, page, limit },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching templates by category:", error);
    throw error?.response?.data || { message: "Unknown error occurred" };
  }
};
 
export const getTemplates = () => apiClient.get("/templates");
export const getTemplateById = (id: string) => apiClient.get(`/templates/${id}`);
export const updateTemplate = (id: string, templateData: any) => apiClient.put(`/templates/${id}`, templateData);
export const deleteTemplate = (id: string) => apiClient.delete(`/templates/${id}`);


export default apiClient;