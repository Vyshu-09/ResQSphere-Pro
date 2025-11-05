# ResQSphere Pro - Multi-Tier Disaster Management System

A comprehensive full-stack disaster management platform with separate admin and user interfaces, role-based access control, real-time features, and comprehensive analytics.

## Features

### 🎯 Core Features
- **Multi-Role User System**: Admin, Emergency Responder, Civilian, and Viewer roles
- **Real-time Updates**: Socket.io integration for live incident updates
- **Interactive Maps**: OpenStreetMap (Leaflet) integration for visualizing incidents - No API key required!
- **Analytics Dashboard**: Comprehensive analytics for admins
- **Incident Management**: Full CRUD operations for incidents
- **User Management**: Admin panel for user administration
- **Secure Authentication**: JWT-based authentication with refresh tokens

### 👥 User Roles & Permissions

- **Admin**: Full system access, user management, analytics, system configuration
- **Emergency Responder**: Create/manage incidents, assign resources, coordinate teams
- **Civilian User**: Report incidents, view nearby alerts, receive notifications
- **Viewer**: Read-only access to public information

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB Atlas with Mongoose
- Socket.io for real-time features
- JWT authentication with bcryptjs
- Helmet and express-rate-limit for security

### Frontend
- React 18 with Context API
- **Vite** - Lightning-fast development server (replaced CRA)
- React Router DOM with protected routes
- Material-UI (MUI) with theme switching
- Leaflet with react-leaflet (OpenStreetMap) - Fast, free, no API key required
- Socket.io-client for real-time updates
- Recharts for analytics
- Formik with Yup validation

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy .env.example to .env or edit .env directly
# The MongoDB connection string is already configured
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Edit .env file with your API URL (Vite uses VITE_ prefix)
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Note**: No API key required! The application uses OpenStreetMap through Leaflet, which is completely free and doesn't require any API key or billing setup.

4. Start the development server:
```bash
npm start
# or
npm run dev
```

The frontend will run on `http://localhost:3000` with **Vite** - much faster than Create React App!

**Performance Benefits:**
- ⚡ Instant server start (instead of 30+ seconds)
- 🔥 Hot Module Replacement (HMR) in milliseconds
- 📦 Faster builds with optimized bundling
- 🚀 Better development experience

## Project Structure

```
ResQSphere-Pro/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Incident.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── incidents.js
│   │   └── analytics.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Admin/
    │   │   ├── User/
    │   │   ├── Auth/
    │   │   └── Shared/
    │   ├── contexts/
    │   │   ├── AuthContext.js
    │   │   └── SocketContext.js
    │   ├── layouts/
    │   │   ├── AdminLayout.js
    │   │   └── UserLayout.js
    │   └── App.js
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Incidents
- `POST /api/incidents` - Create incident
- `GET /api/incidents` - Get all incidents
- `GET /api/incidents/stats` - Get incident statistics
- `GET /api/incidents/:id` - Get incident by ID
- `PUT /api/incidents/:id` - Update incident
- `DELETE /api/incidents/:id` - Delete incident

### Analytics (Admin Only)
- `GET /api/analytics/dashboard` - Get comprehensive dashboard analytics

## Usage

### Creating Your First Admin Account

1. Start the backend server
2. Register a new user with role "admin" through the frontend registration page
3. Alternatively, you can create an admin user directly in MongoDB:

```javascript
// Use MongoDB Compass or MongoDB Shell
db.users.insertOne({
  username: "admin",
  email: "admin@resqsphere.com",
  password: "$2a$10$hashed_password_here", // Use bcrypt to hash your password
  role: "admin",
  verificationStatus: "verified",
  profile: {
    firstName: "Admin",
    lastName: "User"
  }
})
```

### Default User Flow

1. **Civilian User**:
   - Register or login
   - Report incidents
   - View personal reports
   - Receive live alerts
   - View incidents on map

2. **Emergency Responder**:
   - Login with responder credentials
   - View assigned incidents
   - Update incident status
   - Coordinate resources
   - View map of all incidents

3. **Admin**:
   - Full access to all features
   - User management
   - Analytics dashboard
   - Incident management
   - System configuration

## Real-time Features

The platform uses Socket.io for real-time updates:

- New incident notifications
- Incident status updates
- Live user activity tracking
- Real-time analytics updates

## Map Integration

The platform integrates with OpenStreetMap through Leaflet for interactive maps:

- Visualize all incidents with custom colored markers
- Real-time location tracking
- User location markers
- Incident details popup
- Fast performance with optimized rendering
- **No API key required** - Completely free to use!

**Benefits**: 
- No API key setup needed
- No billing or credits required
- Fast loading times
- Lightweight and optimized
- Open-source and reliable

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- API rate limiting
- Helmet.js for security headers
- Protected routes on frontend
- Input validation

## Contributing

This is a complete disaster management platform. Feel free to extend it with additional features:

- Mobile app integration
- Push notifications
- Advanced analytics
- Resource management
- Team coordination features
- Multi-language support

## License

This project is available for educational and commercial use.

## Support

For issues and questions, please check the code documentation or create an issue in the repository.

---

**Built with ❤️ for Disaster Management**

#
