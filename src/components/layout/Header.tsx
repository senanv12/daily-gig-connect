import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Menu, X, Plus, FileText, Home, Briefcase, Grid, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Dock } from '@/components/ui/dock-two';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isEmployer = user?.role === 'employer';

  // Handle smooth scroll for hash links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    const isHashLink = to.includes('#');
    const isCurrentPage = location.pathname === '/' || to.startsWith('/#');
    
    if (isHashLink && isCurrentPage) {
      e.preventDefault();
      const hash = to.split('#')[1];
      const element = document.getElementById(hash);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      // Update URL without navigation
      window.history.pushState(null, '', to);
    }
    
    setMobileMenuOpen(false);
  };

  // Handle hash on page load
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  const dockItems = [
    { icon: Home, label: 'Ana Səhifə', href: '/' },
    { icon: Briefcase, label: 'İş Elanları', href: '/jobs' },
    { icon: Grid, label: 'Kateqoriyalar', href: '/#categories' },
    { icon: Mail, label: 'Əlaqə', href: '/#contact' },
  ];

  const navLinks = [
    { to: '/', label: 'Ana Səhifə', isPage: true },
    { to: '/jobs', label: 'İş Elanları', isPage: true },
    { to: '/#categories', label: 'Kateqoriyalar', isPage: false },
    { to: '/#contact', label: 'Əlaqə', isPage: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-amber-dark text-primary-foreground font-bold text-xl transition-transform group-hover:scale-105 shadow-md">
              L
            </div>
            <span className="text-xl font-bold text-foreground">
              Lavor<span className="text-primary">.az</span>
            </span>
          </Link>

          {/* Desktop Navigation - Dock */}
          <div className="hidden md:block">
            <Dock items={dockItems} />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                {isEmployer && (
                  <Link to="/create-job">
                    <Button size="sm" className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-1.5">
                      <Plus className="h-4 w-4" />
                      Yeni elan
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-3 rounded-xl hover:bg-muted">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary font-medium">
                        {user?.name.charAt(0)}
                      </div>
                      <span className="hidden sm:inline font-medium">
                        {user?.name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card border-border rounded-xl">
                    <div className="px-3 py-2">
                      <p className="font-medium">{user?.name} {user?.surname}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 cursor-pointer rounded-lg">
                        <User className="h-4 w-4" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    {isEmployer && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/my-ads" className="flex items-center gap-2 cursor-pointer rounded-lg">
                            <FileText className="h-4 w-4" />
                            Elanlarım
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/create-job" className="flex items-center gap-2 cursor-pointer rounded-lg">
                            <Plus className="h-4 w-4" />
                            Yeni elan
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive cursor-pointer rounded-lg"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Çıxış
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="hidden sm:flex rounded-xl">
                    Daxil ol
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                    Qeydiyyat
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                link.isPage ? (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-4 py-3 text-foreground hover:bg-muted rounded-xl transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.to}
                    href={link.to}
                    onClick={(e) => handleNavClick(e, link.to)}
                    className="px-4 py-3 text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                )
              ))}
              {isEmployer && (
                <>
                  <Link
                    to="/my-ads"
                    className="px-4 py-3 text-foreground hover:bg-muted rounded-xl transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileText className="h-4 w-4" />
                    Elanlarım
                  </Link>
                  <Link
                    to="/create-job"
                    className="px-4 py-3 text-primary font-medium hover:bg-primary/10 rounded-xl transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Plus className="h-4 w-4" />
                    Yeni elan yarat
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
