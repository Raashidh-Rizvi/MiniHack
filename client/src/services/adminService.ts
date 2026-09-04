import { apiClient as api } from './api';
import { Issue, IssueStatus, Severity } from '../types/issue';




export interface AdminStats {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  criticalIssues: number;
  resolvedIssues: number;
}

export interface StatusUpdatePayload {
  newStatus?: IssueStatus;
  expectedUpdatedAt?: string;
  adminNotes?: string;
  adjustedSeverity?: Severity;
}

/** GET /api/admin/stats — Dashboard KPI metrics */
export async function getAdminStats(): Promise<AdminStats> {
  const res = await api.get('/admin/stats');
  return res.data.data;
}

/** GET /api/admin/queue — Priority-ranked issue queue */
export async function getPriorityQueue(filters?: {
  status?: string;
  priorityLevel?: string;
  category?: string;
  search?: string;
}): Promise<Issue[]> {
  const params: Record<string, string> = {};
  if (filters?.status && filters.status !== 'ALL') params.status = filters.status;
  if (filters?.priorityLevel && filters.priorityLevel !== 'ALL') params.priorityLevel = filters.priorityLevel;
  if (filters?.category && filters.category !== 'ALL') params.category = filters.category;
  if (filters?.search) params.search = filters.search;

  const res = await api.get('/admin/queue', { params });
  return res.data.data;
}

/** PUT /api/admin/issues/:id/status — Lifecycle status transition */
export async function updateIssueStatus(
  issueId: number,
  payload: StatusUpdatePayload
): Promise<Issue> {
  const res = await api.put(`/admin/issues/${issueId}/status`, payload);
  return res.data.data;
}

/** DELETE /api/admin/issues/:id — Moderation removal */
export async function moderateDeleteIssue(issueId: number, expectedUpdatedAt?: string): Promise<void> {
  await api.delete(`/admin/issues/${issueId}`, { data: { expectedUpdatedAt } });
}

/** PATCH /api/admin/issues/:id/priority — Recalculate priority */
export async function recalculatePriority(
  issueId: number, expectedUpdatedAt?: string
): Promise<{ priorityScore: number; priorityLevel: string }> {
  const res = await api.patch(`/admin/issues/${issueId}/priority`, { expectedUpdatedAt });
  return res.data.data;
}

/** PUT /api/admin/issues/:id/assign — Reassign issue to a different officer */
export async function reassignOfficer(
  issueId: number,
  officerId: number,
  officerName: string, expectedUpdatedAt?: string
): Promise<Issue> {
  const res = await api.put(`/admin/issues/${issueId}/assign`, { officerId, officerName, expectedUpdatedAt });
  return res.data.data;
}

export interface AdminHistoryEvent {
  id: string; type: string; timestamp: string; actorId: number; actorName: string; actorRole: string;
  before: Record<string, unknown>; after: Record<string, unknown>; note?: string;
}
export async function getAdminHistory(issueId: number): Promise<AdminHistoryEvent[]> {
  return (await api.get(`/admin/issues/${issueId}/history`)).data.data;
}
