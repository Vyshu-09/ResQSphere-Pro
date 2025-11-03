import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Add,
  History,
  Notifications,
  Map,
  Person,
  TrendingUp,
  LocalFireDepartment,
  MedicalServices,
  Security,
  WaterDrop,
  Warning
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const COLORS = ['#667eea', '#764ba2', '#f56565', '#ed8936', '#48bb78', '#4299e1'];

const UserDashboard = ({ responder = false }) => {
  const [myIncidents, setMyIncidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    fetchData();
    
    // Set up real-time updates
    if (socket) {
      socket.on('incidentUpdate', (data) => {
        console.log('Real-time update received:', data);
        fetchData(); // Refresh data on real-time update
        setLastUpdate(new Date());
      });

      socket.on('newIncident', (data) => {
        console.log('New incident received:', data);
        fetchData();
        setLastUpdate(new Date());
      });

      return () => {
        socket.off('incidentUpdate');
        socket.off('newIncident');
      };
    }
  }, [socket]);

  // Auto-refresh every 15 seconds for live updates (reduced frequency to avoid rate limits)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
      setLastUpdate(new Date());
    }, 15000); // Increased to 15 seconds to avoid rate limits

    return () => clearInterval(interval);
  }, []);

  // Listen for stats updates from server
  useEffect(() => {
    if (socket) {
      const handleStatsUpdate = (data) => {
        // Update stats immediately when received
        setStats(prevStats => ({
          ...(prevStats || {}),
          total: data.total,
          resolved: data.resolved,
          today: data.today,
          inProgress: data.inProgress,
          reported: data.reported
        }));
        setLastUpdate(new Date());
        
        // Also refresh full data to update charts
        setTimeout(() => fetchData(), 1000);
      };

      socket.on('statsUpdate', handleStatsUpdate);
      socket.on('newIncident', () => {
        // Refresh when new incident is created
        setTimeout(() => fetchData(), 500);
      });
      socket.on('incidentUpdate', () => {
        // Refresh when incident is updated
        setTimeout(() => fetchData(), 500);
      });

      return () => {
        socket.off('statsUpdate', handleStatsUpdate);
        socket.off('newIncident');
        socket.off('incidentUpdate');
      };
    }
  }, [socket]);

  const fetchData = async () => {
    try {
      const [incidentsRes, statsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/incidents?page=1&limit=${responder ? 100 : 10}`),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/incidents/stats`)
      ]);

      const allIncidents = incidentsRes.data.data || [];
      const myReports = allIncidents.filter(
        incident => incident.reportedBy?._id?.toString() === user?.id?.toString() || 
        incident.reportedBy?.id?.toString() === user?.id?.toString() ||
        incident.reportedBy?._id?.toString() === user?._id?.toString() ||
        incident.reportedBy?.id?.toString() === user?._id?.toString()
      );
      
      // Responders see all incidents, civilians see only their reports
      setMyIncidents(responder ? allIncidents : myReports);
      setStats(statsRes.data.stats);

      // Prepare chart data
      prepareChartData(allIncidents);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (incidents) => {
    // Incident trends over time (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const trendData = last7Days.map(date => {
      const count = incidents.filter(inc => {
        const incDate = new Date(inc.createdAt).toISOString().split('T')[0];
        return incDate === date;
      }).length;
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        incidents: count
      };
    });

    // Incidents by type
    const typeCounts = {};
    incidents.forEach(inc => {
      typeCounts[inc.type] = (typeCounts[inc.type] || 0) + 1;
    });
    const typeData = Object.entries(typeCounts).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count
    }));

    // Severity distribution
    const severityCounts = {};
    incidents.forEach(inc => {
      severityCounts[inc.severity] = (severityCounts[inc.severity] || 0) + 1;
    });
    const severityData = Object.entries(severityCounts).map(([severity, count]) => ({
      name: severity.charAt(0).toUpperCase() + severity.slice(1),
      value: count
    }));

    // Priority ratings
    const priorityData = [
      { name: 'Critical', value: incidents.filter(i => i.priority === 'critical').length },
      { name: 'High', value: incidents.filter(i => i.priority === 'high').length },
      { name: 'Medium', value: incidents.filter(i => i.priority === 'medium').length },
      { name: 'Low', value: incidents.filter(i => i.priority === 'low').length }
    ];

    // Status distribution
    const statusData = [
      { name: 'Resolved', value: incidents.filter(i => i.status === 'resolved').length, color: '#48bb78' },
      { name: 'In Progress', value: incidents.filter(i => i.status === 'in_progress').length, color: '#ed8936' },
      { name: 'Reported', value: incidents.filter(i => i.status === 'reported').length, color: '#f56565' },
      { name: 'Cancelled', value: incidents.filter(i => i.status === 'cancelled').length, color: '#a0aec0' }
    ];

    // Response time ratings (mock data based on incident age)
    const responseRatings = incidents
      .filter(i => i.status === 'resolved' && i.resolvedAt)
      .map(inc => {
        const resolved = new Date(inc.resolvedAt);
        const created = new Date(inc.createdAt);
        const hours = (resolved - created) / (1000 * 60 * 60);
        return Math.round(hours);
      })
      .filter(hours => hours >= 0 && hours <= 48);

    const avgResponseTime = responseRatings.length > 0
      ? Math.round(responseRatings.reduce((a, b) => a + b, 0) / responseRatings.length)
      : 0;

    setChartData({
      trendData,
      typeData,
      severityData,
      priorityData,
      statusData,
      avgResponseTime,
      totalAffected: incidents.reduce((sum, inc) => sum + (inc.affectedPeople?.confirmed || 0), 0)
    });
  };

  const getIncidentIcon = (type) => {
    const icons = {
      fire: <LocalFireDepartment sx={{ fontSize: 20, color: '#f56565' }} />,
      medical: <MedicalServices sx={{ fontSize: 20, color: '#ed8936' }} />,
      security: <Security sx={{ fontSize: 20, color: '#667eea' }} />,
      weather: <WaterDrop sx={{ fontSize: 20, color: '#4299e1' }} />,
      default: <Warning sx={{ fontSize: 20, color: '#ed8936' }} />
    };
    return icons[type] || icons.default;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      extreme: '#f56565',
      severe: '#ed8936',
      moderate: '#ecc94b',
      minor: '#48bb78'
    };
    return colors[severity] || '#a0aec0';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {responder ? 'Emergency Responder Dashboard' : 'User Dashboard'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            Last updated: {lastUpdate.toLocaleTimeString()} • Live updates enabled
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Person />}
          onClick={() => navigate(responder ? '/responder/profile' : '/user/profile')}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #653a8f 100%)',
              border: 'none',
            },
          }}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Live Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {!responder && (
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Typography color="inherit" gutterBottom variant="body2">
                  My Reports
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {myIncidents.length}
                </Typography>
                <Button
                  size="small"
                  startIcon={<History />}
                  onClick={() => navigate('/user/reports')}
                  sx={{ mt: 1, color: 'white', borderColor: 'white' }}
                  variant="outlined"
                >
                  View All
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={responder ? 4 : 3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Incidents
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.total || 0}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={responder ? 4 : 3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Resolved
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {stats?.resolved || 0}
                  </Typography>
                  {stats?.total > 0 && (
                    <LinearProgress
                      variant="determinate"
                      value={(stats?.resolved / stats?.total) * 100}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      color="success"
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={responder ? 4 : 3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Active Today
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {stats?.today || 0}
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Live Graphs and Visualizations */}
      {chartData && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Incident Trends - Live Line Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" fontWeight="bold">
                    📈 Incident Trends (Last 7 Days)
                  </Typography>
                  <Chip 
                    label="LIVE" 
                    size="small" 
                    color="error"
                    sx={{ 
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                        '100%': { opacity: 1 }
                      }
                    }}
                  />
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                  Updates every 15 seconds
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData.trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="incidents" 
                      stroke="#667eea" 
                      strokeWidth={3}
                      name="Incidents"
                      dot={{ fill: '#667eea', r: 5 }}
                      activeDot={{ r: 7 }}
                      animationDuration={500}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Incident Types - Pie Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  🎯 Incidents by Type
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData.typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Priority Ratings - Live Updating Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" fontWeight="bold">
                    ⚡ Priority Ratings
                  </Typography>
                  <Chip 
                    label="LIVE" 
                    size="small" 
                    color="error"
                    sx={{ 
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                        '100%': { opacity: 1 }
                      }
                    }}
                  />
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                  Updates every 15 seconds
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData.priorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#667eea" 
                      radius={[8, 8, 0, 0]}
                      animationDuration={500}
                      isAnimationActive={true}
                    >
                      {chartData.priorityData.map((entry, index) => {
                        const colors = ['#f56565', '#ed8936', '#ecc94b', '#48bb78'];
                        return <Cell key={`cell-${index}`} fill={colors[index] || '#667eea'} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Status Distribution - Live Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" fontWeight="bold">
                    📊 Status Distribution
                  </Typography>
                  <Chip 
                    label="LIVE" 
                    size="small" 
                    color="error"
                    sx={{ 
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                        '100%': { opacity: 1 }
                      }
                    }}
                  />
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                  Updates every 15 seconds
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData.statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[8, 8, 0, 0]}
                      animationDuration={500}
                      isAnimationActive={true}
                    >
                      {chartData.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Response Metrics Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  ⚡ Average Response Time
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ my: 2 }}>
                  {chartData.avgResponseTime}h
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Based on resolved incidents
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Affected People - Live Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" fontWeight="bold">
                    👥 Affected People by Severity
                  </Typography>
                  <Chip 
                    label="LIVE" 
                    size="small" 
                    color="error"
                    sx={{ 
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                        '100%': { opacity: 1 }
                      }
                    }}
                  />
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                  Updates every 10 seconds • Total: {chartData.totalAffected.toLocaleString()}
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData.severityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#ed8936" 
                      radius={[8, 8, 0, 0]}
                      animationDuration={500}
                      isAnimationActive={true}
                    >
                      {chartData.severityData.map((entry, index) => {
                        const colors = ['#f56565', '#ed8936', '#ecc94b', '#48bb78'];
                        return <Cell key={`cell-${index}`} fill={colors[index] || '#ed8936'} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Quick Actions for Civilians */}
      {!responder && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' }, transition: 'transform 0.2s' }} onClick={() => navigate('/user/report')}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <Add sx={{ fontSize: 48, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">Report New Incident</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Report an emergency or incident
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' }, transition: 'transform 0.2s' }} onClick={() => navigate('/user/alerts')}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ p: 2, borderRadius: 2, background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)' }}>
                    <Notifications sx={{ fontSize: 48, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">Live Alerts</Typography>
                    <Typography variant="body2" color="textSecondary">
                      View nearby emergency alerts
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Recent Incidents */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            {responder ? 'Active Incidents' : 'Recent Incidents'}
          </Typography>
          {responder && (
            <Button
              variant="outlined"
              onClick={() => navigate('/responder/incidents')}
            >
              View All
            </Button>
          )}
        </Box>
        {myIncidents.length === 0 ? (
          <Typography color="textSecondary" textAlign="center" sx={{ py: 4 }}>
            No incidents reported yet
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {myIncidents.slice(0, 6).map((incident) => (
              <Grid item xs={12} key={incident._id}>
                <Card sx={{ '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.2s' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          {getIncidentIcon(incident.type)}
                          <Typography variant="h6" fontWeight="bold">
                            {incident.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5 }}>
                          {incident.description}
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Chip 
                            label={incident.status.replace('_', ' ').toUpperCase()} 
                            size="small"
                            color={incident.status === 'resolved' ? 'success' : incident.status === 'in_progress' ? 'warning' : 'default'}
                          />
                          <Chip 
                            label={incident.priority.toUpperCase()} 
                            size="small"
                            color={incident.priority === 'critical' ? 'error' : incident.priority === 'high' ? 'warning' : 'default'}
                          />
                          <Chip 
                            label={`Severity: ${incident.severity}`}
                            size="small"
                            sx={{ 
                              backgroundColor: getSeverityColor(incident.severity),
                              color: 'white'
                            }}
                          />
                          {incident.affectedPeople?.confirmed > 0 && (
                            <Chip 
                              label={`${incident.affectedPeople.confirmed} affected`}
                              size="small"
                              color="info"
                            />
                          )}
                        </Box>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="caption" color="textSecondary">
                          {new Date(incident.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          {new Date(incident.createdAt).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default UserDashboard;
