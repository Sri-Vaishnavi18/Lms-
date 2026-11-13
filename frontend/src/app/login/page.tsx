'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HardHat,
  Lock,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Users,
  Radio,
  Award,
} from 'lucide-react';
import { fetchApi } from '../../lib/api';

export default function UnifiedLoginPage() {
  const router = useRouter();

  // Mode: 'PASSWORD' | 'OTP'
  const [authMode, setAuthMode] = useState<'PASSWORD' | 'OTP'>('PASSWORD');

  // Form states
  const [identifier, setIdentifier] = useState('ADM-9001'); // Phone or Badge ID
  const [password, setPassword] = useState('admin123');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1-Click Demo Profiles
  const setDemoProfile = (role: 'WORKER' | 'SUPERVISOR' | 'ADMIN') => {
    setError(null);
    if (role === 'WORKER') {
      setIdentifier('+919876543210');
      setPassword('1234');
    } else if (role === 'SUPERVISOR') {
      setIdentifier('SUP-5001');
      setPassword('1234');
    } else {
      setIdentifier('ADM-9001');
      setPassword('admin123');
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await fetchApi('/auth/password-login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('lms_token', data.token);
        localStorage.setItem('lms_user', JSON.stringify(data.user));
      }

      if (data.user.role === 'ADMIN') {
        router.push('/admin/users');
      } else if (data.user.role === 'SUPERVISOR') {
        router.push('/supervisor/dashboard');
      } else {
        router.push('/worker/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid username or password. Check demo credentials below.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await fetchApi('/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber: identifier }),
      });
      setDemoOtpHint(data.demoOtp || '1234');
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await fetchApi('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber: identifier, otp }),
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Container */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Left Column: Brand Hero & Highlights */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-8 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-black">
                <HardHat className="w-6 h-6 text-amber-300" />
              </div>
              <span className="font-black text-2xl text-white tracking-tight">LMS 360</span>
            </Link>

            <div>
              <h1 className="text-2xl font-black text-white leading-tight">
                Single Sign-On for Frontline, Supervisors & Admins
              </h1>
              <p className="mt-2 text-xs text-blue-100 leading-relaxed">
                One unified portal for vocational microlearning, live masterclasses, and certified practical skill passports.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-blue-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600/60 flex items-center justify-center text-amber-300">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>7 Core Industrial Workforce Sectors</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600/60 flex items-center justify-center text-emerald-300">
                  <Radio className="w-4 h-4" />
                </div>
                <span>Live Streaming & 2-Minute Video SOPs</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600/60 flex items-center justify-center text-purple-300">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>11 Indian Native Languages with Audio</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-blue-600/50 text-[11px] text-blue-200">
            Aligned with National Skill Standards • Secure Role-Based Access Control
          </div>
        </div>

        {/* Right Column: Sign In Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900">Sign In to LMS 360</h2>
                <p className="text-xs text-slate-500 mt-0.5">Select login method or click a demo account below</p>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('PASSWORD');
                    setError(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    authMode === 'PASSWORD' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('OTP');
                    setError(null);
                    setIdentifier('+919876543210');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    authMode === 'OTP' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Mobile OTP
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1-Click Demo Account Quick Fill */}
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                1-Click Demo Accounts:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDemoProfile('ADMIN')}
                  className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                    identifier === 'ADM-9001'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  🛡️ Admin
                </button>
                <button
                  type="button"
                  onClick={() => setDemoProfile('SUPERVISOR')}
                  className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                    identifier === 'SUP-5001'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  📋 Supervisor
                </button>
                <button
                  type="button"
                  onClick={() => setDemoProfile('WORKER')}
                  className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                    identifier === '+919876543210'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  👷 Worker
                </button>
              </div>
            </div>

            {/* Form Mode 1: Password Login */}
            {authMode === 'PASSWORD' && (
              <form onSubmit={handlePasswordLogin} className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Badge ID or Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. ADM-9001 or +919876543210"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password or Security PIN</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Enter password (e.g. admin123 or 1234)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In with Password →'}</span>
                </button>
              </form>
            )}

            {/* Form Mode 2: Mobile OTP Login */}
            {authMode === 'OTP' && (
              <div className="mt-5 space-y-4 text-xs">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile Phone Number</label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="+919876543210"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <span>{loading ? 'Sending Code...' : 'Get 4-Digit SMS / WhatsApp Code →'}</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="text-center">
                      <span className="text-slate-500">Code sent to: {identifier}</span>
                      {demoOtpHint && (
                        <div className="mt-1 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-bold">
                          Demo OTP: <span className="font-mono text-base font-black text-emerald-600">{demoOtpHint}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-center">
                        Enter 4-Digit Code
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="1 2 3 4"
                        className="w-full py-3 text-center tracking-[1em] text-2xl font-black bg-slate-50 border-2 border-blue-500 rounded-xl text-slate-900 focus:outline-none"
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <span>{loading ? 'Verifying...' : 'Verify Code & Sign In →'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-full text-center text-xs text-slate-500 hover:text-slate-800"
                    >
                      ← Change Mobile Number
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Bottom Switcher */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">New to LMS 360?</span>
            <Link
              href="/signup"
              className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Create an Account (Sign Up)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
