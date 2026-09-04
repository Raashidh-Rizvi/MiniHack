import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Compass,
  Waves,
  Droplet,
  Trash2,
  Lightbulb,
  AlertTriangle,
  Trees,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { calculatePriorityScore, getPriorityBadgeColor } from '../../utils/priority';
import { feedService } from '../../services/feedService';
import { Issue, Severity } from '../../types/issue';

// Category icon helper
const getCategoryIcon = (category: string) => {
  switch (category?.toUpperCase()) {
    case 'ROAD':
      return <Compass className="w-3.5 h-3.5" />;
    case 'DRAINAGE':
      return <Waves className="w-3.5 h-3.5" />;
    case 'WATER':
      return <Droplet className="w-3.5 h-3.5" />;
    case 'WASTE':
      return <Trash2 className="w-3.5 h-3.5" />;
    case 'STREETLIGHT':
      return <Lightbulb className="w-3.5 h-3.5" />;
    case 'TRAFFIC':
      return <AlertTriangle className="w-3.5 h-3.5" />;
    case 'ENVIRONMENT':
      return <Trees className="w-3.5 h-3.5" />;
    default:
      return <HelpCircle className="w-3.5 h-3.5" />;
  }
};

// Smooth animated number hook
function useCountUp(target: number, decimals: number = 0, duration: number = 1000): string {
  const [current, setCurrent] = useState<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const startValRef = useRef<number>(0);

  useEffect(() => {
    startValRef.current = current;
    startTimeRef.current = null;

    let frameId: number;
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = startValRef.current + (target - startValRef.current) * ease;
      setCurrent(val);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCurrent(target);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return current.toFixed(decimals);
}

export const ExecutiveDashboardPreview: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIssueIdx, setActiveIssueIdx] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [simulatedIssueTitle, setSimulatedIssueTitle] = useState<string | null>(null);

  // Interactive Hero Calculator State
  const [calcSeverity, setCalcSeverity] = useState<Severity>('HIGH');
  const [calcPeople, setCalcPeople] = useState<number>(120);

  // Fetch real data on mount
  useEffect(() => {
    let isMounted = true;
    const loadRealData = async () => {
      try {
        const data = await feedService.getIssues();
        if (isMounted && data && data.length > 0) {
          setIssues(data);
        }
      } catch (err) {
        console.warn('Could not fetch issues for hero dashboard preview, using fallback', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRealData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute live real metrics from issues
  const metrics = useMemo(() => {
    const total = issues.length > 0 ? issues.length : 8;
    const avgScore =
      issues.length > 0
        ? Number((issues.reduce((sum, i) => sum + (i.priorityScore || 50), 0) / total).toFixed(1))
        : 78.4;
    const resolvedCount = issues.filter((i) => i.status === 'RESOLVED').length;
    const resolvedRate = issues.length > 0 ? Math.round((resolvedCount / total) * 100) : 92;

    const avgSeverityLabel =
      avgScore >= 80 ? 'Critical Severity' : avgScore >= 65 ? 'High Severity' : 'Moderate Severity';

    return {
      total,
      avgScore,
      avgSeverityLabel,
      resolvedRate,
      resolvedCount,
    };
  }, [issues]);

  // Ranked issues sorted by priority score descending
  const rankedIssues = useMemo(() => {
    if (issues.length === 0) {
      return [
        {
          id: 101,
          title: 'Blocked Culvert Causing Flash Flooding',
          category: 'DRAINAGE',
          location: 'Trincomalee Street, Matale',
          severity: 'HIGH' as Severity,
          peopleAffected: 120,
          priorityScore: 83,
          status: 'REPORTED',
        },
      ];
    }
    return [...issues].sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));
  }, [issues]);

  // Auto-rotate ranked issues carousel if not hovered
  useEffect(() => {
    if (isHovered || rankedIssues.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIssueIdx((prev) => (prev + 1) % Math.min(rankedIssues.length, 5));
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovered, rankedIssues.length]);

  const currentRankedIssue = rankedIssues[activeIssueIdx] || rankedIssues[0];

  // Calculated Preview Score for Interactive Simulation
  const previewScore = calculatePriorityScore(calcSeverity, calcPeople, 12);
  const previewBadge = getPriorityBadgeColor(previewScore.level);

  // Animated counters
  const animatedTotal = useCountUp(metrics.total, 0, 800);
  const animatedAvgScore = useCountUp(metrics.avgScore, 1, 900);
  const animatedResolvedRate = useCountUp(metrics.resolvedRate, 0, 800);
  const animatedPreviewScore = useCountUp(previewScore.score, 0, 400);

  // Load a real ranked issue into the simulator
  const handleSimulateIssue = (issue: any) => {
    setCalcSeverity(issue.severity || 'HIGH');
    setCalcPeople(issue.peopleAffected || 100);
    setSimulatedIssueTitle(issue.title);
  };

  // Reset simulator to manual
  const handleResetSimulator = () => {
    setSimulatedIssueTitle(null);
    setCalcSeverity('HIGH');
    setCalcPeople(120);
  };

  return (
    <div
      className="relative rounded-3xl bg-slate-900/95 dark:bg-[#121722]/95 border border-slate-700/60 dark:border-white/10 shadow-[0_24px_50px_-12px_rgba(239,68,68,0.25)] p-5 sm:p-7 backdrop-blur-xl text-white transition-all duration-300 hover:shadow-[0_24px_60px_-8px_rgba(239,68,68,0.35)] animate-subtle-float"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient background glow inside card */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Dashboard Mockup Top Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-xs font-mono text-slate-300 ml-2 font-medium tracking-wide">
            GramaFix Executive Dashboard
          </span>
        </div>

        {/* Live Queue with Pulsing Radar Badge */}
        <div className="flex items-center space-x-1.5 text-[11px] px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="font-semibold tracking-wide uppercase text-[10px]">
            Live Queue • {loading ? 'SYNCING' : `${rankedIssues.length} ACTIVE`}
          </span>
        </div>
      </div>

      {/* 3 Real-time Metric Cards with Equalizer Visualizer */}
      <div className="grid grid-cols-3 gap-3 mb-5 relative z-10">
        {/* Metric 1: Total Reports */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-red-500/40 hover:bg-white/[0.07] transition-all duration-300 group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Reports</div>
            {/* Animated Equalizer Wave Bars */}
            <div className="flex items-end space-x-0.5 h-3 w-4 opacity-60 group-hover:opacity-100 transition-opacity">
              <div className="w-1 bg-red-400 rounded-sm animate-bar-1" />
              <div className="w-1 bg-red-400 rounded-sm animate-bar-2" />
              <div className="w-1 bg-red-400 rounded-sm animate-bar-3" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-1 tabular-nums tracking-tight">
            {animatedTotal}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center mt-1 font-medium">
            <TrendingUp className="w-3 h-3 mr-1" /> +18% this week
          </div>
        </div>

        {/* Metric 2: Avg Priority Score */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-red-500/40 hover:bg-white/[0.07] transition-all duration-300 group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Avg Priority</div>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-red-400 mt-1 tabular-nums tracking-tight">
            {animatedAvgScore}
          </div>
          <div className="text-[10px] text-red-400/90 mt-1 font-medium truncate">
            {metrics.avgSeverityLabel}
          </div>
        </div>

        {/* Metric 3: Resolved Rate */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-red-500/40 hover:bg-white/[0.07] transition-all duration-300 group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Resolved Rate</div>
            <Zap className="w-3 h-3 text-sky-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-black text-white mt-1 tabular-nums tracking-tight">
            {animatedResolvedRate}%
          </div>
          <div className="text-[10px] text-sky-400 mt-1 font-medium truncate">
            {metrics.resolvedCount > 0 ? `${metrics.resolvedCount} Resolved` : 'Under 48 hours'}
          </div>
        </div>
      </div>

      {/* Interactive Priority Simulation Inside Preview */}
      <div className="p-4 rounded-2xl bg-black/40 border border-red-500/20 space-y-3 relative z-10 shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">Live Impact Simulation</span>
            {simulatedIssueTitle && (
              <button
                onClick={handleResetSimulator}
                title="Reset simulation"
                className="text-[10px] text-slate-400 hover:text-white flex items-center space-x-0.5 ml-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10"
              >
                <RotateCcw className="w-2.5 h-2.5 mr-0.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-md border transition-all duration-300 transform ${previewBadge.bg} ${previewBadge.text} ${previewBadge.border} ${previewBadge.glow}`}
          >
            Score: {animatedPreviewScore}/100 ({previewScore.level})
          </span>
        </div>

        {simulatedIssueTitle && (
          <div className="text-[11px] text-red-300/90 font-medium bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 truncate">
            Simulating: <span className="text-white font-semibold">{simulatedIssueTitle}</span>
          </div>
        )}

        <div className="space-y-2.5 text-xs">
          {/* Severity Selector */}
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Severity: <strong className="text-slate-200">{calcSeverity}</strong></span>
            <div className="flex space-x-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((sev) => {
                const isActive = calcSeverity === sev;
                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => {
                      setCalcSeverity(sev);
                      setSimulatedIssueTitle(null);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)] scale-105'
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {sev[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Population Slider */}
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Affected Population:</span>
            <span className="text-white font-bold tabular-nums">{calcPeople} people</span>
          </div>

          <div className="relative">
            <input
              type="range"
              min={10}
              max={400}
              step={10}
              value={calcPeople}
              onChange={(e) => {
                setCalcPeople(Number(e.target.value));
                setSimulatedIssueTitle(null);
              }}
              className="w-full accent-red-500 h-1.5 bg-white/20 rounded-lg cursor-pointer transition-all"
            />
          </div>

          {/* Dynamic Animated Impact Score Fill Gauge */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>Dynamic Priority Output</span>
              <span className="font-mono text-white/80">{previewScore.score}% Capacity</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out rounded-full ${
                  previewScore.score >= 85
                    ? 'bg-gradient-to-r from-red-500 to-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                    : previewScore.score >= 65
                    ? 'bg-gradient-to-r from-orange-500 to-red-400'
                    : previewScore.score >= 35
                    ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                    : 'bg-gradient-to-r from-emerald-400 to-teal-400'
                }`}
                style={{ width: `${Math.min(previewScore.score, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real Ranked Issues Interactive Live Ticker */}
      <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-col space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
            <div className="flex items-center space-x-1.5 min-w-0">
              <span className="text-red-400 shrink-0">
                {getCategoryIcon(currentRankedIssue.category)}
              </span>
              <span
                className="text-slate-200 font-medium truncate max-w-[220px] sm:max-w-[260px]"
                title={currentRankedIssue.title}
              >
                {currentRankedIssue.title}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 ml-2">
            <span className="text-red-400 font-bold tracking-tight text-xs bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              Priority #{activeIssueIdx + 1}
            </span>
            <Link
              to={`/issues/${currentRankedIssue.id}`}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
              title="View Issue Details"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Carousel Micro-Controls & "Simulate This" Trigger */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
          <div className="flex items-center space-x-1">
            {rankedIssues.slice(0, 5).map((issue, idx) => (
              <button
                key={issue.id}
                onClick={() => setActiveIssueIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIssueIdx
                    ? 'w-5 bg-red-500'
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`View ranked issue ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSimulateIssue(currentRankedIssue)}
              className="text-[10px] text-red-400 hover:text-red-300 flex items-center space-x-1 underline underline-offset-2 hover:no-underline transition-all"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Simulate this in engine</span>
            </button>

            <div className="flex items-center space-x-1">
              <button
                onClick={() =>
                  setActiveIssueIdx(
                    (prev) => (prev - 1 + Math.min(rankedIssues.length, 5)) % Math.min(rankedIssues.length, 5)
                  )
                }
                className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                aria-label="Previous issue"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  setActiveIssueIdx((prev) => (prev + 1) % Math.min(rankedIssues.length, 5))
                }
                className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                aria-label="Next issue"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
