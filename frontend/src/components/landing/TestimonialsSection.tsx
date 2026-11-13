import React from 'react';
import { Quote, User, Info } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface TestimonialItem {
  id: string;
  name: string;
  service: string;
  comment: string;
  treatmentPlan: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: '1',
    name: 'Khách hàng H.L. (26 tuổi)',
    service: 'Niềng răng trong suốt',
    treatmentPlan: 'Lộ trình 18 tháng',
    comment: 'Tôi đánh giá rất cao việc phòng khám số hóa lịch khám và lộ trình điều trị. Mỗi buổi tái khám đều biết trước bác sĩ sẽ làm gì và tiến độ di chuyển răng đến đâu.',
  },
  {
    id: '2',
    name: 'Khách hàng V.M. (48 tuổi)',
    service: 'Cấy ghép Implant răng cấm',
    treatmentPlan: 'Phục hình đơn lẻ',
    comment: 'Bác sĩ giải thích rất kỹ lưỡng về phim CT trước khi phẫu thuật. Quá trình cấy ghép diễn ra nhanh chóng, ít sưng đau hơn nhiều so với tôi tưởng tượng.',
  },
  {
    id: '3',
    name: 'Khách hàng T.H. (32 tuổi)',
    service: 'Bọc răng sứ thẩm mỹ',
    treatmentPlan: 'Phục hình 4 răng cửa',
    comment: 'Màu sắc răng sứ tự nhiên, ăn nhai chắc chắn. Đội ngũ nhân viên luôn nhắc lịch hẹn chu đáo trước ngày tái khám 1 ngày.',
  },
];

export const TestimonialsSection: React.FC = () => {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative py-24 bg-gradient-to-b from-dental-bg via-white to-white border-b border-dental-border/60 overflow-hidden"
    >
      {/* Background Decor 1: Nụ cười bệnh nhân rạng rỡ mép trái (chuẩn ảnh mẫu) */}
      <div
        className="hidden md:block absolute -top-8 -left-12 lg:-left-6 w-[380px] lg:w-[460px] h-[520px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 20% 40%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 20% 40%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
        }}
      >
        <img
          src="/backgrounds/bg-happy-smile-left.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-[0.5px] opacity-[0.34] lg:opacity-[0.42]"
          loading="lazy"
        />
      </div>

      {/* Background Decor 2: Nụ cười thẩm mỹ tự nhiên mép phải (chuẩn ảnh mẫu) */}
      <div
        className="hidden lg:block absolute bottom-0 -right-12 lg:-right-6 w-[400px] lg:w-[500px] h-[520px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 80% 60%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 80% 60%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
        }}
      >
        <img
          src="/backgrounds/bg-happy-smile-right.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-[0.5px] opacity-[0.32] lg:opacity-[0.40]"
          loading="lazy"
        />
      </div>

      {/* Ambient soft glow */}
      <div
        className="absolute top-1/3 right-1/4 w-[480px] h-[480px] bg-dental-mint/35 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-6 left-1/4 w-[450px] h-[450px] bg-[#DCEFEB]/50 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dental-bg border border-dental-border text-[11px] font-bold text-dental-accent">
            <Info className="h-3.5 w-3.5" />
            <span>Nội dung minh họa giao diện demo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dental-text tracking-tight">
            Cảm nhận và chia sẻ sau điều trị
          </h2>
          <p className="text-xs sm:text-sm text-dental-muted leading-relaxed">
            Sự an tâm và nụ cười rạng rỡ của quý khách là động lực để đội ngũ phòng khám không ngừng nâng cao chất lượng chăm sóc.
          </p>
        </div>

        {/* Testimonials 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-dental-bg border border-dental-border hover:bg-white hover:shadow-soft-card hover:border-dental-mint transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-9 w-9 rounded-xl bg-dental-mint flex items-center justify-center text-dental-accent">
                  <Quote className="h-5 w-5" />
                </div>
                <p className="text-xs text-dental-text leading-relaxed italic">
                  &quot;{item.comment}&quot;
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-dental-border/60 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white border border-dental-border flex items-center justify-center text-dental-muted shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dental-text">{item.name}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-dental-muted">
                    <span className="text-dental-accent font-semibold">{item.service}</span>
                    <span>•</span>
                    <span>{item.treatmentPlan}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-dental-muted">
            * Các trích dẫn trên là dữ liệu mẫu phục vụ trình diễn cấu trúc giao diện website; phòng khám không đăng tải phản hồi của bệnh nhân thật khi chưa có sự đồng ý bằng văn bản.
          </p>
        </div>

      </div>
    </section>
  );
};
