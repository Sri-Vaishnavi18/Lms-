'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PlayCircle,
  QrCode,
  Award,
  DownloadCloud,
  CheckCircle2,
  Clock,
  HardHat,
  ChevronRight,
  Radio,
  FileCheck,
  Calendar,
  Sparkles,
  ExternalLink,
  Upload,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { fetchApi } from '../../../lib/api';
import { AudioNarrator } from '../../../components/AudioNarrator';
import { OfflineIndicator } from '../../../components/OfflineIndicator';
import { INDIAN_LANGUAGES, t } from '../../../lib/languages';

function WorkerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as any;

  const [user, setUser] = useState<any>(null);
  const [language, setLanguage] = useState<string>('hi');
  const [loading, setLoading] = useState(true);

  // Data states
  const [dailyBite, setDailyBite] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [milestoneData, setMilestoneData] = useState<any>(null);

  // Active Tab: 'RECORDED' | 'LIVE' | 'ASSIGNMENTS' | 'ATTENDANCE'
  const [activeTab, setActiveTab] = useState<'RECORDED' | 'LIVE' | 'ASSIGNMENTS' | 'ATTENDANCE'>(
    initialTab || 'RECORDED'
  );

  // Assignment Modal
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [photoProofUrl, setPhotoProofUrl] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lms_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          if (parsed.preferredLanguage) {
            setLanguage(parsed.preferredLanguage);
          }
        } catch (e) {}
      } else {
        // Fallback demo user
        const fallback = {
          id: 'worker-1',
          fullName: 'Ramesh Kumar',
          badgeId: 'BC-1001',
          role: 'WORKER',
          sector: 'CONSTRUCTION',
          trade: 'Mason & Scaffolder',
          skillTier: 'SKILLED',
          siteLocation: 'Metro Rail Project Site 4',
          department: 'Civil Infrastructure',
        };
        setUser(fallback);
      }
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData(user.id);
    }
  }, [user?.id]);

  const loadDashboardData = async (userId: string) => {
    try {
      setLoading(true);
      const [biteData, coursesData, milestones] = await Promise.all([
        fetchApi('/modules/daily-bite').catch(() => null),
        fetchApi('/modules').catch(() => []),
        fetchApi(`/modules/milestones/${userId}`).catch(() => null),
      ]);
      setDailyBite(biteData);
      setCourses(coursesData);
      setMilestoneData(milestones);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !user?.id) return;

    setSubmittingAssignment(true);
    try {
      await fetchApi(`/modules/assignments/${selectedAssignment.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          proofUrl: photoProofUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=80',
          notes: assignmentNotes,
        }),
      });

      setAssignmentSuccess('Practical photo proof submitted successfully for supervisor review!');
      setSelectedAssignment(null);
      setPhotoProofUrl('');
      setAssignmentNotes('');
      if (user?.id) loadDashboardData(user.id);
    } catch (err: any) {
      alert('Failed to submit assignment: ' + err.message);
    } finally {
      setSubmittingAssignment(false);
    }
  };

  // Flatten modules
  const allModules = courses.flatMap((c) =>
    (c.modules || []).map((m: any) => ({
      ...m,
      courseTitle: c.title,
      courseSector: c.sector || m.sector,
    }))
  );
  const recordedModules = allModules.filter((m) => m.sessionType === 'RECORDED' || !m.sessionType);
  const liveModules = allModules.filter((m) => m.sessionType === 'LIVE');
  const allAssignments = allModules.flatMap((m) =>
    (m.assignments || []).map((a: any) => ({ ...a, moduleTitle: m.title }))
  );

  const currentTier = milestoneData?.user?.skillTier || user?.skillTier || 'SKILLED';
  const progressPercent = milestoneData?.milestoneRoadmap?.currentProgressPercent ?? 50;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      {/* Top Banner (Full-Width Desktop Web Layout) */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Worker Identity Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-xl border-2 border-white/20">
              {user?.fullName ? user.fullName.charAt(0) : 'W'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold font-mono border border-blue-400/30">
                  {user?.badgeId || 'BC-1001'}
                </span>
                <span className="text-xs text-blue-200 font-semibold">
                  {user?.sector || 'CONSTRUCTION'} • {user?.trade || 'Field Operations'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Welcome back, {user?.fullName || 'Worker'}
              </h1>
              <p className="text-xs text-blue-100 mt-1">
                Location: {user?.siteLocation || 'Main Plant'} • Department: {user?.department || 'Operations'}
              </p>
            </div>
          </div>

          {/* Audio Prompt & Offline Badge */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-amber-300">Tap to Listen</div>
              <div className="text-[10px] text-blue-200">Hindi, Tamil, Telugu Voice Prompt</div>
            </div>
            <AudioNarrator
              textToSpeak={`नमस्ते ${user?.fullName || 'साथी'}, आज का 2 मिनट का सुरक्षा पाठ पूरा करें।`}
              language={language}
            />
          </div>

        </div>
      </section>

      {/* Main Content Area: 12-Column Desktop Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        
        {/* Notification Banner */}
        {assignmentSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold">{assignmentSuccess}</span>
            </div>
            <button onClick={() => setAssignmentSuccess(null)} className="font-bold text-emerald-700 hover:text-emerald-950">
              ✕
            </button>
          </div>
        )}

        {/* Milestone Progression Bar (Full Width) */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-black text-slate-900">
                  Vocational Career Milestone Roadmap
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified on-the-job competencies recognized across industrial manufacturing standards
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Current Qualification:</span>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                {currentTier.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-600">Overall Progress</span>
              <span className="font-mono text-emerald-600 font-bold">{progressPercent}% Verified</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 4 Skill Tiers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {[
              { tier: 'UNSKILLED', label: 'Tier 1: Induction', desc: 'Mandatory PPE & Fall Protection', minPct: 0 },
              { tier: 'SEMI_SKILLED', label: 'Tier 2: Supervised', desc: 'Machine SOPs & Tool Grounding', minPct: 25 },
              { tier: 'SKILLED', label: 'Tier 3: Autonomous', desc: 'Precision 5S & LOTO Execution', minPct: 60 },
              { tier: 'HIGHLY_SKILLED', label: 'Tier 4: Crew Lead', desc: 'Toolbox Talk Delivery & Mentoring', minPct: 90 },
            ].map((tItem, idx) => {
              const isPassed = progressPercent >= tItem.minPct;
              const isCurrent = currentTier === tItem.tier;

              return (
                <div
                  key={tItem.tier}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-50/60 border-blue-400 ring-2 ring-blue-500/20'
                      : isPassed
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isCurrent ? 'text-blue-700' : isPassed ? 'text-emerald-700' : 'text-slate-500'}>
                      {tItem.label}
                    </span>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{tItem.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 12-Column Responsive Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Modules & Live Sessions Hub */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Today's Mandatory Safety Bite */}
            {dailyBite && (
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Today's Mandatory Safety Bite</span>
                  </div>
                  <h3 className="text-xl font-black text-white">{dailyBite.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-blue-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-amber-300" />
                      <span>{Math.round(dailyBite.durationSeconds / 60)} Minutes</span>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-300 font-bold">Wrong ❌ vs Right ✔️</span>
                  </div>
                </div>

                <Link
                  href={`/worker/learn/${dailyBite.id}`}
                  className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                >
                  <PlayCircle className="w-5 h-5 fill-slate-950 text-amber-400" />
                  <span>Watch 2-Min Video Now</span>
                </Link>
              </div>
            )}

            {/* Session Tabs (Udemy style: Recorded Modules, Live Sessions, Assignments, Attendance) */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between overflow-x-auto gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab('RECORDED')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'RECORDED'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Recorded Video Modules ({recordedModules.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('LIVE')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'LIVE'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span>Live Masterclasses ({liveModules.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ASSIGNMENTS')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'ASSIGNMENTS'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Practical Assignments ({allAssignments.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ATTENDANCE')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'ATTENDANCE'
                        ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Shift Attendance</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Recorded Video Modules */}
              {activeTab === 'RECORDED' && (
                <div className="p-6 divide-y divide-slate-100">
                  {recordedModules.map((m) => (
                    <div key={m.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <PlayCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold uppercase">
                              {m.skillTier || 'UNSKILLED'}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">{m.courseTitle}</span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">{m.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span className="text-amber-600 font-bold">{Math.round(m.durationSeconds / 60)} min</span>
                            <span>•</span>
                            <span>Spot-the-Hazard Interactive Canvas Quiz</span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/worker/learn/${m.id}`}
                        className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
                      >
                        Start Lesson
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Live Masterclasses */}
              {activeTab === 'LIVE' && (
                <div className="p-6 space-y-4">
                  {liveModules.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No live sessions scheduled right now.
                    </div>
                  ) : (
                    liveModules.map((m) => (
                      <div
                        key={m.id}
                        className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase flex items-center gap-1">
                            <Radio className="w-3 h-3 animate-pulse" />
                            LIVE INTERACTIVE MASTERCLASS
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-700">
                            SCHEDULED FOR TODAY
                          </span>
                        </div>

                        <h4 className="font-black text-base text-slate-900">{m.title}</h4>

                        <div className="text-xs text-slate-600 flex items-center gap-2">
                          <HardHat className="w-4 h-4 text-amber-600" />
                          <span>Trainer: <strong>{m.liveInstructor || 'Er. Rajesh Kulkarni'}</strong></span>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <a
                            href={m.liveSessionUrl || 'https://meet.jit.si/LMS360-Live-Safety-Session'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <Radio className="w-4 h-4" />
                            <span>Join Live Video Class Now</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Practical Photo Proof Assignments */}
              {activeTab === 'ASSIGNMENTS' && (
                <div className="p-6 space-y-4">
                  {allAssignments.map((a: any) => (
                    <div key={a.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold uppercase">
                            {a.type}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">{a.title}</h4>
                          <span className="text-xs text-slate-500">{a.moduleTitle}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                        {a.instructions}
                      </p>

                      <div className="flex justify-end">
                        <button
                          onClick={() => setSelectedAssignment(a)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Photo Evidence</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Shift Attendance */}
              {activeTab === 'ATTENDANCE' && (
                <div className="p-6 space-y-4">
                  <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-800 uppercase">Today's Shift Clearance</div>
                      <div className="text-sm font-black text-slate-900 mt-0.5">Cleared for Active Shop Floor</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">
                      PRESENT
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                      <span>Shift Date:</span>
                      <span className="font-mono font-bold text-slate-900">{new Date().toISOString().split('T')[0]}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                      <span>Toolbox Talk Attendance:</span>
                      <span className="font-bold text-emerald-700">Verified by David Miller (SUP-5001)</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                      <span>Safety Mask & PPE Inspection:</span>
                      <span className="font-bold text-emerald-700">100% Passed</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (4 cols): Passport & Utilities */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Skill Passport Quick Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">Digital Skill Passport</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tamper-proof verifiable QR employee credential
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Employee:</span>
                  <span className="font-bold text-slate-900">{user?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Badge ID:</span>
                  <span className="font-mono font-bold text-blue-600">{user?.badgeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Certified Level:</span>
                  <span className="font-bold text-emerald-600">{currentTier}</span>
                </div>
              </div>

              <Link
                href="/worker/passport"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Skill Passport →</span>
              </Link>
            </div>

            {/* Point of Work Machine QR Scanner */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <QrCode className="w-5 h-5 text-blue-600" />
                <span>On-Site Machine SOP Scanner</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Point your smartphone camera at the weatherproof QR sticker on the equipment frame to launch its 45-second pre-shift video.
              </p>
              <Link
                href="/worker/scan"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <QrCode className="w-4 h-4" />
                <span>Launch Camera Scanner</span>
              </Link>
            </div>

            {/* Offline Sync Mode */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <DownloadCloud className="w-5 h-5 text-emerald-600" />
                <span>Offline Learning Pack</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Working in an underground tunnel or remote agricultural field? Download course modules locally.
              </p>
              <Link
                href="/worker/offline"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Manage Offline Storage</span>
              </Link>
            </div>

          </div>

        </div>
      </main>

      {/* Assignment Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold uppercase">
                  {selectedAssignment.type}
                </span>
                <h3 className="font-black text-slate-900 text-base mt-1">{selectedAssignment.title}</h3>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1 text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {selectedAssignment.instructions}
            </p>

            <form onSubmit={handleSubmitProof} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Photo Proof URL / Evidence</label>
                <input
                  type="url"
                  placeholder="Paste photo URL or leave sample..."
                  value={photoProofUrl}
                  onChange={(e) => setPhotoProofUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Worker Field Observations / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Scaffolding anchor bolts tight. Safety harness double-checked."
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAssignment}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-sm transition-all"
                >
                  {submittingAssignment ? 'Submitting...' : 'Upload & Submit Proof'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function WorkerDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-bold">Loading Learning Portal...</div>}>
      <WorkerDashboardContent />
    </Suspense>
  );
}
