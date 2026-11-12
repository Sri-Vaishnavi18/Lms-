'use client';

import React, { useState } from 'react';
import { Camera, QrCode } from 'lucide-react';

interface QRCameraScannerProps {
  onScanSuccess: (decodedText: string) => void;
  title?: string;
  sampleCodes?: Array<{ label: string; code: string }>;
}

export const QRCameraScanner: React.FC<QRCameraScannerProps> = ({
  onScanSuccess,
  title = 'Scan QR Code with Camera',
  sampleCodes = [
    { label: 'Worker Badge (Ramesh): BC-1001', code: 'BC-1001' },
    { label: 'Forklift Machine SOP: MACH-FORK-04', code: 'MACH-FORK-04' },
    { label: 'CNC Mill LOTO SOP: MACH-CNC-12', code: 'MACH-CNC-12' },
  ],
}) => {
  const [manualInput, setManualInput] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanSuccess(manualInput.trim());
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-md mx-auto w-full">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
        <Camera className="w-5 h-5 text-blue-700" />
        <span>{title}</span>
      </div>

      {/* Camera Simulator / Scanner Viewfinder */}
      <div className="relative aspect-square w-full bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-center text-white border-2 border-dashed border-slate-600">
        <div className="w-48 h-48 border-2 border-emerald-400 rounded-lg flex items-center justify-center relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400" />
          <QrCode className="w-16 h-16 text-emerald-400/70 animate-pulse" />
        </div>
        <p className="text-xs text-slate-300 mt-4">Point your camera at the QR code sticker</p>
      </div>

      {/* Instant Demo Quick-Select Buttons */}
      {sampleCodes && sampleCodes.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Quick-Scan Demo Codes:
          </span>
          <div className="flex flex-col gap-1">
            {sampleCodes.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onScanSuccess(s.code)}
                className="text-left px-3 py-2 text-xs bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg font-medium text-slate-700 hover:text-blue-800 transition-colors flex justify-between items-center"
              >
                <span>{s.label}</span>
                <span className="text-blue-600 font-bold">Tap to Scan ⚡</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manual Code Input fallback */}
      <form onSubmit={handleManualSubmit} className="flex gap-2 mt-2 pt-3 border-t border-slate-100">
        <input
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="Or type Code ID manually..."
          className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-bold hover:bg-blue-800"
        >
          Confirm
        </button>
      </form>
    </div>
  );
};

