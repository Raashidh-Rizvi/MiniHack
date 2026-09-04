import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LayoutDashboard, AlertTriangle, Clock, Activity, CheckCircle } from 'lucide-react';
import { Issue } from '../../types/issue';
import { MetricsCard } from './MetricsCard';
import { PriorityQueueTable } from './PriorityQueueTable';
import { StatusUpdateModal } from './StatusUpdateModal';
import { PriorityFilter } from '../filters/PriorityFilter';
import { getAdminStats, getPriorityQueue, updateIssueStatus, moderateDeleteIssue, reassignOfficer, recalculatePriority, AdminStats, StatusUpdatePayload } from '../../services/adminService';
import { getOfficerList, OfficerUser } from '../../services/officerService';
import { errorMessage } from '../../services/api';
const statuses = ['ALL', 'REPORTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'DUPLICATE', 'REJECTED'];
const categories = ['ALL', 'ROAD', 'STREETLIGHT', 'WASTE', 'WATER', 'DRAINAGE', 'TRAFFIC', 'ENVIRONMENT', 'OTHER'];
const nextStatus = { REPORTED: 'UNDER_REVIEW', UNDER_REVIEW: 'IN_PROGRESS', IN_PROGRESS: 'RESOLVED' } as const;
export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsError, setStatsError] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [selected, setSelected] = useState<Issue | null>(null);
  const [officers, setOfficers] = useState<OfficerUser[]>([]);
  const [officersError, setOfficersError] = useState('');
  const [officersLoading, setOfficersLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);
  const busy = useRef(false);
  const sequence = useRef(0);
  const fetchStats = useCallback(async () => {
    try { setStats(await getAdminStats()); setStatsError(''); }
    catch (e) { setStatsError(errorMessage(e)); }
  }, []);
  const fetchOfficers = useCallback(async () => {
    setOfficersLoading(true);
    try { setOfficers(await getOfficerList()); setOfficersError(''); }
    catch (e) { setOfficersError(errorMessage(e)); }
    finally { setOfficersLoading(false); }
  }, []);
  const fetchQueue = useCallback(async () => {
    const request = ++sequence.current; setLoading(true);
    try {
      const data = await getPriorityQueue({ search, status, category, priorityLevel: priority });
      if (request === sequence.current) { setIssues(data); setError(''); }
    } catch (e) { if (request === sequence.current) setError(errorMessage(e)); }
    finally { if (request === sequence.current) setLoading(false); }
  }, [search, status, category, priority]);
  useEffect(() => { void fetchStats(); void fetchOfficers(); }, [fetchStats, fetchOfficers]);
  useEffect(() => {
    ++sequence.current;
    const timer = setTimeout(fetchQueue, 300);
    return () => { clearTimeout(timer); ++sequence.current; };
  }, [fetchQueue]);
  const run = async (key: string, operation: () => Promise<void>) => {
    if (busy.current) throw new Error('Wait for the current action to finish.');
    busy.current = true; setPending(key); setNotice('');
    try { await operation(); setNotice('Saved successfully.'); await Promise.all([fetchQueue(), fetchStats()]); }
    finally { busy.current = false; setPending(null); }
  };
  const handleStatus = async (id: number, payload: StatusUpdatePayload) => {
    const issue = selected?.id === id ? selected : issues.find(i => i.id === id);
    await run('status', async () => {
      await updateIssueStatus(id, { ...payload, expectedUpdatedAt: issue?.updatedAt });
      setSelected(null);
    });
  };
  const handleAssign = async (id: number, officerId: number, name: string) => {
    await run('assign', async () => setSelected(await reassignOfficer(id, officerId, name, selected?.updatedAt)));
  };
  const handlePriority = async (id: number) => {
    await run('priority', async () => {
      await recalculatePriority(id, selected?.updatedAt);
      const refreshed = await getPriorityQueue();
      setSelected(refreshed.find(i => i.id === id) || null);
    });
  };
  const handleDelete = async (id: number) => {
    try { await run('delete-' + id, async () => { await moderateDeleteIssue(id, issues.find(i => i.id === id)?.updatedAt); }); }
    catch (e) { setNotice(errorMessage(e)); throw e; }
  };
  const quickAdvance = async (id: number) => {
    const issue = issues.find(i => i.id === id);
    if (!issue || !(issue.status in nextStatus)) return;
    try { await handleStatus(id, { newStatus: nextStatus[issue.status as keyof typeof nextStatus] }); }
    catch (e) { setNotice(errorMessage(e)); }
  };
  const cards = [
    ['totalIssues', 'Total Issues', LayoutDashboard, 'indigo', 'All reported issues'],
    ['openIssues', 'Open', Clock, 'sky', 'Reported and under review'],
    ['criticalIssues', 'Critical', AlertTriangle, 'red', 'Includes closed reports'],
    ['inProgressIssues', 'In Progress', Activity, 'amber', 'Being addressed'],
    ['resolvedIssues', 'Resolved', CheckCircle, 'emerald', 'Completed'],
  ] as const;
  const control = 'rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2 text-sm';
  return <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map(([key, title, icon, colorTheme, subtitle]) => <MetricsCard id={key} key={key} title={title} value={stats ? stats[key] : '—'} icon={icon} colorTheme={colorTheme} subtitle={subtitle} />)}
    </div>
    {statsError && <p role="alert" className="text-red-600">Statistics unavailable{stats ? ' (showing previous values)' : ''}: {statsError} <button className="underline" onClick={fetchStats}>Retry statistics</button></p>}
    <p role="status" aria-live="polite" className="text-sm">{notice}</p>
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm overflow-hidden">
      <div className="p-5 flex items-center justify-between gap-3"><h2 className="font-bold">Community Priority Queue <span className="text-sm font-normal">({issues.length})</span></h2><button className="text-sm underline" disabled={!!pending} onClick={() => { void fetchQueue(); void fetchStats(); void fetchOfficers(); }}>Refresh</button></div>
      <div className="p-5 border-y border-slate-200 dark:border-slate-700 space-y-3">
        <label className="block text-sm">Search reports<input id="admin-search" maxLength={100} value={search} onChange={e => setSearch(e.target.value)} placeholder="Title, description or location" className={control + ' w-full mt-1'} /></label>
        <div className="flex flex-wrap gap-4">
          <label className="text-sm">Category <select aria-label="Category" value={category} onChange={e => setCategory(e.target.value)} className={control}>{categories.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}</select></label>
          <label className="text-sm">Status <select aria-label="Status" value={status} onChange={e => setStatus(e.target.value)} className={control}>{statuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}</select></label>
        </div>
        <PriorityFilter selectedPriority={priority} onSelectPriority={setPriority} />
      </div>
      <div className="p-4">{error ? <div role="alert" className="text-red-600">{error} <button className="underline" onClick={fetchQueue}>Retry queue</button></div> :
        <PriorityQueueTable issues={issues} loading={loading} busy={!!pending} onSelectIssue={setSelected} onQuickStatusUpdate={quickAdvance} onDelete={handleDelete} />}</div>
    </section>
    <StatusUpdateModal issue={selected} isOpen={!!selected} onClose={() => setSelected(null)} onSubmit={handleStatus}
      onReassign={handleAssign} onRecalculate={handlePriority} officers={officers} officersLoading={officersLoading}
      officersError={officersError} onRetryOfficers={fetchOfficers} pending={pending} />
  </div>;
};