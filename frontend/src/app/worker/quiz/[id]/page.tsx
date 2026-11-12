'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Award, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
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
    // In our backend, quiz is inside module, let's load modules or find quiz
    fetchApi('/modules')
      .then((courses) => {
        let foundQuiz = null;
        for (const course of courses) {
          for (const m of course.modules || []) {
            for (const q of m.quizzes || []) {
              if (q.id === quizId) {
                foundQuiz = { ...q, moduleTitle: m.title, moduleId: m.id };
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
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-lg font-bold text-slate-800">Quiz not found</h2>
        <Link href="/worker/dashboard" className="mt-4 text-blue-600 font-bold">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const questionData = quizData.questionData || {};

  return (
    <div className="min-h-screen bg-slate-100 max-w-lg mx-auto flex flex-col pb-10">
      {/* Header */}
      <header className="p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={() => router.push(`/worker/learn/${quizData.moduleId}`)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
          Visual Safety Check
        </span>
        <AudioNarrator
          textToSpeak="चित्र में 3 सुरक्षा खतरों पर उंगली से टैप करें और सबमिट करें।"
          language="hi"
        />
      </header>

      {/* Main Assessment Body */}
      <main className="p-4 space-y-4 flex-1">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            {quizData.moduleTitle}
          </span>
          <h1 className="text-lg font-black text-slate-900">Spot The Hazard Exercise</h1>
          <p className="text-xs text-slate-500">
            Look closely at the image below and tap directly on 3 unsafe conditions.
          </p>
        </div>

        {/* Spot the Hazard Interactive Canvas */}
        {quizData.type === 'SPOT_THE_HAZARD' && (
          <HazardCanvas
            imageUrl={
              questionData.imageUrl ||
              'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80'
            }
            targets={questionData.hazardTargets || []}
            onComplete={handleHazardComplete}
          />
        )}

        {/* Completion Success Card */}
        {completionResult && (
          <div className="mt-6 p-5 bg-white border-2 border-emerald-400 rounded-2xl shadow-lg text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-slate-900">{completionResult.message}</h3>

            <p className="text-xs text-slate-600">
              {completionResult.isPassed
                ? 'Your safety pass record has been updated and certified.'
                : 'Review the hazard tips above and try again.'}
            </p>

            {offlineSaved && (
              <div className="p-2 bg-amber-50 text-amber-800 text-[11px] font-bold rounded-lg border border-amber-200">
                📶 Saved offline in phone memory. Will auto-sync when online.
              </div>
            )}

            <div className="pt-2 flex gap-2">
              <Link
                href="/worker/passport"
                className="flex-1 py-3 bg-amber-400 text-slate-950 font-black rounded-xl text-xs hover:bg-amber-300 shadow-sm flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4" /> View My Badges
              </Link>
              <Link
                href="/worker/dashboard"
                className="flex-1 py-3 bg-blue-700 text-white font-bold rounded-xl text-xs hover:bg-blue-800 shadow-sm flex items-center justify-center"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
