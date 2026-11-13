'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Tablet,
  Users,
  CheckCircle2,
  AlertCircle,
  PlaySquare,
  PenTool,
  ShieldCheck,
  RefreshCw,
  Clock,
  ArrowRight,
  ChevronRight,
  HardHat,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { fetchApi } from '../../../lib/api';

export default function SupervisorDashboardPage() {
  const [crewData, setCrewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCrew();
  }, []);

  const loadCrew = () => {
    setLoading(true);
    fetchApi('/supervisor/crew')
      .then((data) => setCrewData(data))
      .catch((err) => console.error('Error fetching crew:', err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      {/* Top Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black border border-emerald-200">
              <Tablet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black text-emerald-700 tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Supervisor Operations Portal
                </span>
                <span className="text-xs text-slate-400">• Plant Alpha Shift #1</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">Shift Crew Roster & Practical Verification</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/supervisor/toolbox"
              className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <PlaySquare className="w-4 h-4" />
              <span>Conduct Morning Toolbox Talk</span>
            </Link>

            <Link
              href="/supervisor/practical"
              className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 flex items-center gap-2 shadow-xs transition-colors"
            >
              <PenTool className="w-4 h-4 text-slate-600" />
              <span>Practical Field Sign-off</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Active Crew on Shift</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{crewData?.totalCrew ?? 9} Workers</div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Logged on Site</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase">Shift Safety Certified</span>
              <div className="text-3xl font-black text-emerald-800 mt-1">
                {crewData?.certifiedCrew ?? 7} Workers
              </div>
              <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">Ready for Hazardous Machinery</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase">Training / Practical Pending</span>
              <div className="text-3xl font-black text-amber-900 mt-1">{crewData?.pendingCrew ?? 2} Workers</div>
              <span className="text-[10px] text-amber-600 font-bold mt-0.5 block">Requires 2-min SOP Refresher</span>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Crew Roster Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">Shift Roster & Real-Time Clearance Status</h2>
              <p className="text-xs text-slate-500">
                Direct verification against mobile video bites, spot-the-hazard exam results, and attendance records
              </p>
            </div>
            <button
              onClick={loadCrew}
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Roster</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-4">Worker Name</th>
                  <th className="p-4">Badge ID</th>
                  <th className="p-4">Sector / Trade</th>
                  <th className="p-4">Skill Tier</th>
                  <th className="p-4">Safety Modules</th>
                  <th className="p-4">Practical Check-Off</th>
                  <th className="p-4">Shift Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {crewData?.roster?.map((w: any) => (
                  <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{w.fullName}</td>
                    <td className="p-4 font-mono text-slate-600">{w.badgeId}</td>
                    <td className="p-4 text-slate-600">
                      <span className="font-bold text-slate-800">{w.sector?.replace(/_/g, ' ') || w.department}</span>
                      {w.trade && <span className="text-[10px] text-slate-400 block">{w.trade}</span>}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-700 border border-slate-200">
                        {w.skillTier || 'SEMI_SKILLED'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800">
                        {w.passedModulesCount} / {w.totalModulesCount || 5}
                      </span>
                    </td>
                    <td className="p-4">
                      {w.hasPassedPractical ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Pending Sign-off</span>
                      )}
                    </td>
                    <td className="p-4">
                      {w.isFullyCertified ? (
                        <span className="bg-emerald-600 text-white font-black px-2.5 py-1 rounded-full text-[10px]">
                          CLEARED FOR SHIFT
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full text-[10px]">
                          TRAINING REQUIRED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
