import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, User, LogOut, Stethoscope } from 'lucide-react';
import type { AuthSession } from '@/types/auth';

interface NavbarProps {
  session: AuthSession;
  onOpenAuth: (tab: 'login' | 'register') => void;
  onOpenDashboard: () => void;
  onLogout: () => void;
}

const NAV_LINKS = [
  { label: 'Giới thiệu', href: '#about' },
  { label: 'Dịch vụ', href: '#services' },
  { label: 'Kiến thức nha khoa', href: '#knowledge' },
  { label: 'Đội ngũ bác sĩ', href: '#doctors' },
  { label: 'Quy trình', href: '#process' },
  { label: 'Đánh giá', href: '#testimonials' },
  { label: 'Hỏi đáp', href: '#faq' },
];

export const Navbar: React.FC<NavbarProps> = ({
  session,
  onOpenAuth,
  onOpenDashboard,
  onLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLoggedIn = session.isAuthenticated && session.user !== null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft-card border-b border-dental-border/80 py-3'
          : 'bg-white/80 backdrop-blur-sm border-b border-dental-border/50 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <a
            href="#"
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-dental-accent rounded-xl p-1 min-w-0 max-w-[calc(100%-52px)]"
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-dental-mint flex items-center justify-center text-dental-accent shadow-sm group-hover:bg-dental-accent group-hover:text-white transition-colors duration-200 shrink-0">
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 5 2.5 7.5C7.5 18 8 22 10 22s2.5-2.5 2.5-4c0-1.5-.5-3-.5-4s1-2 2-2 2 1 2 2-.5 2.5-.5 4c0 1.5.5 4 2.5 4s2.5-4 3.5-6.5C21.5 13 23 11 23 8c0-3.5-3.5-6-8-6-1.5 0-2.5.5-3 1-.5-.5-1.5-1-3-1z" />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-bold text-dental-text tracking-tight block truncate">
                Nha Khoa Nụ Cười Xanh
              </span>
              <span className="text-[10px] sm:text-[11px] text-dental-muted block -mt-0.5 truncate">
                Chăm sóc & Phục hình nụ cười
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-7 text-xs font-semibold text-dental-text/80">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-dental-accent transition-colors duration-150 py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dental-mint/70 border border-dental-accent/30 text-xs font-semibold text-dental-text hover:bg-dental-mint transition-colors"
                >
                  {session.user?.vaiTro === 'BAC_SI' ? (
                    <Stethoscope className="h-4 w-4 text-dental-accent" />
                  ) : (
                    <User className="h-4 w-4 text-dental-accent" />
                  )}
                  <span>{session.user?.tenDangNhap}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-dental-accent font-bold">
                    {session.user?.vaiTro === 'BAC_SI'
                      ? 'Bác sĩ'
                      : session.user?.vaiTro === 'CHU_PHONG_KHAM'
                      ? 'Quản trị'
                      : 'Bệnh nhân'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  title="Đăng xuất"
                  aria-label="Đăng xuất khỏi hệ thống"
                  className="p-2 rounded-xl border border-dental-border hover:bg-dental-error-bg hover:text-dental-error text-dental-muted transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-dental-text border border-dental-border hover:border-dental-accent hover:text-dental-accent bg-white transition-all duration-150"
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-dental-accent hover:bg-dental-accent-hover shadow-sm transition-all duration-150 flex items-center gap-1.5"
                >
                  <span>Đăng ký bệnh nhân</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2 shrink-0">
            {isLoggedIn && (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="p-2 rounded-xl bg-dental-mint text-dental-accent"
                aria-label="Mở không gian làm việc"
              >
                <User className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-dental-border text-dental-text hover:bg-dental-bg transition-colors"
              aria-label="Bật/Tắt thanh điều hướng"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden pt-4 pb-6 border-t border-dental-border/60 mt-3 space-y-4 animate-in fade-in duration-200">
            <nav className="flex flex-col space-y-2.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-dental-text hover:bg-dental-mint/40 hover:text-dental-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-dental-border/50 flex flex-col gap-2.5">
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDashboard();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-dental-accent flex items-center justify-center gap-2"
                  >
                    <span>Vào không gian làm việc ({session.user?.tenDangNhap})</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-dental-error border border-dental-error/30 hover:bg-dental-error-bg flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold text-center border border-dental-border bg-white text-dental-text hover:border-dental-accent"
                  >
                    Đăng nhập
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('register');
                    }}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold text-center bg-dental-accent text-white hover:bg-dental-accent-hover shadow-sm"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

