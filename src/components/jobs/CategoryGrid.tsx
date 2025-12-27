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
} from 'lucide-react';
import { JOB_CATEGORIES, JobCategory } from '@/types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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

interface CategoryGridProps {
  onCategorySelect: (category: JobCategory) => void;
  selectedCategory?: JobCategory | null;
}

export function CategoryGrid({ onCategorySelect, selectedCategory }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {JOB_CATEGORIES.map((category, index) => {
        const IconComponent = iconMap[category.icon as keyof typeof iconMap];
        const isSelected = selectedCategory === category.value;

        return (
          <button
            key={category.value}
            onClick={() => onCategorySelect(category.value)}
            className={cn(
              "group flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300",
              isSelected
                ? "bg-primary border-primary text-primary-foreground shadow-lg"
                : "bg-card border-border hover:border-primary hover:shadow-card-hover"
            )}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300",
                isSelected
                  ? "bg-primary-foreground/20"
                  : "bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110"
              )}
            >
              <IconComponent
                className={cn(
                  "h-7 w-7 transition-colors",
                  isSelected ? "text-primary-foreground" : "text-primary"
                )}
              />
            </div>
            <span
              className={cn(
                "text-sm font-medium text-center transition-colors",
                isSelected ? "text-primary-foreground" : "text-foreground"
              )}
            >
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
