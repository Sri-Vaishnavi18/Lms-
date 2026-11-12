'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
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
        setCrew(data.roster || []);
        if (data.roster && data.roster.length > 0) {
          setSelectedWorkerId(data.roster[0].id);
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
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-slate-200">
          <Link
            href="/supervisor/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            Hands-on Field Verification
          </span>
        </header>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-xl font-black text-slate-900">30-Second Practical Observation</h1>
            <p className="text-xs text-slate-500 mt-1">
              Verify hands-on competency following digital video module completion.
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
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {crew.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.fullName} ({w.badgeId}) — {w.department}
                </option>
              ))}
            </select>
          </div>

          {/* Checklist */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1">
              Practical Competency Checklist
            </span>

            <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.item1}
                onChange={(e) => setChecklist({ ...checklist, item1: e.target.checked })}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 mt-0.5"
              />
              <span className="text-xs text-slate-800 font-medium">
                1. Worker conducted full physical inspection of helmet, footwear, and safety harness for wear or damage.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.item2}
                onChange={(e) => setChecklist({ ...checklist, item2: e.target.checked })}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 mt-0.5"
              />
              <span className="text-xs text-slate-800 font-medium">
                2. Worker correctly adjusted harness straps with 3-point contact and fastened chin-strap.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.item3}
                onChange={(e) => setChecklist({ ...checklist, item3: e.target.checked })}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 mt-0.5"
              />
              <span className="text-xs text-slate-800 font-medium">
                3. Worker demonstrated knowledge of emergency stop cutoff location and evacuation route.
              </span>
            </label>
          </div>

          {/* Digital Signature Pad */}
          <SignaturePad onSave={handleSignatureSave} />

          {/* Submit Action */}
          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <UserCheck className="w-5 h-5" />
              <span>Submit Practical Audit Sign-Off</span>
            </button>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-emerald-900 text-sm">
                Competency Verified & Digitally Signed!
              </div>
              <button
                onClick={() => router.push('/supervisor/dashboard')}
                className="text-xs font-bold text-emerald-700 underline"
              >
                Return to Crew Dashboard →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
