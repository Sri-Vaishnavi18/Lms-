'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  QrCode,
  Printer,
  Plus,
  ArrowLeft,
  CheckCircle2,
  HardHat,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  PlayCircle,
  X,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { fetchApi } from '../../../lib/api';

export default function MachineAssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    plantLocation: '',
    linkedModuleId: 'first-module',
  });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = () => {
    setLoading(true);
    fetchApi('/admin/machine-assets')
      .then((data) => setAssets(data))
      .catch((err) => console.error('Error fetching assets:', err))
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/admin/machine-assets', {
        method: 'POST',
        body: JSON.stringify(newAsset),
      });
      setShowAddModal(false);
      setNewAsset({ name: '', plantLocation: '', linkedModuleId: 'first-module' });
      loadAssets();
    } catch (err: any) {
      alert(err.message || 'Failed to create asset');
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      {/* Top Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black border border-blue-200">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black text-blue-700 tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Asset & Machinery Registry
                </span>
                <span className="text-xs text-slate-400">• Point-of-Work JIT Labels</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">Weatherproof Machine QR Stickers</h1>
            </div>
          </div>

          {/* Admin Navigation Pills */}
          <nav className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
            <Link
              href="/admin/users"
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors"
            >
              User Directory
            </Link>
            <Link
              href="/admin/studio"
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors"
            >
              Course Studio
            </Link>
            <Link
              href="/admin/compliance"
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors"
            >
              Compliance Matrix
            </Link>
            <Link
              href="/admin/assets"
              className="px-3.5 py-2 bg-blue-600 text-white rounded-xl shadow-xs"
            >
              Machine JIT QR
            </Link>
            <Link
              href="/admin/audit"
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors"
            >
              Audit Reports
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900">Registered Industrial Machinery</h2>
            <p className="text-xs text-slate-500">
              Generate, preview, and batch-print weatherproof QR tags to paste directly onto machine housings
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Sticker Sheet</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Equipment</span>
            </button>
          </div>
        </div>

        {/* Machine Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
                    JIT SOP STICKER
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-2">{asset.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{asset.plantLocation}</span>
                  </div>
                </div>

                <div className="p-2 bg-white border border-slate-200 rounded-2xl shadow-xs shrink-0 text-center">
                  {asset.qrCodeDataUrl ? (
                    <img src={asset.qrCodeDataUrl} alt={asset.qrCodeId} className="w-20 h-20" />
                  ) : (
                    <QrCode className="w-20 h-20 text-slate-800" />
                  )}
                  <span className="text-[9px] font-mono text-slate-500 font-bold block mt-1">
                    {asset.qrCodeId}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Linked Module: 2-min SOP</span>
                <Link
                  href={`/worker/learn/${asset.linkedModuleId || 'first-module'}`}
                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Preview SOP</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Register Industrial Machine</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Machine / Asset Name
                </label>
                <input
                  type="text"
                  required
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="e.g. 50-Ton Hydraulic Stamping Press"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Plant / Bay Location
                </label>
                <input
                  type="text"
                  required
                  value={newAsset.plantLocation}
                  onChange={(e) => setNewAsset({ ...newAsset, plantLocation: e.target.value })}
                  placeholder="e.g. Plant Alpha - Stamping Shop Floor"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Generate QR Sticker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
