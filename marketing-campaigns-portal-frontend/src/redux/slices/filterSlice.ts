import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchFilterData } from "../../api/apiClient";

export const fetchFiltersData = createAsyncThunk(
    "filters/fetchFilterData",
    async(filterId: string, {rejectWithValue})=>{   
        try{
            const response = await fetchFilterData(filterId);
            return response.data;
        }catch (error: any){
            return rejectWithValue(error.message);        
        }
    }
)


interface FiltersState {
    data: any; // Adjust this type based on your API response
    loading: boolean;
    error: string | null;
  }
  
  const initialState: FiltersState = {
    data: null,
    loading: false,
    error: null,
  };

  const filtersSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchFiltersData.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchFiltersData.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(fetchFiltersData.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });
  
  export default filtersSlice.reducer;