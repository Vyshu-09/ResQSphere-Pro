# ResQSphere Pro - Setup Guide

## Complete Setup Instructions

### Step 1: Install Backend Dependencies

```bash
cd C:\Users\vemul\Desktop\ResQSphere-Pro\backend
npm install
```

### Step 2: Create Default Users

Run the seed script to create default Emergency Responder and Civilian users:

```bash
cd C:\Users\vemul\Desktop\ResQSphere-Pro\backend
npm run seed
```

This will create:
- **Emergency Responder**: 
  - Email: `responder@resqsphere.com`
  - Password: `password123`
  - Username: `emergency_responder`

- **Civilian User**:
  - Email: `civilian@resqsphere.com`
  - Password: `password123`
  - Username: `civilian_user`

### Step 3: Create Default Incidents (Optional)

To populate dashboards with sample incidents:

```bash
npm run seed:incidents
```

This creates sample incidents for both users so their dashboards have data.

### Step 4: Start Backend Server

```bash
cd C:\Users\vemul\Desktop\ResQSphere-Pro\backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 5: Install Frontend Dependencies

```bash
cd C:\Users\vemul\Desktop\ResQSphere-Pro\frontend
npm install
```

### Step 6: Start Frontend Server

```bash
cd C:\Users\vemul\Desktop\ResQSphere-Pro\frontend
npm start
```

Frontend will run on `http://localhost:3000`

## Default Users Credentials

### Emergency Responder
- **Email**: responder@resqsphere.com
- **Password**: password123
- **Features**: Can manage incidents, view all incidents, update status, coordinate responses

### Civilian User
- **Email**: civilian@resqsphere.com
- **Password**: password123
- **Features**: Can report incidents, view own reports, see alerts, view maps

## Testing the Application

1. **Home Page**: Visit `http://localhost:3000` - See the beautiful home page with Header and Footer
2. **Actions**: Click "Actions" in header to see available actions
3. **Help**: Click "Help" in header for FAQ and support
4. **Login**: Click "Login" button to access the system

### Login as Emergency Responder:
- Email: `responder@resqsphere.com`
- Password: `password123`
- You'll see a fully populated responder dashboard

### Login as Civilian:
- Email: `civilian@resqsphere.com`
- Password: `password123`
- You'll see a fully populated civilian dashboard

### Create Admin User:
1. Go to `/register`
2. Fill in the form
3. Select "Admin" as role (you may need to modify this in Register component to allow admin registration)
4. Or create admin directly in MongoDB

## Admin Can See All Users

Once logged in as admin:
- Go to `/admin/users` to see all users including:
  - Emergency Responder user
  - Civilian user
  - Any new registered users

## Features Added

✅ **Home Page** - Beautiful landing page with project details
✅ **Header** - Unique gradient header with Home, Actions, Help, Login navigation
✅ **Footer** - Comprehensive footer with links, contact info, social media
✅ **Actions Page** - Available actions and features
✅ **Help Page** - FAQ, resources, and support information
✅ **Edit Profile** - Full profile editing for all user types
✅ **Default Users** - Pre-created Emergency Responder and Civilian with full profiles
✅ **Default Incidents** - Sample incidents for populated dashboards

## Navigation Flow

1. **Home** (`/`) → Beautiful landing page
2. **Actions** (`/actions`) → Available actions
3. **Help** (`/help`) → FAQ and support
4. **Login** (`/login`) → Login page
5. **Register** (`/register`) → Registration page

After login, users are redirected based on their role:
- Admin → `/admin/dashboard`
- Emergency Responder → `/responder/dashboard`
- Civilian → `/user/dashboard`

## All Users Have Edit Profile

Both Emergency Responder and Civilian users can:
- Edit their profile from the dashboard
- Update personal information
- Change contact details
- Access profile from menu or dashboard button

Enjoy your ResQSphere Pro platform! 🚀

