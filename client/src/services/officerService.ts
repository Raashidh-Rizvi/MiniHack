import { apiClient as api } from './api';
import { Issue, IssueStatus } from '../types/issue';




export interface OfficerStats {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  criticalIssues: number;
}

// Phase 4: officerId removed — the backend reads it from the session token now.
export interface OfficerStatusPayload {
  newStatus: IssueStatus;
  fieldNotes?: string;
}

export interface OfficerUser {
  id: number;
  numericId?: number;
  fullName: string;
  email: string;
  role: string;
  communityArea: string;
}

/** GET /api/officer/stats — Officer dashboard KPIs (officer identified via session) */
export async function getOfficerStats(): Promise<OfficerStats> {
  const res = await api.get('/officer/stats');
  return res.data.data;
}

/** GET /api/officer/queue — Issues assigned to this officer (officer identified via session) */
export async function getOfficerQueue(
  filters?: { status?: string; priorityLevel?: string; category?: string; search?: string }
): Promise<Issue[]> {
  const params: Record<string, string> = {};
  if (filters?.status && filters.status !== 'ALL') params.status = filters.status;
  if (filters?.priorityLevel && filters.priorityLevel !== 'ALL') params.priorityLevel = filters.priorityLevel;
  if (filters?.category && filters.category !== 'ALL') params.category = filters.category;
  if (filters?.search) params.search = filters.search;
  const res = await api.get('/officer/queue', { params });
  return res.data.data;
}

/** PUT /api/officer/issues/:id/status — Officer updates status (officer identified via session) */
export async function officerUpdateStatus(
  issueId: number,
  payload: OfficerStatusPayload
): Promise<Issue> {
  const res = await api.put(`/officer/issues/${issueId}/status`, payload);
  return res.data.data;
}

/** GET /api/officer/list — All officers (used in admin reassignment) */
export async function getOfficerList(): Promise<OfficerUser[]> {
  const res = await api.get('/officer/list');
  return res.data.data;
}
