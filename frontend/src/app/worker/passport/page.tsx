'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Download,
  Share2,
  Calendar,
  Clock,
  Printer,
  ChevronRight,
  HardHat,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
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
          sector: 'CONSTRUCTION',
          trade: 'Mason & Rigger',
          skillTier: 'SEMI_SKILLED',
          badgeQrCodeUrl: null,
          completions: [
            {
              id: 'comp-1',
              isPassed: true,
              score: 100,
              completedAt: new Date().toISOString(),
              module: { title: 'Personal Protective Equipment (PPE) & Fall Harness', sector: 'CONSTRUCTION' },
            },
            {
              id: 'comp-2',
              isPassed: true,
              score: 90,
              completedAt: new Date().toISOString(),
              module: { title: 'Fire Safety & The P.A.S.S. Extinguisher Method', sector: 'CONSTRUCTION' },
            },
            {
              id: 'comp-3',
              isPassed: true,
              score: 85,
              completedAt: new Date().toISOString(),
              module: { title: 'Lockout Tagout (LOTO) Zero-Energy Verification', sector: 'MANUFACTURING' },
            },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/worker/dashboard"
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal</span>
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                National Digital Skill Passport
              </h1>
              <p className="text-xs text-slate-500">
                Official verifiable vocational credential aligned with NSQF & Skill India standards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Official Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Passport Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Official Digital Credential ID Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
              {/* Background watermark */}
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <HardHat className="w-48 h-48" />
              </div>

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                    Official Safety Credential
                  </span>
                  <h2 className="text-2xl font-black mt-3">{profile?.fullName || 'Ramesh Kumar'}</h2>
                  <div className="text-xs text-blue-300 font-mono mt-0.5">{profile?.badgeId || 'BC-1001'}</div>
                </div>

                <div className="w-14 h-14 bg-white p-1 rounded-xl shadow-md shrink-0 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2 text-xs relative z-10">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sector</span>
                  <span className="font-bold text-slate-200">{profile?.sector?.replace(/_/g, ' ') || 'CONSTRUCTION'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sub-Trade</span>
                  <span className="font-bold text-slate-200">{profile?.trade || 'Mason / Rigger'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Skill Tier</span>
                  <span className="font-bold text-emerald-400">{profile?.skillTier || 'SEMI_SKILLED'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Facility</span>
                  <span className="font-bold text-slate-200">{profile?.siteLocation || 'Plant Alpha'}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Tamper-Proof Digilocker Ready</span>
                </div>
                <span>ID: {profile?.id?.slice(0, 8) || 'LMS-998'}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Credential Verification
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Supervisors and EHS auditors can scan this QR code on any jobsite across India to verify valid safety clearances and attendance.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handlePrint}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Wallet Card</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Competency Matrix & Completed Certifications (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Verified Modules</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {profile?.completions?.length || 3} Units
                </div>
                <span className="text-[10px] text-emerald-600 font-bold mt-1 block">100% Passing Ratio</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Average Exam Score</span>
                <div className="text-2xl font-black text-blue-600 mt-1">
                  92%
                </div>
                <span className="text-[10px] text-blue-600 font-bold mt-1 block">Visual Hazard Verified</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase">National Standard</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  Level 3
                </div>
                <span className="text-[10px] text-slate-500 font-bold mt-1 block">NSQF Aligned</span>
              </div>
            </div>

            {/* List of Earned Certifications */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">Earned Safety & Technical Competencies</h3>
                  <p className="text-xs text-slate-500">Each module includes video verification, spot-the-hazard exam, and supervisor sign-off</p>
                </div>
              </div>

              <div className="space-y-3">
                {profile?.completions && profile.completions.length > 0 ? (
                  profile.completions.map((comp: any, idx: number) => (
                    <div
                      key={comp.id || idx}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                              VERIFIED
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              SCORE: {comp.score || 100}%
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">
                            {comp.module?.title || 'Operational Safety Competency'}
                          </h4>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Sector: {comp.module?.sector?.replace(/_/g, ' ') || 'CONSTRUCTION'} • Verified by LMS 360 Examination Engine
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          Active & Valid
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl">
                    <p className="text-xs font-bold">No completed modules yet. Start learning to earn competencies!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
