import React from 'react';
import { Issue, IssueStatus } from '../../types/issue';
import {
  X,
  MapPin,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { SupportButton } from './SupportButton';
import { formatDate } from '../../utils/formatters';
import { getPriorityBadgeColor, getStatusBadgeColor } from '../../utils/priority';
import { Link } from 'react-router-dom';
import { IssueLocationMiniMap } from '../map/IssueLocationMiniMap';

interface IssueDetailsModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onSupportToggled?: (issueId: number, newCount: number) => void;
}

const LIFECYCLE_STEPS: { status: IssueStatus; label: string; desc: string }[] = [
  { status: 'REPORTED', label: 'Reported', desc: 'Submitted by neighborhood resident' },
  { status: 'UNDER_REVIEW', label: 'Under Review', desc: 'Municipal authority assessing impact' },
  { status: 'IN_PROGRESS', label: 'In Progress', desc: 'Field crew assigned / work underway' },
  { status: 'RESOLVED', label: 'Resolved', desc: 'Community verified as completed' },
];

export const IssueDetailsModal: React.FC<IssueDetailsModalProps> = ({
  issue,
  isOpen,
  onClose,
  onSupportToggled,
}) => {
  if (!isOpen || !issue) return null;

  const priorityStyle = getPriorityBadgeColor(issue.priorityLevel);
  const statusStyle = getStatusBadgeColor(issue.status);

  // Status progress index
  const statusOrder: Record<IssueStatus, number> = {
    REPORTED: 0,
    UNDER_REVIEW: 1,
    IN_PROGRESS: 2,
    RESOLVED: 3,
    DUPLICATE: -1,
    REJECTED: -1,
  };
  const currentStep = statusOrder[issue.status] ?? 0;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + `/issues/${issue.id}`);
    alert('Link copied to clipboard!');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badges */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2 mb-3 pr-8">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            {issue.category}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
          >
            {issue.status.replace('_', ' ')}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border} ${priorityStyle.glow}`}
          >
            {issue.priorityLevel} Priority ({issue.priorityScore} pts)
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
          {issue.title}
        </h2>

        {/* Location & Reporter Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">{issue.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(issue.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-amber-500" />
            <span>{issue.peopleAffected} People Affected</span>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-surface-elevated border border-slate-200 dark:border-white/5 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Issue Description</h4>
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {issue.description}
          </p>
        </div>

        {/* Location OpenStreetMap Mini Map */}
        <div className="mb-6">
          <IssueLocationMiniMap
            location={issue.location}
            latitude={issue.latitude}
            longitude={issue.longitude}
            title={issue.title}
          />
        </div>

        {/* Priority Engine Score Breakdown */}
        <div className="p-4 rounded-2xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Community Priority Formula Breakdown
              </h4>
            </div>
            <span className="text-xs font-bold text-red-600 dark:text-red-400 tabular-nums">
              Score: {issue.priorityScore}/100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-white/60 dark:bg-surface border border-slate-200 dark:border-white/5">
              <div className="text-[10px] text-slate-400">Severity (40%)</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">{issue.severity}</div>
            </div>
            <div className="p-2 rounded-xl bg-white/60 dark:bg-surface border border-slate-200 dark:border-white/5">
              <div className="text-[10px] text-slate-400">Impact (30%)</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">{issue.peopleAffected} people</div>
            </div>
            <div className="p-2 rounded-xl bg-white/60 dark:bg-surface border border-slate-200 dark:border-white/5">
              <div className="text-[10px] text-slate-400">Urgency (20%)</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">{issue.priorityLevel}</div>
            </div>
            <div className="p-2 rounded-xl bg-white/60 dark:bg-surface border border-slate-200 dark:border-white/5">
              <div className="text-[10px] text-slate-400">Support Weight</div>
              <div className="font-bold text-red-500">{issue.supportCount} Upvotes</div>
            </div>
          </div>
        </div>

        {/* Lifecycle Progression Timeline */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Status Progression</h4>
          <div className="relative flex justify-between items-center px-2">
            {/* Connecting bar */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />
            <div
              className="absolute top-4 left-6 h-0.5 bg-red-500 transition-all duration-500 -z-0"
              style={{ width: `${(currentStep / (LIFECYCLE_STEPS.length - 1)) * 90}%` }}
            />

            {LIFECYCLE_STEPS.map((step, idx) => {
              const isPast = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={step.status} className="flex flex-col items-center text-center z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      isPast
                        ? 'bg-red-500 border-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                        : 'bg-white dark:bg-surface border-slate-300 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 ${
                      isCurrent
                        ? 'text-red-600 dark:text-red-400'
                        : isPast
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Notes (if present) */}
        {issue.adminNotes && (
          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs mb-6">
            <span className="font-bold text-purple-600 dark:text-rose-400">Admin Authority Note: </span>
            <span className="text-slate-700 dark:text-slate-300">{issue.adminNotes}</span>
          </div>
        )}

        {/* Footer actions: Support, Share, Full Page Link */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
          <SupportButton
            issueId={issue.id}
            initialCount={issue.supportCount}
            onSupportToggled={(newCount) => onSupportToggled && onSupportToggled(issue.id, newCount)}
          />

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-surface-elevated transition-colors"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <Link
              to={`/issues/${issue.id}`}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-surface-elevated hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <span>Full Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
