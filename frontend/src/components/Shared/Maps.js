import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const defaultCenter = [37.7749, -122.4194];
const defaultZoom = 10;

// Component to handle map view updates
const MapViewUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

// Custom marker icon creator
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Memoized incident marker component for performance
const IncidentMarker = React.memo(({ incident, onMarkerClick }) => {
  const getIncidentColor = (priority) => {
    const colors = {
      critical: '#f44336',
      high: '#ff9800',
      medium: '#ffeb3b',
      low: '#4caf50'
    };
    return colors[priority] || '#2196f3';
  };

  if (!incident.location?.latitude || !incident.location?.longitude) {
    return null;
  }

  const position = [incident.location.latitude, incident.location.longitude];
  const icon = createCustomIcon(getIncidentColor(incident.priority));

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: () => onMarkerClick(incident),
      }}
    >
      <Popup>
        <Box sx={{ minWidth: 200 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {incident.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            {incident.description}
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
            Type: {incident.type} | Priority: {incident.priority}
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block">
            Status: {incident.status} | Severity: {incident.severity}
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block">
            {incident.location?.address || 
              `${incident.location?.latitude?.toFixed(4)}, ${incident.location?.longitude?.toFixed(4)}`}
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block">
            {new Date(incident.createdAt).toLocaleString()}
          </Typography>
        </Box>
      </Popup>
    </Marker>
  );
});

IncidentMarker.displayName = 'IncidentMarker';

const Maps = ({ adminView = false }) => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(defaultZoom);

  // Fetch incidents with optimization
  const fetchIncidents = useCallback(async () => {
    try {
      const params = adminView ? {} : { status: 'reported', limit: 100 };
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/incidents`,
        { params }
      );
      setIncidents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  }, [adminView]);

  useEffect(() => {
    // Get user's location (non-blocking)
    if (navigator.geolocation) {
      const geoOptions = {
        enableHighAccuracy: false, // Faster, less accurate
        timeout: 5000,
        maximumAge: 60000, // Cache for 1 minute
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = [latitude, longitude];
          setUserLocation(location);
          setMapCenter(location);
          setMapZoom(12);
        },
        (error) => {
          console.warn('Location not available:', error);
          // Continue with default center
        },
        geoOptions
      );
    }

    // Fetch incidents
    fetchIncidents();
  }, [fetchIncidents]);

  const handleMarkerClick = useCallback((incident) => {
    setSelectedIncident(incident);
  }, []);

  // Memoize filtered incidents for performance
  const validIncidents = useMemo(() => {
    return incidents.filter(
      incident => incident.location?.latitude && incident.location?.longitude
    );
  }, [incidents]);

  // User location marker icon
  const userIcon = useMemo(() => {
    return createCustomIcon('#4285F4');
  }, []);

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
        {adminView ? 'Admin Map View' : 'Incident Map'}
      </Typography>

      <Paper sx={{ mt: 2, overflow: 'hidden', height: '600px' }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          scrollWheelZoom={true}
          zoomControl={true}
          attributionControl={true}
        >
          <MapViewUpdater center={mapCenter} zoom={mapZoom} />
          
          {/* OpenStreetMap Tile Layer - Fast and free */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Location Marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={userIcon}
            >
              <Popup>
                <Typography variant="subtitle2">Your Location</Typography>
              </Popup>
            </Marker>
          )}

          {/* Incident Markers - Optimized with React.memo */}
          {validIncidents.map((incident) => (
            <IncidentMarker
              key={incident._id}
              incident={incident}
              onMarkerClick={handleMarkerClick}
            />
          ))}
        </MapContainer>
      </Paper>

      {/* Legend */}
      <Paper sx={{ mt: 2, p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Legend
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#4285F4',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            />
            <Typography variant="caption">Your Location</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#f44336',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            />
            <Typography variant="caption">Critical Priority</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#ff9800',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            />
            <Typography variant="caption">High Priority</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#ffeb3b',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            />
            <Typography variant="caption">Medium Priority</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#4caf50',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            />
            <Typography variant="caption">Low Priority</Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
          Total Incidents: {validIncidents.length}
        </Typography>
      </Paper>
    </Box>
  );
};

export default React.memo(Maps);
