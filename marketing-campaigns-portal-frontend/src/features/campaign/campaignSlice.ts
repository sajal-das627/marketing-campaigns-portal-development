import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createCampaign as createCampaignAPI } from "../../api/apiClient";

interface CampaignState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

export const createCampaign = createAsyncThunk(
  "campaign/createCampaign",
  async (campaignData: any, { rejectWithValue }) => {
    try {
      const response = await createCampaignAPI(campaignData);
      console.log("response",response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState: CampaignState = {
  data: null,
  loading: false,
  error: null,
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        // Casting action.payload to string if it exists
        state.error = action.payload as string || "Something went wrong";
      });
  },
});

export default campaignSlice.reducer;
