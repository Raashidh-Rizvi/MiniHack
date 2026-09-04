import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, FileText, UserCog, Building2 } from 'lucide-react';
import { Issue, IssueStatus, Severity } from '../../types/issue';
import { StatusBadge } from '../issues/StatusBadge';
import { PriorityBadge } from '../issues/PriorityBadge';
import { StatusTimeline } from '../issues/StatusTimeline';
import { OfficerUser } from '../../services/officerService';

interface StatusUpdateDTO {
  newStatus: IssueStatus;
  adminNotes?: string;
  adjustedSeverity?: Severity;
}

interface StatusUpdateModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issueId: number, update: StatusUpdateDTO) => void;
  onReassign?: (issueId: number, officerId: number, officerName: string) => void;
  officers?: OfficerUser[];
  isSubmitting?: boolean;
}

const STATUS_TRANSITIONS: Record<IssueStatus | string, IssueStatus[]> = {
  REPORTED: ['UNDER_REVIEW', 'DUPLICATE', 'REJECTED'],
  UNDER_REVIEW: ['IN_PROGRESS', 'REPORTED', 'DUPLICATE', 'REJECTED'],
  IN_PROGRESS: ['RESOLVED', 'UNDER_REVIEW'],
  RESOLVED: [],
  DUPLICATE: [],
  REJECTED: [],
};

const STATUS_LABELS: Record<string, string> = {
  REPORTED: 'Reported',
  UNDER_REVIEW: 'Under Review',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  DUPLICATE: 'Duplicate',
  REJECTED: 'Rejected',
};

const SEVERITY_OPTIONS: Severity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  issue,
  isOpen,
  onClose,
  onSubmit,
  onReassign,
  officers = [],
  isSubmitting = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | string>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [adjustSeverity, setAdjustSeverity] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>('MEDIUM');
  const [showReassign, setShowReassign] = useState(false);
  const [selectedOfficerId, setSelectedOfficerId] = useState<number | ''>('');
  const [isReassigning, setIsReassigning] = useState(false);

  useEffect(() => {
    if (issue) {
      setSelectedStatus('');
      setAdminNotes(issue.adminNotes || '');
      setAdjustSeverity(false);
      setSelectedSeverity(issue.severity);
      setShowReassign(false);
      setSelectedOfficerId('');
    }
  }, [issue]);

  if (!isOpen || !issue) return null;

  const availableTransitions = STATUS_TRANSITIONS[issue.status] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;

    onSubmit(issue.id, {
      newStatus: selectedStatus as IssueStatus,
      adminNotes: adminNotes.trim() || undefined,
      adjustedSeverity: adjustSeverity ? selectedSeverity : undefined,
    });
  };

  const handleReassign = async () => {
    if (!selectedOfficerId || !onReassign) return;
    const officer = officers.find((o) => o.id === Number(selectedOfficerId) || o.numericId === Number(selectedOfficerId));
    if (!officer) return;
    setIsReassigning(true);
    try {
      await onReassign(issue.id, Number(selectedOfficerId), officer.fullName);
      setShowReassign(false);
    } finally {
      setIsReassigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Update Issue Status</h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{issue.title}</p>
          </div>
          <button
            id="close-status-modal"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Current status + priority */}
          <div className="flex gap-3 flex-wrap">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Status</p>
              <StatusBadge status={issue.status} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Priority Score</p>
              <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} />
            </div>
            {issue.assignedOfficerName && (
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Assigned Officer</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/25">
                  <Building2 className="w-3 h-3" />
                  {issue.assignedOfficerName}
                </span>
              </div>
            )}
          </div>

          {/* Status timeline preview */}
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Status Progression
            </p>
            <StatusTimeline currentStatus={selectedStatus || issue.status} />
          </div>

          {/* Status selection */}
          {availableTransitions.length > 0 ? (
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                Transition To *
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTransitions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    id={`status-option-${status.toLowerCase()}`}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      selectedStatus === status
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10'
                    }`}
                  >
                    {STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-500 dark:text-slate-400">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              This issue has reached its final state.
            </div>
          )}

          {/* Severity adjustment */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                id="adjust-severity-toggle"
                checked={adjustSeverity}
                onChange={(e) => setAdjustSeverity(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Adjust Severity &amp; Recalculate Priority
              </span>
            </label>
            {adjustSeverity && (
              <div className="flex gap-2 flex-wrap pl-6">
                {SEVERITY_OPTIONS.map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    id={`severity-option-${sev.toLowerCase()}`}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                      selectedSeverity === sev
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Officer Reassignment (Admin only) */}
          {onReassign && officers.length > 0 && (
            <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="reassign-officer-toggle"
                  checked={showReassign}
                  onChange={(e) => setShowReassign(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <UserCog className="w-4 h-4 text-teal-500" />
                  Reassign to a Different Officer
                </span>
              </label>
              {showReassign && (
                <div className="pl-6 flex gap-2 items-center">
                  <select
                    id="officer-reassign-select"
                    value={selectedOfficerId}
                    onChange={(e) => setSelectedOfficerId(Number(e.target.value))}
                    className="flex-1 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-colors"
                  >
                    <option value="">Select officer…</option>
                    {officers.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.fullName} — {o.communityArea}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    id="confirm-reassign"
                    onClick={handleReassign}
                    disabled={!selectedOfficerId || isReassigning}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isReassigning ? 'Saving…' : 'Reassign'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Admin notes */}
          <div>
            <label
              htmlFor="admin-notes"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2 block"
            >
              <FileText className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
              Admin Notes (optional)
            </label>
            <textarea
              id="admin-notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes, observations, or action taken…"
              rows={3}
              maxLength={500}
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 resize-none transition-colors"
            />
            <div className="text-right text-xs text-slate-400 mt-1">{adminNotes.length}/500</div>
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
              id="submit-status-update"
              type="submit"
              disabled={!selectedStatus || isSubmitting || availableTransitions.length === 0}
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-sm shadow-indigo-500/30 transition-all duration-200"
            >
              {isSubmitting ? 'Updating…' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
