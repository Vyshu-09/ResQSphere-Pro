# Quick Fix for 401 Unauthorized Error

## Problem
You're getting `401 Unauthorized` when trying to login. This means:
- ✅ Backend is running (otherwise it would be connection refused)
- ❌ Users don't exist in the database yet

## Solution: Create Default Users

### Step 1: Open a NEW Terminal

Keep your backend server running, open a NEW terminal window.

### Step 2: Navigate to Backend and Run Seed Script

```bash
cd C:\Users\vemul\Desktop\ResQSphere-Pro\backend
npm run seed
```

You should see:
```
✅ Connected to MongoDB
✅ Default users created successfully:
   Emergency Responder: responder@resqsphere.com
   Civilian: civilian@resqsphere.com
   Password for both: password123
```

### Step 3: Login with Default Credentials

**Emergency Responder:**
- Email: `responder@resqsphere.com`
- Password: `password123`

**Civilian User:**
- Email: `civilian@resqsphere.com`
- Password: `password123`

## Optional: Create Sample Incidents

To populate dashboards with sample data:

```bash
cd C:\Users\vemul\Desktop\ResQSphere-Pro\backend
npm run seed:incidents
```

This creates sample incidents for both users so their dashboards have data.

## Verification

After running `npm run seed`:
1. Go to login page
2. Use the credentials above
3. Login should work now!

## If Still Getting 401

1. **Check Backend Logs**: Look at your backend terminal - are there any errors?
2. **Verify MongoDB Connection**: Check if backend is connected to MongoDB
3. **Check Email/Password**: Make sure you're using the exact credentials:
   - Email: `responder@resqsphere.com` (NOT `responder@resqsphere.co` or similar)
   - Password: `password123` (case-sensitive)

## Create Admin User

If you want to create an admin user, you can:
1. Register a new user with role "admin" (modify Register component)
2. Or create directly in MongoDB using MongoDB Compass or shell

