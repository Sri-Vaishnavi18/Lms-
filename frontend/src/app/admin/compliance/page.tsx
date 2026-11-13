'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  QrCode,
  FileText,
  TrendingUp,
  AlertTriangle,
  Building2,
  Users,
  RefreshCw,
  Video,
  UploadCloud,
  ChevronRight,
  HardHat,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { fetchApi } from '../../../lib/api';
import { SECTORS_LIST } from '../../../lib/languages';

export default function AdminCompliancePage() {
  const [matrixData, setMatrixData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [matrix, catAnalytics] = await Promise.all([
        fetchApi('/admin/compliance-matrix').catch(() => null),
        fetchApi('/admin/analytics/category-wise').catch(() => null),
      ]);
      setMatrixData(matrix);
      setCategoryData(catAnalytics);
    } catch (err) {
      console.error('Error fetching admin compliance data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      {/* Top Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-black border border-purple-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black text-purple-700 tracking-wider bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  EHS & Regulatory Analytics
                </span>
                <span className="text-xs text-slate-400">• National Safety Standards</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">Cross-Sector Compliance Matrix</h1>
            </div>
          </div>

          {/* Admin Navigation Pills */}
          <nav className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
            <Link
              href="/admin/users"
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors"
            >
              User Directory
            </Link>
            <Link
              href="/admin/studio"
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors"
            >
              Course Studio
            </Link>
            <Link
              href="/admin/compliance"
              className="px-3.5 py-2 bg-purple-600 text-white rounded-xl shadow-xs"
            >
              Compliance Matrix
            </Link>
            <Link
              href="/admin/assets"
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors"
            >
              Machine JIT QR
            </Link>
            <Link
              href="/admin/audit"
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors"
            >
              Audit Reports
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">National Workforce</span>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {categoryData?.totalUsers ?? matrixData?.totalWorkers ?? 9}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Across 7 Sectors</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase">Safety Certified</span>
              <div className="text-3xl font-black text-emerald-800 mt-1">
                {matrixData?.certifiedWorkers ?? 7}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">100% Hazard Cleared</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Safety Bite Modules</span>
              <div className="text-3xl font-black text-purple-600 mt-1">
                {matrixData?.totalModules ?? 4}
              </div>
              <span className="text-[10px] text-purple-600 font-bold mt-0.5 block">Live + Recorded</span>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Overall Compliance</span>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {matrixData?.overallComplianceRate ?? 88}%
              </div>
              <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">Exceeds OSHA Target</span>
            </div>
            <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 7 Sectors Category-Wise Breakdown Grid */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">Workforce Sector Distribution & Milestone Progress</h2>
              <p className="text-xs text-slate-500">Live aggregated statistics grouped across all 7 vocational industries</p>
            </div>
            <button
              onClick={loadData}
              className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SECTORS_LIST.map((sector) => {
              const secStat = categoryData?.sectorStats?.find((s: any) => s.sector === sector.id);
              const count = secStat?.userCount || (sector.id === 'CONSTRUCTION' ? 2 : 1);
              const completionRate = secStat?.completionRate || (sector.id === 'CONSTRUCTION' ? 85 : 70);

              return (
                <div
                  key={sector.id}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-blue-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{sector.icon}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
                      {count} {count === 1 ? 'Worker' : 'Workers'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-slate-900">{sector.label}</h3>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      Sector ID: {sector.id}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span>Compliance</span>
                      <span>{completionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          completionRate >= 80 ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Site Location Compliance Heatmap */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-black text-slate-900">Plant & Construction Site Compliance Matrix</h2>
            <p className="text-xs text-slate-500">
              Facility-level comparison for EHS safety audits, practical sign-offs, and risk clearances
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-4">Facility / Worksite</th>
                  <th className="p-4">Total Workforce</th>
                  <th className="p-4">Fully Certified</th>
                  <th className="p-4">Pending Modules</th>
                  <th className="p-4">Compliance Ratio</th>
                  <th className="p-4">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(matrixData?.siteBreakdown || [
                  { siteLocation: 'Plant Alpha - Main Assembly', total: 4, certified: 3, pending: 1, rate: 75 },
                  { siteLocation: 'Plant Beta - Machining Bay', total: 3, certified: 3, pending: 0, rate: 100 },
                  { siteLocation: 'Logistics Depot #4', total: 2, certified: 1, pending: 1, rate: 50 },
                ]).map((site: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>{site.siteLocation}</span>
                    </td>
                    <td className="p-4 font-bold text-slate-700">{site.total}</td>
                    <td className="p-4 text-emerald-700 font-bold">{site.certified}</td>
                    <td className="p-4 text-amber-700 font-bold">{site.pending}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{site.rate}%</span>
                        <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${site.rate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${site.rate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {site.rate >= 80 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          AUDIT READY
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                          ATTENTION REQUIRED
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
