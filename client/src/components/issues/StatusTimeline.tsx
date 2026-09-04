import React from 'react';
import { CheckCircle, Clock, Eye, Wrench, XCircle } from 'lucide-react';
import { IssueStatus } from '../../types/issue';

interface TimelineEvent {
  status: IssueStatus | string;
  timestamp?: string;
  note?: string;
  updatedBy?: string;
}

interface StatusTimelineProps {
  currentStatus: IssueStatus | string;
  history?: TimelineEvent[];
}

const STATUS_FLOW: Array<{ key: string; label: string; icon: React.ReactNode }> = [
  { key: 'REPORTED', label: 'Reported', icon: <Clock className="w-4 h-4" /> },
  { key: 'UNDER_REVIEW', label: 'Under Review', icon: <Eye className="w-4 h-4" /> },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: <Wrench className="w-4 h-4" /> },
  { key: 'RESOLVED', label: 'Resolved', icon: <CheckCircle className="w-4 h-4" /> },
];

const STATUS_ORDER: Record<string, number> = {
  REPORTED: 0,
  UNDER_REVIEW: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
  DUPLICATE: 3,
  REJECTED: 3,
};

const getStepColor = (stepKey: string, currentStatus: string) => {
  const currentOrder = STATUS_ORDER[currentStatus] ?? 0;
  const stepOrder = STATUS_ORDER[stepKey] ?? 0;

  if (stepOrder < currentOrder) {
    return {
      circle: 'bg-emerald-500 border-emerald-500 text-white',
      line: 'bg-emerald-400',
      text: 'text-emerald-600 dark:text-emerald-400',
    };
  }
  if (stepOrder === currentOrder) {
    return {
      circle: 'bg-indigo-500 border-indigo-500 text-white ring-4 ring-indigo-500/25',
      line: 'bg-slate-200 dark:bg-slate-700',
      text: 'text-indigo-600 dark:text-indigo-400 font-semibold',
    };
  }
  return {
    circle: 'bg-transparent border-slate-300 dark:border-slate-600 text-slate-400',
    line: 'bg-slate-200 dark:bg-slate-700',
    text: 'text-slate-400 dark:text-slate-500',
  };
};

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, history }) => {
  const isTerminal = ['DUPLICATE', 'REJECTED'].includes(currentStatus);

  return (
    <div className="space-y-1">
      {!isTerminal && <div className="flex items-start gap-0">
        {STATUS_FLOW.map((step, index) => {
          const colors = getStepColor(step.key, currentStatus);
          const isLast = index === STATUS_FLOW.length - 1;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              {/* Circle + Line row */}
              <div className="flex items-center w-full">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${colors.circle}`}
                >
                  {step.icon}
                </div>
                {!isLast && (
                  <div className={`flex-1 h-0.5 transition-all duration-500 ${colors.line}`} />
                )}
              </div>
              {/* Label */}
              <div className={`mt-2 text-xs text-center leading-tight ${colors.text}`}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>}

      {/* Terminal status banner */}
      {isTerminal && (
        <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-red-500/10 border border-red-500/25 rounded-lg text-red-600 dark:text-red-400 text-xs">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span>This report was marked as <strong>{currentStatus}</strong> by an administrator.</span>
        </div>
      )}

      {/* History audit trail */}
      {history && history.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Audit Trail</p>
          {history.map((event, i) => (
            <div key={i} className="flex gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="flex-shrink-0 w-2 h-2 mt-1 rounded-full bg-indigo-400" />
              <div>
                <span className="font-medium">{event.status}</span>
                {event.updatedBy && <span className="text-slate-400"> — {event.updatedBy}</span>}
                {event.timestamp && (
                  <span className="block text-slate-400">
                    {new Date(event.timestamp).toLocaleString('en-LK')}
                  </span>
                )}
                {event.note && <span className="block mt-0.5 italic">&ldquo;{event.note}&rdquo;</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
