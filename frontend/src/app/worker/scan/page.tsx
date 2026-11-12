'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, HardHat, CheckCircle2 } from 'lucide-react';
import { QRCameraScanner } from '../../../components/QRCameraScanner';
import { fetchApi } from '../../../lib/api';

export default function MachineScanPage() {
  const router = useRouter();
  const [matchedMachine, setMatchedMachine] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch machine assets from backend
      const assets = await fetchApi('/admin/machine-assets');
      const found = assets.find(
        (a: any) => a.qrCodeId.toLowerCase() === code.toLowerCase()
      );

      if (found) {
        setMatchedMachine(found);
      } else {
        // Fallback demo machine
        setMatchedMachine({
          name: 'Equipment: ' + code,
          plantLocation: 'Plant Alpha - Shop Floor',
          linkedModuleId: 'first-module',
          qrCodeId: code,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 max-w-lg mx-auto flex flex-col p-4 pb-12">
      {/* Header */}
      <header className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link href="/worker/dashboard" className="p-2 text-slate-600 hover:text-slate-900 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-black text-slate-800">Machine SOP Scanner</h1>
        <div className="w-8" />
      </header>

      {/* Main scanner */}
      <main className="mt-4 space-y-4">
        <div className="text-center">
          <p className="text-xs text-slate-600">
            Scan the weatherproof QR sticker located on the machine frame before operating:
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {!matchedMachine ? (
          <QRCameraScanner
            title="Scan Equipment QR Sticker"
            sampleCodes={[
              { label: 'Forklift Truck #04: MACH-FORK-04', code: 'MACH-FORK-04' },
              { label: '5-Axis CNC Mill #12: MACH-CNC-12', code: 'MACH-CNC-12' },
            ]}
            onScanSuccess={handleScan}
          />
        ) : (
          /* Scanned Result Modal / Card */
          <div className="p-6 bg-white rounded-3xl border-2 border-emerald-500 shadow-xl space-y-4 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                {matchedMachine.qrCodeId}
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">{matchedMachine.name}</h2>
              <p className="text-xs text-slate-500 mt-1">{matchedMachine.plantLocation}</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left space-y-1 text-xs text-amber-900 font-medium">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <HardHat className="w-4 h-4 text-amber-600" />
                Mandatory Pre-Operation Check:
              </div>
              <p className="text-[11px] text-amber-800">
                You must watch the 45-second inspection video before engaging the master power switch.
              </p>
            </div>

            <button
              onClick={() => router.push(`/worker/learn/${matchedMachine.linkedModuleId}`)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <PlayCircle className="w-6 h-6" />
              <span>Watch 45-Sec Pre-Shift Video</span>
            </button>

            <button
              onClick={() => setMatchedMachine(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Scan Another Machine
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
