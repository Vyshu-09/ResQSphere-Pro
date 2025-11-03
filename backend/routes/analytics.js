const express = require('express');
const User = require('../models/User');
const Incident = require('../models/Incident');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get comprehensive dashboard analytics
// @access  Private/Admin
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // User Analytics
    const totalUsers = await User.countDocuments();
    const usersToday = await User.countDocuments({ createdAt: { $gte: today } });
    const activeToday = await User.countDocuments({ lastLogin: { $gte: today } });
    
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const registrationTrends = await User.aggregate([
      {
        $match: { createdAt: { $gte: monthAgo } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Incident Analytics
    const totalIncidents = await Incident.countDocuments();
    const incidentsToday = await Incident.countDocuments({ createdAt: { $gte: today } });
    const resolvedIncidents = await Incident.countDocuments({ status: 'resolved' });
    
    const incidentsByType = await Incident.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const incidentsByStatus = await Incident.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const incidentsBySeverity = await Incident.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    const incidentTrends = await Incident.aggregate([
      {
        $match: { createdAt: { $gte: monthAgo } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Response Metrics
    const resolvedIncidentsWithTime = await Incident.find({ 
      status: 'resolved',
      resolvedAt: { $exists: true }
    }).select('createdAt resolvedAt');

    let avgResponseTime = 0;
    if (resolvedIncidentsWithTime.length > 0) {
      const totalTime = resolvedIncidentsWithTime.reduce((sum, incident) => {
        const timeDiff = incident.resolvedAt - incident.createdAt;
        return sum + timeDiff;
      }, 0);
      avgResponseTime = Math.round(totalTime / resolvedIncidentsWithTime.length / (1000 * 60 * 60)); // in hours
    }

    const resolutionRate = totalIncidents > 0 
      ? ((resolvedIncidents / totalIncidents) * 100).toFixed(2)
      : 0;

    // Users with most reported incidents
    const topReporters = await Incident.aggregate([
      {
        $group: {
          _id: '$reportedBy',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          email: '$user.email',
          count: 1
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        users: {
          total: totalUsers,
          today: usersToday,
          activeToday: activeToday,
          byRole: usersByRole.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          registrationTrends
        },
        incidents: {
          total: totalIncidents,
          today: incidentsToday,
          resolved: resolvedIncidents,
          byType: incidentsByType.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          byStatus: incidentsByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          bySeverity: incidentsBySeverity.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          trends: incidentTrends
        },
        metrics: {
          avgResponseTime,
          resolutionRate: parseFloat(resolutionRate)
        },
        topReporters
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

