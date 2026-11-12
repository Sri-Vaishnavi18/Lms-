'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tablet, Users, CheckCircle2, AlertCircle, PlaySquare, PenTool, ShieldCheck, RefreshCw } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header */}
        <header className="bg-emerald-900 text-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700/80 text-white flex items-center justify-center">
              <Tablet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-black text-emerald-300 tracking-wider">
                Shift Supervisor Tablet Portal
              </span>
              <h1 className="text-2xl font-black">Morning Shift Operations</h1>
              <p className="text-xs text-emerald-200">Plant Alpha • Shift Lead: David Miller</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/supervisor/toolbox"
              className="py-3 px-5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md"
            >
              <PlaySquare className="w-4 h-4 fill-slate-950 text-amber-400" />
              <span>Start Toolbox Talk (Group Mode)</span>
            </Link>

            <Link
              href="/supervisor/practical"
              className="py-3 px-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 flex items-center gap-2"
            >
              <PenTool className="w-4 h-4" />
              <span>Practical Audit</span>
            </Link>
          </div>
        </header>

        {/* Shift Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Active Crew on Shift</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{crewData?.totalCrew ?? 3} Workers</div>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase">Shift Safety Certified</span>
              <div className="text-3xl font-black text-emerald-900 mt-1">
                {crewData?.certifiedCrew ?? 1} Workers
              </div>
            </div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase">Refresher Training Pending</span>
              <div className="text-3xl font-black text-amber-900 mt-1">{crewData?.pendingCrew ?? 2} Workers</div>
            </div>
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Crew Roster Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-base font-black text-slate-900">Shift Roster & Safety Status</h2>
              <p className="text-xs text-slate-500">Live synchronization with worker mobile completions</p>
            </div>
            <button
              onClick={loadCrew}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 text-xs font-bold flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Roster</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="p-4">Worker Name</th>
                  <th className="p-4">Badge ID</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Safety Modules</th>
                  <th className="p-4">Practical Check-Off</th>
                  <th className="p-4">Shift Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {crewData?.roster?.map((w: any) => (
                  <tr key={w.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{w.fullName}</td>
                    <td className="p-4 font-mono text-slate-600">{w.badgeId}</td>
                    <td className="p-4 text-slate-600">{w.department}</td>
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
                        <span className="text-slate-400 font-medium">Pending Observation</span>
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
      </div>
    </div>
  );
}
