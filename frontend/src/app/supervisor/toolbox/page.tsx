'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, CheckCircle2, Play, CheckSquare, Square, ShieldCheck } from 'lucide-react';
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
        setCrew(c.roster || []);
        // By default select all active workers
        if (c.roster) {
          setSelectedWorkers(c.roster.map((w: any) => w.id));
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
          notes: 'Morning pre-shift standup drill conducted by Shift Supervisor.',
        }),
      });
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'Failed to submit group attendance');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link
            href="/supervisor/dashboard"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Crew Dashboard</span>
          </Link>
          <span className="bg-amber-400/20 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-black uppercase">
            Supervisor Group Mode
          </span>
        </header>

        {/* Video Player */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-black text-white">{dailyModule?.title || 'Daily Safety Drill'}</h1>
            <span className="text-xs text-slate-400">Duration: 2 Minutes</span>
          </div>

          <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl">
            <video
              src={dailyModule?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Crew Attendance Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Crew Attendance Sign-Off
              </h2>
              <p className="text-xs text-slate-400">
                Confirm all workers who watched and participated in this morning drill
              </p>
            </div>

            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700"
            >
              {selectedWorkers.length === crew.length ? 'Deselect All' : 'Select All Crew'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {crew.map((w) => {
              const isSelected = selectedWorkers.includes(w.id);
              return (
                <div
                  key={w.id}
                  onClick={() => toggleWorker(w.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-500/80 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-white">{w.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{w.badgeId}</div>
                  </div>
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600" />
                  )}
                </div>
              );
            })}
          </div>

          {!submitted ? (
            <button
              onClick={handleSubmitAttendance}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg text-base mt-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Confirm & Certify Crew ({selectedWorkers.length} Workers)</span>
            </button>
          ) : (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="font-black text-emerald-200">
                Attendance Certified! All {selectedWorkers.length} workers credited.
              </div>
              <button
                onClick={() => router.push('/supervisor/dashboard')}
                className="mt-2 text-xs font-bold text-white underline"
              >
                Return to Shift Dashboard →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
