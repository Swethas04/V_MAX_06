import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  BarChart3,
  Trophy,
  TableProperties,
  Building2,
  PlusCircle,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'overview', label: 'Command Overview', icon: LayoutDashboard },
    { id: 'heatmap', label: 'Jharkhand GIS Map', icon: MapPin },
    { id: 'analytics', label: 'Innovation Funnel', icon: BarChart3 },
    { id: 'leaderboard', label: 'University Rankings', icon: Trophy },
    { id: 'registry', label: 'Problem Registry', icon: TableProperties },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-sidebar)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        borderRight: '1px solid rgba(255,255,255,0.08)',
        padding: '24px 16px',
        userSelect: 'none',
        zIndex: 100,
      }}
    >
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingLeft: '8px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2e9455 0%, #1a6b3c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(46, 148, 85, 0.4)',
          }}
        >
          <Building2 size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.2px', color: '#ffffff' }}>
            SANKALP • संकल्प
          </h1>
          <p style={{ fontSize: '11px', color: '#88a690', fontWeight: 500 }}>
            Govt of Jharkhand • SIH 26043
          </p>
        </div>
      </div>

      {/* Prominent Public Submission Action Button */}
      <button
        onClick={() => onTabChange('public-submit')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 14px',
          borderRadius: '12px',
          background:
            activeTab === 'public-submit'
              ? 'linear-gradient(135deg, #ffd54f 0%, #ffb300 100%)'
              : 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: activeTab === 'public-submit' ? '#332200' : '#ffffff',
          fontWeight: 800,
          fontSize: '13px',
          border: 'none',
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          marginBottom: '24px',
          transition: 'transform 0.15s ease, background 0.15s ease',
        }}
      >
        <PlusCircle size={17} />
        <span>+ Report Challenge (Public)</span>
      </button>

      {/* Navigation Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <p
          style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: '#688870',
            fontWeight: 700,
            padding: '0 8px 6px',
          }}
        >
          Portal Management
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#ffffff' : '#b2c8b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13.5px',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Icon size={18} color={isActive ? '#fff' : '#88a690'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* System Status Footer */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '14px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4caf50' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#e0eee3' }}>
            DHTE AI Routing Active
          </span>
        </div>
        <p style={{ fontSize: '11px', color: '#88a690', lineHeight: 1.4 }}>
          PgVector & BullMQ pipeline monitoring 24 Jharkhand districts.
        </p>
      </div>
    </aside>
  );
};
