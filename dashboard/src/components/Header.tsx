import React from 'react';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  currentUser?: { name: string; role: string; phone: string } | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onRefresh,
  isRefreshing,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border)',
      padding: '16px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
          {title}
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
          {subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {onRefresh && (
          <button
            onClick={onRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: '#f8faf8',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-main)',
              transition: 'background 0.2s',
            }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
            <span>Sync Live Feed</span>
          </button>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingLeft: '14px',
          borderLeft: '1px solid var(--border)',
        }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(26, 107, 60, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                fontWeight: 800,
                fontSize: '14px',
                border: '1.5px solid rgba(26, 107, 60, 0.2)',
              }}>
                {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'JH'}
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  {currentUser.name || 'User'}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, textTransform: 'capitalize' }}>
                  {currentUser.role.replace('_', ' ')} • +91 {currentUser.phone}
                </p>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Logout"
                  style={{
                    marginLeft: '4px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(26, 107, 60, 0.25)',
                transition: 'opacity 0.15s',
              }}
            >
              <span>Login with OTP</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
