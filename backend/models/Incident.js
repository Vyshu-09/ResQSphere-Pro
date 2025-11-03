const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['fire', 'flood', 'earthquake', 'medical', 'security', 'weather', 'other'],
    required: [true, 'Incident type is required']
  },
  status: {
    type: String,
    enum: ['reported', 'in_progress', 'resolved', 'cancelled'],
    default: 'reported'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, trim: true }
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  liveUpdates: [{
    update: { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }],
  severity: {
    type: String,
    enum: ['minor', 'moderate', 'severe', 'extreme'],
    default: 'moderate'
  },
  media: [{
    url: { type: String },
    type: { type: String, enum: ['image', 'video'] },
    uploadedAt: { type: Date, default: Date.now }
  }],
  affectedPeople: {
    estimated: { type: Number, default: 0 },
    confirmed: { type: Number, default: 0 }
  },
  requiredResources: [{
    resource: { type: String },
    quantity: { type: Number },
    status: { type: String, enum: ['requested', 'allocated', 'received'], default: 'requested' }
  }],
  resolvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for location-based queries (using latitude/longitude separately)
incidentSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

module.exports = mongoose.model('Incident', incidentSchema);

