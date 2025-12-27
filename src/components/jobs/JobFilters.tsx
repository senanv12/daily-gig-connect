import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JOB_CATEGORIES, JobCategory } from '@/types';
import { cn } from '@/lib/utils';

interface JobFiltersProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: JobCategory | null) => void;
  selectedCategory: JobCategory | null;
}

export function JobFilters({ onSearch, onCategoryFilter, selectedCategory }: JobFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="İş elanı axtar..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 h-12 bg-card border-border"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-12 w-12 shrink-0",
            showFilters && "bg-primary text-primary-foreground border-primary"
          )}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Category Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className={cn(
              "cursor-pointer px-4 py-2 text-sm transition-all",
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "hover:border-primary hover:text-primary"
            )}
            onClick={() => onCategoryFilter(null)}
          >
            Hamısı
          </Badge>
          {JOB_CATEGORIES.map((category) => (
            <Badge
              key={category.value}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer px-4 py-2 text-sm transition-all",
                selectedCategory === category.value
                  ? "bg-primary text-primary-foreground"
                  : "hover:border-primary hover:text-primary"
              )}
              onClick={() => onCategoryFilter(category.value)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
