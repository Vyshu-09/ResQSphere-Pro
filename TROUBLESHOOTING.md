# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: 401 Unauthorized Error on Login

**Problem**: Getting `401 Unauthorized` when trying to login

**Solution Steps**:

1. **Check if Backend is Running**:
   ```bash
   cd C:\Users\vemul\Desktop\ResQSphere-Pro\backend
   npm run dev
   ```
   You should see: `🚀 Server running on port 5000`

2. **Create Default Users**:
   ```bash
   cd C:\Users\vemul\Desktop\ResQSphere-Pro\backend
   npm run seed
   ```
   This creates:
   - Emergency Responder: `responder@resqsphere.com` / `password123`
   - Civilian User: `civilian@resqsphere.com` / `password123`

3. **Test Login**:
   - Use the credentials above
   - Make sure backend is running before attempting login

### Issue 2: Page Not Loading

**Problem**: Blank white page or errors

**Solution**:
1. Clear browser cache: `Ctrl + Shift + Delete`
2. Hard refresh: `Ctrl + Shift + R`
3. Check browser console for errors
4. Restart frontend server:
   ```bash
   cd C:\Users\vemul\Desktop\ResQSphere-Pro\frontend
   npm start
   ```

### Issue 3: MongoDB Connection Error

**Problem**: Backend can't connect to MongoDB

**Solution**:
1. Check MongoDB connection string in `.env` file
2. Verify internet connection
3. Check if MongoDB Atlas IP whitelist includes your IP
4. Verify credentials in connection string

### Issue 4: Frontend Not Connecting to Backend

**Problem**: Frontend shows connection refused

**Solution**:
1. For local development: ensure backend is running on port 5000
2. Check `.env` file has correct API URL:
   ```
   # For local development
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   
   # Or use production backend
   VITE_API_URL=https://resqsphere-pro-backend.onrender.com/api
   VITE_SOCKET_URL=https://resqsphere-pro-backend.onrender.com
   ```
3. If no `.env` file, the app uses the production backend by default
4. Restart frontend after changing `.env`

## Quick Setup Checklist

- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Frontend dependencies installed (`npm install` in frontend folder)
- [ ] Backend server running (`npm run dev`)
- [ ] Default users created (`npm run seed`)
- [ ] Frontend server running (`npm start`)
- [ ] Browser cache cleared

## Default User Credentials

### Emergency Responder
- **Email**: responder@resqsphere.com
- **Password**: password123
- **Role**: emergency_responder

### Civilian User
- **Email**: civilian@resqsphere.com
- **Password**: password123
- **Role**: civilian

## Testing Steps

1. Start backend: `cd backend && npm run dev`
2. Create users: `npm run seed`
3. Start frontend: `cd frontend && npm start`
4. Open browser: `http://localhost:3000`
5. Click "Login" in header
6. Login with default credentials above

