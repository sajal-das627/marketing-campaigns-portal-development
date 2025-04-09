import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  CssBaseline,
  Box,
  Hidden,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  
} from "@mui/material";

import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";

const drawerWidth:number = 240;

const ResponsiveLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [notifications, setNotifications] = useState(); // Default notification count

  // State for name and email
  const [name, setName] = useState('Marc Jacob');
  const [email, setEmail] = useState('marc.jacob@email.com');
  
  const handleSearchChange = (e: any) => {
    setSearchValue(e.target.value);
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Topbar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer - 1,
            bgcolor: "#fff",
            color: "#000",
            // width: { sm: `calc(100% - ${drawerWidth}px)` },
            width: { sm: `100%` },
         }}
      >
        <Toolbar>
          <Box sx={{ display: { md: 'none' } }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            </Box>
          
           {/* Right part: Search bar, Notifications, Profile */}
           {/* <Box sx={{ display: 'flex', alignItems: 'center' }}> */}
         
            <Box component="img" src="/icons/logo.png" alt="logo" width={'auto'} height={'35px'} />
         

          <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', padding:2, }}>
          
                <Box sx={{display: { xs: 'none', lg:'block'} }}>

                <Box  sx={{ml: 9, display: 'flex', flexDirection: 'column'}}>
                  <Typography variant="h6" sx={{ fontSize: "16px", color: 'text.secondary' }}>
                    Welcome, {name}!
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "16px", color: 'text.primary' }}>
                    Ready to Boost Your Campaign
                  </Typography>
                </Box>
                </Box>
                <Box></Box>
            <Box sx={{display:'flex', alignItems:'center'}}>
              
              {/* Search Bar with Search Icon */}
              <TextField
                sx={{
                  flexGrow: 1,
                  marginLeft: 2,
                  marginRight: 2,
                  maxWidth: 400,
                  backgroundColor: 'white', // Set background to white
                }}
                variant="outlined"
                size="small"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search here"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Notifications Icon */}
              <IconButton color="inherit" aria-label="notifications">
                <Badge badgeContent={notifications} color="error">
                  <NotificationsIcon sx={{ color: 'text.primary' }} />
                </Badge>
              </IconButton>

              {/* User Profile */}
              <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
                {/* Avatar */}
                <Avatar sx={{ width: 35, height: 35 }} src="https://www.w3schools.com/w3images/avatar2.png" />

                {/* Name and Email */}
                <Box sx={{ marginLeft: 1, display: {xs:'none', md: "block"} }}>
                  <Typography variant="body2" sx={{ fontSize: "14px", color: 'text.primary' }}>
                    {name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "14px", color: 'text.secondary' }}>
                    {email}
                  </Typography>
                </Box>
              </Box> 
            </Box>
          </Box>
          {/* <Typography variant="h6" noWrap>
            My App
          </Typography> */}
        </Toolbar>
      </AppBar>

      {/* Desktop Sidebar */}
      <Hidden mdDown>
        <Sidebar drawerWidth={drawerWidth} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}  />
      </Hidden>

      {/* Mobile Sidebar */}
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Sidebar drawerWidth={drawerWidth} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        </Drawer>
      </Hidden>

      {/* <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography paragraph>
          Welcome to your responsive layout!
        </Typography>
      </Box> */}
    </Box>
  );
};

export default ResponsiveLayout;