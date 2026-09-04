import React, { useState } from 'react';
import { Heart, LogIn } from 'lucide-react';
import { feedService } from '../../services/feedService';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface SupportButtonProps {
  issueId: number;
  initialCount: number;
  initialIsSupported?: boolean;
  compact?: boolean;
  onSupportToggled?: (newCount: number, isSupported: boolean) => void;
}

export const SupportButton: React.FC<SupportButtonProps> = ({
  issueId,
  initialCount,
  initialIsSupported = false,
  compact = false,
  onSupportToggled,
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSupported, setIsSupported] = useState<boolean>(initialIsSupported);
  const [count, setCount] = useState<number>(initialCount);
  const [loading, setLoading] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Redirect unauthenticated users to login
    if (!isAuthenticated || !currentUser?.id) {
      navigate('/login');
      return;
    }

    if (loading) return;

    setLoading(true);
    setAnimating(true);

    try {
      const res = await feedService.toggleSupport(issueId, isSupported);
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
      title={
        !isAuthenticated
          ? 'Sign in to endorse this issue'
          : isSupported
          ? 'You endorsed this issue — click to remove'
          : 'Click to add your community endorsement'
      }
      className={`relative inline-flex items-center justify-center font-medium transition-all duration-200 select-none group active:scale-95 cursor-pointer ${
        compact
          ? 'px-2.5 py-1 text-xs rounded-lg gap-1.5'
          : 'px-3.5 py-2 text-sm rounded-xl gap-2'
      } ${
        isSupported
          ? 'liquid-btn-crimson shadow-[0_4px_16px_rgba(239,68,68,0.5)]'
          : !isAuthenticated
          ? 'liquid-btn-glass text-slate-400 dark:text-slate-500 opacity-75'
          : 'liquid-btn-glass text-slate-700 dark:text-slate-200'
      }`}
    >
      {!isAuthenticated ? (
        <LogIn
          className={`transition-all duration-300 ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-slate-400`}
        />
      ) : (
        <Heart
          className={`transition-all duration-300 ${
            compact ? 'w-3.5 h-3.5' : 'w-4 h-4'
          } ${
            isSupported
              ? 'fill-white text-white scale-110'
              : 'text-slate-400 group-hover:scale-110 group-hover:text-red-500'
          } ${animating ? 'animate-ping' : ''}`}
        />
      )}
      <span className="font-semibold tabular-nums">{count}</span>
      <span className="hidden sm:inline text-[11px] opacity-80">
        {count === 1 ? 'Endorsement' : 'Endorsements'}
      </span>
    </button>
  );
};
