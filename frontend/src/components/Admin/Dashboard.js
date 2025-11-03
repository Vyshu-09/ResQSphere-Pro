import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  People,
  Warning,
  TrendingUp,
  CheckCircle,
  LocalFireDepartment,
  MedicalServices,
  Security,
  WaterDrop
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
import { useSocket } from '../../context/SocketContext';

const COLORS = ['#667eea', '#764ba2', '#f56565', '#ed8936', '#48bb78', '#4299e1'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const socket = useSocket();

  useEffect(() => {
    fetchStats();

    // Set up real-time updates
    if (socket) {
      socket.on('incidentUpdate', (data) => {
        console.log('Real-time update received:', data);
        fetchStats();
        setLastUpdate(new Date());
      });

      socket.on('newIncident', (data) => {
        console.log('New incident received:', data);
        fetchStats();
        setLastUpdate(new Date());
      });

      return () => {
        socket.off('incidentUpdate');
        socket.off('newIncident');
      };
    }
  }, [socket]);

  // Auto-refresh every 10 seconds for live updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
      setLastUpdate(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, incidentsRes, analyticsRes, incidentsListRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/stats`),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/incidents/stats`),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/dashboard`),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/incidents?page=1&limit=100`)
      ]);

      const allIncidents = incidentsListRes.data.data || [];
      
      setStats({
        users: usersRes.data.stats,
        incidents: incidentsRes.data.stats,
        analytics: analyticsRes.data.analytics
      });

      // Prepare chart data
      prepareChartData(allIncidents);
    } catch (error) {
      console.error('Error fetching stats:', error);
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

    // Response time ratings
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
      totalAffected: incidents.reduce((sum, inc) => sum + (inc.affectedPeople?.confirmed || 0), 0),
      resolutionRate: incidents.length > 0 
        ? Math.round((incidents.filter(i => i.status === 'resolved').length / incidents.length) * 100)
        : 0
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ title, value, icon, color, subtitle, progress }) => (
    <Card sx={{ height: '100%', background: color ? `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` : 'white', color: color ? 'white' : 'inherit' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box flex={1}>
            <Typography color={color ? 'inherit' : 'textSecondary'} gutterBottom variant="body2" fontWeight="bold">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {subtitle}
              </Typography>
            )}
            {progress !== undefined && (
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
                color={color ? 'inherit' : 'primary'}
              />
            )}
          </Box>
          <Box sx={{ fontSize: 48, opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Last updated: {lastUpdate.toLocaleTimeString()} • Live updates enabled
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.users?.totalUsers || 0}
            icon={<People />}
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Today"
            value={stats?.users?.activeToday || 0}
            icon={<TrendingUp />}
            color="#48bb78"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Incidents"
            value={stats?.incidents?.total || 0}
            icon={<Warning />}
            color="#f56565"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resolved"
            value={stats?.incidents?.resolved || 0}
            icon={<CheckCircle />}
            color="#48bb78"
            progress={stats?.incidents?.total > 0 
              ? (stats?.incidents?.resolved / stats?.incidents?.total) * 100 
              : 0}
          />
        </Grid>
      </Grid>

      {/* Live Graphs and Visualizations */}
      {chartData && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Incident Trends - Line Chart */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  📈 Incident Trends (Last 7 Days) - Live
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
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
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Resolution Rate & Response Time */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card sx={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      ✅ Resolution Rate
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ my: 2 }}>
                      {chartData.resolutionRate}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={chartData.resolutionRate}
                      sx={{ mt: 2, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      ⚡ Avg Response Time
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
            </Grid>
          </Grid>

          {/* Incident Types - Pie Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  🎯 Incidents by Type
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Status Distribution - Pie Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  📊 Status Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Priority Ratings - Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  ⚡ Priority Ratings
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.priorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#667eea" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Severity Distribution - Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  🔴 Severity Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.severityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#f56565" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Metrics */}
          <Grid item xs={12} md={4}>
            <Card sx={{ background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  👥 Total Affected
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ my: 2 }}>
                  {chartData.totalAffected.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Confirmed affected people
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: 'linear-gradient(135deg, #764ba2 0%, #653a8f 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  🚨 Critical Priority
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ my: 2 }}>
                  {chartData.priorityData.find(p => p.name === 'Critical')?.value || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Requiring immediate attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  📅 Today's Incidents
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ my: 2 }}>
                  {stats?.incidents?.today || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Reported today
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Quick Statistics */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Quick Statistics
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary">
              <strong>New Users Today:</strong> {stats?.users?.newUsersToday || 0}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Active Users Today:</strong> {stats?.users?.activeToday || 0}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary">
              <strong>Incidents Today:</strong> {stats?.incidents?.today || 0}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>In Progress:</strong> {stats?.incidents?.inProgress || 0}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="textSecondary">
              <strong>Resolution Rate:</strong> {chartData?.resolutionRate || 0}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Avg Response Time:</strong> {chartData?.avgResponseTime || 0} hours
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
