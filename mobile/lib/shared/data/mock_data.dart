/// Shared mock / seed data matching the dashboard's api.ts constants.
library mock_data;

const mockSummary = {
  'totalProblems': 142,
  'assignedToColleges': 108,
  'activePrototypes': 39,
  'fieldPilots': 18,
  'resolvedCount': 27,
  'aiRoutingRate': 98.4,
  'industryFundingCommitted': '₹ 42,50,000',
};

const mockCategories = [
  {'category': 'Water Supply', 'count': 46, 'colorVal': 0xFF0288D1},
  {'category': 'Waste Management', 'count': 31, 'colorVal': 0xFF5D4037},
  {'category': 'Electricity & Power', 'count': 24, 'colorVal': 0xFFF57C00},
  {'category': 'Agriculture & Irrig.', 'count': 19, 'colorVal': 0xFF388E3C},
  {'category': 'Roads & Transport', 'count': 12, 'colorVal': 0xFF455A64},
  {'category': 'Healthcare PHCs', 'count': 10, 'colorVal': 0xFFD32F2F},
];

const mockPipeline = [
  {'stage': 'Submitted', 'count': 142, 'colorVal': 0xFF1565C0},
  {'stage': 'AI Classified', 'count': 138, 'colorVal': 0xFF7B1FA2},
  {'stage': 'College Assigned', 'count': 108, 'colorVal': 0xFFE65100},
  {'stage': 'Team Formed', 'count': 64, 'colorVal': 0xFF1976D2},
  {'stage': 'Prototype MVP', 'count': 39, 'colorVal': 0xFF00838F},
  {'stage': 'Field Pilot', 'count': 18, 'colorVal': 0xFF2E7D32},
  {'stage': 'Resolved', 'count': 27, 'colorVal': 0xFF1B5E20},
];

const mockMonthlyTrends = [
  {'month': 'Apr', 'submissions': 18, 'prototypes': 4, 'resolved': 2},
  {'month': 'May', 'submissions': 25, 'prototypes': 8, 'resolved': 5},
  {'month': 'Jun', 'submissions': 32, 'prototypes': 12, 'resolved': 8},
  {'month': 'Jul', 'submissions': 44, 'prototypes': 21, 'resolved': 14},
  {'month': 'Aug', 'submissions': 58, 'prototypes': 31, 'resolved': 21},
  {'month': 'Sep', 'submissions': 142, 'prototypes': 39, 'resolved': 27},
];

const mockSubmitters = [
  {
    'label': 'Citizen / Individual',
    'count': 84,
    'pct': '59.2%',
    'avgPriority': 62.4,
    'colorVal': 0xFF2E7D32,
  },
  {
    'label': 'Panchayati Raj (PRI)',
    'count': 26,
    'pct': '18.3%',
    'avgPriority': 84.1,
    'colorVal': 0xFFE65100,
  },
  {
    'label': 'Urban Local Body (ULB)',
    'count': 18,
    'pct': '12.7%',
    'avgPriority': 79.5,
    'colorVal': 0xFF6A1B9A,
  },
  {
    'label': 'Govt Department',
    'count': 10,
    'pct': '7.0%',
    'avgPriority': 88.0,
    'colorVal': 0xFF00838F,
  },
  {
    'label': 'Community Org / SHG',
    'count': 4,
    'pct': '2.8%',
    'avgPriority': 71.2,
    'colorVal': 0xFF1565C0,
  },
];

const mockLeaderboard = [
  {
    'rank': 1,
    'name': 'IIT (ISM) Dhanbad',
    'district': 'Dhanbad',
    'code': 'IIT-DHN',
    'activeTeams': 14,
    'prototypes': 8,
    'resolved': 11,
    'industryGrants': '₹ 18,50,000',
    'topDomains': ['Mining Env', 'Water Purif', 'Clean Energy'],
  },
  {
    'rank': 2,
    'name': 'BIT Mesra',
    'district': 'Ranchi',
    'code': 'BIT-MES',
    'activeTeams': 12,
    'prototypes': 6,
    'resolved': 9,
    'industryGrants': '₹ 14,20,000',
    'topDomains': ['IoT Sensors', 'AgriTech', 'Biotech'],
  },
  {
    'rank': 3,
    'name': 'NIT Jamshedpur',
    'district': 'East Singhbhum',
    'code': 'NIT-JSR',
    'activeTeams': 9,
    'prototypes': 5,
    'resolved': 7,
    'industryGrants': '₹ 9,80,000',
    'topDomains': ['Solid Waste', 'Smart Grid', 'Automation'],
  },
  {
    'rank': 4,
    'name': 'Babu Dinesh Singh University',
    'district': 'Garhwa',
    'code': 'BDSU-GAR',
    'activeTeams': 4,
    'prototypes': 2,
    'resolved': 2,
    'industryGrants': '₹ 2,50,000',
    'topDomains': ['Rural Water', 'Solar Storage'],
  },
];
