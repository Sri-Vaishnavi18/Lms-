'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Heart,
  HelpCircle,
  Mic,
  Download,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  X,
  QrCode,
  Sparkles,
  Layers,
  Award,
  Radio,
  Send,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Home,
  BookOpen,
  Music,
  Zap,
} from 'lucide-react';
import { SHORTS_DATABASE, ShortVideo } from '../../lib/shortsData';
import { INDIAN_LANGUAGES, SECTORS_LIST } from '../../lib/languages';

function ShortsPlayerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSector = searchParams.get('sector') || '';
  const initialId = searchParams.get('id') || '';

  // Filtered list of shorts
  const [selectedSector, setSelectedSector] = useState<string>(initialSector);
  const shortsList = selectedSector
    ? SHORTS_DATABASE.filter((s) => s.sector === selectedSector)
    : SHORTS_DATABASE;

  // Active video index
  const initialIndex = initialId
    ? Math.max(0, shortsList.findIndex((s) => s.id === initialId))
    : 0;
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  // Playback & Sound State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hi');
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Interactive States
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [showHeartBurst, setShowHeartBurst] = useState<boolean>(false);
  const [activeBadgeModal, setActiveBadgeModal] = useState<'WRONG' | 'RIGHT' | null>(null);

  // Modals
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizTimer, setQuizTimer] = useState<number>(30);
  const [quizScoreAwarded, setQuizScoreAwarded] = useState<boolean>(false);

  const [isAskSupervisorOpen, setIsAskSupervisorOpen] = useState<boolean>(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState<boolean>(false);
  const [audioRecordingSeconds, setAudioRecordingSeconds] = useState<number>(0);
  const [audioSubmitted, setAudioSubmitted] = useState<boolean>(false);
  const [supervisorNoteText, setSupervisorNoteText] = useState<string>('');

  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [offlineSavedMap, setOfflineSavedMap] = useState<Record<string, boolean>>({});
  const [offlineToast, setOfflineToast] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const activeShort: ShortVideo = shortsList[currentIndex] || shortsList[0];

  // Initialize Likes from database
  useEffect(() => {
    const initialLikes: Record<string, number> = {};
    SHORTS_DATABASE.forEach((s) => {
      initialLikes[s.id] = s.likesCount;
    });
    setLikes(initialLikes);

    // Retrieve user language preference if saved
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lms_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.preferredLanguage) {
            setSelectedLanguage(parsed.preferredLanguage);
          }
        } catch (e) {}
      }
    }
  }, []);

  // Update index if sector or id changes
  useEffect(() => {
    if (initialId) {
      const idx = shortsList.findIndex((s) => s.id === initialId);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [initialId, selectedSector]);

  // Video progress & reset on slide change
  useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
    setActiveBadgeModal(null);
    setIsQuizOpen(false);
    setSelectedQuizOption(null);
    setQuizTimer(30);
    setQuizScoreAwarded(false);
    setIsAskSupervisorOpen(false);
    setAudioSubmitted(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay may need mute on some browsers
        setIsMuted(true);
      });
    }

    // Auto-trigger vernacular voiceover introduction
    handleSpeakNarration(activeShort, selectedLanguage);
  }, [currentIndex, selectedSector]);

  // Handle Speech Narration via Web Speech Synthesis API
  const handleSpeakNarration = (short: ShortVideo, lang: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const textToSpeak = short.audioNarrations[lang] || short.audioNarrations['en'] || short.title;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Attempt to set matching voice language
    const langCodeMap: Record<string, string> = {
      hi: 'hi-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      gu: 'gu-IN',
      ml: 'ml-IN',
      pa: 'pa-IN',
      or: 'or-IN',
      en: 'en-IN',
    };
    utterance.lang = langCodeMap[lang] || 'en-US';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsNarrating(true);
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);

    window.speechSynthesis.speak(utterance);
  };

  // Switch Language
  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    handleSpeakNarration(activeShort, newLang);
  };

  // Video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || activeShort.durationSeconds;
      setProgress((current / duration) * 100);
    }
  };

  // Toggle Play / Pause
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

  // Toggle Mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Next / Previous Short
  const goToNextShort = () => {
    if (currentIndex < shortsList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop around to first
    }
  };

  const goToPrevShort = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(shortsList.length - 1);
    }
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diff = touchStartY.current - touchEndY.current;
    const threshold = 60; // minimum pixels to count as swipe
    if (diff > threshold) {
      goToNextShort(); // Swiped UP -> Next
    } else if (diff < -threshold) {
      goToPrevShort(); // Swiped DOWN -> Prev
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isQuizOpen || isAskSupervisorOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNextShort();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevShort();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, shortsList.length, isQuizOpen, isAskSupervisorOpen, isPlaying]);

  // Like Action
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shortId = activeShort.id;
    const alreadyLiked = likedMap[shortId];

    setLikes((prev) => ({
      ...prev,
      [shortId]: (prev[shortId] || activeShort.likesCount) + (alreadyLiked ? -1 : 1),
    }));
    setLikedMap((prev) => ({
      ...prev,
      [shortId]: !alreadyLiked,
    }));

    if (!alreadyLiked) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
    }
  };

  // Save for Offline
  const handleSaveOffline = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shortId = activeShort.id;
    setOfflineSavedMap((prev) => ({ ...prev, [shortId]: true }));
    setOfflineToast(`Saved "${activeShort.title}" to device for offline viewing!`);
    setTimeout(() => setOfflineToast(null), 3500);
  };

  // 30-Sec Quiz Countdown Timer
  useEffect(() => {
    let interval: any;
    if (isQuizOpen && quizTimer > 0 && selectedQuizOption === null) {
      interval = setInterval(() => {
        setQuizTimer((prev) => prev - 1);
      }, 1000);
    } else if (quizTimer === 0 && selectedQuizOption === null) {
      // Auto-fail when timer runs out
      setSelectedQuizOption(-1);
    }
    return () => clearInterval(interval);
  }, [isQuizOpen, quizTimer, selectedQuizOption]);

  const handleSelectQuizOption = (optIndex: number) => {
    setSelectedQuizOption(optIndex);
    const isCorrect = activeShort.quiz.options[optIndex]?.isCorrect;
    if (isCorrect && !quizScoreAwarded) {
      setQuizScoreAwarded(true);
    }
  };

  // Supervisor Voice Note Recording Simulation
  useEffect(() => {
    let timer: any;
    if (isRecordingAudio) {
      timer = setInterval(() => {
        setAudioRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecordingAudio]);

  const handleToggleVoiceRecord = () => {
    if (isRecordingAudio) {
      setIsRecordingAudio(false);
    } else {
      setAudioRecordingSeconds(0);
      setIsRecordingAudio(true);
    }
  };

  const handleSendSupervisorNote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecordingAudio(false);
    setAudioSubmitted(true);
    setTimeout(() => {
      setIsAskSupervisorOpen(false);
      setAudioSubmitted(false);
      setSupervisorNoteText('');
      setAudioRecordingSeconds(0);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col md:flex-row items-center justify-center overflow-hidden select-none z-50">
      
      {/* Subtle Blurred Ambient Video Background on Desktop */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 pointer-events-none scale-110 transition-all duration-700"
        style={{ backgroundImage: `url(${activeShort.posterUrl})` }}
      />

      {/* Left YouTube Navigation Rail (Desktop View) */}
      <aside className="hidden lg:flex flex-col justify-between w-60 h-[94vh] max-h-[880px] bg-slate-900/90 rounded-3xl border border-slate-800 p-5 mr-6 text-xs text-slate-300 z-30 shadow-2xl backdrop-blur-md">
        <div className="space-y-5">
          {/* Logo / Title */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-black shadow-lg">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-black text-white text-sm tracking-tight block">
                YouTube Shorts
              </span>
              <span className="text-[10px] text-rose-400 font-bold block uppercase tracking-wider">
                Frontline Microlearning
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 font-bold">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4 text-slate-400" />
              <span>Platform Home</span>
            </Link>

            <Link
              href="/shorts"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 font-black shadow-xs"
            >
              <Zap className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Shorts (Active Feed)</span>
            </Link>

            <Link
              href="/courses"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Udemy Course Catalog</span>
            </Link>

            <Link
              href="/worker/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>My Learning Portal</span>
            </Link>

            <Link
              href="/worker/passport"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Skill Passport</span>
            </Link>
          </nav>

          {/* Subscribed Safety Leads / Channels */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
              Certified Safety Leads
            </span>
            <div className="space-y-1.5">
              {[
                { name: 'Er. Rajesh Kulkarni', role: 'EHS Director', icon: '👷' },
                { name: 'Vikram Sengupta', role: 'Logistics Fleet', icon: '🚚' },
                { name: 'Pooja Sharma', role: 'HVAC & Electrical', icon: '⚡' },
              ].map((c) => (
                <div key={c.name} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/50">
                  <span className="text-sm">{c.icon}</span>
                  <div className="truncate">
                    <span className="text-white text-[11px] block font-bold truncate">{c.name}</span>
                    <span className="text-slate-400 text-[9px] block truncate">{c.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Shift Attendance */}
        <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-[11px] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Shift Status</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
          <span className="text-white font-bold block truncate">Plant Alpha • Shift #1</span>
        </div>
      </aside>

      {/* Main 9:16 Vertical Smartphone Viewport Container */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full md:max-w-[430px] md:h-[94vh] md:max-h-[880px] bg-black relative md:rounded-3xl md:border md:border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between"
      >
        
        {/* Background Video Element */}
        <div
          onClick={togglePlayPause}
          className="absolute inset-0 z-0 bg-black cursor-pointer flex items-center justify-center overflow-hidden"
        >
          <video
            ref={videoRef}
            src={activeShort.videoUrl}
            poster={activeShort.posterUrl}
            playsInline
            loop
            autoPlay
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-cover"
          />

          {/* Gradient Shadows for UI Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

          {/* Play/Pause Central Flash Icon */}
          {!isPlaying && (
            <div className="absolute z-20 w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center animate-scale-in">
              <Play className="w-8 h-8 ml-1 text-white fill-white" />
            </div>
          )}

          {/* Heart Burst Animation on Like */}
          {showHeartBurst && (
            <div className="absolute z-20 pointer-events-none flex flex-col items-center justify-center animate-bounce">
              <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-xl" />
              <span className="text-white font-black text-sm mt-1 bg-black/50 px-3 py-0.5 rounded-full">
                Helpful SOP!
              </span>
            </div>
          )}
        </div>

        {/* TOP BAR: Navigation, Sector Filter, Native Language Audio, Sound */}
        <div className="relative z-30 p-4 pt-5 flex items-center justify-between gap-2">
          {/* Back button */}
          <button
            onClick={() => router.push('/worker/dashboard')}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all active:scale-95"
            title="Exit Shorts Mode"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Sector Pill Selector */}
          <div className="relative flex-1 max-w-[170px]">
            <select
              value={selectedSector}
              onChange={(e) => {
                setSelectedSector(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full bg-black/50 backdrop-blur-md text-white border border-white/20 rounded-full px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer truncate"
            >
              <option value="" className="bg-slate-900 text-white">
                ⚡ All 7 Sectors
              </option>
              {SECTORS_LIST.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                  {s.icon} {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Indian Native Language Audio Switcher */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-black/50 backdrop-blur-md text-amber-300 border border-amber-400/40 rounded-full px-2.5 py-1.5 text-xs font-black focus:outline-none cursor-pointer"
              title="Vernacular Audio Track"
            >
              {INDIAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>

            {/* Mute/Unmute Toggle */}
            <button
              onClick={toggleMute}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all active:scale-95"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Top Progress Scrub Bar */}
        <div className="relative z-30 w-full px-4">
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* RIGHT SIDE FLOATING ACTION BAR (YouTube Shorts / Reels style) */}
        <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4">
          
          {/* Instructor Avatar */}
          <div className="relative group">
            <img
              src={activeShort.instructor.avatar}
              alt={activeShort.instructor.name}
              className="w-11 h-11 rounded-full border-2 border-amber-400 object-cover shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border border-black">
              ✓
            </div>
          </div>

          {/* Like / Thumbs Up Button */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center group transition-transform active:scale-90"
            title="Mark as Helpful SOP (Thumbs Up)"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border shadow-lg transition-colors ${
                likedMap[activeShort.id]
                  ? 'bg-rose-600/90 text-white border-rose-400'
                  : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
              }`}
            >
              <ThumbsUp
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  likedMap[activeShort.id] ? 'fill-white text-white' : 'text-white'
                }`}
              />
            </div>
            <span className="text-[10px] font-black text-white mt-1 drop-shadow-md">
              {likes[activeShort.id] || activeShort.likesCount}
            </span>
          </button>

          {/* Dislike / Thumbs Down Button */}
          <button
            onClick={() => alert('Feedback noted: Safety inspector notified regarding SOP clarification.')}
            className="flex flex-col items-center group transition-transform active:scale-90"
            title="Dislike / Report Unclear SOP"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
              <ThumbsDown className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-black text-slate-300 mt-1 drop-shadow-md">
              Dislike
            </span>
          </button>

          {/* 30-Sec Instant Quiz Button */}
          <button
            onClick={() => setIsQuizOpen(true)}
            className="flex flex-col items-center group transition-transform active:scale-90"
            title="Take 30-Second Micro-Quiz"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg border border-amber-300 animate-pulse">
              <HelpCircle className="w-6 h-6 font-black" />
            </div>
            <span className="text-[10px] font-black text-amber-300 mt-1 drop-shadow-md uppercase tracking-wider">
              30s Quiz
            </span>
          </button>

          {/* Ask Shift Supervisor Voice Note Button */}
          <button
            onClick={() => setIsAskSupervisorOpen(true)}
            className="flex flex-col items-center group transition-transform active:scale-90"
            title="Record Voice Note to Shift Supervisor"
          >
            <div className="w-12 h-12 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg border border-blue-400">
              <Mic className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-blue-200 mt-1 drop-shadow-md uppercase tracking-wider">
              Foreman
            </span>
          </button>

          {/* Download for Offline */}
          <button
            onClick={handleSaveOffline}
            className="flex flex-col items-center group transition-transform active:scale-90"
            title="Download for Field Offline Viewing"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border shadow-lg transition-colors ${
                offlineSavedMap[activeShort.id]
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-black/40 text-white border-white/20 hover:bg-black/60'
              }`}
            >
              {offlineSavedMap[activeShort.id] ? (
                <Check className="w-6 h-6 text-white" />
              ) : (
                <Download className="w-5 h-5 text-white" />
              )}
            </div>
            <span className="text-[10px] font-bold text-white mt-1 drop-shadow-md">
              {offlineSavedMap[activeShort.id] ? 'Saved' : 'Offline'}
            </span>
          </button>

          {/* Share / Machine QR */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex flex-col items-center group transition-transform active:scale-90"
            title="Machine SOP QR & Share"
          >
            <div className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-white mt-1 drop-shadow-md">
              Share
            </span>
          </button>

        </div>

        {/* BOTTOM METADATA & WRONG ❌ vs RIGHT ✔️ SPLIT INTERACTION */}
        <div className="relative z-30 p-4 pb-6 space-y-3 pr-16 text-white">
          
          {/* Sector & Skill Tier Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <span>{activeShort.sectorIcon}</span>
              <span>{activeShort.sectorLabel}</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
              {activeShort.tierLabel}
            </span>

            {activeShort.machineId && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <QrCode className="w-3 h-3" />
                <span>{activeShort.machineId}</span>
              </span>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="text-base sm:text-lg font-black text-white leading-tight drop-shadow-md">
              {activeShort.title}
            </h2>
            <p className="text-xs text-slate-200 mt-1 line-clamp-2 leading-relaxed drop-shadow-sm font-medium">
              {activeShort.description}
            </p>
          </div>

          {/* YouTube Shorts Channel Handle & Red Subscribe Button */}
          <div className="flex items-center gap-2 pt-0.5">
            <img
              src={activeShort.instructor.avatar}
              alt={activeShort.instructor.name}
              className="w-7 h-7 rounded-full object-cover border border-white/20"
            />
            <span className="text-xs font-black text-white">
              @{activeShort.instructor.name.replace(/\s+/g, '').toLowerCase()}
            </span>
            <button
              type="button"
              onClick={() => alert(`Subscribed to ${activeShort.instructor.name}'s frontline safety updates!`)}
              className="px-2.5 py-0.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black transition-colors shadow-xs"
            >
              Subscribe
            </button>
          </div>

          {/* SPLIT-SCREEN WRONG ❌ vs RIGHT ✔️ BUTTONS */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setActiveBadgeModal('WRONG')}
              className="py-2 px-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 border border-rose-400 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
            >
              <span>❌</span>
              <span className="truncate">Wrong Way</span>
            </button>

            <button
              onClick={() => setActiveBadgeModal('RIGHT')}
              className="py-2 px-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
            >
              <span>✔️</span>
              <span className="truncate">Right Way</span>
            </button>
          </div>

          {/* Vernacular Audio Ticker Bar */}
          <div
            onClick={() => handleSpeakNarration(activeShort, selectedLanguage)}
            className="flex items-center gap-2 p-2 bg-black/60 rounded-xl border border-white/10 backdrop-blur-md cursor-pointer hover:bg-black/70 transition-colors"
            title="Tap to Re-play Vernacular Audio"
          >
            <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black shrink-0">
              🔊
            </div>
            <span className="text-[11px] text-amber-200 truncate font-semibold">
              {activeShort.audioNarrations[selectedLanguage] || activeShort.audioNarrations['en']}
            </span>
            {isNarrating && (
              <span className="flex items-center gap-0.5 ml-auto shrink-0">
                <span className="w-1 h-3 bg-amber-400 animate-pulse rounded-full" />
                <span className="w-1 h-4 bg-amber-300 animate-pulse delay-75 rounded-full" />
                <span className="w-1 h-2 bg-amber-500 animate-pulse delay-150 rounded-full" />
              </span>
            )}
          </div>

        </div>

        {/* Spinning Vinyl Audio Track Disc (YouTube Shorts Signature Element) */}
        <div className="absolute right-3.5 bottom-4 z-30 pointer-events-none hidden sm:block">
          <div className="w-8 h-8 rounded-full bg-slate-950 border-2 border-slate-700 shadow-2xl flex items-center justify-center animate-[spin_4s_linear_infinite] overflow-hidden">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 border border-black flex items-center justify-center">
              <Music className="w-2 h-2 text-slate-950" />
            </div>
          </div>
        </div>

        {/* Up / Down Desktop Navigation Arrows */}
        <div className="hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 flex-col gap-3">
          <button
            onClick={goToPrevShort}
            className="w-12 h-12 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center shadow-xl border border-slate-700 transition-all active:scale-95"
            title="Previous Short (Up Arrow)"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <button
            onClick={goToNextShort}
            className="w-12 h-12 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center shadow-xl border border-slate-700 transition-all active:scale-95"
            title="Next Short (Down Arrow)"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* MODAL 1: WRONG ❌ vs RIGHT ✔️ DETAIL SHEET */}
      {activeBadgeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 border shadow-2xl space-y-4 animate-scale-in text-white ${
              activeBadgeModal === 'WRONG'
                ? 'bg-gradient-to-b from-rose-950 to-slate-900 border-rose-500/50'
                : 'bg-gradient-to-b from-emerald-950 to-slate-900 border-emerald-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {activeBadgeModal === 'WRONG' ? '❌' : '✔️'}
                </span>
                <h3 className="font-black text-lg">
                  {activeBadgeModal === 'WRONG' ? 'Hazardous Practice (Wrong)' : 'Standard Operating Procedure (Right)'}
                </h3>
              </div>
              <button
                onClick={() => setActiveBadgeModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <h4 className="font-bold text-sm text-white">
                {activeBadgeModal === 'WRONG'
                  ? activeShort.wrongWay.title
                  : activeShort.rightWay.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeBadgeModal === 'WRONG'
                  ? activeShort.wrongWay.detail
                  : activeShort.rightWay.detail}
              </p>
            </div>

            <button
              onClick={() => setActiveBadgeModal(null)}
              className="w-full py-3 bg-white text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              Got it, continue video
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: 30-SEC INSTANT QUIZ OVERLAY */}
      {isQuizOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4 animate-scale-in text-white">
            
            {/* Header with 30s Countdown Timer */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">30-Second Micro-Check</h3>
                  <span className="text-[10px] text-amber-300 font-bold">+50 XP Skill Reward</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 font-mono text-xs font-black text-amber-400">
                <span>⏱️</span>
                <span>{quizTimer}s</span>
              </div>
            </div>

            {/* Question Prompt */}
            <p className="font-bold text-sm text-white leading-snug">
              {activeShort.quiz.question}
            </p>

            {/* Choice Options */}
            <div className="space-y-2 pt-1">
              {activeShort.quiz.options.map((opt, idx) => {
                const isSelected = selectedQuizOption === idx;
                const showResult = selectedQuizOption !== null;

                let cardStyle = 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-200';
                if (showResult) {
                  if (opt.isCorrect) {
                    cardStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected && !opt.isCorrect) {
                    cardStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold';
                  } else {
                    cardStyle = 'bg-slate-800/40 border-slate-800 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={showResult}
                    onClick={() => handleSelectQuizOption(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs leading-relaxed transition-all flex items-start gap-2.5 ${cardStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <div className="flex-1">
                      <span>{opt.text}</span>
                      {showResult && isSelected && (
                        <p className="text-[11px] mt-1 font-normal opacity-90">
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback / Score Result Banner */}
            {selectedQuizOption !== null && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between ${
                  activeShort.quiz.options[selectedQuizOption]?.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                <span>
                  {activeShort.quiz.options[selectedQuizOption]?.isCorrect
                    ? '🎯 Spot On! +50 Skill Points Added to Passport'
                    : '⚠️ Incorrect! Review the Right Way SOP.'}
                </span>
                <button
                  onClick={() => setIsQuizOpen(false)}
                  className="px-3 py-1 bg-white text-slate-950 font-black text-xs rounded-xl shadow-xs"
                >
                  Done
                </button>
              </div>
            )}

            {selectedQuizOption === null && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setIsQuizOpen(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Skip for now
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL 3: ASK SUPERVISOR VOICE NOTE */}
      {isAskSupervisorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4 animate-scale-in text-white">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Voice Note to Shift Foreman</h3>
                  <span className="text-[10px] text-slate-400">Low-literacy direct walkie-talkie</span>
                </div>
              </div>

              <button
                onClick={() => setIsAskSupervisorOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {audioSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-black text-white text-base">Voice Note Dispatched!</h4>
                <p className="text-xs text-slate-400">
                  Shift Foreman has received your audio question with current video timestamp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendSupervisorNote} className="space-y-4">
                
                {/* Voice Record Button & Audio Wave */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-center space-y-3">
                  <button
                    type="button"
                    onClick={handleToggleVoiceRecord}
                    className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                      isRecordingAudio
                        ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/40'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    <Mic className="w-8 h-8" />
                  </button>

                  <div className="text-xs">
                    {isRecordingAudio ? (
                      <span className="font-mono text-rose-400 font-bold">
                        ● Recording Voice Note... {audioRecordingSeconds}s
                      </span>
                    ) : (
                      <span className="text-slate-300 font-medium">
                        Tap microphone to speak mother-tongue audio note
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Pre-set Question Chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    Or select quick question:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {[
                      'Need clarification on Step 2',
                      'LOTO lock missing from kit',
                      'Request physical supervisor inspection',
                    ].map((chip) => (
                      <button
                        type="button"
                        key={chip}
                        onClick={() => setSupervisorNoteText(chip)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px]"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Note Text */}
                <input
                  type="text"
                  placeholder="Optional note / question text..."
                  value={supervisorNoteText}
                  onChange={(e) => setSupervisorNoteText(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAskSupervisorOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to Foreman</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* MODAL 4: SHARE & MACHINE QR DIALOG */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4 animate-scale-in text-white text-center">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-sm text-white">Machine SOP Fast Access</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-lg">
              <QrCode className="w-36 h-36 text-slate-950" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-400">
                {activeShort.machineId || 'LMS-SHORT-SOP'}
              </span>
              <p className="text-xs text-slate-300">
                Coworkers can scan this QR code with their mobile phone camera to open this vertical short immediately on the plant floor.
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                setOfflineToast('Short URL copied to clipboard!');
                setTimeout(() => setOfflineToast(null), 3000);
                setIsShareModalOpen(false);
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md"
            >
              Copy Direct Share Link
            </button>
          </div>
        </div>
      )}

      {/* OFFLINE SAVE TOAST NOTIFICATION */}
      {offlineToast && (
        <div className="fixed top-6 z-50 px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{offlineToast}</span>
        </div>
      )}

    </div>
  );
}

export default function ShortsPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-slate-950 text-white flex items-center justify-center font-bold">
          Loading YouTube Shorts Engine...
        </div>
      }
    >
      <ShortsPlayerContent />
    </Suspense>
  );
}
