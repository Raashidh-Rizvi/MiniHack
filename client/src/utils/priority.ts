import { Severity, PriorityLevel } from '../types/issue';

/**
 * Calculates deterministic Community Priority Score
 * Formula: (Severity * 0.40) + (Impact * 0.30) + (Urgency * 0.20) + (Age * 0.10)
 */
export function calculatePriorityScore(
  severity: Severity,
  peopleAffected: number,
  hoursOld: number = 0
): { score: number; level: PriorityLevel } {
  // 1. Severity weight (40%)
  const severityWeights: Record<Severity, number> = {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75,
    CRITICAL: 100,
  };
  const severityScore = severityWeights[severity] || 50;

  // 2. People Affected / Impact weight (30%)
  let impactScore = 20;
  if (peopleAffected > 300) impactScore = 100;
  else if (peopleAffected >= 151) impactScore = 85;
  else if (peopleAffected >= 51) impactScore = 70;
  else if (peopleAffected >= 11) impactScore = 45;

  // 3. Urgency weight (20%) - aligned with severity
  const urgencyWeights: Record<Severity, number> = {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75,
    CRITICAL: 100,
  };
  const urgencyScore = urgencyWeights[severity] || 50;

  // 4. Age weight (10%) - increases with report age (max 100 at 72+ hours)
  const ageScore = hoursOld > 72 ? 90 : hoursOld > 48 ? 70 : hoursOld > 24 ? 50 : hoursOld > 6 ? 30 : 15;

  // Combined score (0 - 100)
  const total = Math.round(
    severityScore * 0.4 + impactScore * 0.3 + urgencyScore * 0.2 + ageScore * 0.1
  );
  const score = Math.max(0, Math.min(100, total));

  // Priority Level mapping
  let level: PriorityLevel = 'LOW';
  if (score >= 85) level = 'CRITICAL';
  else if (score >= 65) level = 'HIGH';
  else if (score >= 35) level = 'MEDIUM';

  return { score, level };
}

export function getPriorityBadgeColor(level: PriorityLevel): {
  bg: string;
  text: string;
  border: string;
  glow: string;
} {
  switch (level) {
    case 'CRITICAL':
      return {
        bg: 'bg-red-500/15 dark:bg-red-500/20',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-500/30',
        glow: 'shadow-[0_0_12px_rgba(239,68,68,0.35)]',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-500/15 dark:bg-orange-500/20',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-500/30',
        glow: 'shadow-[0_0_12px_rgba(249,115,22,0.30)]',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-500/15 dark:bg-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/30',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      };
  }
}

export function getStatusBadgeColor(status: string): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'REPORTED':
      return {
        bg: 'bg-slate-500/15 dark:bg-slate-500/20',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-500/30',
      };
    case 'UNDER_REVIEW':
      return {
        bg: 'bg-sky-500/15 dark:bg-sky-500/20',
        text: 'text-sky-600 dark:text-sky-400',
        border: 'border-sky-500/30',
      };
    case 'IN_PROGRESS':
      return {
        bg: 'bg-indigo-500/15 dark:bg-indigo-500/20',
        text: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-500/30',
      };
    case 'RESOLVED':
      return {
        bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500/30',
      };
    default:
      return {
        bg: 'bg-slate-500/15',
        text: 'text-slate-400',
        border: 'border-slate-500/20',
      };
  }
}
