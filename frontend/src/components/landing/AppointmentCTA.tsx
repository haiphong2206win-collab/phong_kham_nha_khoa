import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import type { AuthSession } from '@/types/auth';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface AppointmentCTAProps {
  session: AuthSession;
  onOpenAuth: (tab: 'login' | 'register') => void;
  onOpenDashboard: () => void;
}

export const AppointmentCTA: React.FC<AppointmentCTAProps> = ({
  session,
  onOpenAuth,
  onOpenDashboard,
}) => {
  const isLoggedIn = session.isAuthenticated && session.user !== null;
  const sectionRef = useScrollReveal<HTMLElement>();

  const handleAction = () => {
    if (isLoggedIn) {
      onOpenDashboard();
    } else {
      onOpenAuth('register');
    }
  };

  return (
    <section ref={sectionRef} className="relative py-20 bg-gradient-to-b from-white via-dental-bg to-dental-bg overflow-hidden">
      {/* Background Decor 1: Dental Clinic Chair Ambient Art right side */}
      <div
        className="hidden md:block absolute -bottom-10 right-0 w-[460px] lg:w-[580px] h-[380px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 80% 65%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 80% 65%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
        }}
      >
        <img
          src="/backgrounds/bg-patient-chair.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-[0.5px] opacity-[0.34] lg:opacity-[0.42]"
          loading="lazy"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#70B8AC] via-[#5CA598] to-[#344C52] p-8 sm:p-12 lg:p-16 text-white shadow-soft-float">
          
          {/* Subtle Dental Chair / Clinic Room Blended Background inside banner */}
          <div
            className="absolute inset-0 pointer-events-none select-none opacity-30 mix-blend-overlay"
            aria-hidden="true"
          >
            <img
              src="/backgrounds/bg-clinic-room.jpg"
              alt=""
              className="w-full h-full object-cover filter blur-[1px]"
            />
          </div>

          {/* Subtle Decorative background watermark */}
          <div
            className="absolute -right-16 -bottom-16 w-80 h-80 opacity-10 pointer-events-none"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full text-white"
            >
              <path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 5 2.5 7.5C7.5 18 8 22 10 22s2.5-2.5 2.5-4c0-1.5-.5-3-.5-4s1-2 2-2 2 1 2 2-.5 2.5-.5 4c0 1.5.5 4 2.5 4s2.5-4 3.5-6.5C21.5 13 23 11 23 8c0-3.5-3.5-6-8-6-1.5 0-2.5.5-3 1-.5-.5-1.5-1-3-1z" />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold text-white">
              <HeartPulse className="h-3.5 w-3.5" />
              <span>Chăm sóc nụ cười cùng chuyên gia</span>
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Chủ động chăm sóc nụ cười từ hôm nay
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl">
              Đăng ký tài khoản để gửi yêu cầu đặt lịch khám và theo dõi lịch hẹn thuận tiện. Đội ngũ bác sĩ phòng khám sẽ liên hệ xác nhận thời gian sớm nhất.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleAction}
                className="px-7 py-3.5 rounded-2xl bg-white hover:bg-dental-bg text-dental-text text-sm font-bold shadow-sm transition-all duration-150 flex items-center justify-center gap-2 group"
              >
                <Calendar className="h-4 w-4 text-dental-accent" />
                <span>{isLoggedIn ? 'Vào không gian điều trị' : 'Đặt lịch khám ngay'}</span>
                <ArrowRight className="h-4 w-4 text-dental-accent group-hover:translate-x-1 transition-transform" />
              </button>

              {!isLoggedIn && (
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/30 backdrop-blur-sm transition-colors text-center"
                >
                  Đã có tài khoản? Đăng nhập
                </button>
              )}
            </div>

            <div className="pt-4 flex items-center gap-2 text-xs text-white/80">
              <ShieldCheck className="h-4 w-4 text-dental-mint" />
              <span>Thông tin cá nhân được bảo mật an toàn theo quy định y tế</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

