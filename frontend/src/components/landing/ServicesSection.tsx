import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { ServiceDetailModal, ServiceItem } from './ServiceDetailModal';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const SERVICES: ServiceItem[] = [
  {
    id: 'nieng-rang',
    title: 'Niềng răng & Chỉnh nha chuyên sâu',
    tag: 'Chỉnh hình RHM',
    shortDesc: 'Khắc phục răng chen chúc, hô, móm và khớp cắn sai lệch bằng mắc cài tự buộc hoặc khay niềng trong suốt hiện đại.',
    fullDesc: 'Dịch vụ chỉnh nha giúp căn chỉnh các răng mọc lệch lạc về đúng vị trí sinh lý trên cung hàm, cải thiện thẩm mỹ khuôn mặt và chức năng ăn nhai lâu dài. Bác sĩ chuyên khoa theo dõi định kỳ và tối ưu lực kéo theo từng giai đoạn.',
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80',
    indications: [
      'Răng chen chúc, khấp khểnh, mọc lệch khỏi cung hàm',
      'Răng hô, móm, cắn hở hoặc cắn sâu',
      'Khoảng thưa giữa các răng cần thu gọn',
    ],
    steps: [
      'Khám lâm sàng, chụp phim Panorama và Cephalo chẩn đoán',
      'Lấy dấu hàm kỹ thuật số và lên kế hoạch dịch chuyển răng',
      'Gắn khí cụ chỉnh nha hoặc giao khay niềng trong suốt đợt 1',
      'Tái khám định kỳ 3–6 tuần một lần để kiểm tra và siết lực',
      'Tháo niềng và đeo hàm duy trì bảo toàn kết quả',
    ],
  },
  {
    id: 'implant',
    title: 'Cấy ghép Implant kỹ thuật số',
    tag: 'Phục hình cố định',
    shortDesc: 'Phục hồi răng đã mất toàn diện cả chân răng và thân răng, khôi phục 95% lực ăn nhai và ngăn ngừa tiêu xương hàm.',
    fullDesc: 'Giải pháp phục hình răng đã mất tối ưu nhất hiện nay. Trụ Titanium tương thích sinh học được cấy ghép an toàn vào xương hàm dưới hướng dẫn của máng phẫu thuật định vị 3D, sau đó gắn mão răng sứ thẩm mỹ tự nhiên.',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
    indications: [
      'Mất một hoặc nhiều răng ở mọi vị trí trên cung hàm',
      'Mất răng toàn hàm cần phục hình All-on-4 hoặc All-on-6',
      'Không muốn mài các răng lân cận làm cầu răng sứ truyền thống',
    ],
    steps: [
      'Chụp phim ConeBeam CT 3D khảo sát mật độ và thể tích xương hàm',
      'Lên kế hoạch cấy ghép giả lập trên phần mềm vi tính',
      'Đặt trụ Implant an toàn, nhẹ nhàng trong phòng vô trùng',
      'Theo dõi tích hợp xương sinh học từ 6–12 tuần',
      'Lấy dấu phục hình và gắn mão răng sứ hoàn thiện',
    ],
  },
  {
    id: 'rang-su',
    title: 'Răng sứ thẩm mỹ cao cấp',
    tag: 'Thẩm mỹ nụ cười',
    shortDesc: 'Bọc răng sứ và dán sứ Veneer bảo tồn tối đa mô răng thật, mang lại nụ cười trắng sáng tự nhiên và độ bền chịu lực cao.',
    fullDesc: 'Sử dụng các dòng phôi toàn sứ cao cấp (Emax, Zirconia, Cercon) chính hãng với độ trong mờ tự nhiên như men răng thật, khả năng chống bám dính màu thực phẩm và viền nướu tương thích sinh học cao.',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80',
    indications: [
      'Răng ố vàng, nhiễm kháng sinh nặng không tẩy trắng được',
      'Răng mẻ, vỡ lớn do chấn thương hoặc sâu răng diện rộng',
      'Răng thưa kẽ nhẹ, hình dáng răng ngắn hoặc không đồng đều',
    ],
    steps: [
      'Thăm khám, thiết kế nụ cười và chọn tông màu men răng phù hợp',
      'Chuẩn bị bề mặt răng theo nguyên tắc bảo tồn mô tối đa',
      'Lấy dấu kỹ thuật số gửi Labo chế tác chính xác từng micromet',
      'Gắn thử thẩm mỹ, tinh chỉnh khớp cắn và cố định bằng cement chuyên dụng',
    ],
  },
  {
    id: 'dieu-tri-tuy',
    title: 'Điều trị tủy vi phẫu nội nha',
    tag: 'Nha khoa bảo tồn',
    shortDesc: 'Làm sạch và hàn kín ống tủy viêm nhiễm nhẹ nhàng dưới kính phóng đại, bảo tồn răng thật tối đa thay vì phải nhổ bỏ.',
    fullDesc: 'Khi vi khuẩn xâm nhập vào buồng tủy gây đau nhức hoặc sưng viêm, điều trị tủy kịp thời sẽ loại bỏ ổ nhiễm trùng triệt để, chấm dứt cơn đau buốt và ngăn ngừa áp xe xương ổ răng.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    indications: [
      'Đau răng dữ dội từng cơn, đau lan lên thái dương, đặc biệt về đêm',
      'Răng sâu thủng lỗ lớn, lộ buồng tủy và đau nhức khi nhai',
      'Răng bị chấn thương đổi màu xám sẫm hoặc có mụn mủ ở chân răng',
    ],
    steps: [
      'Gây tê tại chỗ dịu nhẹ, đặt đê cao su cách ly vùng điều trị',
      'Mở buồng tủy, xác định chiều dài ống tủy bằng máy định vị chóp điện tử',
      'Tạo hình và bơm rửa sát khuẩn hệ thống ống tủy bằng dung dịch chuyên dụng',
      'Trám bít ống tủy khép kín bằng vật liệu Gutta-percha sinh học',
      'Tái tạo thân răng bằng composite hoặc bọc sứ bảo vệ',
    ],
  },
  {
    id: 'nho-rang-khon',
    title: 'Nhổ răng khôn sóng siêu âm Piezotome',
    tag: 'Tiểu phẫu miệng',
    shortDesc: 'Nhẹ nhàng loại bỏ răng khôn mọc lệch, mọc ngầm bằng công nghệ rung siêu âm chọn lọc, hạn chế sưng đau và lành thương nhanh.',
    fullDesc: 'Máy siêu âm Piezotome sử dụng các tần số chọn lọc chỉ tác động lên mô cứng quanh chân răng mà không gây tổn thương các mô mềm, mạch máu và dây thần kinh, giúp ca nhổ răng diễn ra êm ái, hạn chế tối đa cảm giác ê buốt.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    indications: [
      'Răng khôn mọc lệch đâm vào răng số 7 gây giắt thức ăn, sâu răng kề cận',
      'Răng khôn mọc kẹt dưới nướu gây sưng đỏ, viêm lợi trùm tái phát',
      'Chỉ định nhổ răng khôn hỗ trợ chỉnh nha hoặc phòng ngừa nang xương hàm',
    ],
    steps: [
      'Chụp phim X-quang xác định chính xác vị trí và độ cong của chân răng',
      'Sát khuẩn khoang miệng và gây tê cục bộ không đau',
      'Sử dụng mũi rung siêu âm Piezotome nhẹ nhàng bóc tách dây chằng',
      'Đưa răng ra ngoài nguyên vẹn hoặc chia nhỏ an toàn',
      'Vệ sinh ổ răng, đặt màng lành thương PRF và khâu chỉ tự tiêu',
    ],
  },
  {
    id: 'kham-tong-quat',
    title: 'Khám nha khoa & Cạo vôi răng định kỳ',
    tag: 'Chăm sóc dự phòng',
    shortDesc: 'Kiểm tra tổng quát sức khỏe răng miệng, làm sạch mảng bám vôi răng bằng sóng siêu âm không ê buốt và hướng dẫn vệ sinh đúng cách.',
    fullDesc: 'Kiểm tra định kỳ 6 tháng một lần giúp phát hiện sớm sâu răng giai đoạn đầu, viêm nướu hoặc các tổn thương niêm mạc trước khi phát triển phức tạp, giữ cho hơi thở luôn thơm mát và nụ cười luôn tự tin.',
    image: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=800&q=80',
    indications: [
      'Người lớn và trẻ em khám định kỳ 6 tháng một lần theo khuyến nghị',
      'Có mảng bám, vôi răng tích tụ quanh cổ răng và chân răng',
      'Hơi thở có mùi hoặc nướu dễ chảy máu khi chải răng',
    ],
    steps: [
      'Thăm khám toàn diện cung răng và niêm mạc miệng',
      'Làm sạch vôi răng dưới và trên nướu bằng sóng siêu âm dịu êm',
      'Đánh bóng bề mặt răng bằng chổi cước mềm và kem chứa hạt siêu mịn',
      'Thoa gel Flour ngừa sâu răng và tư vấn kỹ thuật vệ sinh cá nhân',
    ],
  },
];

interface ServicesSectionProps {
  onBookAppointment: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onBookAppointment,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 bg-gradient-to-b from-white via-dental-bg to-dental-bg overflow-hidden border-b border-dental-border/50"
    >
      {/* Background Decor: Edge Art 1 - Nụ cười & răng trắng sứ mép trái (chuẩn ảnh mẫu) */}
      <div
        className="hidden md:block absolute top-10 -left-12 lg:-left-8 w-[380px] lg:w-[480px] h-[500px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 20% 45%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 20% 45%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
        }}
      >
        <img
          src="/backgrounds/bg-smile-left.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-[0.5px] opacity-[0.34] lg:opacity-[0.42]"
          loading="lazy"
        />
      </div>

      {/* Background Decor: Edge Art 2 - Phòng điều trị & ghế nha khoa mép phải */}
      <div
        className="hidden lg:block absolute bottom-4 -right-12 lg:-right-8 w-[400px] lg:w-[500px] h-[520px] pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 80% 55%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 80% 55%, black 28%, rgba(0,0,0,0.55) 58%, transparent 88%)',
        }}
      >
        <img
          src="/backgrounds/bg-clinic-room.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-[0.5px] opacity-[0.32] lg:opacity-[0.40]"
          loading="lazy"
        />
      </div>

      {/* Ambient soft glow spots */}
      <div
        className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-dental-mint/45 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -left-20 w-[450px] h-[450px] bg-dental-mint/35 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-dental-accent uppercase tracking-wider block">
            Dịch Vụ Chuyên Sâu
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dental-text tracking-tight">
            Giải pháp chăm sóc toàn diện cho từng tình trạng răng miệng
          </h2>
          <p className="text-xs sm:text-sm text-dental-muted leading-relaxed">
            Các dịch vụ được chuẩn hóa theo quy trình y khoa, trang bị máy móc hiện đại và theo dõi sát sao trong suốt phác đồ điều trị.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="group rounded-3xl bg-white border border-dental-border overflow-hidden shadow-sm hover:shadow-soft-card hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Image banner with fallback */}
                <div className="relative h-48 w-full bg-dental-mint/30 overflow-hidden">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    fallbackTitle={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    containerClassName="w-full h-full"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-dental-accent border border-white/80 shadow-xs">
                    {service.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <h3 className="text-base font-bold text-dental-text group-hover:text-dental-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-dental-muted leading-relaxed line-clamp-2">
                    {service.shortDesc}
                  </p>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="px-5 pb-5 pt-2 border-t border-dental-border/40 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-dental-accent hover:text-dental-accent-hover transition-colors"
                >
                  <span>Xem chi tiết dịch vụ</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Interactive Detail Modal (No 404 routes!) */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBookAppointment={onBookAppointment}
      />
    </section>
  );
};
