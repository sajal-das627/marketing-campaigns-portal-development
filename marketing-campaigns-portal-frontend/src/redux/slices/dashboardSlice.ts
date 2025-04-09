import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDashboardStats } from '../../api/apiClient';
import { DashboardData } from '../../types/dashboard';

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async () => {
    return await fetchDashboardStats();
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: null as DashboardData | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export default dashboardSlice.reducer;
