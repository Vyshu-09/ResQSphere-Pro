# ResQSphere Pro Backend

Backend API server for ResQSphere Pro Disaster Management Platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

All endpoints require authentication except `/api/auth/register` and `/api/auth/login`.

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user (Protected)

### User Management (Admin Only)

- `GET /api/users` - Get all users (with pagination, search, filters)
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Incident Management

- `POST /api/incidents` - Create incident (Protected)
- `GET /api/incidents` - Get all incidents (with filters)
- `GET /api/incidents/stats` - Get incident statistics
- `GET /api/incidents/:id` - Get incident by ID
- `PUT /api/incidents/:id` - Update incident
- `DELETE /api/incidents/:id` - Delete incident

### Analytics (Admin Only)

- `GET /api/analytics/dashboard` - Get comprehensive analytics

## Models

### User Model
- username, email, password (hashed)
- role (admin, emergency_responder, civilian, viewer)
- profile (firstName, lastName, phone, address)
- location, verificationStatus
- preferences (notifications, language, theme)

### Incident Model
- title, description, type, status, priority
- location (latitude, longitude, address)
- reportedBy, assignedTeam
- liveUpdates, severity
- media, affectedPeople, requiredResources

## Real-time Features

Socket.io is integrated for real-time updates:
- `new-incident` - Emitted when a new incident is created
- `incident-updated` - Emitted when an incident is updated
- `incident-deleted` - Emitted when an incident is deleted

Clients can join rooms:
- `admin` - Admin users receive all updates
- Room based on user ID for personalized updates

