import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Issue, IssueStatus } from '../types/issue';
import { citizenService } from '../services/citizenService';
import { feedService } from '../services/feedService';
import { useAuth } from '../hooks/useAuth';
import { EditIssueModal } from '../components/citizen/EditIssueModal';
import { IssueDetailsModal } from '../components/feed/IssueDetailsModal';
import { getStatusBadgeColor, getPriorityBadgeColor } from '../utils/priority';
import { formatDate, formatRelativeTime } from '../utils/formatters';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  TrendingUp,
  Edit3,
  Trash2,
  ExternalLink,
  MapPin,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Search,
  RefreshCw,
  Heart,
  Phone,
  ShieldCheck,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Status-progress steps shown inside each report row                          */
/* ─────────────────────────────────────────────────────────────────────────── */
const STATUS_STEPS: IssueStatus[] = ['REPORTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'];

const StatusProgress: React.FC<{ status: IssueStatus }> = ({ status }) => {
  const idx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-2">
      {STATUS_STEPS.map((step, i) => {
        const done = i <= idx;
        const current = i === idx;
        return (
          <React.Fragment key={step}>
            <div
              className={`h-1.5 flex-1 rounded-full transition-all ${
                done
                  ? current
                    ? 'bg-red-500'
                    : 'bg-emerald-500'
                  : 'bg-slate-200 dark:bg-white/10'
              }`}
            />
          </React.Fragment>
        );
      })}
      <span className="text-[10px] font-bold ml-1 whitespace-nowrap text-slate-500 dark:text-slate-400">
        {status.replace('_', ' ')}
      </span>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main Citizen Dashboard                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
export const CitizenDashboardPage: React.FC = () => {
  const { currentUser, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  // My reports state
  const [myReports, setMyReports] = useState<Issue[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  // Community feed preview state
  const [communityIssues, setCommunityIssues] = useState<Issue[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [communitySearch, setCommunitySearch] = useState('');

  // Modal state
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [deletingIssueId, setDeletingIssueId] = useState<number | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [selectedCommunityIssue, setSelectedCommunityIssue] = useState<Issue | null>(null);

  // Filter tab for My Reports section
  const [reportsFilter, setReportsFilter] = useState<IssueStatus | 'ALL'>('ALL');

  /* ── redirect non-citizens ─────────────────────────────────────── */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    if (role === 'ADMIN') {
      navigate('/admin', { replace: true });
      return;
    }
    if (role === 'OFFICER') {
      navigate('/officer', { replace: true });
      return;
    }
  }, [isAuthenticated, role, navigate]);

  /* ── fetch my reports ──────────────────────────────────────────── */
  const fetchMyReports = useCallback(async () => {
    setLoadingReports(true);
    setReportsError(null);
    try {
      const data = await citizenService.getMyReports(currentUser?.id || 1);
      setMyReports(data);
    } catch (err: any) {
      setReportsError(err.message || 'Failed to load your reports.');
    } finally {
      setLoadingReports(false);
    }
  }, [currentUser?.id]);

  /* ── fetch community feed preview ─────────────────────────────── */
  const fetchCommunityFeed = useCallback(async (search = '') => {
    setLoadingFeed(true);
    try {
      const data = await feedService.getIssues({ search, sortBy: 'priority' });
      setCommunityIssues(data.slice(0, 6)); // preview top 6
    } catch {
      setCommunityIssues([]);
    } finally {
      setLoadingFeed(false);
    }
  }, []);

  useEffect(() => {
    fetchMyReports();
  }, [fetchMyReports]);

  useEffect(() => {
    const t = setTimeout(() => fetchCommunityFeed(communitySearch), 300);
    return () => clearTimeout(t);
  }, [communitySearch, fetchCommunityFeed]);

  /* ── derived stats (scoped to this citizen) ────────────────────── */
  const stats = {
    total: myReports.length,
    open: myReports.filter((r) => r.status === 'REPORTED').length,
    inProgress: myReports.filter(
      (r) => r.status === 'UNDER_REVIEW' || r.status === 'IN_PROGRESS'
    ).length,
    resolved: myReports.filter((r) => r.status === 'RESOLVED').length,
  };

  /* ── filtered reports list ─────────────────────────────────────── */
  const filteredReports =
    reportsFilter === 'ALL'
      ? myReports
      : myReports.filter((r) => r.status === reportsFilter);

  /* ── recent 3 reports for quick-view section ───────────────────── */
  const recentReports = [...myReports]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  /* ── cancel handler ────────────────────────────────────────────── */
  const handleCancelConfirm = async () => {
    if (!deletingIssueId) return;
    setCancelLoading(true);
    try {
      await citizenService.cancelIssue(deletingIssueId);
      setMyReports((prev) => prev.filter((r) => r.id !== deletingIssueId));
      setCancelModalOpen(false);
      setDeletingIssueId(null);
    } catch (err: any) {
      console.error('Cancel failed:', err);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleIssueUpdated = (updated: Issue) => {
    setMyReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleSupportToggled = (issueId: number, newCount: number) => {
    setCommunityIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, supportCount: newCount } : i))
    );
    if (selectedCommunityIssue?.id === issueId) {
      setSelectedCommunityIssue((prev) => (prev ? { ...prev, supportCount: newCount } : null));
    }
  };

  /* ── eligibility: citizen can edit/cancel only REPORTED or UNDER_REVIEW issues ── */
  const canModify = (status: IssueStatus) =>
    status === 'REPORTED' || status === 'UNDER_REVIEW';

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ════════════════════ HEADER ════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Citizen Dashboard — Member 1</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
              {currentUser?.fullName?.split(' ')[0]}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{currentUser?.communityArea}</span>
            <span>·</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {currentUser?.email}
            </span>
            {currentUser?.phone && (
              <>
                <span>·</span>
                <span className="inline-flex items-center space-x-1 text-slate-700 dark:text-slate-300 font-medium">
                  <Phone className="w-3 h-3 text-red-500" />
                  <span>{currentUser.phone}</span>
                </span>
                <span className="inline-flex items-center space-x-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </>
            )}
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-[0_4px_20px_rgba(239,68,68,0.45)] hover:shadow-[0_4px_28px_rgba(239,68,68,0.65)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 w-fit"
          id="citizen-report-issue-btn"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report an Issue</span>
        </Link>
      </div>

      {/* ════════════════════ PERSONAL STATS ════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: 'Total Submitted',
            value: stats.total,
            icon: FileText,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
          },
          {
            label: 'Newly Reported',
            value: stats.open,
            icon: AlertCircle,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
          },
          {
            label: 'Under Review / In Progress',
            value: stats.inProgress,
            icon: Clock,
            color: 'text-sky-500',
            bg: 'bg-sky-500/10',
          },
          {
            label: 'Resolved',
            value: stats.resolved,
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 shadow-sm flex items-center space-x-4 hover:border-red-500/20 transition-colors"
          >
            <div
              className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center flex-shrink-0`}
            >
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                {loadingReports ? (
                  <span className="inline-block w-8 h-6 rounded bg-slate-200 dark:bg-white/10 animate-pulse" />
                ) : (
                  card.value
                )}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ════════════════════ QUICK ACTIONS ════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link
          to="/report"
          className="group p-5 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-[0_4px_20px_rgba(239,68,68,0.35)] hover:shadow-[0_4px_28px_rgba(239,68,68,0.5)] transition-all flex items-center space-x-4"
          id="citizen-quick-report-btn"
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-base">Report an Issue</div>
            <div className="text-xs text-red-100">Submit a neighborhood problem</div>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto opacity-70 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/issues"
          className="group p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/30 transition-all flex items-center space-x-4"
          id="citizen-community-feed-btn"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-base text-slate-900 dark:text-white">Community Feed</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Browse & support local issues</div>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/my-reports"
          className="group p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/30 transition-all flex items-center space-x-4"
          id="citizen-my-reports-btn"
        >
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-base text-slate-900 dark:text-white">My Full Reports</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Manage all submissions</div>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* ════════════════════ LEFT: MY REPORTS ════════════════════ */}
        <div className="xl:col-span-2 space-y-6">
          {/* Recent Reports Quick-view */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-red-500" />
                <span>My Recent Reports</span>
              </h2>
              <button
                onClick={fetchMyReports}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated transition-colors"
                title="Refresh reports"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {loadingReports ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-24 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 animate-pulse"
                  />
                ))}
              </div>
            ) : reportsError ? (
              <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm text-red-600 dark:text-red-400 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{reportsError}</span>
              </div>
            ) : recentReports.length === 0 ? (
              <div className="p-10 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">No reports yet</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  You haven't submitted any community reports yet.
                </p>
                <Link
                  to="/report"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-red-500 hover:bg-red-600"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Submit First Report</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => {
                  const statusStyle = getStatusBadgeColor(report.status);
                  const priorityStyle = getPriorityBadgeColor(report.priorityLevel);
                  const eligible = canModify(report.status);
                  return (
                    <div
                      key={report.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/20 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                              {report.category}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                            >
                              {report.status.replace('_', ' ')}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
                            >
                              {report.priorityLevel}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {report.title}
                          </h3>

                          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-red-400" />
                              {report.location}
                            </span>
                            <span>{formatRelativeTime(report.createdAt)}</span>
                            <span className="flex items-center gap-0.5">
                              <Users className="w-3 h-3" />
                              {report.supportCount} upvotes
                            </span>
                          </div>

                          {/* Progress tracker */}
                          <StatusProgress status={report.status} />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link
                            to={`/issues/${report.id}`}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated transition-colors"
                            title="View details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {eligible && (
                            <>
                              <button
                                disabled={['RESOLVED', 'DUPLICATE', 'REJECTED'].includes(report.status)}
                                onClick={() => setEditingIssue(report)}
                                className="p-2 rounded-xl liquid-btn-glass text-sky-500 hover:text-sky-400"
                                title="Edit report"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (['RESOLVED', 'DUPLICATE', 'REJECTED'].includes(report.status)) return;
                                  setDeletingIssueId(report.id);
                                  setCancelModalOpen(true);
                                }}
                                className="p-2 rounded-xl liquid-btn-danger"
                                title="Cancel report"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {myReports.length > 3 && (
                  <Link
                    to="/my-reports"
                    className="block text-center py-3 rounded-2xl text-xs font-bold text-red-500 border border-red-500/20 hover:bg-red-500/5 transition-colors"
                  >
                    View all {myReports.length} reports →
                  </Link>
                )}
              </div>
            )}
          </section>

          {/* All reports with filter tabs */}
          {!loadingReports && myReports.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-sky-500" />
                  <span>Report Management</span>
                </h2>
              </div>

              {/* Status filter pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-4">
                {(['ALL', 'REPORTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'DUPLICATE', 'REJECTED'] as const).map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => setReportsFilter(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        reportsFilter === s
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow'
                          : 'bg-white dark:bg-surface text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300'
                      }`}
                    >
                      {s === 'ALL' ? 'All' : s.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>

              {filteredReports.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10">
                  <p className="text-xs text-slate-400">No reports with status: {reportsFilter}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredReports.map((report) => {
                    const statusStyle = getStatusBadgeColor(report.status);
                    const eligible = canModify(report.status);
                    return (
                      <div
                        key={report.id}
                        className="p-4 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/20 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                            >
                              {report.status.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              #{report.id}
                            </span>
                            {!eligible && (
                              <span className="text-[10px] text-slate-400 italic">
                                (read-only)
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {report.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {formatDate(report.createdAt)} · {report.location}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link
                            to={`/issues/${report.id}`}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-surface-elevated hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>

                          {eligible && (
                            <>
                              <button
                                disabled={['RESOLVED', 'DUPLICATE', 'REJECTED'].includes(report.status)}
                                onClick={() => setEditingIssue(report)}
                                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold liquid-btn-glass text-sky-600 dark:text-sky-400"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (['RESOLVED', 'DUPLICATE', 'REJECTED'].includes(report.status)) return;
                                  setDeletingIssueId(report.id);
                                  setCancelModalOpen(true);
                                }}
                                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold liquid-btn-danger"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>

        {/* ════════════════════ RIGHT: COMMUNITY FEED PREVIEW ════════════════════ */}
        <div className="xl:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Community Issues</span>
            </h2>
            <Link
              to="/issues"
              className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
            >
              See all →
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search community issues…"
              value={communitySearch}
              onChange={(e) => setCommunitySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
            />
          </div>

          {/* Feed list */}
          {loadingFeed ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-20 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : communityIssues.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10">
              <p className="text-xs text-slate-400">No matching issues found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {communityIssues.map((issue) => {
                const priorityStyle = getPriorityBadgeColor(issue.priorityLevel);
                const statusStyle = getStatusBadgeColor(issue.status);
                return (
                  <button
                    key={issue.id}
                    onClick={() => setSelectedCommunityIssue(issue)}
                    className="w-full text-left p-4 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 hover:border-red-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-1 mb-1">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
                          >
                            {issue.priorityLevel}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                          >
                            {issue.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                          {issue.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-red-400" />
                          {issue.location}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 tabular-nums">
                          {issue.priorityScore}
                        </span>
                        <span className="text-[10px] text-slate-400">{issue.supportCount} ♥</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <Link
            to="/issues"
            className="flex items-center justify-center space-x-2 w-full py-3 rounded-2xl text-sm font-bold text-red-500 border border-red-500/20 hover:bg-red-500/5 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Browse Full Community Feed</span>
          </Link>
        </div>
      </div>

      {/* ════════════════════ EDIT MODAL ════════════════════ */}
      <EditIssueModal
        issue={editingIssue}
        isOpen={Boolean(editingIssue)}
        onClose={() => setEditingIssue(null)}
        onUpdated={handleIssueUpdated}
      />

      {/* ════════════════════ CANCEL CONFIRMATION ════════════════════ */}
      {cancelModalOpen && (
        <div
          className="liquid-modal-backdrop p-4"
          onClick={() => !cancelLoading && setCancelModalOpen(false)}
        >
          <div
            className="liquid-modal w-full max-w-sm p-6 text-center border border-white/20 dark:border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-heading mb-1">
              Cancel this Report?
            </h3>
            <p className="text-xs text-muted mb-6">
              This will permanently withdraw report #{deletingIssueId} from the Community Priority
              Queue. This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                disabled={cancelLoading}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold liquid-btn-glass disabled:opacity-50"
              >
                Keep Report
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={cancelLoading}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold liquid-btn-danger disabled:opacity-60"
              >
                {cancelLoading ? 'Cancelling…' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════ COMMUNITY ISSUE DETAILS MODAL ════════════════════ */}
      <IssueDetailsModal
        issue={selectedCommunityIssue}
        isOpen={Boolean(selectedCommunityIssue)}
        onClose={() => setSelectedCommunityIssue(null)}
        onSupportToggled={handleSupportToggled}
      />
    </div>
  );
};
