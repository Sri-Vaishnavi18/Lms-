'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, QrCode, ArrowRight, ShieldCheck } from 'lucide-react';
import { fetchApi } from '../../../lib/api';
import { QRCameraScanner } from '../../../components/QRCameraScanner';
import { AudioNarrator } from '../../../components/AudioNarrator';

export default function WorkerLoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('+919876543210'); // Default demo phone
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'QR_SCAN'>('PHONE');
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState('hi');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi('/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber }),
      });
      setDemoOtpHint(data.demoOtp || '1234');
      setStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
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
        body: JSON.stringify({ phoneNumber, otp }),
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('lms_token', data.token);
        localStorage.setItem('lms_user', JSON.stringify(data.user));
      }
      router.push('/worker/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleQrLogin = async (decodedBadgeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi('/auth/qr-login', {
        method: 'POST',
        body: JSON.stringify({ badgeId: decodedBadgeId }),
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('lms_token', data.token);
        localStorage.setItem('lms_user', JSON.stringify(data.user));
      }
      router.push('/worker/dashboard');
    } catch (err: any) {
      setError(err.message || 'QR Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-800 text-white p-6 text-center relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs bg-blue-700/60 px-3 py-1 rounded-full text-blue-200 font-semibold">
              Worker Mobile Login
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-blue-900/80 text-white text-xs px-2.5 py-1 rounded-lg border border-blue-600 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="es">Español</option>
            </select>
          </div>

          <h1 className="text-2xl font-black mb-1">Frontline Safety Pass</h1>
          <p className="text-blue-200 text-xs">Enter your mobile number or scan your badge</p>

          <div className="mt-3 flex justify-center">
            <AudioNarrator
              textToSpeak="कृपया अपना मोबाइल नंबर दर्ज करें या अपना कर्मचारी आईडी कार्ड स्कैन करें"
              language={language}
            />
          </div>
        </div>

        {/* Content body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {step === 'PHONE' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <Smartphone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Pre-filled with seeded demo worker (Ramesh)</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-700 text-white font-black rounded-xl hover:bg-blue-800 transition-colors shadow-md flex items-center justify-center gap-2 text-base"
              >
                <span>{loading ? 'Sending Code...' : 'Send Verification OTP'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-xs text-slate-500 font-bold">OR</span>
              </div>

              <button
                type="button"
                onClick={() => setStep('QR_SCAN')}
                className="w-full py-3.5 bg-slate-50 hover:bg-blue-50 border-2 border-slate-300 hover:border-blue-400 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <QrCode className="w-5 h-5 text-blue-700" />
                <span>Scan Employee QR Badge</span>
              </button>
            </form>
          )}

          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <span className="text-xs text-slate-500">Code sent to: {phoneNumber}</span>
                {demoOtpHint && (
                  <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
                    Demo Code: <span className="text-base text-emerald-950 font-black tracking-widest">{demoOtpHint}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
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
                  className="w-full py-3 text-center text-3xl font-black tracking-widest bg-slate-50 border-2 border-blue-600 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 text-base"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{loading ? 'Verifying...' : 'Verify & Enter LMS'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 py-1"
              >
                ← Change Phone Number
              </button>
            </form>
          )}

          {step === 'QR_SCAN' && (
            <div className="space-y-4">
              <QRCameraScanner
                title="Scan Worker ID Card"
                sampleCodes={[
                  { label: 'Ramesh Kumar (Heavy Assembly): BC-1001', code: 'BC-1001' },
                  { label: 'Suresh Patel (Warehouse): BC-1002', code: 'BC-1002' },
                ]}
                onScanSuccess={handleQrLogin}
              />
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="w-full py-2.5 text-center text-xs text-slate-600 font-bold hover:text-slate-900 border border-slate-200 rounded-lg"
              >
                ← Back to Phone Number
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
