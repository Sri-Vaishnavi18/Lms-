'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Zap,
  Star,
  Camera,
  Check,
  Building2,
  Phone,
  Volume2,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SECTORS_LIST, SKILL_TIERS, INDIAN_LANGUAGES } from '../lib/languages';
import { COURSES_CATALOG, CatalogCourse } from '../lib/coursesData';

function HomePageContent() {
  const router = useRouter();
  const [selectedSector, setSelectedSector] = useState<string>('CONSTRUCTION');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'POPULAR' | 'TIERS' | 'PHOTO'>('POPULAR');

  // Filter courses from catalog
  const filteredCourses = COURSES_CATALOG.filter((c) => {
    const matchesSector = !selectedSector || c.sector === selectedSector;
    const matchesTier = !selectedTier || c.skillTier === selectedTier;
    const matchesSearch =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sectorLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesTier && matchesSearch;
  });

  const activeSectorObj = SECTORS_LIST.find((s) => s.id === selectedSector) || SECTORS_LIST[0];

  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-900">
      <Navbar />

      {/* 1. HERO BANNER: UDEMY + COURSERA AUTHENTIC DESIGN */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Bold Headline & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-black uppercase tracking-wider">
              <HardHat className="w-4 h-4 text-amber-300" />
              <span>National Frontline & Technical Workforce LMS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Skills That Build India. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-blue-400">
                Real Certifications. Verified Wages.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Standardized vocational curriculum, live masterclasses, and certified skill passports across 7 core industrial sectors. Powered by 11 Indian native languages with voiceover narration.
            </p>

            {/* Udemy/Coursera Universal Search Bar */}
            <div className="max-w-xl bg-white p-2 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-200">
              <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
              <input
                type="text"
                placeholder="Search trade skills, machine SOPs (e.g. Scaffolding, Forklift, LOTO)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-900 focus:outline-none placeholder-slate-400 font-medium"
              />
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
              >
                Search
              </button>
            </div>

            {/* Dual Core CTAs: YouTube Shorts vs Udemy Courses */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/shorts"
                className="px-6 py-3.5 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm rounded-xl shadow-xl transition-transform active:scale-95 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Launch YouTube Shorts (9:16 Feed)</span>
              </Link>

              <Link
                href="/courses"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <span>Browse Full Courses (Udemy Catalog)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/worker/dashboard"
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <HardHat className="w-4 h-4 text-amber-300" />
                <span>Worker Portal</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Live Masterclass Card + Shorts Quick Glance */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Live Masterclass Card */}
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-3xl p-6 text-white space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Next Certified Live Masterclass</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  SCHEDULED TODAY
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 uppercase font-bold">
                  Manufacturing & Technical
                </span>
                <h3 className="text-lg font-black mt-2 text-white leading-snug">
                  High-Voltage LOTO & Stored Pressure Bleed Safety
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Instructor: Er. Rajesh Kulkarni (Chief Safety Inspector • National Safety Council)
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
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
                <span>Join Live Masterclass Streaming</span>
              </a>
            </div>

            {/* Quick Shorts Teaser Card */}
            <div className="p-4 bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-500/30 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black">
                  ⚡
                </div>
                <div>
                  <h4 className="font-black text-white text-xs">Short on Time? Watch as Shorts</h4>
                  <p className="text-[11px] text-slate-300">45-second vertical video SOPs with 30s quizzes</p>
                </div>
              </div>
              <Link
                href="/shorts"
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
              >
                Watch →
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 2. TRUST & ACCREDITATION STRIP (Coursera Style) */}
      <section className="bg-slate-50 border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6 text-center text-xs">
          <div>
            <div className="text-2xl font-black text-blue-600">7 Core Sectors</div>
            <div className="text-slate-500 font-semibold mt-0.5">Construction to Hospitality</div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">11 Languages</div>
            <div className="text-slate-500 font-semibold mt-0.5">Native Vernacular + Voiceover</div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-600">4 Skill Tiers</div>
            <div className="text-slate-500 font-semibold mt-0.5">Unskilled to Master Lead</div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">Wage Incentives</div>
            <div className="text-slate-500 font-semibold mt-0.5">+₹1,200 to +₹3,200/mo allowance</div>
          </div>
          <div>
            <div className="text-2xl font-black text-rose-600">100% Offline</div>
            <div className="text-slate-500 font-semibold mt-0.5">IndexedDB Sync for Basements</div>
          </div>
        </div>
      </section>

      {/* 3. UDEMY SIGNATURE COURSE SELECTOR: "A Broad Selection of Courses" */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        
        <div>
          <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
            Curated Vocational Catalog
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            A Broad Selection of Frontline Trade Courses
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose from industry-certified microlearning modules, SOP demonstrations, and hands-on site photo assignments
          </p>
        </div>

        {/* 7-Sector Horizontal Tab Selector (Udemy Category Strip) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
          {SECTORS_LIST.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSector(s.id)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 border ${
                selectedSector === s.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Sub-Filters: Skill Tiers Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedTier('')}
              className={`px-3 py-1 rounded-lg font-bold border transition-colors ${
                selectedTier === ''
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Tiers
            </button>
            {SKILL_TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`px-3 py-1 rounded-lg font-bold border transition-colors ${
                  selectedTier === tier.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tier.label.split(':')[0]}
              </button>
            ))}
          </div>

          <Link
            href="/courses"
            className="text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            <span>Explore All {COURSES_CATALOG.length} Courses</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* UDEMY-STYLE COURSE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-200">
              No courses found for this sector and tier combination. Clear your filters.
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Card Thumbnail */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Bestseller Badge (Udemy Style) */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                        Bestseller
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${course.tierBadgeClass}`}>
                        {course.tierLabel}
                      </span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono font-bold backdrop-blur-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{course.totalDurationMinutes} Min</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-black text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {course.subtitle}
                      </p>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 pt-1">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                      <span className="text-[11px] font-bold text-slate-700 truncate">
                        {course.instructor.name}
                      </span>
                      <span className="text-[10px] text-slate-400">• {course.instructor.organization}</span>
                    </div>

                    {/* Ratings & Enrollments */}
                    <div className="flex items-center gap-2 text-xs pt-1">
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        ({course.reviewsCount.toLocaleString()})
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{course.enrolledCount.toLocaleString()} enrolled</span>
                      </span>
                    </div>

                    {/* Wage Incentive Milestone Callout */}
                    <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2 text-[11px] text-amber-900">
                      <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Career & Wage Unlock:</span>
                        <span className="text-amber-800 text-[10px] leading-tight">
                          {course.wageIncentive}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Dual Actions */}
                <div className="p-5 pt-0 border-t border-slate-100 flex items-center gap-2 mt-2">
                  <Link
                    href={`/shorts?sector=${course.sector}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    title="Watch as vertical 9:16 video bite"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Watch Short</span>
                  </Link>

                  <Link
                    href={`/courses/${course.id}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 4. COURSERA SPECIALIZATION PATHWAYS: 4-TIER CAREER LADDER */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
              From Induction to Master Lead
            </span>
            <h2 className="text-3xl font-black text-white">
              The 4-Tier Frontline Career & Wage Progression Ladder
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear milestone progression. Complete microlearning bytes and certified supervisor audits to unlock higher wage grades.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Tier 1 */}
            <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs">
                  T1
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">BRONZE ID</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Tier 1: Unskilled</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Basic site safety induction, 100% PPE compliance, zero energy awareness.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-700 text-xs">
                <span className="text-slate-400 block text-[10px]">Verification:</span>
                <strong className="text-white">Spot-the-Hazard Touch Quiz</strong>
                <span className="text-amber-300 block text-[11px] font-bold mt-1">→ Jobsite Entry Pass</span>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-blue-400 text-slate-950 font-black flex items-center justify-center text-xs">
                  T2
                </span>
                <span className="text-[10px] font-mono text-blue-400 font-bold">SILVER ID</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Tier 2: Semi-Skilled</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Equipment pre-shift SOPs, forklift reverse check, machine guard clearance.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-700 text-xs">
                <span className="text-slate-400 block text-[10px]">Verification:</span>
                <strong className="text-white">Visual Quiz + 1 Photo Proof</strong>
                <span className="text-emerald-400 block text-[11px] font-bold mt-1">→ +₹1,200 to ₹1,500/mo</span>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-indigo-400 text-slate-950 font-black flex items-center justify-center text-xs">
                  T3
                </span>
                <span className="text-[10px] font-mono text-indigo-400 font-bold">GOLD ID</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Tier 3: Skilled</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Lockout-Tagout (LOTO), arc flash PPE, complex machinery operations.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-700 text-xs">
                <span className="text-slate-400 block text-[10px]">Verification:</span>
                <strong className="text-white">Photo Proof + Voice Note</strong>
                <span className="text-emerald-400 block text-[11px] font-bold mt-1">→ +₹2,000 to ₹2,500/mo</span>
              </div>
            </div>

            {/* Tier 4 */}
            <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-purple-400 text-slate-950 font-black flex items-center justify-center text-xs">
                  T4
                </span>
                <span className="text-[10px] font-mono text-purple-400 font-bold">MASTER ID</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Tier 4: Highly-Skilled</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Toolbox talk coaching, substation diagnostics, emergency response.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-700 text-xs">
                <span className="text-slate-400 block text-[10px]">Verification:</span>
                <strong className="text-white">Supervisor Digital Signature</strong>
                <span className="text-emerald-400 block text-[11px] font-bold mt-1">→ +₹3,200/mo Lead Grade</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SOLVING TRADITIONAL LMS (iGOT KARMAYOGI) FAILURES */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
            Frontline Usability Revolution
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            Why LMS 360 Succeeds Where Traditional LMSs Fail
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Fixing the systemic flaws of iGOT Karmayogi, Moodle, and university portals that alienate frontline blue-collar workers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
              📱
            </div>
            <h3 className="font-bold text-base text-slate-900">Zero-Email Phone & Badge SSO</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Frontline workers do not have corporate emails. LMS 360 allows instant 1-second sign-in using phone OTP or physical employee QR badge scan.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl">
              ⚡
            </div>
            <h3 className="font-bold text-base text-slate-900">YouTube Shorts 9:16 Video Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Replaces 45-page bureaucratic PDFs and 1-hour slides with 45–60 second vertical demonstrations showing split-screen Wrong ❌ vs Right ✔️ cues.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
              📸
            </div>
            <h3 className="font-bold text-base text-slate-900">Practical Field Proof (Anti-Cheat)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stops the "click-next" guessing endemic to multiple choice quizzes. Requires actual site photos and voice note explanations signed off by shift supervisors.
            </p>
          </div>

        </div>

      </section>

      {/* 6. BOTTOM CALL-TO-ACTION BANNER */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Ready to Train Your Frontline Crew?</h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Join thousands of certified operators, shift supervisors, and safety leads across India.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/signup"
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95"
            >
              Sign Up as Worker
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 backdrop-blur-sm transition-all"
            >
              Supervisor Login
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-500 font-bold">Loading LMS 360...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
