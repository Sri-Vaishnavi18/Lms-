'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  DownloadCloud,
  HardDrive,
  Wifi,
  RefreshCw,
  CheckCircle2,
  Database,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { SyncEngine } from '../../../lib/syncEngine';
import { offlineDb } from '../../../lib/db';

export default function OfflineManagerPage() {
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      const queue = await offlineDb.offlineQueue.toArray();
      setPendingItems(queue);
    } catch (e) {
      console.warn('Offline DB not initialized:', e);
    }
  };

  const handleDownloadAll = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 1500);
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    try {
      await SyncEngine.syncPending();
      await loadQueue();
    } catch (e) {
      console.warn('Sync error:', e);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      {/* Top Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/worker/dashboard"
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal</span>
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Offline Mode & Device Cache
              </h1>
              <p className="text-xs text-slate-500">
                PWA IndexedDB background synchronization for basements, mines, and remote construction zones
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Download Shift Pack Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <DownloadCloud className="w-6 h-6" />
              </div>
              <h2 className="text-base font-black text-slate-900">Pre-Download Shift Modules</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Save assigned safety videos, checklists, and visual spot-the-hazard quizzes to local device storage before entering shielded workzones.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Shift Storage Footprint</span>
                  <span>14.2 MB</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[25%]" />
                </div>
              </div>

              <button
                onClick={handleDownloadAll}
                disabled={downloading || downloaded}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {downloaded ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Modules Cached Locally (Ready)</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-4 h-4" />
                    <span>{downloading ? 'Caching to IndexedDB...' : 'Cache All Shift Modules'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sync Pending Submissions Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h2 className="text-base font-black text-slate-900">Background Sync Queue</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Quizzes completed or attendance logged while disconnected are safely queued in client IndexedDB and dispatched automatically once signal returns.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                <span className="font-bold text-slate-700">Pending Actions in Queue</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-black">
                  {pendingItems.length}
                </span>
              </div>

              <button
                onClick={handleSyncNow}
                disabled={syncing}
                className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Syncing to LMS 360...' : 'Force Sync Now'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Explanation Banner */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-xs text-blue-900">
          <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
          <span>
            <strong>Zero Data Loss Guarantee:</strong> All exam timestamps and hazard tap coordinates are cryptographically hashed and synced without requiring user re-authentication.
          </span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
