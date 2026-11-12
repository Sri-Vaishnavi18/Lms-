'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlayCircle, QrCode, Award, DownloadCloud, CheckCircle, Clock, HardHat, LogOut, ChevronRight } from 'lucide-react';
import { fetchApi } from '../../../lib/api';
import { AudioNarrator } from '../../../components/AudioNarrator';
import { OfflineIndicator } from '../../../components/OfflineIndicator';

export default function WorkerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dailyBite, setDailyBite] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if worker session exists in localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lms_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Fallback default demo worker
        setUser({
          fullName: 'Ramesh Kumar',
          badgeId: 'BC-1001',
          role: 'WORKER',
          siteLocation: 'Plant Alpha - Main Assembly',
          department: 'Heavy Assembly',
        });
      }
    }

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [biteData, coursesData] = await Promise.all([
        fetchApi('/modules/daily-bite').catch(() => null),
        fetchApi('/modules').catch(() => []),
      ]);
      setDailyBite(biteData);
      setCourses(coursesData);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lms_token');
      localStorage.removeItem('lms_user');
    }
    router.push('/worker/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20 max-w-lg mx-auto shadow-xl border-x border-slate-200">
      {/* Top App Bar */}
      <header className="bg-blue-800 text-white p-4 sticky top-0 z-30 shadow-md">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-black text-sm">
              <HardHat className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <div className="text-xs text-blue-200 leading-tight">Frontline Safety Pass</div>
              <h1 className="font-bold text-sm text-white">{user?.fullName || 'Worker'}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <OfflineIndicator />
            <button
              onClick={handleLogout}
              className="p-2 text-blue-200 hover:text-white rounded-lg hover:bg-blue-700/50"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center bg-blue-900/60 p-2.5 rounded-xl border border-blue-700/60">
          <div className="text-xs">
            <span className="text-blue-300">Badge ID: </span>
            <span className="font-mono font-bold text-amber-300">{user?.badgeId || 'BC-1001'}</span>
          </div>
          <AudioNarrator
            textToSpeak={`नमस्ते ${user?.fullName || 'साथी'}, आज का 2 मिनट का सुरक्षा पाठ पूरा करें।`}
            language="hi"
          />
        </div>
      </header>

      {/* Main Body */}
      <main className="p-4 space-y-5">
        {/* Today's Featured Safety Bite Card */}
        {dailyBite && (
          <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Today's Required Safety Bite
            </div>

            <h2 className="text-lg font-black leading-snug mb-2">{dailyBite.title}</h2>

            <div className="flex items-center gap-3 text-xs text-blue-200 mb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {Math.round(dailyBite.durationSeconds / 60)} Minutes
              </span>
              <span>•</span>
              <span className="bg-blue-700/60 px-2 py-0.5 rounded text-[11px] font-bold">
                EHS Critical
              </span>
            </div>

            <Link
              href={`/worker/learn/${dailyBite.id}`}
              className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <PlayCircle className="w-5 h-5 fill-slate-950 text-amber-400" />
              <span>Start 2-Minute Lesson (Watch Now)</span>
            </Link>
          </section>
        )}

        {/* Quick Action Navigation Grid */}
        <section className="grid grid-cols-3 gap-3">
          <Link
            href="/worker/scan"
            className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-1.5 hover:border-blue-400 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Scan Machine QR</span>
          </Link>

          <Link
            href="/worker/passport"
            className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-1.5 hover:border-amber-400 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">My Badges</span>
          </Link>

          <Link
            href="/worker/offline"
            className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-1.5 hover:border-emerald-400 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Offline Pack</span>
          </Link>
        </section>

        {/* Courses & Micro-Modules List */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-black text-slate-800 text-sm tracking-wide uppercase">
              Assigned Training Modules
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              {courses.reduce((acc, c) => acc + (c.modules?.length || 0), 0)} Total
            </span>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-xs font-black text-blue-800 uppercase tracking-wider">
                    {course.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {course.modules?.length || 0} Lessons
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-tight">{course.title}</h4>

                <div className="space-y-2 pt-1">
                  {course.modules?.map((m: any) => (
                    <Link
                      key={m.id}
                      href={`/worker/learn/${m.id}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          <PlayCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 line-clamp-1">{m.title}</div>
                          <div className="text-[11px] text-slate-500">
                            {Math.round(m.durationSeconds / 60)} min • Audio in हिंदी & English
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
