import React from 'react';

interface StatusFilterProps {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'REPORTED', label: 'Reported' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
];

export const StatusFilter: React.FC<StatusFilterProps> = ({ selectedStatus, onSelectStatus }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_OPTIONS.map((option) => {
        const isActive = selectedStatus === option.value;
        return (
          <button
            key={option.value}
            id={`status-filter-${option.value.toLowerCase().replace('_', '-')}`}
            onClick={() => onSelectStatus(option.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 cursor-pointer
              ${isActive
                ? 'bg-indigo-500 border-indigo-500 text-white shadow-sm shadow-indigo-500/30 scale-105'
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
