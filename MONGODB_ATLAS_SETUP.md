# MongoDB Atlas Setup & Troubleshooting Guide

## Common MongoDB Atlas Connection Issues

### Issue: "Could not connect to any servers in your MongoDB Atlas cluster"

This error typically occurs due to one of these reasons:

#### 1. IP Whitelist Problem

**Most Common Issue**: Your current IP address is not whitelisted in MongoDB Atlas.

**Solution**:
1. Log in to your MongoDB Atlas account: https://cloud.mongodb.com
2. Navigate to your cluster → **Network Access**
3. Click **"Add IP Address"**
4. Choose one of these options:
   - **"Add Current IP Address"** (recommended for development)
   - **"Allow Access from Anywhere"** (use `0.0.0.0/0` - less secure, but good for testing)

**Important**: If your IP changes (different network, VPN, etc.), you'll need to update the whitelist.

#### 2. Wrong Credentials

**Solution**:
1. Go to MongoDB Atlas → **Database Access**
2. Verify your database user credentials
3. Update the `.env` file with correct username and password

The connection string format is:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/database?retryWrites=true&w=majority
```

#### 3. Cluster Not Running

**Solution**:
1. Check your MongoDB Atlas dashboard
2. Ensure the cluster status shows "Running" (not Paused)
3. If paused, click "Resume" to start the cluster

#### 4. Network/Firewall Issues

**Solution**:
1. Check your internet connection
2. Disable VPN temporarily (if using one)
3. Try from a different network
4. Check if your firewall is blocking MongoDB connections

## Fixed Issues in This Project

### ✅ Removed Deprecated MongoDB Driver Options

**Before**:
```javascript
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
```

**After**:
```javascript
mongoose.connect(process.env.MONGODB_URI)
```

**Why**: These options were deprecated in MongoDB Driver v4.0.0 and are now the default behavior.

### ✅ Fixed Live Updates Service Startup

**Problem**: Live Updates Service was trying to query MongoDB before the connection was established, causing repeated timeout errors.

**Solution**: Live Updates Service now starts **only after** MongoDB successfully connects.

**Before**:
```javascript
// Live Updates started immediately, even if MongoDB failed
const liveUpdates = new LiveUpdatesService(io);
liveUpdates.start();
```

**After**:
```javascript
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB Connected');
  // Only start live updates after successful connection
  const LiveUpdatesService = require('./services/liveUpdates');
  const liveUpdates = new LiveUpdatesService(io);
  liveUpdates.start();
})
```

### ✅ Better Error Messages

Added helpful troubleshooting tips in the error output:
```
❌ MongoDB Connection Error: [error details]
🔍 Troubleshooting Tips:
1. Check if your MongoDB Atlas cluster is running
2. Verify your IP is whitelisted in MongoDB Atlas
3. Check if your MongoDB credentials are correct
4. Ensure your internet connection is working
```

## Testing the Connection

1. **Restart your backend server**:
   ```bash
   cd ResQSphere-Pro/ResQSphere-Pro/backend
   npm run dev
   ```

2. **Look for**:
   ```
   ✅ MongoDB Connected
   🔄 Live Updates Service Started
   🚀 Server running on port 5000
   ```

3. **No more timeout errors**! If you see connection errors, follow the troubleshooting steps above.

## Quick Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Your IP address is whitelisted in Network Access
- [ ] Database user credentials are correct
- [ ] `.env` file has the correct `MONGODB_URI`
- [ ] Internet connection is working
- [ ] No firewall blocking MongoDB connections
- [ ] Backend server restarted after fixes

## Getting Help

If you still have issues after following this guide:
1. Check MongoDB Atlas Status: https://status.cloud.mongodb.com
2. Review MongoDB Atlas documentation: https://docs.atlas.mongodb.com
3. Check server logs for specific error messages

