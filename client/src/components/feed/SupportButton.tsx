import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { feedService } from '../../services/feedService';
import { useAuth } from '../../hooks/useAuth';

interface SupportButtonProps {
  issueId: number;
  initialCount: number;
  compact?: boolean;
  onSupportToggled?: (newCount: number, isSupported: boolean) => void;
}

export const SupportButton: React.FC<SupportButtonProps> = ({
  issueId,
  initialCount,
  compact = false,
  onSupportToggled,
}) => {
  const { currentUser } = useAuth();
  const [isSupported, setIsSupported] = useState<boolean>(() =>
    feedService.hasUserSupported(issueId, currentUser?.id || 1)
  );
  const [count, setCount] = useState<number>(initialCount);
  const [loading, setLoading] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    setAnimating(true);

    try {
      const res = await feedService.toggleSupport(issueId, currentUser?.id || 1);
      setIsSupported(res.supported);
      setCount(res.supportCount);
      if (onSupportToggled) {
        onSupportToggled(res.supportCount, res.supported);
      }
    } catch (err) {
      console.error('Failed to toggle support:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimating(false), 400);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-label={isSupported ? 'Remove community support' : 'Support this civic issue'}
      title={isSupported ? 'You endorsed this issue' : 'Click to add your community weight'}
      className={`relative inline-flex items-center justify-center font-medium transition-all duration-200 select-none group active:scale-95 ${
        compact
          ? 'px-2.5 py-1 text-xs rounded-lg gap-1.5'
          : 'px-3.5 py-2 text-sm rounded-xl gap-2'
      } ${
        isSupported
          ? 'bg-red-500/15 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/40 shadow-[0_0_14px_rgba(239,68,68,0.25)]'
          : 'bg-slate-100 dark:bg-surface-elevated text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-red-500/30 hover:text-red-500 dark:hover:text-red-400'
      }`}
    >
      <Heart
        className={`transition-all duration-300 ${
          compact ? 'w-3.5 h-3.5' : 'w-4 h-4'
        } ${
          isSupported
            ? 'fill-red-500 text-red-500 scale-110'
            : 'group-hover:scale-110 group-hover:text-red-500'
        } ${animating ? 'animate-ping' : ''}`}
      />
      <span className="font-semibold tabular-nums">{count}</span>
      <span className="hidden sm:inline text-[11px] opacity-80">
        {count === 1 ? 'Endorsement' : 'Endorsements'}
      </span>
    </button>
  );
};
