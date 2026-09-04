import React from 'react';
import { Issue } from '../../types/issue';
import { IssueCard } from './IssueCard';
import { AlertCircle, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IssueListProps {
  issues: Issue[];
  loading?: boolean;
  onSelectIssue?: (issue: Issue) => void;
  onSupportToggled?: (issueId: number, newCount: number) => void;
}

export const IssueList: React.FC<IssueListProps> = ({
  issues,
  loading = false,
  onSelectIssue,
  onSupportToggled,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 animate-pulse space-y-4"
          >
            <div className="flex justify-between">
              <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          No Community Issues Found
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          No issues match the selected search or filter criteria. Be the first to report a problem in your neighborhood!
        </p>
        <Link
          to="/report"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-[0_4px_16px_rgba(239,68,68,0.4)] hover:shadow-[0_4px_24px_rgba(239,68,68,0.6)] transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          onSelect={onSelectIssue}
          onSupportToggled={onSupportToggled}
        />
      ))}
    </div>
  );
};
