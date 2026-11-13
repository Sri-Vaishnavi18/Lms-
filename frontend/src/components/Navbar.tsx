'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  HardHat,
  Search,
  Globe,
  User,
  LogOut,
  ShieldCheck,
  Radio,
  BookOpen,
  Award,
  Users,
  Layers,
  ChevronDown,
  Menu,
  X,
  FileCheck,
} from 'lucide-react';
import { INDIAN_LANGUAGES } from '../lib/languages';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [language, setLanguage] = useState<string>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lms_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          if (parsed.preferredLanguage) {
            setLanguage(parsed.preferredLanguage);
          }
        } catch (e) {}
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lms_token');
      localStorage.removeItem('lms_user');
    }
    setUser(null);
    setProfileDropdownOpen(false);
    router.push('/login');
  };

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    if (typeof window !== 'undefined' && user) {
      const updated = { ...user, preferredLanguage: code };
      localStorage.setItem('lms_user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  const isAdmin = user?.role === 'ADMIN';
  const isSupervisor = user?.role === 'SUPERVISOR';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
                <HardHat className="w-6 h-6 text-amber-300" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl text-slate-900 tracking-tight">LMS 360</span>
                  <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200 uppercase">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-500 tracking-wide hidden sm:block">
                  Frontline & Technical Workforce Learning
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links (Udemy / iGOT style) */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname === '/' ? 'text-blue-700 bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Explore Catalog
            </Link>

            <Link
              href="/worker/dashboard"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/worker/dashboard') ? 'text-blue-700 bg-blue-50' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>My Learning</span>
            </Link>

            <Link
              href="/worker/dashboard?tab=LIVE"
              className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-emerald-700"
            >
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Live Masterclasses</span>
            </Link>

            <Link
              href="/worker/passport"
              className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>Skill Passport</span>
            </Link>

            {/* Supervisor / Admin Contextual Tabs */}
            {(isSupervisor || isAdmin) && (
              <Link
                href="/supervisor/dashboard"
                className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-indigo-700 font-bold"
              >
                <span>Crew Tablet</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin/compliance"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 font-bold ${
                  pathname.startsWith('/admin') ? 'text-purple-700 bg-purple-50' : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Admin Suite</span>
              </Link>
            )}
          </nav>

          {/* Right Side: Language Switcher & Profile / Auth */}
          <div className="flex items-center gap-3">
            
            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold py-1.5 px-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Select Indian Native Language"
              >
                {INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Profile or Login / Sign Up buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                    {user.fullName ? user.fullName.charAt(0) : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight line-clamp-1">{user.fullName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{user.badgeId} • {user.role}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs text-slate-700">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900">{user.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{user.phoneNumber}</div>
                      <span className="mt-1 inline-block text-[10px] px-2 py-0.5 rounded font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
                        {user.sector || 'CONSTRUCTION'} • {user.skillTier || 'UNSKILLED'}
                      </span>
                    </div>

                    <Link
                      href="/worker/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-slate-50 font-semibold"
                    >
                      My Learning Dashboard
                    </Link>
                    <Link
                      href="/worker/passport"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-slate-50 font-semibold"
                    >
                      My Skill Passport & Badges
                    </Link>

                    {isAdmin && (
                      <>
                        <div className="border-t border-slate-100 my-1" />
                        <Link
                          href="/admin/users"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 hover:bg-purple-50 text-purple-700 font-bold"
                        >
                          User Management & Attendance
                        </Link>
                        <Link
                          href="/admin/studio"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 hover:bg-purple-50 text-purple-700 font-bold"
                        >
                          Course & Session Studio
                        </Link>
                        <Link
                          href="/admin/compliance"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 hover:bg-purple-50 text-purple-700 font-bold"
                        >
                          Compliance Heatmap Matrix
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-bold flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-2 text-xs font-bold text-slate-700">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Explore Catalog
            </Link>
            <Link
              href="/worker/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              My Learning
            </Link>
            <Link
              href="/worker/dashboard?tab=LIVE"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-emerald-700"
            >
              Live Masterclasses
            </Link>
            <Link
              href="/worker/passport"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-amber-700"
            >
              My Skill Passport
            </Link>
            {isAdmin && (
              <Link
                href="/admin/compliance"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-purple-100 text-purple-700"
              >
                Admin Suite
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

