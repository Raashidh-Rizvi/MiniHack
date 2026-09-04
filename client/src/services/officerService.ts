import axios from 'axios';
import { Issue, IssueStatus } from '../types/issue';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
        config.headers['x-user-role'] = user.role || 'OFFICER';
      }
    }
  } catch {}

  const token = localStorage.getItem('gramafix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface OfficerStats {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  criticalIssues: number;
}

// Phase 4: officerId removed — the backend reads it from the JWT token now.
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

/** GET /api/officer/stats — Officer dashboard KPIs (officer identified via JWT) */
export async function getOfficerStats(): Promise<OfficerStats> {
  const res = await api.get('/officer/stats');
  return res.data.data;
}

/** GET /api/officer/queue — Issues assigned to this officer (officer identified via JWT) */
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

/** PUT /api/officer/issues/:id/status — Officer updates status (officer identified via JWT) */
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
