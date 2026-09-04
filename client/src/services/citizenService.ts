import { apiClient } from './api';
import { Issue, IssueCreateDTO, IssueUpdateDTO, User } from '../types/issue';
import { MOCK_ISSUES, MOCK_USERS } from '../data/mockIssues';

// Local storage key for fallback persistence
const LOCAL_STORAGE_REPORTS_KEY = 'gramafix_citizen_reports';

const getStoredReports = (): Issue[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(MOCK_ISSUES));
      return MOCK_ISSUES;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_ISSUES;
  }
};

const setStoredReports = (reports: Issue[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
};

export const citizenService = {
  // CREATE: Report a new issue
  async createIssue(payload: IssueCreateDTO): Promise<Issue> {
    try {
      const response = await apiClient.post<{ success: boolean; data: Issue }>('/issues', payload);
      return response.data.data;
    } catch (err) {
      console.warn('Backend unavailable, saving report locally:', err);
      // Fallback local creation
      const reports = getStoredReports();
      const newId = 200 + reports.length + 1;
      const newIssue: Issue = {
        id: newId,
        title: payload.title,
        description: payload.description,
        category: payload.category,
        location: payload.location,
        severity: payload.severity,
        peopleAffected: payload.peopleAffected,
        priorityScore: 75,
        priorityLevel: 'HIGH',
        status: 'REPORTED',
        supportCount: 0,
        reportedBy: payload.reportedBy || 1,
        reportedByName: payload.reportedByName || 'Kasun Perera',
        createdAt: new Date().toISOString(),
      };
      reports.unshift(newIssue);
      setStoredReports(reports);
      return newIssue;
    }
  },

  // READ: Get citizen's own submitted reports
  async getMyReports(userId: number = 1): Promise<Issue[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Issue[] }>(
        `/issues/my-reports?userId=${userId}`
      );
      return response.data.data;
    } catch (err) {
      console.warn('Backend unavailable, loading local reports:', err);
      const reports = getStoredReports();
      return reports.filter((r) => r.reportedBy === userId);
    }
  },

  // READ: Get citizen's own statistics (total, open, inProgress, resolved)
  async getCitizenStats(userId: number = 1): Promise<{ total: number; open: number; inProgress: number; resolved: number }> {
    try {
      const response = await apiClient.get<{ success: boolean; data: { total: number; open: number; inProgress: number; resolved: number } }>(
        `/issues/my-stats?userId=${userId}`
      );
      return response.data.data;
    } catch (err) {
      console.warn('Backend stats unavailable, computing locally:', err);
      const reports = await this.getMyReports(userId);
      return {
        total: reports.length,
        open: reports.filter((r) => r.status === 'REPORTED').length,
        inProgress: reports.filter((r) => r.status === 'UNDER_REVIEW' || r.status === 'IN_PROGRESS').length,
        resolved: reports.filter((r) => r.status === 'RESOLVED').length,
      };
    }
  },

  // UPDATE: Edit report details
  async updateIssue(id: number, payload: IssueUpdateDTO): Promise<Issue> {
    try {
      const response = await apiClient.put<{ success: boolean; data: Issue }>(`/issues/${id}`, payload);
      return response.data.data;
    } catch (err) {
      console.warn('Backend unavailable, updating local report:', err);
      const reports = getStoredReports();
      const index = reports.findIndex((r) => r.id === id);
      if (index === -1) throw new Error(`Report #${id} not found.`);
      const updated = { ...reports[index], ...payload, updatedAt: new Date().toISOString() };
      reports[index] = updated;
      setStoredReports(reports);
      return updated;
    }
  },

  // DELETE: Cancel report
  async cancelIssue(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/issues/${id}`);
      return true;
    } catch (err) {
      console.warn('Backend unavailable, cancelling local report:', err);
      let reports = getStoredReports();
      reports = reports.filter((r) => r.id !== id);
      setStoredReports(reports);
      return true;
    }
  },

  // READ: Demo users for persona switcher
  async getDemoUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: User[] }>('/auth/demo-users');
      return response.data.data;
    } catch {
      return MOCK_USERS;
    }
  },
};
