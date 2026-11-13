import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, HeartPulse, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import type { AuthSession } from '@/types/auth';

interface HeroSectionProps {
  session: AuthSession;
  onOpenAuth: (tab: 'login' | 'register') => void;
  onOpenDashboard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  session,
  onOpenAuth,
  onOpenDashboard,
}) => {
  const isLoggedIn = session.isAuthenticated && session.user !== null;

  const handlePrimaryCTA = () => {
    if (isLoggedIn) {
      onOpenDashboard();
    } else {
      onOpenAuth('register');
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-b from-[#EBF7F4]/80 via-[#F8FBFA] to-[#F8FBFA]">
      
      {/* ==================== 1. SOFT AMBIENT GLOW & LIGHT SPOTS ==================== */}
      {/* Top Center Mint Radiance */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] lg:w-[900px] h-[400px] bg-gradient-to-b from-[#DCEFEB]/80 via-dental-mint/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      {/* Bottom Right Soft Glow Spot */}
      <div
        className="absolute -bottom-24 right-0 w-[600px] h-[500px] bg-gradient-to-tl from-[#DCEFEB]/70 via-[#EBF7F4]/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      {/* Left Behind Heading Glow Spot */}
      <div
        className="absolute top-24 -left-20 w-[480px] h-[380px] bg-dental-mint/40 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Subtle Digital Medical Dot Grid Pattern (Ultra-soft depth) */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#70B8AC_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.04] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* ==================== 2. BLENDED MEDICAL PHOTOGRAPHY BACKGROUND DECOR ==================== */}
      {/*
        LỚP 1: Bác sĩ chuyên khoa Răng Hàm Mặt mép trái - trên (chuẩn theo phong cách ảnh mẫu tham khảo).
        Hiển thị rõ ràng (opacity 42% - 50%), mask radial-gradient chuyển dần về trong suốt.
      */}
      <div
        className="hidden md:block absolute top-16 -left-12 lg:-left-6 w-[380px] lg:w-[480px] h-[520px] lg:h-[620px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 25% 40%, black 30%, rgba(0,0,0,0.6) 60%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 25% 40%, black 30%, rgba(0,0,0,0.6) 60%, transparent 88%)',
        }}
      >
        <img
          src="/backgrounds/bg-doctor-team.jpg"
          alt=""
          className="w-full h-full object-cover object-top filter blur-[0.5px] opacity-[0.40] lg:opacity-[0.48]"
          loading="eager"
        />
      </div>

      {/*
        LỚP 2: Bệnh nhân mỉm cười tự nhiên trên ghế nha khoa ở mép phải - trên (chuẩn theo ảnh mẫu).
        Hiển thị rõ ràng (opacity 42% - 50%), mask mềm mại hòa tan vào nền kem bạc hà.
      */}
      <div
        className="hidden md:block absolute top-14 -right-12 lg:-right-6 w-[420px] lg:w-[540px] h-[520px] lg:h-[620px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 75% 40%, black 30%, rgba(0,0,0,0.6) 60%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 75% 40%, black 30%, rgba(0,0,0,0.6) 60%, transparent 88%)',
        }}
      >
        <img
          src="/backgrounds/bg-patient-chair.jpg"
          alt=""
          className="w-full h-full object-cover object-center filter blur-[0.5px] opacity-[0.40] lg:opacity-[0.48]"
          loading="eager"
        />
      </div>

      {/*
        LỚP 3: Không gian phòng khám chuẩn vô trùng ở đáy Hero chuyển tiếp sang AboutSection.
      */}
      <div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[700px] lg:w-[980px] h-[260px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 65%, black 20%, rgba(0,0,0,0.4) 55%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 65%, black 20%, rgba(0,0,0,0.4) 55%, transparent 85%)',
        }}
      >
        <img
          src="/backgrounds/bg-clinic-room.jpg"
          alt=""
          className="w-full h-full object-cover object-center filter blur-[1px] opacity-[0.25] lg:opacity-[0.32]"
          loading="eager"
        />
      </div>

      {/* ==================== 3. FOREGROUND MAIN EDITORIAL CONTENT ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ==================== LEFT COLUMN: EDITORIAL CONTENT ==================== */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-dental-border shadow-xs text-xs font-semibold text-dental-accent">
              <Sparkles className="h-4 w-4 text-dental-accent" />
              <span>Nền tảng số hóa quản lý điều trị nha khoa</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-dental-text tracking-tight leading-[1.25] break-words max-w-2xl mx-auto lg:mx-0">
              Chăm sóc nụ cười khỏe đẹp,{' '}
              <span className="text-dental-accent">đồng hành dài lâu</span> cùng bạn
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-dental-muted leading-relaxed max-w-xl mx-auto lg:mx-0">
              Đặt lịch khám thuận tiện, tìm hiểu dịch vụ nha khoa chuyên sâu và theo dõi hành trình chăm sóc răng miệng nhiều buổi trên một nền tảng thống nhất.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                onClick={handlePrimaryCTA}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-dental-accent hover:bg-dental-accent-hover text-white text-sm font-semibold shadow-soft-float transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <Calendar className="h-4 w-4" />
                <span>{isLoggedIn ? 'Vào không gian điều trị' : 'Đặt lịch khám ngay'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#services"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/95 hover:bg-dental-mint/30 text-dental-text text-sm font-semibold border border-dental-border shadow-xs transition-colors text-center"
              >
                Tìm hiểu dịch vụ
              </a>
            </div>

            {/* 3 Core Highlight Pillars */}
            <div className="pt-6 border-t border-dental-border/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-dental-mint flex items-center justify-center text-dental-accent shrink-0 mt-0.5">
                  <HeartPulse className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dental-text">Chuẩn hóa phác đồ</h4>
                  <p className="text-[11px] text-dental-muted mt-0.5 leading-snug">
                    Lộ trình điều trị từng buổi rõ ràng, minh bạch.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-dental-mint flex items-center justify-center text-dental-accent shrink-0 mt-0.5">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dental-text">Đặt hẹn linh hoạt</h4>
                  <p className="text-[11px] text-dental-muted mt-0.5 leading-snug">
                    Chủ động chọn ngày giờ và nhận thông báo nhắc lịch.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-dental-mint flex items-center justify-center text-dental-accent shrink-0 mt-0.5">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dental-text">Chuyên môn tận tâm</h4>
                  <p className="text-[11px] text-dental-muted mt-0.5 leading-snug">
                    Bác sĩ giàu kinh nghiệm, thiết bị y tế hiện đại.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN: MAIN FOREGROUND CLINIC PHOTO CARD ==================== */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative card container with Soft Depth Border */}
              <div className="relative rounded-3xl overflow-hidden border border-dental-border/90 bg-white/95 backdrop-blur-sm p-3 shadow-soft-card">
                
                {/* Main Hero Photo */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[5/4] bg-dental-mint/30">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80"
                    alt="Bác sĩ nha khoa thăm khám và tư vấn tận tâm cho bệnh nhân"
                    fallbackTitle="Không gian phòng khám Nha Khoa Nụ Cười Xanh"
                    className="w-full h-full object-cover object-center"
                    containerClassName="w-full h-full"
                  />

                  {/* Soft Gradient Overlay for depth */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#344C52]/40 via-transparent to-transparent pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* On-image badge */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 backdrop-blur-sm border border-white/80 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-dental-mint flex items-center justify-center text-dental-accent">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-dental-text block">
                          Phòng khám vô trùng đạt chuẩn
                        </span>
                        <span className="text-[10px] text-dental-muted block">
                          Tiêu chuẩn kiểm soát nhiễm khuẩn y tế
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-dental-mint text-dental-accent">
                      Hiện đại
                    </span>
                  </div>
                </div>

                {/* Secondary small inset card */}
                <div className="mt-3 p-3.5 rounded-2xl bg-[#F8FBFA] border border-dental-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white border border-dental-border flex items-center justify-center text-dental-accent shadow-sm">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-dental-text block">
                        Lịch hẹn được điều phối khoa học
                      </span>
                      <span className="text-[11px] text-dental-muted block">
                        Hạn chế thời gian chờ đợi cho bệnh nhân
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-dental-accent">
                    08:00 - 19:30
                  </span>
                </div>

              </div>

              {/* Floating accent badge on top-right */}
              <div className="hidden sm:flex absolute -top-4 -right-4 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-sm border border-dental-border shadow-soft-card items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-dental-accent animate-pulse" />
                <span className="text-xs font-bold text-dental-text">Đang nhận lịch trực tuyến</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
