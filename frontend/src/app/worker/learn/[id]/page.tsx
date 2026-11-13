'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  Target,
  AlertTriangle,
  Radio,
  BookOpen,
  FileCheck,
  Award,
  UploadCloud,
  ExternalLink,
  Clock,
  User,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../../../../components/Navbar';
import { Footer } from '../../../../components/Footer';
import { fetchApi } from '../../../../lib/api';
import { AudioNarrator } from '../../../../components/AudioNarrator';
import { INDIAN_LANGUAGES } from '../../../../lib/languages';

export default function MicrolearningPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.id as string;

  const [moduleData, setModuleData] = useState<any>(null);
  const [courseModules, setCourseModules] = useState<any[]>([]);
  const [selectedLang, setSelectedLang] = useState('hi');
  const [activeTab, setActiveTab] = useState<'SOP' | 'ASSIGNMENT' | 'LIVE_INFO' | 'STANDARDS'>('SOP');
  const [videoFinished, setVideoFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  // Assignment submission state
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);

  useEffect(() => {
    if (moduleId) {
      setLoading(true);
      fetchApi(`/modules/${moduleId}`)
        .then((data) => {
          setModuleData(data);
          // If the module has course information, fetch all course modules for the syllabus sidebar
          if (data.courseId) {
            fetchApi(`/modules`)
              .then((allCourses) => {
                const parentCourse = allCourses.find((c: any) => c.id === data.courseId);
                if (parentCourse && parentCourse.modules) {
                  setCourseModules(parentCourse.modules);
                }
              })
              .catch((err) => console.error('Course list error:', err));
          }
        })
        .catch((err) => console.error('Error fetching module:', err))
        .finally(() => setLoading(false));
    }
  }, [moduleId]);

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleData?.assignments?.[0]?.id) return;
    setSubmittingAssignment(true);

    try {
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('lms_user') : null;
      const userId = storedUser ? JSON.parse(storedUser).id : 'demo-worker-id';

      await fetchApi(`/modules/assignments/${moduleData.assignments[0].id}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          userId,
          notes: assignmentNotes,
          proofPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        }),
      });
      setAssignmentSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmittingAssignment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-3" />
          <p className="text-sm font-bold text-slate-600">Loading LMS 360 Classroom...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Module Not Found</h2>
          <p className="text-sm text-slate-500 max-w-md mb-6">
            The safety session or masterclass you requested could not be located in our catalog.
          </p>
          <Link
            href="/worker/dashboard"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
          >
            ← Return to Learning Portal
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const primaryQuizId = moduleData.quizzes && moduleData.quizzes.length > 0 ? moduleData.quizzes[0].id : null;
  const assignment = moduleData.assignments && moduleData.assignments.length > 0 ? moduleData.assignments[0] : null;
  const isLive = moduleData.sessionType === 'LIVE_STREAM';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      {/* Top Breadcrumb & Session Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/worker/dashboard')}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">
                {moduleData.course?.title || 'Industrial Vocational Training'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-900 line-clamp-1">{moduleData.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                Live Masterclass
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
                <Clock className="w-3.5 h-3.5" />
                {moduleData.durationMinutes || 2} Min Bite
              </span>
            )}

            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
              <Volume2 className="w-3.5 h-3.5 text-blue-600" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                title="Select Audio Narration Language"
              >
                {INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Classroom Workspace - 2 Columns (Udemy / Amity Style) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Player & Tabbed Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Video Theater Box */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 relative">
              {isLive ? (
                <div className="aspect-video w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white relative">
                  <div className="w-16 h-16 rounded-full bg-rose-600/20 text-rose-500 border border-rose-500/30 flex items-center justify-center mb-4">
                    <Radio className="w-8 h-8 animate-pulse" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs uppercase tracking-wider mb-2">
                    Live Broadcast Stage
                  </span>
                  <h3 className="text-xl font-black max-w-md">{moduleData.title}</h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Instructor: <span className="text-slate-200 font-bold">{moduleData.liveInstructor || 'Chief Technical Trainer'}</span> • Starts:{' '}
                    {moduleData.liveStartTime ? new Date(moduleData.liveStartTime).toLocaleString() : 'Live Now'}
                  </p>

                  {moduleData.liveSessionUrl ? (
                    <a
                      href={moduleData.liveSessionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition-all shadow-lg flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Join Interactive Live Stream Room</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => setVideoFinished(true)}
                      className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                    >
                      Simulate Attendance Completion
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  <video
                    src={moduleData.videoUrl}
                    controls
                    playsInline
                    autoPlay
                    onEnded={() => setVideoFinished(true)}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Player Quick Controls & Narration Sub-bar */}
              <div className="bg-slate-800/90 backdrop-blur-md px-5 py-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-3 text-xs">
                  <AudioNarrator
                    textToSpeak={`${moduleData.title}. ध्यान से देखें और नीचे दिए गए व्यावहारिक असाइनमेंट और सुरक्षा नियमों का पालन करें।`}
                    language={selectedLang}
                  />
                  <span className="text-slate-300 font-medium">Listen lesson overview in your language</span>
                </div>

                <div className="flex items-center gap-2">
                  {primaryQuizId && (
                    <Link
                      href={`/worker/quiz/${primaryQuizId}`}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
                        videoFinished
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 animate-bounce'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      <Target className="w-4 h-4" />
                      <span>{videoFinished ? 'Take Visual Hazard Quiz 🎯' : 'Spot Hazard Quiz'}</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Lesson Title & Sector Badges */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                      {moduleData.sector?.replace(/_/g, ' ') || 'GENERAL'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      TIER: {moduleData.skillTier || 'SEMI_SKILLED'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      NSQF Certified
                    </span>
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{moduleData.title}</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Part of {moduleData.course?.title || 'Industrial Technical Operations Series'}
                  </p>
                </div>
              </div>

              {/* Navigation Tabs (SOP, Practical Assignment, Live Notes, Standards) */}
              <div className="border-b border-slate-200 pt-2">
                <nav className="flex space-x-6 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('SOP')}
                    className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                      activeTab === 'SOP'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Safety Checklist & SOP</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ASSIGNMENT')}
                    className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors relative ${
                      activeTab === 'ASSIGNMENT'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Practical Assignment</span>
                    {assignment && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </button>

                  {isLive && (
                    <button
                      onClick={() => setActiveTab('LIVE_INFO')}
                      className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                        activeTab === 'LIVE_INFO'
                          ? 'border-rose-600 text-rose-600'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Radio className="w-4 h-4" />
                      <span>Live Session Details</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab('STANDARDS')}
                    className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                      activeTab === 'STANDARDS'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Competency Standards</span>
                  </button>
                </nav>
              </div>

              {/* Tab 1: SOP & Visual Right vs Wrong Cards */}
              {activeTab === 'SOP' && (
                <div className="space-y-6 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Wrong Way */}
                    <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
                      <div className="flex items-center gap-2 font-black text-xs text-rose-700 mb-2">
                        <span className="w-5 h-5 rounded-full bg-rose-200 flex items-center justify-center text-rose-800 text-xs">✕</span>
                        <span>UNSAFE PRACTICE (DO NOT DO)</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        Rushing equipment startup without double-checking safety interlocks, unbuckling chin-strap, or operating high-pressure machinery without verified personal protective gear.
                      </p>
                    </div>

                    {/* Right Way */}
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <div className="flex items-center gap-2 font-black text-xs text-emerald-700 mb-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 text-xs">✓</span>
                        <span>CERTIFIED OPERATING STANDARD</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        Execute 3-point visual check, verify emergency cutoff button responsiveness, log pre-shift checklist on supervisor tablet, and maintain 1.5m clearance boundary.
                      </p>
                    </div>
                  </div>

                  {/* Standard Operating Procedure Steps */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Step-by-Step SOP Action Plan</span>
                    </h3>

                    <div className="space-y-2.5">
                      {[
                        { step: '01', title: 'Pre-Shift Inspection', desc: 'Scan machinery QR sticker at the station to verify maintenance readiness and oil pressure.' },
                        { step: '02', title: 'Personal Protective Equipment Check', desc: 'Ensure helmet chin-strap, safety glasses, steel-toe boots, and high-visibility vest are secured.' },
                        { step: '03', title: 'Lockout / Tagout (LOTO) Compliance', desc: 'Verify main breaker lockout has been cleared by authorized site supervisor prior to power activation.' },
                        { step: '04', title: 'Emergency E-Stop Verification', desc: 'Perform manual test press of the red emergency stop button prior to feeding raw materials.' },
                      ].map((item) => (
                        <div key={item.step} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-3">
                          <span className="font-black text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                            {item.step}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Practical Assignment Submission */}
              {activeTab === 'ASSIGNMENT' && (
                <div className="space-y-5 pt-2">
                  {assignment ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                        <div className="flex items-center gap-2 text-blue-800 font-bold text-xs mb-1">
                          <FileCheck className="w-4 h-4" />
                          <span>Required Field Assignment</span>
                        </div>
                        <h3 className="text-base font-black text-slate-900">{assignment.title}</h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {assignment.description || 'Perform physical check on site equipment and upload photographic proof or supervisor sign-off confirmation.'}
                        </p>
                      </div>

                      {assignmentSuccess ? (
                        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                          <h4 className="text-base font-black text-emerald-900">Assignment Submitted Successfully!</h4>
                          <p className="text-xs text-emerald-700 max-w-md mx-auto">
                            Your photo proof and notes have been logged for supervisor validation. This milestone will reflect on your Skill Passport once verified.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              Field Observation & Notes
                            </label>
                            <textarea
                              rows={3}
                              required
                              value={assignmentNotes}
                              onChange={(e) => setAssignmentNotes(e.target.value)}
                              placeholder="Enter observations, safety observations or checklist values observed during practical operation..."
                              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              Photo Proof of Work (Simulation)
                            </label>
                            <div className="p-4 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl bg-slate-50 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                  <UploadCloud className="w-5 h-5" />
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-slate-800 block">site_inspection_photo.jpg</span>
                                  <span className="text-[10px] text-slate-500">Auto-captured from camera • 1.4 MB</span>
                                </div>
                              </div>
                              <span className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg shadow-xs">
                                Ready to upload
                              </span>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={submittingAssignment}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                          >
                            <FileCheck className="w-4 h-4" />
                            <span>{submittingAssignment ? 'Submitting to Supervisor...' : 'Submit Practical Proof For Verification'}</span>
                          </button>
                        </form>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-xs font-bold">No physical assignment required for this conceptual microlearning module.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Live Masterclass Info */}
              {activeTab === 'LIVE_INFO' && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                      <Radio className="w-4 h-4 animate-pulse" />
                      <span>Live Interactive Classroom Details</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-rose-100">
                        <span className="text-[10px] text-slate-500 uppercase font-black">Lead Instructor</span>
                        <p className="font-bold text-slate-900 mt-0.5">{moduleData.liveInstructor || 'Senior National Trainer'}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-rose-100">
                        <span className="text-[10px] text-slate-500 uppercase font-black">Scheduled Broadcast</span>
                        <p className="font-bold text-slate-900 mt-0.5">
                          {moduleData.liveStartTime ? new Date(moduleData.liveStartTime).toLocaleString() : 'Live Stream Active'}
                        </p>
                      </div>
                    </div>
                    {moduleData.liveSessionUrl && (
                      <div className="pt-2">
                        <a
                          href={moduleData.liveSessionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Open Live Video Feed in Fullscreen</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Competency Standards */}
              {activeTab === 'STANDARDS' && (
                <div className="space-y-4 pt-2 text-xs">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <h4 className="font-black text-slate-900">National Skills Qualification Framework (NSQF)</h4>
                    <p className="text-slate-600 leading-relaxed">
                      This unit of competency adheres to National Occupational Standards (NOS) benchmarked for frontline industrial operatives under the Ministry of Skill Development & Entrepreneurship.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-700">
                        Code: IND-SEC-{moduleData.sector?.slice(0, 4) || 'GEN'}-401
                      </span>
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-700">
                        Credit Points: 1.5 Hours
                      </span>
                      <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-700">
                        Validity: 12 Months
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Course Syllabus & Modules Navigation (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Syllabus Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                    Course Curriculum
                  </span>
                  <h3 className="text-sm font-black text-slate-900">Classroom Modules</h3>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {courseModules.length > 0 ? `${courseModules.length} Lessons` : 'Curriculum'}
                </span>
              </div>

              {/* Module List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {courseModules.length > 0 ? (
                  courseModules.map((item, idx) => {
                    const isCurrent = item.id === moduleId;
                    return (
                      <Link
                        key={item.id}
                        href={`/worker/learn/${item.id}`}
                        className={`p-3 rounded-2xl flex items-start gap-3 transition-all border ${
                          isCurrent
                            ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-400'
                            : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                            isCurrent
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-slate-300 text-slate-600'
                          }`}
                        >
                          {item.sessionType === 'LIVE_STREAM' ? (
                            <Radio className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-black uppercase text-slate-400">
                              Module {idx + 1}
                            </span>
                            {item.sessionType === 'LIVE_STREAM' ? (
                              <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 text-[9px] font-black border border-rose-200 uppercase">
                                Live
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold">{item.durationMinutes || 2}m</span>
                            )}
                          </div>
                          <h4
                            className={`text-xs font-bold line-clamp-2 mt-0.5 ${
                              isCurrent ? 'text-blue-900' : 'text-slate-800'
                            }`}
                          >
                            {item.title}
                          </h4>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="text-xs font-bold text-blue-900 block">{moduleData.title}</span>
                    <span className="text-[10px] text-blue-700">Currently active session</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Assessment Widget */}
            {primaryQuizId && (
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-5 text-slate-950 shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-900/80">
                      Module Verification
                    </span>
                    <h4 className="text-sm font-black leading-tight">Visual Hazard Assessment</h4>
                  </div>
                </div>
                <p className="text-xs text-slate-900/90 font-medium">
                  Test your real-world recognition skills. Spot 3 hazardous defects on an actual machinery photograph.
                </p>
                <Link
                  href={`/worker/quiz/${primaryQuizId}`}
                  className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Launch Visual Quiz</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Helpline / Audio Assistance Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2.5 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero-Barrier Multi-Language Engine</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Need audio in your mother tongue? Toggle any of the 11 Indian native languages using the top toolbar at any time.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
