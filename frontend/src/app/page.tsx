'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HardHat,
  Search,
  PlayCircle,
  Radio,
  Award,
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  QrCode,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { fetchApi } from '../lib/api';
import { SECTORS_LIST, SKILL_TIERS } from '../lib/languages';

export default function HomePage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>('CONSTRUCTION');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/modules')
      .then((data) => setCourses(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const allModules = courses.flatMap((c) =>
    (c.modules || []).map((m: any) => ({
      ...m,
      courseTitle: c.title,
      courseCategory: c.category,
      courseSector: c.sector || m.sector,
    }))
  );

  const filteredModules = allModules.filter((m) => {
    const matchesSector = !selectedSector || m.courseSector === selectedSector;
    const matchesSearch =
      !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const liveSessions = allModules.filter((m) => m.sessionType === 'LIVE');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      {/* Hero Section (Udemy / Amity Online / iGOT Karmayogi style) */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
              <HardHat className="w-4 h-4 text-amber-300" />
              <span>National Frontline & Vocational LMS Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Skills, Safety & Masterclasses for India's Workforce
            </h1>

            <p className="text-base sm:text-lg text-blue-100 max-w-2xl leading-relaxed">
              Industry-aligned vocational microlearning, live masterclasses, and certified practical skill passports across 7 core sectors. 11 Indian native languages with audio narration.
            </p>

            {/* Global Search Bar */}
            <div className="max-w-xl bg-white p-2 rounded-2xl shadow-xl flex items-center gap-2 border border-blue-200">
              <Search className="w-5 h-5 text-slate-400 ml-2" />
              <input
                type="text"
                placeholder="Search courses, trade skills, machine SOPs (e.g. Scaffolding, Forklift, CNC)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
              />
              <button
                onClick={() => {}}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex-shrink-0"
              >
                Search
              </button>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/worker/dashboard"
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <span>Enter My Learning Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/users"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Suite & Roster</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Card: Live & Milestone Snapshot */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Next Live Session</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                SCHEDULED
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 uppercase font-bold">
                Manufacturing & Machining
              </span>
              <h3 className="text-lg font-black mt-2 text-white leading-snug">
                Live Workshop: High-Voltage LOTO & Stored Pressure Bleed
              </h3>
              <p className="text-xs text-blue-200 mt-1">
                Instructor: Er. Rajesh Kulkarni (Chief Safety Inspector)
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/40 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>Live Interactive Q&A</span>
              </div>
              <span className="font-mono text-amber-300 font-bold">Today, 2:00 PM</span>
            </div>

            <a
              href="https://meet.jit.si/LMS360-Live-Safety-Session"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Radio className="w-4 h-4" />
              <span>Join Live Masterclass Now</span>
            </a>
          </div>

        </div>
      </section>

      {/* Key Metric Strip */}
      <section className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600">7 Sectors</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Construction to Hospitality</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">11 Languages</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Indian Native Vernacular + Audio</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600">Dual Proof</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Visual Quiz + Practical OJT Audit</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-600">100% Offline</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Dexie IndexedDB Sync Engine</div>
          </div>
        </div>
      </section>

      {/* 7 Core Workforce Sectors Navigator */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
              Comprehensive Workforce Taxonomy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Browse Curriculum by Industrial Sector
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tailored modules, hazard assessments, and equipment SOPs for each frontline trade
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {SECTORS_LIST.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSector(s.id)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap border transition-all flex items-center gap-1.5 ${
                  selectedSector === s.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Course / Module Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {loading ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-sm">
              Loading curriculum catalog...
            </div>
          ) : filteredModules.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm bg-white rounded-3xl border border-slate-200">
              No modules found for this sector. Select another sector or clear your search query.
            </div>
          ) : (
            filteredModules.map((m: any) => (
              <div
                key={m.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Card Top / Thumbnail */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80"
                    alt={m.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {m.sessionType === 'LIVE' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Radio className="w-3 h-3 animate-pulse" />
                        LIVE
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <PlayCircle className="w-3 h-3" />
                        MICROLEARNING
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-mono backdrop-blur-xs">
                      {Math.round(m.durationSeconds / 60)} Min
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase text-amber-300">
                      {m.courseCategory} • {m.skillTier || 'UNSKILLED'}
                    </span>
                    <h3 className="font-black text-sm text-white line-clamp-1 leading-snug">
                      {m.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block line-clamp-1">
                      Part of: {m.courseTitle}
                    </span>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      Interactive video bite with visual Wrong ❌ vs Right ✔️ cues and certified practical assessment.
                    </p>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">
                      {m.assignments?.length ? 'Includes Photo Proof' : 'Spot-the-Hazard Quiz'}
                    </span>

                    <Link
                      href={`/worker/learn/${m.id}`}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span>Start Module</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Comparison Section (Fixing Karmayogi & Amity Gaps) */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
              Solving Legacy LMS Failure Modes
            </span>
            <h2 className="text-3xl font-black text-slate-900">
              Why LMS 360 Succeeds Where Traditional Systems Fail
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Standard LMS platforms (including government initiatives like iGOT Karmayogi and university portals like Amity Online) fail frontline workers due to text bureaucracy and lack of practical verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                📱
              </div>
              <h3 className="font-bold text-slate-900 text-base">Zero-Email Phone & Badge SSO</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Frontline operators do not have corporate email addresses. LMS 360 allows instant 1-second sign-in using phone OTP or physical employee QR badge scan.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                🛠️
              </div>
              <h3 className="font-bold text-slate-900 text-base">Point-of-Work Equipment JIT SOPs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rather than searching an endless course catalog, workers scan the weatherproof QR sticker on machinery to launch a 45-second micro-SOP immediately before operating.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                ✍️
              </div>
              <h3 className="font-bold text-slate-900 text-base">Practical Verification (Anti-Cheat)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stops the "click-next" cheating endemic to online tests. Combines interactive Spot-the-Hazard image touch canvases with in-person supervisor physical observation sign-off.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
