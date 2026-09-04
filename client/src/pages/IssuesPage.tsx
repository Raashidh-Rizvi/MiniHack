import React, { useState, useEffect, useMemo } from 'react';
import { Issue, CategoryType, IssueStatus } from '../types/issue';
import { feedService } from '../services/feedService';
import { CategoryFilter } from '../components/feed/CategoryFilter';
import { IssueList } from '../components/feed/IssueList';
import { IssueDetailsModal } from '../components/feed/IssueDetailsModal';
import {
  Search,
  Filter,
  SlidersHorizontal,
  AlertOctagon,
  CheckCircle,
  PlusCircle,
  TrendingUp,
  Map,
  List,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SriLankanLion } from '../components/common/SriLankanLion';
import { IssuesExplorerMap } from '../components/map/IssuesExplorerMap';

export const IssuesPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'priority' | 'support' | 'recent'>('priority');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Load issues from service
  const loadIssues = async () => {
    setLoading(true);
    try {
      const data = await feedService.getIssues({
        search: searchQuery,
        category: selectedCategory,
        status: selectedStatus,
        sortBy,
      });
      setIssues(data);
    } catch (err) {
      console.error('Failed to load feed issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [selectedCategory, selectedStatus, sortBy]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      loadIssues();
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Category counts calculation
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach((i) => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return counts;
  }, [issues]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = issues.length;
    const critical = issues.filter((i) => i.priorityLevel === 'CRITICAL').length;
    const inProgress = issues.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'UNDER_REVIEW').length;
    const resolved = issues.filter((i) => i.status === 'RESOLVED').length;
    const totalSupports = issues.reduce((acc, curr) => acc + (curr.supportCount || 0), 0);
    return { total, critical, inProgress, resolved, totalSupports };
  }, [issues]);

  const handleSupportToggled = (issueId: number, newCount: number) => {
    setIssues((prev) =>
      prev.map((item) => (item.id === issueId ? { ...item, supportCount: newCount } : item))
    );
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue((prev) => (prev ? { ...prev, supportCount: newCount } : null));
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner / Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-2">
            <SriLankanLion size={15} color="#EF4444" accentColor="#991B1B" />
            <span>Sri Lankan Civic Impact Live Feed</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Community Issues & Priorities
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Transparently track local reports prioritized by community severity, population impact, and citizen endorsements.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold liquid-btn-crimson w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report an Issue</span>
        </Link>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 flex items-center space-x-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {stats.critical}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Critical Priority</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 flex items-center space-x-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {stats.inProgress}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">In Active Review</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 flex items-center space-x-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {stats.resolved}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Resolved Issues</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 flex items-center space-x-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0">
            <SriLankanLion size={20} color="#EF4444" accentColor="#991B1B" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {stats.totalSupports}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Citizen Upvotes</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-white/10 shadow-sm mb-8 space-y-5">
        {/* Search input and Sort dropdown */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by neighborhood, keyword, or problem (e.g. 'drain', 'pothole', 'Matale')..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-surface-elevated border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative min-w-[170px]">
              <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'priority' | 'support' | 'recent')}
                className="w-full pl-10 pr-8 py-3 rounded-2xl bg-slate-50 dark:bg-surface-elevated border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <option value="priority">Priority Score (High &rarr; Low)</option>
                <option value="support">Most Supported</option>
                <option value="recent">Newest Reports</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
              <Filter className="w-3 h-3 text-red-500" />
              <span>Filter by Civic Category</span>
            </span>
          </div>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-t border-slate-100 dark:border-white/5 pt-3">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Status:</span>
          {(['ALL', 'REPORTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'] as const).map((status) => {
            const isActive = selectedStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'liquid-pill-active'
                    : 'liquid-pill'
                }`}
              >
                {status === 'ALL' ? 'All Statuses' : status.replace('_', ' ')}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle (List View vs Interactive Map View) */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {issues.length} {issues.length === 1 ? 'Report' : 'Reports'} Found
          </div>

          <div className="inline-flex p-1 bg-slate-100 dark:bg-surface-elevated rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'liquid-btn-crimson shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'liquid-btn-crimson shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Issues Display: Interactive OpenStreetMap vs Card Grid List */}
      {viewMode === 'map' ? (
        <IssuesExplorerMap
          issues={issues}
          onSelectIssue={(issue) => setSelectedIssue(issue)}
          selectedIssueId={selectedIssue?.id}
        />
      ) : (
        <IssueList
          issues={issues}
          loading={loading}
          onSelectIssue={(issue) => setSelectedIssue(issue)}
          onSupportToggled={handleSupportToggled}
        />
      )}

      {/* Details Modal */}
      <IssueDetailsModal
        issue={selectedIssue}
        isOpen={Boolean(selectedIssue)}
        onClose={() => setSelectedIssue(null)}
        onSupportToggled={handleSupportToggled}
      />
    </div>
  );
};
