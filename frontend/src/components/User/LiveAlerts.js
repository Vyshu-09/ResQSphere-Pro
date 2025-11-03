import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert as MuiAlert
} from '@mui/material';
import { useSocket } from '../../context/SocketContext';

const LiveAlerts = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchNearbyIncidents();
    
    if (socket) {
      socket.on('new-incident', (incident) => {
        setIncidents(prev => [incident, ...prev]);
      });

      socket.on('incident-updated', (incident) => {
        setIncidents(prev =>
          prev.map(item =>
            item._id === incident._id ? incident : item
          )
        );
      });
    }

    return () => {
      if (socket) {
        socket.off('new-incident');
        socket.off('incident-updated');
      }
    };
  }, [socket]);

  const fetchNearbyIncidents = async () => {
    try {
      // Get user location (you can get this from geolocation API)
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'https://resqsphere-pro-backend.onrender.com/api'}/incidents?status=reported&limit=20`
      );
      setIncidents(response.data.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'default',
      medium: 'info',
      high: 'warning',
      critical: 'error'
    };
    return colors[priority] || 'default';
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
        Live Alerts
      </Typography>

      <MuiAlert severity="info" sx={{ mb: 2 }}>
        Real-time updates on nearby emergencies and incidents
      </MuiAlert>

      {incidents.length === 0 ? (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography color="textSecondary">
            No active incidents in your area.
          </Typography>
        </Paper>
      ) : (
        <List sx={{ mt: 2 }}>
          {incidents.map((incident) => (
            <Paper key={incident._id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">{incident.title}</Typography>
                      <Chip
                        label={incident.priority}
                        color={getPriorityColor(incident.priority)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        {incident.description}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Type: {incident.type} | 
                        Location: {incident.location?.address || 
                          `${incident.location?.latitude?.toFixed(2)}, ${incident.location?.longitude?.toFixed(2)}`} |
                        {new Date(incident.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default LiveAlerts;

