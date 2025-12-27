import { Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PointsDisplayProps {
  points: number;
  className?: string;
}

export function PointsDisplay({ points, className }: PointsDisplayProps) {
  const level = Math.floor(points / 100) + 1;
  const progress = points % 100;

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl p-6 space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Xallarınız</p>
            <p className="text-2xl font-bold text-foreground">{points}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Səviyyə</p>
          <p className="text-2xl font-bold text-primary">{level}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Növbəti səviyyəyə</span>
          <span className="text-foreground font-medium">{100 - progress} xal</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4 text-success" />
        <span>Hər iş üçün +10 xal qazanırsınız</span>
      </div>
    </div>
  );
}
