import React from 'react';
import { PriorityLevel } from '../../types/issue';
import { getPriorityBadgeColor } from '../../utils/priority';

interface PriorityBadgeProps {
  level: PriorityLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ level, score, size = 'md' }) => {
  const colors = getPriorityBadgeColor(level);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${colors.glow} ${sizeClasses[size]} transition-all duration-200`}
    >
      <span className={`rounded-full ${dotSize[size]} ${colors.text.replace('text-', 'bg-').replace('/40', '').replace(' dark', '')}`} />
      {level}
      {score !== undefined && (
        <span className="ml-1 opacity-75 font-mono">({score})</span>
      )}
    </span>
  );
};
