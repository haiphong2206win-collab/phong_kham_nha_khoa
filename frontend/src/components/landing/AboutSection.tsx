import React, { useState } from 'react';
import { Shield, Sparkles, Stethoscope, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const ABOUT_PILLARS = [
  {
    icon: <Sparkles className="h-5 w-5 text-dental-accent" />,
    title: 'Trải nghiệm bệnh nhân ân cần',
    desc: 'Không gian khám sáng sủa, thư giãn, giúp giải tỏa tâm lý căng thẳng và sợ hãi thường gặp khi thăm khám răng miệng.',
  },
  {
    icon: <Shield className="h-5 w-5 text-dental-accent" />,
    title: 'Vô trùng khép kín tuyệt đối',
    desc: 'Hệ thống khử khuẩn dụng cụ y tế qua nhiều bước tiêu chuẩn, mỗi bệnh nhân sử dụng một bộ tay khoan và khay dụng cụ riêng biệt.',
  },
  {
    icon: <Stethoscope className="h-5 w-5 text-dental-accent" />,
    title: 'Lộ trình minh bạch từng buổi',
    desc: 'Phác đồ điều trị được số hóa rõ ràng theo từng giai đoạn, thông tin dự kiến về thời gian và chi phí được thảo luận trước khi thực hiện.',
  },
  {
    icon: <Award className="h-5 w-5 text-dental-accent" />,
    title: 'Công nghệ nha khoa hiện đại',
    desc: 'Hỗ trợ bởi máy chụp phim kỹ thuật số, máy quét dấu răng 3D và hệ thống lưu trữ hồ sơ bệnh án điện tử an toàn.',
  },
];

export const AboutSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 bg-gradient-to-b from-dental-bg via-white to-white border-b border-dental-border/60 overflow-hidden"
    >
      {/* Background Decor: Phòng khám vô trùng hiện đại ở mép trái */}
      <div
        className="hidden md:block absolute -top-8 -left-12 w-[420px] lg:w-[540px] h-[380px] lg:h-[460px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 25% 35%, black 25%, rgba(0,0,0,0.55) 55%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 25% 35%, black 25%, rgba(0,0,0,0.55) 55%, transparent 85%)',
        }}
      >
        <img
          src="/backgrounds/bg-clinic-hall.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-[0.5px] opacity-[0.32] lg:opacity-[0.38]"
          loading="lazy"
        />
      </div>

      {/* Background Decor 2: Ghế nha khoa công nghệ cao mép phải (chuẩn theo ảnh mẫu) */}
      <div
        className="hidden lg:block absolute -bottom-10 -right-12 w-[460px] lg:w-[580px] h-[400px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 75% 65%, black 25%, rgba(0,0,0,0.55) 55%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 75% 65%, black 25%, rgba(0,0,0,0.55) 55%, transparent 85%)',
        }}
      >
        <img
          src="/backgrounds/bg-dental-chair-right.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-[0.5px] opacity-[0.32] lg:opacity-[0.40]"
          loading="lazy"
        />
      </div>

      {/* Ambient soft glow on top-left and bottom-right */}
      <div
        className="absolute top-0 left-0 w-96 h-96 bg-dental-mint/50 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-[#DCEFEB]/60 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Clinic Photography */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-dental-border bg-dental-bg p-3 shadow-soft-card">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-dental-mint/30">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"
                  alt="Không gian phòng khám Nha Khoa Nụ Cười Xanh sạch sẽ, tiện nghi"
                  fallbackTitle="Không gian phòng điều trị hiện đại"
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
              </div>

              {/* Caption */}
              <div className="mt-3 p-3 rounded-xl bg-white border border-dental-border text-center">
                <p className="text-xs font-semibold text-dental-text">
                  Không gian điều trị vô trùng & thân thiện
                </p>
                <p className="text-[11px] text-dental-muted mt-0.5">
                  Thiết kế nhằm mang lại sự thoải mái tối đa cho quý khách
                </p>
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div>
              <span className="text-xs font-bold text-dental-accent uppercase tracking-wider block mb-1.5">
                Về Chúng Tôi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-dental-text tracking-tight">
                Nha Khoa Nụ Cười Xanh – Điểm tựa tin cậy cho nụ cười khỏe mạnh
              </h2>
            </div>

            <p className="text-sm text-dental-muted leading-relaxed">
              Chúng tôi xây dựng phòng khám với định hướng lấy trải nghiệm và an toàn của bệnh nhân làm trọng tâm. Từ các dịch vụ chăm sóc tổng quát định kỳ đến các ca điều trị chỉnh nha, phục hình sứ và cấy ghép implant phức tạp, toàn bộ quy trình đều được chuẩn hóa và số hóa rõ ràng.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {ABOUT_PILLARS.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-dental-bg/70 border border-dental-border hover:bg-dental-mint/30 transition-colors"
                >
                  <div className="h-9 w-9 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3">
                    {item.icon}
                  </div>
                  <h3 className="text-xs font-bold text-dental-text mb-1">{item.title}</h3>
                  <p className="text-[11px] text-dental-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Expandable details */}
            {isExpanded && (
              <div className="p-4 rounded-2xl bg-dental-mint/20 border border-dental-mint text-xs text-dental-text space-y-2 animate-in fade-in duration-200">
                <p className="font-semibold text-dental-text">
                  Cam kết đồng hành xuyên suốt hành trình điều trị:
                </p>
                <p className="text-dental-muted leading-relaxed">
                  Trước khi bắt đầu bất kỳ phác đồ nào, bác sĩ sẽ trao đổi trực tiếp, giải thích phim chụp chẩn đoán và cùng bệnh nhân thống nhất kế hoạch điều trị phù hợp nhất với điều kiện sức khỏe và tài chính.
                </p>
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-dental-accent hover:text-dental-accent-hover transition-colors focus:outline-none"
              >
                <span>{isExpanded ? 'Thu gọn thông tin' : 'Tìm hiểu thêm về định hướng chăm sóc'}</span>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

