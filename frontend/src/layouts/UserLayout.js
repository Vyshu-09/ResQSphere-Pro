import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import {
  Dashboard,
  Report,
  History,
  Notifications,
  Map,
  ExitToApp,
  Person
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const UserLayout = ({ responder = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = responder
    ? [
        { label: 'Dashboard', icon: <Dashboard />, path: '/responder/dashboard' },
        { label: 'Incidents', icon: <Report />, path: '/responder/incidents' },
        { label: 'Maps', icon: <Map />, path: '/responder/maps' },
        { label: 'Profile', icon: <Person />, path: '/responder/profile' }
      ]
    : [
        { label: 'Dashboard', icon: <Dashboard />, path: '/user/dashboard' },
        { label: 'Report', icon: <Report />, path: '/user/report' },
        { label: 'My Reports', icon: <History />, path: '/user/reports' },
        { label: 'Alerts', icon: <Notifications />, path: '/user/alerts' },
        { label: 'Maps', icon: <Map />, path: '/user/maps' },
        { label: 'Profile', icon: <Person />, path: '/user/profile' }
      ];

  React.useEffect(() => {
    const currentPath = location.pathname;
    const index = menuItems.findIndex(item => currentPath.includes(item.path));
    if (index !== -1) {
      setValue(index);
    }
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(menuItems[newValue].path);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ pb: 7 }}>
      <AppBar position="fixed" sx={{ top: 0 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ResQSphere Pro
          </Typography>
          <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => {
              navigate(responder ? '/responder/profile' : '/user/profile');
              handleMenuClose();
            }}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Edit Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ mt: 8, p: 2 }}>
        <Outlet />
      </Box>

      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000
        }}
      >
        {menuItems.map((item, index) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};

export default UserLayout;

