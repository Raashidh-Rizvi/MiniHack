import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Issue, IssueStatus, Severity } from '../../types/issue';
import { StatusBadge } from '../issues/StatusBadge';
import { PriorityBadge } from '../issues/PriorityBadge';
import { StatusTimeline } from '../issues/StatusTimeline';
import { OfficerUser } from '../../services/officerService';
import { AdminHistoryEvent, getAdminHistory, StatusUpdatePayload } from '../../services/adminService';
import { errorMessage } from '../../services/api';
interface Props {
  issue: Issue | null; isOpen: boolean; onClose: () => void;
  onSubmit: (id: number, data: StatusUpdatePayload) => Promise<void>;
  onReassign: (id: number, officerId: number, name: string) => Promise<void>;
  onRecalculate: (id: number) => Promise<void>;
  officers: OfficerUser[]; officersLoading: boolean; officersError: string; onRetryOfficers: () => void;
  pending: string | null;
}
const transitions: Partial<Record<IssueStatus, IssueStatus[]>> = {
  REPORTED: ['UNDER_REVIEW', 'DUPLICATE', 'REJECTED'],
  UNDER_REVIEW: ['IN_PROGRESS', 'REPORTED', 'DUPLICATE', 'REJECTED'],
  IN_PROGRESS: ['RESOLVED', 'UNDER_REVIEW'],
};
export const StatusUpdateModal: React.FC<Props> = ({ issue, isOpen, onClose, onSubmit, onReassign, onRecalculate, officers, officersLoading, officersError, onRetryOfficers, pending }) => {
  const [status, setStatus] = useState<IssueStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [severity, setSeverity] = useState<Severity>('MEDIUM');
  const [officerId, setOfficerId] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<AdminHistoryEvent[]>([]);
  const [historyError, setHistoryError] = useState('');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyRetry, setHistoryRetry] = useState(0);
  const dialog = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose); closeRef.current = onClose;
  const pendingRef = useRef(pending); pendingRef.current = pending;
  useEffect(() => {
    if (!issue) return;
    setStatus(''); setNotes(issue.adminNotes || ''); setSeverity(issue.severity); setOfficerId(''); setError('');
  }, [issue?.id]);
  useEffect(() => {
    if (!isOpen || !issue) return;
    let active = true; setHistoryLoading(true); setHistoryError('');
    getAdminHistory(issue.id).then(data => { if (active) setHistory(data); }).catch(e => { if (active) setHistoryError(errorMessage(e)); }).finally(() => { if (active) setHistoryLoading(false); });
    return () => { active = false; };
  }, [isOpen, issue?.id, issue?.updatedAt, historyRetry]);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !pendingRef.current) closeRef.current();
      if (event.key === 'Tab') {
        const nodes = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]') || []);
        const first = nodes[0]; const last = nodes[nodes.length - 1];
        if (!first) { event.preventDefault(); return; }
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog.current)) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.removeEventListener('keydown', keydown); previous?.focus(); };
  }, [isOpen]);
  if (!isOpen || !issue) return null;
  const closed = ['RESOLVED', 'DUPLICATE', 'REJECTED'].includes(issue.status);
  const changedSeverity = severity !== issue.severity;
  const dirty = !!status || notes !== (issue.adminNotes || '') || changedSeverity;
  const run = async (action: () => Promise<void>) => {
    setError('');
    try { await action(); } catch (e) { setError(errorMessage(e)); }
  };
  const control = 'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2 text-sm';
  const button = 'px-3 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm';
  return <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3" onClick={() => { if (!pending) onClose(); }}>
    <div ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title" className="w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-5 space-y-5" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between gap-3"><div><h2 id="admin-dialog-title" className="text-xl font-bold">Manage report #{issue.id}</h2><p className="font-medium">{issue.title}</p></div><button aria-label="Close report" disabled={!!pending} onClick={onClose}><X /></button></div>
      <p className="text-sm whitespace-pre-wrap break-words">{issue.description}</p>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div><dt className="text-slate-500">Category</dt><dd>{issue.category}</dd></div>
        <div><dt className="text-slate-500">Location</dt><dd>{issue.location}</dd></div>
        <div><dt className="text-slate-500">Reported by</dt><dd>{issue.reportedByName || 'Citizen'}</dd></div>
        <div><dt className="text-slate-500">People affected</dt><dd>{issue.peopleAffected}</dd></div>
        <div><dt className="text-slate-500">Created</dt><dd>{new Date(issue.createdAt).toLocaleString()}</dd></div>
        <div><dt className="text-slate-500">Updated</dt><dd>{issue.updatedAt ? new Date(issue.updatedAt).toLocaleString() : 'Not recorded'}</dd></div>
        <div><dt className="text-slate-500">Assigned officer</dt><dd>{issue.assignedOfficerName || 'Unassigned'}</dd></div>
        <div><dt className="text-slate-500">Severity</dt><dd>{issue.severity}</dd></div>
      </dl>
      <div className="flex flex-wrap gap-2"><StatusBadge status={issue.status} /><PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} /></div>
      <StatusTimeline currentStatus={issue.status} />
      {issue.fieldNotes && <p className="text-sm"><strong>Officer progress:</strong> {issue.fieldNotes}</p>}
      <form className="space-y-3" onSubmit={e => { e.preventDefault(); void run(() => onSubmit(issue.id, { newStatus: status || undefined, adminNotes: notes, adjustedSeverity: changedSeverity ? severity : undefined })); }}>
        {!closed && <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-sm">Next status<select aria-label="Next status" className={control} value={status} disabled={!!pending} onChange={e => setStatus(e.target.value as IssueStatus | '')}><option value="">Keep current status</option>{(transitions[issue.status] || []).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}</select></label>
          <label className="text-sm">Severity<select aria-label="Severity" className={control} value={severity} disabled={!!pending} onChange={e => setSeverity(e.target.value as Severity)}>{['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(s => <option key={s}>{s}</option>)}</select></label>
        </div>}
        <label className="block text-sm" htmlFor="admin-notes">Internal notes / reason (required for moderation, backward status or severity changes)</label>
        <textarea id="admin-notes" className={control} maxLength={500} rows={3} disabled={!!pending} value={notes} onChange={e => setNotes(e.target.value)} />
        <p className="text-xs text-slate-500">{notes.length}/500 · Visible only to administrators</p>
        <button id="submit-status-update" className={button} disabled={!!pending || !dirty}>{pending === 'status' ? 'Saving…' : 'Save changes'}</button>
      </form>
      {!closed && <section className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
        <h3 className="font-semibold">Officer assignment</h3>
        {officersLoading ? <p role="status">Loading officers…</p> : officersError ? <p role="alert">{officersError} <button className="underline" onClick={onRetryOfficers}>Retry officers</button></p> : !officers.length ? <p>No officer accounts are available.</p> :
          <div className="flex gap-2"><select aria-label="Assign officer" className={control} disabled={!!pending} value={officerId} onChange={e => setOfficerId(e.target.value)}><option value="">Select officer</option>{officers.filter(o => Number.isSafeInteger(Number(o.id))).map(o => <option key={o.id} value={o.id}>{o.fullName} — {o.communityArea}</option>)}</select>
            <button className={button} disabled={!!pending || !officerId} onClick={() => void run(async () => { const officer = officers.find(o => o.id === Number(officerId)); if (officer) { await onReassign(issue.id, officer.id, officer.fullName); setOfficerId(''); } })}>{pending === 'assign' ? 'Saving…' : 'Assign'}</button></div>}
        <button className={button} disabled={!!pending} onClick={() => void run(() => onRecalculate(issue.id))}>{pending === 'priority' ? 'Recalculating…' : 'Recalculate priority'}</button>
      </section>}
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <section className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
        <h3 className="font-semibold">Recorded administrator activity</h3>
        {historyLoading ? <p role="status">Loading activity…</p> : historyError ? <p role="alert">{historyError} <button className="underline" onClick={() => setHistoryRetry(n => n + 1)}>Retry history</button></p> : !history.length ? <p className="text-sm text-slate-500">No recorded activity yet.</p> :
          <ol className="space-y-3">{[...history].reverse().map(event => <li key={event.id} className="text-sm border-l-2 border-indigo-400 pl-3"><p className="font-medium">{event.type} · {event.actorName}</p><p className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleString()}</p>{Object.entries(event.after).map(([key, value]) => <p className="break-words" key={key}>{key}: {String(event.before[key] ?? '—')} → {String(value ?? '—')}</p>)}</li>)}</ol>}
      </section>
    </div>
  </div>;
};