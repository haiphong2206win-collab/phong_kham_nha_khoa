import React from 'react';
import { Calendar, Info, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface DoctorItem {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  avatar: string;
  focusAreas: string[];
}

const DOCTORS: DoctorItem[] = [
  {
    id: 'dr-an',
    name: 'BS. Nguyễn Văn An',
    title: 'Bác sĩ Chuyên khoa Răng Hàm Mặt',
    specialty: 'Chuyên khoa Chỉnh nha & Niềng răng',
    bio: 'Định hướng nghiên cứu chuyên sâu về các kỹ thuật nắn chỉnh răng lệch lạc, kiểm soát lực kéo sinh lý an toàn và ứng dụng khay niềng trong suốt.',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    focusAreas: ['Chỉnh nha mắc cài tự buộc', 'Khay niềng trong suốt', 'Chỉnh hình can thiệp sớm'],
  },
  {
    id: 'dr-chi',
    name: 'BS. Trần Mai Chi',
    title: 'Bác sĩ Chuyên khoa Răng Hàm Mặt',
    specialty: 'Chuyên khoa Cấy ghép Implant & Nha chu',
    bio: 'Tập trung vào phẫu thuật phục hồi răng mất bằng trụ Titanium sinh học, kỹ thuật ghép xương định vị 3D và điều trị các bệnh lý mô quanh răng.',
    avatar: 'https://images.unsplash.com/photo-1594824813583-b7899a224a18?auto=format&fit=crop&w=600&q=80',
    focusAreas: ['Cấy ghép Implant kỹ thuật số', 'Phẫu thuật nha chu', 'Phục hình All-on-X'],
  },
  {
    id: 'dr-long',
    name: 'BS. Lê Hoàng Long',
    title: 'Bác sĩ Chuyên khoa Răng Hàm Mặt',
    specialty: 'Chuyên khoa Phục hình Răng sứ Thẩm mỹ',
    bio: 'Có kinh nghiệm lâm sàng trong thiết kế nụ cười, phục hình răng sứ bảo tồn tối đa tủy răng thật và phục hình khớp cắn chức năng.',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    focusAreas: ['Dán sứ Veneer thẩm mỹ', 'Mão toàn sứ cao cấp', 'Tái tạo thẩm mỹ nụ cười'],
  },
  {
    id: 'dr-hang',
    name: 'BS. Phạm Thúy Hằng',
    title: 'Bác sĩ Chuyên khoa Răng Hàm Mặt',
    specialty: 'Chuyên khoa Nha khoa Bảo tồn & Tủy răng',
    bio: 'Chuyên tâm vào các thủ thuật nội nha dưới kính phóng đại, xử lý các ca tủy phức tạp, nhổ răng khôn Piezotome và chăm sóc răng trẻ em.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    focusAreas: ['Điều trị tủy vi phẫu', 'Nhổ răng khôn siêu âm', 'Nha khoa dự phòng tổng quát'],
  },
];

interface DoctorsSectionProps {
  onBookAppointment: () => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  onBookAppointment,
}) => {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="doctors"
      className="relative py-24 bg-gradient-to-b from-white via-dental-bg to-dental-bg overflow-hidden border-b border-dental-border/50"
    >
      {/* Background Decor 1: Ảnh bác sĩ nha khoa mờ ở mép trái (chuẩn ảnh mẫu) */}
      <div
        className="hidden md:block absolute -top-8 -left-12 lg:-left-6 w-[380px] lg:w-[460px] h-[520px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 20% 40%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 20% 40%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
        }}
      >
        <img
          src="/backgrounds/bg-doctor-team.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-[0.5px] opacity-[0.32] lg:opacity-[0.40]"
          loading="lazy"
        />
      </div>

      {/* Background Decor 2: Y bác sĩ chuyên khoa tư vấn lâm sàng mép phải */}
      <div
        className="hidden md:block absolute -top-10 -right-12 lg:-right-6 w-[380px] lg:w-[480px] h-[520px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 80% 40%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 80% 40%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
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
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-dental-mint/35 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[#DCEFEB]/50 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-dental-border text-[11px] font-bold text-dental-accent shadow-xs">
            <Info className="h-3.5 w-3.5" />
            <span>Dữ liệu minh họa phục vụ demo giao diện</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dental-text tracking-tight">
            Đội ngũ bác sĩ răng hàm mặt tận tâm
          </h2>
          <p className="text-xs sm:text-sm text-dental-muted leading-relaxed">
            Các bác sĩ phụ trách từng chuyên khoa riêng biệt, luôn lắng nghe và thảo luận kỹ lưỡng cùng bệnh nhân trước khi chỉ định phác đồ.
          </p>
        </div>

        {/* 4 Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DOCTORS.map((doc) => (
            <div
              key={doc.id}
              className="rounded-3xl bg-white border border-dental-border overflow-hidden shadow-sm hover:shadow-soft-card hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Doctor Portrait */}
                <div className="relative h-64 w-full bg-dental-mint/30 overflow-hidden">
                  <ImageWithFallback
                    src={doc.avatar}
                    alt={doc.name}
                    fallbackTitle={doc.name}
                    className="w-full h-full object-cover object-top"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-dental-mint block">
                      {doc.specialty}
                    </span>
                    <h3 className="text-base font-bold text-white drop-shadow-sm">
                      {doc.name}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <p className="text-[11px] text-dental-muted leading-relaxed line-clamp-3">
                    {doc.bio}
                  </p>

                  <div className="space-y-1 pt-1 border-t border-dental-border/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-dental-text/80 block">
                      Lĩnh vực lâm sàng:
                    </span>
                    {doc.focusAreas.map((area, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-dental-text">
                        <CheckCircle2 className="h-3 w-3 text-dental-accent shrink-0" />
                        <span className="truncate">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="p-4 pt-2 border-t border-dental-border/40">
                <button
                  type="button"
                  onClick={onBookAppointment}
                  className="w-full py-2 px-3 rounded-xl bg-dental-bg hover:bg-dental-mint text-xs font-semibold text-dental-text hover:text-dental-accent transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5 text-dental-accent" />
                  <span>Đặt hẹn với bác sĩ</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Disclaimer notice banner */}
        <div className="mt-10 p-3.5 rounded-2xl bg-white border border-dental-border text-center max-w-xl mx-auto">
          <p className="text-[11px] text-dental-muted">
            * Danh sách bác sĩ trên hiện là cấu hình minh họa theo yêu cầu kiến trúc. Thông tin chính thức của đội ngũ bác sĩ phòng khám sẽ được cập nhật đồng bộ từ hệ thống quản trị sau.
          </p>
        </div>

      </div>
    </section>
  );
};
