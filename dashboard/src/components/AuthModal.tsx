import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, Lock, User, RefreshCw, X } from 'lucide-react';
import { sendOtpApi, verifyOtpApi, type UserProfile } from '../api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

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

    // Auto-focus next box
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
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
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(14, 36, 20, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        position: 'relative',
        animation: 'fadeIn 0.2s ease-out',
      }}>
        {/* Header gradient banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1a6b3c 0%, #0f4826 100%)',
          padding: '24px 24px 20px',
          color: '#ffffff',
          position: 'relative',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShieldCheck size={22} color="#85e3a8" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                {step === 'phone' ? 'Portal Authentication' : 'Verify Mobile OTP'}
              </h3>
              <p style={{ fontSize: '12px', color: '#b9dbc2', margin: 0 }}>
                Govt. of Jharkhand • SANKALP
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: 600,
              marginBottom: '18px',
              border: '1px solid #fca5a5',
            }}>
              {error}
            </div>
          )}

          {successMsg && !error && step === 'otp' && (
            <div style={{
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: 600,
              marginBottom: '18px',
              border: '1px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
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
                Enter Mobile Number
              </label>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                padding: '6px 12px',
                backgroundColor: '#fbfdfb',
                transition: 'border 0.2s',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  paddingRight: '10px',
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
                    padding: '8px 12px',
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
                  marginTop: '20px',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(26, 107, 60, 0.25)',
                  transition: 'background 0.2s',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className="spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              {/* Quick Select Demo Roles */}
              <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '10px' }}>
                  Quick Login as Demo Persona:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
                        padding: '6px 10px',
                        borderRadius: '16px',
                        backgroundColor: '#f3f7f4',
                        border: '1px solid #d5e5d8',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: demo.color,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <User size={12} />
                      <span>{demo.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 4px' }}>
                  Code sent to <strong style={{ color: 'var(--text-main)' }}>+91 {phone}</strong>
                </p>
                <button
                  onClick={() => {
                    setStep('phone');
                    setOtp(['', '', '', '', '', '']);
                    setError(null);
                  }}
                  style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}
                >
                  Change Number
                </button>
              </div>

              {/* 6 OTP Input Boxes */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    style={{
                      width: '46px',
                      height: '52px',
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
                  fontSize: '14.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(26, 107, 60, 0.25)',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className="spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Verify & Login</span>
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  onClick={() => handleSendOtp()}
                  disabled={isLoading}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
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
