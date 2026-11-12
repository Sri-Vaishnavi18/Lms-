'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle, Volume2, Target, AlertTriangle } from 'lucide-react';
import { fetchApi } from '../../../../lib/api';
import { AudioNarrator } from '../../../../components/AudioNarrator';

export default function MicrolearningPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.id as string;

  const [moduleData, setModuleData] = useState<any>(null);
  const [selectedLang, setSelectedLang] = useState('hi');
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (moduleId) {
      fetchApi(`/modules/${moduleId}`)
        .then((data) => setModuleData(data))
        .catch((err) => console.error('Error fetching module:', err))
        .finally(() => setLoading(false));
    }
  }, [moduleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-lg font-bold text-slate-800">Module not found</h2>
        <Link href="/worker/dashboard" className="mt-4 text-blue-600 font-bold">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const primaryQuizId = moduleData.quizzes && moduleData.quizzes.length > 0 ? moduleData.quizzes[0].id : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white max-w-lg mx-auto flex flex-col">
      {/* Top Header */}
      <header className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-900">
        <button
          onClick={() => router.push('/worker/dashboard')}
          className="p-2 text-slate-300 hover:text-white rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-black uppercase text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
          2-Min Safety Bite
        </span>

        {/* Audio Language Switcher */}
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 font-bold focus:outline-none"
        >
          <option value="en">English 🇬🇧</option>
          <option value="hi">हिंदी (Hindi) 🇮🇳</option>
          <option value="es">Español 🇪🇸</option>
        </select>
      </header>

      {/* Video Stream Container */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
        <video
          src={moduleData.videoUrl}
          controls
          playsInline
          autoPlay
          onEnded={() => setVideoFinished(true)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Lesson Details & Audio Narration */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-slate-900">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-bold mb-1">
              <span>{moduleData.course?.title || 'Operational Safety'}</span>
            </div>
            <h1 className="text-xl font-black text-white leading-tight">{moduleData.title}</h1>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-300">Listen in {selectedLang === 'hi' ? 'हिंदी' : 'English'}:</span>
            <AudioNarrator
              textToSpeak={`${moduleData.title}. वीडियो देखें और नीचे दिए गए क्विज़ को पूरा करें।`}
              language={selectedLang}
            />
          </div>

          {/* Visual Right vs Wrong Reminder Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-700/60 text-xs">
              <div className="flex items-center gap-1 font-black text-red-400 mb-1">
                <span>❌ WRONG WAY</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Operating without chin-strap buckled or climbing without 3-point harness check.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-xs">
              <div className="flex items-center gap-1 font-black text-emerald-400 mb-1">
                <span>✔️ RIGHT WAY</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Inspect harness stitching, click both lanyard hooks to anchor point before stepping.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Quiz Call to Action */}
        <div className="pt-6">
          {primaryQuizId ? (
            <Link
              href={`/worker/quiz/${primaryQuizId}`}
              className={`w-full py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2 text-base transition-all shadow-lg ${
                videoFinished
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 animate-bounce'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Target className="w-5 h-5" />
              <span>{videoFinished ? 'Start 1-Minute Quiz Now! 🎯' : 'Go to Visual Quiz 🎯'}</span>
            </Link>
          ) : (
            <div className="p-3 text-center text-xs text-slate-400 bg-slate-800 rounded-xl">
              Module complete. No quiz required for this refresher.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
