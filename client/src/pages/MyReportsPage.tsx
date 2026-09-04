import React, { useState, useEffect } from 'react';
import { Issue, IssueStatus } from '../types/issue';
import { citizenService } from '../services/citizenService';
import { useAuth } from '../hooks/useAuth';
import { EditIssueModal } from '../components/citizen/EditIssueModal';
import {
  FileText,
  PlusCircle,
  Edit3,
  Trash2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatters';
import { getPriorityBadgeColor, getStatusBadgeColor } from '../utils/priority';

export const MyReportsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<IssueStatus | 'ALL'>('ALL');
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [deletingIssueId, setDeletingIssueId] = useState<number | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await citizenService.getMyReports(currentUser?.id || 1);
      setReports(data);
    } catch (err) {
      console.error('Failed to load citizen reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [currentUser]);

  const handleCancelConfirm = async () => {
    if (!deletingIssueId) return;
    try {
      await citizenService.cancelIssue(deletingIssueId);
      setReports((prev) => prev.filter((r) => r.id !== deletingIssueId));
      setCancelModalOpen(false);
      setDeletingIssueId(null);
    } catch (err) {
      console.error('Failed to cancel report:', err);
    }
  };

  const handleIssueUpdated = (updated: Issue) => {
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const filteredReports = activeStatus === 'ALL'
    ? reports
    : reports.filter((r) => r.status === activeStatus);

  const stats = {
    total: reports.length,
    active: reports.filter((r) => r.status === 'REPORTED' || r.status === 'UNDER_REVIEW' || r.status === 'IN_PROGRESS').length,
    resolved: reports.filter((r) => r.status === 'RESOLVED').length,
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Resident Dashboard (READ, UPDATE, DELETE)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            My Submitted Reports
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track and self-manage community reports submitted by <strong className="text-slate-800 dark:text-slate-200">{currentUser.fullName}</strong>.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-[0_4px_16px_rgba(239,68,68,0.4)] hover:shadow-[0_4px_24px_rgba(239,68,68,0.6)] transition-all w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {stats.total}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Submissions</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {stats.active}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">In Active Pipeline</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {stats.resolved}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Verified Resolved</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6">
        {(['ALL', 'REPORTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'] as const).map((status) => {
          const isActive = activeStatus === status;
          return (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow'
                  : 'bg-white dark:bg-surface text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300'
              }`}
            >
              {status === 'ALL' ? 'All My Reports' : status.replace('_', ' ')}
            </button>
          );
        })}
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-6 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 animate-pulse h-28"
            />
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            No Reports in this Category
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            You haven't submitted any reports matching this status filter yet.
          </p>
          <Link
            to="/report"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Report</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const priorityStyle = getPriorityBadgeColor(report.priorityLevel);
            const statusStyle = getStatusBadgeColor(report.status);

            return (
              <div
                key={report.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/30 shadow-sm transition-all duration-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                      {report.category}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      {report.status.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
                    >
                      {report.priorityLevel} ({report.priorityScore} pts)
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {report.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>{report.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                    <div>
                      <strong>{report.supportCount}</strong> community upvotes
                    </div>
                  </div>
                </div>

                {/* Self-service Action Buttons (EDIT & DELETE CRUD) */}
                <div className="flex items-center space-x-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/5 justify-end">
                  <Link
                    to={`/issues/${report.id}`}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated transition-colors"
                    title="View Public Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setEditingIssue(report)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-surface-elevated hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-sky-500" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeletingIssueId(report.id);
                      setCancelModalOpen(true);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal (UPDATE CRUD) */}
      <EditIssueModal
        issue={editingIssue}
        isOpen={Boolean(editingIssue)}
        onClose={() => setEditingIssue(null)}
        onUpdated={handleIssueUpdated}
      />

      {/* Cancel Confirmation Modal (DELETE CRUD) */}
      {cancelModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
          onClick={() => setCancelModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 shadow-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Cancel this Report?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              This action will permanently withdraw report #{deletingIssueId} from the Community Priority Queue.
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-surface-elevated"
              >
                Keep Report
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-[0_4px_12px_rgba(220,38,38,0.4)]"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
