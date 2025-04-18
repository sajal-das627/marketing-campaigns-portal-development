import { AppBar, Box, CssBaseline, Toolbar } from "@mui/material";
import Sidebar from "layout/Sidebar";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import ActivityLogs from "../components/ActivityLogs";
import Analytics from "../components/Analytics";
import Campaigns from "../components/Campaigns";
import CampaignWizard from "../components/CampaignWizard/CampaignWizard";
import Dashboard from "../components/Dashboard";
import FilterBuilder from "../components/FilterBuilder/FilterBuilder";
import SavedFilters from "../components/FilterBuilder/SavedFilters";
import ManageFilter from "../components/ManageFilter/ManageFilter";
import TemplateManagement from "../components/Templates/TemplateManagement";
import Login from "../features/auth/Login";
import Header from "layout/Header";

import ResponsiveLayout from "layout/ResponsiveLayout";

const drawerWidth = 240;

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<ResponsiveLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/manage-campaign" element={<Campaigns />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/activity-logs" element={<ActivityLogs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/filter-builder" element={<FilterBuilder />} />
        <Route path="/create-campaign/:id?" element={<CampaignWizard />} />
        <Route path="/saved-filters" element={<SavedFilters />} />
        <Route path="/create-filters" element={<FilterBuilder />} />
        <Route path="/templates" element={<TemplateManagement />} />
        <Route path="/create-templates" element={<TemplateManagement />} />
        <Route path="/filters" element={<ManageFilter />} />
      </Route>
    )
  );

