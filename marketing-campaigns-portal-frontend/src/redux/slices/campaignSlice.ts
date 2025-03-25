import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createCampaign as createCampaignAPI, fetchCampaigns, toggleCampaignStatus, duplicateCampaignApi, deleteCampaignApi } from "../../api/apiClient";

// ✅ Define Campaign Interface
interface Campaign {
  _id: string;
  name: string;
  type: "Criteria Based" | "Real Time" | "Scheduled";
  status: "Scheduled" | "Draft" | "Active" | "Completed" | "On Going" | "Paused" | "Expired" | "Not Yet Started";
  openRate: number;
  ctr: number;
  delivered: number;
  createdAt: string;
}

// ✅ Define Unified State Interface
interface CampaignState {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  createCampaignData: any | null;
  createLoading: boolean;
  createError: string | null;
}

// ✅ Initial Unified State
const initialState: CampaignState = {
  campaigns: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  createCampaignData: null,
  createLoading: false,
  createError: null,
};

// ✅ Fetch Campaigns with Filters
export const loadCampaigns = createAsyncThunk(
  "campaigns/load",
  async ({ search, status, type, startDate, endDate, sortBy, page, limit }: any) => {
    return await fetchCampaigns({
      search,
      status,
      type,
      startDate,
      endDate,
      sortBy,
      page: page ?? 1,
      limit: limit ?? 10,
    });
  }
);

// ✅ Pause/Resume Campaign
export const pauseResumeCampaign = createAsyncThunk(
  "campaigns/toggleStatus",
  async (campaignId: string) => {
    return await toggleCampaignStatus(campaignId);
  }
);

// ✅ Duplicate Campaign
export const duplicateCampaign = createAsyncThunk(
  "campaigns/duplicate",
  async (campaignId: string) => {
    return await duplicateCampaignApi(campaignId);
  }
);

// ✅ Delete Campaign
export const deleteCampaign = createAsyncThunk(
  "campaigns/delete",
  async (campaignId: string) => {
    await deleteCampaignApi(campaignId);
    return campaignId;
  }
);

// ✅ Create Campaign
export const createCampaign = createAsyncThunk(
  "campaign/createCampaign",
  async (campaignData: any, { rejectWithValue }) => {
    try {
      const response = await createCampaignAPI(campaignData);
      console.log("Create Response:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Unified Redux Slice for Campaigns
const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- Load Campaigns ---
    builder.addCase(loadCampaigns.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loadCampaigns.fulfilled, (state, action) => {
      console.log("API Response Data:", action.payload);
      if (!action.payload || !action.payload.data) {
        console.error("Error: API did not return campaigns data");
        state.campaigns = [];
        state.pagination = { total: 0, page: 1, limit: 10, totalPages: 0 };
        state.loading = false;
        return;
      }
      state.loading = false;
      state.campaigns = action.payload.data;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(loadCampaigns.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "An error occurred";
    });

    // --- Pause/Resume Campaign ---
    builder.addCase(pauseResumeCampaign.fulfilled, (state, action) => {
      console.log("Redux State Update:", action.payload);
      if (!action.payload || !action.payload._id) {
        console.error("Error: API did not return updated campaign");
        return;
      }
      state.campaigns = state.campaigns.map((c) =>
        c._id === action.payload._id ? { ...c, status: action.payload.status } : c
      );
    });

    // --- Duplicate Campaign ---
    builder.addCase(duplicateCampaign.fulfilled, (state, action) => {
      state.campaigns = [...state.campaigns, action.payload];
    });

    // --- Delete Campaign ---
    builder.addCase(deleteCampaign.fulfilled, (state, action) => {
      state.campaigns = state.campaigns.filter((c) => c._id !== action.payload);
    });

    // --- Create Campaign ---
    builder.addCase(createCampaign.pending, (state) => {
      state.createLoading = true;
      state.createError = null;
    });
    builder.addCase(createCampaign.fulfilled, (state, action: PayloadAction<any>) => {
      state.createLoading = false;
      state.createCampaignData = action.payload;
      // Optionally, you could also add the created campaign to your campaigns array:
      state.campaigns.push(action.payload);
    });
    builder.addCase(createCampaign.rejected, (state, action) => {
      state.createLoading = false;
      state.createError = (action.payload as string) || "Something went wrong";
    });
  },
});

export default campaignSlice.reducer;
