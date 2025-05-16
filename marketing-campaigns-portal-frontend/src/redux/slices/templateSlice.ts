// src/redux/slices/templateSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchTemplates,
  fetchRecentlyUsedTemplates,
  toggleFavoriteTemplate,
  fetchFavoriteTemplates,
  fetchTemplateById,
  updateTemplateById,
  deleteTemplateById,
  restoreTemplateById,  // ✅ newly imported
  duplicateTemplateById,
  createTemplate,
  fetchTemplatesByCategory,
} from "../../api/apiClient";
import { Template as TemplateType} from "../../types/template"; // Adjust the import path as necessary
export interface Template {
  _id: string;
  name: string;
  type: string;
  category: string;
  lastModified: string;
  isFavorite: boolean;
  favorite?: boolean;
  [key: string]: any;
  includeOptOutText? : boolean;

}

export interface TemplateQuery {
  search?: string;
  type?: string;
  category?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  append?: boolean;
}


export const createTemplateThunk = createAsyncThunk<any, TemplateType>(
  "templates/createTemplate",
  async (data: TemplateType, thunkAPI): Promise<any> => {
    try {
      const res: any = await createTemplate(data); // assumes same-named function from apiClient
      console.log('res///////////////////////////////////');
      console.log('res', res);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create template"
      );
    }
  }
);


export const getTemplates = createAsyncThunk(
  "templates/getTemplates",
  async (params: TemplateQuery, thunkAPI) => {
    try {
      const res = await fetchTemplates(params);
      return {
        data: res.data.data, // ensure data.data is the array
        totalPages: res.data.pagination.totalPages,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch templates"
      );
    }
  }
);

export const getRecentlyUsedTemplates = createAsyncThunk(
  "templates/getRecentlyUsed",
  async (params: TemplateQuery, thunkAPI) => {
    try {
      const res = await fetchRecentlyUsedTemplates(params);
      return {
        data: res.data.templates,
        totalPages: res.data.pagination.totalPages,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch recent templates"
      );
    }
  }
);

export const getFavoriteTemplates = createAsyncThunk(
  "templates/getFavoriteTemplates",
  async (params: TemplateQuery, thunkAPI) => {
    try {
      const res = await fetchFavoriteTemplates(params);
      return {
        data: res.data.templates,
        totalPages: res.data.pagination.totalPages,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch favorite templates"
      );
    }
  }
);
// toggleFavorite
export const toggleFavorite = createAsyncThunk(
  "templates/toggleFavorite",
  async (templateId: string) => {
    const res = await toggleFavoriteTemplate(templateId);
    return {
      templateId,
      updatedTemplate: res.data,
    };
  }
);
// fetchTemplateById
export const getTemplateById = createAsyncThunk(
  "templates/getTemplateById",
  async (templateId: string, thunkAPI) => {
    try {
      const res = await fetchTemplateById(templateId);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch template"
      );
    }
  }
);
// updateTemplateById
export const updateTemplate = createAsyncThunk(
  "templates/updateTemplate",
  async ({ id, data }: { id: string; data: any }, thunkAPI) => {
    try {
      const res = await updateTemplateById(id, data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update template");
    }
  }
);
// deleteTemplateById
export const deleteTemplate = createAsyncThunk(
  "templates/deleteTemplate",
  async (templateId: string, thunkAPI) => {
    try {
      const res = await deleteTemplateById(templateId);
      return { id: templateId };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to delete template");
    }
  }
);

// restoreTemplateById
export const restoreTemplate = createAsyncThunk(
  "templates/restoreTemplate",
  async (templateId: string, thunkAPI) => {
    try {
      const res = await restoreTemplateById(templateId);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to restore template");
    }
  }
);

// duplicateTemplate
export const duplicateTemplate = createAsyncThunk(
  "templates/duplicateTemplate",
  async (templateId: string, thunkAPI) => {
    try {
      const res = await duplicateTemplateById(templateId);
      return res.data;

    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to duplicate template");
    }
  }
);

// fetchTemplatesByCategory
export const getTemplatesByCategory = createAsyncThunk(
  "templates/getTemplatesByCategory",
  async (
    {
      category,
      type,
      page = 1,
      limit = 10,
    }: { category: string; type: string; page?: number; limit?: number },
    thunkAPI
  ) => {
    try {
      const res = await fetchTemplatesByCategory(category, type, page, limit);
      return {
        data: res.data,
        totalPages: res.pagination?.totalPages || 1,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.message || "Failed to fetch templates by category"
      );
    }
  }
);

interface TemplateState {
  allTemplates: Template[];
  recentTemplates: Template[];
  favoriteTemplates: Template[];
  loading: boolean;
  error: string | null;
  filters: TemplateQuery & { page: number; limit: number };
  activeTab: "all" | "recent" | "favorite";
  totalPages?: number;
  selectedTemplate: any | null;
}

const initialState: TemplateState = {
  allTemplates: [],
  recentTemplates: [],
  favoriteTemplates: [],
  selectedTemplate: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    type: "",
    category: "",
    sortBy: "",
    page: 1,
    append: false,
    limit: 10,
  },
  activeTab: "all",
  totalPages: 1,
};

const templateSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<TemplateQuery>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setActiveTab: (state, action: PayloadAction<"all" | "recent" | "favorite">) => {
      state.activeTab = action.payload;
    },
    clearSelectedTemplate: (state) => {
      state.selectedTemplate = null;
    },
    setAllTemplates: (state, action: PayloadAction<Template[]>) => {
      console.log("Setting all templates:", action.payload);
      state.allTemplates = action.payload;
    },
    setRecentTemplates: (state, action: PayloadAction<Template[]>) => {
      state.recentTemplates = action.payload;
    },
    setFavoriteTemplates: (state, action: PayloadAction<Template[]>) => {
      state.favoriteTemplates = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createTemplateThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createTemplateThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.allTemplates.unshift(action.payload);
    })
    .addCase(createTemplateThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    .addCase(getTemplates.pending, (state) => {
      state.loading = true;
    })
    // .addCase(getTemplates.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.allTemplates = action.payload.data;
    //   state.totalPages = action.payload.totalPages;
    // })
    // .addCase(getTemplates.fulfilled, (state, action) => {
    //   const newTemplates = action.payload.data;
    //   const currentPage = action.meta.arg.page; // <-- the page number you passed in
    
    //   state.loading = false;
    //   state.totalPages = action.payload.totalPages;
    
    //   if (currentPage === 1) {
    //     // Fresh load or filter reset
    //     state.allTemplates = newTemplates;
    //   } else {
    //     // Infinite scroll - append
    //     const existing = state.allTemplates || [];
    //     const merged = [...existing, ...newTemplates];
    
    //     // Optional deduplication based on _id
    //     const deduped = Array.from(new Map(merged.map(t => [t._id, t])).values());
    
    //     state.allTemplates = deduped;
    //   }
    // })    
    .addCase(getTemplates.fulfilled, (state, action) => {
      const newTemplates = action.payload.data;
      const currentPage = action.meta.arg.page;
      const shouldAppend = action.meta.arg.append;
    
      state.loading = false;
      state.totalPages = action.payload.totalPages;
    
      if (!shouldAppend || currentPage === 1) {
        // Replace mode
        state.allTemplates = newTemplates;
      } else {
        // Append mode
        const existing = state.allTemplates || [];
        const merged = [...existing, ...newTemplates];
    
        // Optional deduplication based on _id
        const deduped = Array.from(new Map(merged.map(t => [t._id, t])).values());
    
        state.allTemplates = deduped;
      }
    })    
    .addCase(getRecentlyUsedTemplates.fulfilled, (state, action) => {
      state.recentTemplates = action.payload.data;
      state.totalPages = action.payload.totalPages;
    })
    // .addCase(getFavoriteTemplates.fulfilled, (state, action) => {
    //   state.favoriteTemplates = action.payload.data;
    //   state.totalPages = action.payload.totalPages;
    // })
    // .addCase(getFavoriteTemplates.fulfilled, (state, action) => {
    //   const newTemplates = action.payload.data;
    //   const currentPage = action.meta.arg.page; // <-- the page number you passed in
    
    //   state.loading = false;
    //   state.totalPages = action.payload.totalPages;
    
    //   if (currentPage === 1) {
    //     // Fresh load or filter reset
    //     state.favoriteTemplates = newTemplates;
    //   } else {
    //     // Infinite scroll - append
    //     const existing = state.favoriteTemplates || [];
    //     const merged = [...existing, ...newTemplates];
    
    //     // Optional deduplication based on _id
    //     const deduped = Array.from(new Map(merged.map(t => [t._id, t])).values());
    
    //     state.favoriteTemplates = deduped;
    //   }
    // })   
    
    .addCase(getFavoriteTemplates.fulfilled, (state, action) => {
      const newTemplates = action.payload.data;
      const currentPage = action.meta.arg.page;
      const shouldAppend = action.meta.arg.append;
    
      state.loading = false;
      state.totalPages = action.payload.totalPages;
    
      if (!shouldAppend || currentPage === 1) {
        // Replace mode
        state.favoriteTemplates = newTemplates;
      } else {
        // Append mode
        const existing = state.favoriteTemplates || [];
        const merged = [...existing, ...newTemplates];
    
        // Optional deduplication based on _id
        const deduped = Array.from(new Map(merged.map(t => [t._id, t])).values());
    
        state.favoriteTemplates = deduped;
      }
    })     
    .addCase(getTemplateById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getTemplateById.fulfilled, (state, action) => {
      state.selectedTemplate = action.payload;
    })
    .addCase(getTemplateById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(updateTemplate.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateTemplate.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedTemplate = action.payload;
    })
    .addCase(updateTemplate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(toggleFavorite.fulfilled, (state, action) => {
      const { templateId, updatedTemplate } = action.payload;

      const isFav =
        updatedTemplate.favorite ?? updatedTemplate.isFavorite ?? false;

      const updateList = (list: Template[]) => {
        const index = list.findIndex((t) => t._id === templateId);
        if (index !== -1) {
          list[index] = {
            ...list[index],
            isFavorite: isFav,
            favorite: isFav,
          };
        }
      };

      updateList(state.allTemplates);
      updateList(state.recentTemplates);
      updateList(state.favoriteTemplates);

      const existsInFavorites = state.favoriteTemplates.some((t) => t._id === templateId);

      if (isFav) {
        if (!existsInFavorites) {
          state.favoriteTemplates.push({
            ...updatedTemplate,
            isFavorite: true,
            favorite: true,
          });
        }
      } else {
        state.favoriteTemplates = state.favoriteTemplates.filter(
          (t) => t._id !== templateId
        );
      }
    })
    // deleteTemplate
    .addCase(deleteTemplate.fulfilled, (state, action) => {
      const deletedId = action.payload.id;

      const removeFromList = (list: Template[]) =>
        list.filter((t) => t._id !== deletedId);

      state.allTemplates = removeFromList(state.allTemplates);
      state.recentTemplates = removeFromList(state.recentTemplates);
      state.favoriteTemplates = removeFromList(state.favoriteTemplates);

      if (state.selectedTemplate?._id === deletedId) {
        state.selectedTemplate = null;
      }
    })
    // restoreTemplate fulfilled
    .addCase(restoreTemplate.fulfilled, (state, action) => {
      const restored = action.payload;

      // add back to allTemplates if it’s not there
      const exists = state.allTemplates.find((t) => t._id === restored._id);
      if (!exists) {
        state.allTemplates.unshift(restored);
      }

      // similarly for recentTemplates and favoriteTemplates if needed
    })

    //  duplicateTemplate fulfilled
      .addCase(duplicateTemplate.fulfilled, (state, action) => {
      const duplicated = action.payload;
      state.allTemplates.unshift(duplicated);
    })
    .addCase(getTemplatesByCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.totalPages = action.payload.totalPages;
      state.allTemplates = action.payload.data || [];
    });

  },
});

export const { 
  setFilters, setActiveTab, clearSelectedTemplate,setAllTemplates, 
  setRecentTemplates, setFavoriteTemplates, 
} = templateSlice.actions;

export default templateSlice.reducer;