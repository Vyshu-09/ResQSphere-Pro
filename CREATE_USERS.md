# Create Default Users - Step by Step

## The Problem
You're getting **401 Unauthorized** because no users exist in the database yet.

## Solution: Create Users Now

### Step 1: Make Sure Backend is Running

In one terminal, make sure backend is running:
```bash
cd C:\Users\vemul\Desktop\ResQSphere-Pro\backend
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### Step 2: Open a NEW Terminal (Keep Backend Running!)

Open a **NEW** terminal window (don't stop the backend!)

### Step 3: Check Current Users (Optional)

```bash
cd C:\Users\vemul\Desktop\ResQSphere-Pro\backend
npm run check:users
```

This shows if users already exist.

### Step 4: Create Default Users

```bash
cd C:\Users\vemul\Desktop\ResQSphere-Pro\backend
npm run seed
```

**Expected Output:**
```
✅ Connected to MongoDB
✅ Default users created successfully:
   Emergency Responder: responder@resqsphere.com
   Civilian: civilian@resqsphere.com
   Password for both: password123
```

### Step 5: Login with Default Credentials

**Option 1: Emergency Responder**
- Email: `responder@resqsphere.com`
- Password: `password123`

**Option 2: Civilian User**
- Email: `civilian@resqsphere.com`
- Password: `password123`

### Step 6: Create Sample Incidents (Optional)

To populate dashboards with sample data:
```bash
npm run seed:incidents
```

## Create Admin User (Optional)

If you want to create an admin user, you can register one:
1. Go to `/register`
2. Fill the form
3. Use any email/password
4. Admin role creation may need manual database update or code modification

Or create directly in MongoDB using MongoDB Compass.

## Quick Test

After running `npm run seed`, try logging in:
1. Go to `http://localhost:3000/login`
2. Use: `responder@resqsphere.com` / `password123`
3. Should work now! ✅

## Still Getting 401?

1. **Verify seed script ran successfully** - Check terminal output
2. **Check backend is running** - Should see "Server running on port 5000"
3. **Check MongoDB connection** - Backend should show "MongoDB Connected"
4. **Verify credentials** - Use exact email: `responder@resqsphere.com` (not `.co` or typo)
5. **Check password** - Must be exactly: `password123` (case-sensitive)

Run `npm run check:users` to verify users were created!

