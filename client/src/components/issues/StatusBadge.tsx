import React from 'react';
import { IssueStatus } from '../../types/issue';
import { getStatusBadgeColor } from '../../utils/priority';

interface StatusBadgeProps {
  status: IssueStatus | string;
  size?: 'sm' | 'md';
}

const STATUS_LABELS: Record<string, string> = {
  REPORTED: 'Reported',
  UNDER_REVIEW: 'Under Review',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  DUPLICATE: 'Duplicate',
  REJECTED: 'Rejected',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const colors = getStatusBadgeColor(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]} transition-all duration-200`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
};
