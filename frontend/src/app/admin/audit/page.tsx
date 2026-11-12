'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Printer, Download, ArrowLeft, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { fetchApi } from '../../../lib/api';

export default function AdminAuditPage() {
  const [auditData, setAuditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudit();
  }, []);

  const loadAudit = () => {
    setLoading(true);
    fetchApi('/admin/audit-reports')
      .then((data) => setAuditData(data))
      .catch((err) => console.error('Error fetching audit:', err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Tabs Header */}
        <header className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-black text-emerald-400 tracking-wider">
                Regulatory Labor & OSHA Records
              </span>
              <h1 className="text-2xl font-black">Audit-Ready Safety Dossier</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Export / Print Official Audit PDF</span>
            </button>
          </div>
        </header>

        {/* Audit Report Container */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Official Certification Verification Log
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complies with OSHA 29 CFR 1910 safety training documentation mandates.
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400">Total Verified Records: </span>
              <span className="font-bold text-slate-900 font-mono">
                {auditData?.totalVerifiedRecords ?? 0}
              </span>
              <div className="text-[10px] text-slate-400 mt-1">
                Generated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3">Worker Name</th>
                  <th className="p-3">Badge ID</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Module Completed</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Verified Timestamp</th>
                  <th className="p-3">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {auditData?.records?.map((rec: any) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">{rec.user?.fullName}</td>
                    <td className="p-3 font-mono text-slate-600">{rec.user?.badgeId}</td>
                    <td className="p-3 text-slate-600">{rec.user?.department}</td>
                    <td className="p-3 font-bold text-slate-800">{rec.module?.title}</td>
                    <td className="p-3 text-slate-500">{rec.module?.course?.category}</td>
                    <td className="p-3 font-mono font-bold text-emerald-700">{rec.score}%</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">
                      {new Date(rec.completedAt).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
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
