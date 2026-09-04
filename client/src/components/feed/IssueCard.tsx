import React from 'react';
import { Issue } from '../../types/issue';
import { MapPin, Users, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';
import { SupportButton } from './SupportButton';
import { formatRelativeTime } from '../../utils/formatters';
import { getPriorityBadgeColor, getStatusBadgeColor } from '../../utils/priority';

interface IssueCardProps {
  issue: Issue;
  onSelect?: (issue: Issue) => void;
  onSupportToggled?: (issueId: number, newCount: number) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onSelect, onSupportToggled }) => {
  const priorityStyle = getPriorityBadgeColor(issue.priorityLevel);
  const statusStyle = getStatusBadgeColor(issue.status);

  return (
    <div
      onClick={() => onSelect && onSelect(issue)}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/40 shadow-sm hover:shadow-[0_12px_32px_-8px_rgba(239,68,68,0.2)] transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top ambient glow flare on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-red-500/15 transition-all duration-300" />

      {/* Card Header: Category, Priority Badge, Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            {/* Category tag */}
            <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              {issue.category}
            </span>

            {/* Status Chip */}
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              {issue.status.replace('_', ' ')}
            </span>
          </div>

          {/* Priority Score Ring / Pill */}
          <div
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border} ${priorityStyle.glow}`}
            title={`Community Priority Score: ${issue.priorityScore}/100 (${issue.priorityLevel})`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{issue.priorityScore}</span>
            <span className="text-[10px] opacity-75 font-normal">pts</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 mb-2">
          {issue.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {issue.description}
        </p>
      </div>

      {/* Metadata & Footer Bar */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex flex-col gap-3">
        {/* Info row */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1 truncate max-w-[65%]">
            <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <span className="truncate">{issue.location}</span>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatRelativeTime(issue.createdAt)}</span>
          </div>
        </div>

        {/* Action row: People Affected, Support Button, View Details */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>{issue.peopleAffected} affected</span>
          </div>

          <div className="flex items-center space-x-2">
            <SupportButton
              issueId={issue.id}
              initialCount={issue.supportCount}
              compact
              onSupportToggled={(newCount) => onSupportToggled && onSupportToggled(issue.id, newCount)}
            />

            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated transition-colors"
              title="View full report details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
