'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QrCode, Printer, Plus, ArrowLeft, CheckCircle2 } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Tabs Header */}
        <header className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 text-blue-400 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-black text-blue-400 tracking-wider">
                Asset & Machinery Registry
              </span>
              <h1 className="text-2xl font-black">Just-in-Time (JIT) QR Labels</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sticker Sheets</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Register Machine</span>
            </button>
          </div>
        </header>

        {/* Assets QR Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col justify-between items-center text-center space-y-4 hover:border-blue-500 transition-colors"
            >
              <span className="text-xs font-mono font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                {asset.qrCodeId}
              </span>

              {/* High-Res QR Code Preview */}
              <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-inner">
                {asset.qrCodeDataUrl ? (
                  <img
                    src={asset.qrCodeDataUrl}
                    alt={asset.name}
                    className="w-48 h-48 mx-auto"
                  />
                ) : (
                  <div className="w-48 h-48 bg-slate-100 flex items-center justify-center font-mono text-xs text-slate-400">
                    QR Ready
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-black text-slate-900 text-base">{asset.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{asset.plantLocation}</p>
                <div className="mt-2 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                  45-Second SOP Linked
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for adding new machine */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h2 className="text-lg font-black text-slate-900">Register New Equipment</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Machine / Asset Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    placeholder="e.g. Hydraulic Press HP-08"
                    className="w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Plant Location / Bay:
                  </label>
                  <input
                    type="text"
                    required
                    value={newAsset.plantLocation}
                    onChange={(e) => setNewAsset({ ...newAsset, plantLocation: e.target.value })}
                    placeholder="e.g. Shop Floor 2 - Stamping Line"
                    className="w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-xs font-bold text-white bg-blue-700 rounded-xl hover:bg-blue-800"
                  >
                    Generate QR Label
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
