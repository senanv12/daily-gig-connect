import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, Calendar, ArrowUpDown, Grid, List } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { JobCard } from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useJobs } from '@/context/JobContext';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { JOB_CATEGORIES, JobCategory } from '@/types';
import { cn } from '@/lib/utils';

type SortOption = 'newest' | 'salary-high' | 'salary-low' | 'date';

export default function Jobs() {
  const { jobs } = useJobs();
  const { sendApplicationMessage } = useChat();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(null);
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.employerName.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(job => job.category === selectedCategory);
    }

    // Location filter
    if (locationFilter) {
      const location = locationFilter.toLowerCase();
      result = result.filter(job => job.location.toLowerCase().includes(location));
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'salary-high':
        result.sort((a, b) => b.salary - a.salary);
        break;
      case 'salary-low':
        result.sort((a, b) => a.salary - b.salary);
        break;
      case 'date':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
    }

    return result;
  }, [jobs, searchQuery, selectedCategory, locationFilter, sortBy]);

  const handleApply = (jobId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Qeydiyyat tələb olunur',
        description: 'Müraciət etmək üçün daxil olun və ya qeydiyyatdan keçin.',
        variant: 'destructive',
      });
      return;
    }

    const job = jobs.find(j => j.id === jobId);
    if (job) {
      sendApplicationMessage(job.employerId, job.employerName, job.title);
      toast({
        title: 'Müraciət göndərildi!',
        description: 'İşəgötürənə mesaj göndərildi.',
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setLocationFilter('');
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || selectedCategory || locationFilter;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ChatSidebar />

      <main className="py-8">
        <div className="container-custom">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">İş elanları</h1>
            <p className="text-muted-foreground">
              {filteredAndSortedJobs.length} aktiv elan tapıldı
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-card border border-border rounded-2xl p-4 mb-8">
            {/* Main Search Row */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="İş adı, şirkət və ya açar söz..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-background"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Location Input */}
              <div className="relative md:w-64">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Məkan..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-12 h-12 bg-background"
                />
              </div>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="h-12 md:w-48 bg-background">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Ən yeni</SelectItem>
                  <SelectItem value="salary-high">Maaş (yüksək)</SelectItem>
                  <SelectItem value="salary-low">Maaş (aşağı)</SelectItem>
                  <SelectItem value="date">Tarix</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "h-12 px-4",
                  showFilters && "bg-primary text-primary-foreground border-primary"
                )}
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filtrlər
              </Button>
            </div>

            {/* Category Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                <p className="text-sm font-medium text-muted-foreground mb-3">Kateqoriyalar</p>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedCategory === null ? 'default' : 'outline'}
                    className={cn(
                      "cursor-pointer px-4 py-2 text-sm transition-all",
                      selectedCategory === null
                        ? "bg-primary text-primary-foreground"
                        : "hover:border-primary hover:text-primary"
                    )}
                    onClick={() => setSelectedCategory(null)}
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
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Aktiv filtrlər:</span>
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-1">
                      "{searchQuery}"
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="secondary" className="gap-1">
                      {JOB_CATEGORIES.find(c => c.value === selectedCategory)?.label}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory(null)} />
                    </Badge>
                  )}
                  {locationFilter && (
                    <Badge variant="secondary" className="gap-1">
                      {locationFilter}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setLocationFilter('')} />
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Hamısını təmizlə
                </Button>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedJobs.length} nəticə
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-9 w-9"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="h-9 w-9"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Job Grid/List */}
          {filteredAndSortedJobs.length > 0 ? (
            <div className={cn(
              viewMode === 'grid' 
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            )}>
              {filteredAndSortedJobs.map((job, index) => (
                <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <JobCard job={job} onApply={handleApply} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Heç bir elan tapılmadı</h3>
              <p className="text-muted-foreground mb-6">Axtarış kriteriyalarınızı dəyişdirməyə çalışın</p>
              <Button onClick={clearFilters} variant="outline">
                Filtrləri təmizlə
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
