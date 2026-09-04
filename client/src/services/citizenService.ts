import { apiClient } from './api';
import { Issue, IssueCreateDTO, IssueUpdateDTO, User } from '../types/issue';

export const citizenService = {
  // CREATE: Report a new issue
  async createIssue(payload: IssueCreateDTO): Promise<Issue> {
    const response = await apiClient.post<{ success: boolean; data: Issue }>('/issues', payload);
    return response.data.data;
  },

  // READ: Get citizen's own submitted reports
  async getMyReports(userId: number = 1): Promise<Issue[]> {
    const response = await apiClient.get<{ success: boolean; data: Issue[] }>(
      `/issues/my-reports?userId=${userId}`
    );
    return response.data.data;
  },

  // UPDATE: Edit report details
  async updateIssue(id: number, payload: IssueUpdateDTO): Promise<Issue> {
    const response = await apiClient.put<{ success: boolean; data: Issue }>(`/issues/${id}`, payload);
    return response.data.data;
  },

  // DELETE: Cancel report
  async cancelIssue(id: number): Promise<boolean> {
    await apiClient.delete(`/issues/${id}`);
    return true;
  },

  // READ: Demo users for persona switcher
  async getDemoUsers(): Promise<User[]> {
    const response = await apiClient.get<{ success: boolean; data: User[] }>('/auth/demo-users');
    return response.data.data;
  },
};
