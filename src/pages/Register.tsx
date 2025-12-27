import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building2, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('form');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Xəta',
        description: 'Şifrələr uyğun gəlmir.',
        variant: 'destructive',
      });
      return;
    }
    
    if (formData.password.length < 6) {
      toast({
        title: 'Xəta',
        description: 'Şifrə ən azı 6 simvol olmalıdır.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await register({
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        name: formData.name,
        surname: formData.surname,
        role: selectedRole!,
      });
      
      if (success) {
        toast({
          title: 'Uğurlu qeydiyyat!',
          description: 'Hesabınız yaradıldı.',
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Xəta',
        description: 'Qeydiyyat zamanı xəta baş verdi.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-light via-background to-secondary flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Geri</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-2xl">
                L
              </div>
              <span className="text-2xl font-bold text-foreground">
                Lavor<span className="text-primary">.az</span>
              </span>
            </Link>
          </div>

          {step === 'role' ? (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-foreground text-center mb-2">Qeydiyyat</h1>
              <p className="text-muted-foreground text-center mb-8">
                Necə qeydiyyatdan keçmək istəyirsiniz?
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelect('worker')}
                  className="group bg-card border-2 border-border hover:border-primary rounded-2xl p-8 text-center transition-all hover:shadow-card-hover"
                >
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">İşçi olaraq</h3>
                  <p className="text-sm text-muted-foreground">
                    Gündəlik və qısa müddətli işlər tapın
                  </p>
                </button>

                <button
                  onClick={() => handleRoleSelect('employer')}
                  className="group bg-card border-2 border-border hover:border-primary rounded-2xl p-8 text-center transition-all hover:shadow-card-hover"
                >
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">İşəgötürən olaraq</h3>
                  <p className="text-sm text-muted-foreground">
                    İş elanları verin və işçi tapın
                  </p>
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-8">
                Artıq hesabınız var?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Daxil olun
                </Link>
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <button
                onClick={() => setStep('role')}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Rol seçiminə qayıt</span>
              </button>

              <h1 className="text-2xl font-bold text-foreground mb-2">
                {selectedRole === 'worker' ? 'İşçi qeydiyyatı' : 'İşəgötürən qeydiyyatı'}
              </h1>
              <p className="text-muted-foreground mb-8">
                Məlumatlarınızı daxil edin
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Ad</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Adınız"
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Soyad</label>
                    <Input
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      placeholder="Soyadınız"
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      required
                      className="h-12 pl-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Telefon</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+994 50 123 45 67"
                      required
                      className="h-12 pl-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Şifrə</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Ən azı 6 simvol"
                      required
                      className="h-12 pl-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Şifrəni təsdiqlə
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Şifrəni yenidən daxil edin"
                      required
                      className="h-12 pl-12"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-lg"
                >
                  {isLoading ? 'Gözləyin...' : 'Qeydiyyatdan keç'}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Artıq hesabınız var?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Daxil olun
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
