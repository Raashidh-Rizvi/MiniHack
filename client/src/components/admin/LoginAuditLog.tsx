import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ShieldCheck,
  ShieldX,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Globe,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Filter,
} from 'lucide-react';
import { auditService, AuditEntry, AuditLogFilters } from '../../services/auditService';
import { errorMessage } from '../../services/api';

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function formatTs(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function parseUA(ua: string): { browser: string; os: string } {
  // Simple heuristic UA parser
  let browser = 'Unknown';
  let os = 'Unknown';

  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
  else if (/Chrome\//.test(ua)) browser = 'Chrome';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
  else if (/MSIE|Trident/.test(ua)) browser = 'IE';
  else if (ua === 'unknown') browser = '—';

  if (/Windows NT/.test(ua)) os = 'Windows';
  else if (/Mac OS X/.test(ua)) os = 'macOS';
  else if (/Linux/.test(ua)) os = 'Linux';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iPhone|iPad/.test(ua)) os = 'iOS';

  return { browser, os };
}

function RoleBadge({ role }: { role: string | null }) {
  if (!role) return <span className="text-slate-400 text-xs">—</span>;
  const colours: Record<string, string> = {
    ADMIN: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    OFFICER: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
    CITIZEN: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    RESIDENT: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colours[role] || 'bg-slate-500/20 text-slate-300'}`}>
      {role}
    </span>
  );
}

function FailReasonBadge({ reason }: { reason: string | null }) {
  if (!reason) return null;
  const label = reason === 'bad_password' ? 'Wrong password' : 'User not found';
  return (
    <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide bg-red-500/15 text-red-400 border border-red-500/20">
      {label}
    </span>
  );
}

/* ─── main component ───────────────────────────────────────────────────────── */

export const LoginAuditLog: React.FC = () => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [emailSearch, setEmailSearch] = useState('');
  const [successFilter, setSuccessFilter] = useState<'' | 'true' | 'false'>('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  // Auto-refresh
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLog = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const filters: AuditLogFilters = { limit: LIMIT, page };
      if (emailSearch.trim()) filters.email = emailSearch.trim();
      if (successFilter) filters.success = successFilter as 'true' | 'false';
      if (fromDate) filters.from = new Date(fromDate).toISOString();
      if (toDate) {
        const t = new Date(toDate);
        t.setHours(23, 59, 59, 999);
        filters.to = t.toISOString();
      }
      const res = await auditService.getLoginAuditLog(filters);
      setEntries(res.data);
      setTotal(res.total);
      setPages(res.pages);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      if (!silent) setLoading(false);
    }
  }, [emailSearch, successFilter, fromDate, toDate, page]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [emailSearch, successFilter, fromDate, toDate]);

  useEffect(() => { void fetchLog(); }, [fetchLog]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => void fetchLog(true), 30_000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoRefresh, fetchLog]);

  const successCount = entries.filter(e => e.success).length;
  const failCount = entries.filter(e => !e.success).length;

  return (
    <div className="space-y-5">
      {/* Header stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-emerald-300/70 font-medium uppercase tracking-wide">Successful</p>
            <p className="text-xl font-bold text-emerald-300">{successCount}</p>
          </div>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-red-300/70 font-medium uppercase tracking-wide">Failed</p>
            <p className="text-xl font-bold text-red-300">{failCount}</p>
          </div>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-500/10 to-slate-600/5 border border-slate-500/20 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-400/70 font-medium uppercase tracking-wide">Total (page)</p>
            <p className="text-xl font-bold text-slate-300">{entries.length}</p>
          </div>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 flex items-center gap-3">
          <Globe className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-purple-300/70 font-medium uppercase tracking-wide">Total entries</p>
            <p className="text-xl font-bold text-purple-300">{total}</p>
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Email search */}
          <label className="flex flex-col gap-1 min-w-[180px] flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-1">
              <Search className="w-3 h-3" /> Search by email
            </span>
            <div className="relative">
              <input
                id="audit-email-search"
                type="text"
                value={emailSearch}
                onChange={e => setEmailSearch(e.target.value)}
                placeholder="user@example.com"
                className="glass-input text-sm w-full pl-3 pr-3 py-1.5"
                maxLength={100}
              />
            </div>
          </label>

          {/* Status filter */}
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-1">
              <Filter className="w-3 h-3" /> Result
            </span>
            <div className="flex gap-1.5">
              {(['', 'true', 'false'] as const).map(v => (
                <button
                  key={v}
                  id={`audit-filter-${v || 'all'}`}
                  onClick={() => setSuccessFilter(v)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer border ${
                    successFilter === v
                      ? v === 'true'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : v === 'false'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-white/5 text-muted border-white/10 hover:bg-white/10'
                  }`}
                >
                  {v === '' ? 'All' : v === 'true' ? '✓ Success' : '✕ Failed'}
                </button>
              ))}
            </div>
          </label>

          {/* Date range */}
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">From</span>
            <input
              id="audit-from-date"
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="glass-input text-sm py-1.5"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">To</span>
            <input
              id="audit-to-date"
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="glass-input text-sm py-1.5"
            />
          </label>

          {/* Actions */}
          <div className="flex gap-2 items-end ml-auto">
            <button
              id="audit-auto-refresh-toggle"
              onClick={() => setAutoRefresh(p => !p)}
              title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh (30s)'}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                autoRefresh
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-white/5 text-muted border-white/10 hover:bg-white/10'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Live' : 'Refresh'}
            </button>
            <button
              id="audit-refresh-btn"
              onClick={() => void fetchLog()}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg liquid-btn-glass transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Reload
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div role="alert" className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted text-sm gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading audit log…
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted gap-3">
            <ShieldX className="w-10 h-10 text-slate-600" />
            <p className="text-sm">No login events recorded yet.</p>
            <p className="text-xs text-slate-500">Login attempts will appear here in real time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted">
                    <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Time</div>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted">
                    <div className="flex items-center gap-1.5"><User className="w-3 h-3" /> User</div>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted">Role</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted">
                    <div className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> IP Address</div>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted">
                    <div className="flex items-center gap-1.5"><Monitor className="w-3 h-3" /> Device</div>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {entries.map((entry, idx) => {
                  const ua = parseUA(entry.userAgent);
                  return (
                    <tr
                      key={entry.id}
                      className={`transition-colors hover:bg-white/5 ${
                        !entry.success ? 'bg-red-500/5' : idx % 2 === 0 ? '' : 'bg-white/[0.02]'
                      }`}
                    >
                      {/* Time */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-xs font-mono text-heading">{formatTs(entry.timestamp)}</div>
                        <div className="text-[10px] text-muted mt-0.5">{relativeTime(entry.timestamp)}</div>
                      </td>

                      {/* User */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-heading text-xs">
                          {entry.fullName ?? <span className="text-muted italic">Unknown</span>}
                        </div>
                        <div className="text-[11px] text-muted mt-0.5">{entry.email}</div>
                        {entry.userId && (
                          <div className="text-[10px] text-slate-500">ID #{entry.userId}</div>
                        )}
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        <RoleBadge role={entry.role} />
                      </td>

                      {/* IP */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-sky-300/80 bg-sky-500/10 px-2 py-0.5 rounded">
                          {entry.ip}
                        </span>
                      </td>

                      {/* Device */}
                      <td className="px-4 py-3">
                        <div className="text-xs text-heading">{ua.browser}</div>
                        <div className="text-[10px] text-muted">{ua.os}</div>
                      </td>

                      {/* Result */}
                      <td className="px-4 py-3">
                        {entry.success ? (
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-semibold">Success</span>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-1.5 text-red-400">
                              <ShieldX className="w-4 h-4" />
                              <span className="text-xs font-semibold">Failed</span>
                            </div>
                            <FailReasonBadge reason={entry.failReason} />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && entries.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/[0.02]">
            <p className="text-xs text-muted">
              Showing <span className="font-semibold text-heading">{(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)}</span> of <span className="font-semibold text-heading">{total}</span> entries
            </p>
            <div className="flex items-center gap-2">
              <button
                id="audit-prev-page"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg liquid-btn-glass disabled:opacity-40 cursor-pointer disabled:cursor-default"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <span className="text-xs text-muted font-mono">
                {page} / {pages}
              </span>
              <button
                id="audit-next-page"
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page >= pages}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg liquid-btn-glass disabled:opacity-40 cursor-pointer disabled:cursor-default"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
