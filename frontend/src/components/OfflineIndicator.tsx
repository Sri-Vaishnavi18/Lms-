'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { SyncEngine } from '../lib/syncEngine';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const checkStatus = async () => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const count = await SyncEngine.getPendingCount();
      setPendingCount(count);
    }
  };

  useEffect(() => {
    checkStatus();

    const handleOnline = async () => {
      setIsOnline(true);
      setIsSyncing(true);
      await SyncEngine.syncPending();
      setIsSyncing(false);
      checkStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(checkStatus, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await SyncEngine.syncPending();
    setIsSyncing(false);
    checkStatus();
  };

  return (
    <div className="flex items-center gap-2">
      {isOnline ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <Wifi className="w-3.5 h-3.5 text-emerald-600" />
          <span>Online</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          <WifiOff className="w-3.5 h-3.5 text-amber-600" />
          <span>Offline Mode</span>
        </span>
      )}

      {pendingCount > 0 && (
        <button
          onClick={handleManualSync}
          disabled={!isOnline || isSyncing}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 hover:bg-blue-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{pendingCount} Pending Sync</span>
        </button>
      )}
    </div>
  );
};

