import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Briefcase, Eye, Users, Edit, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { JobCard } from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJobs } from '@/context/JobContext';
import { useAuth } from '@/context/AuthContext';

export default function MyAds() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { jobs, getJobsByEmployer } = useJobs();

  if (!isAuthenticated || user?.role !== 'employer') {
    navigate('/login');
    return null;
  }

  const myJobs = getJobsByEmployer(user.id);
  const activeJobs = myJobs.filter(job => job.status === 'active');
  const completedJobs = myJobs.filter(job => job.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ChatSidebar />

      <main className="py-8">
        <div className="container-custom">
          {/* Back button */}
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Profilə qayıt</span>
          </Link>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Elanlarım</h1>
              <p className="text-muted-foreground">
                Ümumi {myJobs.length} elan, {activeJobs.length} aktiv
              </p>
            </div>
            <Link to="/create-job">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Yeni elan yarat
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-3">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{myJobs.length}</p>
              <p className="text-sm text-muted-foreground">Ümumi elan</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 mx-auto mb-3">
                <Eye className="h-6 w-6 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">{activeJobs.length}</p>
              <p className="text-sm text-muted-foreground">Aktiv elan</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent mx-auto mb-3">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {myJobs.reduce((acc, job) => acc + (job.applicants?.length || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Müraciətlər</p>
            </div>
          </div>

          {/* Active Jobs */}
          {activeJobs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                Aktiv elanlar
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeJobs.map((job, index) => (
                  <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <JobCard job={job} showApplyButton={false} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Jobs */}
          {completedJobs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                Tamamlanmış elanlar
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedJobs.map((job, index) => (
                  <div key={job.id} className="animate-fade-in opacity-70" style={{ animationDelay: `${index * 50}ms` }}>
                    <JobCard job={job} showApplyButton={false} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {myJobs.length === 0 && (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <Briefcase className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Hələ elan yoxdur</h3>
              <p className="text-muted-foreground mb-6">İlk elanınızı yaradın və işçi tapmağa başlayın</p>
              <Link to="/create-job">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni elan yarat
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
