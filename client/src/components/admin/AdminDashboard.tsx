import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, AlertTriangle, CheckCircle, Clock, Activity,
  Search, RefreshCw, Shield,
} from 'lucide-react';
import { Issue } from '../../types/issue';
import { MetricsCard } from './MetricsCard';
import { PriorityQueueTable } from './PriorityQueueTable';
import { StatusUpdateModal } from './StatusUpdateModal';
import { PriorityFilter } from '../filters/PriorityFilter';
import { StatusFilter } from '../filters/StatusFilter';
import {
  getAdminStats,
  getPriorityQueue,
  updateIssueStatus,
  moderateDeleteIssue,
  reassignOfficer,
  AdminStats,
  StatusUpdatePayload,
} from '../../services/adminService';
import { getOfficerList, OfficerUser } from '../../services/officerService';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalIssues: 0,
    openIssues: 0,
    inProgressIssues: 0,
    criticalIssues: 0,
    resolvedIssues: 0,
  });
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Officers list for reassignment
  const [officers, setOfficers] = useState<OfficerUser[]>([]);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await getAdminStats();
      setStats(data);
    } catch {
      // stats failure is non-fatal
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPriorityQueue({
        search: search || undefined,
        priorityLevel: selectedPriority !== 'ALL' ? selectedPriority : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
      });
      setIssues(data);
    } catch {
      setError('Unable to load priority queue. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedPriority, selectedStatus]);

  useEffect(() => {
    fetchStats();
    // Load officer list for reassignment
    getOfficerList().then(setOfficers).catch(() => {});
  }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(fetchQueue, 300);
    return () => clearTimeout(timer);
  }, [fetchQueue]);

  const handleSelectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setModalOpen(true);
  };

  const handleStatusUpdate = async (issueId: number, payload: StatusUpdatePayload) => {
    try {
      setIsSubmitting(true);
      const updated = await updateIssueStatus(issueId, payload);
      setIssues((prev) => prev.map((i) => (i.id === issueId ? updated : i)));
      setModalOpen(false);
      setSelectedIssue(null);
      fetchStats();
    } catch {
      alert('Failed to update issue status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (issueId: number) => {
    try {
      await moderateDeleteIssue(issueId);
      setIssues((prev) => prev.filter((i) => i.id !== issueId));
      fetchStats();
    } catch {
      alert('Failed to remove issue. Please try again.');
    }
  };

  const handleReassignOfficer = async (issueId: number, officerId: number, officerName: string) => {
    try {
      const updated = await reassignOfficer(issueId, officerId, officerName);
      setIssues((prev) => prev.map((i) => (i.id === issueId ? updated : i)));
      // Update selectedIssue so the modal reflects the change
      if (selectedIssue?.id === issueId) {
        setSelectedIssue(updated);
      }
    } catch {
      alert('Failed to reassign officer. Please try again.');
    }
  };

  // Quick advance to next status
  const STATUS_NEXT: Record<string, string> = {
    REPORTED: 'UNDER_REVIEW',
    UNDER_REVIEW: 'IN_PROGRESS',
    IN_PROGRESS: 'RESOLVED',
  };
  const handleQuickAdvance = async (issueId: number) => {
    const issue = issues.find((i) => i.id === issueId);
    if (!issue) return;
    const nextStatus = STATUS_NEXT[issue.status];
    if (!nextStatus) return;
    await handleStatusUpdate(issueId, { newStatus: nextStatus as any });
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricsCard
          id="stats-total"
          title="Total Issues"
          value={statsLoading ? '—' : stats.totalIssues}
          icon={LayoutDashboard}
          colorTheme="indigo"
          subtitle="All reported issues"
        />
        <MetricsCard
          id="stats-open"
          title="Open"
          value={statsLoading ? '—' : stats.openIssues}
          icon={Clock}
          colorTheme="sky"
          subtitle="Awaiting action"
        />
        <MetricsCard
          id="stats-critical"
          title="Critical"
          value={statsLoading ? '—' : stats.criticalIssues}
          icon={AlertTriangle}
          colorTheme="red"
          subtitle="Highest priority"
        />
        <MetricsCard
          id="stats-in-progress"
          title="In Progress"
          value={statsLoading ? '—' : stats.inProgressIssues}
          icon={Activity}
          colorTheme="amber"
          subtitle="Being addressed"
        />
        <MetricsCard
          id="stats-resolved"
          title="Resolved"
          value={statsLoading ? '—' : stats.resolvedIssues}
          icon={CheckCircle}
          colorTheme="emerald"
          subtitle="Completed"
        />
      </div>

      {/* Priority Queue Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm overflow-hidden">
        {/* Queue header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Community Priority Queue
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-medium">
                {issues.length} issues
              </span>
            </div>
            <button
              id="refresh-queue"
              onClick={() => { fetchQueue(); fetchStats(); }}
              className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
              id="admin-search"
              type="text"
              placeholder="Search by title, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Priority chips */}
          <PriorityFilter selectedPriority={selectedPriority} onSelectPriority={setSelectedPriority} />

          {/* Status chips */}
          <StatusFilter selectedStatus={selectedStatus} onSelectStatus={setSelectedStatus} />
        </div>

        {/* Table */}
        <div className="p-4">
          {error ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 text-red-600 dark:text-red-400 text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              {error}
              <button
                onClick={fetchQueue}
                className="ml-auto text-xs underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <PriorityQueueTable
              issues={issues}
              loading={loading}
              onSelectIssue={handleSelectIssue}
              onQuickStatusUpdate={handleQuickAdvance}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        issue={selectedIssue}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedIssue(null); }}
        onSubmit={handleStatusUpdate}
        onReassign={handleReassignOfficer}
        officers={officers}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
