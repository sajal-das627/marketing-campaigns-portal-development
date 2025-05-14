import 
// React,
 { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  InputAdornment,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ArrowDropDown';

const Header = (props: any) => {
  const { drawerWidth = 240 } = props; // Default value for drawerWidth if not passed

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [notifications, setNotifications] = useState(); // Default notification count

  // State for name and email
  const [name, setName] = useState('Marc Jacob');
  const [email, setEmail] = useState('marc.jacob@email.com');

  const handleProfileMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          marginLeft: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          background: "#fff",
          boxShadow: "none",
          borderBottom: "1px solid #EAECF0",
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left part: Welcome text and subtext */}
          <Box>
            <Typography variant="h6" sx={{ fontSize: "16px", color: 'text.secondary' }}>
              Welcome, {name}!
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "16px", color: 'text.primary' }}>
              Ready to Boost Your Campaign
            </Typography>
          </Box>

          {/* Right part: Search bar, Notifications, Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              <Box sx={{ marginLeft: 1 }}>
                <Typography variant="body2" sx={{ fontSize: "14px", color: 'text.primary' }}>
                  {name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "14px", color: 'text.secondary' }}>
                  {email}
                </Typography>
              </Box>

              {/* Dropdown Icon */}
              <IconButton
                color="inherit"
                onClick={handleProfileMenuOpen}
                aria-controls="profile-menu"
                aria-haspopup="true"
                sx={{ marginLeft: 1 }}
              >
                <ExpandMoreIcon sx={{ color: 'text.secondary' }} />
              </IconButton>
            </Box>

            {/* Profile Menu Dropdown */}
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleProfileMenuClose}>My Account</MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>Log Out</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
