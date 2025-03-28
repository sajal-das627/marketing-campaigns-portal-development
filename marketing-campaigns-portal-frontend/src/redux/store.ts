import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import campaignReducer from "./slices/campaignSlice";
import filterReducer from "./slices/filterSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,    
    campaign: campaignReducer, 
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
