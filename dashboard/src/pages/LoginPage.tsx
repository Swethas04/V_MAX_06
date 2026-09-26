import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, Lock, User, RefreshCw, Sparkles, Building2 } from 'lucide-react';
import { sendOtpApi, verifyOtpApi, type UserProfile } from '../api';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSendOtp = async (inputPhone?: string) => {
    const targetPhone = inputPhone || phone.trim();
    if (!/^[6-9]\d{9}$/.test(targetPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      setPhone(targetPhone);
      const res = await sendOtpApi(targetPhone);
      setSuccessMsg(res.message || 'OTP sent successfully!');
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const nextOtp = [...otp];
    nextOtp[index] = val.slice(-1);
    setOtp(nextOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`login-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`login-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const res = await verifyOtpApi(phone, fullOtp);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#f4f7f4',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Left Branding Showcase Column */}
      <div style={{
        flex: 1.2,
        background: 'linear-gradient(135deg, #0e2414 0%, #1a6b3c 60%, #0f4826 100%)',
        color: '#ffffff',
        padding: '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(76, 175, 114, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1 }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}>
            <Building2 size={26} color="#85e3a8" />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
              SANKALP • संकल्प
            </h1>
            <p style={{ fontSize: '12px', color: '#a7d5b4', margin: '2px 0 0', fontWeight: 500 }}>
              Govt. of Jharkhand • Dept. of Higher & Technical Education
            </p>
          </div>
        </div>

        {/* Middle Hero Statement */}
        <div style={{ zIndex: 1, maxWidth: '540px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '12px',
            fontWeight: 700,
            color: '#ffd54f',
            marginBottom: '20px',
          }}>
            <Sparkles size={14} />
            <span>Smart India Hackathon 2024 • Problem Statement 26043</span>
          </div>

          <h2 style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1.25, margin: '0 0 16px', letterSpacing: '-0.5px' }}>
            Transforming Civic Challenges into University Innovation & Patents.
          </h2>

          <p style={{ fontSize: '15px', color: '#c4e2cd', lineHeight: 1.6, margin: 0 }}>
            Unified collaboration portal connecting 24 Jharkhand districts, university R&D cells, and industry CSR partners to solve grassroot societal issues.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '36px' }}>
            {[
              { val: '24', label: 'Districts Covered' },
              { val: '108+', label: 'University Teams' },
              { val: '₹42.5L', label: 'CSR Funding' },
            ].map((stat, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>{stat.val}</div>
                <div style={{ fontSize: '11px', color: '#9fcbb0', marginTop: '4px', fontWeight: 600 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div style={{ zIndex: 1, fontSize: '12px', color: '#88a690' }}>
          Secure Authentication • Multilingual Embeddings • Automated AI Routing
        </div>
      </div>

      {/* Right Login / OTP Form Column */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.07)',
          border: '1px solid var(--border)',
        }}>
          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(26, 107, 60, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <ShieldCheck size={24} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px', letterSpacing: '-0.3px' }}>
              {step === 'phone' ? 'Portal Login' : 'Enter Verification Code'}
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
              {step === 'phone'
                ? 'Sign in with your mobile number to access the command center.'
                : `We sent a 6-digit verification code to +91 ${phone}`}
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              padding: '12px 14px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '20px',
              border: '1px solid #fca5a5',
            }}>
              {error}
            </div>
          )}

          {successMsg && !error && step === 'otp' && (
            <div style={{
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              padding: '12px 14px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '20px',
              border: '1px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>{successMsg}</span>
            </div>
          )}

          {step === 'phone' ? (
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '8px',
              }}>
                Mobile Number
              </label>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid var(--border)',
                borderRadius: '14px',
                padding: '6px 14px',
                backgroundColor: '#fbfdfb',
                transition: 'border 0.2s',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  paddingRight: '12px',
                  borderRight: '1px solid #e0e6e1',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: 'var(--text-main)',
                }}>
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    padding: '10px 12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                  }}
                  autoFocus
                />
              </div>

              <button
                onClick={() => handleSendOtp()}
                disabled={isLoading}
                style={{
                  width: '100%',
                  marginTop: '22px',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(26, 107, 60, 0.28)',
                  cursor: 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={17} className="spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Demo Persona Shortcuts */}
              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '12px' }}>
                  Quick Login Demo Accounts:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {[
                    { label: 'Admin (DHTE)', phone: '9000000000', color: '#1a6b3c' },
                    { label: 'Student (IIT ISM)', phone: '9001000005', color: '#1565c0' },
                    { label: 'Citizen', phone: '9001000001', color: '#2e7d32' },
                    { label: 'Industry Partner', phone: '9001000007', color: '#ff6b35' },
                  ].map((demo) => (
                    <button
                      key={demo.phone}
                      onClick={() => handleSendOtp(demo.phone)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        backgroundColor: '#f5f8f5',
                        border: '1px solid #dce8dd',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: demo.color,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <User size={13} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {demo.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '22px', textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setStep('phone');
                    setOtp(['', '', '', '', '', '']);
                    setError(null);
                  }}
                  style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}
                >
                  ← Change Number
                </button>
              </div>

              {/* 6 OTP Input Boxes */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`login-otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    style={{
                      width: '46px',
                      height: '54px',
                      borderRadius: '12px',
                      border: '2px solid var(--border)',
                      textAlign: 'center',
                      fontSize: '22px',
                      fontWeight: 800,
                      backgroundColor: '#f9fbf9',
                      color: 'var(--text-main)',
                      outline: 'none',
                      transition: 'border 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <button
                onClick={handleVerify}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(26, 107, 60, 0.28)',
                  cursor: 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={17} className="spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <Lock size={17} />
                    <span>Verify & Access Dashboard</span>
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                  onClick={() => handleSendOtp()}
                  disabled={isLoading}
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  Didn't receive code? <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Resend</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
