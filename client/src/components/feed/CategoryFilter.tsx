import React from 'react';
import { CategoryType } from '../../types/issue';
import {
  Layers,
  Compass,
  Waves,
  Droplet,
  Trash2,
  Lightbulb,
  AlertTriangle,
  Trees,
  HelpCircle,
} from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: CategoryType | 'ALL';
  onSelectCategory: (category: CategoryType | 'ALL') => void;
  categoryCounts?: Record<string, number>;
}

const CATEGORY_ITEMS: { code: CategoryType | 'ALL'; label: string; icon: React.FC<{ className?: string }> }[] = [
  { code: 'ALL', label: 'All Issues', icon: Layers },
  { code: 'ROAD', label: 'Roads & Potholes', icon: Compass },
  { code: 'DRAINAGE', label: 'Drainage & Floods', icon: Waves },
  { code: 'WATER', label: 'Water Supply', icon: Droplet },
  { code: 'WASTE', label: 'Waste Management', icon: Trash2 },
  { code: 'STREETLIGHT', label: 'Street Lighting', icon: Lightbulb },
  { code: 'TRAFFIC', label: 'Traffic & Safety', icon: AlertTriangle },
  { code: 'ENVIRONMENT', label: 'Environment', icon: Trees },
  { code: 'OTHER', label: 'Other', icon: HelpCircle },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      {CATEGORY_ITEMS.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedCategory === item.code;
        const count = item.code === 'ALL'
          ? Object.values(categoryCounts).reduce((acc, curr) => acc + curr, 0)
          : categoryCounts[item.code] || 0;

        return (
          <button
            key={item.code}
            type="button"
            onClick={() => onSelectCategory(item.code)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 select-none ${
              isSelected
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_4px_16px_rgba(239,68,68,0.4)] scale-105'
                : 'bg-white dark:bg-surface text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-red-500/30 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-red-500 dark:text-red-400'}`} />
            <span>{item.label}</span>
            {count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                  isSelected
                    ? 'bg-white/25 text-white'
                    : 'bg-slate-100 dark:bg-surface-elevated text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
