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
import {
  //  AppBar,
   Box, CssBaseline, Toolbar } from "@mui/material";
// import Sidebar from "layout/Sidebar";
import { Route, BrowserRouter as Router, Routes, useLocation, matchPath } from "react-router-dom";
import ActivityLogs from "./components/ActivityLogs";
import Analytics from "./components/Analytics";
import Campaigns from "./components/Campaigns";
import CampaignWizard from "./components/CampaignWizard/CampaignWizard";
import Dashboard from "./components/Dashboard";
import FilterBuilder from "./components/FilterBuilder/FilterBuilder";
import SavedFilters from "./components/FilterBuilder/SavedFilters";
import ManageFilter from "./components/ManageFilter/ManageFilter";
// import ManageFilter from "./components/Filters";
import CreateTemplates from "./components/Templates/SMSEmailModal";
import EditFilter from "./components/FilterBuilder/EditFilter";
// import TemplateManagementOld from "./components/Templates/TemplateManagementOld";
import Templates from "./components/Templates/Templates";
import Login from "./features/auth/Login";
import EditorSample from './components/EditorSample/App/'
import SMSEditor from './components/Templates/SMSEditor';
import EmailTemplates from './components/Templates/EmailTemplates';
// import Header from "layout/Header";

import { DndProvider,} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ResponsiveLayout from "layout/ResponsiveLayout";
// const drawerWidth = 240;



const AppContent = () => {
  const location = useLocation();
  const match = matchPath('/build-template/:id?', location.pathname);

  return (
    <>
      {/* <Header drawerWidth={drawerWidth}/>
      <Sidebar drawerWidth={drawerWidth}/> */}

      {match ? (
        <Routes>
          <Route path="/build-template/:id?" element={<EditorSample />} />
        </Routes>
       
      ):(
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
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
              <Route path="/templates" element={<Templates />} />
              <Route path="/create-templates" element={<CreateTemplates />} />
              <Route path="/email-templates" element={<EmailTemplates />} />
              <Route path="/build-template/:id" element={<EditorSample />} />
              <Route path="/build-sms" element={<SMSEditor />} />
              <Route path="/filters" element={<ManageFilter />} />
              <Route path="/edit-filter/:id" element={<EditFilter />} />
              
              {/* <Route path="/templates-old" element={<TemplateManagementOld />} /> */}
            </Routes>
          </Box>
        </Box>
      )} 
    </>
  );
};

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
    <Router>
      <AppContent />
    </Router>
    </DndProvider>
  );
};

export default App;