import {
  Calendar,
  UtensilsCrossed,
  Warehouse,
  ShoppingBag,
  Megaphone,
  Truck,
  Sparkles,
  MoreHorizontal,
  PartyPopper,
  LucideIcon,
} from 'lucide-react';
import { JOB_CATEGORIES, JobCategory } from '@/types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  UtensilsCrossed,
  Warehouse,
  ShoppingBag,
  Megaphone,
  Truck,
  Sparkles,
  MoreHorizontal,
  PartyPopper,
};

// Category-specific gradient backgrounds
const categoryColors: Record<JobCategory, { bg: string; iconBg: string }> = {
  event: { bg: 'from-violet-500/10 to-purple-500/5', iconBg: 'bg-violet-500/20 group-hover:bg-violet-500/30' },
  restaurant: { bg: 'from-orange-500/10 to-amber-500/5', iconBg: 'bg-orange-500/20 group-hover:bg-orange-500/30' },
  warehouse: { bg: 'from-slate-500/10 to-gray-500/5', iconBg: 'bg-slate-500/20 group-hover:bg-slate-500/30' },
  retail: { bg: 'from-pink-500/10 to-rose-500/5', iconBg: 'bg-pink-500/20 group-hover:bg-pink-500/30' },
  promotion: { bg: 'from-cyan-500/10 to-teal-500/5', iconBg: 'bg-cyan-500/20 group-hover:bg-cyan-500/30' },
  delivery: { bg: 'from-blue-500/10 to-indigo-500/5', iconBg: 'bg-blue-500/20 group-hover:bg-blue-500/30' },
  cleaning: { bg: 'from-emerald-500/10 to-green-500/5', iconBg: 'bg-emerald-500/20 group-hover:bg-emerald-500/30' },
  festival: { bg: 'from-yellow-500/10 to-amber-500/5', iconBg: 'bg-yellow-500/20 group-hover:bg-yellow-500/30' },
  other: { bg: 'from-gray-500/10 to-slate-500/5', iconBg: 'bg-gray-500/20 group-hover:bg-gray-500/30' },
};

const categoryIconColors: Record<JobCategory, string> = {
  event: 'text-violet-600 dark:text-violet-400',
  restaurant: 'text-orange-600 dark:text-orange-400',
  warehouse: 'text-slate-600 dark:text-slate-400',
  retail: 'text-pink-600 dark:text-pink-400',
  promotion: 'text-cyan-600 dark:text-cyan-400',
  delivery: 'text-blue-600 dark:text-blue-400',
  cleaning: 'text-emerald-600 dark:text-emerald-400',
  festival: 'text-yellow-600 dark:text-yellow-400',
  other: 'text-gray-600 dark:text-gray-400',
};

interface CategoryGridProps {
  onCategorySelect: (category: JobCategory) => void;
  selectedCategory?: JobCategory | null;
}

export function CategoryGrid({ onCategorySelect, selectedCategory }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {JOB_CATEGORIES.map((category, index) => {
        const IconComponent = iconMap[category.icon as keyof typeof iconMap];
        const isSelected = selectedCategory === category.value;
        const colors = categoryColors[category.value];
        const iconColor = categoryIconColors[category.value];

        return (
          <button
            key={category.value}
            onClick={() => onCategorySelect(category.value)}
            className={cn(
              "group relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 animate-fade-in overflow-hidden",
              isSelected
                ? "bg-primary border-primary text-primary-foreground shadow-lg scale-[1.02]"
                : "bg-card border-border hover:border-primary/50 hover:shadow-lg hover:scale-[1.02]"
            )}
            style={{
              animationDelay: `${index * 60}ms`,
            }}
          >
            {/* Background gradient */}
            {!isSelected && (
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                colors.bg
              )} />
            )}

            {/* Icon container */}
            <div
              className={cn(
                "relative flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300",
                isSelected
                  ? "bg-primary-foreground/20"
                  : colors.iconBg
              )}
            >
              <IconComponent
                className={cn(
                  "h-8 w-8 transition-all duration-300",
                  isSelected 
                    ? "text-primary-foreground" 
                    : iconColor
                )}
              />
            </div>

            {/* Label */}
            <span
              className={cn(
                "relative text-sm font-semibold text-center transition-colors",
                isSelected ? "text-primary-foreground" : "text-foreground"
              )}
            >
              {category.label}
            </span>

            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-primary-foreground animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
}
