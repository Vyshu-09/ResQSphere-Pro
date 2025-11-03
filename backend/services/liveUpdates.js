const Incident = require('../models/Incident');
const User = require('../models/User');

class LiveUpdatesService {
  constructor(io) {
    this.io = io;
    this.updateInterval = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔄 Live Updates Service Started');
    
    // Update every 15 seconds (reduced frequency to avoid rate limits)
    this.updateInterval = setInterval(async () => {
      await this.updateIncidents();
    }, 15000);

    // Also run immediately
    this.updateIncidents();
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.isRunning = false;
    console.log('⏹️  Live Updates Service Stopped');
  }

  async updateIncidents() {
    try {
      // Get random incidents to update
      const activeIncidents = await Incident.find({
        status: { $in: ['reported', 'in_progress'] }
      }).limit(5);

      for (const incident of activeIncidents) {
        // Randomly update status, add live updates, change affected people counts
        const randomAction = Math.random();

        if (randomAction < 0.3) {
          // 30% chance: Add a live update
          const updates = [
            'Emergency services arrived on scene',
            'Search and rescue operations in progress',
            'Evacuation proceeding smoothly',
            'Medical teams treating patients',
            'Fire contained. Extinguishing remaining hotspots',
            'Traffic control measures implemented',
            'Additional resources requested',
            'Situation stabilizing',
            'All clear signal given',
            'Road reopened to traffic'
          ];
          
          const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
          
          incident.liveUpdates.push({
            update: randomUpdate,
            updatedBy: incident.assignedTeam || incident.reportedBy,
            timestamp: new Date()
          });

          // Emit live update
          this.io.emit('incidentUpdate', {
            incidentId: incident._id,
            update: randomUpdate,
            timestamp: new Date()
          });
        } else if (randomAction < 0.5) {
          // 20% chance: Update affected people count
          const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          if (incident.affectedPeople) {
            const newConfirmed = Math.max(0, (incident.affectedPeople.confirmed || 0) + change);
            incident.affectedPeople.confirmed = newConfirmed;
            
            this.io.emit('incidentUpdate', {
              incidentId: incident._id,
              affectedPeople: newConfirmed,
              timestamp: new Date()
            });
          }
        } else if (randomAction < 0.7 && incident.status === 'reported') {
          // 20% chance: Change status from reported to in_progress
          incident.status = 'in_progress';
          
          this.io.emit('incidentUpdate', {
            incidentId: incident._id,
            status: 'in_progress',
            timestamp: new Date()
          });
        } else if (randomAction < 0.85 && incident.status === 'in_progress') {
          // 15% chance: Resolve incident
          incident.status = 'resolved';
          incident.resolvedAt = new Date();
          
          this.io.emit('incidentUpdate', {
            incidentId: incident._id,
            status: 'resolved',
            timestamp: new Date()
          });
        }

        await incident.save();
      }

      // 10% chance: Create a new incident
      if (Math.random() < 0.1) {
        await this.createRandomIncident();
      }

      // Broadcast stats update
      const stats = await this.getStats();
      this.io.emit('statsUpdate', stats);

    } catch (error) {
      console.error('Error in live updates:', error);
    }
  }

  async createRandomIncident() {
    try {
      const users = await User.find({ role: { $in: ['civilian', 'emergency_responder'] } });
      if (users.length === 0) return;

      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      const incidentTemplates = [
        {
          title: 'Traffic Accident - Highway 101',
          description: 'Multi-vehicle collision reported. Traffic backing up.',
          type: 'medical',
          priority: 'high',
          severity: 'severe',
          location: {
            latitude: 37.7849 + (Math.random() - 0.5) * 0.1,
            longitude: -122.4094 + (Math.random() - 0.5) * 0.1,
            address: 'Highway 101, San Francisco, CA'
          }
        },
        {
          title: 'Medical Emergency - Public Area',
          description: 'Individual requires immediate medical attention.',
          type: 'medical',
          priority: 'critical',
          severity: 'severe',
          location: {
            latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
            longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
            address: 'Downtown San Francisco, CA'
          }
        },
        {
          title: 'Fire Alarm - Building',
          description: 'Smoke detected. Fire department dispatched.',
          type: 'fire',
          priority: 'high',
          severity: 'moderate',
          location: {
            latitude: 37.7949 + (Math.random() - 0.5) * 0.1,
            longitude: -122.3994 + (Math.random() - 0.5) * 0.1,
            address: 'Commercial District, San Francisco, CA'
          }
        },
        {
          title: 'Weather Alert - Flash Flood Warning',
          description: 'Heavy rainfall causing flooding concerns.',
          type: 'weather',
          priority: 'medium',
          severity: 'moderate',
          location: {
            latitude: 37.7649 + (Math.random() - 0.5) * 0.1,
            longitude: -122.4294 + (Math.random() - 0.5) * 0.1,
            address: 'Mission District, San Francisco, CA'
          }
        },
        {
          title: 'Security Incident - Suspicious Activity',
          description: 'Unusual activity reported. Security team notified.',
          type: 'security',
          priority: 'medium',
          severity: 'moderate',
          location: {
            latitude: 37.8044 + (Math.random() - 0.5) * 0.1,
            longitude: -122.4162 + (Math.random() - 0.5) * 0.1,
            address: 'Financial District, San Francisco, CA'
          }
        }
      ];

      const template = incidentTemplates[Math.floor(Math.random() * incidentTemplates.length)];
      
      const newIncident = await Incident.create({
        ...template,
        reportedBy: randomUser._id,
        status: 'reported',
        affectedPeople: {
          estimated: Math.floor(Math.random() * 5) + 1,
          confirmed: 0
        },
        liveUpdates: [{
          update: 'Incident reported. Emergency services dispatched',
          updatedBy: randomUser._id,
          timestamp: new Date()
        }]
      });

      this.io.emit('newIncident', {
        incident: newIncident,
        timestamp: new Date()
      });

      console.log(`✅ Auto-created incident: ${newIncident.title}`);
    } catch (error) {
      console.error('Error creating random incident:', error);
    }
  }

  async getStats() {
    try {
      const total = await Incident.countDocuments();
      const resolved = await Incident.countDocuments({ status: 'resolved' });
      const inProgress = await Incident.countDocuments({ status: 'in_progress' });
      const reported = await Incident.countDocuments({ status: 'reported' });
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = await Incident.countDocuments({ createdAt: { $gte: today } });

      return {
        total,
        resolved,
        inProgress,
        reported,
        today: todayCount,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {};
    }
  }
}

module.exports = LiveUpdatesService;

