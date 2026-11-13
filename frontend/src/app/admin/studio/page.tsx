'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  Video,
  Radio,
  PlusCircle,
  CheckCircle2,
  Calendar,
  Clock,
  Layers,
  ArrowLeft,
  Sparkles,
  PlayCircle,
  FileCheck,
  HardHat,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { fetchApi } from '../../../lib/api';
import { SECTORS_LIST, SKILL_TIERS } from '../../../lib/languages';

export default function AdminModuleStudioPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Tab: 'MODULE' | 'COURSE'
  const [activeTab, setActiveTab] = useState<'MODULE' | 'COURSE'>('MODULE');

  // Course Form
  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'EHS',
    sector: 'CONSTRUCTION',
    skillTier: 'UNSKILLED',
    description: '',
  });

  // Module Form
  const [moduleForm, setModuleForm] = useState({
    courseId: '',
    title: '',
    sessionType: 'RECORDED' as 'RECORDED' | 'LIVE',
    durationSeconds: 120,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    liveSessionUrl: 'https://meet.jit.si/LMS360-Live-Safety-Session',
    liveStartTime: '',
    liveInstructor: 'Er. Rajesh Kulkarni (Chief Safety Inspector)',
    sector: 'CONSTRUCTION',
    skillTier: 'UNSKILLED',
    assignmentTitle: 'Mandatory Site PPE & Checklist Photo Verification',
    assignmentInstructions: 'Take a clear photo selfie showing proper hard hat chin strap and safety gear.',
  });

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/modules');
      setCourses(data);
      if (data.length > 0 && !moduleForm.courseId) {
        setModuleForm((prev) => ({ ...prev, courseId: data[0].id }));
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/admin/courses', {
        method: 'POST',
        body: JSON.stringify(courseForm),
      });
      setSuccessMsg(`Course "${courseForm.title}" published successfully!`);
      setCourseForm({
        title: '',
        category: 'EHS',
        sector: 'CONSTRUCTION',
        skillTier: 'UNSKILLED',
        description: '',
      });
      loadCourses();
      setActiveTab('MODULE');
    } catch (err: any) {
      alert('Failed to publish course: ' + err.message);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/admin/modules', {
        method: 'POST',
        body: JSON.stringify(moduleForm),
      });
      setSuccessMsg(`Session "${moduleForm.title}" published successfully!`);
      loadCourses();
    } catch (err: any) {
      alert('Failed to publish module: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/admin/users"
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to User Management</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
              <UploadCloud className="w-7 h-7 text-indigo-600" />
              <span>Course & Live/Recorded Session Studio</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Publish vocational microlearning bites, live streaming masterclasses, skill tier tags, and practical photo assignments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/users"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              Worker Roster
            </Link>
            <Link
              href="/admin/compliance"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              Compliance Matrix
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* Success Banner */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center justify-between text-xs shadow-xs font-bold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-950">
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Authoring Studio Form */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('MODULE')}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'MODULE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Video className="w-4 h-4 text-blue-600" />
                <span>Upload Session / Module</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('COURSE')}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'COURSE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Create Curriculum</span>
              </button>
            </div>

            {activeTab === 'MODULE' ? (
              <form onSubmit={handleCreateModule} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Select Parent Course</label>
                  <select
                    value={moduleForm.courseId}
                    onChange={(e) => setModuleForm({ ...moduleForm, courseId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.sector})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Session Title</label>
                  <input
                    type="text"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Scaffolding Fall Arrest Inspection Drill"
                    required
                  />
                </div>

                {/* Session Type */}
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Session Delivery Format</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setModuleForm({ ...moduleForm, sessionType: 'RECORDED' })}
                      className={`p-3 rounded-xl border flex items-center gap-2 font-bold transition-all text-xs ${
                        moduleForm.sessionType === 'RECORDED'
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>Recorded Bite (2 Min)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModuleForm({ ...moduleForm, sessionType: 'LIVE' })}
                      className={`p-3 rounded-xl border flex items-center gap-2 font-bold transition-all text-xs ${
                        moduleForm.sessionType === 'LIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                      <span>Live Masterclass</span>
                    </button>
                  </div>
                </div>

                {moduleForm.sessionType === 'RECORDED' ? (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <label className="block text-slate-700 font-bold">Video URL (MP4 / Stream / YouTube)</label>
                    <input
                      type="url"
                      value={moduleForm.videoUrl}
                      onChange={(e) => setModuleForm({ ...moduleForm, videoUrl: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="text-[11px] text-slate-500">Duration: 120 Seconds (2-minute frontline bite)</div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-2">
                    <label className="block text-slate-700 font-bold">Live Stream / Meeting Link (Jitsi / Zoom / Stream)</label>
                    <input
                      type="url"
                      value={moduleForm.liveSessionUrl}
                      onChange={(e) => setModuleForm({ ...moduleForm, liveSessionUrl: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-0.5">Start Time</label>
                        <input
                          type="datetime-local"
                          value={moduleForm.liveStartTime}
                          onChange={(e) => setModuleForm({ ...moduleForm, liveStartTime: e.target.value })}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-0.5">Instructor Name</label>
                        <input
                          type="text"
                          value={moduleForm.liveInstructor}
                          onChange={(e) => setModuleForm({ ...moduleForm, liveInstructor: e.target.value })}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Workforce Sector</label>
                    <select
                      value={moduleForm.sector}
                      onChange={(e) => setModuleForm({ ...moduleForm, sector: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                    >
                      {SECTORS_LIST.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.icon} {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Skill Tier</label>
                    <select
                      value={moduleForm.skillTier}
                      onChange={(e) => setModuleForm({ ...moduleForm, skillTier: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                    >
                      {SKILL_TIERS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
                    <FileCheck className="w-4 h-4" />
                    <span>Attach Practical Photo Proof Assignment</span>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Assignment Title</label>
                    <input
                      type="text"
                      value={moduleForm.assignmentTitle}
                      onChange={(e) => setModuleForm({ ...moduleForm, assignmentTitle: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Instructions</label>
                    <textarea
                      rows={2}
                      value={moduleForm.assignmentInstructions}
                      onChange={(e) => setModuleForm({ ...moduleForm, assignmentInstructions: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  Publish Session to Catalog
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Course Title</label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Electrical Transformer Substation Safety"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Category</label>
                    <select
                      value={courseForm.category}
                      onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                    >
                      <option value="EHS">EHS (Safety)</option>
                      <option value="MACHINE_SOP">Machine SOP</option>
                      <option value="QUALITY_5S">Quality 5S</option>
                      <option value="CONDUCT">Workplace Conduct</option>
                      <option value="DIGITAL_LITERACY">Digital Literacy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Workforce Sector</label>
                    <select
                      value={courseForm.sector}
                      onChange={(e) => setCourseForm({ ...courseForm, sector: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                    >
                      {SECTORS_LIST.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.icon} {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Skill Tier</label>
                  <select
                    value={courseForm.skillTier}
                    onChange={(e) => setCourseForm({ ...courseForm, skillTier: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  >
                    {SKILL_TIERS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Description</label>
                  <textarea
                    rows={3}
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                    placeholder="Objectives and competencies..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  Save Course Curriculum
                </button>
              </form>
            )}
          </div>

          {/* Right: Published Courses & Sessions List */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Active Published Courses ({courses.length})</span>
              </h2>
              <span className="text-xs text-slate-500">Live for Students & Workers</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs">Loading courses...</div>
            ) : (
              <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-1">
                {courses.map((course) => (
                  <div key={course.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                            {course.category}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                            {course.sector}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mt-1">{course.title}</h3>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        {course.modules?.length || 0} Sessions
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {course.modules?.map((m: any) => (
                        <div
                          key={m.id}
                          className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            {m.sessionType === 'LIVE' ? (
                              <span className="p-1 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1 text-[10px]">
                                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                                LIVE
                              </span>
                            ) : (
                              <span className="p-1 rounded bg-blue-100 text-blue-800 font-bold flex items-center gap-1 text-[10px]">
                                <PlayCircle className="w-3 h-3 text-blue-600" />
                                VIDEO
                              </span>
                            )}
                            <span className="font-semibold text-slate-800 line-clamp-1">{m.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">{m.skillTier}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
