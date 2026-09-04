import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2, AlertTriangle, CheckCircle, Clock, Activity,
  Search, RefreshCw, ArrowLeft, MapPin, Users,
  ChevronRight, FileText, X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Issue, IssueStatus } from '../types/issue';
import { useAuth } from '../hooks/useAuth';
import {
  getOfficerStats,
  getOfficerQueue,
  officerUpdateStatus,
  OfficerStats,
  OfficerStatusPayload,
} from '../services/officerService';
import { StatusBadge } from '../components/issues/StatusBadge';
import { PriorityBadge } from '../components/issues/PriorityBadge';
import { StatusTimeline } from '../components/issues/StatusTimeline';
import { formatRelativeTime } from '../utils/formatters';

// ─── Status Update Modal for Officers ────────────────────────────────────────

const OFFICER_TRANSITIONS: Record<string, IssueStatus[]> = {
  REPORTED: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: [],
};

const STATUS_LABELS: Record<string, string> = {
  UNDER_REVIEW: 'Under Review',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
};

interface OfficerModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issueId: number, payload: OfficerStatusPayload) => Promise<void>;
  isSubmitting: boolean;
}

const OfficerUpdateModal: React.FC<OfficerModalProps> = ({
  issue, isOpen, onClose, onSubmit, isSubmitting,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | ''>('');
  const [fieldNotes, setFieldNotes] = useState('');

  useEffect(() => {
    if (issue) {
      setSelectedStatus('');
      setFieldNotes(issue.adminNotes || '');
    }
  }, [issue]);

  if (!isOpen || !issue) return null;

  const available = OFFICER_TRANSITIONS[issue.status] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;
    onSubmit(issue.id, {
      newStatus: selectedStatus as IssueStatus,
      fieldNotes: fieldNotes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Officer Action</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Update Issue Status</h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{issue.title}</p>
          </div>
          <button
            id="close-officer-modal"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Current badges */}
          <div className="flex gap-3 flex-wrap">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Status</p>
              <StatusBadge status={issue.status} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Priority</p>
              <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} />
            </div>
          </div>

          {/* Status timeline */}
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Progress</p>
            <StatusTimeline currentStatus={selectedStatus || issue.status} />
          </div>

          {/* Status options */}
          {available.length > 0 ? (
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                Move To *
              </label>
              <div className="flex flex-wrap gap-2">
                {available.map((status) => (
                  <button
                    key={status}
                    type="button"
                    id={`officer-status-${status.toLowerCase()}`}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      selectedStatus === status
                        ? 'bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-500/30'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10'
                    }`}
                  >
                    {STATUS_LABELS[status] || status}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-500 dark:text-slate-400">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Issue has reached its final state.
            </div>
          )}

          {/* Field notes */}
          <div>
            <label
              htmlFor="officer-field-notes"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2 block"
            >
              <FileText className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
              Field Notes (optional)
            </label>
            <textarea
              id="officer-field-notes"
              value={fieldNotes}
              onChange={(e) => setFieldNotes(e.target.value)}
              placeholder="Add field observations, actions taken, estimated resolution time…"
              rows={3}
              maxLength={500}
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 resize-none transition-colors"
            />
            <div className="text-right text-xs text-slate-400 mt-1">{fieldNotes.length}/500</div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-officer-update"
              type="submit"
              disabled={!selectedStatus || isSubmitting || available.length === 0}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-sm shadow-orange-500/30 transition-all duration-200"
            >
              {isSubmitting ? 'Updating…' : 'Submit Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  id: string;
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  subtitle: string;
}

const StatCard: React.FC<StatCardProps> = ({ id, title, value, icon: Icon, color, subtitle }) => (
  <div
    id={id}
    className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl ${color} flex-shrink-0`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{title}</p>
      <p className="text-xs text-slate-400 truncate">{subtitle}</p>
    </div>
  </div>
);

// ─── Main Officer Page ────────────────────────────────────────────────────────

export const OfficerPage: React.FC = () => {
  const { currentUser } = useAuth();
  // Phase 4: officerId no longer sent to API — the backend reads it from the JWT token.

  const [stats, setStats] = useState<OfficerStats>({
    totalIssues: 0, openIssues: 0, inProgressIssues: 0, resolvedIssues: 0, criticalIssues: 0,
  });
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      // Phase 4: No officerId passed — backend identifies officer via JWT token
      const data = await getOfficerStats();
      setStats(data);
    } catch {
      // non-fatal — stats failure should not block the queue
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Phase 4: No officerId passed — backend identifies officer via JWT token
      const data = await getOfficerQueue({
        search: search || undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
      });
      setIssues(data);
    } catch {
      setError('Unable to load your assigned issues. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedStatus]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => {
    const t = setTimeout(fetchQueue, 300);
    return () => clearTimeout(t);
  }, [fetchQueue]);

  const handleStatusUpdate = async (issueId: number, payload: OfficerStatusPayload) => {
    try {
      setIsSubmitting(true);
      // Phase 4: No officerId in payload — backend enforces ownership via JWT token
      const updated = await officerUpdateStatus(issueId, payload);
      setIssues((prev) => prev.map((i) => (i.id === issueId ? updated : i)));
      setModalOpen(false);
      setSelectedIssue(null);
      setSuccessMsg(`Issue #${issueId} updated to ${payload.newStatus.replace('_', ' ')} ✓`);
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchStats();
    } catch (err: any) {
      // Phase 4: Use setError() for proper UI display instead of browser alert()
      const msg = err?.response?.data?.message || 'Failed to update issue status. Please try again.';
      setError(msg);
      setTimeout(() => setError(null), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusFilters = ['ALL', 'REPORTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'];
  const statusColors: Record<string, string> = {
    ALL: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    REPORTED: 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300',
    UNDER_REVIEW: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
    IN_PROGRESS: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
    RESOLVED: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-950 via-amber-950 to-slate-900 text-white border-b border-orange-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              to="/issues"
              className="flex items-center gap-1.5 text-orange-300 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to site
            </Link>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-xl bg-orange-500/20 border border-orange-500/30">
              <Building2 className="w-7 h-7 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Officer Dashboard</h1>
              <p className="mt-1 text-orange-200/90 text-sm max-w-2xl">
                Welcome, <span className="font-semibold text-white">{currentUser.fullName}</span>. 
                Manage and update the status of civic issues assigned to you.
              </p>
              <p className="mt-0.5 text-orange-400/90 text-xs">{currentUser.communityArea}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Success Toast */}
        {successMsg && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-sm font-medium animate-fadeIn">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard id="officer-stat-total" title="Total Assigned" value={statsLoading ? '—' : stats.totalIssues} icon={Building2} color="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400" subtitle="All assigned to you" />
          <StatCard id="officer-stat-open" title="Open" value={statsLoading ? '—' : stats.openIssues} icon={Clock} color="bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400" subtitle="Needs attention" />
          <StatCard id="officer-stat-critical" title="Critical" value={statsLoading ? '—' : stats.criticalIssues} icon={AlertTriangle} color="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400" subtitle="Highest priority" />
          <StatCard id="officer-stat-inprogress" title="In Progress" value={statsLoading ? '—' : stats.inProgressIssues} icon={Activity} color="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" subtitle="Being addressed" />
          <StatCard id="officer-stat-resolved" title="Resolved" value={statsLoading ? '—' : stats.resolvedIssues} icon={CheckCircle} color="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" subtitle="Completed" />
        </div>

        {/* Issue Queue */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm overflow-hidden">
          {/* Queue header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-500" />
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">My Assigned Issues</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-medium">
                  {issues.length} issues
                </span>
              </div>
              <button
                id="officer-refresh-queue"
                onClick={() => { fetchQueue(); fetchStats(); }}
                className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="officer-search"
                type="text"
                placeholder="Search by title, location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-colors"
              />
            </div>
            {/* Status filter chips */}
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((s) => (
                <button
                  key={s}
                  id={`officer-filter-${s.toLowerCase()}`}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 ${
                    selectedStatus === s
                      ? `${statusColors[s]} border-current shadow-sm`
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {s === 'ALL' ? 'All' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Table/Cards */}
          <div className="p-4">
            {error ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 text-red-600 dark:text-red-400 text-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                {error}
                <button onClick={fetchQueue} className="ml-auto text-xs underline hover:no-underline">Retry</button>
              </div>
            ) : loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ))}
              </div>
            ) : issues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Building2 className="w-10 h-10 mb-3 opacity-40" />
                <p className="font-medium">No assigned issues</p>
                <p className="text-sm mt-1">Issues assigned to you will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70">
                      <th className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">#</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Issue</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Priority</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden md:table-cell">Affected</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden lg:table-cell">Reported</th>
                      <th className="text-right px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {issues.map((issue, index) => {
                      const rankColors: Record<string, string> = {
                        CRITICAL: 'text-red-500 font-bold',
                        HIGH: 'text-orange-500 font-semibold',
                        MEDIUM: 'text-amber-500',
                        LOW: 'text-emerald-500',
                      };
                      const canUpdate = ['REPORTED', 'UNDER_REVIEW', 'IN_PROGRESS'].includes(issue.status);
                      return (
                        <tr
                          key={issue.id}
                          className="group bg-white dark:bg-slate-800/40 hover:bg-orange-50/30 dark:hover:bg-orange-950/20 transition-colors duration-150"
                        >
                          <td className="px-4 py-3">
                            <span className={`text-sm font-mono ${rankColors[issue.priorityLevel] || 'text-slate-400'}`}>{index + 1}</span>
                          </td>
                          <td className="px-4 py-3 max-w-xs">
                            <div className="space-y-0.5">
                              <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{issue.title}</p>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{issue.location}</span>
                              </div>
                              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                                {issue.category}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} size="sm" />
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={issue.status} size="sm" />
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-xs">
                              <Users className="w-3.5 h-3.5" />
                              {issue.peopleAffected.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-400 hidden lg:table-cell">
                            {formatRelativeTime(issue.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              {canUpdate ? (
                                <button
                                  id={`officer-update-${issue.id}`}
                                  onClick={() => { setSelectedIssue(issue); setModalOpen(true); }}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-500 hover:to-red-500 transition-colors shadow-sm shadow-orange-500/20"
                                >
                                  Update <ChevronRight className="w-3 h-3" />
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400 italic px-2">Final</span>
                              )}
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
        </div>
      </div>

      {/* Officer Update Modal */}
      <OfficerUpdateModal
        issue={selectedIssue}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedIssue(null); }}
        onSubmit={handleStatusUpdate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
