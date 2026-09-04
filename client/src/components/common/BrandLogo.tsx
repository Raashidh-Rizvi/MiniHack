import React from 'react';
import { Link } from 'react-router-dom';
import { SriLankanLion } from './SriLankanLion';

interface BrandLogoProps {
  className?: string;
  badgeSize?: string;
  iconSize?: number | string;
  showText?: boolean;
  showSubtitle?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  linkTo?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  badgeSize = 'w-10 h-10 sm:w-11 sm:h-11',
  iconSize = 26,
  showText = true,
  showSubtitle = true,
  showBadge = true,
  badgeText = 'MVP',
  linkTo = '/',
}) => {
  const content = (
    <div className={`flex items-center space-x-3 group ${className}`}>
      {/* Icon Badge with Sri Lankan Lion in Red */}
      <div
        className={`${badgeSize} rounded-2xl bg-gradient-to-tr from-red-500/10 via-rose-500/15 to-red-500/20 dark:from-red-500/20 dark:to-rose-600/20 border border-red-500/30 flex items-center justify-center shadow-lg shadow-red-500/15 group-hover:scale-105 group-hover:border-red-500/50 group-hover:shadow-red-500/25 transition-all duration-200`}
      >
        <SriLankanLion
          size={iconSize}
          color="#EF4444"
          accentColor="#991B1B"
          className="text-red-500 drop-shadow-[0_2px_8px_rgba(239,68,68,0.4)]"
        />
      </div>

      {showText && (
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Grama<span className="text-red-500">Fix</span>
            </span>
            {showBadge && (
              <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                {badgeText}
              </span>
            )}
          </div>
          {showSubtitle && (
            <p className="text-[10px] text-slate-400 hidden sm:block font-medium">Report. Prioritize. Fix.</p>
          )}
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
};

export default BrandLogo;
