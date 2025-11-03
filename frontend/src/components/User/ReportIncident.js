import React, { useState } from 'react';
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
  MenuItem,
  Grid,
  Alert
} from '@mui/material';
import { useSocket } from '../../context/SocketContext';

const ReportIncident = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Type is required'),
    priority: Yup.string().required('Priority is required'),
    severity: Yup.string().required('Severity is required'),
    latitude: Yup.number().required('Latitude is required'),
    longitude: Yup.number().required('Longitude is required')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      type: '',
      priority: 'medium',
      severity: 'moderate',
      latitude: '',
      longitude: '',
      address: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');

        const incidentData = {
          ...values,
          location: {
            latitude: parseFloat(values.latitude),
            longitude: parseFloat(values.longitude),
            address: values.address || ''
          }
        };

        delete incidentData.latitude;
        delete incidentData.longitude;
        delete incidentData.address;

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/incidents`,
          incidentData
        );

        // Emit socket event
        if (socket) {
          socket.emit('new-incident', response.data.data);
        }

        navigate('/user/reports');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to report incident');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Report Incident
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                id="type"
                name="type"
                label="Type"
                value={formik.values.type}
                onChange={formik.handleChange}
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
              >
                <MenuItem value="fire">Fire</MenuItem>
                <MenuItem value="flood">Flood</MenuItem>
                <MenuItem value="earthquake">Earthquake</MenuItem>
                <MenuItem value="medical">Medical</MenuItem>
                <MenuItem value="security">Security</MenuItem>
                <MenuItem value="weather">Weather</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                id="priority"
                name="priority"
                label="Priority"
                value={formik.values.priority}
                onChange={formik.handleChange}
                error={formik.touched.priority && Boolean(formik.errors.priority)}
                helperText={formik.touched.priority && formik.errors.priority}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                id="severity"
                name="severity"
                label="Severity"
                value={formik.values.severity}
                onChange={formik.handleChange}
                error={formik.touched.severity && Boolean(formik.errors.severity)}
                helperText={formik.touched.severity && formik.errors.severity}
              >
                <MenuItem value="minor">Minor</MenuItem>
                <MenuItem value="moderate">Moderate</MenuItem>
                <MenuItem value="severe">Severe</MenuItem>
                <MenuItem value="extreme">Extreme</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Address (Optional)"
                value={formik.values.address}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="latitude"
                name="latitude"
                label="Latitude"
                type="number"
                value={formik.values.latitude}
                onChange={formik.handleChange}
                error={formik.touched.latitude && Boolean(formik.errors.latitude)}
                helperText={formik.touched.latitude && formik.errors.latitude}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="longitude"
                name="longitude"
                label="Longitude"
                type="number"
                value={formik.values.longitude}
                onChange={formik.handleChange}
                error={formik.touched.longitude && Boolean(formik.errors.longitude)}
                helperText={formik.touched.longitude && formik.errors.longitude}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ReportIncident;

