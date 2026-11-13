import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Tôi có thể đặt lịch khám trực tuyến trên website không?',
    answer: 'Có. Sau khi đăng ký tài khoản Bệnh nhân, bạn có thể gửi yêu cầu đặt lịch hẹn trực tuyến với ngày giờ mong muốn. Hệ thống sẽ ghi nhận và điều phối bác sĩ khám phù hợp.',
  },
  {
    id: 'faq-2',
    question: 'Sau khi đăng ký tài khoản, tôi có thể đăng nhập ngay được không?',
    answer: 'Có. Ngay sau khi bấm Đăng ký tài khoản thành công, hệ thống sẽ tự động cấp mã phiên làm việc hợp lệ và đưa bạn vào cổng thông tin bệnh nhân mà không cần chờ duyệt thủ công.',
  },
  {
    id: 'faq-3',
    question: 'Làm thế nào để theo dõi lộ trình điều trị nhiều buổi của tôi?',
    answer: 'Khi bác sĩ thiết lập phác đồ điều trị riêng cho bạn, toàn bộ các buổi khám (Chưa khám, Đang khám, Đã hoàn thành) cùng lịch hẹn liên kết sẽ hiển thị trực quan trên dòng thời gian (Timeline) trong tài khoản của bạn.',
  },
  {
    id: 'faq-4',
    question: 'Lộ trình mẫu và lộ trình riêng của bệnh nhân khác nhau như thế nào?',
    answer: 'Hệ thống có sẵn 3 lộ trình mẫu cố định chuẩn y khoa (Niềng răng, Cấy ghép Implant, Điều trị tủy). Khi điều trị thực tế, bác sĩ sẽ sao chép từ mẫu và tùy biến thêm, sửa hoặc bỏ buổi khám linh hoạt tùy theo cơ địa và tiến triển hồi phục của từng người.',
  },
  {
    id: 'faq-5',
    question: 'Tôi có thể thay đổi hoặc dời lịch khám đã hẹn trước không?',
    answer: 'Bạn hoàn toàn có thể yêu cầu dời lịch hoặc liên hệ đường dây nóng của phòng khám để được nhân viên y tế hỗ trợ sắp xếp lại khung giờ tái khám thuận tiện nhất.',
  },
];

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const sectionRef = useScrollReveal<HTMLElement>();

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative py-24 bg-gradient-to-b from-white via-dental-bg to-dental-bg overflow-hidden border-b border-dental-border/50"
    >
      {/* Background Decor 1: Không gian phòng khám nha khoa mờ mép trái (chuẩn ảnh mẫu) */}
      <div
        className="hidden md:block absolute -top-8 -left-12 lg:-left-6 w-[380px] lg:w-[460px] h-[520px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 20% 40%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 20% 40%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
        }}
      >
        <img
          src="/backgrounds/bg-clinic-hall.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-[0.5px] opacity-[0.30] lg:opacity-[0.38]"
          loading="lazy"
        />
      </div>

      {/* Background Decor 2: Ghế nha khoa & đèn khám hiện đại mép phải (chuẩn ảnh mẫu) */}
      <div
        className="hidden lg:block absolute bottom-0 -right-12 lg:-right-6 w-[400px] lg:w-[500px] h-[520px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 80% 60%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 80% 60%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
        }}
      >
        <img
          src="/backgrounds/bg-dental-chair-right.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-[0.5px] opacity-[0.30] lg:opacity-[0.38]"
          loading="lazy"
        />
      </div>

      {/* Ambient soft glow */}
      <div
        className="absolute top-1/2 left-1/3 w-[450px] h-[450px] bg-dental-mint/35 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-4 right-1/4 w-[420px] h-[420px] bg-[#DCEFEB]/50 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-bold text-dental-accent uppercase tracking-wider block">
            Hỏi Đáp & Trợ Giúp
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dental-text tracking-tight">
            Những câu hỏi thường gặp
          </h2>
          <p className="text-xs sm:text-sm text-dental-muted leading-relaxed">
            Giải đáp các thắc mắc về quy trình đặt lịch, dịch vụ và theo dõi lộ trình điều trị tại phòng khám.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            const contentId = `faq-content-${faq.id}`;
            const headerId = `faq-header-${faq.id}`;

            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-dental-border bg-white overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  id={headerId}
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-dental-bg/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-dental-accent"
                >
                  <span className="text-sm font-bold text-dental-text">
                    {faq.question}
                  </span>
                  <div
                    className={`h-7 w-7 rounded-lg bg-dental-mint/60 flex items-center justify-center text-dental-accent shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-dental-mint' : ''
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={headerId}
                    className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-dental-muted leading-relaxed animate-in fade-in duration-200 border-t border-dental-border/40"
                  >
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
