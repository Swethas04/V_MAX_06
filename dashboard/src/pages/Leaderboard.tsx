import React from 'react';
import { MOCK_LEADERBOARD } from '../api';
import { Trophy, Medal } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f4826 0%, #1a6b3c 100%)',
        borderRadius: '18px',
        padding: '26px 30px',
        color: '#ffffff',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            marginBottom: '10px',
          }}>
            <Trophy size={14} color="#ffb703" />
            <span>JHARKHAND STATE INNOVATION INDEX</span>
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 800 }}>
            Academic Institution Innovation Rankings
          </h3>
          <p style={{ fontSize: '13px', color: '#c4e0cb', marginTop: '4px' }}>
            Benchmarking universities by active student prototypes, community resolution rate, and industry CSR grants.
          </p>
        </div>
      </div>

      {/* Rankings Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8faf8', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>Rank</th>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>Institution</th>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>District</th>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>Active Teams</th>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>Prototypes</th>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>Resolved</th>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>CSR Grants</th>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>Specialization Domains</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEADERBOARD.map((u) => {
                const isGold = u.rank === 1;
                const isSilver = u.rank === 2;
                const isBronze = u.rank === 3;

                return (
                  <tr
                    key={u.rank}
                    style={{
                      borderBottom: '1px solid #edf2ed',
                      backgroundColor: isGold ? 'rgba(255, 183, 3, 0.04)' : '#ffffff',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '18px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isGold && <Medal size={20} color="#ffb703" />}
                        {isSilver && <Medal size={20} color="#90a4ae" />}
                        {isBronze && <Medal size={20} color="#cd7f32" />}
                        {!isGold && !isSilver && !isBronze && (
                          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', paddingLeft: '4px' }}>
                            #{u.rank}
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '18px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(26, 107, 60, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary)',
                          fontWeight: 800,
                          fontSize: '11px',
                        }}>
                          {u.code}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '14px' }}>
                            {u.name}
                          </p>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Tier-1 Technical Institute
                          </p>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '18px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {u.district}
                    </td>

                    <td style={{ padding: '18px 20px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(21, 101, 192, 0.08)',
                        color: '#1565c0',
                        fontWeight: 700,
                      }}>
                        {u.activeTeams} Teams
                      </span>
                    </td>

                    <td style={{ padding: '18px 20px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(123, 31, 162, 0.08)',
                        color: '#7b1fa2',
                        fontWeight: 700,
                      }}>
                        {u.prototypes} MVPs
                      </span>
                    </td>

                    <td style={{ padding: '18px 20px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(46, 125, 50, 0.1)',
                        color: '#2e7d32',
                        fontWeight: 800,
                      }}>
                        {u.resolved} Resolved
                      </span>
                    </td>

                    <td style={{ padding: '18px 20px', fontWeight: 700, color: '#c2410c' }}>
                      {u.industryGrants}
                    </td>

                    <td style={{ padding: '18px 20px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {u.topDomains.map((d, i) => (
                          <span
                            key={i}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: '#edf2ed',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: 'var(--text-main)',
                            }}
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
