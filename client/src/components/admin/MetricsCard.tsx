import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  id: string;
  title: string;
  value: number | string;
  icon: LucideIcon;
  colorTheme: 'purplishRed' | 'indigo' | 'red' | 'amber' | 'emerald' | 'sky';
  subtitle?: string;
  trend?: string;
}

const THEME_CLASSES = {
  purplishRed: {
    icon: 'text-purple-600 dark:text-rose-400',
    bg: 'bg-purple-500/10 dark:bg-purple-900/20',
    border: 'border-purple-500/20 dark:border-purple-900/30',
    value: 'text-purple-700 dark:text-rose-300',
  },
  indigo: {
    icon: 'text-indigo-500',
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    border: 'border-indigo-500/20',
    value: 'text-indigo-600 dark:text-indigo-400',
  },
  red: {
    icon: 'text-red-500',
    bg: 'bg-red-500/10 dark:bg-red-500/15',
    border: 'border-red-500/20',
    value: 'text-red-600 dark:text-red-400',
  },
  amber: {
    icon: 'text-amber-500',
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    border: 'border-amber-500/20',
    value: 'text-amber-600 dark:text-amber-400',
  },
  emerald: {
    icon: 'text-emerald-500',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    border: 'border-emerald-500/20',
    value: 'text-emerald-600 dark:text-emerald-400',
  },
  sky: {
    icon: 'text-sky-500',
    bg: 'bg-sky-500/10 dark:bg-sky-500/15',
    border: 'border-sky-500/20',
    value: 'text-sky-600 dark:text-sky-400',
  },
};

export const MetricsCard: React.FC<MetricsCardProps> = ({
  id,
  title,
  value,
  icon: Icon,
  colorTheme,
  subtitle,
  trend,
}) => {
  const theme = THEME_CLASSES[colorTheme];

  return (
    <div
      id={id}
      className={`relative overflow-hidden rounded-xl border ${theme.border} bg-white dark:bg-slate-800/60 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-all duration-300 group`}
    >
      {/* Background icon (decorative) */}
      <div className={`absolute -right-3 -top-3 opacity-5 group-hover:opacity-10 transition-opacity duration-300`}>
        <Icon className="w-20 h-20" />
      </div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className={`mt-2 text-3xl font-bold tabular-nums ${theme.value}`}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
          {trend && (
            <p className="mt-1 text-xs text-slate-400">{trend}</p>
          )}
        </div>
        <div className={`flex-shrink-0 p-2.5 rounded-lg ${theme.bg}`}>
          <Icon className={`w-5 h-5 ${theme.icon}`} />
        </div>
      </div>
    </div>
  );
};
