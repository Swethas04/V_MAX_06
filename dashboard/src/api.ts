import axios from 'axios';

export const API_BASE_URL = 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

export type SubmitterType = 'individual' | 'community_org' | 'pri' | 'ulb' | 'govt_department';

export interface ProblemItem {
  id: string;
  title: string;
  description: string;
  category: string;
  district: string;
  village?: string;
  status: string;
  priorityScore?: number;
  priority?: string;
  institution?: string;
  upvotes: number;
  submitterType: SubmitterType;
  organizationName?: string | null;
  registrationId?: string | null;
  submitterName?: string | null;
  submitterPhone?: string | null;
  createdAt?: string;
  media?: { type: string; url: string; message?: string }[];
  matchedOn?: string[];
  aiRoutingResult?: {
    category: string;
    priorityScore: number;
    duplicateCandidateIds: string[];
    suggestedInstitutionIds: string[];
    suggestedInstitutionsExplained?: {
      institutionId: string;
      institutionName: string;
      matchedOn: string[];
    }[];
  } | null;
}

// Fallback seed data for instant presentation
export const MOCK_SUMMARY = {
  totalProblems: 142,
  assignedToColleges: 108,
  activePrototypes: 39,
  fieldPilots: 18,
  resolvedCount: 27,
  aiRoutingRate: 98.4,
  industryFundingCommitted: '₹ 42,50,000',
  institutionalSubmissionsRate: '40.8%',
};

export const MOCK_SUBMITTER_DISTRIBUTION = [
  {
    type: 'individual',
    label: 'Citizen / Individual',
    count: 84,
    pct: '59.2%',
    resolved: 14,
    avgPriority: 62.4,
    color: '#2e7d32',
    icon: 'User',
    description: 'Direct citizen filings from village wards & hamlets',
  },
  {
    type: 'pri',
    label: 'Panchayati Raj (PRI)',
    count: 26,
    pct: '18.3%',
    resolved: 7,
    avgPriority: 84.1,
    color: '#e65100',
    icon: 'Crown',
    description: 'Gram Panchayat & Mukhiya official community filings',
  },
  {
    type: 'ulb',
    label: 'Urban Local Body (ULB)',
    count: 18,
    pct: '12.7%',
    resolved: 4,
    avgPriority: 79.5,
    color: '#6a1b9a',
    icon: 'Building2',
    description: 'Nagar Nigam, Municipal Corporation & Ward Councilors',
  },
  {
    type: 'govt_department',
    label: 'Govt Department',
    count: 10,
    pct: '7.0%',
    resolved: 2,
    avgPriority: 88.0,
    color: '#00838f',
    icon: 'Shield',
    description: 'District Line Departments (PHED, Health, Agri, PWD)',
  },
  {
    type: 'community_org',
    label: 'Community Org / SHG',
    count: 4,
    pct: '2.8%',
    resolved: 0,
    avgPriority: 71.2,
    color: '#1565c0',
    icon: 'Users',
    description: 'Women SHGs, Civil Society & Rural Farmer Collectives',
  },
];

export const MOCK_DISTRICT_HEAT = [
  { district: 'Ranchi', count: 34, lat: 23.3441, lng: 85.3096, resolved: 8 },
  { district: 'Dhanbad', count: 28, lat: 23.7957, lng: 86.4304, resolved: 6 },
  { district: 'Bokaro', count: 21, lat: 23.6693, lng: 86.1511, resolved: 4 },
  { district: 'East Singhbhum (Jamshedpur)', count: 24, lat: 22.8046, lng: 86.2029, resolved: 5 },
  { district: 'Hazaribagh', count: 12, lat: 23.9937, lng: 85.3623, resolved: 2 },
  { district: 'Deoghar', count: 9, lat: 24.4826, lng: 86.7000, resolved: 1 },
  { district: 'Dumka', count: 8, lat: 24.2678, lng: 87.2483, resolved: 1 },
  { district: 'Palamu', count: 6, lat: 24.0375, lng: 84.0726, resolved: 0 },
];

export const MOCK_CATEGORIES = [
  { category: 'Water Supply', count: 46, color: '#0288D1' },
  { category: 'Waste Management', count: 31, color: '#5D4037' },
  { category: 'Electricity & Power', count: 24, color: '#F57C00' },
  { category: 'Agriculture & Irrigation', count: 19, color: '#388E3C' },
  { category: 'Roads & Transport', count: 12, color: '#455A64' },
  { category: 'Healthcare PHCs', count: 10, color: '#D32F2F' },
];

export const MOCK_LEADERBOARD = [
  {
    rank: 1,
    name: 'IIT (ISM) Dhanbad',
    district: 'Dhanbad',
    code: 'IIT-DHN',
    activeTeams: 14,
    prototypes: 8,
    resolved: 11,
    industryGrants: '₹ 18,50,000',
    topDomains: ['Mining Env', 'Water Purif', 'Clean Energy'],
  },
  {
    rank: 2,
    name: 'Birla Institute of Technology (BIT) Mesra',
    district: 'Ranchi',
    code: 'BIT-MES',
    activeTeams: 12,
    prototypes: 6,
    resolved: 9,
    industryGrants: '₹ 14,20,000',
    topDomains: ['IoT Sensors', 'AgriTech', 'Biotech'],
  },
  {
    rank: 3,
    name: 'National Institute of Technology (NIT) Jamshedpur',
    district: 'East Singhbhum',
    code: 'NIT-JSR',
    activeTeams: 9,
    prototypes: 5,
    resolved: 7,
    industryGrants: '₹ 9,80,000',
    topDomains: ['Solid Waste', 'Smart Grid', 'Automation'],
  },
  {
    rank: 4,
    name: 'Babu Dinesh Singh University',
    district: 'Garhwa',
    code: 'BDSU-GAR',
    activeTeams: 4,
    prototypes: 2,
    resolved: 2,
    industryGrants: '₹ 2,50,000',
    topDomains: ['Rural Water', 'Solar Storage'],
  },
];

export const MOCK_INITIAL_PROBLEMS: ProblemItem[] = [
  {
    id: '1',
    title: 'Groundwater arsenic contamination in rural tube-wells',
    description: 'Arsenic testing above 0.08 mg/L affecting 4 villages in Chandankiyari block.',
    category: 'water',
    district: 'Bokaro',
    village: 'Chandankiyari',
    status: 'prototype',
    priority: 'critical',
    priorityScore: 92,
    institution: 'IIT (ISM) Dhanbad',
    matchedOn: ['Water Resource Research', 'Civil Engineering', 'Environmental'],
    aiRoutingResult: {
      category: 'water',
      priorityScore: 92,
      duplicateCandidateIds: [],
      suggestedInstitutionIds: ['inst-iit-ism'],
      suggestedInstitutionsExplained: [
        {
          institutionId: 'inst-iit-ism',
          institutionName: 'IIT (ISM) Dhanbad',
          matchedOn: ['Water Resource Research', 'Civil Engineering', 'Environmental'],
        },
      ],
    },
    upvotes: 48,
    submitterType: 'pri',
    organizationName: 'Chandankiyari Gram Panchayat',
    registrationId: 'JH-PRI-BOK-042',
    submitterName: 'Mukhiya Ramesh Mahto',
  },
  {
    id: '2',
    title: 'Unsegregated municipal plastic dumping near Subarnarekha river',
    description: 'Over 5 tons of daily municipal solid waste dumped directly on riverbank.',
    category: 'environment',
    district: 'East Singhbhum',
    village: 'Mango Ward 12',
    status: 'assigned',
    priority: 'high',
    priorityScore: 86,
    institution: 'NIT Jamshedpur',
    matchedOn: ['Rural Technology Centre', 'Environmental Engineering'],
    aiRoutingResult: {
      category: 'environment',
      priorityScore: 86,
      duplicateCandidateIds: [],
      suggestedInstitutionIds: ['inst-nit-jsr'],
      suggestedInstitutionsExplained: [
        {
          institutionId: 'inst-nit-jsr',
          institutionName: 'NIT Jamshedpur',
          matchedOn: ['Rural Technology Centre', 'Environmental Engineering'],
        },
      ],
    },
    upvotes: 36,
    submitterType: 'ulb',
    organizationName: 'Mango Municipal Corporation',
    registrationId: 'JH-ULB-MNGO-12',
    submitterName: 'Executive Officer K. Singh',
  },
  {
    id: '3',
    title: 'Frequent transformer burnouts during peak paddy harvest season',
    description: '25kVA transformer bursts repeatedly due to irrigation pump load surge.',
    category: 'urban_infra',
    district: 'Ranchi',
    village: 'Ormanjhi',
    status: 'piloted',
    priority: 'high',
    priorityScore: 78,
    institution: 'BIT Mesra',
    matchedOn: ['Electrical Engineering', 'Smart City Lab'],
    aiRoutingResult: {
      category: 'urban_infra',
      priorityScore: 78,
      duplicateCandidateIds: [],
      suggestedInstitutionIds: ['inst-bit-mesra'],
      suggestedInstitutionsExplained: [
        {
          institutionId: 'inst-bit-mesra',
          institutionName: 'BIT Mesra',
          matchedOn: ['Electrical Engineering', 'Smart City Lab'],
        },
      ],
    },
    upvotes: 29,
    submitterType: 'govt_department',
    organizationName: 'Jharkhand Bijli Vitran Nigam (JBVNL)',
    registrationId: 'JBVNL-RNC-DIV-4',
    submitterName: 'Asst Engineer M. Sharma',
  },
  {
    id: '4',
    title: 'Cold-chain storage shortage for tomato farmers in Ormanjhi',
    description: 'Farmers forced to distress-sell tomatoes at ₹2/kg due to zero cooling storage.',
    category: 'agriculture',
    district: 'Ranchi',
    village: 'Ormanjhi Mandi',
    status: 'resolved',
    priority: 'medium',
    priorityScore: 68,
    institution: 'BIT Mesra',
    matchedOn: ['AgriTech Incubation Cell', 'Biotechnology', 'Food Tech'],
    aiRoutingResult: {
      category: 'agriculture',
      priorityScore: 68,
      duplicateCandidateIds: [],
      suggestedInstitutionIds: ['inst-bit-mesra'],
      suggestedInstitutionsExplained: [
        {
          institutionId: 'inst-bit-mesra',
          institutionName: 'BIT Mesra',
          matchedOn: ['AgriTech Incubation Cell', 'Biotechnology', 'Food Tech'],
        },
      ],
    },
    upvotes: 62,
    submitterType: 'community_org',
    organizationName: 'Jharkhand Farmer Producer Org (FPO)',
    registrationId: 'JH-FPO-RNC-09',
    submitterName: 'Sunita Devi (SHG President)',
  },
  {
    id: '5',
    title: 'Heavy coal transport road collapse on NH-32 bypass',
    description: 'Overloaded 16-wheel dumpers crushed the rural connecting road culvert.',
    category: 'roads',
    district: 'Dhanbad',
    village: 'Katras',
    status: 'team_formed',
    priority: 'critical',
    priorityScore: 94,
    institution: 'IIT (ISM) Dhanbad',
    matchedOn: ['Civil Engineering', 'Transportation Systems'],
    aiRoutingResult: {
      category: 'roads',
      priorityScore: 94,
      duplicateCandidateIds: [],
      suggestedInstitutionIds: ['inst-iit-ism'],
      suggestedInstitutionsExplained: [
        {
          institutionId: 'inst-iit-ism',
          institutionName: 'IIT (ISM) Dhanbad',
          matchedOn: ['Civil Engineering', 'Transportation Systems'],
        },
      ],
    },
    upvotes: 54,
    submitterType: 'pri',
    organizationName: 'Katras Gram Panchayat',
    registrationId: 'JH-PRI-DHN-18',
    submitterName: 'Panchayat Samiti Member A. Ansari',
  },
  {
    id: '6',
    title: 'Lack of remote ECG & tele-consultation in Dumka tribal PHCs',
    description: 'Cardiovascular patients have to travel 90km to Deoghar for basic ECG tests.',
    category: 'healthcare',
    district: 'Dumka',
    village: 'Shikaripara',
    status: 'under_review',
    priority: 'high',
    priorityScore: 82,
    institution: 'BIT Mesra',
    matchedOn: ['Biomedical Research', 'Pharmaceutical Sciences', 'Public Health'],
    aiRoutingResult: {
      category: 'healthcare',
      priorityScore: 82,
      duplicateCandidateIds: [],
      suggestedInstitutionIds: ['inst-bit-mesra'],
      suggestedInstitutionsExplained: [
        {
          institutionId: 'inst-bit-mesra',
          institutionName: 'BIT Mesra',
          matchedOn: ['Biomedical Research', 'Pharmaceutical Sciences', 'Public Health'],
        },
      ],
    },
    upvotes: 41,
    submitterType: 'individual',
    submitterName: 'Dr. Alok Murmu',
  },
  {
    id: '7',
    title: 'Fluoride levels exceeding permissible limit in drinking water',
    description: 'Severe skeletal fluorosis in children drinking from 12 handpumps in Daltonganj.',
    category: 'water',
    district: 'Palamu',
    village: 'Daltonganj Block',
    status: 'assigned',
    priority: 'critical',
    priorityScore: 90,
    institution: 'IIT (ISM) Dhanbad',
    matchedOn: ['Water Resource Research', 'Environmental Chemistry'],
    aiRoutingResult: {
      category: 'water',
      priorityScore: 90,
      duplicateCandidateIds: [],
      suggestedInstitutionIds: ['inst-iit-ism'],
      suggestedInstitutionsExplained: [
        {
          institutionId: 'inst-iit-ism',
          institutionName: 'IIT (ISM) Dhanbad',
          matchedOn: ['Water Resource Research', 'Environmental Chemistry'],
        },
      ],
    },
    upvotes: 59,
    submitterType: 'individual',
    submitterName: 'Suresh Baitha (Citizen)',
  },
];

export async function submitProblemApi(formData: FormData) {
  try {
    const res = await api.post('/problems', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || err.message || 'Submission failed');
  }
}

export async function checkSimilarApi(payload: {
  title: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  district?: string;
  threshold?: number;
}) {
  try {
    const res = await api.post('/problems/check-similar', payload);
    return res.data;
  } catch {
    return {
      isDuplicate: false,
      similarProblems: [],
      predictedCategory: 'water',
      confidence: 0.85,
    };
  }
}

export async function supportProblemApi(problemId: string, formData: FormData) {
  try {
    const res = await api.post(`/problems/${problemId}/support`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || err.message || 'Support failed');
  }
}

// ─── Authentication API (OTP & JWT) ───
export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: string;
  organizationName?: string;
  orgAffiliation?: string;
}

export async function sendOtpApi(phone: string): Promise<{ message: string }> {
  try {
    const res = await api.post('/auth/send-otp', { phone });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Failed to send OTP');
  }
}

export async function verifyOtpApi(phone: string, otp: string): Promise<{
  accessToken: string;
  isNewUser: boolean;
  user: UserProfile;
}> {
  try {
    const res = await api.post('/auth/verify-otp', { phone, otp });
    const data = res.data;
    if (data.accessToken) {
      localStorage.setItem('auth_token', data.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    }
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Invalid verification code');
  }
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  delete api.defaults.headers.common['Authorization'];
}

