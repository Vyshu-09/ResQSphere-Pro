// API Config Helper - Ensures correct URL format
const getApiUrl = () => {
  let apiUrl = import.meta.env.VITE_API_URL || 'https://resqsphere-pro-backend.onrender.com/api';
  
  // Remove trailing slash
  apiUrl = apiUrl.replace(/\/$/, '');
  
  // Ensure it ends with /api
  if (!apiUrl.endsWith('/api')) {
    // If it's just the base URL, add /api
    if (!apiUrl.includes('/api')) {
      apiUrl = apiUrl + '/api';
    }
  }
  
  return apiUrl;
};

const getSocketUrl = () => {
  let socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://resqsphere-pro-backend.onrender.com';
  // Remove trailing slash
  return socketUrl.replace(/\/$/, '');
};

export { getApiUrl, getSocketUrl };

