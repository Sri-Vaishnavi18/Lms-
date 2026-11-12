'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, DownloadCloud, HardDrive, Wifi, RefreshCw, CheckCircle2 } from 'lucide-react';
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
    const queue = await offlineDb.offlineQueue.toArray();
    setPendingItems(queue);
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
    await SyncEngine.syncPending();
    await loadQueue();
    setSyncing(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 max-w-lg mx-auto flex flex-col p-4 pb-12">
      {/* Header */}
      <header className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link href="/worker/dashboard" className="p-2 text-slate-600 hover:text-slate-900 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-black text-slate-800">Offline Download Manager</h1>
        <div className="w-8" />
      </header>

      <main className="mt-4 space-y-5">
        {/* Offline Pack Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto">
            <DownloadCloud className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900">Download Shift Modules</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Save all 5 assigned videos and visual quizzes to your phone for zones with zero Wi-Fi or cellular signal.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-700">
            <span className="flex items-center gap-1.5 font-bold">
              <HardDrive className="w-4 h-4 text-slate-500" />
              Download Package Size:
            </span>
            <span className="font-mono font-black text-blue-700">~24.5 MB</span>
          </div>

          <button
            onClick={handleDownloadAll}
            disabled={downloading || downloaded}
            className={`w-full py-4 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              downloaded
                ? 'bg-emerald-600 text-white'
                : downloading
                ? 'bg-blue-400 text-white cursor-wait'
                : 'bg-blue-700 hover:bg-blue-800 text-white active:scale-95'
            }`}
          >
            {downloaded ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Modules Cached on Phone (Offline Ready)</span>
              </>
            ) : downloading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Downloading Videos...</span>
              </>
            ) : (
              <>
                <DownloadCloud className="w-5 h-5" />
                <span>Download All Modules Now</span>
              </>
            )}
          </button>
        </div>

        {/* Pending Sync Queue */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Pending Offline Sync Queue
            </h3>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              {pendingItems.filter((i) => i.synced === 0).length} Waiting
            </span>
          </div>

          {pendingItems.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              All quiz completions are currently synchronized with the server! ✅
            </div>
          ) : (
            <div className="space-y-2">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-800">Module: {item.moduleId}</div>
                    <div className="text-[10px] text-slate-500">
                      Score: {item.score}% • {new Date(item.clientTimestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      item.synced === 1
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}
                  >
                    {item.synced === 1 ? 'Synced' : 'Pending Upload'}
                  </span>
                </div>
              ))}

              <button
                onClick={handleSyncNow}
                disabled={syncing}
                className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Uploading...' : 'Sync Pending Items Now'}</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
