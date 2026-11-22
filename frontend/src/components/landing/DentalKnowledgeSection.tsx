import React, { useState } from 'react';
import { AlertCircle, HelpCircle, ChevronRight, Activity, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface PathologyItem {
  id: string;
  name: string;
  category: string;
  symptoms: string;
  causes: string;
  prevention: string;
}

const PATHOLOGIES: PathologyItem[] = [
  {
    id: 'sau-rang',
    name: 'Sâu răng & Phá hủy men răng',
    category: 'Bệnh lý men răng',
    symptoms: 'Xuất hiện đốm đen hoặc nâu trên bề mặt nhai, đau buốt khi ăn đồ ngọt, nóng hoặc lạnh.',
    causes: 'Vi khuẩn Streptococcus mutans lên men đường bột tạo axit ăn mòn cấu trúc tinh thể men răng.',
    prevention: 'Đánh răng đúng cách 2 lần/ngày, dùng chỉ nha khoa, súc miệng nước muối và trám răng sớm khi mới chớm sâu.',
  },
  {
    id: 'viem-nuou',
    name: 'Viêm nướu & Bệnh nha chu',
    category: 'Mô nha chu',
    symptoms: 'Nướu sưng đỏ, phì đại, dễ chảy máu khi chải răng hoặc dùng tăm, tụt nướu để lộ chân răng.',
    causes: 'Mảng bám vi khuẩn tích tụ lâu ngày hóa cứng thành vôi răng gây viêm nhiễm các tổ chức quanh răng.',
    prevention: 'Cạo vôi răng định kỳ 6 tháng một lần, vệ sinh kỹ vùng viền nướu bằng bàn chải lông mềm.',
  },
  {
    id: 'rang-khon-lech',
    name: 'Răng khôn mọc lệch / ngầm',
    category: 'Răng hàm & Khớp cắn',
    symptoms: 'Đau nhức vùng góc hàm, sưng má, khó há miệng, sốt nhẹ hoặc viêm lợi trùm tái phát nhiều lần.',
    causes: 'Cung hàm không đủ khoảng trống cho răng số 8 mọc thẳng, khiến răng mọc nghiêng, đâm vào răng số 7.',
    prevention: 'Chụp phim X-quang toàn cảnh phát hiện sớm mầm răng khôn từ độ tuổi 18–25 để nhổ chủ động trước khi gây biến chứng.',
  },
  {
    id: 'rang-nhay-cam',
    name: 'Răng nhạy cảm & Ê buốt',
    category: 'Cảm giác & Ngà răng',
    symptoms: 'Cảm giác buốt nhói đột ngột khi tiếp xúc với thức ăn cay, nóng, lạnh hoặc hít thở không khí lạnh.',
    causes: 'Lớp men răng bị mòn hoặc tụt nướu làm lộ các ống ngà dẫn truyền kích thích trực tiếp tới tủy răng.',
    prevention: 'Dùng kem đánh răng giảm ê buốt chuyên dụng, tránh chải răng theo chiều ngang với lực quá mạnh.',
  },
  {
    id: 'rang-lech-lac',
    name: 'Răng lệch lạc & Sai khớp cắn',
    category: 'Chỉnh hình RHM',
    symptoms: 'Răng chen chúc, khấp khểnh, hàm trên nhô nhiều (hô) hoặc hàm dưới phủ ngoài hàm trên (móm).',
    causes: 'Di truyền kích thước xương hàm, thói quen thở miệng, mút tay thời thơ ấu hoặc mất răng sữa quá sớm.',
    prevention: 'Thăm khám chỉnh nha sớm từ 7–12 tuổi để can thiệp tiền chỉnh nha hoặc niềng răng cố định khi trưởng thành.',
  },
  {
    id: 'mat-rang',
    name: 'Mất răng & Tiêu xương hàm',
    category: 'Phục hình & Xương hàm',
    symptoms: 'Khoảng trống mất răng trên hàm, các răng bên cạnh xô lệch về khoảng trống, má bị hóp dần.',
    causes: 'Sâu răng hoặc nha chu nặng phải nhổ bỏ, chấn thương va đập làm gãy răng.',
    prevention: 'Trồng lại răng sớm bằng cấy ghép Implant để duy trì kích thích cơ học, ngăn chặn quá trình tiêu xương ổ răng.',
  },
  {
    id: 'hoi-mieng',
    name: 'Hôi miệng & Mảng bám tích tụ',
    category: 'Vệ sinh khoang miệng',
    symptoms: 'Hơi thở có mùi hôi khó chịu kéo dài dù đã đánh răng, có màng trắng bám trên bề mặt lưỡi.',
    causes: 'Hợp chất lưu huỳnh dễ bay hơi do vi khuẩn kỵ khí phân hủy thức ăn thừa ở kẽ răng, lưỡi hoặc viêm nướu.',
    prevention: 'Dùng cây cạo lưỡi mỗi ngày, chỉ nha khoa sau mỗi bữa ăn, uống đủ nước và kiểm tra các ổ sâu răng.',
  },
  {
    id: 'chay-mau-chan-rang',
    name: 'Chảy máu chân răng',
    category: 'Dấu hiệu cảnh báo sớm',
    symptoms: 'Thấy máu dính trên bàn chải hoặc bọt kem đánh răng, nướu sẫm màu và hơi phù nề.',
    causes: 'Giai đoạn đầu của viêm nướu do tích tụ mảng bám vi khuẩn, thiếu vitamin C hoặc thay đổi nội tiết tố.',
    prevention: 'Khám nha khoa để làm sạch vôi răng dưới nướu, bổ sung rau xanh hoa quả tươi và không dùng tăm xỉa răng nhọn.',
  },
];

export const DentalKnowledgeSection: React.FC = () => {
  const [activeItem, setActiveItem] = useState<PathologyItem>(PATHOLOGIES[0]);
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="knowledge"
      className="relative py-24 bg-gradient-to-b from-dental-bg via-white to-white border-b border-dental-border/60 overflow-hidden"
    >
      {/* Background Decor 1: Cấu trúc giải phẫu răng & mô phỏng nha khoa mép trái (chuẩn ảnh mẫu) */}
      <div
        className="hidden md:block absolute -top-8 -left-12 lg:-left-6 w-[380px] lg:w-[480px] h-[520px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 20% 40%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 20% 40%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
        }}
      >
        <img
          src="/backgrounds/bg-tooth-xray.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-[0.5px] opacity-[0.32] lg:opacity-[0.40]"
          loading="lazy"
        />
      </div>

      {/* Background Decor 2: Y bác sĩ thăm khám nha chu mép phải (chuẩn ảnh mẫu) */}
      <div
        className="hidden lg:block absolute bottom-0 -right-12 lg:-right-6 w-[400px] lg:w-[500px] h-[520px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 80% 60%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 80% 60%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
        }}
      >
        <img
          src="/backgrounds/bg-doctor-consult.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-[0.5px] opacity-[0.30] lg:opacity-[0.38]"
          loading="lazy"
        />
      </div>

      {/* Ambient soft glow */}
      <div
        className="absolute -top-10 right-10 w-[450px] h-[450px] bg-dental-mint/40 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#DCEFEB]/50 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-dental-accent uppercase tracking-wider block">
            Cẩm Nang Sức Khỏe
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dental-text tracking-tight">
            Nhận biết và phòng ngừa các bệnh lý răng miệng thường gặp
          </h2>
          <p className="text-xs sm:text-sm text-dental-muted leading-relaxed">
            Nắm rõ các dấu hiệu cảnh báo sớm giúp bạn chủ động chăm sóc răng miệng và can thiệp y tế kịp thời.
          </p>
        </div>

        {/* 2-Column Interactive Layout: List on Left, Detail Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: 8 Items Compact Grid / List */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PATHOLOGIES.map((item) => {
              const isSelected = activeItem.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between ${isSelected
                      ? 'bg-dental-mint/40 border-dental-accent shadow-sm'
                      : 'bg-dental-bg hover:bg-dental-mint/20 border-dental-border'
                    }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-dental-accent">
                      {item.category}
                    </span>
                    <ChevronRight
                      className={`h-3.5 w-3.5 transition-transform ${isSelected ? 'text-dental-accent translate-x-0.5' : 'text-dental-muted'
                        }`}
                    />
                  </div>
                  <h3 className="text-xs font-bold text-dental-text line-clamp-1">
                    {item.name}
                  </h3>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Breakdown of Selected Pathology */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-dental-bg border border-dental-border shadow-soft-card space-y-5">
              <div className="flex items-start justify-between border-b border-dental-border pb-4">
                <div>
                  <span className="text-[11px] font-bold text-dental-accent uppercase tracking-wider block mb-1">
                    {activeItem.category}
                  </span>
                  <h3 className="text-lg font-bold text-dental-text tracking-tight">
                    {activeItem.name}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-white border border-dental-border flex items-center justify-center text-dental-accent shadow-sm shrink-0">
                  <Activity className="h-5 w-5" />
                </div>
              </div>

              {/* Triệu chứng */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-dental-text flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertCircle className="h-3.5 w-3.5 text-dental-accent" />
                  Triệu chứng nhận biết
                </h4>
                <p className="text-xs text-dental-text/90 leading-relaxed p-3 rounded-xl bg-white border border-dental-border/80">
                  {activeItem.symptoms}
                </p>
              </div>

              {/* Nguyên nhân */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-dental-text flex items-center gap-1.5 uppercase tracking-wider">
                  <HelpCircle className="h-3.5 w-3.5 text-dental-accent" />
                  Nguyên nhân chính
                </h4>
                <p className="text-xs text-dental-muted leading-relaxed p-3 rounded-xl bg-white border border-dental-border/80">
                  {activeItem.causes}
                </p>
              </div>

              {/* Hướng phòng ngừa */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-dental-text flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5 text-dental-accent" />
                  Hướng phòng ngừa & Điều trị
                </h4>
                <p className="text-xs text-dental-text/90 leading-relaxed p-3 rounded-xl bg-dental-mint/30 border border-dental-mint/60">
                  {activeItem.prevention}
                </p>
              </div>

              {/* Medical Disclaimer */}
              <div className="pt-2 text-[11px] text-dental-muted border-t border-dental-border/60 flex items-start gap-2">
                <span className="font-bold text-dental-text shrink-0">Khuyến cáo:</span>
                <span>
                  Thông tin trên mang tính chất phổ biến kiến thức nha khoa phổ thông, không thay thế chẩn đoán lâm sàng trực tiếp từ bác sĩ chuyên khoa.
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
