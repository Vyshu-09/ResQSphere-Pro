const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
app.use(express.json());

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://resqsphere-pro-frontend.onrender.com"
];

// Socket.IO setup with CORS
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());

// Express CORS with origin validation
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - More lenient for live updates
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to auth routes only
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});

// Apply rate limiting
app.use('/api/auth', authLimiter);
app.use('/api/', limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    // Initialize Live Updates Service only after successful connection
    const LiveUpdatesService = require('./services/liveUpdates');
    const liveUpdates = new LiveUpdatesService(io);
    liveUpdates.start();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    console.error('\n🔍 Troubleshooting Tips:');
    console.error('1. Check if your MongoDB Atlas cluster is running');
    console.error('2. Verify your IP is whitelisted in MongoDB Atlas');
    console.error('3. Check if your MongoDB credentials are correct');
    console.error('4. Ensure your internet connection is working');
  });

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on('leave-room', (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ResQSphere API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
