import React, { useState } from 'react';
import {
  ChevronUp, ChevronDown, MapPin, Users, Trash2, Eye, ArrowRight,
  Search,
} from 'lucide-react';
import { Issue } from '../../types/issue';
import { PriorityBadge } from '../issues/PriorityBadge';
import { StatusBadge } from '../issues/StatusBadge';
import { formatRelativeTime } from '../../utils/formatters';

interface PriorityQueueTableProps {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onQuickStatusUpdate?: (id: number) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

type SortField = 'priorityScore' | 'createdAt' | 'peopleAffected';
type SortDir = 'asc' | 'desc';

export const PriorityQueueTable: React.FC<PriorityQueueTableProps> = ({
  issues,
  onSelectIssue,
  onQuickStatusUpdate,
  onDelete,
  loading = false,
}) => {
  const [sortField, setSortField] = useState<SortField>('priorityScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sorted = [...issues].sort((a, b) => {
    let diff = 0;
    if (sortField === 'priorityScore') diff = b.priorityScore - a.priorityScore;
    else if (sortField === 'createdAt') diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    else if (sortField === 'peopleAffected') diff = b.peopleAffected - a.peopleAffected;
    return sortDir === 'desc' ? diff : -diff;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="w-3.5 h-3.5 opacity-30" />;
    return sortDir === 'desc'
      ? <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
      : <ChevronUp className="w-3.5 h-3.5 text-indigo-500" />;
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <Search className="w-10 h-10 mb-3 opacity-40" />
        <p className="font-medium">No issues match your filters</p>
        <p className="text-sm mt-1">Try adjusting the priority or status filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70">
            <th className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider w-8">
              #
            </th>
            <th className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              Issue
            </th>
            <th
              className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none"
              onClick={() => handleSort('priorityScore')}
            >
              <div className="flex items-center gap-1">
                Score <SortIcon field="priorityScore" />
              </div>
            </th>
            <th className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              Status
            </th>
            <th
              className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none hidden md:table-cell"
              onClick={() => handleSort('peopleAffected')}
            >
              <div className="flex items-center gap-1">
                Affected <SortIcon field="peopleAffected" />
              </div>
            </th>
            <th
              className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none hidden lg:table-cell"
              onClick={() => handleSort('createdAt')}
            >
              <div className="flex items-center gap-1">
                Reported <SortIcon field="createdAt" />
              </div>
            </th>
            <th className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden xl:table-cell">
              Assigned To
            </th>
            <th className="text-right px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {sorted.map((issue, index) => {
            const rankColors: Record<string, string> = {
              CRITICAL: 'text-red-500 font-bold',
              HIGH: 'text-orange-500 font-semibold',
              MEDIUM: 'text-amber-500',
              LOW: 'text-emerald-500',
            };
            return (
              <tr
                key={issue.id}
                className="group bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors duration-150"
              >
                {/* Rank */}
                <td className="px-4 py-3">
                  <span className={`text-sm font-mono ${rankColors[issue.priorityLevel] || 'text-slate-400'}`}>
                    {index + 1}
                  </span>
                </td>

                {/* Issue info */}
                <td className="px-4 py-3 max-w-xs">
                  <div className="space-y-0.5">
                    <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{issue.title}</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{issue.location}</span>
                    </div>
                  </div>
                </td>

                {/* Priority score */}
                <td className="px-4 py-3">
                  <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} size="sm" />
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={issue.status} size="sm" />
                </td>

                {/* People affected */}
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-xs">
                    <Users className="w-3.5 h-3.5" />
                    {issue.peopleAffected.toLocaleString()}
                  </div>
                </td>

                {/* Created at */}
                <td className="px-4 py-3 text-xs text-slate-400 hidden lg:table-cell">
                  {formatRelativeTime(issue.createdAt)}
                </td>

                {/* Assigned Officer */}
                <td className="px-4 py-3 hidden xl:table-cell">
                  {issue.assignedOfficerName ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                      {issue.assignedOfficerName}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Unassigned</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      id={`view-issue-${issue.id}`}
                      onClick={() => onSelectIssue(issue)}
                      title="View & Update Issue"
                      className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {onQuickStatusUpdate && (
                      <button
                        id={`advance-issue-${issue.id}`}
                        onClick={() => onQuickStatusUpdate(issue.id)}
                        title="Advance Status"
                        className="p-1.5 rounded-md text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    {deleteConfirm === issue.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { onDelete(issue.id); setDeleteConfirm(null); }}
                          className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`delete-issue-${issue.id}`}
                        onClick={() => setDeleteConfirm(issue.id)}
                        title="Remove Issue"
                        className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
