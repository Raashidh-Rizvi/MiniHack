import { apiClient } from './api';
import { Issue, Category, CategoryType, IssueStatus } from '../types/issue';
import { MOCK_ISSUES, MOCK_CATEGORIES } from '../data/mockIssues';

const LOCAL_STORAGE_ISSUES_KEY = 'gramafix_citizen_reports';
const SUPPORTED_PREFIX = 'gramafix_user_supports_';

const getStoredIssues = (): Issue[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ISSUES_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_ISSUES_KEY, JSON.stringify(MOCK_ISSUES));
      return MOCK_ISSUES;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_ISSUES;
  }
};

const setStoredIssues = (issues: Issue[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_ISSUES_KEY, JSON.stringify(issues));
  } catch (e) {
    console.warn('Failed to save issues to localStorage:', e);
  }
};

export interface FeedQueryParams {
  search?: string;
  category?: CategoryType | 'ALL';
  status?: IssueStatus | 'ALL';
  sortBy?: 'priority' | 'support' | 'recent';
}

export const feedService = {
  // READ: Get issues with search, filter, and sorting
  async getIssues(params: FeedQueryParams = {}): Promise<Issue[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.set('search', params.search);
      if (params.category && params.category !== 'ALL') searchParams.set('category', params.category);
      if (params.status && params.status !== 'ALL') searchParams.set('status', params.status);
      if (params.sortBy) searchParams.set('sortBy', params.sortBy);

      const response = await apiClient.get<{ success: boolean; data: Issue[] }>(
        `/issues?${searchParams.toString()}`
      );
      return response.data.data;
    } catch (err) {
      console.warn('Backend unavailable, querying local store:', err);
      let list = getStoredIssues();

      // Search filter
      if (params.search && params.search.trim()) {
        const query = params.search.toLowerCase().trim();
        list = list.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.location.toLowerCase().includes(query)
        );
      }

      // Category filter
      if (params.category && params.category !== 'ALL') {
        list = list.filter((item) => item.category === params.category);
      }

      // Status filter
      if (params.status && params.status !== 'ALL') {
        list = list.filter((item) => item.status === params.status);
      }

      // Sort
      if (params.sortBy === 'support') {
        list.sort((a, b) => b.supportCount - a.supportCount);
      } else if (params.sortBy === 'recent') {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else {
        // Default: Sort by Community Priority Score descending
        list.sort((a, b) => b.priorityScore - a.priorityScore);
      }

      return list;
    }
  },

  // READ: Get single issue details by ID
  async getIssueById(id: number): Promise<Issue | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Issue }>(`/issues/${id}`);
      return response.data.data;
    } catch (err) {
      console.warn('Backend unavailable, getting local issue by ID:', err);
      const list = getStoredIssues();
      const found = list.find((i) => i.id === id);
      return found || null;
    }
  },

  // READ: Get civic categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Category[] }>('/categories');
      return response.data.data;
    } catch {
      return MOCK_CATEGORIES;
    }
  },

  // Support / Upvote operations
  getUserSupportedIssueIds(userId: number): number[] {
    try {
      const raw = localStorage.getItem(`${SUPPORTED_PREFIX}${userId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  hasUserSupported(issueId: number, userId: number): boolean {
    const supported = this.getUserSupportedIssueIds(userId);
    return supported.includes(issueId);
  },

  // CREATE / DELETE Support (Toggle upvote)
  async toggleSupport(
    issueId: number,
    userId: number = 1
  ): Promise<{ supported: boolean; supportCount: number }> {
    try {
      const isCurrentlySupported = this.hasUserSupported(issueId, userId);
      if (isCurrentlySupported) {
        const response = await apiClient.delete<{ success: boolean; supportCount: number }>(
          `/issues/${issueId}/support?userId=${userId}`
        );
        const supported = this.getUserSupportedIssueIds(userId).filter((id) => id !== issueId);
        localStorage.setItem(`${SUPPORTED_PREFIX}${userId}`, JSON.stringify(supported));
        return { supported: false, supportCount: response.data.supportCount };
      } else {
        const response = await apiClient.post<{ success: boolean; supportCount: number }>(
          `/issues/${issueId}/support`,
          { userId }
        );
        const supported = this.getUserSupportedIssueIds(userId);
        if (!supported.includes(issueId)) supported.push(issueId);
        localStorage.setItem(`${SUPPORTED_PREFIX}${userId}`, JSON.stringify(supported));
        return { supported: true, supportCount: response.data.supportCount };
      }
    } catch (err) {
      console.warn('Backend unavailable, updating support locally:', err);
      const list = getStoredIssues();
      const issue = list.find((i) => i.id === issueId);
      if (!issue) throw new Error('Issue not found');

      const isCurrentlySupported = this.hasUserSupported(issueId, userId);
      let supported = this.getUserSupportedIssueIds(userId);

      if (isCurrentlySupported) {
        issue.supportCount = Math.max(0, issue.supportCount - 1);
        supported = supported.filter((id) => id !== issueId);
      } else {
        issue.supportCount += 1;
        supported.push(issueId);
      }

      setStoredIssues(list);
      localStorage.setItem(`${SUPPORTED_PREFIX}${userId}`, JSON.stringify(supported));
      return { supported: !isCurrentlySupported, supportCount: issue.supportCount };
    }
  },
};
