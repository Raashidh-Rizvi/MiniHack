import { apiClient, allowLocalDemo } from './api';
import { calculatePriorityScore, PriorityBreakdown } from '../utils/priority';
import { Issue, IssueCreateDTO, IssueUpdateDTO, PriorityLevel, Severity, User } from '../types/issue';
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
  // DYNAMIC ESTIMATE: Calculate live priority via backend Priority Engine
  async estimatePriority(payload: {
    severity: Severity;
    peopleAffected: number;
    urgency?: Severity;
  }): Promise<{ score: number; level: PriorityLevel; breakdown: PriorityBreakdown }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: {
          priorityScore: number;
          priorityLevel: PriorityLevel;
          breakdown: PriorityBreakdown;
        };
      }>('/issues/calculate-priority', payload);
      return {
        score: response.data.data.priorityScore,
        level: response.data.data.priorityLevel,
        breakdown: response.data.data.breakdown,
      };
    } catch {
      // Local mathematical fallback mirroring server formula
      return calculatePriorityScore(payload.severity, payload.peopleAffected, 0, payload.urgency);
    }
  },

  // CREATE: Report a new issue
  async createIssue(payload: IssueCreateDTO): Promise<Issue> {
    try {
      const response = await apiClient.post<{ success: boolean; data: Issue }>('/issues', payload);
      return response.data.data;
    } catch (err) {
      if (!allowLocalDemo(err)) throw err;
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
        latitude: payload.latitude ?? null,
        longitude: payload.longitude ?? null,
        severity: payload.severity,
        peopleAffected: payload.peopleAffected,
        priorityScore: calculatePriorityScore(payload.severity, payload.peopleAffected).score,
        priorityLevel: calculatePriorityScore(payload.severity, payload.peopleAffected).level,
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
      if (!allowLocalDemo(err)) throw err;
      console.warn('Backend unavailable, loading local reports:', err);
      const reports = getStoredReports();
      return reports.filter((r) => r.reportedBy === userId);
    }
  },

  // UPDATE: Edit report details
  async updateIssue(id: number, payload: IssueUpdateDTO): Promise<Issue> {
    try {
      const response = await apiClient.put<{ success: boolean; data: Issue }>(`/issues/${id}`, payload);
      return response.data.data;
    } catch (err) {
      if (!allowLocalDemo(err)) throw err;
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
      if (!allowLocalDemo(err)) throw err;
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
