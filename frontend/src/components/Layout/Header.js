import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Shield,
  Home,
  Assignment,
  Help,
  Login,
  PersonAdd,
  Warning
} from '@mui/icons-material';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { text: 'Home', path: '/', icon: <Home /> },
    { text: 'Actions', path: '/actions', icon: <Assignment /> },
    { text: 'Help', path: '/help', icon: <Help /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Toolbar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Warning sx={{ mr: 2 }} />
        <Typography variant="h6" fontWeight="bold">
          ResQSphere
        </Typography>
      </Toolbar>
      <List sx={{ pt: 2 }}>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileOpen(false);
                    }}
                    sx={{
                      '&.Mui-selected': {
                        background: 'rgba(255,255,255,0.2)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.25)',
                        },
                      },
                    }}
                  >
                    <Box sx={{ mr: 2 }}>{item.icon}</Box>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
        <ListItem disablePadding sx={{ mt: 2 }}>
          <ListItemButton onClick={handleLoginClick}>
            <Box sx={{ mr: 2 }}><Login /></Box>
            <ListItemText primary="Login" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              mr: 4,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
            onClick={() => navigate('/')}
          >
            <Shield sx={{ mr: 1, fontSize: 32 }} />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: '1px',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              ResQSphere
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                ml: 1,
                display: { xs: 'none', md: 'block' },
                opacity: 0.9,
              }}
            >
              Pro
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  color: 'white',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  background: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.15)',
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* Login Button */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Login />}
              onClick={handleLoginClick}
              sx={{
                background: 'white',
                color: '#667eea',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  background: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/register')}
              sx={{
                borderColor: 'white',
                color: 'white',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  borderColor: 'white',
                  background: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Sign Up
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, ml: 'auto' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;

