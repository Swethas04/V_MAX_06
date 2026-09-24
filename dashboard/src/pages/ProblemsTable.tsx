import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Building,
  User,
  Crown,
  Building2,
  Shield,
  Users,
  Sparkles,
} from 'lucide-react';
import { MOCK_INITIAL_PROBLEMS, api } from '../api';
import type { ProblemItem, SubmitterType } from '../api';

export const ProblemsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubmitterType, setSelectedSubmitterType] = useState<string>('all');
  const [problems, setProblems] = useState<ProblemItem[]>(MOCK_INITIAL_PROBLEMS);

  useEffect(() => {
    api
      .get('/problems')
      .then((res) => {
        if (res.data?.items && Array.isArray(res.data.items) && res.data.items.length > 0) {
          const liveItems: ProblemItem[] = res.data.items.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            category: item.category,
            district: item.district || 'Jharkhand',
            village: item.village,
            status: item.status,
            priorityScore: item.priorityScore,
            institution:
              item.assignedInstitution?.name ||
              item.aiRoutingResult?.suggestedInstitutionsExplained?.[0]?.institutionName,
            upvotes: item.upvotes || 0,
            submitterType: item.submitterType || 'individual',
            organizationName: item.organizationName,
            registrationId: item.registrationId,
            submitterName: item.submitterName,
            submitterPhone: item.submitterPhone,
            createdAt: item.createdAt,
            media: item.media,
            aiRoutingResult: item.aiRoutingResult,
            matchedOn:
              item.aiRoutingResult?.suggestedInstitutionsExplained?.[0]?.matchedOn || [],
          }));
          setProblems(liveItems);
        }
      })
      .catch(() => {
        // Fall back gracefully to mock initial problems
      });
  }, []);

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    submitted: { bg: 'rgba(21, 101, 192, 0.1)', text: '#1565c0', label: '1. Submitted' },
    under_review: { bg: 'rgba(123, 31, 162, 0.1)', text: '#7b1fa2', label: '2. AI Classified' },
    assigned: { bg: 'rgba(230, 81, 0, 0.1)', text: '#e65100', label: '3. Assigned' },
    team_formed: { bg: 'rgba(25, 118, 210, 0.1)', text: '#1976d2', label: '4. Team Formed' },
    prototype: { bg: 'rgba(0, 131, 143, 0.1)', text: '#00838f', label: '5. Prototype' },
    piloted: { bg: 'rgba(46, 125, 50, 0.1)', text: '#2e7d32', label: '6. Field Pilot' },
    resolved: { bg: 'rgba(27, 94, 32, 0.15)', text: '#1b5e20', label: '7. Resolved' },
  };

  const submitterBadges: Record<
    SubmitterType,
    { label: string; bg: string; border: string; text: string; icon: any; weightLabel: string }
  > = {
    pri: {
      label: 'PRI (Panchayat)',
      bg: '#fff3e0',
      border: '#ffe082',
      text: '#e65100',
      icon: Crown,
      weightLabel: 'High Priority Signal',
    },
    ulb: {
      label: 'ULB (Municipal)',
      bg: '#f3e5f5',
      border: '#e1bee7',
      text: '#6a1b9a',
      icon: Building2,
      weightLabel: 'Institutional Filing',
    },
    govt_department: {
      label: 'Govt Dept',
      bg: '#e0f7fa',
      border: '#b2ebf2',
      text: '#00838f',
      icon: Shield,
      weightLabel: 'Inter-Agency Referral',
    },
    community_org: {
      label: 'Community / SHG',
      bg: '#e3f2fd',
      border: '#bbdefb',
      text: '#1565c0',
      icon: Users,
      weightLabel: 'Collective Action',
    },
    individual: {
      label: 'Citizen / Individual',
      bg: '#f1f8e9',
      border: '#c5e1a5',
      text: '#2e7d32',
      icon: User,
      weightLabel: 'Direct Report',
    },
  };

  const filtered = problems.filter((p: ProblemItem) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.organizationName && p.organizationName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.submitterName && p.submitterName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const matchesSubmitter =
      selectedSubmitterType === 'all' || p.submitterType === selectedSubmitterType;

    return matchesSearch && matchesStatus && matchesSubmitter;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    setProblems((prev: ProblemItem[]) =>
      prev.map((p: ProblemItem) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  // Counts for top KPI breakdown in registry
  const priCount = problems.filter((p: ProblemItem) => p.submitterType === 'pri').length;
  const ulbCount = problems.filter((p: ProblemItem) => p.submitterType === 'ulb').length;
  const govtCount = problems.filter((p: ProblemItem) => p.submitterType === 'govt_department').length;
  const indCount = problems.filter((p: ProblemItem) => p.submitterType === 'individual').length;

  return (
    <div style={{ padding: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Submitter Signal Overview Chips */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <div
          onClick={() => setSelectedSubmitterType(selectedSubmitterType === 'pri' ? 'all' : 'pri')}
          style={{
            backgroundColor: selectedSubmitterType === 'pri' ? '#ffe0b2' : '#ffffff',
            padding: '14px 18px',
            borderRadius: '14px',
            border: `1.5px solid ${selectedSubmitterType === 'pri' ? '#e65100' : 'var(--border)'}`,
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#e65100', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Crown size={15} /> Panchayati Raj (PRI)
            </span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#e65100' }}>⚡ Priority</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#333' }}>{priCount}</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Filings by Mukhiyas</span>
          </div>
        </div>

        <div
          onClick={() => setSelectedSubmitterType(selectedSubmitterType === 'ulb' ? 'all' : 'ulb')}
          style={{
            backgroundColor: selectedSubmitterType === 'ulb' ? '#e1bee7' : '#ffffff',
            padding: '14px 18px',
            borderRadius: '14px',
            border: `1.5px solid ${selectedSubmitterType === 'ulb' ? '#6a1b9a' : 'var(--border)'}`,
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#6a1b9a', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Building2 size={15} /> Urban Local Bodies (ULB)
            </span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#6a1b9a' }}>🏢 Municipal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#333' }}>{ulbCount}</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ward Resolutions</span>
          </div>
        </div>

        <div
          onClick={() => setSelectedSubmitterType(selectedSubmitterType === 'govt_department' ? 'all' : 'govt_department')}
          style={{
            backgroundColor: selectedSubmitterType === 'govt_department' ? '#b2ebf2' : '#ffffff',
            padding: '14px 18px',
            borderRadius: '14px',
            border: `1.5px solid ${selectedSubmitterType === 'govt_department' ? '#00838f' : 'var(--border)'}`,
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#00838f', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Shield size={15} /> Govt Line Depts
            </span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#00838f' }}>🏛️ Official</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#333' }}>{govtCount}</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Inter-Dept Referrals</span>
          </div>
        </div>

        <div
          onClick={() => setSelectedSubmitterType(selectedSubmitterType === 'individual' ? 'all' : 'individual')}
          style={{
            backgroundColor: selectedSubmitterType === 'individual' ? '#c8e6c9' : '#ffffff',
            padding: '14px 18px',
            borderRadius: '14px',
            border: `1.5px solid ${selectedSubmitterType === 'individual' ? '#2e7d32' : 'var(--border)'}`,
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <User size={15} /> Citizen Submissions
            </span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#2e7d32' }}>👤 Public</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#333' }}>{indCount}</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Village Level Reports</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Header */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '18px 24px',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f8faf8',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '8px 14px',
              flex: 1,
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by title, organization, PRI/ULB code, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '13px',
                color: 'var(--text-main)',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Submitter Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Submitter:</span>
            <select
              value={selectedSubmitterType}
              onChange={(e) => setSelectedSubmitterType(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: '#f8faf8',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--text-main)',
              }}
            >
              <option value="all">All Submitter Types</option>
              <option value="pri">🏛️ Panchayati Raj (PRI)</option>
              <option value="ulb">🏢 Urban Local Body (ULB)</option>
              <option value="govt_department">🛡️ Govt Department</option>
              <option value="community_org">🤝 Community Org / SHG</option>
              <option value="individual">👤 Citizen / Individual</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} color="var(--text-muted)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: '#f8faf8',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              <option value="all">All 7 Lifecycle Stages</option>
              <option value="submitted">1. Submitted</option>
              <option value="under_review">2. AI Classified</option>
              <option value="assigned">3. Assigned</option>
              <option value="team_formed">4. Team Formed</option>
              <option value="prototype">5. Prototype</option>
              <option value="piloted">6. Field Pilot</option>
              <option value="resolved">7. Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8faf8', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--text-muted)' }}>ID</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--text-muted)' }}>Challenge Title & Category</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--text-muted)' }}>Submitter & Authority Signal</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--text-muted)' }}>District / Locality</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--text-muted)' }}>Assigned University</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--text-muted)' }}>AI Priority</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--text-muted)' }}>Status (Live Control)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: ProblemItem) => {
                const conf = statusColors[p.status] || { bg: '#eee', text: '#555', label: p.status };
                const subBadge = submitterBadges[p.submitterType as SubmitterType] || submitterBadges.individual;
                const SubIcon = subBadge.icon;
                const matchedTags: string[] =
                  p.matchedOn ||
                  p.aiRoutingResult?.suggestedInstitutionsExplained?.find(
                    (s) =>
                      !p.institution ||
                      s.institutionName.toLowerCase().includes(p.institution.toLowerCase()) ||
                      p.institution.toLowerCase().includes(s.institutionName.toLowerCase()),
                  )?.matchedOn ||
                  p.aiRoutingResult?.suggestedInstitutionsExplained?.[0]?.matchedOn ||
                  [];

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #edf2ed' }}>
                    <td style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)' }}>
                      #{p.id}
                    </td>

                    <td style={{ padding: '16px 18px', maxWidth: '320px' }}>
                      <p style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '13.5px', marginBottom: '4px', lineHeight: 1.35 }}>
                        {p.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#edf2ed',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--primary)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {p.category}
                        </span>
                      </div>

                      {/* Explainable AI routing: Matched on chip row */}
                      {matchedTags.length > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            flexWrap: 'wrap',
                            marginTop: '8px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: 'var(--text-muted)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <Sparkles size={11} color="#2e7d32" /> Matched on:
                          </span>
                          {matchedTags.map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                backgroundColor: 'rgba(46, 125, 50, 0.08)',
                                border: '1px solid rgba(46, 125, 50, 0.25)',
                                color: '#1b5e20',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                lineHeight: 1.2,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Submitter & Authority Signal Badge */}
                    <td style={{ padding: '16px 18px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          backgroundColor: subBadge.bg,
                          border: `1px solid ${subBadge.border}`,
                          color: subBadge.text,
                          fontWeight: 800,
                          fontSize: '11.5px',
                          marginBottom: '4px',
                        }}
                      >
                        <SubIcon size={14} />
                        <span>{subBadge.label}</span>
                      </div>

                      {p.organizationName && (
                        <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>
                          {p.organizationName}
                        </p>
                      )}

                      {p.registrationId && (
                        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          ID: {p.registrationId}
                        </span>
                      )}

                      {p.submitterName && !p.organizationName && (
                        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          By: {p.submitterName}
                        </p>
                      )}
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                        {p.district}
                      </span>
                      {p.village && (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {p.village}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: matchedTags.length > 0 ? '4px' : '0' }}>
                        <Building size={14} color="var(--primary)" />
                        <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '12.5px' }}>
                          {p.institution || 'AI Matching In Progress'}
                        </span>
                      </div>
                      {matchedTags.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                            Matched facility:
                          </span>
                          <span
                            style={{
                              padding: '1px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#f1f8e9',
                              color: '#2e7d32',
                              fontSize: '10px',
                              fontWeight: 700,
                              border: '1px solid #c5e1a5',
                            }}
                          >
                            {matchedTags[0]}
                          </span>
                          {matchedTags.length > 1 && (
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                              +{matchedTags.length - 1} more
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: (p.priorityScore || 80) >= 85 ? '#ffebee' : '#e8f5e9',
                            color: (p.priorityScore || 80) >= 85 ? '#c62828' : '#2e7d32',
                            fontWeight: 800,
                            fontSize: '11.5px',
                          }}
                        >
                          {(p.priorityScore || 80)}/100
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          👍 {p.upvotes}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: `1px solid ${conf.text}44`,
                          backgroundColor: conf.bg,
                          color: conf.text,
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="submitted">1. Submitted</option>
                        <option value="under_review">2. AI Classified</option>
                        <option value="assigned">3. Assigned</option>
                        <option value="team_formed">4. Team Formed</option>
                        <option value="prototype">5. Prototype</option>
                        <option value="piloted">6. Field Pilot</option>
                        <option value="resolved">7. Resolved</option>
                      </select>
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
