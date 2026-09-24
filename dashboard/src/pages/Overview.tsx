import React from 'react';
import {
  FileText,
  Building,
  Cpu,
  CheckCircle2,
  TrendingUp,
  Coins,
  ArrowUpRight,
} from 'lucide-react';
import { MOCK_SUMMARY, MOCK_CATEGORIES, MOCK_LEADERBOARD } from '../api';

interface OverviewProps {
  onNavigate: (tab: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  const kpis = [
    {
      label: 'Citizen Challenges',
      value: MOCK_SUMMARY.totalProblems,
      sub: `${MOCK_SUMMARY.aiRoutingRate}% AI Routed`,
      icon: FileText,
      color: '#1a6b3c',
      bg: 'rgba(26, 107, 60, 0.08)',
    },
    {
      label: 'Assigned to Universities',
      value: MOCK_SUMMARY.assignedToColleges,
      sub: '3 Tier-1 Engineering Institutes',
      icon: Building,
      color: '#1565c0',
      bg: 'rgba(21, 101, 192, 0.08)',
    },
    {
      label: 'Working Prototypes / MVPs',
      value: MOCK_SUMMARY.activePrototypes,
      sub: 'Lab & Field Tested',
      icon: Cpu,
      color: '#7b1fa2',
      bg: 'rgba(123, 31, 162, 0.08)',
    },
    {
      label: 'Field Pilot Tests',
      value: MOCK_SUMMARY.fieldPilots,
      sub: 'In Jharkhand Villages & Wards',
      icon: TrendingUp,
      color: '#e65100',
      bg: 'rgba(230, 81, 0, 0.08)',
    },
    {
      label: 'Community Resolutions',
      value: MOCK_SUMMARY.resolvedCount,
      sub: 'Permanent Solutions Delivered',
      icon: CheckCircle2,
      color: '#2e7d32',
      bg: 'rgba(46, 125, 50, 0.08)',
    },
    {
      label: 'Industry CSR Mobilized',
      value: MOCK_SUMMARY.industryFundingCommitted,
      sub: 'Tata Steel, SAIL, Coal India',
      icon: Coins,
      color: '#c2410c',
      bg: 'rgba(194, 65, 12, 0.08)',
    },
  ];

  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '18px',
        marginBottom: '28px',
      }}>
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {kpi.label}
                </span>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: kpi.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={18} color={kpi.color} />
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                  {kpi.value}
                </h3>
                <p style={{ fontSize: '11.5px', color: kpi.color, fontWeight: 600, marginTop: '4px' }}>
                  {kpi.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 Column Layout: Quick Action Banner + Top Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1a6b3c 0%, #0f4826 100%)',
          borderRadius: '18px',
          padding: '28px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.4px',
              marginBottom: '16px',
            }}>
              <span>SMART INDIA HACKATHON 2024</span>
              <span>•</span>
              <span>PROBLEM STATEMENT 26043</span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1.3, marginBottom: '10px' }}>
              Transforming Civic Challenges Into Academic Patents & Industry Solutions
            </h3>
            <p style={{ fontSize: '13px', color: '#c4e0cb', lineHeight: 1.5, maxWidth: '540px' }}>
              Samadhan Setu ingests hyper-local civic submissions across Jharkhand, leverages AI semantic deduplication and institutional capability matching, and mobilizes student-faculty innovation teams.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={() => onNavigate('heatmap')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ffffff',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '13px',
                padding: '10px 18px',
                borderRadius: '10px',
              }}
            >
              <span>Explore Jharkhand GIS Map</span>
              <ArrowUpRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('leaderboard')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '13px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <span>University Rankings</span>
            </button>
          </div>
        </div>

        {/* Priority Problem Categories */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              Top Problem Domains in Jharkhand
            </h4>
            <button
              onClick={() => onNavigate('analytics')}
              style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}
            >
              View Analytics →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MOCK_CATEGORIES.map((c, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{c.category}</span>
                  <span style={{ fontWeight: 700, color: c.color }}>{c.count} challenges</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#edf2ed', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(c.count / 46) * 100}%`,
                    backgroundColor: c.color,
                    borderRadius: '3px',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* University Leaderboard Preview */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        padding: '24px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              Top Academic Innovators
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Based on active prototype development, community resolution, and CSR grant adoption
            </p>
          </div>
          <button
            onClick={() => onNavigate('leaderboard')}
            style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}
          >
            Full Leaderboard →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {MOCK_LEADERBOARD.slice(0, 3).map((u) => (
            <div
              key={u.rank}
              style={{
                padding: '18px',
                borderRadius: '14px',
                border: '1px solid var(--border)',
                backgroundColor: '#fbfdfb',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: u.rank === 1 ? '#ffb703' : u.rank === 2 ? '#b0bec5' : '#cd7f32',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800,
                }}>
                  #{u.rank}
                </span>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{u.name}</h5>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.district}, Jharkhand</p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingTop: '10px', borderTop: '1px solid #edf2ed' }}>
                <span><strong>{u.activeTeams}</strong> Teams</span>
                <span><strong>{u.prototypes}</strong> Prototypes</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}><strong>{u.resolved}</strong> Resolved</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
