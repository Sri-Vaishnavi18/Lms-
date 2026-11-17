'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  HardHat,
  Filter,
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
  Zap,
  Star,
  BookOpen,
  Camera,
  Layers,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SECTORS_LIST, SKILL_TIERS, INDIAN_LANGUAGES } from '../../lib/languages';
import { fetchApi } from '../../lib/api';

import { COURSES_CATALOG, CatalogCourse } from '../../lib/coursesData';

function CourseCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSector = searchParams.get('sector') || '';
  const initialTier = searchParams.get('tier') || '';

  const [selectedSector, setSelectedSector] = useState<string>(initialSector);
  const [selectedTier, setSelectedTier] = useState<string>(initialTier);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterAssignmentOnly, setFilterAssignmentOnly] = useState<boolean>(false);

  // Filter courses
  const filteredCourses = COURSES_CATALOG.filter((course) => {
    const matchesSector = !selectedSector || course.sector === selectedSector;
    const matchesTier = !selectedTier || course.skillTier === selectedTier;
    const matchesAssignment = !filterAssignmentOnly || course.hasPracticalAssignment;
    const matchesSearch =
      !searchQuery ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.sectorLabel.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSector && matchesTier && matchesAssignment && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      {/* Hero Header (Udemy / Coursera style banner) */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-2">
                <HardHat className="w-3.5 h-3.5 text-amber-300" />
                <span>Udemy & Coursera Grade Vocational Catalog</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Vocational Curriculum & Skill Certifications
              </h1>
              <p className="text-sm text-blue-200 mt-1 max-w-2xl">
                Explore standardized trade skills across 7 frontline industries. Complete video lessons, spot-the-hazard quizzes, and practical site photos to unlock certified wage bonuses.
              </p>
            </div>

            {/* Quick Link to YouTube Shorts Vertical Feed */}
            <Link
              href="/shorts"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs shadow-xl flex items-center gap-2 transition-transform active:scale-95 shrink-0"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Switch to YouTube Shorts Feed</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl bg-white p-2 rounded-2xl shadow-2xl flex items-center gap-2 border border-blue-200">
            <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
            <input
              type="text"
              placeholder="Search by trade, machine SOP, skill tier, or instructor (e.g. Forklift, LOTO, Scaffolding)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm text-slate-900 focus:outline-none placeholder-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 font-bold"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => {}}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* FILTER BAR 1: 7 SECTOR HORIZONTAL TABS */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedSector('')}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap border transition-all flex items-center gap-1.5 ${
                selectedSector === ''
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>🌐 All 7 Sectors</span>
            </button>

            {SECTORS_LIST.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSector(s.id)}
                className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap border transition-all flex items-center gap-1.5 ${
                  selectedSector === s.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FILTER BAR 2: SKILL TIERS & OPTIONS */}
      <section className="bg-slate-100/70 border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Skill Tier Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mr-1 hidden sm:inline">
              Skill Tier:
            </span>
            <button
              onClick={() => setSelectedTier('')}
              className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                selectedTier === ''
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Tiers
            </button>
            {SKILL_TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                  selectedTier === tier.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tier.label.split(':')[0]}
              </button>
            ))}
          </div>

          {/* Toggle Practical Assignment Filter */}
          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
            <input
              type="checkbox"
              checked={filterAssignmentOnly}
              onChange={(e) => setFilterAssignmentOnly(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="flex items-center gap-1 text-xs">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>Includes Practical Photo Assignment</span>
            </span>
          </label>
        </div>
      </section>

      {/* MAIN COURSE CATALOG GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-6">
        
        {/* Results Counter & Sector Summary */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500 font-semibold">
            Showing <strong className="text-slate-900">{filteredCourses.length}</strong> vocational courses
            {selectedSector && (
              <span> in <strong className="text-blue-600">{SECTORS_LIST.find((s) => s.id === selectedSector)?.label}</strong></span>
            )}
            {selectedTier && <span> ({selectedTier})</span>}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Sort:</span>
            <select className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none">
              <option>Most Popular (Enrolled)</option>
              <option>Highest Rated (Stars)</option>
              <option>Duration: Short to Long</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <h3 className="font-bold text-slate-800 text-base">No courses match your filter criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try resetting your search query or choosing another sector or skill tier.
            </p>
            <button
              onClick={() => {
                setSelectedSector('');
                setSelectedTier('');
                setSearchQuery('');
                setFilterAssignmentOnly(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Sector & Tier Badges Overlay */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-white/10">
                        <span>{course.sectorIcon}</span>
                        <span>{course.sectorLabel}</span>
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

                  {/* Course Card Body */}
                  <div className="p-5 space-y-3">
                    
                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="font-black text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {course.subtitle}
                      </p>
                    </div>

                    {/* Instructor Info */}
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

                    {/* Rating & Enrollment Metrics */}
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

                    {/* Wage Incentive Milestone Callout (Unique Value Prop) */}
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

                {/* Footer Action Buttons */}
                <div className="p-5 pt-0 border-t border-slate-100 flex items-center gap-2 mt-2">
                  
                  {/* Option 1: Watch in YouTube Shorts Mode */}
                  <Link
                    href={`/shorts?sector=${course.sector}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    title="Watch vertical bite-sized clips for this trade"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Shorts Feed</span>
                  </Link>

                  {/* Option 2: Coursera/Udemy Syllabus Player */}
                  <Link
                    href={`/courses/${course.id}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function CoursesCatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-bold">Loading Course Catalog...</div>}>
      <CourseCatalogContent />
    </Suspense>
  );
}
