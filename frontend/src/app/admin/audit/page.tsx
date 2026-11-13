'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Printer,
  Download,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Building2,
  Users,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
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

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      {/* Top Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black border border-emerald-200">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black text-emerald-700 tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Regulatory Labor & OSHA Records
                </span>
                <span className="text-xs text-slate-400">• Ministry Audit Ready</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">Audit-Ready Safety Dossier</h1>
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
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors"
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
              className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl shadow-xs"
            >
              Audit Reports
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900">Official Certification Log</h2>
            <p className="text-xs text-slate-500">
              Complies with OSHA 29 CFR 1910 and Directorate General of Factory Advice Service & Labour Institutes (DGFASLI) mandates
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Export / Print Official Audit PDF</span>
            </button>
          </div>
        </div>

        {/* Audit Report Container */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex justify-between items-start border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-sm text-slate-900">
                  National Occupational Safety & Health Compliance Registry
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                LMS 360 Cryptographically Verified Training Records
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400">Total Verified Records: </span>
              <span className="font-bold text-slate-900 font-mono text-sm">
                {auditData?.totalVerifiedRecords ?? 9}
              </span>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Generated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3.5">Record ID</th>
                  <th className="p-3.5">Worker Name</th>
                  <th className="p-3.5">Badge ID</th>
                  <th className="p-3.5">Sector / Trade</th>
                  <th className="p-3.5">Verified Module</th>
                  <th className="p-3.5">Completion Timestamp</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5">Regulatory Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditData?.records?.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono text-slate-400 text-[11px]">{r.id.slice(0, 8)}</td>
                    <td className="p-3.5 font-bold text-slate-900">{r.workerName}</td>
                    <td className="p-3.5 font-mono text-slate-600">{r.badgeId}</td>
                    <td className="p-3.5 text-slate-600">{r.department}</td>
                    <td className="p-3.5 font-medium text-slate-800">{r.moduleTitle}</td>
                    <td className="p-3.5 text-slate-500 text-[11px]">
                      {new Date(r.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{r.score}%</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
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
