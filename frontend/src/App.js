import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import HomePage from './components/Home/HomePage';
import Actions from './components/Home/Actions';
import Help from './components/Home/Help';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import AdminDashboard from './components/Admin/Dashboard';
import UserManagement from './components/Admin/UserManagement';
import AdminAnalytics from './components/Admin/Analytics';
import IncidentManagement from './components/Admin/IncidentManagement';
import UserDashboard from './components/User/Dashboard';
import EditProfile from './components/User/EditProfile';
import ReportIncident from './components/User/ReportIncident';
import MyReports from './components/User/MyReports';
import LiveAlerts from './components/User/LiveAlerts';
import Maps from './components/Shared/Maps';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/help" element={<Help />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="incidents" element={<IncidentManagement />} />
            <Route path="maps" element={<Maps adminView={true} />} />
          </Route>

          {/* User Routes */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="profile" element={<EditProfile />} />
            <Route path="report" element={<ReportIncident />} />
            <Route path="reports" element={<MyReports />} />
            <Route path="alerts" element={<LiveAlerts />} />
            <Route path="maps" element={<Maps />} />
          </Route>

          {/* Responder Routes */}
          <Route
            path="/responder/*"
            element={
              <ProtectedRoute requiredRole={['admin', 'emergency_responder']}>
                <UserLayout responder={true} />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<UserDashboard responder={true} />} />
            <Route path="profile" element={<EditProfile responder={true} />} />
            <Route path="incidents" element={<IncidentManagement />} />
            <Route path="maps" element={<Maps />} />
          </Route>
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

