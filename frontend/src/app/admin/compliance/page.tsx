'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, QrCode, FileText, TrendingUp, AlertTriangle, Building2, Users, RefreshCw } from 'lucide-react';
import { fetchApi } from '../../../lib/api';

export default function AdminCompliancePage() {
  const [matrixData, setMatrixData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatrix();
  }, []);

  const loadMatrix = () => {
    setLoading(true);
    fetchApi('/admin/compliance-matrix')
      .then((data) => setMatrixData(data))
      .catch((err) => console.error('Error fetching matrix:', err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Tabs Header */}
        <header className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/30 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-black text-purple-400 tracking-wider">
                EHS Leadership & Admin
              </span>
              <h1 className="text-2xl font-black">Safety & Compliance Matrix</h1>
            </div>
          </div>

          <nav className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
            <Link
              href="/admin/compliance"
              className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs"
            >
              Compliance Matrix
            </Link>
            <Link
              href="/admin/assets"
              className="px-4 py-2 text-slate-300 hover:text-white font-bold rounded-xl text-xs hover:bg-slate-700"
            >
              Machine QR Assets
            </Link>
            <Link
              href="/admin/audit"
              className="px-4 py-2 text-slate-300 hover:text-white font-bold rounded-xl text-xs hover:bg-slate-700"
            >
              OSHA Audit Reports
            </Link>
          </nav>
        </header>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Frontline Workforce</span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {matrixData?.overallWorkers ?? 3} Active
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">Required Safety Modules</span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {matrixData?.totalModules ?? 5} Modules
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-sm">
            <span className="text-xs font-bold text-purple-800 uppercase">Average Site Compliance</span>
            <div className="text-3xl font-black text-purple-900 mt-1">
              {matrixData?.departments
                ? Math.round(
                    matrixData.departments.reduce((acc: number, d: any) => acc + d.compliancePercentage, 0) /
                      (matrixData.departments.length || 1)
                  )
                : 60}
              %
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm">
            <span className="text-xs font-bold text-amber-800 uppercase">Critical Expiration Window</span>
            <div className="text-3xl font-black text-amber-900 mt-1">1 Worker</div>
          </div>
        </div>

        {/* Compliance Matrix Department Heatmap Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-base font-black text-slate-900">Site-Wide Department Heatmap</h2>
              <p className="text-xs text-slate-500">Real-time status calculated from verified completions</p>
            </div>
            <button
              onClick={loadMatrix}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 text-xs font-bold flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Matrix</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="p-4">Department</th>
                  <th className="p-4">Plant Location</th>
                  <th className="p-4">Workers Enrolled</th>
                  <th className="p-4">Fully Certified</th>
                  <th className="p-4">Compliance Percentage</th>
                  <th className="p-4">Audit Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixData?.departments?.map((dept: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="p-4 font-bold text-slate-900">{dept.department}</td>
                    <td className="p-4 text-slate-600">{dept.siteLocation}</td>
                    <td className="p-4 font-bold text-slate-700">{dept.totalWorkers}</td>
                    <td className="p-4 font-bold text-emerald-700">{dept.certifiedWorkers}</td>
                    <td className="p-4 w-48">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${dept.compliancePercentage}%` }}
                            className={`h-full rounded-full ${
                              dept.compliancePercentage >= 70
                                ? 'bg-emerald-500'
                                : dept.compliancePercentage >= 40
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                          />
                        </div>
                        <span className="font-mono font-black text-slate-800">
                          {dept.compliancePercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {dept.compliancePercentage >= 70 ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          LOW RISK (COMPLIANT)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">
                          MEDIUM RISK (TRAIN CREW)
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
