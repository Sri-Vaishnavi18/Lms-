'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  Play,
  CheckSquare,
  Square,
  ShieldCheck,
  PlaySquare,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { fetchApi } from '../../../lib/api';

export default function ToolboxTalkPage() {
  const router = useRouter();
  const [dailyModule, setDailyModule] = useState<any>(null);
  const [crew, setCrew] = useState<any[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchApi('/modules/daily-bite').catch(() => null),
      fetchApi('/supervisor/crew').catch(() => ({ roster: [] })),
    ])
      .then(([mod, c]) => {
        setDailyModule(mod);
        const roster = c.roster || [];
        setCrew(roster);
        // By default select all active workers
        if (roster.length > 0) {
          setSelectedWorkers(roster.map((w: any) => w.id));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleWorker = (id: string) => {
    if (selectedWorkers.includes(id)) {
      setSelectedWorkers(selectedWorkers.filter((w) => w !== id));
    } else {
      setSelectedWorkers([...selectedWorkers, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedWorkers.length === crew.length) {
      setSelectedWorkers([]);
    } else {
      setSelectedWorkers(crew.map((w) => w.id));
    }
  };

  const handleSubmitAttendance = async () => {
    if (selectedWorkers.length === 0) {
      alert('Please select at least one attending worker.');
      return;
    }

    try {
      await fetchApi('/supervisor/toolbox', {
        method: 'POST',
        body: JSON.stringify({
          moduleId: dailyModule?.id || 'daily-bite-id',
          workerIds: selectedWorkers,
        }),
      });
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'Failed to submit Toolbox attendance');
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
                Daily Shift Toolbox Talk (Group Mode)
              </h1>
              <p className="text-xs text-slate-500">
                Play pre-shift safety briefing on supervisor screen and verify whole-crew attendance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Video Talk (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                Today&apos;s Mandatory Briefing
              </span>
              <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 2 Minutes Duration
              </span>
            </div>

            <h2 className="text-xl font-black text-slate-900">
              {dailyModule?.title || 'Personal Protective Equipment & Safe Ladder Angles'}
            </h2>

            <div className="aspect-video bg-black rounded-2xl overflow-hidden relative shadow-md">
              <video
                src={dailyModule?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 block">Supervisor Discussion Points:</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>Verify all workers are wearing high-visibility vests and chin-strap secured helmets.</li>
                <li>Check weather and wind speeds prior to high-altitude scaffolding operations.</li>
                <li>Review nearest eyewash stations and chemical safety data sheets.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Crew Attendance Checklist (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Crew Attendance Check-Off</h3>
                <p className="text-xs text-slate-500">
                  {selectedWorkers.length} of {crew.length} workers present
                </p>
              </div>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold"
              >
                {selectedWorkers.length === crew.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-black text-emerald-950">Toolbox Attendance Logged!</h4>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Shift attendance record has been cryptographically signed and credited to all {selectedWorkers.length} selected worker profiles.
                </p>
                <div className="pt-2">
                  <Link
                    href="/supervisor/dashboard"
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl inline-block shadow-sm"
                  >
                    Return to Crew Portal
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {crew.map((w) => {
                    const isSelected = selectedWorkers.includes(w.id);
                    return (
                      <div
                        key={w.id}
                        onClick={() => toggleWorker(w.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-300'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-blue-600 shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400 shrink-0" />
                          )}
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{w.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Badge: {w.badgeId} • {w.trade || w.department}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isSelected ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isSelected ? 'Present' : 'Absent'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleSubmitAttendance}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign & Log Toolbox Attendance ({selectedWorkers.length} Workers)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
