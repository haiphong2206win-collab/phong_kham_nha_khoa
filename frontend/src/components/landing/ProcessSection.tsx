import React from 'react';
import { CalendarCheck, Stethoscope, ClipboardList, HeartHandshake, SmilePlus } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const STEPS = [
  {
    step: '01',
    title: 'Đặt lịch trực tuyến',
    desc: 'Đăng ký tài khoản và gửi yêu cầu chọn khung giờ mong muốn ngay trên hệ thống website.',
    icon: <CalendarCheck className="h-5 w-5 text-dental-accent" />,
  },
  {
    step: '02',
    title: 'Thăm khám & Chụp phim',
    desc: 'Bác sĩ kiểm tra lâm sàng, chụp phim chẩn đoán và xác định chính xác tình trạng răng miệng.',
    icon: <Stethoscope className="h-5 w-5 text-dental-accent" />,
  },
  {
    step: '03',
    title: 'Lập phác đồ điều trị',
    desc: 'Xây dựng lộ trình từng buổi rõ ràng, thông tin chi phí và thời gian dự kiến được giải thích minh bạch.',
    icon: <ClipboardList className="h-5 w-5 text-dental-accent" />,
  },
  {
    step: '04',
    title: 'Tiến hành điều trị',
    desc: 'Thực hiện từng buổi điều trị nhẹ nhàng, chuẩn y khoa trong phòng vô trùng đạt chuẩn.',
    icon: <HeartHandshake className="h-5 w-5 text-dental-accent" />,
  },
  {
    step: '05',
    title: 'Theo dõi & Tái khám',
    desc: 'Bệnh nhân chủ động theo dõi tiến độ trên hệ thống và tái khám định kỳ theo lịch hẹn của bác sĩ.',
    icon: <SmilePlus className="h-5 w-5 text-dental-accent" />,
  },
];

export const ProcessSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative py-24 bg-gradient-to-b from-dental-bg via-white to-white border-b border-dental-border/60 overflow-hidden"
    >
      {/* Background Decor 1: Ghế và thiết bị nha khoa công nghệ cao mép trái (chuẩn ảnh mẫu) */}
      <div
        className="hidden md:block absolute -top-10 -left-12 lg:-left-6 w-[380px] lg:w-[460px] h-[520px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 20% 40%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 20% 40%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
        }}
      >
        <img
          src="/backgrounds/bg-dental-chair-right.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-[0.5px] opacity-[0.32] lg:opacity-[0.40]"
          loading="lazy"
        />
      </div>

      {/* Background Decor 2: Thiết bị y tế & khay dụng cụ vô trùng mép phải */}
      <div
        className="hidden lg:block absolute bottom-0 -right-12 lg:-right-6 w-[380px] lg:w-[480px] h-[500px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 80% 60%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 80% 60%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
        }}
      >
        <img
          src="/backgrounds/bg-clinic-equipment.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-[0.5px] opacity-[0.30] lg:opacity-[0.38]"
          loading="lazy"
        />
      </div>

      {/* Ambient soft glow */}
      <div
        className="absolute top-1/2 right-10 -translate-y-1/2 w-[450px] h-[450px] bg-dental-mint/40 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-4 left-10 w-[400px] h-[400px] bg-[#DCEFEB]/50 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-dental-accent uppercase tracking-wider block">
            Quy Trình Chăm Sóc
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dental-text tracking-tight">
            5 bước trong hành trình chăm sóc nụ cười
          </h2>
          <p className="text-xs sm:text-sm text-dental-muted leading-relaxed">
            Quy trình được chuẩn hóa nhằm mang lại sự an tâm, chủ động và minh bạch cho người bệnh từ lúc bắt đầu đến khi hoàn thành.
          </p>
        </div>

        {/* Stepper Timeline (Desktop horizontal, Mobile vertical) */}
        <div className="relative">
          
          {/* Horizontal Line for Desktop */}
          <div
            className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-dental-border -z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            {STEPS.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-3 group">
                {/* Step badge icon */}
                <div className="relative">
                  <div className="h-20 w-20 rounded-3xl bg-dental-bg border-2 border-dental-border group-hover:border-dental-accent group-hover:bg-dental-mint/40 transition-colors duration-200 flex flex-col items-center justify-center shadow-xs">
                    <span className="text-[10px] font-bold text-dental-accent mb-0.5">
                      BƯỚC {item.step}
                    </span>
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5 px-2">
                  <h3 className="text-sm font-bold text-dental-text">
                    {item.title}
                  </h3>
                  <p className="text-xs text-dental-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Note */}
        <div className="mt-12 text-center">
          <span className="inline-block text-[11px] text-dental-muted italic">
            * Lưu ý: Quy trình thực tế có thể được bác sĩ điều chỉnh linh hoạt tùy theo tình trạng lâm sàng và phác đồ riêng của từng bệnh nhân.
          </span>
        </div>

      </div>
    </section>
  );
};

