# Quick Start Guide - ResQSphere Pro

## Prerequisites

- Node.js (v16 or higher) installed
- npm or yarn package manager
- MongoDB Atlas connection (already configured)

## Step 1: Install Backend Dependencies

Open a terminal and navigate to the backend folder:

```bash
cd C:\Users\vemul\Desktop\ResQSphere-Pro\backend
npm install
```

## Step 2: Install Frontend Dependencies

Open another terminal and navigate to the frontend folder:

```bash
cd C:\Users\vemul\Desktop\ResQSphere-Pro\frontend
npm install
```

## Step 3: Configure Environment Variables

### Backend (.env file)
The backend `.env` file is already configured with your MongoDB Atlas connection string.

### Frontend (.env file)
The frontend `.env` file is already configured. **No API key needed!**

The application uses OpenStreetMap through Leaflet, which is:
- ✅ Completely free
- ✅ No API key required
- ✅ No billing or account setup needed
- ✅ Fast and optimized

The `.env` file should contain:
```
# For local development
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Or for production (default if no .env)
# VITE_API_URL=https://resqsphere-pro-backend.onrender.com/api
# VITE_SOCKET_URL=https://resqsphere-pro-backend.onrender.com
```

**Note**: We're using Vite (instead of Create React App) for much faster development. Environment variables use `VITE_` prefix.

**Production**: If no `.env` file exists, the app uses the production backend URL by default.

## Step 4: Start Backend Server

In the backend terminal:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Step 5: Start Frontend Server

In the frontend terminal:

```bash
npm start
```

The frontend will automatically open at `http://localhost:3000`

## Step 6: Create Your First Admin Account

1. Go to the registration page: `http://localhost:3000/register`
2. Fill in the registration form
3. Select "Admin" as the role
4. Click "Sign Up"

**Note**: For production, you should create the first admin user directly in MongoDB or through a separate script.

## Testing the Application

### As Admin:
- Login with admin credentials
- Access: User Management, Analytics, Incident Management
- View comprehensive dashboard with statistics

### As Civilian:
- Register a new account with "Civilian" role
- Report incidents
- View your reports
- See live alerts
- View incidents on map

### As Emergency Responder:
- Register with "Emergency Responder" role
- View assigned incidents
- Update incident status
- Coordinate resources

## Troubleshooting

### Backend Issues:
- Make sure MongoDB connection string is correct in `.env`
- Check if port 5000 is available
- Look for errors in the terminal

### Frontend Issues:
- Make sure backend is running first
- Check if port 3000 is available
- Maps work automatically - no API key needed (uses OpenStreetMap)
- Clear browser cache if needed

### MongoDB Connection:
- Verify your MongoDB Atlas connection string
- Make sure your IP is whitelisted in MongoDB Atlas
- Check network connectivity

## Features to Test

1. **User Registration & Login**
   - Register different user roles
   - Login with credentials
   - Test protected routes

2. **Incident Reporting**
   - Report an incident as a civilian
   - Add location coordinates
   - Set priority and severity

3. **Admin Panel**
   - View user statistics
   - Manage users
   - View analytics charts
   - Manage incidents

4. **Real-time Features**
   - Report an incident and see it appear in real-time
   - Update incident status and see updates

5. **Maps**
   - View incidents on the map
   - Click on markers to see details
   - Your location should appear on the map

## Next Steps

- Customize the application for your needs
- Add more features as required
- Deploy to production (Heroku, AWS, etc.)
- Configure production environment variables
- Set up proper error handling and logging

## Support

For issues or questions, refer to the main README.md file or check the code documentation.

---

**Happy Coding! 🚀**

