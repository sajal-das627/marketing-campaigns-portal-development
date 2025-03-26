import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemIcon, Collapse, Box, Drawer, useTheme } from "@mui/material";
import { ExpandLess, ExpandMore, Dashboard as DashboardIcon, Campaign as CampaignIcon, Create as CreateIcon, ViewModule as TemplateIcon, Group as AudienceIcon, ChevronRight } from "@mui/icons-material";

const CollapsibleMenu = () => {
  const location = useLocation();
  const theme = useTheme();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState([
    { text: "Dashboard", icon: <DashboardIcon />, path: "/", active: false },
    {
      text: "Campaigns",
      icon: <CampaignIcon />,
      active: false,
      subItems: [
        { text: "Create Campaign", icon: <CreateIcon />, path: "/create-campaign", active: false },
        { text: "Manage Campaign", icon: <TemplateIcon />, path: "/manage-campaign", active: false },
      ],
    },
    { text: "Audience", icon: <AudienceIcon />, path: "/audience", active: false },
  ]);


  useEffect(() => {
    const updatedMenuItems = menuItems.map(item => {
      if (item.subItems) {
        const updatedSubItems = item.subItems.map(subItem => ({
          ...subItem,
          active: location.pathname === subItem.path,
        }));
        const isAnySubItemActive = updatedSubItems.some(subItem => subItem.active);
        if(isAnySubItemActive) setOpenSubMenu(item.text)
        return {
          ...item,
          active: location.pathname === item.path || isAnySubItemActive,
          subItems: updatedSubItems,
        };
      }
      return {
        ...item,
        active: location.pathname === item.path,
      };
    });
    setMenuItems(updatedMenuItems);
  }, [location.pathname]);

  const handleClick = (menuItem: string) => {
    setOpenSubMenu(openSubMenu === menuItem ? null : menuItem);
  };

  

  return (
    <List>
      {menuItems.map((item, index) => (
        <div key={index}>
          {/* Main menu item */}
          <ListItem
            component={item.path ? Link : "button"}
            to={item.path}
            onClick={item.subItems ? () => handleClick(item.text) : ()=>setOpenSubMenu("")}
            sx={{
                color: item.active ? theme.palette.primary.main : theme.palette.secondary.main,
                backgroundColor: item.active ? theme.palette.background.default : theme.palette.common.white,
              '&:hover': {
                backgroundColor: theme.palette.background.default,
              },
              border: 'none', // Remove border
            }}
          >
            <ListItemIcon sx={{ color: item.active ? theme.palette.primary.main : theme.palette.secondary.main, marginRight:"-20px" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
            {item.subItems ? (openSubMenu === item.text ? <ExpandLess /> : <ChevronRight />) : null}
          </ListItem>

          {/* Submenu items */}
          {item.subItems && (
            <Collapse in={openSubMenu === item.text} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.subItems.map((subItem, subIndex) => (
                  <ListItem
                    component={Link}
                    to={subItem.path}
                    key={subIndex}
                    sx={{
                      pl: 4,
                      color: subItem.active ? theme.palette.primary.main : theme.palette.secondary.main,
                      backgroundColor: '#fff',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                      border: 'none', // Remove border
                    }}
                  >
                    <Box component="span" sx={{ width: 8, height: 8, bgcolor: subItem.active ? theme.palette.primary.main : theme.palette.secondary.main, borderRadius: '50%', display: 'inline-block', mr: 2 }} />
                    <ListItemText primary={subItem.text} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          )}
        </div>
      ))}
    </List>
  );
};

const Sidebar = (props:any) => {
  const {drawerWidth} = props;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ padding: "20px", marginBottom: "5px" }}>
        <img src="https://request.cutx.org/cutx.svg" alt="logo" width={'50px'} height={'50px'} />
      </Box>
      <Box sx={{ overflow: 'auto' }}>
        <CollapsibleMenu />
      </Box>
    </Drawer>
  );
};

export default Sidebar;