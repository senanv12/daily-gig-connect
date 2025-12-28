import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Briefcase, Star, Clock, Shield, Zap } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters } from '@/components/jobs/JobFilters';
import { CategoryGrid } from '@/components/jobs/CategoryGrid';
import { LocationMap } from '@/components/ui/expand-map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { mockJobs } from '@/data/mockJobs';
import { JobCategory, Job } from '@/types';
import { useToast } from '@/hooks/use-toast';



export default function Index() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterJobs(query, selectedCategory);
  };

  const handleCategoryFilter = (category: JobCategory | null) => {
    setSelectedCategory(category);
    filterJobs(searchQuery, category);
  };

  const filterJobs = (query: string, category: JobCategory | null) => {
    let result = mockJobs;
    if (query) {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.description.toLowerCase().includes(query.toLowerCase()) ||
          job.location.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (category) {
      result = result.filter((job) => job.category === category);
    }
    setFilteredJobs(result);
  };

  const handleApply = (jobId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Qeydiyyat tələb olunur',
        description: 'Müraciət etmək üçün daxil olun və ya qeydiyyatdan keçin.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Müraciət göndərildi!',
      description: 'İşəgötürən sizinlə əlaqə saxlayacaq.',
    });
  };

  const isEmployer = user?.role === 'employer';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ChatSidebar />

      {/* Hero Section with Map */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-light via-background to-secondary" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.08),transparent_50%)]" />
        
        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 animate-fade-in text-balance">
                Gündəlik işlər,{' '}
                <span className="text-gradient">sürətli qazanc</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in max-w-xl mx-auto lg:mx-0" style={{ animationDelay: '100ms' }}>
                Tədbirlər, festivallar, restoranlar və daha çoxu üçün işçi tap və ya iş ver. Azərbaycanın ən böyük gündəlik iş platforması.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '200ms' }}>
                <Link to={isEmployer ? "/create-job" : "/register"}>
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 h-14 w-full sm:w-auto rounded-xl shadow-lg hover:shadow-xl transition-all">
                    {isEmployer ? 'Yeni elan yarat' : 'İş tap'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/#jobs">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-14 w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl">
                    Elanlara bax
                  </Button>
                </Link>
              </div>
            </div>

            {/* Map */}
            <div className="h-[350px] lg:h-[450px] animate-fade-in" style={{ animationDelay: '300ms' }}>
              <LocationMap location="Bakı, Azərbaycan" coordinates="40.4093° N, 49.8671° E" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '5,000+', label: 'İşçi' },
              { icon: Briefcase, value: '1,200+', label: 'İş elanı' },
              { icon: Star, value: '4.8', label: 'Reytinq' },
              { icon: Clock, value: '24 saat', label: 'Dəstək' },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex justify-center mb-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-16">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">İş kateqoriyaları</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Müxtəlif sahələrdə gündəlik və qısa müddətli iş imkanları</p>
          </div>
          <CategoryGrid onCategorySelect={handleCategoryFilter} selectedCategory={selectedCategory} />
        </div>
      </section>

      {/* Jobs */}
      <section id="jobs" className="py-16 bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">Hazırki iş elanları</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Sizin üçün ən uyğun işi tapın və elə bu gün başlayın</p>
          </div>
          <div className="mb-8">
            <JobFilters onSearch={handleSearch} onCategoryFilter={handleCategoryFilter} selectedCategory={selectedCategory} />
          </div>
          {filteredJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job, index) => (
                <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <JobCard job={job} onApply={handleApply} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">Axtarışınıza uyğun iş tapılmadı.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Niyə Lavor.az?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">İşçilər və işəgötürənlər üçün ən sərfəli platforma</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Sürətli başlanğıc', description: 'Qeydiyyatdan keçin və dərhal iş axtarmağa başlayın.' },
              { icon: Shield, title: 'Etibarlı işəgötürənlər', description: 'Bütün işəgötürənlər yoxlanılır. Təhlükəsiz iş mühiti.' },
              { icon: Star, title: 'Xal və mükafatlar', description: 'Hər iş üçün xal qazanın. Streak-inizi artırın.' },
            ].map((feature, index) => (
              <div key={feature.title} className="bg-card border border-border rounded-2xl p-8 text-center transition-all hover:shadow-lg hover:border-primary/30 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex justify-center mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 bg-muted/30">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground mb-4">Bizimlə əlaqə</h2>
              <p className="text-muted-foreground">Suallarınız var? Bizə yazın.</p>
            </div>
            <form className="bg-card border border-border rounded-2xl p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Ad</label>
                  <Input placeholder="Adınız" className="bg-background h-12 rounded-xl" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">E-mail</label>
                  <Input type="email" placeholder="email@example.com" className="bg-background h-12 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Mesaj</label>
                <Textarea placeholder="Mesajınız..." rows={5} className="bg-background rounded-xl" />
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg rounded-xl">Göndər</Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}