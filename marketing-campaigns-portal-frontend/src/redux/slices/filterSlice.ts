import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchFilterData,getFilters, getSingleFilter, duplicateFilter, deleteFilter, updateFilter  } from "../../api/apiClient";


// interface FiltersState {
//     data: any; // Adjust this type based on your API response
//     loading: boolean;
//     error: string | null;
//   }
  
//   const initialState: FiltersState = {
//     data: null,
//     loading: false,
//     error: null,
//   };


  interface FilterState {
    data: any; 
    filters: any[];
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    appliedFilter: any | null;
    isDraft: boolean;
  }
  
  const initialState: FilterState = {
    data: {},
    filters: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    appliedFilter: null,
    isDraft: false,
  };
  
  //remove this later
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

  //added here
  
// Async thunk for fetching filters
export const fetchFilters = createAsyncThunk(
  "filters/fetchFilters",
  async (
    {
      page = 1,
      search = '',
      sortBy = '',
      order = 'asc',
      limit = 10,
      isDraft = false,
    }: {
      page?: number;
      search?: string;
      sortBy?: string;
      order?: string;
      limit?: number;
      isDraft?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await getFilters(page, search, sortBy, order, limit, isDraft);

      console.log("API Response:", response);

      if (!response || !response.filters || !response.pagination) {
        throw new Error("Invalid API response: Missing pagination data");
      }

      return {
        filters: response.filters,
        currentPage: response.pagination.page,
        totalPages: response.pagination.totalPages,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch filters");
    }
  }
);

// Async thunk for applying a filter
export const applyFilter = createAsyncThunk("filters/applyFilter", async (filterId: string) => {
  const data = await getSingleFilter(filterId);
  return data;
});

// Async thunk for duplicating a filter
export const duplicateFilterAsync = createAsyncThunk(
  "filters/duplicateFilter",
  async (filterId: string, { dispatch, rejectWithValue }) => {
    try {
      const duplicatedFilter = await duplicateFilter(filterId); // Call the API
      return duplicatedFilter; // Return duplicated filter
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to duplicate filter");
    }
  }
);
// Async thunk for deleting a filter
export const deleteFilterAsync = createAsyncThunk(
  "filters/deleteFilter",
  async (filterId: string, { dispatch, rejectWithValue }) => {
    try {
      await deleteFilter(filterId);
      return filterId; // Return the deleted filter ID
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete filter");
    }
  }
);

// Thunk to update a filter
export const updateFilterAsync = createAsyncThunk(
  "filters/updateFilter",
  async ({ filterId, updatedData }: { filterId: string; updatedData: any }, { rejectWithValue }) => {
    try {
      const updatedFilter = await updateFilter(filterId, updatedData);
      return updatedFilter;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


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
        })
        
      .addCase(fetchFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.filters = action.payload.filters;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(applyFilter.fulfilled, (state, action) => {
        state.appliedFilter = action.payload;
      })
      .addCase(duplicateFilterAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.filters = [...state.filters, action.payload]; // Append the duplicated filter
        }
      })
      .addCase(duplicateFilterAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteFilterAsync.fulfilled, (state, action) => {
        state.filters = state.filters.filter((filter) => filter._id !== action.payload);
      })
      .addCase(deleteFilterAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateFilterAsync.fulfilled, (state, action) => {
        const index = state.filters.findIndex((filter) => filter._id === action.payload._id);
        if (index !== -1) {
          state.filters[index] = action.payload; // Update the filter in state
        }
      })
      .addCase(updateFilterAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
    },
  });
  
  export default filtersSlice.reducer;