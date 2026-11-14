import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  CalendarPlus, 
  Sparkles, 
  TrendingUp, 
  Bell, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Headphones,
  FolderHeart,
  Activity,
  Inbox
} from 'lucide-react';
import type { PatientDashboardSummary, YeuCauDatLich } from '@/types/patient';
import type { AuthSession } from '@/types/auth';
import { HeroDentalBannerArt, ToothWithBraces } from './PatientIllustrations';

interface PatientDashboardProps {
  summary: PatientDashboardSummary;
  session: AuthSession;
  loading: boolean;
  error: string | null;
  onNavigateTab: (tab: 'booking' | 'appointments' | 'treatment-plan' | 'profile' | 'notifications' | 'faq') => void;
  onRetry: () => void;
}

const CA_KHAM_TIME: Record<string, string> = {
  CA_SANG: 'Ca Sáng (08:00 - 11:30)',
  CA_CHIEU: 'Ca Chiều (13:30 - 17:00)',
};

const TRANG_THAI_MAP: Record<string, { label: string; bg: string; text: string; border: string }> = {
  CHO_PHAN_CONG: { label: 'Chờ phân công', bg: 'bg-[#FFFBEB]', text: 'text-[#D97706]', border: 'border-[#FEF3C7]' },
  DA_PHAN_CONG: { label: 'Đã xác nhận', bg: 'bg-[#E8F6F2]', text: 'text-[#169C89]', border: 'border-[#CEEBE2]' },
  CHO_XAC_NHAN: { label: 'Chờ xác nhận', bg: 'bg-[#FFFBEB]', text: 'text-[#D97706]', border: 'border-[#FEF3C7]' },
  DA_XAC_NHAN: { label: 'Đã xác nhận', bg: 'bg-[#E8F6F2]', text: 'text-[#169C89]', border: 'border-[#CEEBE2]' },
  TU_CHOI: { label: 'Từ chối', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  DA_HUY: { label: 'Đã hủy', bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
};

const DENTAL_TIPS = [
  {
    title: 'Chải răng đúng cách mỗi ngày',
    desc: 'Giúp loại bỏ mảng bám và bảo vệ nướu khỏe mạnh, nghiêng 45 độ chải nhẹ nhàng 2 lần/ngày.',
    image: '/backgrounds/bg-happy-smile-right.jpg',
  },
  {
    title: 'Sử dụng chỉ nha khoa sau ăn',
    desc: 'Làm sạch kẽ răng nơi bàn chải không chạm tới, ngăn ngừa sâu răng kẽ và viêm nha chu.',
    image: '/backgrounds/bg-smile-left.jpg',
  },
  {
    title: 'Khám định kỳ 6 tháng một lần',
    desc: 'Lấy vôi răng và kiểm tra sức khỏe răng miệng định kỳ để duy trì nụ cười luôn tự tin.',
    image: '/backgrounds/bg-doctor-consult.jpg',
  },
];

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  summary,
  session,
  loading,
  error,
  onNavigateTab,
  onRetry,
}) => {
  const { profile, appointmentRequests, nearestAppointment } = summary;
  const [activeTableTab, setActiveTableTab] = useState<'upcoming' | 'history'>('upcoming');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Lấy họ tên thực tế từ MySQL, nếu rỗng dùng username tài khoản thực
  const patientName = profile?.hoTen?.trim() || session.user?.tenDangNhap || 'Quý khách';

  // Định dạng ngày thực tế cho Card Lịch khám gần nhất
  const formatAppointmentDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return {
      dayOfWeek: days[d.getDay()],
      dayNumber: String(d.getDate()).padStart(2, '0'),
      monthStr: `Tháng ${d.getMonth() + 1}`,
    };
  };

  const parsedNearestDate = nearestAppointment ? formatAppointmentDate(nearestAppointment.ngayMongMuon) : null;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-48 rounded-3xl bg-[#E8F6F2] border border-[#CEEBE2]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-3xl bg-white border border-[#E3ECE9]" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-white border border-[#E3ECE9]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-7 select-none">
      {/* ==================== 1. ERROR ALERT IF ANY ==================== */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start justify-between gap-3 text-xs text-red-600">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Không thể đồng bộ toàn bộ dữ liệu từ máy chủ:</span>
              <span>{error}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="px-3 py-1 rounded-xl bg-white border border-red-300 font-semibold text-[11px] hover:bg-red-50 transition-colors shrink-0"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* ==================== 2. HERO WELCOME BANNER (Giữ nguyên giao diện đẹp) ==================== */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#D7EFEA] via-[#E4F5F1] to-[#EBF7F5] border border-[#CEEBE2] p-6 sm:p-8 lg:p-10 text-[#1E384C] shadow-soft-card min-h-[190px] flex flex-col justify-center">
        {/* Decorative Wave & Dental Art */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none">
          <HeroDentalBannerArt />
        </div>

        <div className="relative z-10 max-w-xl space-y-1.5">
          <span className="text-sm sm:text-base text-[#344C52] font-normal block">
            Chào mừng trở lại,
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#169C89] leading-tight flex items-center gap-2">
            <span>{patientName}</span>
            <span className="text-2xl sm:text-3xl animate-bounce">👋</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#4E6B65] font-medium leading-relaxed pt-1">
            Cùng chăm sóc và duy trì nụ cười khỏe đẹp mỗi ngày nhé!
          </p>
        </div>
      </div>

      {/* ==================== 3. QUICK ACTIONS ROW (4 Thao tác nhanh - Chuyển đúng Tab) ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Đặt lịch khám (Green Accent) */}
        <button
          type="button"
          onClick={() => onNavigateTab('booking')}
          className="p-4 rounded-3xl bg-white border border-[#D8ECE6] hover:border-[#169C89] hover:shadow-soft-card hover:-translate-y-0.5 transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CalendarPlus className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#1E384C] group-hover:text-[#169C89] transition-colors block">
                Đặt lịch khám
              </span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-[#169C89] group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Card 2: Xem lộ trình điều trị (Sky Blue Accent) */}
        <button
          type="button"
          onClick={() => onNavigateTab('treatment-plan')}
          className="p-4 rounded-3xl bg-white border border-[#DBEAFE] hover:border-[#2563EB] hover:shadow-soft-card hover:-translate-y-0.5 transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#1E384C] group-hover:text-[#2563EB] transition-colors block">
                Xem lộ trình điều trị
              </span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-[#2563EB] group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Card 3: Hồ sơ sức khỏe (Amber Accent) */}
        <button
          type="button"
          onClick={() => onNavigateTab('profile')}
          className="p-4 rounded-3xl bg-white border border-[#FEF3C7] hover:border-[#D97706] hover:shadow-soft-card hover:-translate-y-0.5 transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FolderHeart className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#1E384C] group-hover:text-[#D97706] transition-colors block">
                Hồ sơ sức khỏe
              </span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-[#D97706] group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Card 4: Liên hệ hỗ trợ (Purple Accent) */}
        <button
          type="button"
          onClick={() => onNavigateTab('faq')}
          className="p-4 rounded-3xl bg-white border border-[#EDE9FE] hover:border-[#7C3AED] hover:shadow-soft-card hover:-translate-y-0.5 transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#1E384C] group-hover:text-[#7C3AED] transition-colors block">
                Liên hệ hỗ trợ
              </span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-[#7C3AED] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* ==================== 4. MIDDLE ROW (3 Cards: Dữ liệu thật hoặc Empty State chuẩn) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Lịch khám sắp tới (Hiển thị lịch thật hoặc Empty State) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F3]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#169C89]" />
                <h3 className="text-sm font-bold text-[#1E384C]">Lịch khám sắp tới</h3>
              </div>
              {nearestAppointment ? (
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  TRANG_THAI_MAP[nearestAppointment.trangThai]?.border || 'border-gray-200'
                } ${TRANG_THAI_MAP[nearestAppointment.trangThai]?.bg || 'bg-gray-50'} ${
                  TRANG_THAI_MAP[nearestAppointment.trangThai]?.text || 'text-gray-600'
                }`}>
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{TRANG_THAI_MAP[nearestAppointment.trangThai]?.label || nearestAppointment.trangThai}</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F0F5F3] text-[#7A9A93] border border-[#E3ECE9]">
                  Chưa có lịch hẹn
                </span>
              )}
            </div>

            {/* Nội dung: Lịch thật nếu có, hoặc Empty State trang nhã */}
            {nearestAppointment && parsedNearestDate ? (
              <div className="py-4 flex items-center gap-4">
                {/* Khối ngày thực tế từ DB */}
                <div className="w-24 h-24 rounded-2xl bg-[#E8F6F2] border border-[#CEEBE2] flex flex-col items-center justify-center p-2 text-center shrink-0">
                  <span className="text-[11px] font-semibold text-[#5A777E]">
                    {parsedNearestDate.dayOfWeek}
                  </span>
                  <span className="text-3xl font-black text-[#169C89] leading-none my-1">
                    {parsedNearestDate.dayNumber}
                  </span>
                  <span className="text-[11px] font-semibold text-[#5A777E]">
                    {parsedNearestDate.monthStr}
                  </span>
                </div>

                {/* Chi tiết lịch thật */}
                <div className="space-y-1.5 text-xs min-w-0">
                  <div className="flex items-center gap-2 text-[#344C52]">
                    <Clock className="h-3.5 w-3.5 text-[#169C89] shrink-0" />
                    <span className="font-semibold">
                      {CA_KHAM_TIME[nearestAppointment.caKham] || nearestAppointment.caKham}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[#1E384C]">
                    <Sparkles className="h-3.5 w-3.5 text-[#169C89] shrink-0" />
                    <span className="font-bold truncate">
                      {nearestAppointment.lyDoKham}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[#5A777E]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#169C89] shrink-0" />
                    <span className="truncate">
                      Phòng khám phân công bác sĩ
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State trang nhã khi chưa có lịch hẹn thật */
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="h-12 w-12 rounded-2xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center shadow-2xs">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#1E384C]">
                    Bạn chưa có lịch hẹn khám sắp tới
                  </h4>
                  <p className="text-[11px] text-[#7A9A93] max-w-xs leading-relaxed">
                    Đặt lịch trực tuyến để chọn ca sáng/chiều/tối và được bác sĩ chuyên khoa tiếp nhận.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            {nearestAppointment ? (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigateTab('appointments')}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-xs font-bold transition-colors shadow-2xs text-center"
                >
                  Xem chi tiết
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('booking')}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#169C89] text-[#169C89] hover:bg-[#E8F6F2] text-xs font-bold transition-colors text-center"
                >
                  Đổi lịch
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onNavigateTab('booking')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-xs font-bold transition-colors shadow-2xs text-center flex items-center justify-center gap-1.5"
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                <span>Đặt lịch khám ngay</span>
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Tiến độ điều trị (Trung thực với phân quyền Backend) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F3]">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-[#1E384C]">Tiến độ điều trị</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F0F5F3] text-[#7A9A93] border border-[#E3ECE9]">
                Theo phác đồ
              </span>
            </div>

            {/* Tooth Vector & Trạng thái phác đồ y khoa */}
            <div className="py-4 flex items-center gap-4">
              {/* Giữ nguyên hình minh họa Răng 3D */}
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-b from-[#F0F7F5] to-white border border-[#D5EAE3] flex items-center justify-center p-1 shrink-0 shadow-2xs">
                <ToothWithBraces className="w-16 h-16" />
              </div>

              {/* Thông tin trung thực */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#1E384C] block truncate">
                  Hồ sơ lộ trình điều trị
                </h4>
                <p className="text-[11px] text-[#7A9A93] leading-relaxed">
                  Bác sĩ sẽ kiểm tra và lập lộ trình sau buổi thăm khám trực tiếp tại phòng khám.
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F0F5F3] text-[#6B858D]">
                    <span>Chưa kích hoạt phác đồ</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-[#7A9A93] flex items-center gap-1.5 border-t border-[#F0F5F3]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#169C89] shrink-0" />
            <span>Phân quyền Backend: Bác sĩ điều trị trực tiếp cập nhật</span>
          </div>
        </div>

        {/* Card 3: Thông báo mới (Empty State trung thực) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F3]">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#169C89]" />
                <h3 className="text-sm font-bold text-[#1E384C]">Thông báo mới</h3>
              </div>
              <span className="text-xs text-[#7A9A93]">Hôm nay</span>
            </div>

            {/* Empty State Thông báo */}
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
              <div className="h-10 w-10 rounded-2xl bg-[#F0F5F3] text-[#7A9A93] flex items-center justify-center">
                <Bell className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#1E384C]">Không có thông báo mới</h4>
                <p className="text-[11px] text-[#7A9A93] max-w-xs leading-relaxed">
                  Mọi thông báo về trạng thái xác nhận lịch hẹn và lời dặn y khoa sẽ xuất hiện tại đây.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-[#7A9A93] border-t border-[#F0F5F3] text-right">
            Hệ thống thông báo tự động Nha Khoa Nụ Cười Xanh
          </div>
        </div>

      </div>

      {/* ==================== 5. BOTTOM ROW (Bảng dữ liệu thật & Mẹo chăm sóc) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Table Card (approx 68% width - 8 cols) */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-4">
          {/* Header Tabs */}
          <div className="flex items-center justify-between border-b border-[#F0F5F3] pb-3">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setActiveTableTab('upcoming')}
                className={`flex items-center gap-2 pb-3 -mb-3 text-xs sm:text-sm font-bold transition-all relative ${
                  activeTableTab === 'upcoming'
                    ? 'text-[#169C89] border-b-2 border-[#169C89]'
                    : 'text-[#6B858D] hover:text-[#1E384C]'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Lịch khám sắp tới</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTableTab('history')}
                className={`flex items-center gap-2 pb-3 -mb-3 text-xs sm:text-sm font-bold transition-all relative ${
                  activeTableTab === 'history'
                    ? 'text-[#169C89] border-b-2 border-[#169C89]'
                    : 'text-[#6B858D] hover:text-[#1E384C]'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>Lịch sử khám</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('booking')}
              className="text-xs font-semibold text-[#169C89] hover:underline hidden sm:block"
            >
              + Đặt lịch mới
            </button>
          </div>

          {/* Table Data (Dữ liệu thật từ MySQL) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#F0F5F3] text-[#7A9A93] font-semibold">
                  <th className="py-2.5 px-3">Ngày khám</th>
                  <th className="py-2.5 px-3">Dịch vụ</th>
                  <th className="py-2.5 px-3">Bác sĩ</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5F3]">
                {activeTableTab === 'upcoming' ? (
                  appointmentRequests.length > 0 ? (
                    appointmentRequests.map((req: YeuCauDatLich) => (
                      <tr key={req.maYeuCau} className="hover:bg-[#F6FAF9] transition-colors">
                        <td className="py-3 px-3 font-semibold text-[#1E384C] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#169C89]" />
                            <span>{req.ngayMongMuon}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-bold text-[#1E384C] whitespace-nowrap">
                          {req.lyDoKham}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-[#5A777E]">
                          Phòng khám phân công
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            TRANG_THAI_MAP[req.trangThai]?.border || 'border-gray-200'
                          } ${TRANG_THAI_MAP[req.trangThai]?.bg || 'bg-gray-50'} ${
                            TRANG_THAI_MAP[req.trangThai]?.text || 'text-gray-600'
                          }`}>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{TRANG_THAI_MAP[req.trangThai]?.label || req.trangThai}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onNavigateTab('appointments')}
                            className="text-xs font-semibold text-[#169C89] hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>Xem chi tiết</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    /* Empty State bảng Lịch sắp tới */
                    <tr>
                      <td colSpan={5} className="py-8 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="h-10 w-10 rounded-2xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <span className="text-xs font-bold text-[#1E384C]">
                            Chưa có yêu cầu đặt lịch nào
                          </span>
                          <p className="text-[11px] text-[#7A9A93] max-w-xs">
                            Bạn chưa gửi yêu cầu đặt lịch khám nào. Lịch hẹn sau khi gửi sẽ xuất hiện và cập nhật trạng thái tại đây.
                          </p>
                          <button
                            type="button"
                            onClick={() => onNavigateTab('booking')}
                            className="mt-1 px-3.5 py-1.5 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-[11px] font-bold transition-colors shadow-2xs inline-flex items-center gap-1.5"
                          >
                            <CalendarPlus className="h-3.5 w-3.5" />
                            <span>Gửi yêu cầu đặt lịch mới</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                ) : (
                  /* Empty State bảng Lịch sử khám */
                  <tr>
                    <td colSpan={5} className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="h-10 w-10 rounded-2xl bg-[#F0F5F3] text-[#7A9A93] flex items-center justify-center">
                          <Inbox className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold text-[#1E384C]">
                          Chưa có lịch sử khám trước đây
                        </span>
                        <p className="text-[11px] text-[#7A9A93] max-w-xs">
                          Các buổi khám đã hoàn thành tại phòng khám sẽ được lưu trữ và hiển thị tại mục này.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Tips Card (approx 32% width - 4 cols) */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F3]">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-[#F59E0B]" />
                <h3 className="text-sm font-bold text-[#1E384C]">Mẹo chăm sóc răng miệng</h3>
              </div>
              <button
                type="button"
                onClick={() => setCurrentTipIndex((prev) => (prev + 1) % DENTAL_TIPS.length)}
                className="text-xs font-semibold text-[#169C89] hover:underline"
              >
                Đổi mẹo &gt;
              </button>
            </div>

            {/* Tip Carousel Content with Image */}
            <div className="py-4 flex items-center gap-3">
              {/* Dental Photo */}
              <div className="relative h-20 w-24 rounded-2xl overflow-hidden shrink-0 border border-[#CEEBE2] shadow-2xs">
                <img
                  src={DENTAL_TIPS[currentTipIndex].image}
                  alt="Mẹo nha khoa"
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Text */}
              <div className="space-y-1 min-w-0">
                <h4 className="text-xs font-bold text-[#1E384C] leading-snug">
                  {DENTAL_TIPS[currentTipIndex].title}
                </h4>
                <p className="text-[11px] text-[#5A777E] leading-relaxed line-clamp-2">
                  {DENTAL_TIPS[currentTipIndex].desc}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows and Pagination Dots */}
          <div className="pt-2 flex items-center justify-between border-t border-[#F0F5F3]">
            {/* Previous Arrow */}
            <button
              type="button"
              onClick={() => setCurrentTipIndex((prev) => (prev > 0 ? prev - 1 : DENTAL_TIPS.length - 1))}
              className="p-1.5 rounded-xl border border-[#E3ECE9] hover:bg-[#E8F6F2] hover:text-[#169C89] text-[#5A777E] transition-colors"
              aria-label="Mẹo trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {DENTAL_TIPS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentTipIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentTipIndex
                      ? 'w-5 bg-[#169C89]'
                      : 'w-2 bg-[#D5E3DE] hover:bg-[#A8C7BE]'
                  }`}
                  aria-label={`Mẹo số ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={() => setCurrentTipIndex((prev) => (prev < DENTAL_TIPS.length - 1 ? prev + 1 : 0))}
              className="p-1.5 rounded-xl border border-[#E3ECE9] hover:bg-[#E8F6F2] hover:text-[#169C89] text-[#5A777E] transition-colors"
              aria-label="Mẹo tiếp theo"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
