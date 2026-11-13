'use client';

import React from 'react';
import Link from 'next/link';
import { HardHat, ShieldCheck, Award, Globe, Heart } from 'lucide-react';
import { SECTORS_LIST } from '../lib/languages';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md">
                <HardHat className="w-5 h-5 text-amber-300" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">LMS 360</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Empowering India's frontline and vocational workforce with industry-standard microlearning, live masterclasses, and certified practical on-the-job skill passports.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Aligned with OSHA & National Skill Standards</span>
            </div>
          </div>

          {/* 7 Sectors */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">7 Core Sectors</h4>
            <ul className="space-y-1.5 text-slate-400">
              {SECTORS_LIST.map((s) => (
                <li key={s.id}>
                  <Link href={`/?sector=${s.id}`} className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Learning Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Platform Features</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <Link href="/worker/dashboard" className="hover:text-white transition-colors">
                  My Learning Dashboard
                </Link>
              </li>
              <li>
                <Link href="/worker/dashboard?tab=LIVE" className="hover:text-white transition-colors">
                  Live Masterclass Sessions
                </Link>
              </li>
              <li>
                <Link href="/worker/passport" className="hover:text-white transition-colors">
                  Digital Skill Passport & QR
                </Link>
              </li>
              <li>
                <Link href="/worker/scan" className="hover:text-white transition-colors">
                  Machine JIT SOP Scanner
                </Link>
              </li>
              <li>
                <Link href="/worker/offline" className="hover:text-white transition-colors">
                  Offline Learning Mode
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Operations */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Administration</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <Link href="/admin/users" className="hover:text-white transition-colors">
                  User Management & Roster
                </Link>
              </li>
              <li>
                <Link href="/admin/studio" className="hover:text-white transition-colors">
                  Session & Course Studio
                </Link>
              </li>
              <li>
                <Link href="/admin/compliance" className="hover:text-white transition-colors">
                  Compliance Heatmap Matrix
                </Link>
              </li>
              <li>
                <Link href="/admin/assets" className="hover:text-white transition-colors">
                  Equipment QR Asset Tags
                </Link>
              </li>
              <li>
                <Link href="/supervisor/dashboard" className="hover:text-white transition-colors">
                  Supervisor Shift Portal
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} LMS 360 Vocational Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Supported in 11 Indian Native Languages</span>
            <span>•</span>
            <span>Zero-Email Phone & Badge SSO</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

