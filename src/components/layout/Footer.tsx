import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
                L
              </div>
              <span className="text-xl font-bold">
                Lavor<span className="text-primary">.az</span>
              </span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Müvəqqəti və gündəlik işlərlə bağlı işçi və işəgötürənləri bir platformada birləşdirən xidmət.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Keçidlər</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Ana Səhifə
                </Link>
              </li>
              <li>
                <Link to="/#jobs" className="text-background/70 hover:text-primary transition-colors text-sm">
                  İş Elanları
                </Link>
              </li>
              <li>
                <Link to="/#categories" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Kateqoriyalar
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Qeydiyyat
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Əlaqə</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="h-4 w-4 text-primary" />
                info@lavor.az
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="h-4 w-4 text-primary" />
                +994 12 345 67 89
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <MapPin className="h-4 w-4 text-primary" />
                Bakı, Azərbaycan
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Xəbərlər</h4>
            <p className="text-background/70 text-sm mb-4">
              Yeni iş elanlarından xəbərdar olmaq üçün abunə olun.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="E-mail ünvanınız"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
              />
              <Button size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 text-center text-sm text-background/50">
          © {new Date().getFullYear()} Lavor.az. Bütün hüquqlar qorunur.
        </div>
      </div>
    </footer>
  );
}
