import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Issue, IssueStatus } from '../types/issue';
import { feedService } from '../services/feedService';
import { SupportButton } from '../components/feed/SupportButton';
import { formatDate } from '../utils/formatters';
import { getPriorityBadgeColor, getStatusBadgeColor } from '../utils/priority';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle2,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { IssueLocationMiniMap } from '../components/map/IssueLocationMiniMap';
import { EmergencyBanner } from '../components/common/EmergencyBanner';
import { EmergencyModal } from '../components/common/EmergencyModal';

const LIFECYCLE_STEPS: { status: IssueStatus; label: string; desc: string }[] = [
  { status: 'REPORTED', label: 'Reported', desc: 'Submitted by neighborhood resident' },
  { status: 'UNDER_REVIEW', label: 'Under Review', desc: 'Municipal authority assessing impact' },
  { status: 'IN_PROGRESS', label: 'In Progress', desc: 'Field maintenance crew deployed' },
  { status: 'RESOLVED', label: 'Resolved', desc: 'Verified and completed' },
];

export const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await feedService.getIssueById(Number(id));
        setIssue(data);
      } catch (err) {
        console.error('Failed to load issue:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-4xl mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin" />
          <p className="text-sm text-slate-400">Loading civic report details...</p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Report Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The requested community issue report #{id} could not be located.
        </p>
        <button
          onClick={() => navigate('/issues')}
          className="px-5 py-2.5 rounded-full text-sm font-bold text-white liquid-btn-crimson shadow-md transition-all"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const priorityStyle = getPriorityBadgeColor(issue.priorityLevel);
  const statusStyle = getStatusBadgeColor(issue.status);

  const statusOrder: Record<IssueStatus, number> = {
    REPORTED: 0,
    UNDER_REVIEW: 1,
    IN_PROGRESS: 2,
    RESOLVED: 3,
    DUPLICATE: -1,
    REJECTED: -1,
  };
  const currentStep = statusOrder[issue.status] ?? 0;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert('Direct link to report copied to clipboard!');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/issues"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Community Feed</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold liquid-btn-glass text-slate-700 dark:text-slate-200 transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Main Issue Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 shadow-xl relative overflow-hidden mb-8">
        {/* Ambient Top Flare */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Badges */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            {issue.category}
          </span>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-lg border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
          >
            {issue.status.replace('_', ' ')}
          </span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-lg border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border} ${priorityStyle.glow}`}
          >
            {issue.priorityLevel} Priority ({issue.priorityScore} pts)
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          {issue.title}
        </h1>

        {/* Metadata info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-surface-elevated border border-slate-200 dark:border-white/5 mb-8 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Location</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">{issue.location}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-sky-500 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Reported On</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(issue.createdAt)}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Estimated Affected</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">{issue.peopleAffected} Residents</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h3>
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {issue.description}
          </p>
        </div>

        {/* OpenStreetMap Leaflet Location Map */}
        <div className="mb-8">
          <IssueLocationMiniMap
            location={issue.location}
            latitude={issue.latitude}
            longitude={issue.longitude}
            title={issue.title}
          />
        </div>

        {/* Urgent Government Emergency Advisory for High / Critical Issues */}
        {(issue.severity === 'CRITICAL' || issue.severity === 'HIGH') && (
          <EmergencyBanner
            category={issue.category}
            severity={issue.severity}
            onOpenDirectory={() => setEmergencyModalOpen(true)}
            className="mb-8"
          />
        )}

        {/* Priority Engine Metric Calculation Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/20 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Deterministic Priority Impact Engine
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Formula: (Severity x 0.40) + (Impact x 0.30) + (Urgency x 0.20) + (Age x 0.10)
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-red-500 tabular-nums">
                {issue.priorityScore}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ 100</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10">
              <div className="text-[11px] text-slate-400 font-medium">Severity (40%)</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{issue.severity}</div>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10">
              <div className="text-[11px] text-slate-400 font-medium">Affected People (30%)</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{issue.peopleAffected}</div>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10">
              <div className="text-[11px] text-slate-400 font-medium">Priority Tier (20%)</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{issue.priorityLevel}</div>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10">
              <div className="text-[11px] text-slate-400 font-medium">Civic Endorsements</div>
              <div className="text-sm font-bold text-red-500 mt-0.5">{issue.supportCount} Upvotes</div>
            </div>
          </div>
        </div>

        {/* Progression Timeline */}
        <div className="mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Resolution Lifecycle
          </h4>
          <div className="relative flex justify-between items-center px-4">
            <div className="absolute top-4 left-8 right-8 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />
            <div
              className="absolute top-4 left-8 h-0.5 bg-red-500 transition-all duration-500 -z-0"
              style={{ width: `${(currentStep / (LIFECYCLE_STEPS.length - 1)) * 88}%` }}
            />

            {LIFECYCLE_STEPS.map((step, idx) => {
              const isPast = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={step.status} className="flex flex-col items-center text-center z-10 max-w-[100px]">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      isPast
                        ? 'bg-red-500 border-red-500 text-white shadow-[0_0_14px_rgba(239,68,68,0.45)]'
                        : 'bg-white dark:bg-surface border-slate-300 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-bold mt-2 ${
                      isCurrent
                        ? 'text-red-600 dark:text-red-400'
                        : isPast
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Notes */}
        {issue.adminNotes && (
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-8 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-rose-400 mb-1">
                Official Municipal Council Log
              </h5>
              <p className="text-sm text-slate-700 dark:text-slate-300">{issue.adminNotes}</p>
            </div>
          </div>
        )}

        {/* Endorse / Support CTA Action */}
        <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Does this problem affect your street?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adding your community support elevates this issue in the Municipal Priority Queue.
            </p>
          </div>

          <SupportButton
            issueId={issue.id}
            initialCount={issue.supportCount}
            initialIsSupported={issue.userSupported ?? false}
            onSupportToggled={(newCount) => setIssue((prev) => (prev ? { ...prev, supportCount: newCount } : null))}
          />
        </div>
      </div>

      {/* Official Government Emergency Directory Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        initialCategory={issue.category === 'WATER' || issue.category === 'STREETLIGHT' ? 'UTILITY' : issue.category === 'DRAINAGE' ? 'DISASTER' : 'ALL'}
      />
    </div>
  );
};
