import React from 'react';
import { Sparkles, CalendarCheck, ShieldCheck, HeartPulse, ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  activeTab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
  onBackToHome?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  onBackToHome,
}) => {
  return (
    <div className="min-h-screen w-full bg-dental-bg flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-dental-border bg-white shadow-soft-card grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* ==================== LEFT AREA: FORM & AUTH TABS ==================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Mobile / Header Brand Identity */}
            <div className="flex items-center justify-between gap-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-dental-mint flex items-center justify-center text-dental-accent shadow-sm">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 5 2.5 7.5C7.5 18 8 22 10 22s2.5-2.5 2.5-4c0-1.5-.5-3-.5-4s1-2 2-2 2 1 2 2-.5 2.5-.5 4c0 1.5.5 4 2.5 4s2.5-4 3.5-6.5C21.5 13 23 11 23 8c0-3.5-3.5-6-8-6-1.5 0-2.5.5-3 1-.5-.5-1.5-1-3-1z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-base font-bold text-dental-text tracking-tight">
                    Nha Khoa Nụ Cười Xanh
                  </h1>
                  <p className="text-xs text-dental-muted">
                    Hệ thống quản lý lộ trình điều trị & lịch khám
                  </p>
                </div>
              </div>

              {onBackToHome && (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="px-3 py-1.5 rounded-xl border border-dental-border bg-dental-bg hover:bg-dental-mint/30 text-xs font-semibold text-dental-text transition-colors flex items-center gap-1.5 shrink-0"
                  title="Quay lại trang chủ"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-dental-accent" />
                  <span>Trang chủ</span>
                </button>
              )}
            </div>

            {/* Auth Navigation Tabs */}
            <div className="flex p-1 mb-8 rounded-xl bg-dental-bg border border-dental-border/80 max-w-xs">
              <button
                type="button"
                onClick={() => onTabChange('login')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                  activeTab === 'login'
                    ? 'bg-white text-dental-text shadow-sm'
                    : 'text-dental-muted hover:text-dental-text'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => onTabChange('register')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                  activeTab === 'register'
                    ? 'bg-white text-dental-text shadow-sm'
                    : 'text-dental-muted hover:text-dental-text'
                }`}
              >
                Đăng ký bệnh nhân
              </button>
            </div>

            {/* Dynamic Form Content */}
            <div className="transition-opacity duration-200">
              {children}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-dental-border/60 text-center lg:text-left text-xs text-dental-muted flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>© 2026 Nha Khoa Nụ Cười Xanh. Hệ thống quản lý phòng khám nha khoa.</span>
            <span className="inline-flex items-center gap-1 text-dental-accent font-medium">
              <ShieldCheck className="h-3.5 w-3.5" /> Xác thực phiên làm việc chuẩn hóa
            </span>
          </div>
        </div>

        {/* ==================== RIGHT AREA: BRAND SHOWCASE ==================== */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#DCEFEB]/60 via-[#EBF7F4] to-[#F8FBFA] p-10 flex-col justify-between border-l border-dental-border relative overflow-hidden">
          {/* Subtle decorative background circles */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/40 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-dental-mint/60 blur-xl pointer-events-none" />

          {/* Brand Tagline & Heading */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-dental-accent/30 text-xs font-semibold text-dental-accent mb-6 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-dental-accent" /> Chuyên sâu & Cá nhân hóa
            </span>
            <h2 className="text-2xl font-bold text-dental-text leading-tight mb-3">
              Quản lý lộ trình điều trị nhiều buổi chuyên nghiệp
            </h2>
            <p className="text-xs text-dental-muted leading-relaxed">
              Theo dõi phác đồ niềng răng, cấy ghép implant và điều trị tủy từ lúc bắt đầu đến khi hoàn thành với độ chính xác lâm sàng cao.
            </p>
          </div>

          {/* 3 Core Value Pillars */}
          <div className="space-y-4 my-8 relative z-10">
            <div className="p-4 rounded-2xl bg-white/80 border border-white/60 shadow-sm flex items-start gap-3.5 transition-transform hover:translate-x-1 duration-150">
              <div className="h-9 w-9 rounded-xl bg-dental-accent/15 flex items-center justify-center text-dental-accent shrink-0">
                <HeartPulse className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-dental-text">Phác đồ chuẩn hóa theo mẫu</h3>
                <p className="text-[11px] text-dental-muted mt-0.5 leading-relaxed">
                  Thiết lập từ mẫu cố định kết hợp tùy biến thêm, sửa và bỏ buổi linh hoạt theo từng bệnh nhân.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-white/60 shadow-sm flex items-start gap-3.5 transition-transform hover:translate-x-1 duration-150">
              <div className="h-9 w-9 rounded-xl bg-dental-accent/15 flex items-center justify-center text-dental-accent shrink-0">
                <CalendarCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-dental-text">Đồng bộ lịch khám thông minh</h3>
                <p className="text-[11px] text-dental-muted mt-0.5 leading-relaxed">
                  Tự động chuyển trạng thái buổi điều trị khi bác sĩ bắt đầu khám hoặc hoàn thành lịch hẹn.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial / Credibility badge */}
          <div className="p-4 rounded-2xl bg-dental-accent/10 border border-dental-accent/20 relative z-10">
            <p className="text-xs text-dental-text italic leading-snug">
              &quot;Hệ thống số hóa giúp bệnh nhân an tâm theo dõi từng buổi điều trị và nắm rõ tiến độ phục hồi.&quot;
            </p>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-dental-muted">
              <span className="font-semibold text-dental-text">Khoa Chỉnh nha & Phục hình</span>
              <span>Phiên bản 2.1</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

