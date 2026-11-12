'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, ShieldCheck, CheckCircle2, AlertCircle, QrCode, Download, Share2 } from 'lucide-react';
import { fetchApi } from '../../../lib/api';

export default function WorkerPassportPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/auth/me')
      .then((data) => setProfile(data.user))
      .catch((err) => {
        // Fallback demo user
        setProfile({
          fullName: 'Ramesh Kumar',
          badgeId: 'BC-1001',
          phoneNumber: '+91 98765 43210',
          siteLocation: 'Plant Alpha - Main Assembly',
          department: 'Heavy Assembly',
          badgeQrCodeUrl: null,
          completions: [
            {
              id: 'comp-1',
              isPassed: true,
              score: 100,
              completedAt: new Date().toISOString(),
              module: { title: 'Personal Protective Equipment (PPE) & Fall Harness' },
            },
            {
              id: 'comp-2',
              isPassed: true,
              score: 90,
              completedAt: new Date().toISOString(),
              module: { title: 'Fire Safety & The P.A.S.S. Extinguisher Method' },
            },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 max-w-lg mx-auto flex flex-col p-4 pb-12">
      {/* Header */}
      <header className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link href="/worker/dashboard" className="p-2 text-slate-600 hover:text-slate-900 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-black text-slate-800">Frontline Skill Passport</h1>
        <div className="w-8" />
      </header>

      {/* Main Passport */}
      <main className="mt-4 space-y-5">
        {/* Physical Badge Simulation Card */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-700 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                Official Safety Credential
              </span>
              <h2 className="text-xl font-black mt-2">{profile?.fullName || 'Worker Name'}</h2>
              <div className="text-xs text-blue-300 font-mono mt-0.5">{profile?.badgeId || 'BC-1001'}</div>
            </div>

            {profile?.badgeQrCodeUrl ? (
              <img
                src={profile.badgeQrCodeUrl}
                alt="Badge QR"
                className="w-16 h-16 bg-white p-1 rounded-xl shadow-md"
              />
            ) : (
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                <QrCode className="w-8 h-8 text-white/60" />
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Department</span>
              <div className="font-bold text-white text-xs">{profile?.department || 'Operations'}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Worksite</span>
              <div className="font-bold text-white text-xs">{profile?.siteLocation || 'Plant Alpha'}</div>
            </div>
          </div>
        </div>

        {/* Earned Badges & Qualifications */}
        <section className="space-y-3">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider px-1">
            Certified Safety Qualifications
          </h3>

          <div className="space-y-2.5">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  🛡️
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs leading-tight">
                    Fall Protection & PPE Level 1
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Valid for 365 Days
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                100%
              </span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  🔥
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs leading-tight">
                    Fire Safety & P.A.S.S. Method
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Certified Active
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                90%
              </span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-amber-200 bg-amber-50/30 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  🚜
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs leading-tight">
                    Forklift Pre-Shift Walkaround Check
                  </h4>
                  <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" /> Refresher Due Soon
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Renew
              </span>
            </div>
          </div>
        </section>

        {/* Action button */}
        <div className="pt-2">
          <button
            onClick={() => window.print()}
            className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Save / Print Digital Safety Passport</span>
          </button>
        </div>
      </main>
    </div>
  );
}
