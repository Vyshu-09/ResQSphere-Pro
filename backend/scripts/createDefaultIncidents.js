const mongoose = require('mongoose');
const Incident = require('../models/Incident');
const User = require('../models/User');
require('dotenv').config();

const createDefaultIncidents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the default users
    const responder = await User.findOne({ email: 'responder@resqsphere.com' });
    const civilian = await User.findOne({ email: 'civilian@resqsphere.com' });

    if (!responder || !civilian) {
      console.log('⚠️  Default users not found. Run seed script first: npm run seed');
      process.exit(1);
    }

    // Clear existing incidents
    await Incident.deleteMany({});

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Innovative default incidents with diverse scenarios
    const innovativeIncidents = [
      // Medical Emergencies
      {
        title: 'Multi-Vehicle Collision on Interstate 280',
        description: 'Massive 6-car pileup during rush hour. Multiple injuries reported. Traffic backed up 3 miles. Air ambulance dispatched for critical patient.',
        type: 'medical',
        status: 'in_progress',
        priority: 'critical',
        severity: 'extreme',
        location: { latitude: 37.7849, longitude: -122.4094, address: 'Interstate 280, Exit 12, San Francisco, CA' },
        reportedBy: civilian._id,
        assignedTeam: responder._id,
        liveUpdates: [
          { update: 'Incident reported. Emergency services en route', updatedBy: civilian._id, timestamp: new Date(now - 1800000) },
          { update: 'Fire department arrived. Extracting victims from vehicles', updatedBy: responder._id, timestamp: new Date(now - 1500000) },
          { update: '3 critical patients airlifted. Road closure extended', updatedBy: responder._id, timestamp: new Date(now - 600000) }
        ],
        affectedPeople: { estimated: 12, confirmed: 8 },
        requiredResources: [
          { resource: 'Ambulances', quantity: 4, status: 'allocated' },
          { resource: 'Fire Trucks', quantity: 2, status: 'allocated' },
          { resource: 'Air Ambulance', quantity: 1, status: 'received' }
        ],
        createdAt: new Date(now - 1800000)
      },
      {
        title: 'Cardiac Arrest at Golden Gate Park',
        description: 'Elderly individual collapsed during morning jog. CPR in progress. Defibrillator required urgently.',
        type: 'medical',
        status: 'in_progress',
        priority: 'critical',
        severity: 'extreme',
        location: { latitude: 37.7694, longitude: -122.4862, address: 'Golden Gate Park, Stow Lake, San Francisco, CA' },
        reportedBy: civilian._id,
        assignedTeam: responder._id,
        liveUpdates: [
          { update: 'Emergency reported. Bystander performing CPR', updatedBy: civilian._id, timestamp: new Date(now - 300000) },
          { update: 'Ambulance ETA 2 minutes. Paramedics preparing equipment', updatedBy: responder._id, timestamp: new Date(now - 180000) }
        ],
        affectedPeople: { estimated: 1, confirmed: 1 },
        createdAt: new Date(now - 300000)
      },

      // Fire Emergencies
      {
        title: 'Wildfire Spreading Near Residential Area',
        description: 'Fast-moving wildfire detected in foothills. Wind speed 25 mph. Evacuation orders issued for 500 homes. Fire crews from 3 counties responding.',
        type: 'fire',
        status: 'in_progress',
        priority: 'critical',
        severity: 'extreme',
        location: { latitude: 37.7949, longitude: -122.3994, address: 'Oakland Hills, Contra Costa County, CA' },
        reportedBy: responder._id,
        assignedTeam: responder._id,
        liveUpdates: [
          { update: 'Wildfire detected via satellite imagery', updatedBy: responder._id, timestamp: new Date(now - 3600000) },
          { update: 'Evacuation zones A-D activated. 200 homes evacuated', updatedBy: responder._id, timestamp: new Date(now - 2400000) },
          { update: 'Fire at 150 acres. Containment 5%. Air tankers deployed', updatedBy: responder._id, timestamp: new Date(now - 1200000) },
          { update: 'Firefighters making progress. Containment increased to 15%', updatedBy: responder._id, timestamp: new Date(now - 600000) }
        ],
        affectedPeople: { estimated: 1500, confirmed: 1200 },
        requiredResources: [
          { resource: 'Fire Engines', quantity: 12, status: 'allocated' },
          { resource: 'Helicopters', quantity: 4, status: 'received' },
          { resource: 'Firefighters', quantity: 80, status: 'allocated' }
        ],
        createdAt: new Date(now - 3600000)
      },
      {
        title: 'Chemical Fire at Industrial Warehouse',
        description: 'Hazardous material storage facility on fire. Toxic smoke detected. HAZMAT team required. Shelter-in-place order issued.',
        type: 'fire',
        status: 'in_progress',
        priority: 'critical',
        severity: 'extreme',
        location: { latitude: 37.7749, longitude: -122.4194, address: '850 Industrial Blvd, San Francisco, CA' },
        reportedBy: civilian._id,
        assignedTeam: responder._id,
        liveUpdates: [
          { update: 'Chemical fire reported. HAZMAT team dispatched', updatedBy: civilian._id, timestamp: new Date(now - 2400000) },
          { update: 'Evacuation radius extended to 2 miles', updatedBy: responder._id, timestamp: new Date(now - 2100000) },
          { update: 'Air quality monitoring in progress. No toxic leaks detected', updatedBy: responder._id, timestamp: new Date(now - 1800000) }
        ],
        affectedPeople: { estimated: 500, confirmed: 350 },
        requiredResources: [
          { resource: 'HAZMAT Team', quantity: 2, status: 'allocated' },
          { resource: 'Fire Trucks', quantity: 6, status: 'allocated' },
          { resource: 'Air Quality Monitors', quantity: 5, status: 'received' }
        ],
        createdAt: new Date(now - 2400000)
      },

      // Natural Disasters
      {
        title: 'Earthquake - Magnitude 4.7 Richter Scale',
        description: 'Moderate earthquake felt across Bay Area. Damage reports coming in. Several buildings with structural concerns. Aftershock warning issued.',
        type: 'earthquake',
        status: 'in_progress',
        priority: 'high',
        severity: 'severe',
        location: { latitude: 37.7849, longitude: -122.4094, address: 'Epicenter: Hayward Fault, Oakland, CA' },
        reportedBy: civilian._id,
        assignedTeam: responder._id,
        liveUpdates: [
          { update: 'Earthquake detected at 4.7 magnitude. Shaking lasted 12 seconds', updatedBy: civilian._id, timestamp: new Date(yesterday) },
          { update: '50+ damage reports received. Structural engineers deployed', updatedBy: responder._id, timestamp: new Date(yesterday.getTime() + 1800000) },
          { update: '3 buildings evacuated. No casualties reported', updatedBy: responder._id, timestamp: new Date(yesterday.getTime() + 3600000) }
        ],
        affectedPeople: { estimated: 5000, confirmed: 800 },
        requiredResources: [
          { resource: 'Structural Engineers', quantity: 8, status: 'allocated' },
          { resource: 'Search & Rescue', quantity: 4, status: 'received' },
          { resource: 'Emergency Shelters', quantity: 3, status: 'allocated' }
        ],
        createdAt: yesterday
      },
      {
        title: 'Flash Flood Warning - Storm Drain Overflow',
        description: 'Heavy rainfall causing flash flooding in low-lying areas. Multiple streets submerged. Rescue boats deployed. 2 feet water level rising.',
        type: 'weather',
        status: 'in_progress',
        priority: 'high',
        severity: 'severe',
        location: { latitude: 37.7649, longitude: -122.4294, address: 'Mission District, San Francisco, CA' },
        reportedBy: civilian._id,
        assignedTeam: responder._id,
        liveUpdates: [
          { update: 'Flash flood warning issued. Water rising rapidly', updatedBy: civilian._id, timestamp: new Date(now - 7200000) },
          { update: 'Rescue boats deployed. 15 people evacuated from vehicles', updatedBy: responder._id, timestamp: new Date(now - 5400000) },
          { update: 'Water level stabilizing. Drainage systems operational', updatedBy: responder._id, timestamp: new Date(now - 3600000) }
        ],
        affectedPeople: { estimated: 200, confirmed: 50 },
        requiredResources: [
          { resource: 'Rescue Boats', quantity: 3, status: 'received' },
          { resource: 'Pumps', quantity: 8, status: 'allocated' },
          { resource: 'Sandbags', quantity: 500, status: 'allocated' }
        ],
        createdAt: new Date(now - 7200000)
      },
      {
        title: 'Tsunami Warning - Coastal Evacuation',
        description: 'Tsunami alert issued after undersea earthquake. Coastal areas evacuated. Emergency shelters opened. Expected wave height 3-5 feet.',
        type: 'weather',
        status: 'in_progress',
        priority: 'critical',
        severity: 'extreme',
        location: { latitude: 37.8044, longitude: -122.4162, address: 'Pacific Coast, San Francisco Bay Area, CA' },
        reportedBy: responder._id,
        assignedTeam: responder._id,
        liveUpdates: [
          { update: 'Tsunami warning activated. Coastal evacuation ordered', updatedBy: responder._id, timestamp: new Date(lastWeek) },
          { update: '10,000+ residents evacuated. Emergency shelters at capacity', updatedBy: responder._id, timestamp: new Date(lastWeek.getTime() + 3600000) },
          { update: 'Tsunami passed. Minor flooding. Assessment in progress', updatedBy: responder._id, timestamp: new Date(lastWeek.getTime() + 7200000) }
        ],
        affectedPeople: { estimated: 15000, confirmed: 12000 },
        requiredResources: [
          { resource: 'Emergency Shelters', quantity: 15, status: 'received' },
          { resource: 'Evacuation Buses', quantity: 50, status: 'allocated' },
          { resource: 'Search Teams', quantity: 20, status: 'allocated' }
        ],
        createdAt: lastWeek
      },

      // Security Incidents
      {
        title: 'Active Shooter Situation - Shopping Mall',
        description: 'Multiple gunshots reported. Law enforcement responding. Mall on lockdown. SWAT team en route. Multiple victims reported.',
        type: 'security',
        status: 'in_progress',
        priority: 'critical',
        severity: 'extreme',
        location: { latitude: 37.7749, longitude: -122.4194, address: 'Westfield Shopping Center, San Francisco, CA' },
        reportedBy: civilian._id,
        assignedTeam: responder._id,
        liveUpdates: [
          { update: 'Active shooter reported. SWAT and police responding', updatedBy: civilian._id, timestamp: new Date(now - 1800000) },
          { update: 'Mall locked down. Evacuation of upper floors in progress', updatedBy: responder._id, timestamp: new Date(now - 1500000) },
          { update: 'Suspect contained. Medical teams treating victims', updatedBy: responder._id, timestamp: new Date(now - 1200000) }
        ],
        affectedPeople: { estimated: 300, confirmed: 25 },
        requiredResources: [
          { resource: 'SWAT Team', quantity: 2, status: 'allocated' },
          { resource: 'Ambulances', quantity: 8, status: 'received' },
          { resource: 'Police Units', quantity: 15, status: 'allocated' }
        ],
        createdAt: new Date(now - 1800000)
      },
      {
        title: 'Bomb Threat - Public Transportation Hub',
        description: 'Anonymous bomb threat called in. Train station evacuated. Bomb squad dispatched. K-9 units searching area.',
        type: 'security',
        status: 'in_progress',
        priority: 'high',
        severity: 'severe',
        location: { latitude: 37.7849, longitude: -122.4094, address: 'Union Square BART Station, San Francisco, CA' },
        reportedBy: responder._id,
        assignedTeam: responder._id,
        liveUpdates: [
          { update: 'Bomb threat reported. Station evacuated', updatedBy: responder._id, timestamp: new Date(now - 2400000) },
          { update: 'Bomb squad and K-9 units arrived. Search in progress', updatedBy: responder._id, timestamp: new Date(now - 2100000) },
          { update: 'All clear given. Station reopening after security sweep', updatedBy: responder._id, timestamp: new Date(now - 1800000) }
        ],
        affectedPeople: { estimated: 1000, confirmed: 0 },
        requiredResources: [
          { resource: 'Bomb Squad', quantity: 1, status: 'received' },
          { resource: 'K-9 Units', quantity: 3, status: 'allocated' },
          { resource: 'Police', quantity: 10, status: 'allocated' }
        ],
        createdAt: new Date(now - 2400000)
      },

      // Resolved Cases
      {
        title: 'Gas Leak in Residential Building - RESOLVED',
        description: 'Natural gas leak detected by smart sensors. Building evacuated. Gas company responded and repaired leak. All clear given.',
        type: 'fire',
        status: 'resolved',
        priority: 'high',
        severity: 'severe',
        location: { latitude: 37.7949, longitude: -122.3994, address: '123 Residential Ave, San Francisco, CA' },
        reportedBy: civilian._id,
        assignedTeam: responder._id,
        resolvedAt: new Date(now - 86400000),
        liveUpdates: [
          { update: 'Gas leak detected. Emergency evacuation', updatedBy: civilian._id, timestamp: new Date(now - 10800000) },
          { update: 'Gas company on scene. Repairing leak', updatedBy: responder._id, timestamp: new Date(now - 9900000) },
          { update: 'Leak repaired. Building cleared for re-entry', updatedBy: responder._id, timestamp: new Date(now - 86400000) }
        ],
        affectedPeople: { estimated: 40, confirmed: 40 },
        createdAt: new Date(now - 10800000)
      },
      {
        title: 'Power Outage - Major Grid Failure - RESOLVED',
        description: 'Large-scale power outage affecting 50,000+ customers. Backup generators activated. Power restored to 95% of customers.',
        type: 'other',
        status: 'resolved',
        priority: 'medium',
        severity: 'moderate',
        location: { latitude: 37.7749, longitude: -122.4194, address: 'Pacific Gas & Electric Grid, San Francisco, CA' },
        reportedBy: responder._id,
        assignedTeam: responder._id,
        resolvedAt: new Date(now - 172800000),
        liveUpdates: [
          { update: 'Major power outage reported. 50K+ customers affected', updatedBy: responder._id, timestamp: new Date(now - 216000000) },
          { update: 'Backup power activated for critical infrastructure', updatedBy: responder._id, timestamp: new Date(now - 198000000) },
          { update: 'Power restored to 95% of customers', updatedBy: responder._id, timestamp: new Date(now - 172800000) }
        ],
        affectedPeople: { estimated: 50000, confirmed: 50000 },
        createdAt: new Date(now - 216000000)
      },

      // Recent/Active Cases
      {
        title: 'Bridge Structural Damage - Emergency Inspection',
        description: 'Engineers report concerning cracks in bridge support. Traffic diverted. Full inspection scheduled. Potential closure if critical damage found.',
        type: 'other',
        status: 'in_progress',
        priority: 'high',
        severity: 'severe',
        location: { latitude: 37.8044, longitude: -122.4162, address: 'Golden Gate Bridge, San Francisco, CA' },
        reportedBy: responder._id,
        assignedTeam: responder._id,
        liveUpdates: [
          { update: 'Structural damage reported. Traffic diverted', updatedBy: responder._id, timestamp: new Date(now - 3600000) },
          { update: 'Structural engineers conducting detailed inspection', updatedBy: responder._id, timestamp: new Date(now - 2700000) }
        ],
        affectedPeople: { estimated: 100000, confirmed: 0 },
        requiredResources: [
          { resource: 'Structural Engineers', quantity: 5, status: 'allocated' },
          { resource: 'Traffic Control', quantity: 20, status: 'received' }
        ],
        createdAt: new Date(now - 3600000)
      },
      {
        title: 'Mass Casualty Event - Building Collapse',
        description: 'Partial building collapse during construction. Multiple workers trapped. Search and rescue operation active. Heavy machinery needed.',
        type: 'other',
        status: 'in_progress',
        priority: 'critical',
        severity: 'extreme',
        location: { latitude: 37.7849, longitude: -122.4094, address: 'Construction Site, 789 Build Ave, San Francisco, CA' },
        reportedBy: civilian._id,
        assignedTeam: responder._id,
        liveUpdates: [
          { update: 'Building collapse reported. Emergency response activated', updatedBy: civilian._id, timestamp: new Date(now - 5400000) },
          { update: '5 workers rescued. 3 still trapped. Search continuing', updatedBy: responder._id, timestamp: new Date(now - 4800000) },
          { update: 'Heavy rescue equipment arrived. Extraction in progress', updatedBy: responder._id, timestamp: new Date(now - 4200000) },
          { update: '2 more workers rescued. 1 unaccounted for', updatedBy: responder._id, timestamp: new Date(now - 3600000) }
        ],
        affectedPeople: { estimated: 15, confirmed: 8 },
        requiredResources: [
          { resource: 'Search & Rescue', quantity: 6, status: 'received' },
          { resource: 'Heavy Machinery', quantity: 3, status: 'allocated' },
          { resource: 'Ambulances', quantity: 6, status: 'received' }
        ],
        createdAt: new Date(now - 5400000)
      }
    ];

    const incidents = await Incident.insertMany(innovativeIncidents);

    console.log('✅ Innovative default incidents created successfully:');
    console.log(`   Total: ${incidents.length} incidents`);
    console.log(`   Active: ${incidents.filter(i => i.status !== 'resolved').length}`);
    console.log(`   Resolved: ${incidents.filter(i => i.status === 'resolved').length}`);
    console.log(`   Critical Priority: ${incidents.filter(i => i.priority === 'critical').length}`);
    console.log(`   Extreme Severity: ${incidents.filter(i => i.severity === 'extreme').length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating incidents:', error);
    process.exit(1);
  }
};

createDefaultIncidents();
