import { apiClient } from './api';
import { Issue, Category, CategoryType, IssueStatus } from '../types/issue';

export interface FeedQueryParams {
  search?: string;
  category?: CategoryType | 'ALL';
  status?: IssueStatus | 'ALL';
  sortBy?: 'priority' | 'support' | 'recent';
}

export const feedService = {
  // READ: Get issues with search, filter, and sorting
  async getIssues(params: FeedQueryParams = {}): Promise<Issue[]> {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.category && params.category !== 'ALL') searchParams.set('category', params.category);
    if (params.status && params.status !== 'ALL') searchParams.set('status', params.status);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);

    const response = await apiClient.get<{ success: boolean; data: Issue[] }>(
      `/issues?${searchParams.toString()}`
    );
    return response.data.data;
  },

  // READ: Get single issue details by ID
  async getIssueById(id: number): Promise<Issue | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Issue }>(`/issues/${id}`);
      return response.data.data;
    } catch {
      return null;
    }
  },

  // READ: Get civic categories
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<{ success: boolean; data: Category[] }>('/categories');
    return response.data.data;
  },

  // CREATE / DELETE Support (Toggle upvote) — server is the source of truth
  async toggleSupport(
    issueId: number,
    isCurrentlySupported: boolean
  ): Promise<{ supported: boolean; supportCount: number }> {
    if (isCurrentlySupported) {
      const response = await apiClient.delete<{ success: boolean; supportCount: number; userSupported: boolean }>(
        `/issues/${issueId}/support`
      );
      return { supported: false, supportCount: response.data.supportCount };
    } else {
      const response = await apiClient.post<{ success: boolean; supportCount: number; userSupported: boolean }>(
        `/issues/${issueId}/support`,
        {}
      );
      return { supported: true, supportCount: response.data.supportCount };
    }
  },
};
