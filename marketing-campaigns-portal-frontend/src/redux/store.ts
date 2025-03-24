import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import campaignReducer from "../features/campaign/campaignSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,    
    campaign: campaignReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
