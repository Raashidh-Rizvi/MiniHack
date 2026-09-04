import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Clock,
  MapPin,
  Users,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Filter,
  Loader2,
  FileQuestion,
} from 'lucide-react';
import { citizenService } from '../services/citizenService';
import { Issue, IssueStatus, IssueUpdateDTO } from '../types/issue';
import { formatRelativeTime } from '../utils/formatters';
import { EditIssueModal } from '../components/issues/EditIssueModal';
import { useAuth } from '../hooks/useAuth';

export const MyReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const { currentUser } = useAuth();

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await citizenService.getMyReports(currentUser.id);
      setReports(data);
    } catch (err) {
      console.warn('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser.id]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleEditClick = (issue: Issue) => {
    setEditingIssue(issue);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (id: number, updateData: IssueUpdateDTO) => {
    await citizenService.updateIssue(id, updateData);
    setActionNotice(`Report #${id} was updated successfully.`);
    fetchReports();
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleCancelClick = async (id: number) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel and withdraw Report #${id}? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await citizenService.cancelIssue(id);
      setActionNotice(`Report #${id} has been cancelled and withdrawn.`);
      setReports((prev) => prev.filter((r) => r.id !== id));
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel report.';
      alert(msg);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-8 py-6 sm:py-10 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-1">
            <span>Resident Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Submitted Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Track, update, or cancel civic issue reports filed by {currentUser.fullName} ({currentUser.communityArea}).
          </p>
        </div>

        <Link
          to="/report"
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center space-x-2 self-start sm:self-auto active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Report</span>
        </Link>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
        <span className="text-xs text-slate-500 flex items-center space-x-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </span>
        {['ALL', 'REPORTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'].map((status) => {
          const count =
            status === 'ALL'
              ? reports.length
              : reports.filter((r) => r.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Reports' : status.replace('_', ' ')} ({count})
            </button>
          );
        })}
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-400" />
          <p className="text-sm">Loading your community reports...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No reports found</h3>
            <p className="text-xs text-slate-400 mt-1">
              {filterStatus === 'ALL'
                ? "You haven't submitted any civic issue reports yet."
                : `No reports currently matching the '${filterStatus}' status filter.`}
            </p>
          </div>
          <Link
            to="/report"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-lg transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit Your First Report</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReports.map((issue) => {
            const isResolved = issue.status === 'RESOLVED';
            return (
              <div
                key={issue.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-4 shadow-lg"
              >
                {/* Top Row: Meta Tags & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-slate-400">#{issue.id}</span>
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                      {issue.category}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        issue.status === 'RESOLVED'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : issue.status === 'IN_PROGRESS'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : issue.status === 'UNDER_REVIEW'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {issue.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Priority Score Indicator */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
                    <span className="text-sm font-extrabold text-white">{issue.priorityScore}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                        issue.priorityLevel === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : issue.priorityLevel === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : issue.priorityLevel === 'MEDIUM'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {issue.priorityLevel}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{issue.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{issue.description}</p>
                </div>

                {/* Details Footer: Location, Affected, Relative Time */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center space-x-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{issue.location}</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                      <span>{issue.peopleAffected} affected</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reported {formatRelativeTime(issue.createdAt)}</span>
                    </span>
                  </div>

                  {/* Actions for Citizen Self-Service */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditClick(issue)}
                      disabled={isResolved}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed"
                      title={isResolved ? 'Resolved reports cannot be edited' : 'Edit report details'}
                    >
                      <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleCancelClick(issue.id)}
                      disabled={isResolved}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed"
                      title={isResolved ? 'Resolved reports cannot be cancelled' : 'Withdraw and delete report'}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      <EditIssueModal
        issue={editingIssue}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingIssue(null);
        }}
        onUpdate={handleUpdate}
      />
    </div>
  );
};
