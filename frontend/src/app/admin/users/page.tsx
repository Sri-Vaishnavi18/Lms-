'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  HardHat,
  ArrowLeft,
  Calendar,
  Award,
  ChevronRight,
  TrendingUp,
  FileCheck,
  RefreshCw,
  Edit3,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { fetchApi } from '../../../lib/api';
import { SECTORS_LIST, SKILL_TIERS } from '../../../lib/languages';

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected User Modal for Person-wise Drill-down
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState<any | null>(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // Form states
  const [newUserData, setNewUserData] = useState({
    fullName: '',
    phoneNumber: '+91',
    badgeId: '',
    role: 'WORKER',
    sector: 'CONSTRUCTION',
    trade: 'Mason',
    skillTier: 'UNSKILLED',
    siteLocation: 'Plant Alpha - Main Site',
    department: 'Operations',
    password: '1234',
  });

  const [resetPasswordVal, setResetPasswordVal] = useState('1234');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStatus, setAttendanceStatus] = useState('PRESENT');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = '';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (sectorFilter) params.append('sector', sectorFilter);
      if (tierFilter) params.append('skillTier', tierFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (params.toString()) query = `?${params.toString()}`;

      const data = await fetchApi(`/admin/users${query}`);
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load workforce directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [sectorFilter, tierFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const handleViewPersonWise = async (userId: string) => {
    setSelectedUserId(userId);
    setDetailsLoading(true);
    try {
      const details = await fetchApi(`/admin/users/${userId}`);
      setSelectedUserDetails(details);
    } catch (err: any) {
      alert('Error fetching person details: ' + err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleTerminateToggle = async (user: any) => {
    const isCurrentlyActive = user.status === 'ACTIVE';
    const actionName = isCurrentlyActive ? 'TERMINATE' : 'RE-ACTIVATE';
    const confirm = window.confirm(
      `Are you sure you want to ${actionName} access for ${user.fullName} (${user.badgeId})?`
    );
    if (!confirm) return;

    try {
      const newStatus = isCurrentlyActive ? 'TERMINATED' : 'ACTIVE';
      await fetchApi(`/admin/users/${user.id}/terminate`, {
        method: 'POST',
        body: JSON.stringify({ status: newStatus }),
      });
      setActionSuccessMsg(`User status updated to ${newStatus}`);
      loadUsers();
      if (selectedUserDetails?.id === user.id) {
        setSelectedUserDetails({ ...selectedUserDetails, status: newStatus });
      }
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showResetModal) return;

    try {
      await fetchApi(`/admin/users/${showResetModal.id}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ newPassword: resetPasswordVal }),
      });
      setActionSuccessMsg(`Password/PIN reset for ${showResetModal.fullName} to: ${resetPasswordVal}`);
      setShowResetModal(null);
      setResetPasswordVal('1234');
    } catch (err: any) {
      alert('Failed to reset credentials: ' + err.message);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/admin/users', {
        method: 'POST',
        body: JSON.stringify(newUserData),
      });
      setActionSuccessMsg(`Registered new user: ${newUserData.fullName}`);
      setShowAddModal(false);
      setNewUserData({
        fullName: '',
        phoneNumber: '+91',
        badgeId: '',
        role: 'WORKER',
        sector: 'CONSTRUCTION',
        trade: 'Mason',
        skillTier: 'UNSKILLED',
        siteLocation: 'Plant Alpha - Main Site',
        department: 'Operations',
        password: '1234',
      });
      loadUsers();
    } catch (err: any) {
      alert('Registration failed: ' + err.message);
    }
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) {
      alert('Please select at least one worker.');
      return;
    }

    try {
      await fetchApi('/admin/attendance', {
        method: 'POST',
        body: JSON.stringify({
          userIds: selectedUserIds,
          date: attendanceDate,
          status: attendanceStatus,
          type: 'SHIFT_START',
          verifiedBy: 'ADM-9001',
        }),
      });
      setActionSuccessMsg(`Marked ${attendanceStatus} for ${selectedUserIds.length} workers.`);
      setShowAttendanceModal(false);
      setSelectedUserIds([]);
      loadUsers();
    } catch (err: any) {
      alert('Attendance recording failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/admin/compliance"
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Compliance Matrix</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
              <Users className="w-7 h-7 text-blue-600" />
              <span>Workforce User Management & Person-Wise Tracking</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Control employee accounts, terminate/suspend access, reset passwords, log attendance, and inspect individual milestone roadmaps.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/studio"
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Upload Sessions</span>
            </Link>

            <button
              onClick={() => {
                setSelectedUserIds(users.map((u) => u.id));
                setShowAttendanceModal(true);
              }}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Log Attendance</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        
        {/* Banner Alert */}
        {actionSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-900 shadow-xs">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button
              onClick={() => setActionSuccessMsg(null)}
              className="font-bold text-emerald-700 hover:text-emerald-950"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-3xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[260px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, badge ID (e.g. BC-1001), phone, or trade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl focus:outline-none font-bold"
            >
              <option value="">All 7 Sectors</option>
              {SECTORS_LIST.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.label}
                </option>
              ))}
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl focus:outline-none font-bold"
            >
              <option value="">All Skill Tiers</option>
              {SKILL_TIERS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl focus:outline-none font-bold"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="TERMINATED">Terminated Only</option>
            </select>

            <button
              onClick={loadUsers}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="Refresh List"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
              Loading workforce directory...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 text-xs">{error}</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No employees found matching the filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4 pl-6">Worker / ID</th>
                    <th className="p-4">Sector & Trade</th>
                    <th className="p-4">Skill Tier</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Milestone Progress</th>
                    <th className="p-4">Attendance</th>
                    <th className="p-4 pr-6 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const isTerminated = u.status === 'TERMINATED';
                    return (
                      <tr
                        key={u.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          isTerminated ? 'opacity-60 bg-red-50/20' : ''
                        }`}
                      >
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
                              {u.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{u.fullName}</span>
                                {u.role === 'ADMIN' && (
                                  <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-black">
                                    ADMIN
                                  </span>
                                )}
                                {u.role === 'SUPERVISOR' && (
                                  <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-black">
                                    SUPERVISOR
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                Badge: <span className="font-bold text-blue-600">{u.badgeId}</span> • {u.phoneNumber}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-slate-800">{u.sector?.replace('_', ' ')}</div>
                          <div className="text-[11px] text-slate-500">{u.trade}</div>
                        </td>

                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                              u.skillTier === 'HIGHLY_SKILLED'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : u.skillTier === 'SKILLED'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : u.skillTier === 'SEMI_SKILLED'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {u.skillTier?.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-4">
                          {u.status === 'ACTIVE' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              ACTIVE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-200">
                              <XCircle className="w-3 h-3" />
                              {u.status}
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <div className="w-32 space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-slate-500">{u.totalCompletions} passed</span>
                              <span className="font-bold text-emerald-600">{u.milestonePercentage}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${u.milestonePercentage}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          {u.latestAttendance ? (
                            <div>
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-emerald-700 font-mono text-[10px] font-bold">
                                {u.latestAttendance.status}
                              </span>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                {u.latestAttendance.date}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No log</span>
                          )}
                        </td>

                        <td className="p-4 pr-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleViewPersonWise(u.id)}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg transition-colors font-bold flex items-center gap-1"
                              title="Inspect Milestones"
                            >
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>Roadmap</span>
                            </button>

                            <button
                              onClick={() => setShowResetModal(u)}
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors"
                              title="Reset Password/PIN"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleTerminateToggle(u)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isTerminated
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-red-50 text-red-700 hover:bg-red-100'
                              }`}
                              title={isTerminated ? 'Re-activate Account' : 'Terminate Account Access'}
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal 1: Person-wise Milestone Drill-down */}
      {selectedUserId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-slate-200">
            {detailsLoading ? (
              <div className="p-12 text-center text-slate-400">Loading person-wise roadmap...</div>
            ) : selectedUserDetails ? (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center">
                      {selectedUserDetails.fullName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">{selectedUserDetails.fullName}</h2>
                      <div className="text-xs text-slate-500 font-mono">
                        Badge ID: <span className="font-bold text-blue-600">{selectedUserDetails.badgeId}</span> • {selectedUserDetails.phoneNumber}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUserId(null);
                      setSelectedUserDetails(null);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg bg-slate-100"
                  >
                    ✕
                  </button>
                </div>

                {/* Progress bar */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">Verified Milestone Competencies</span>
                    <span className="font-mono text-emerald-600">
                      {selectedUserDetails.milestones?.passedModules} / {selectedUserDetails.milestones?.totalModules} Modules ({selectedUserDetails.milestones?.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${selectedUserDetails.milestones?.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Submissions */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-indigo-600" />
                    <span>Submitted Practical Photo Proofs ({selectedUserDetails.submissions?.length || 0})</span>
                  </h3>
                  {selectedUserDetails.submissions?.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No assignments submitted yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedUserDetails.submissions.map((sub: any) => (
                        <div key={sub.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-900 line-clamp-1">{sub.assignment?.title}</span>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded font-black ${
                                sub.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </div>
                          {sub.proofUrl && (
                            <img src={sub.proofUrl} alt="Proof" className="w-full h-24 object-cover rounded-lg border border-slate-200" />
                          )}
                          <p className="text-[11px] text-slate-600">{sub.notes || 'No notes'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs">
                  <button
                    onClick={() => handleTerminateToggle(selectedUserDetails)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold transition-all border border-red-200"
                  >
                    {selectedUserDetails.status === 'ACTIVE' ? 'Terminate Account' : 'Re-Activate Account'}
                  </button>
                  <button
                    onClick={() => {
                      setShowResetModal(selectedUserDetails);
                      setSelectedUserId(null);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
                  >
                    Reset Password / PIN
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Modal 2: Reset Password / PIN */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-500" />
              <span>Reset Credentials for {showResetModal.fullName}</span>
            </h2>

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">New Password or 4-Digit PIN</label>
                <input
                  type="text"
                  value={resetPasswordVal}
                  onChange={(e) => setResetPasswordVal(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Add New User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-slate-200">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span>Register New Employee Account</span>
            </h2>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Full Legal Name</label>
                <input
                  type="text"
                  value={newUserData.fullName}
                  onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Rajesh Sharma"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Phone Number</label>
                  <input
                    type="text"
                    value={newUserData.phoneNumber}
                    onChange={(e) => setNewUserData({ ...newUserData, phoneNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+919876543219"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Badge ID</label>
                  <input
                    type="text"
                    value={newUserData.badgeId}
                    onChange={(e) => setNewUserData({ ...newUserData, badgeId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="BC-1008"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Workforce Sector</label>
                  <select
                    value={newUserData.sector}
                    onChange={(e) => setNewUserData({ ...newUserData, sector: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  >
                    {SECTORS_LIST.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Sub-Trade</label>
                  <input
                    type="text"
                    value={newUserData.trade}
                    onChange={(e) => setNewUserData({ ...newUserData, trade: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                    placeholder="e.g. Scaffolder"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Skill Tier</label>
                  <select
                    value={newUserData.skillTier}
                    onChange={(e) => setNewUserData({ ...newUserData, skillTier: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  >
                    {SKILL_TIERS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Role</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  >
                    <option value="WORKER">Worker</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Initial Password / PIN</label>
                <input
                  type="text"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Log Attendance */}
      {showAttendanceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Log Shift Attendance</span>
            </h2>

            <form onSubmit={handleMarkAttendance} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Attendance Status</label>
                <select
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                >
                  <option value="PRESENT">PRESENT (Cleared for Shift)</option>
                  <option value="ABSENT">ABSENT</option>
                  <option value="LATE">LATE ARRIVAL</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAttendanceModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Save Attendance
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
