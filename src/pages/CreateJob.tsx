import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Calendar, Clock, DollarSign, FileText, Tag } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { JobCategory } from '@/types';

const categories: { value: JobCategory; label: string }[] = [
  { value: 'event', label: 'Tədbir' },
  { value: 'restaurant', label: 'Restoran' },
  { value: 'warehouse', label: 'Anbar' },
  { value: 'promotion', label: 'Reklam' },
  { value: 'festival', label: 'Festival' },
  { value: 'retail', label: 'Satış' },
  { value: 'delivery', label: 'Çatdırılma' },
  { value: 'other', label: 'Digər' },
];

export default function CreateJob() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    salaryType: 'daily',
    category: '' as JobCategory | '',
    date: '',
    startTime: '',
    endTime: '',
    requirements: '',
    workersNeeded: '1',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated || user?.role !== 'employer') {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location || !formData.salary || !formData.category) {
      toast({
        title: 'Xəta',
        description: 'Zəhmət olmasa bütün məcburi sahələri doldurun.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Elan yaradıldı!',
      description: 'Yeni iş elanınız uğurla dərc edildi.',
    });

    setIsSubmitting(false);
    navigate('/');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Yeni iş elanı</h1>
              </div>
              <p className="text-muted-foreground">
                İşçi tapmaq üçün elanınızı yaradın. Bütün məlumatları dəqiq doldurun.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Əsas məlumatlar
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      İşin adı *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Məs: Tədbir köməkçisi, Ofisiant"
                      className="bg-background h-12"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Təsvir *
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="İş haqqında ətraflı məlumat verin..."
                      rows={4}
                      className="bg-background resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Tələblər
                    </label>
                    <Textarea
                      value={formData.requirements}
                      onChange={(e) => handleChange('requirements', e.target.value)}
                      placeholder="İşçidən tələb olunan keyfiyyətlər..."
                      rows={3}
                      className="bg-background resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Location */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  Kateqoriya və yer
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Kateqoriya *
                    </label>
                    <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                      <SelectTrigger className="bg-background h-12">
                        <SelectValue placeholder="Kateqoriya seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Ünvan *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        placeholder="Bakı, Nəsimi rayonu"
                        className="bg-background h-12 pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Time & Date */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Vaxt və tarix
                </h2>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Tarix
                    </label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="bg-background h-12"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Başlama saatı
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleChange('startTime', e.target.value)}
                        className="bg-background h-12 pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Bitmə saatı
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleChange('endTime', e.target.value)}
                        className="bg-background h-12 pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Ödəniş
                </h2>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Maaş *
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={formData.salary}
                        onChange={(e) => handleChange('salary', e.target.value)}
                        placeholder="50"
                        className="bg-background h-12 pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        AZN
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Ödəniş tipi
                    </label>
                    <Select value={formData.salaryType} onValueChange={(v) => handleChange('salaryType', v)}>
                      <SelectTrigger className="bg-background h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Saatlıq</SelectItem>
                        <SelectItem value="daily">Günlük</SelectItem>
                        <SelectItem value="fixed">Sabit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      İşçi sayı
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.workersNeeded}
                      onChange={(e) => handleChange('workersNeeded', e.target.value)}
                      className="bg-background h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1 h-12 border-2"
                >
                  Ləğv et
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? 'Yaradılır...' : 'Elan yarat'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}