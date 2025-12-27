import { MapPin, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Job, JOB_CATEGORIES } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  showApplyButton?: boolean;
}

export function JobCard({ job, onApply, showApplyButton = true }: JobCardProps) {
  const category = JOB_CATEGORIES.find((c) => c.value === job.category);

  return (
    <div className="group bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-card-hover hover:border-primary/30">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {category?.label || 'Digər'}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                job.status === 'active' && 'border-success text-success',
                job.status === 'filled' && 'border-amber text-amber',
                job.status === 'completed' && 'border-muted-foreground text-muted-foreground'
              )}
            >
              {job.status === 'active' ? 'Aktiv' : job.status === 'filled' ? 'Dolu' : 'Tamamlandı'}
            </Badge>
          </div>
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
            {job.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{job.employerName}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-primary">{job.salary}₼</p>
          <p className="text-xs text-muted-foreground">
            {job.salaryType === 'hourly' ? 'saatlıq' : 'günlük'}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{job.description}</p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{new Date(job.date).toLocaleDateString('az-AZ')}</span>
        </div>
        {job.startTime && job.endTime && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <span>{job.startTime} - {job.endTime}</span>
          </div>
        )}
      </div>

      {showApplyButton && job.status === 'active' && (
        <Button
          onClick={() => onApply?.(job.id)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group/btn"
        >
          Müraciət et
          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      )}
    </div>
  );
}
