import Link from 'next/link';
import { Smartphone, Tablet, Monitor, ShieldCheck, QrCode, HardHat, Award } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-6">
      <div className="max-w-3xl w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
          <HardHat className="w-4 h-4 text-amber-400" />
          Frontline & Blue-Collar LMS Platform
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          Vocational Microlearning & Safety System
        </h1>

        <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto">
          Tailored for high-risk job sites: zero-email phone login, 2-minute video bites, dual-track audio, visual hazard quizzes, and offline sync.
        </p>

        {/* Primary Universal Login Button */}
        <div className="pt-2 flex justify-center">
          <Link
            href="/login"
            className="py-4 px-8 bg-blue-600 hover:bg-blue-500 text-white font-black text-base rounded-2xl shadow-xl flex items-center gap-2.5 transition-all active:scale-95 border border-blue-400/40"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <span>Sign In to Your Account (/login) →</span>
          </Link>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
          {/* Worker PWA Card */}
          <Link
            href="/worker/login"
            className="group p-6 bg-slate-800/80 hover:bg-blue-900/40 border border-slate-700 hover:border-blue-500 rounded-2xl transition-all shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Worker Mobile PWA</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Phone OTP & QR badge login, 2-minute video bites, Spot-the-Hazard tap games, and machine SOP scanner.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open Worker App →
            </span>
          </Link>

          {/* Supervisor Card */}
          <Link
            href="/supervisor/dashboard"
            className="group p-6 bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700 hover:border-emerald-500 rounded-2xl transition-all shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Tablet className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Supervisor Tablet</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Shift crew roster, morning Toolbox Talk group training with 1-click attendance, and practical sign-off.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open Crew Tablet →
            </span>
          </Link>

          {/* Admin Card */}
          <Link
            href="/admin/compliance"
            className="group p-6 bg-slate-800/80 hover:bg-purple-900/40 border border-slate-700 hover:border-purple-500 rounded-2xl transition-all shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Monitor className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">EHS Safety Admin</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Site-wide compliance heatmap, machine QR sticker generator, and 1-click OSHA audit reports.
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open Admin Portal →
            </span>
          </Link>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="pt-4 flex flex-wrap justify-center gap-4 text-xs text-slate-400 border-t border-slate-800">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Zero-Email Phone OTP
          </span>
          <span className="flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-blue-400" />
            Machine QR Code JIT SOPs
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Offline IndexedDB Sync
          </span>
        </div>
      </div>
    </main>
  );
}

