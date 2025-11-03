import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  Chip,
  Stack
} from '@mui/material';
import {
  Shield,
  Warning,
  People,
  Analytics,
  Map,
  NotificationsActive,
  Security,
  Speed,
  VerifiedUser,
  LocalHospital,
  SupportAgent
} from '@mui/icons-material';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Warning sx={{ fontSize: 48 }} />,
      title: 'Real-time Incident Reporting',
      description: 'Report emergencies instantly with GPS location tracking and multimedia support',
      color: '#f44336'
    },
    {
      icon: <Map sx={{ fontSize: 48 }} />,
      title: 'Live Interactive Maps',
      description: 'View all incidents on interactive maps with real-time updates',
      color: '#2196f3'
    },
    {
      icon: <NotificationsActive sx={{ fontSize: 48 }} />,
      title: 'Instant Alerts',
      description: 'Receive immediate notifications about nearby emergencies',
      color: '#ff9800'
    },
    {
      icon: <Analytics sx={{ fontSize: 48 }} />,
      title: 'Comprehensive Analytics',
      description: 'Track incidents, response times, and system performance',
      color: '#9c27b0'
    },
    {
      icon: <People sx={{ fontSize: 48 }} />,
      title: 'Multi-Role System',
      description: 'Admin, Emergency Responder, Civilian, and Viewer roles',
      color: '#4caf50'
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: 'Secure Platform',
      description: 'Enterprise-grade security with role-based access control',
      color: '#607d8b'
    }
  ];

  const benefits = [
    {
      title: 'For Administrators',
      items: [
        'Complete user management',
        'Real-time analytics dashboard',
        'Incident coordination and assignment',
        'System configuration'
      ],
      icon: <VerifiedUser sx={{ fontSize: 40 }} />,
      color: '#667eea'
    },
    {
      title: 'For Emergency Responders',
      items: [
        'Receive and manage incident assignments',
        'Live coordination with teams',
        'Resource management',
        'Field status updates'
      ],
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      color: '#f44336'
    },
    {
      title: 'For Civilians',
      items: [
        'Quick incident reporting',
        'View nearby alerts',
        'Track your reports',
        'Access safety resources'
      ],
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#4caf50'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f7fa' }}>
      <Header />
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 10,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: `
                radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
              `,
              animation: 'float 20s ease-in-out infinite',
            },
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
                animation: 'fadeInUp 1s ease-out',
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(30px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Shield sx={{ fontSize: 80, mb: 3, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
              <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                ResQSphere Pro
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.95 }}>
                Advanced Disaster Management Platform
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, maxWidth: '800px', mx: 'auto', opacity: 0.9 }}>
                A comprehensive solution for managing emergencies, coordinating responses, 
                and ensuring public safety through real-time communication and advanced analytics.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  background: 'white',
                  color: '#667eea',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 6 }}>
            Key Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ color: feature.color, mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Benefits Section */}
        <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 6 }}>
              Who Can Benefit?
            </Typography>
            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    elevation={4}
                    sx={{
                      p: 4,
                      height: '100%',
                      borderRadius: 3,
                      background: 'white',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 32px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Box sx={{ color: benefit.color, mb: 2, textAlign: 'center' }}>
                      {benefit.icon}
                    </Box>
                    <Typography variant="h5" fontWeight="600" textAlign="center" gutterBottom>
                      {benefit.title}
                    </Typography>
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      {benefit.items.map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label="✓"
                            size="small"
                            sx={{
                              background: benefit.color,
                              color: 'white',
                              fontWeight: 'bold',
                              minWidth: 28,
                              height: 28,
                            }}
                          />
                          <Typography variant="body2">{item}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 8,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md">
            <Shield sx={{ fontSize: 64, mb: 3 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join ResQSphere Pro and be part of the next-generation disaster management system
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  background: 'white',
                  color: '#667eea',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.9)',
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Sign Up
              </Button>
            </Stack>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default HomePage;

