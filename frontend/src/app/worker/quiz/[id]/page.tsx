'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  Target,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../../../../components/Navbar';
import { Footer } from '../../../../components/Footer';
import { fetchApi } from '../../../../lib/api';
import { HazardCanvas } from '../../../../components/HazardCanvas';
import { AudioNarrator } from '../../../../components/AudioNarrator';
import { SyncEngine } from '../../../../lib/syncEngine';

export default function WorkerQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id as string;

  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completionResult, setCompletionResult] = useState<any>(null);
  const [offlineSaved, setOfflineSaved] = useState(false);

  useEffect(() => {
    // In our backend, quiz is inside module; fetch modules and locate quiz
    fetchApi('/modules')
      .then((courses) => {
        let foundQuiz = null;
        for (const course of courses) {
          for (const m of course.modules || []) {
            for (const q of m.quizzes || []) {
              if (q.id === quizId) {
                foundQuiz = {
                  ...q,
                  moduleTitle: m.title,
                  moduleId: m.id,
                  courseTitle: course.title,
                  sector: m.sector,
                  skillTier: m.skillTier,
                };
                break;
              }
            }
          }
        }
        setQuizData(foundQuiz);
      })
      .catch((err) => console.error('Error fetching quiz:', err))
      .finally(() => setLoading(false));
  }, [quizId]);

  const handleHazardComplete = async (
    score: number,
    isPassed: boolean,
    taps: Array<{ xPercent: number; yPercent: number }>
  ) => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('lms_user') : null;
    const userId = storedUser ? JSON.parse(storedUser).id : 'demo-worker-id';

    if (navigator.onLine) {
      try {
        const response = await fetchApi(`/quizzes/${quizId}/submit`, {
          method: 'POST',
          body: JSON.stringify({
            userId,
            answers: { taps },
          }),
        });
        setCompletionResult(response);
      } catch (err) {
        console.warn('Online submit failed, falling back to offline queue:', err);
        await saveOffline(userId, score, isPassed);
      }
    } else {
      await saveOffline(userId, score, isPassed);
    }
  };

  const saveOffline = async (userId: string, score: number, isPassed: boolean) => {
    await SyncEngine.enqueueCompletion({
      userId,
      moduleId: quizData?.moduleId || 'mod-default',
      score,
      isPassed,
    });
    setOfflineSaved(true);
    setCompletionResult({
      message: isPassed ? 'Passed (Saved to Offline Queue) 📶' : 'Needs Review (Saved Offline)',
      score,
      isPassed,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-3" />
          <p className="text-sm font-bold text-slate-600">Loading Assessment...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Quiz Not Found</h2>
          <p className="text-sm text-slate-500 max-w-md mb-6">
            The safety quiz you requested is not currently available or has expired.
          </p>
          <Link
            href="/worker/dashboard"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
          >
            ← Back to Learning Portal
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const questionData = quizData.questionData || {};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      {/* Top Breadcrumb & Assessment Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/worker/learn/${quizData.moduleId}`)}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Classroom</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">{quizData.courseTitle || 'Safety Assessment'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-900">{quizData.moduleTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200">
              <Target className="w-3.5 h-3.5" />
              Spot The Hazard (1-Min)
            </span>
          </div>
        </div>
      </div>

      {/* Main Assessment Container (Desktop-Grade Responsive) */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Title Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                {quizData.sector?.replace(/_/g, ' ') || 'SAFETY EXAM'}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                TIER: {quizData.skillTier || 'SEMI_SKILLED'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Interactive Visual Safety Assessment
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Inspect the real industrial workplace photo below. Click directly on up to 3 safety violations or hazards (e.g. unbuckled chin strap, missing guardrail, uninspected harness).
            </p>
          </div>

          <div className="shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-2">
            <AudioNarrator
              textToSpeak="चित्र में 3 सुरक्षा खतरों पर सीधे क्लिक करें और सबमिट करें।"
              language="hi"
            />
            <span className="text-xs font-bold text-slate-600">Hindi Voice Prompt</span>
          </div>
        </div>

        {/* Spot the Hazard Interactive Canvas */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          {quizData.type === 'SPOT_THE_HAZARD' && (
            <HazardCanvas
              imageUrl={
                questionData.imageUrl ||
                'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80'
              }
              targets={questionData.hazardTargets || []}
              onComplete={handleHazardComplete}
            />
          )}

          {/* Completion Success Card */}
          {completionResult && (
            <div
              className={`p-6 rounded-3xl border mt-6 text-center space-y-3 transition-all ${
                completionResult.isPassed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
                  completionResult.isPassed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}
              >
                {completionResult.isPassed ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider block opacity-75">
                  Assessment Finalized
                </span>
                <h3 className="text-xl font-black mt-1">
                  {completionResult.isPassed ? 'Safety Clearance Passed! 🎉' : 'Needs Review & Practice'}
                </h3>
                <p className="text-xs mt-1 max-w-md mx-auto opacity-80">{completionResult.message}</p>
                <div className="text-3xl font-black mt-3">
                  Score: {completionResult.score}%
                </div>
              </div>

              {completionResult.badgeEarned && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl border border-emerald-300 text-xs font-bold text-emerald-900 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Credential Badge Awarded: {completionResult.badgeEarned}</span>
                </div>
              )}

              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <Link
                  href="/worker/dashboard"
                  className="px-6 py-3 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-xl transition-colors shadow-md"
                >
                  Return to Learning Portal
                </Link>
                <Link
                  href="/worker/passport"
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-black rounded-xl border border-slate-300 transition-colors shadow-xs"
                >
                  View Updated Skill Passport
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
