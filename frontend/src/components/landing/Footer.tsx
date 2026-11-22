import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-b from-dental-bg via-dental-mint/30 to-dental-mint/50 border-t border-dental-border text-dental-text text-xs overflow-hidden">
      {/* Decorative Wave & Light Layers */}
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-dental-accent/40 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Background Soft Glow & Ambient Curved Ribbon */}
      <div
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/60 rounded-full blur-3xl pointer-events-none select-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute -top-20 -right-20 w-96 h-96 bg-dental-accent/10 rounded-full blur-3xl pointer-events-none select-none -z-0"
        aria-hidden="true"
      />

      {/* Subtle Background Watermark */}
      <div
        className="hidden md:block absolute -bottom-10 right-10 w-96 h-96 opacity-[0.035] pointer-events-none select-none text-dental-text"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 5 2.5 7.5C7.5 18 8 22 10 22s2.5-2.5 2.5-4c0-1.5-.5-3-.5-4s1-2 2-2 2 1 2 2-.5 2.5-.5 4c0 1.5.5 4 2.5 4s2.5-4 3.5-6.5C21.5 13 23 11 23 8c0-3.5-3.5-6-8-6-1.5 0-2.5.5-3 1-.5-.5-1.5-1-3-1z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-dental-mint flex items-center justify-center text-dental-accent shadow-sm">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 5 2.5 7.5C7.5 18 8 22 10 22s2.5-2.5 2.5-4c0-1.5-.5-3-.5-4s1-2 2-2 2 1 2 2-.5 2.5-.5 4c0 1.5.5 4 2.5 4s2.5-4 3.5-6.5C21.5 13 23 11 23 8c0-3.5-3.5-6-8-6-1.5 0-2.5.5-3 1-.5-.5-1.5-1-3-1z" />
                </svg>
              </div>
              <div>
                <span className="text-base font-bold text-dental-text tracking-tight block">
                  Nha Khoa Nụ Cười Xanh
                </span>
                <span className="text-[11px] text-dental-muted block">
                  Trung tâm Nha khoa & Lộ trình điều trị
                </span>
              </div>
            </div>

            <p className="text-dental-muted leading-relaxed text-xs">
              Đồng hành cùng nụ cười của bạn với các giải pháp chỉnh nha, phục hình sứ và cấy ghép implant chuyên sâu, minh bạch trong từng buổi điều trị.
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-dental-accent font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Hệ thống số hóa quy trình y tế hiện đại</span>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-dental-text">
              Khám Phá
            </h4>
            <ul className="space-y-2 text-dental-muted">
              <li><a href="#about" className="hover:text-dental-accent transition-colors">Về phòng khám</a></li>
              <li><a href="#services" className="hover:text-dental-accent transition-colors">Dịch vụ điều trị</a></li>
              <li><a href="#knowledge" className="hover:text-dental-accent transition-colors">Kiến thức răng miệng</a></li>
              <li><a href="#doctors" className="hover:text-dental-accent transition-colors">Đội ngũ bác sĩ</a></li>
              <li><a href="#process" className="hover:text-dental-accent transition-colors">Quy trình thăm khám</a></li>
              <li><a href="#faq" className="hover:text-dental-accent transition-colors">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Col 3: Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-dental-text">
              Dịch Vụ Nổi Bật
            </h4>
            <ul className="space-y-2 text-dental-muted">
              <li>Niềng răng & Chỉnh nha kỹ thuật số</li>
              <li>Cấy ghép răng Implant sinh học</li>
              <li>Bọc răng sứ & Dán sứ Veneer Emax</li>
              <li>Điều trị tủy vi phẫu nội nha</li>
              <li>Nhổ răng khôn siêu âm Piezotome</li>
              <li>Khám nha tổng quát & Cạo vôi răng</li>
            </ul>
          </div>

          {/* Col 4: Contact & Working Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-dental-text">
              Thời Gian & Liên Hệ
            </h4>
            
            <div className="space-y-2.5 text-dental-muted">
              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-dental-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-dental-text block">Giờ làm việc:</span>
                  <span>Thứ 2 – Thứ 7: 08:00 – 19:30</span>
                  <span className="block">Chủ nhật: 08:00 – 17:00</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-dental-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-dental-text block">Hotline tư vấn:</span>
                  <span>(Cập nhật theo thực tế phòng khám)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-dental-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-dental-text block">Hòm thư hỗ trợ:</span>
                  <span>(Email tiếp nhận phản hồi của phòng khám)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-dental-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-dental-text block">Địa chỉ cơ sở:</span>
                  <span>(Địa chỉ chính thức của cơ sở phòng khám)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-dental-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-dental-muted">
          <span>© 2026 Nha Khoa Nụ Cười Xanh. Đồ án Hệ thống Quản lý Phòng khám Nha khoa.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-dental-text transition-colors cursor-pointer">Chính sách bảo mật</span>
            <span>•</span>
            <span className="hover:text-dental-text transition-colors cursor-pointer">Điều khoản dịch vụ</span>
            <span>•</span>
            <span>Phiên bản 2.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
