import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const MyReports = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyIncidents();
  }, []);

  const fetchMyIncidents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/incidents`);
      const myReports = response.data.data.filter(
        incident => incident.reportedBy?._id?.toString() === user?.id?.toString() || 
        incident.reportedBy?.id?.toString() === user?.id?.toString() ||
        incident.reportedBy?._id?.toString() === user?._id?.toString() ||
        incident.reportedBy?.id?.toString() === user?._id?.toString()
      );
      setIncidents(myReports);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      reported: 'info',
      in_progress: 'warning',
      resolved: 'success',
      cancelled: 'default'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Reports
      </Typography>

      {incidents.length === 0 ? (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography color="textSecondary">
            You haven't reported any incidents yet.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident._id}>
                  <TableCell>{incident.title}</TableCell>
                  <TableCell>{incident.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={incident.status}
                      color={getStatusColor(incident.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{incident.priority}</TableCell>
                  <TableCell>
                    {incident.location?.address || 
                      `${incident.location?.latitude?.toFixed(2)}, ${incident.location?.longitude?.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    {new Date(incident.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MyReports;

