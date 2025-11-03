const express = require('express');
const Incident = require('../models/Incident');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/incidents
// @desc    Create new incident
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const incidentData = {
      ...req.body,
      reportedBy: req.user.id
    };

    const incident = await Incident.create(incidentData);

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('new-incident', incident);

    res.status(201).json({
      success: true,
      data: incident
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/incidents
// @desc    Get all incidents
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, type, priority, page = 1, limit = 20, lat, lng, radius = 10000 } = req.query;
    const query = {};

    // Admin and responders can see all incidents
    if (req.user.role === 'civilian' || req.user.role === 'viewer') {
      query.$or = [
        { reportedBy: req.user.id },
        { status: { $in: ['reported', 'in_progress'] } }
      ];
    }

    if (status) query.status = status;
    if (type) query.type = type;
    if (priority) query.priority = priority;

    // Location-based filtering
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius)
        }
      };
    }

    const incidents = await Incident.find(query)
      .populate('reportedBy', 'username email profile')
      .populate('assignedTeam', 'username email profile')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Incident.countDocuments(query);

    res.json({
      success: true,
      data: incidents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/incidents/stats
// @desc    Get incident statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const stats = {
      total: await Incident.countDocuments(),
      byStatus: {},
      byType: {},
      byPriority: {},
      bySeverity: {}
    };

    // Status stats
    const statusStats = await Incident.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    statusStats.forEach(item => {
      stats.byStatus[item._id] = item.count;
    });

    // Type stats
    const typeStats = await Incident.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    typeStats.forEach(item => {
      stats.byType[item._id] = item.count;
    });

    // Priority stats
    const priorityStats = await Incident.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    priorityStats.forEach(item => {
      stats.byPriority[item._id] = item.count;
    });

    // Severity stats
    const severityStats = await Incident.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    severityStats.forEach(item => {
      stats.bySeverity[item._id] = item.count;
    });

    // Resolved count
    stats.resolved = await Incident.countDocuments({ status: 'resolved' });
    
    // Today's incidents
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    stats.today = await Incident.countDocuments({ createdAt: { $gte: today } });

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/incidents/:id
// @desc    Get incident by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'username email profile')
      .populate('assignedTeam', 'username email profile')
      .populate('liveUpdates.updatedBy', 'username email');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Check authorization
    if ((req.user.role === 'civilian' || req.user.role === 'viewer') && 
        incident.reportedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: incident
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/incidents/:id
// @desc    Update incident
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Check authorization
    const canEdit = 
      req.user.role === 'admin' ||
      req.user.role === 'emergency_responder' ||
      (req.user.role === 'civilian' && incident.reportedBy.toString() === req.user.id && incident.status === 'reported');

    if (!canEdit) {
      return res.status(403).json({ message: 'Not authorized to update this incident' });
    }

    const updateData = req.body;

    // Add update to liveUpdates if status or other important fields change
    if (updateData.status || updateData.assignedTeam) {
      updateData.$push = {
        liveUpdates: {
          update: updateData.status ? `Status changed to ${updateData.status}` : 'Team assigned',
          updatedBy: req.user.id,
          timestamp: new Date()
        }
      };
    }

    if (updateData.status === 'resolved') {
      updateData.resolvedAt = new Date();
    }

    incident = await Incident.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('reportedBy', 'username email profile')
     .populate('assignedTeam', 'username email profile');

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('incident-updated', incident);

    res.json({
      success: true,
      data: incident
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/incidents/:id
// @desc    Delete incident
// @access  Private/Admin or Reporter
router.delete('/:id', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && incident.reportedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Incident.findByIdAndDelete(req.params.id);

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('incident-deleted', { id: req.params.id });

    res.json({
      success: true,
      message: 'Incident deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

