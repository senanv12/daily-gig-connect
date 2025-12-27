import { Flame, Award, Star, Diamond } from 'lucide-react';
import { StreakLevel, getStreakLabel } from '@/types';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  level: StreakLevel;
  days: number;
  size?: 'sm' | 'md' | 'lg';
}

const levelConfig = {
  bronze: {
    icon: Flame,
    bgClass: 'bg-bronze/10',
    textClass: 'text-bronze',
    borderClass: 'border-bronze/30',
    glowClass: '',
  },
  silver: {
    icon: Award,
    bgClass: 'bg-silver/10',
    textClass: 'text-silver',
    borderClass: 'border-silver/30',
    glowClass: '',
  },
  gold: {
    icon: Star,
    bgClass: 'bg-gold/10',
    textClass: 'text-gold',
    borderClass: 'border-gold/30',
    glowClass: 'shadow-[0_0_20px_hsl(var(--gold)/0.3)]',
  },
  diamond: {
    icon: Diamond,
    bgClass: 'bg-diamond/10',
    textClass: 'text-diamond',
    borderClass: 'border-diamond/30',
    glowClass: 'shadow-[0_0_25px_hsl(var(--diamond)/0.4)]',
  },
};

const sizeConfig = {
  sm: {
    wrapper: 'px-3 py-1.5',
    icon: 'h-4 w-4',
    text: 'text-sm',
  },
  md: {
    wrapper: 'px-4 py-2',
    icon: 'h-5 w-5',
    text: 'text-base',
  },
  lg: {
    wrapper: 'px-6 py-3',
    icon: 'h-6 w-6',
    text: 'text-lg',
  },
};

export function StreakBadge({ level, days, size = 'md' }: StreakBadgeProps) {
  const config = levelConfig[level];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-semibold transition-all",
        config.bgClass,
        config.textClass,
        config.borderClass,
        config.glowClass,
        sizes.wrapper
      )}
    >
      <Icon className={cn(sizes.icon, "animate-bounce-subtle")} />
      <span className={sizes.text}>
        {days} gün - {getStreakLabel(level)}
      </span>
    </div>
  );
}
