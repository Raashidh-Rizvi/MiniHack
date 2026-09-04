import { apiClient } from './api';

export interface AuditEntry {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  email: string;
  userId: number | null;
  fullName: string | null;
  role: string | null;
  success: boolean;
  failReason: 'user_not_found' | 'bad_password' | null;
}

export interface AuditLogFilters {
  email?: string;
  success?: 'true' | 'false';
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogResponse {
  success: boolean;
  data: AuditEntry[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const auditService = {
  async getLoginAuditLog(filters: AuditLogFilters = {}): Promise<AuditLogResponse> {
    const params = new URLSearchParams();
    if (filters.email) params.set('email', filters.email);
    if (filters.success !== undefined) params.set('success', filters.success);
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    const query = params.toString();
    const url = `/admin/audit-log${query ? `?${query}` : ''}`;
    return (await apiClient.get(url)).data;
  },
};
