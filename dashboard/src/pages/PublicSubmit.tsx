import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  MapPin,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Info,
  Send,
  User,
  Shield,
  Crown,
  Users,
  Sparkles,
  Volume2,
  FileText,
  X,
  ArrowRight,
  ThumbsUp,
  RotateCw,
} from 'lucide-react';
import {
  checkSimilarApi,
  submitProblemApi,
  supportProblemApi,
} from '../api';
import type { SubmitterType } from '../api';

const JHARKHAND_DISTRICTS = [
  'Ranchi',
  'Dhanbad',
  'Bokaro',
  'East Singhbhum (Jamshedpur)',
  'West Singhbhum',
  'Hazaribagh',
  'Deoghar',
  'Dumka',
  'Giridih',
  'Ramgarh',
  'Palamu',
  'Garhwa',
  'Koderma',
  'Latehar',
  'Lohardaga',
  'Pakur',
  'Sahebganj',
  'Seraikela Kharsawan',
  'Simdega',
  'Khunti',
  'Jamtara',
  'Godda',
  'Chatra',
  'Gumla',
];

const CATEGORIES = [
  { key: 'water', label: '💧 Water Supply & Sanitation' },
  { key: 'roads', label: '🛣️ Roads & Rural Bridges' },
  { key: 'agriculture', label: '🌾 Agriculture & Irrigation' },
  { key: 'healthcare', label: '🏥 Healthcare & PHC Facilities' },
  { key: 'education', label: '📚 School & Educational Infra' },
  { key: 'environment', label: '🌿 Pollution & Environment' },
  { key: 'urban_infra', label: '⚡ Electricity & Urban Services' },
  { key: 'accessibility', label: '♿ Divyang Accessibility' },
  { key: 'livelihood', label: '💼 Rural Livelihoods & SHGs' },
  { key: 'other', label: '📌 Other Societal Challenge' },
];

const SUBMITTER_TYPES: {
  type: SubmitterType;
  label: string;
  badge: string;
  icon: any;
  desc: string;
  color: string;
  borderColor: string;
}[] = [
  {
    type: 'individual',
    label: 'Citizen / Individual',
    badge: 'Direct Citizen Report',
    icon: User,
    desc: 'No login required. Submit any public issue in your village or ward.',
    color: '#2e7d32',
    borderColor: '#c8e6c9',
  },
  {
    type: 'pri',
    label: 'Panchayati Raj (PRI)',
    badge: 'Official Panchayat Filing',
    icon: Crown,
    desc: 'Gram Panchayat, Mukhiya, Panchayat Samiti or Zilla Parishad official submission.',
    color: '#e65100',
    borderColor: '#ffe0b2',
  },
  {
    type: 'ulb',
    label: 'Urban Local Body (ULB)',
    badge: 'Municipal Resolution',
    icon: Building2,
    desc: 'Nagar Nigam, Municipality, Ward Councilor or Municipal Engineer.',
    color: '#6a1b9a',
    borderColor: '#e1bee7',
  },
  {
    type: 'govt_department',
    label: 'Govt Department',
    badge: 'Inter-Agency Referral',
    icon: Shield,
    desc: 'District Line Department (PHED, Health, Agriculture, PWD, Electricity).',
    color: '#00838f',
    borderColor: '#b2ebf2',
  },
  {
    type: 'community_org',
    label: 'Community Org / SHG',
    badge: 'Civil Society & SHG',
    icon: Users,
    desc: 'Women Self Help Groups (SHG), Farmer Producer Organizations (FPO) or NGOs.',
    color: '#1565c0',
    borderColor: '#bbdefb',
  },
];

export const PublicSubmit: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  // Form State
  const [submitterType, setSubmitterType] = useState<SubmitterType>('individual');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('water');
  const [district, setDistrict] = useState('Ranchi');
  const [village, setVillage] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterPhone, setSubmitterPhone] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Files
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Similar Problems AI check
  const [isCheckingSimilar, setIsCheckingSimilar] = useState(false);
  const [similarProblems, setSimilarProblems] = useState<any[]>([]);
  const [aiPredictedCategory, setAiPredictedCategory] = useState<string | null>(null);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);

  // Submitting
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Voice to existing confirmation
  const [supportingProblemId, setSupportingProblemId] = useState<string | null>(null);

  // Debounced AI Duplicate & Category Detection
  useEffect(() => {
    if (title.trim().length < 4 && description.trim().length < 8) {
      setSimilarProblems([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingSimilar(true);
      try {
        const res = await checkSimilarApi({
          title: title.trim(),
          description: description.trim() || undefined,
          latitude: latitude || undefined,
          longitude: longitude || undefined,
          district,
          threshold: 0.75,
        });

        setSimilarProblems(res.similarProblems || []);
        if (res.predictedCategory) {
          setAiPredictedCategory(res.predictedCategory);
          setAiConfidence(res.confidence || 0.85);
          // If default category not changed, auto-suggest
          if (category === 'water') {
            setCategory(res.predictedCategory);
          }
        }
      } catch {
        // graceful ignore
      } finally {
        setIsCheckingSimilar(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [title, description, district, latitude, longitude]);

  // Browser Geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Detecting GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setIsLocating(false);
        setLocationStatus(`📍 GPS Pin: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
      },
      () => {
        setIsLocating(false);
        // Fallback to Ranchi center
        setLatitude(23.3441);
        setLongitude(85.3096);
        setLocationStatus('📍 Default District Coordinates (Ranchi center applied)');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setMediaFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Add Voice to Existing Problem
  const handleSupportExisting = async (prob: any) => {
    setSupportingProblemId(prob.id);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (description) formData.append('message', description);
      mediaFiles.forEach((file) => formData.append('files', file));

      await supportProblemApi(prob.id, formData);
      setSubmitSuccess({
        type: 'support',
        title: prob.title,
        problemId: prob.id,
        message: 'Your voice and supporting evidence have been successfully added to this existing challenge!',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to attach voice.');
    } finally {
      setIsSubmitting(false);
      setSupportingProblemId(null);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide a challenge title.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setErrorMessage('Please provide a detailed description (minimum 10 characters).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('submitterType', submitterType);
      formData.append('district', district);
      if (village) formData.append('village', village.trim());
      if (organizationName) formData.append('organizationName', organizationName.trim());
      if (registrationId) formData.append('registrationId', registrationId.trim());
      if (submitterName) formData.append('submitterName', submitterName.trim());
      if (submitterPhone) formData.append('submitterPhone', submitterPhone.trim());
      if (latitude != null) formData.append('latitude', latitude.toString());
      if (longitude != null) formData.append('longitude', longitude.toString());

      mediaFiles.forEach((file) => formData.append('files', file));

      const res = await submitProblemApi(formData);
      setSubmitSuccess({
        type: 'new',
        title: res.title || title,
        problemId: res.id || 'NEW-' + Math.floor(1000 + Math.random() * 9000),
        category: res.category || category,
        priorityScore: res.priorityScore || 85,
        message: 'Challenge submitted successfully! AI is routing it to university R&D teams.',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setCategory('water');
    setVillage('');
    setOrganizationName('');
    setRegistrationId('');
    setSubmitterName('');
    setSubmitterPhone('');
    setMediaFiles([]);
    setLatitude(null);
    setLongitude(null);
    setLocationStatus(null);
    setSimilarProblems([]);
    setSubmitSuccess(null);
    setErrorMessage(null);
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1080px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1b5e20 0%, #0d3814 100%)',
          borderRadius: '20px',
          padding: '32px 28px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: '0 10px 30px rgba(27, 94, 32, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11.5px',
                fontWeight: 700,
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
              }}
            >
              Public Intake Channel • नो लॉगिन आवश्यक
            </span>
            <span
              style={{
                backgroundColor: '#ffd54f',
                color: '#332200',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 800,
              }}
            >
              ✨ AI-Powered Routing
            </span>
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.4px', marginBottom: '8px' }}>
            Report a Societal Challenge in Jharkhand
          </h2>
          <p style={{ fontSize: '14px', color: '#c8e6c9', maxWidth: '720px', lineHeight: 1.5 }}>
            Citizens, Gram Panchayats, Municipal Bodies, and Community Organizations can file civic challenges directly.
            Our embedding AI instantly matches issues to university engineering labs & CSR partners for ground prototypes.
          </p>
        </div>
      </div>

      {/* Success Modal / Card */}
      {submitSuccess && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '36px 32px',
            border: '2px solid #81c784',
            boxShadow: '0 12px 36px rgba(46, 125, 50, 0.15)',
            marginBottom: '32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#e8f5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <CheckCircle2 size={36} color="#2e7d32" />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
            {submitSuccess.type === 'support' ? 'Voice Added to Existing Challenge!' : 'Challenge Successfully Registered!'}
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {submitSuccess.message}
          </p>

          <div
            style={{
              backgroundColor: '#f8faf8',
              borderRadius: '12px',
              padding: '16px',
              maxWidth: '520px',
              margin: '0 auto 24px',
              border: '1px solid var(--border)',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tracking Reference:</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>
                #{submitSuccess.problemId.slice(0, 12)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Title:</span>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)', textAlign: 'right', maxWidth: '300px' }}>
                {submitSuccess.title}
              </span>
            </div>
            {submitSuccess.category && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AI Detected Theme:</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#e65100', textTransform: 'uppercase' }}>
                  {submitSuccess.category}
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                backgroundColor: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Submit Another Challenge
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate('registry')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                View in Registry <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Submission Form */}
      {!submitSuccess && (
        <form onSubmit={handleSubmit}>
          {/* STEP 1: SUBMITTER TYPE SELECTOR */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              padding: '24px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                1
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                Who is filing this challenge? (Submitter Category)
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '18px', marginLeft: '32px' }}>
              Select the appropriate entity. PRIs and ULBs provide official resolution signals with elevated routing priority.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              {SUBMITTER_TYPES.map((st) => {
                const Icon = st.icon;
                const isSelected = submitterType === st.type;
                return (
                  <div
                    key={st.type}
                    onClick={() => setSubmitterType(st.type)}
                    style={{
                      border: `2px solid ${isSelected ? st.color : 'var(--border)'}`,
                      borderRadius: '14px',
                      padding: '16px',
                      backgroundColor: isSelected ? `${st.borderColor}40` : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: `${st.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={18} color={st.color} />
                      </div>
                      {isSelected && (
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: st.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CheckCircle2 size={13} color="#fff" />
                        </div>
                      )}
                    </div>
                    <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                      {st.label}
                    </h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Non-Individual Institutional Metadata Fields */}
            {submitterType !== 'individual' && (
              <div
                style={{
                  marginTop: '18px',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: '#f8faf8',
                  border: '1px solid var(--border)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    Organization / Panchayat / Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      submitterType === 'pri'
                        ? 'e.g. Chandankiyari Gram Panchayat'
                        : submitterType === 'ulb'
                        ? 'e.g. Ranchi Municipal Corporation (Ward 14)'
                        : 'e.g. Drinking Water & Sanitation Dept (PHED)'
                    }
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    Registration Code / Ward / Panchayat ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JH-PRI-BOK-042 or NGO Reg #1209"
                    value={registrationId}
                    onChange={(e) => setRegistrationId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: PROBLEM DETAILS */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              padding: '24px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                2
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                Challenge Details & Description
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '18px', marginLeft: '32px' }}>
              Provide clear specifics. As you type, the AI scans existing submissions across Jharkhand to prevent duplication.
            </p>

            {/* Title Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Challenge Title / समस्या का शीर्षक *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Arsenic contamination in drinking water borewells in Chandankiyari village"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              />
            </div>

            {/* Category Dropdown */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700 }}>
                  Problem Category / विषय क्षेत्र *
                </label>
                {aiPredictedCategory && (
                  <span style={{ fontSize: '11px', color: '#e65100', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} /> AI Suggestion: {aiPredictedCategory} ({Math.round((aiConfidence || 0.85) * 100)}% conf)
                  </span>
                )}
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  backgroundColor: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 600,
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Area */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Detailed Description / विस्तृत विवरण *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Explain the background: what is failing, how many households/villagers are affected, how long has this issue persisted, and any previous attempts..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                  resize: 'vertical',
                }}
              />
            </div>

            {/* AI Real-time Duplicate Banner */}
            {isCheckingSimilar && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#f0f7f2', marginBottom: '16px' }}>
                <RotateCw size={14} className="animate-spin" color="var(--primary)" />
                <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
                  AI scanning semantic vectors for similar reports in {district}...
                </span>
              </div>
            )}

            {similarProblems.length > 0 && (
              <div
                style={{
                  backgroundColor: '#fff9e6',
                  border: '1.5px solid #ffe082',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={18} color="#e65100" />
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#e65100' }}>
                    {similarProblems.length} Similar Challenge{similarProblems.length > 1 ? 's' : ''} Found Nearby — Is this the same issue?
                  </h4>
                </div>
                <p style={{ fontSize: '12px', color: '#5d4037', marginBottom: '14px', lineHeight: 1.4 }}>
                  An identical challenge is already active in your area. You can add your voice to the existing filing to boost its priority score and attach evidence without creating duplicate records.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {similarProblems.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        border: '1px solid #ffecb3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                            {p.title}
                          </span>
                          {p.similarity && (
                            <span
                              style={{
                                backgroundColor: '#e8f5e9',
                                color: '#2e7d32',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 800,
                              }}
                            >
                              {Math.round(p.similarity * 100)}% MATCH
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <span>📍 {p.district || district}</span>
                          <span>👍 {p.upvotes || 0} supporters</span>
                          <span>Status: {p.status}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSupportExisting(p)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          backgroundColor: '#1b5e20',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '12px',
                          border: 'none',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          opacity: isSubmitting ? 0.7 : 1,
                        }}
                      >
                        {supportingProblemId === p.id ? (
                          <>
                            <RotateCw size={14} className="animate-spin" /> Attaching...
                          </>
                        ) : (
                          <>
                            <ThumbsUp size={14} /> Add My Voice to This
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: LOCATION & GEO-TAGGING */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              padding: '24px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                3
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                Geographic Location & Village / Ward
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '18px', marginLeft: '32px' }}>
              Pinpoints challenge coordinates for PostGIS proximity queries and GIS cluster maps.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Jharkhand District / जिला *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Village / Ward / Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ward 4, Chandankiyari Basti near Primary School"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '13px',
                  }}
                />
              </div>
            </div>

            {/* GPS Detection Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--primary)',
                  backgroundColor: '#edf7ef',
                  color: 'var(--primary)',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <MapPin size={15} />
                {isLocating ? 'Detecting GPS...' : '📍 Auto-Detect GPS Coordinates'}
              </button>

              {locationStatus && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {locationStatus}
                </span>
              )}
            </div>
          </div>

          {/* STEP 4: MEDIA & EVIDENCE UPLOADS */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              padding: '24px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                4
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                Evidence Attachments (Photos, Voice Notes, Documents)
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '18px', marginLeft: '32px' }}>
              Attach field photos or lab reports to accelerate engineering assignment.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,audio/*,application/pdf"
              style={{ display: 'none' }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border)',
                borderRadius: '14px',
                padding: '24px',
                textAlign: 'center',
                backgroundColor: '#fafcfa',
                cursor: 'pointer',
                marginBottom: '14px',
                transition: 'border 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <Upload size={28} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Click to browse files or drag and drop
              </p>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Supports JPG, PNG, MP3/WAV Audio Voice Notes, and PDF documents (Max 10MB each)
              </p>
            </div>

            {mediaFiles.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {mediaFiles.map((file, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#edf2ed',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {file.type.startsWith('audio') ? (
                      <Volume2 size={14} color="var(--primary)" />
                    ) : (
                      <FileText size={14} color="var(--primary)" />
                    )}
                    <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <X size={14} color="#888" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STEP 5: OPTIONAL CONTACT DETAILS */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                5
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                Submitter Contact Information (Optional)
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '18px', marginLeft: '32px' }}>
              Used strictly for SMS progress notifications when a university team begins prototype testing.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Your Name / संपर्ककर्ता का नाम
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar Mahto"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Mobile Number / मोबाइल नंबर
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={submitterPhone}
                  onChange={(e) => setSubmitterPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '13px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div
              style={{
                backgroundColor: '#ffebee',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#c62828',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Info size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              🔒 Submissions are protected under Govt of Jharkhand Data Governance Guidelines.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '15px',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(46, 148, 85, 0.3)',
                transition: 'transform 0.15s ease',
              }}
            >
              {isSubmitting ? (
                <>
                  <RotateCw size={18} className="animate-spin" /> Submitting to AI Engine...
                </>
              ) : (
                <>
                  <Send size={18} /> Submit Challenge to DHTE →
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
