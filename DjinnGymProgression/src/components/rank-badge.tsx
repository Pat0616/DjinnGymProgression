'use client';

import { RANK_COLORS } from '../lib/types';
import type {RankTier} from '../lib/types';

interface RankBadgeProps {
  rank: RankTier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeMap = {
  sm: { badge: 'w-12 h-12', icon: 'text-lg' },
  md: { badge: 'w-16 h-16', icon: 'text-2xl' },
  lg: { badge: 'w-24 h-24', icon: 'text-5xl' },
};

const rankSymbols: Record<RankTier, string> = {
  'Initiate': '◯',
  'Novice': '◆',
  'Adept': '✦',
  'Expert': '★',
  'Master': '✦✦',
  'Grandmaster': '✦✦✦',
  'Sage': '☆',
  'Legend': '◈',
};

export function RankBadge({ rank, size = 'md', showLabel = true }: RankBadgeProps) {
  const sizes = sizeMap[size];
  const bgColor = RANK_COLORS[rank];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizes.badge} ${bgColor} rounded-full flex items-center justify-center text-white shadow-lg border-2 border-accent glow-effect`}
      >
        <span className={`${sizes.icon} font-bold`}>{rankSymbols[rank]}</span>
      </div>
      {showLabel && <p className="text-sm font-semibold text-foreground">{rank}</p>}
    </div>
  );
}
