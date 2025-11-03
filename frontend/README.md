# ResQSphere Pro Frontend

React-based frontend application for ResQSphere Pro Disaster Management Platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
# For development with local backend
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Or use production backend (default if env vars not set)
# VITE_API_URL=https://resqsphere-pro-backend.onrender.com/api
# VITE_SOCKET_URL=https://resqsphere-pro-backend.onrender.com

# No API key needed - Uses OpenStreetMap (free)
```

**Note**: Vite uses `VITE_` prefix instead of `REACT_APP_` for environment variables.

**Production**: If no `.env` file is present, the app will use the production backend by default.

3. Start the development server:
```bash
npm start
# or
npm run dev
```

**Powered by Vite** - Lightning-fast development server! 🚀

The application will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Admin/
│   │   ├── Dashboard.js
│   │   ├── UserManagement.js
│   │   ├── Analytics.js
│   │   └── IncidentManagement.js
│   ├── User/
│   │   ├── Dashboard.js
│   │   ├── ReportIncident.js
│   │   ├── MyReports.js
│   │   └── LiveAlerts.js
│   ├── Auth/
│   │   ├── Login.js
│   │   └── Register.js
│   └── Shared/
│       └── Maps.js
├── contexts/
│   ├── AuthContext.js
│   └── SocketContext.js
├── layouts/
│   ├── AdminLayout.js
│   └── UserLayout.js
└── App.js
```

## Features

### Admin Panel
- Dashboard with statistics
- User Management (CRUD operations)
- Analytics Dashboard (charts and metrics)
- Incident Management
- Interactive Maps

### User Panel
- Dashboard
- Report Incident
- My Reports
- Live Alerts
- Maps

### Emergency Responder Panel
- Incident Queue
- Live Coordination
- Maps
- Resource Management

## Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Admin Routes (requires admin role)
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/analytics` - Analytics dashboard
- `/admin/incidents` - Incident management
- `/admin/maps` - Admin map view

### User Routes (requires authentication)
- `/user/dashboard` - User dashboard
- `/user/report` - Report incident
- `/user/reports` - My reports
- `/user/alerts` - Live alerts
- `/user/maps` - User map view

### Responder Routes (requires responder role)
- `/responder/dashboard` - Responder dashboard
- `/responder/incidents` - Incident management
- `/responder/maps` - Responder map view

## Components

### Auth Components
- `Login` - User login form
- `Register` - User registration form

### Admin Components
- `Dashboard` - Overview with statistics
- `UserManagement` - User CRUD operations
- `Analytics` - Charts and analytics
- `IncidentManagement` - Incident management table

### User Components
- `Dashboard` - User dashboard with quick stats
- `ReportIncident` - Incident reporting form
- `MyReports` - List of user's reported incidents
- `LiveAlerts` - Real-time incident alerts

### Shared Components
- `Maps` - Interactive OpenStreetMap component (optimized for performance)
- `ProtectedRoute` - Route protection wrapper

## Contexts

### AuthContext
Manages authentication state, login, logout, and user data.

### SocketContext
Manages Socket.io connection and real-time updates.

## Libraries Used

- **React Router DOM** - Routing
- **Material-UI** - UI components
- **react-leaflet & leaflet** - OpenStreetMap integration (free, no API key required)
- **Socket.io Client** - Real-time updates
- **Recharts** - Charts and analytics
- **Formik & Yup** - Form handling and validation
- **Axios** - HTTP client

## Map Integration (OpenStreetMap)

The application uses Leaflet with OpenStreetMap for interactive maps. 

**No setup required!** The map works out of the box with:
- ✅ No API key needed
- ✅ No billing or account required
- ✅ Fast and lightweight
- ✅ Optimized rendering with React.memo
- ✅ Custom colored markers for different priorities
- ✅ Real-time location tracking

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

