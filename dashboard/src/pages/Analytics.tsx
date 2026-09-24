import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
} from 'recharts';
import { MOCK_CATEGORIES, MOCK_SUBMITTER_DISTRIBUTION } from '../api';
import {
  TrendingUp,
  CheckCircle,
  Clock,
  Crown,
  Building2,
  Shield,
  Users,
  User,
  Zap,
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const pipelineFunnel = [
    { stage: '1. Submitted', count: 142, color: '#1565c0' },
    { stage: '2. AI Classified', count: 138, color: '#7b1fa2' },
    { stage: '3. College Assigned', count: 108, color: '#e65100' },
    { stage: '4. Team Formed', count: 64, color: '#1976d2' },
    { stage: '5. Prototype MVP', count: 39, color: '#00838f' },
    { stage: '6. Field Pilot', count: 18, color: '#2e7d32' },
    { stage: '7. Resolved', count: 27, color: '#1b5e20' },
  ];

  const monthlyTrends = [
    { month: 'Apr', submissions: 18, prototypes: 4, resolved: 2 },
    { month: 'May', submissions: 25, prototypes: 8, resolved: 5 },
    { month: 'Jun', submissions: 32, prototypes: 12, resolved: 8 },
    { month: 'Jul', submissions: 44, prototypes: 21, resolved: 14 },
    { month: 'Aug', submissions: 58, prototypes: 31, resolved: 21 },
    { month: 'Sep', submissions: 142, prototypes: 39, resolved: 27 },
  ];

  const submitterPieData = MOCK_SUBMITTER_DISTRIBUTION.map((d) => ({
    name: d.label,
    value: d.count,
    color: d.color,
  }));

  return (
    <div style={{ padding: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1a6b3c', marginBottom: '8px' }}>
            <Clock size={18} />
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Avg. AI Routing Speed</span>
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 800 }}>&lt; 2.8s</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>From submit to 384-dim embedding & university match</p>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e65100', marginBottom: '8px' }}>
            <Crown size={18} />
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Institutional Signal Share</span>
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 800 }}>40.8%</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PRI Panchayats, ULBs, & Govt Departments</p>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1565c0', marginBottom: '8px' }}>
            <TrendingUp size={18} />
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Conversion to Working MVP</span>
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 800 }}>36.1%</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Of assigned challenges reached working prototype</p>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2e7d32', marginBottom: '8px' }}>
            <CheckCircle size={18} />
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Ground Verification</span>
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 800 }}>88.9%</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Citizen satisfaction on resolved solutions</p>
        </div>
      </div>

      {/* SUBMITTER-TYPE BREAKDOWN SECTION (Feature 4) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#e65100" /> Submitter-Type Authority Breakdown & Signal Weighting
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Evaluating intake channels: Panchayati Raj Institutions (PRI) & Urban Local Bodies (ULB) provide official resolution filings carrying higher institutional priority.
            </p>
          </div>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: '#fff3e0',
              color: '#e65100',
              fontWeight: 800,
              fontSize: '11.5px',
            }}
          >
            🏛️ Institutional vs. Individual Analysis
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px', marginTop: '20px', alignItems: 'center' }}>
          {/* Submitter Cards & Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_SUBMITTER_DISTRIBUTION.map((item) => (
              <div
                key={item.type}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#f8faf8',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: `${item.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.type === 'pri' && <Crown size={16} color={item.color} />}
                    {item.type === 'ulb' && <Building2 size={16} color={item.color} />}
                    {item.type === 'govt_department' && <Shield size={16} color={item.color} />}
                    {item.type === 'community_org' && <Users size={16} color={item.color} />}
                    {item.type === 'individual' && <User size={16} color={item.color} />}
                  </div>
                  <div>
                    <h5 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>
                      {item.label}
                    </h5>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.description}</p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: item.color }}>{item.count}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>({item.pct})</span>
                  </div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Avg Priority: {item.avgPriority}/100</span>
                </div>
              </div>
            ))}
          </div>

          {/* Submitter Distribution Pie / Donut Chart */}
          <div style={{ height: '260px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={submitterPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {submitterPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 1: 7-Stage Innovation Pipeline Funnel */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px',
        }}
      >
        <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
          7-Stage Societal Innovation Pipeline Funnel
        </h4>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Lifecycle volume from initial citizen intake to ground deployment across Jharkhand
        </p>

        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineFunnel} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2ed" />
              <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#5c6c60' }} />
              <YAxis tick={{ fontSize: 12, fill: '#5c6c60' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '10px',
                  border: '1px solid #e2ede4',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {pipelineFunnel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2 Column Charts: Monthly Trends & Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Monthly Innovation Velocity */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '24px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
            Innovation Velocity (Growth Over Months)
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Tracking acceleration of student prototypes and community resolutions
          </p>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2ed" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="submissions" stroke="#1565c0" strokeWidth={2.5} name="Intake Reports" />
                <Line type="monotone" dataKey="prototypes" stroke="#e65100" strokeWidth={2.5} name="Prototypes" />
                <Line type="monotone" dataKey="resolved" stroke="#2e7d32" strokeWidth={2.5} name="Resolved Solutions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '24px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
            Category Distribution
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Total challenges segmented by societal domain
          </p>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={MOCK_CATEGORIES} margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#edf2ed" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {MOCK_CATEGORIES.map((entry, index) => (
                    <Cell key={`cat-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
