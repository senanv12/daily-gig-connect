import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: 'Xoş gəldiniz!',
          description: 'Uğurla daxil oldunuz.',
        });
        navigate('/');
      } else {
        toast({
          title: 'Xəta',
          description: 'E-mail və ya şifrə yanlışdır.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Xəta',
        description: 'Daxil olma zamanı xəta baş verdi.',
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
        <div className="w-full max-w-md animate-fade-in">
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

          <div className="bg-card border border-border rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-foreground text-center mb-2">Xoş gəldiniz</h1>
            <p className="text-muted-foreground text-center mb-8">
              Hesabınıza daxil olun
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
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
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrənizi daxil edin"
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

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Şifrəni unutdunuz?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-lg"
              >
                {isLoading ? 'Gözləyin...' : 'Daxil ol'}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-muted rounded-xl">
              <p className="text-xs text-muted-foreground text-center mb-2">Demo hesablar:</p>
              <div className="text-xs text-center space-y-1">
                <p><span className="font-medium">İşçi:</span> isci@test.com / test123</p>
                <p><span className="font-medium">İşverən:</span> isveren@test.com / test123</p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Hesabınız yoxdur?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Qeydiyyatdan keçin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
