import React from 'react';
import { PriorityLevel } from '../../types/issue';

interface PriorityFilterProps {
  selectedPriority: string;
  onSelectPriority: (priority: string) => void;
}

const PRIORITY_OPTIONS: { value: string; label: string; colorClass: string }[] = [
  { value: 'ALL', label: 'All Priorities', colorClass: 'text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600' },
  { value: 'CRITICAL', label: '🔴 Critical', colorClass: 'text-red-600 dark:text-red-400 border-red-400 dark:border-red-500' },
  { value: 'HIGH', label: '🟠 High', colorClass: 'text-orange-600 dark:text-orange-400 border-orange-400 dark:border-orange-500' },
  { value: 'MEDIUM', label: '🟡 Medium', colorClass: 'text-amber-600 dark:text-amber-400 border-amber-400 dark:border-amber-500' },
  { value: 'LOW', label: '🟢 Low', colorClass: 'text-emerald-600 dark:text-emerald-400 border-emerald-400 dark:border-emerald-500' },
];

export const PriorityFilter: React.FC<PriorityFilterProps> = ({ selectedPriority, onSelectPriority }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {PRIORITY_OPTIONS.map((option) => {
        const isActive = selectedPriority === option.value;
        return (
          <button
            key={option.value}
            id={`priority-filter-${option.value.toLowerCase()}`}
            onClick={() => onSelectPriority(option.value)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer
              ${isActive
                ? `${option.colorClass} bg-current/10 shadow-sm scale-105`
                : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 bg-transparent'
              }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
