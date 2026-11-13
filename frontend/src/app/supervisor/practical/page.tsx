'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  PenTool,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { fetchApi } from '../../../lib/api';
import { SignaturePad } from '../../../components/SignaturePad';

export default function PracticalAuditPage() {
  const router = useRouter();
  const [crew, setCrew] = useState<any[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [checklist, setChecklist] = useState({
    item1: false, // Physical inspection of PPE condition
    item2: false, // Proper fit and strap adjustment
    item3: false, // Demonstrated emergency cutoff procedure
  });
  const [signatureUrl, setSignatureUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/supervisor/crew')
      .then((data) => {
        const roster = data.roster || [];
        setCrew(roster);
        if (roster.length > 0) {
          setSelectedWorkerId(roster[0].id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSignatureSave = (dataUrl: string) => {
    setSignatureUrl(dataUrl);
    alert('Signature captured! Now tap "Submit Practical Audit".');
  };

  const handleSubmit = async () => {
    if (!checklist.item1 || !checklist.item2 || !checklist.item3) {
      alert('All 3 practical observation checklist items must be checked as verified.');
      return;
    }

    if (!signatureUrl) {
      alert('Please draw and save your supervisor signature below.');
      return;
    }

    try {
      await fetchApi('/supervisor/practical', {
        method: 'POST',
        body: JSON.stringify({
          workerId: selectedWorkerId,
          checklistName: 'Physical PPE & Emergency Stop Competency Check',
          passed: true,
          notes: 'Observed on shop floor. Worker demonstrated zero-fault execution.',
          signatureUrl,
        }),
      });
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'Audit submission failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      {/* Top Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/supervisor/dashboard"
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Crew Roster</span>
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Hands-on Practical Field Audit
              </h1>
              <p className="text-xs text-slate-500">
                Supervisor 30-second observation & physical check-off to bridge video theory with on-site behavior
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Practical Competency Certified!</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                The physical observation record has been stamped into the worker&apos;s Skill Passport with your supervisor signature.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/supervisor/dashboard"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Return to Shift Roster
                </Link>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setChecklist({ item1: false, item2: false, item3: false });
                    setSignatureUrl('');
                  }}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                >
                  Audit Another Worker
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-black text-slate-900">Observation Evaluation Form</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Assess hands-on execution directly at the workbay, machine station, or construction zone.
                </p>
              </div>

              {/* Worker Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Worker to Verify:
                </label>
                <select
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {crew.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.fullName} ({w.badgeId}) — {w.trade || w.department} ({w.sector?.replace(/_/g, ' ') || 'CONSTRUCTION'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Checklist */}
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-1">
                  Hands-on Safety Criteria (All Required)
                </span>

                <label className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-blue-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.item1}
                    onChange={(e) => setChecklist({ ...checklist, item1: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      1. Physical PPE Inspection & Condition Check
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Verified helmet chin-strap tension, safety glasses clarity, and no frays in fall harness stitching.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-blue-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.item2}
                    onChange={(e) => setChecklist({ ...checklist, item2: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      2. Proper Machine Interlock & Pre-Start Check
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Worker verified physical safety guard in place and cleared hydraulic lockout before energizing.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-blue-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.item3}
                    onChange={(e) => setChecklist({ ...checklist, item3: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      3. Demonstrated Emergency Cutoff Procedure
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Worker identified and physically located primary E-Stop button within 3 seconds.
                    </span>
                  </div>
                </label>
              </div>

              {/* Digital Signature Pad */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Supervisor Digital Signature
                </label>
                <div className="border border-slate-300 rounded-2xl p-4 bg-slate-50">
                  <SignaturePad onSave={handleSignatureSave} />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Submit & Validate Practical Competency</span>
              </button>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
