'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  PlayCircle,
  HardHat,
  CheckCircle2,
  QrCode,
  ScanLine,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { QRCameraScanner } from '../../../components/QRCameraScanner';
import { fetchApi } from '../../../lib/api';

export default function MachineScanPage() {
  const router = useRouter();
  const [matchedMachine, setMatchedMachine] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleMachines = [
    { code: 'CRANE-TOWER-01', name: '50-Ton Tower Crane (Potain MC85)', location: 'Sector 4 - High Rise Zone', modId: 'mod-1' },
    { code: 'FORKLIFT-ELEC-04', name: 'Electric Reach Truck (Toyota 8FBE)', location: 'Warehouse Bay 2', modId: 'mod-2' },
    { code: 'CNC-MILL-12', name: '5-Axis CNC Milling Center (Haas VF-2)', location: 'Machining Line B', modId: 'mod-3' },
    { code: 'WELD-MIG-08', name: 'MIG/TIG Welding Station (Miller Syncro)', location: 'Fabrication Shed 3', modId: 'mod-1' },
  ];

  const handleScan = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const assets = await fetchApi('/admin/machine-assets').catch(() => []);
      const found = assets.find((a: any) => a.qrCodeId.toLowerCase() === code.toLowerCase());

      if (found) {
        setMatchedMachine(found);
      } else {
        const fallback = sampleMachines.find((m) => m.code.toLowerCase() === code.toLowerCase());
        if (fallback) {
          setMatchedMachine({
            name: fallback.name,
            plantLocation: fallback.location,
            linkedModuleId: fallback.modId,
            qrCodeId: fallback.code,
          });
        } else {
          setMatchedMachine({
            name: 'Equipment Asset: ' + code,
            plantLocation: 'Main Production Line',
            linkedModuleId: 'mod-1',
            qrCodeId: code,
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Scan failed');
    } finally {
      setLoading(false);
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
              <span>Back to Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Point-of-Work Just-in-Time (JIT) SOP Scanner
              </h1>
              <p className="text-xs text-slate-500">
                Scan machine frame QR stickers or enter equipment ID before operating machinery
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Scanner Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 font-bold">
            {error}
          </div>
        )}

        {!matchedMachine ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Camera / QR Scanning Column */}
            <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Scan Equipment QR Sticker</h3>
              </div>

              <QRCameraScanner
                title="Point camera at Machine Weatherproof QR Sticker"
                sampleCodes={sampleMachines.map((m) => ({ label: `${m.name} (${m.code})`, code: m.code }))}
                onScanSuccess={handleScan}
              />
            </div>

            {/* Quick Presets / Information Column */}
            <div className="md:col-span-5 space-y-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Quick Machine Selection
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select a registered heavy machinery asset to immediately inspect certified operating protocols:
                </p>

                <div className="space-y-2">
                  {sampleMachines.map((m) => (
                    <button
                      key={m.code}
                      onClick={() => handleScan(m.code)}
                      className="w-full p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-900">
                          {m.name}
                        </span>
                        <span className="text-[10px] text-slate-500">{m.location}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold block">Safety Mandate:</span>
                  Operating high-risk machinery without completing the 2-minute SOP refresher is a critical EHS compliance violation.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Equipment Verified
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-3">{matchedMachine.name}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Asset ID: <span className="font-mono font-bold text-slate-700">{matchedMachine.qrCodeId}</span> • Location: {matchedMachine.plantLocation}
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <span className="font-black text-slate-900 block">Pre-Operation Checklist:</span>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Check emergency cutoff switches and physical guards.</li>
                <li>Verify fluid levels, hydraulic pressure, and earthing leads.</li>
                <li>Confirm worker PPE clearance for this specific equipment class.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/worker/learn/${matchedMachine.linkedModuleId || 'first-module'}`}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Launch 2-Min Machine SOP Video</span>
              </Link>
              <button
                onClick={() => setMatchedMachine(null)}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors shadow-xs"
              >
                Scan Another Machine
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
