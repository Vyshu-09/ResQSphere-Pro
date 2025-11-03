import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Chip,
  Stack
} from '@mui/material';
import {
  Report,
  Assignment,
  LocalHospital,
  People,
  Map,
  Analytics,
  Warning,
  Speed,
  VerifiedUser
} from '@mui/icons-material';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

const Actions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <Report sx={{ fontSize: 48 }} />,
      title: 'Report Incident',
      description: 'Quickly report emergencies with GPS location, photos, and detailed descriptions',
      color: '#f44336',
      action: 'Report Now'
    },
    {
      icon: <Map sx={{ fontSize: 48 }} />,
      title: 'View Live Map',
      description: 'See all active incidents in real-time on interactive maps',
      color: '#2196f3',
      action: 'View Map'
    },
    {
      icon: <LocalHospital sx={{ fontSize: 48 }} />,
      title: 'Emergency Response',
      description: 'Coordinate with responders and emergency services',
      color: '#ff9800',
      action: 'Learn More'
    },
    {
      icon: <People sx={{ fontSize: 48 }} />,
      title: 'Community Alerts',
      description: 'Receive and share alerts about nearby emergencies',
      color: '#4caf50',
      action: 'View Alerts'
    },
    {
      icon: <Analytics sx={{ fontSize: 48 }} />,
      title: 'Incident Analytics',
      description: 'Track trends and patterns in emergency responses',
      color: '#9c27b0',
      action: 'View Stats'
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 48 }} />,
      title: 'Safety Resources',
      description: 'Access emergency preparedness guides and resources',
      color: '#607d8b',
      action: 'Browse Resources'
    }
  ];

  const steps = [
    {
      step: 1,
      title: 'Report',
      description: 'Report an emergency incident with location and details'
    },
    {
      step: 2,
      title: 'Dispatch',
      description: 'System automatically dispatches nearest responders'
    },
    {
      step: 3,
      title: 'Respond',
      description: 'Emergency teams coordinate and respond to incidents'
    },
    {
      step: 4,
      title: 'Resolve',
      description: 'Track resolution and update status in real-time'
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
            py: 8,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Warning sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Take Action
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
              Explore available actions and features to manage emergencies effectively
            </Typography>
          </Container>
        </Box>

        {/* Actions Grid */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {actions.map((action, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                    <Box sx={{ color: action.color, mb: 2 }}>
                      {action.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {action.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}dd 100%)`,
                      }}
                    >
                      {action.action}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Process Flow */}
        <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 6 }}>
              How It Works
            </Typography>
            <Grid container spacing={4}>
              {steps.map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    elevation={4}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRadius: 3,
                      background: 'white',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 32px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Chip
                      label={step.step}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        mb: 2,
                      }}
                    />
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {step.description}
                    </Typography>
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
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Login to access all features and start managing emergencies
            </Typography>
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
              Login Now
            </Button>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Actions;

