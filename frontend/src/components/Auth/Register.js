import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Divider,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { PersonAdd, Security, Warning, Shield, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'civilian',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    registerData.profile = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone
    };

    const result = await register(registerData);

    if (result.success) {
      const userRole = formData.role;
      
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'emergency_responder') {
        navigate('/responder/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          padding: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: `
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `,
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': {
            transform: 'translate(0, 0) rotate(0deg)',
          },
          '33%': {
            transform: 'translate(30px, -30px) rotate(120deg)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) rotate(240deg)',
          },
        },
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              color: 'rgba(255,255,255,0.1)',
              fontSize: '60px',
              animation: `float${i} ${15 + i * 2}s ease-in-out infinite`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
              '@keyframes float0': {
                '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: 0.3 },
                '50%': { transform: 'translateY(-30px) rotate(180deg)', opacity: 0.1 },
              },
              '@keyframes float1': {
                '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: 0.2 },
                '50%': { transform: 'translateY(-40px) rotate(-180deg)', opacity: 0.1 },
              },
              '@keyframes float2': {
                '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: 0.25 },
                '50%': { transform: 'translateY(-35px) rotate(120deg)', opacity: 0.1 },
              },
              '@keyframes float3': {
                '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: 0.2 },
                '50%': { transform: 'translateY(-45px) rotate(-120deg)', opacity: 0.1 },
              },
              '@keyframes float4': {
                '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: 0.3 },
                '50%': { transform: 'translateY(-25px) rotate(90deg)', opacity: 0.1 },
              },
              '@keyframes float5': {
                '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: 0.25 },
                '50%': { transform: 'translateY(-50px) rotate(-90deg)', opacity: 0.1 },
              },
            }}
          >
            <Warning />
          </Box>
        ))}
      </Box>

      <Container component="main" maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box 
          className="fade-in"
          sx={{
            animation: 'slideUp 0.8s ease-out',
            '@keyframes slideUp': {
              from: {
                opacity: 0,
                transform: 'translateY(50px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Card
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: 4,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                  animation: 'pulse 3s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                    '50%': { opacity: 0.6, transform: 'scale(1.1)' },
                  },
                },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  animation: 'pulseIcon 2s ease-in-out infinite',
                  '@keyframes pulseIcon': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                  },
                }}
              >
                <Shield sx={{ fontSize: 64, mb: 2, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
              </Box>
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                gutterBottom
                sx={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                  letterSpacing: '2px',
                }}
              >
                ResQSphere Pro
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  opacity: 0.95,
                  fontSize: '1.1rem',
                  fontWeight: 500,
                }}
              >
                Create Your Account
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box 
                display="flex" 
                alignItems="center" 
                gap={1} 
                mb={3}
                sx={{
                  animation: 'fadeIn 1s ease-out',
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateX(-20px)' },
                    to: { opacity: 1, transform: 'translateX(0)' },
                  },
                }}
              >
                <PersonAdd color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h5" fontWeight="600">
                  Sign Up
                </Typography>
              </Box>
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    animation: 'shake 0.5s ease-in-out',
                    '@keyframes shake': {
                      '0%, 100%': { transform: 'translateX(0)' },
                      '25%': { transform: 'translateX(-10px)' },
                      '75%': { transform: 'translateX(10px)' },
                    },
                  }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="phone"
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        id="role"
                        name="role"
                        value={formData.role}
                        label="Role"
                        onChange={handleChange}
                      >
                        <MenuItem value="civilian">Civilian</MenuItem>
                        <MenuItem value="emergency_responder">Emergency Responder</MenuItem>
                        <MenuItem value="viewer">Viewer</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    py: 1.8,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      transition: 'left 0.5s',
                    },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #653a8f 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 24px rgba(102, 126, 234, 0.5)',
                      '&::before': {
                        left: '100%',
                      },
                    },
                  }}
                  disabled={loading}
                  startIcon={<Security />}
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
                
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="textSecondary" fontWeight={500}>
                    OR
                  </Typography>
                </Divider>

                <Box textAlign="center">
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Typography 
                      variant="body1" 
                      color="primary"
                      sx={{
                        fontWeight: 600,
                        transition: 'all 0.3s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': {
                          transform: 'translateX(-5px)',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      <ArrowBack fontSize="small" />
                      Already have an account? Sign In
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
