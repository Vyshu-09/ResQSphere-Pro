import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import {
  Edit,
  Save,
  Person,
  Email,
  Phone,
  LocationOn,
  ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const EditProfile = ({ responder = false }) => {
  const navigate = useNavigate();
  const { user, updateUser, fetchUser } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phone: Yup.string().matches(/^[0-9+\-()]+$/, 'Invalid phone number'),
    email: Yup.string().email('Invalid email address'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      phone: user?.profile?.phone || '',
      email: user?.email || '',
      address: user?.profile?.address || '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        setSuccess('');

        const updateData = {
          profile: {
            firstName: values.firstName,
            lastName: values.lastName,
            phone: values.phone,
            address: values.address,
          },
        };

        const result = await updateUser(user?.id || user?._id, updateData);

        if (result.success) {
          setSuccess('Profile updated successfully!');
          // Refresh user data in context
          await fetchUser();
          setTimeout(() => {
            navigate(responder ? '/responder/dashboard' : '/user/dashboard');
          }, 1500);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate(responder ? '/responder/dashboard' : '/user/dashboard')}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" fontWeight="bold">
          Edit Profile
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={4}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                }}
              >
                {user?.profile?.firstName?.charAt(0)?.toUpperCase() || user?.username?.charAt(0).toUpperCase()}
                {user?.profile?.lastName?.charAt(0)?.toUpperCase() || ''}
              </Avatar>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                {user?.profile?.firstName} {user?.profile?.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                @{user?.username}
              </Typography>
              <Chip
                label={user?.role?.replace('_', ' ').toUpperCase()}
                color="primary"
                sx={{ mt: 2 }}
              />
              <Divider sx={{ my: 3 }} />
              <Box sx={{ textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Email sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2">{user?.email}</Typography>
                </Box>
                {user?.profile?.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Phone sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2">{user?.profile?.phone}</Typography>
                  </Box>
                )}
                {user?.profile?.address && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2">{user?.profile?.address}</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Edit Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={4} sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
              Personal Information
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}

            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    value={formik.values.email}
                    disabled
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    helperText="Email cannot be changed"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    label="Phone Number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="address"
                    name="address"
                    label="Address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    InputProps={{
                      startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(responder ? '/responder/dashboard' : '/user/dashboard')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={<Save />}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditProfile;

