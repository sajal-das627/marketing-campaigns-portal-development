// import { AppBar, Box, CssBaseline, Toolbar } from "@mui/material";
// import Sidebar from "layout/Sidebar";
// import { RouterProvider } from "react-router-dom";
// import { router } from "./routes/AppRoutes";
// import ActivityLogs from "./components/ActivityLogs";
// import Analytics from "./components/Analytics";
// import Campaigns from "./components/Campaigns";
// import CampaignWizard from "./components/CampaignWizard/CampaignWizard";
// import Dashboard from "./components/Dashboard";
// import FilterBuilder from "./components/FilterBuilder/FilterBuilder";
// import SavedFilters from "./components/FilterBuilder/SavedFilters";
// import ManageFilter from "./components/ManageFilter/ManageFilter";
// import TemplateManagement from "./components/Templates/TemplateManagement";
// import Login from "./features/auth/Login";
// import Header from "layout/Header";

// import ResponsiveLayout from "layout/ResponsiveLayout";

// const drawerWidth = 240;

// const App = () => {
//   return (
//     <Box sx={{ display: 'flex' }}>
//     <CssBaseline />
//     <RouterProvider router={router} />
//   </Box>
//   );
// };

// export default App;

////old
import { AppBar, Box, CssBaseline, Toolbar } from "@mui/material";
import Sidebar from "layout/Sidebar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ActivityLogs from "./components/ActivityLogs";
import Analytics from "./components/Analytics";
import Campaigns from "./components/Campaigns";
import CampaignWizard from "./components/CampaignWizard/CampaignWizard";
import Dashboard from "./components/Dashboard";
import FilterBuilder from "./components/FilterBuilder/FilterBuilder";
import SavedFilters from "./components/FilterBuilder/SavedFilters";
import ManageFilter from "./components/ManageFilter/ManageFilter";
import TemplateManagement from "./components/Templates/TemplateManagement";
import Login from "./features/auth/Login";
import Header from "layout/Header";

import ResponsiveLayout from "layout/ResponsiveLayout";

const drawerWidth = 240;

const App = () => {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, marginLeft: drawerWidth, width: `calc(100% - ${drawerWidth}px)` }}>
          <Toolbar>
            <h1>Marketing Campaigns Portal</h1>
          </Toolbar>
        </AppBar> */}
        {/* <Header drawerWidth={drawerWidth}/>
        <Sidebar drawerWidth={drawerWidth}/> */}
        <ResponsiveLayout />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/manage-campaign" element={<Campaigns />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/activity-logs" element={<ActivityLogs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/filter-builder" element={<FilterBuilder />} />
            {/* <Route path="/create-campaign" element={<CampaignWizard />} /> */}
            <Route path="/create-campaign/:id?" element={<CampaignWizard />} />
            <Route path="/saved-filters" element={<SavedFilters />} />
            <Route path="/create-filters" element={<FilterBuilder />} />
            <Route path="/templates" element={<TemplateManagement />} />
            <Route path="/create-templates" element={<TemplateManagement />} />
            <Route path="/filters" element={<ManageFilter />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;