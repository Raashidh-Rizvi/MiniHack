import axios from 'axios';
import { Issue, IssueStatus, Severity } from '../types/issue';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  try {
    const rawUser = localStorage.getItem('gramafix_user');
    if (rawUser) {
      const user = JSON.parse(rawUser);
      if (user?.id) {
        config.headers['x-user-id'] = String(user.id);
        config.headers['x-user-role'] = user.role || 'ADMIN';
      }
    }
  } catch {}
  return config;
});

export interface AdminStats {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  criticalIssues: number;
  resolvedIssues: number;
}

export interface StatusUpdatePayload {
  newStatus: IssueStatus;
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
export async function moderateDeleteIssue(issueId: number): Promise<void> {
  await api.delete(`/admin/issues/${issueId}`);
}

/** PATCH /api/admin/issues/:id/priority — Recalculate priority */
export async function recalculatePriority(
  issueId: number
): Promise<{ priorityScore: number; priorityLevel: string }> {
  const res = await api.patch(`/admin/issues/${issueId}/priority`);
  return res.data.data;
}

/** PUT /api/admin/issues/:id/assign — Reassign issue to a different officer */
export async function reassignOfficer(
  issueId: number,
  officerId: number,
  officerName: string
): Promise<Issue> {
  const res = await api.put(`/admin/issues/${issueId}/assign`, { officerId, officerName });
  return res.data.data;
}
