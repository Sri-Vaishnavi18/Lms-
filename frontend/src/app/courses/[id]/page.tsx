'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  Circle,
  Clock,
  Award,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Camera,
  Mic,
  Send,
  Zap,
  HelpCircle,
  FileCheck,
  HardHat,
  ArrowLeft,
  ArrowRight,
  Share2,
  Download,
  AlertTriangle,
  Radio,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { COURSES_CATALOG, CatalogCourse, CourseQuiz } from '../../../lib/coursesData';
import { ShortVideo } from '../../../lib/shortsData';
import { INDIAN_LANGUAGES } from '../../../lib/languages';

function CourseHubContent() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const course: CatalogCourse =
    COURSES_CATALOG.find((c) => c.id === courseId) || COURSES_CATALOG[0];

  // Active Hub Tab: 'LESSONS' | 'SHORTS' | 'QUIZZES' | 'ASSIGNMENT' | 'PASSPORT'
  const [activeTab, setActiveTab] = useState<'LESSONS' | 'SHORTS' | 'QUIZZES' | 'ASSIGNMENT' | 'PASSPORT'>('LESSONS');

  // Video Lecture State
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(180);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hi');
  const [isNarrating, setIsNarrating] = useState<boolean>(false);

  // Completed Lessons State
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({
    [course.modules[0]?.id || 'm-1']: true,
  });

  // Course Shorts State (Tab 2)
  const [activeShortIndex, setActiveShortIndex] = useState<number>(0);
  const courseShorts: ShortVideo[] = course.relatedShorts || [];
  const currentShort: ShortVideo = courseShorts[activeShortIndex] || courseShorts[0];
  const [shortLikes, setShortLikes] = useState<Record<string, number>>({});
  const [shortLikedMap, setShortLikedMap] = useState<Record<string, boolean>>({});
  const [shortBadgeModal, setShortBadgeModal] = useState<'WRONG' | 'RIGHT' | null>(null);

  // Quizzes State (Tab 3)
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(0);
  const courseQuizzes: CourseQuiz[] = course.relatedQuizzes || [];
  const currentQuiz: CourseQuiz = courseQuizzes[activeQuizIndex] || courseQuizzes[0];
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Practical Assignment State (Tab 4)
  const [assignmentPhotoUrl, setAssignmentPhotoUrl] = useState<string>('');
  const [assignmentVoiceRecorded, setAssignmentVoiceRecorded] = useState<boolean>(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceSeconds, setVoiceSeconds] = useState<number>(0);
  const [assignmentSubmitted, setAssignmentSubmitted] = useState<boolean>(false);
  const [assignmentNotes, setAssignmentNotes] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shortVideoRef = useRef<HTMLVideoElement | null>(null);
  const activeLesson = course.modules[activeLessonIndex] || course.modules[0];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lms_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.preferredLanguage) setSelectedLanguage(parsed.preferredLanguage);
        } catch (e) {}
      }
    }
  }, []);

  // Voice recording timer
  useEffect(() => {
    let t: any;
    if (isRecordingVoice) {
      t = setInterval(() => setVoiceSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(t);
  }, [isRecordingVoice]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) videoRef.current.currentTime = val;
  };

  const markLessonComplete = (modId: string) => {
    setCompletedLessons((prev) => ({ ...prev, [modId]: true }));
  };

  // Vernacular Speech Narration via Web Speech API
  const speakVernacularSummary = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onstart = () => setIsNarrating(true);
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAssignmentSubmitted(true);
    markLessonComplete(activeLesson.id);
  };

  const completedCount = Object.keys(completedLessons).filter((k) => completedLessons[k]).length;
  const progressPercent = Math.round((completedCount / course.modules.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      {/* TOP HEADER: COURSE IDENTITY & MULTI-TAB SWITCHER */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link href="/courses" className="hover:text-white flex items-center gap-1 font-bold">
                <ArrowLeft className="w-4 h-4" />
                <span>All Courses</span>
              </Link>
              <span>/</span>
              <span className="text-blue-400 font-bold">{course.sectorLabel}</span>
              <span>/</span>
              <span className="text-amber-400 font-mono font-bold">{course.tierLabel}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {course.title}
            </h1>
          </div>

          {/* Persistent Vernacular Language Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-slate-400 font-bold uppercase hidden sm:inline">Audio:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-800 text-amber-300 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-black cursor-pointer focus:outline-none"
            >
              {INDIAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* 5-TAB UNIFIED COURSE NAVIGATION BAR */}
        <div className="max-w-7xl mx-auto mt-4 pt-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs font-bold no-scrollbar">
          
          <button
            onClick={() => setActiveTab('LESSONS')}
            className={`py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'LESSONS'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>📚 Course Lessons & SOPs ({course.modules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SHORTS')}
            className={`py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'SHORTS'
                ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md'
                : 'bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/40'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Course Shorts 9:16 Reels ({courseShorts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('QUIZZES')}
            className={`py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'QUIZZES'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Related Quizzes ({courseQuizzes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ASSIGNMENT')}
            className={`py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ASSIGNMENT'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Practical Photo Proof</span>
            {assignmentSubmitted && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>

          <button
            onClick={() => setActiveTab('PASSPORT')}
            className={`py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'PASSPORT'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Skill Passport & Wage Unlock</span>
          </button>

        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        
        {/* ======================================================== */}
        {/* TAB 1: COURSE LESSONS & STICKY SYLLABUS (Udemy Style) */}
        {/* ======================================================== */}
        {activeTab === 'LESSONS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: 16:9 Video Classroom Player */}
            <div className="lg:col-span-8 space-y-5">
              
              <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 group">
                <video
                  ref={videoRef}
                  src={activeLesson.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                  poster={course.thumbnailUrl}
                  onTimeUpdate={handleTimeUpdate}
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />

                {/* Center Play Overlay */}
                <div
                  onClick={togglePlayPause}
                  className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer"
                >
                  {!isPlaying && (
                    <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 ml-1 fill-white" />
                    </div>
                  )}
                </div>

                {/* Scrubber & Controls */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col gap-2">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-700 accent-blue-500 rounded-full cursor-pointer"
                  />

                  <div className="flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-3">
                      <button onClick={togglePlayPause} className="hover:text-blue-400">
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                      </button>
                      <button onClick={() => setIsMuted(!isMuted)} className="hover:text-blue-400">
                        {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <span className="font-mono text-[11px] text-slate-300">
                        {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} /{' '}
                        {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakVernacularSummary(`${activeLesson.title}. ${course.subtitle}`)}
                        className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1"
                      >
                        <span>🔊 Tap to Listen</span>
                        {isNarrating && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                    Lesson {activeLessonIndex + 1} of {course.modules.length} • {activeLesson.type}
                  </span>
                  <h2 className="text-xl font-black text-white mt-0.5">{activeLesson.title}</h2>
                </div>

                <button
                  onClick={() => markLessonComplete(activeLesson.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    completedLessons[activeLesson.id]
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{completedLessons[activeLesson.id] ? 'Lesson Completed ✓' : 'Mark Completed'}</span>
                </button>
              </div>

              {/* Instructor & Standards */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">{course.instructor.name}</span>
                    <span className="text-[11px] text-slate-400 block">{course.instructor.role} • {course.instructor.organization}</span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  <span className="block font-bold text-emerald-400">OSHA & IS 3696 Compliant</span>
                  <span>100% Practical Verification</span>
                </div>
              </div>

            </div>

            {/* Right: Sticky Udemy Syllabus Drawer */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Progress Card */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Course Progress</span>
                  <span className="font-mono font-black text-emerald-400">{progressPercent}%</span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{completedCount} of {course.modules.length} lessons finished</span>
                  <span className="text-amber-300 font-bold">{course.tierLabel}</span>
                </div>
              </div>

              {/* Collapsible Syllabus List */}
              <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-4 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-black text-xs text-white uppercase tracking-wider">
                    Course Curriculum
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {course.totalDurationMinutes} mins total
                  </span>
                </div>

                <div className="divide-y divide-slate-800">
                  {course.modules.map((mod, idx) => {
                    const isActive = activeLessonIndex === idx;
                    const isComplete = completedLessons[mod.id];

                    return (
                      <button
                        key={mod.id}
                        onClick={() => {
                          setActiveLessonIndex(idx);
                          if (mod.type === 'QUIZ') setActiveTab('QUIZZES');
                          if (mod.type === 'ASSIGNMENT') setActiveTab('ASSIGNMENT');
                        }}
                        className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
                          isActive
                            ? 'bg-blue-600/20 border-l-4 border-blue-500'
                            : 'hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isComplete ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500" />
                          )}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>{mod.type}</span>
                            <span>{mod.durationMinutes} min</span>
                          </div>
                          <h4 className={`text-xs font-bold leading-snug ${isActive ? 'text-white' : 'text-slate-300'}`}>
                            {mod.title}
                          </h4>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wage Incentive Banner */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase">
                  <Award className="w-4 h-4" />
                  <span>Wage Incentive Unlock</span>
                </div>
                <p className="text-xs text-amber-200/90 font-medium leading-relaxed">
                  {course.wageIncentive}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: COURSE RELATED SHORTS (9:16 Vertical Video Reels) */}
        {/* ======================================================== */}
        {activeTab === 'SHORTS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                  Vertical 9:16 Microlearning Feed
                </span>
                <h2 className="text-xl font-black text-white">
                  Course Shorts: 45-60s Practical Video Reels
                </h2>
                <p className="text-xs text-slate-400">
                  Every short directly demonstrates a technique or safety SOP from this course.
                </p>
              </div>

              <Link
                href={`/shorts?sector=${course.sector}`}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shrink-0 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Open Fullscreen Shorts Engine</span>
              </Link>
            </div>

            {courseShorts.length === 0 ? (
              <div className="py-16 text-center text-slate-400 bg-slate-900 rounded-3xl border border-slate-800">
                No Shorts available for this course yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseShorts.map((short, idx) => (
                  <div
                    key={short.id}
                    className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all"
                  >
                    {/* 9:16 Aspect Ratio Card Container */}
                    <div className="relative aspect-[9/14] bg-black overflow-hidden flex items-center justify-center">
                      <img
                        src={short.posterUrl}
                        alt={short.title}
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-white" />
                          <span>Short</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-mono">
                          {short.durationSeconds}s
                        </span>
                      </div>

                      {/* Center Play Button that opens the Fullscreen Shorts Player */}
                      <Link
                        href={`/shorts?id=${short.id}`}
                        className="w-14 h-14 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl transition-transform active:scale-95 z-20"
                      >
                        <Play className="w-7 h-7 ml-1 fill-white" />
                      </Link>

                      {/* Bottom Info Overlay */}
                      <div className="absolute bottom-3 inset-x-3 space-y-2 text-white">
                        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                          {short.tierLabel}
                        </span>
                        <h3 className="font-black text-sm text-white line-clamp-2 leading-snug">
                          {short.title}
                        </h3>

                        {/* Wrong vs Right Mini Badges */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-bold">
                          <span className="p-1 rounded bg-rose-950/80 border border-rose-500 text-rose-300 truncate">
                            ❌ {short.wrongWay.title}
                          </span>
                          <span className="p-1 rounded bg-emerald-950/80 border border-emerald-500 text-emerald-300 truncate">
                            ✔️ {short.rightWay.title}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px] font-bold">
                        ❤️ {short.likesCount} Helpful Votes
                      </span>
                      <Link
                        href={`/shorts?id=${short.id}`}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-rose-600 text-white rounded-xl font-bold transition-colors flex items-center gap-1 text-xs"
                      >
                        <span>Play Short</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: COURSE RELATED QUIZZES & ASSESSMENTS */}
        {/* ======================================================== */}
        {activeTab === 'QUIZZES' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                Anti-Cheat Micro-Assessment
              </span>
              <h2 className="text-xl font-black text-white">
                Course Quizzes & Spot-the-Hazard Tests
              </h2>
              <p className="text-xs text-slate-400">
                Interactive questions specifically testing the safety protocols of this course.
              </p>
            </div>

            {currentQuiz && (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                      {currentQuiz.type}
                    </span>
                    <h3 className="font-bold text-sm text-white">{currentQuiz.title}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">+50 Skill Points</span>
                </div>

                {/* Quiz Visual Image */}
                {currentQuiz.imageUrl && (
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-800 bg-black">
                    <img
                      src={currentQuiz.imageUrl}
                      alt="Hazard quiz scene"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <p className="font-black text-base text-white leading-snug">
                  {currentQuiz.question}
                </p>

                {/* Options List */}
                <div className="space-y-2.5 text-xs">
                  {currentQuiz.options.map((opt, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const showResult = selectedQuizOption !== null;

                    let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500';
                    if (showResult) {
                      if (opt.isCorrect) btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                      else if (isSelected && !opt.isCorrect) btnStyle = 'bg-rose-950 border-rose-500 text-rose-200 font-bold';
                      else btnStyle = 'bg-slate-800/40 border-slate-800 text-slate-500';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={showResult}
                        onClick={() => {
                          setSelectedQuizOption(idx);
                          if (opt.isCorrect) setQuizScore((s) => s + 50);
                        }}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <div className="flex-1">
                          <span>{opt.text}</span>
                          {showResult && isSelected && (
                            <p className="text-[11px] mt-1 font-normal opacity-90">{opt.explanation}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Result Banner */}
                {selectedQuizOption !== null && (
                  <div
                    className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between ${
                      currentQuiz.options[selectedQuizOption]?.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    <span>
                      {currentQuiz.options[selectedQuizOption]?.isCorrect
                        ? '🎯 Correct! +50 Skill Points Recorded for Digital Passport'
                        : '⚠️ Incorrect! Review the course lesson above.'}
                    </span>
                    <button
                      onClick={() => setSelectedQuizOption(null)}
                      className="px-3 py-1 bg-white text-slate-950 font-black text-xs rounded-xl"
                    >
                      Try Again
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: PRACTICAL PHOTO PROOF & VOICE NOTE (Low-Literacy) */}
        {/* ======================================================== */}
        {activeTab === 'ASSIGNMENT' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                Hands-On Field Verification
              </span>
              <h2 className="text-xl font-black text-white">
                Practical Site Photo Proof & Voice Submission
              </h2>
              <p className="text-xs text-slate-400">
                Shift Supervisor in-person review to stop "click-next" cheating.
              </p>
            </div>

            {assignmentSubmitted ? (
              <div className="p-8 rounded-3xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-black text-white text-lg">Assignment Uploaded for Supervisor Sign-Off!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your site photo and native audio explanation are in the shift review queue. Once signed, your skill passport wage bonus will unlock.
                </p>
                <div className="pt-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                    STATUS: PENDING_SUPERVISOR_SIGNATURE
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAssignmentSubmit} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
                
                {/* Photo Upload Area */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>Upload Site Execution Photo</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    {course.practicalAssignment.instructions}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="url"
                      placeholder="Paste photo URL or leave sample..."
                      value={assignmentPhotoUrl}
                      onChange={(e) => setAssignmentPhotoUrl(e.target.value)}
                      className="flex-1 p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setAssignmentPhotoUrl(course.practicalAssignment.sampleImageUrl)}
                      className="px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-xs shrink-0"
                    >
                      Use Sample Photo
                    </button>
                  </div>

                  {assignmentPhotoUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden max-h-48 border border-slate-700">
                      <img src={assignmentPhotoUrl} alt="Assignment preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Voice Note Recording Area */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-blue-400" />
                    <span>Mother-Tongue Voice Note (Low-Literacy Option)</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    {course.practicalAssignment.voiceNotePrompt}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (isRecordingVoice) {
                          setIsRecordingVoice(false);
                          setAssignmentVoiceRecorded(true);
                        } else {
                          setVoiceSeconds(0);
                          setIsRecordingVoice(true);
                        }
                      }}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                        isRecordingVoice
                          ? 'bg-rose-600 text-white animate-pulse'
                          : assignmentVoiceRecorded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      <span>
                        {isRecordingVoice
                          ? `Recording Voice Note... (${voiceSeconds}s)`
                          : assignmentVoiceRecorded
                          ? 'Voice Note Saved ✓'
                          : 'Tap to Record Voice Note'}
                      </span>
                    </button>

                    {assignmentVoiceRecorded && (
                      <span className="text-[11px] text-emerald-400 font-bold">
                        Attached (0:14s verified)
                      </span>
                    )}
                  </div>
                </div>

                {/* Optional Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white">Worker Observations / Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Scaffolding anchor bolts tight. Safety harness double-checked."
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Upload & Submit for Supervisor Review</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: SKILL PASSPORT & WAGE INCREMENT CERTIFICATE */}
        {/* ======================================================== */}
        {activeTab === 'PASSPORT' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                National Frontline Credential
              </span>
              <h2 className="text-xl font-black text-white">
                Skill Passport Stamp & Wage Milestone
              </h2>
              <p className="text-xs text-slate-400">
                Cryptographically verifiable skill qualification for frontline advancement.
              </p>
            </div>

            {/* Passport Credential Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 border-2 border-amber-500/50 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Award className="w-8 h-8 text-amber-400" />
                  <div>
                    <h3 className="font-black text-white text-sm">
                      VERIFIED SKILL PASSPORT CREDENTIAL
                    </h3>
                    <span className="text-[10px] font-mono text-amber-300">
                      CERT-ID: IN-BC-{course.id.toUpperCase()}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Sector</span>
                  <strong className="text-white">{course.sectorLabel}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Skill Tier</span>
                  <strong className="text-amber-400">{course.tierLabel}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Wage Differential</span>
                  <strong className="text-emerald-400">+₹1,200/Month</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Issuing Authority</span>
                  <strong className="text-slate-200">EHS Directorate</strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5">
                <span>Verified with shift supervisor on-site inspection</span>
                <Link href="/worker/passport" className="text-amber-300 hover:underline font-bold">
                  View Full Passport →
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

export default function CourseHubPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-bold">Loading Course Hub...</div>}>
      <CourseHubContent />
    </Suspense>
  );
}
