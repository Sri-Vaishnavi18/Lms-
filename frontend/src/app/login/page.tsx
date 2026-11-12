'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Smartphone,
  QrCode,
  ShieldCheck,
  ArrowRight,
  HardHat,
  Tablet,
  Monitor,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { QRCameraScanner } from '../../components/QRCameraScanner';
import { AudioNarrator } from '../../components/AudioNarrator';

export default function UniversalLoginPage() {
  const router = useRouter();

  // Role selector: WORKER, SUPERVISOR, ADMIN
  const [roleTab, setRoleTab] = useState<'WORKER' | 'SUPERVISOR' | 'ADMIN'>('WORKER');

  // Worker Login state
  const [workerStep, setWorkerStep] = useState<'PHONE' | 'OTP' | 'QR_SCAN'>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('+919876543210');
  const [otp, setOtp] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);
  const [language, setLanguage] = useState('hi');

  // Supervisor state
  const [supervisorBadge, setSupervisorBadge] = useState('SUP-5001');

  // Admin state
  const [adminUsername, setAdminUsername] = useState('ADM-9001');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // Common state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Worker Auth Handlers ---
  const handleWorkerSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi('/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber }),
      });
      setDemoOtpHint(data.demoOtp || '1234');
      setWorkerStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleWorkerVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber, otp }),
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('lms_token', data.token);
        localStorage.setItem('lms_user', JSON.stringify(data.user));
      }
      router.push('/worker/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid 4-digit code. Use demo code: 1234');
    } finally {
      setLoading(false);
    }
  };

  const handleWorkerQrLogin = async (badgeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi('/auth/qr-login', {
        method: 'POST',
        body: JSON.stringify({ badgeId }),
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('lms_token', data.token);
        localStorage.setItem('lms_user', JSON.stringify(data.user));
      }
      router.push('/worker/dashboard');
    } catch (err: any) {
      setError(err.message || 'Badge authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // --- Supervisor Auth Handler ---
  const handleSupervisorLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    // Mock Supervisor session for David Miller (SUP-5001)
    const supervisorUser = {
      id: 'sup-5001',
      fullName: 'David Miller (Shift Foreman)',
      badgeId: supervisorBadge || 'SUP-5001',
      role: 'SUPERVISOR',
      department: 'Heavy Assembly & Operations',
      siteLocation: 'Plant Alpha - Main Assembly',
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('lms_token', 'demo-supervisor-jwt-token');
      localStorage.setItem('lms_user', JSON.stringify(supervisorUser));
    }

    setTimeout(() => {
      setLoading(false);
      router.push('/supervisor/dashboard');
    }, 400);
  };

  // --- Admin Auth Handler ---
  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    // Mock Admin session for Sarah Jenkins (ADM-9001)
    const adminUser = {
      id: 'adm-9001',
      fullName: 'Sarah Jenkins (EHS Lead)',
      badgeId: adminUsername || 'ADM-9001',
      role: 'ADMIN',
      department: 'Environmental Health & Safety',
      siteLocation: 'Corporate HQ & Plant Alpha',
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('lms_token', 'demo-admin-jwt-token');
      localStorage.setItem('lms_user', JSON.stringify(adminUser));
    }

    setTimeout(() => {
      setLoading(false);
      router.push('/admin/compliance');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col">
        {/* Top bar with back to home & language */}
        <div className="p-4 bg-slate-800/60 border-b border-slate-800 flex justify-between items-center text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home Portal</span>
          </Link>

          {roleTab === 'WORKER' && (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800 text-white text-xs px-2.5 py-1 rounded-lg border border-slate-700 font-bold focus:outline-none"
            >
              <option value="en">English 🇬🇧</option>
              <option value="hi">हिंदी (Hindi) 🇮🇳</option>
              <option value="ta">தமிழ் (Tamil) 🇮🇳</option>
              <option value="te">తెలుగు (Telugu) 🇮🇳</option>
              <option value="es">Español 🇪🇸</option>
            </select>
          )}
        </div>

        {/* Title Header */}
        <div className="p-6 pb-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Frontline LMS Single Sign-On
          </div>
          <h1 className="text-2xl font-black text-white">Sign In to Your Workspace</h1>
          <p className="text-xs text-slate-400 mt-1">Select your account role to continue</p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="px-6 mb-4">
          <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1.5 rounded-2xl border border-slate-700/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setRoleTab('WORKER');
                setError(null);
              }}
              className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                roleTab === 'WORKER'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>Worker</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleTab('SUPERVISOR');
                setError(null);
              }}
              className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                roleTab === 'SUPERVISOR'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-4 h-4" />
              <span>Foreman</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleTab('ADMIN');
                setError(null);
              }}
              className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                roleTab === 'ADMIN'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>EHS Admin</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mb-4 p-3 bg-red-950/50 border border-red-500/50 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* --- 1. WORKER LOGIN TAB --- */}
        {roleTab === 'WORKER' && (
          <div className="p-6 pt-0 space-y-4">
            <div className="flex justify-center">
              <AudioNarrator
                textToSpeak="कृपया अपना मोबाइल नंबर दर्ज करें या अपना कर्मचारी आईडी कार्ड स्कैन करें"
                language={language}
              />
            </div>

            {workerStep === 'PHONE' && (
              <form onSubmit={handleWorkerSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:border-blue-500 focus:outline-none text-base"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Pre-filled with demo worker Ramesh Kumar</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 text-base transition-all active:scale-[0.98]"
                >
                  <span>{loading ? 'Sending Code...' : 'Get SMS / WhatsApp OTP'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="relative my-3 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <span className="relative bg-slate-900 px-3 text-xs text-slate-500 font-bold uppercase">
                    OR
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setWorkerStep('QR_SCAN')}
                  className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  <QrCode className="w-5 h-5 text-blue-400" />
                  <span>Scan Employee QR Badge</span>
                </button>
              </form>
            )}

            {workerStep === 'OTP' && (
              <form onSubmit={handleWorkerVerifyOtp} className="space-y-4">
                <div className="text-center">
                  <span className="text-xs text-slate-400">Code sent to: {phoneNumber}</span>
                  {demoOtpHint && (
                    <div className="mt-2 p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-bold">
                      Demo Code: <span className="text-base text-emerald-400 font-black tracking-widest">{demoOtpHint}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 text-center">
                    Enter 4-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="1234"
                    className="w-full py-3.5 text-center text-3xl font-black tracking-widest bg-slate-800 border-2 border-blue-500 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-base active:scale-[0.98]"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>{loading ? 'Verifying...' : 'Verify & Enter LMS'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkerStep('PHONE')}
                  className="w-full text-center text-xs text-slate-400 hover:text-white py-1"
                >
                  ← Change Mobile Number
                </button>
              </form>
            )}

            {workerStep === 'QR_SCAN' && (
              <div className="space-y-4">
                <QRCameraScanner
                  title="Scan Worker ID Card"
                  sampleCodes={[
                    { label: 'Ramesh Kumar (Assembly): BC-1001', code: 'BC-1001' },
                    { label: 'Suresh Patel (Logistics): BC-1002', code: 'BC-1002' },
                    { label: 'Anil Verma (Manufacturing): BC-1003', code: 'BC-1003' },
                  ]}
                  onScanSuccess={handleWorkerQrLogin}
                />
                <button
                  type="button"
                  onClick={() => setWorkerStep('PHONE')}
                  className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-white font-bold border border-slate-800 rounded-xl"
                >
                  ← Back to Mobile Number
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- 2. SUPERVISOR LOGIN TAB --- */}
        {roleTab === 'SUPERVISOR' && (
          <div className="p-6 pt-0 space-y-4">
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300">
              <strong>Foreman / Shift Lead Portal:</strong> Access morning Toolbox Talk group training, 1-click crew attendance, and practical on-site sign-offs.
            </div>

            <form onSubmit={handleSupervisorLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Supervisor Badge ID / Mobile
                </label>
                <div className="relative">
                  <Tablet className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={supervisorBadge}
                    onChange={(e) => setSupervisorBadge(e.target.value)}
                    placeholder="SUP-5001"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:border-emerald-500 focus:outline-none text-base"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 text-base transition-all active:scale-[0.98]"
              >
                <span>{loading ? 'Signing in...' : 'Sign In to Crew Tablet'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => handleSupervisorLogin()}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <span>⚡ 1-Click Demo Login as Foreman David</span>
              </button>
            </form>
          </div>
        )}

        {/* --- 3. EHS ADMIN LOGIN TAB --- */}
        {roleTab === 'ADMIN' && (
          <div className="p-6 pt-0 space-y-4">
            <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-2xl text-xs text-purple-300">
              <strong>EHS & Safety Leadership:</strong> Access site-wide compliance heatmaps, machine QR generator, and OSHA-compliant PDF audit reports.
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Admin ID / Email
                </label>
                <div className="relative">
                  <Monitor className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="ADM-9001"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:border-purple-500 focus:outline-none text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:border-purple-500 focus:outline-none text-base"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 text-base transition-all active:scale-[0.98]"
              >
                <span>{loading ? 'Signing in...' : 'Sign In to Admin Portal'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => handleAdminLogin()}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-purple-500/40 text-purple-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <span>⚡ 1-Click Demo Login as EHS Lead Sarah</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
        <p>Works offline in signal dead zones • Touch targets optimized for work gloves</p>
        <p className="text-[11px] text-slate-600">Frontline LMS v2.0 • Secure Role-Based Access Control</p>
      </div>
    </div>
  );
}

