import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  IconButton,
  Divider
} from '@mui/material';
import {
  Shield,
  Email,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  LinkedIn,
  YouTube,
  GitHub
} from '@mui/icons-material';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { text: 'Home', path: '/' },
    { text: 'Actions', path: '/actions' },
    { text: 'Help', path: '/help' },
    { text: 'Login', path: '/login' },
    { text: 'Sign Up', path: '/register' },
  ];

  const resources = [
    { text: 'Documentation', path: '#' },
    { text: 'API Reference', path: '#' },
    { text: 'Support Center', path: '#' },
    { text: 'Community', path: '#' },
    { text: 'Training', path: '#' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        mt: 'auto',
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Shield sx={{ fontSize: 40, mr: 1, color: '#667eea' }} />
              <Typography variant="h5" fontWeight="bold">
                ResQSphere Pro
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              Advanced Disaster Management Platform for coordinating emergency responses,
              managing incidents, and ensuring public safety through real-time communication
              and comprehensive analytics.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                sx={{ color: 'white', '&:hover': { color: '#667eea', transform: 'translateY(-3px)' } }}
                aria-label="Facebook"
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{ color: 'white', '&:hover': { color: '#667eea', transform: 'translateY(-3px)' } }}
                aria-label="Twitter"
              >
                <Twitter />
              </IconButton>
              <IconButton
                sx={{ color: 'white', '&:hover': { color: '#667eea', transform: 'translateY(-3px)' } }}
                aria-label="LinkedIn"
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                sx={{ color: 'white', '&:hover': { color: '#667eea', transform: 'translateY(-3px)' } }}
                aria-label="YouTube"
              >
                <YouTube />
              </IconButton>
              <IconButton
                sx={{ color: 'white', '&:hover': { color: '#667eea', transform: 'translateY(-3px)' } }}
                aria-label="GitHub"
              >
                <GitHub />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link) => (
                <Box
                  key={link.text}
                  component="button"
                  onClick={() => navigate(link.path)}
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'block',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    padding: 0,
                    '&:hover': {
                      color: '#667eea',
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  {link.text}
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Resources
            </Typography>
            <Stack spacing={1}>
              {resources.map((resource) => (
                <Box
                  key={resource.text}
                  component="button"
                  onClick={() => {}}
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'block',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    padding: 0,
                    '&:hover': {
                      color: '#667eea',
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  {resource.text}
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 20, color: '#667eea' }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  support@resqsphere.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 20, color: '#667eea' }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 20, color: '#667eea' }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  123 Emergency Street<br />
                  Safety City, SC 12345
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {currentYear} ResQSphere Pro. All rights reserved. | 
            <Box
              component="span"
              sx={{
                color: 'inherit',
                ml: 1,
                cursor: 'pointer',
                textDecoration: 'underline',
                '&:hover': { opacity: 0.8 },
              }}
              onClick={() => {}}
            >
              Privacy Policy
            </Box>
            {' | '}
            <Box
              component="span"
              sx={{
                color: 'inherit',
                cursor: 'pointer',
                textDecoration: 'underline',
                '&:hover': { opacity: 0.8 },
              }}
              onClick={() => {}}
            >
              Terms of Service
            </Box>
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mt: 1 }}>
            Built with ❤️ for Disaster Management
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

