import React from 'react';
import {
  Calendar,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import type {
  LichKhamBacSiResponse,
  DoctorKPISummary,
  DoctorNavTab
} from '@/types/doctor';
import { TRANG_THAI_LICH_MAP } from '@/types/doctor';

interface DoctorDashboardProps {
  schedule: LichKhamBacSiResponse[];
  kpis: DoctorKPISummary;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectTab: (tab: DoctorNavTab) => void;
  onSelectAppointment: (appointment: LichKhamBacSiResponse) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  schedule,
  kpis,
  loading,
  error,
  onRetry,
  onSelectTab,
  onSelectAppointment,
}) => {
  // Lấy ngày hôm nay theo giờ địa phương Việt Nam (YYYY-MM-DD)
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Lọc lịch hôm nay
  const todayAppointments = schedule.filter(item => item.ngayKham === todayStr);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Tổng quan Bác sĩ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Theo dõi lịch khám và tiến trình trong ngày của tài khoản đang đăng nhập
        </p>
      </div>

      {/* 2. Hero Banner matching design */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#DDF3ED] via-[#E8F8F5] to-[#F0FAF7] border border-[#C6EBE2] p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#BCE5DC] text-[11px] font-bold tracking-wider text-[#0F6F61] uppercase shadow-2xs mb-3">
            <Sparkles className="h-3 w-3 text-[#169C89]" />
            <span>BÁC SĨ • TỔNG QUAN</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0B4A40] tracking-tight">
            Một ngày làm việc thật hiệu quả!
          </h2>

          <p className="text-xs sm:text-sm text-[#25685D] mt-2 font-medium leading-relaxed max-w-xl">
            Lịch khám, tình trạng bệnh nhân và thao tác nhanh trong cùng một màn hình.
          </p>
        </div>

        {/* Mascot decoration on the right */}
        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center">
          <div className="h-28 w-28 lg:h-32 lg:w-32 rounded-full bg-[#169C89]/20 border-4 border-white/60 flex items-center justify-center shadow-soft-float">
            {/* Smile Tooth SVG */}
            <svg className="w-16 h-16 lg:w-20 lg:h-20 text-[#169C89]" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.5 2 6.5 4.5 6.5 7.5c0 2.5 1.2 5 2.2 7.5.8 2 1.5 4 3.3 4s2.5-2 3.3-4c1-2.5 2.2-5 2.2-7.5 0-3-2-5.5-5.5-5.5z" fill="#FFFFFF" />
              <path d="M12 3C8.8 3 7 5.2 7 8c0 2.4 1.2 4.8 2.2 7.2.7 1.8 1.4 3.3 2.8 3.6.3-1.8.8-3.2 1.3-4.5.3-.8.6-1.6.9-2.5.3.9.6 1.7.9 2.5.5 1.3 1 2.7 1.3 4.5 1.4-.3 2.1-1.8 2.8-3.6 1-2.4 2.2-4.8 2.2-7.2 0-2.8-1.8-5-5-5h-1.5z" fill="#34D399" />
              <circle cx="10" cy="8.5" r="1.1" fill="#063C36" />
              <circle cx="14" cy="8.5" r="1.1" fill="#063C36" />
              <path d="M9.5 11.5c1.2 1.2 3.8 1.2 5 0" stroke="#063C36" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              <circle cx="8" cy="10" r="0.8" fill="#F87171" opacity="0.6" />
              <circle cx="16" cy="10" r="0.8" fill="#F87171" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Error Banner if any */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Thử lại</span>
          </button>
        </div>
      )}

      {/* 4. 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-3xl p-5 border border-[#E3ECE9] shadow-soft-card flex flex-col justify-between hover:border-[#169C89]/40 transition-all">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#169C89]" />
            <span className="text-xs font-semibold text-slate-600">Tổng lịch hôm nay</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {loading ? (
                <div className="h-8 w-14 bg-slate-200 animate-pulse rounded-lg" />
              ) : (
                String(kpis.tongLichHomNay).padStart(2, '0')
              )}
            </span>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">lịch được phân công</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-3xl p-5 border border-[#E3ECE9] shadow-soft-card flex flex-col justify-between hover:border-[#059669]/40 transition-all">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#059669]" />
            <span className="text-xs font-semibold text-slate-600">Bệnh nhân đã đến</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-4xl font-extrabold text-[#059669] tracking-tight">
              {loading ? (
                <div className="h-8 w-14 bg-slate-200 animate-pulse rounded-lg" />
              ) : (
                String(kpis.benhNhanDaDen).padStart(2, '0')
              )}
            </span>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">đang chờ khám</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-3xl p-5 border border-[#E3ECE9] shadow-soft-card flex flex-col justify-between hover:border-[#0D9488]/40 transition-all">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0D9488]" />
            <span className="text-xs font-semibold text-slate-600">Đang khám</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-4xl font-extrabold text-[#0D9488] tracking-tight">
              {loading ? (
                <div className="h-8 w-14 bg-slate-200 animate-pulse rounded-lg" />
              ) : (
                String(kpis.dangKham).padStart(2, '0')
              )}
            </span>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">ca đang thực hiện</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-3xl p-5 border border-[#E3ECE9] shadow-soft-card flex flex-col justify-between hover:border-[#10B981]/40 transition-all">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
            <span className="text-xs font-semibold text-slate-600">Đã hoàn thành</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-4xl font-extrabold text-[#10B981] tracking-tight">
              {loading ? (
                <div className="h-8 w-14 bg-slate-200 animate-pulse rounded-lg" />
              ) : (
                String(kpis.daHoanThanh).padStart(2, '0')
              )}
            </span>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">ca đã kết thúc</p>
          </div>
        </div>
      </div>

      {/* 5. 2-Column Content Grid matching reference */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lịch khám trong ngày (2 spans) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E3ECE9] p-5 sm:p-6 shadow-soft-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  Lịch khám trong ngày
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Các ca được phân công từ hệ thống phòng khám ({todayAppointments.length} ca)
                </p>
              </div>

              <button
                onClick={() => onSelectTab('appointments')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#169C89] hover:text-[#0F6F61] transition-colors"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* List or Loading or Empty */}
            <div className="mt-4 space-y-3">
              {loading ? (
                <div className="space-y-3 py-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : todayAppointments.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <div className="h-14 w-14 mx-auto rounded-full bg-[#EBF7F4] flex items-center justify-center text-[#169C89] mb-3">
                    <Calendar className="h-7 w-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">Hôm nay chưa có lịch khám</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Bác sĩ hiện không có ca khám nào được phân công trong ngày hôm nay. Hãy kiểm tra các ngày khác trong mục Lịch khám.
                  </p>
                  <button
                    onClick={() => onSelectTab('appointments')}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#169C89] text-white text-xs font-bold hover:bg-[#0F6F61] transition-all shadow-xs"
                  >
                    Xem toàn bộ lịch hẹn
                  </button>
                </div>
              ) : (
                todayAppointments.slice(0, 5).map((app) => {
                  const statusInfo = TRANG_THAI_LICH_MAP[app.trangThai];
                  const timeFormatted = app.gioBatDau?.slice(0, 5) || '--:--';

                  return (
                    <div
                      key={app.maLich}
                      onClick={() => {
                        onSelectAppointment(app);
                        onSelectTab('appointments');
                      }}
                      className="group p-3.5 sm:p-4 rounded-2xl border border-slate-100 hover:border-[#169C89]/50 hover:bg-[#F9FCFB] transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Time pill */}
                        <div className="px-2.5 py-1.5 rounded-xl bg-slate-100 group-hover:bg-[#EBF7F4] text-xs font-mono font-bold text-slate-700 group-hover:text-[#169C89] shrink-0 transition-colors">
                          {timeFormatted}
                        </div>

                        {/* Patient info */}
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate group-hover:text-[#169C89] transition-colors">
                            {app.hoTenBenhNhan}
                          </p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {app.lyDoKham || 'Khám tổng quát'} • {app.tenPhong || 'Phòng khám'}
                          </p>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="shrink-0">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo?.badgeClass || 'bg-slate-100 text-slate-600'}`}>
                          {statusInfo?.label || app.trangThai}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Bottom hint */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Dữ liệu thời gian thực từ Spring Boot Backend</span>
            <button
              onClick={onRetry}
              className="text-[#169C89] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Cập nhật</span>
            </button>
          </div>
        </div>

        {/* Right Column: Quy trình khám (1 span) */}
        <div className="bg-white rounded-3xl border border-[#E3ECE9] p-5 sm:p-6 shadow-soft-card flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                Quy trình khám
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Trạng thái theo Backend
              </p>
            </div>

            {/* Stepper matching reference */}
            <div className="mt-5 space-y-4">
              {/* Step 1 */}
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-[#EBF7F4] text-[#169C89] border border-[#BCE5DC] font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800">Đã xác nhận / Chờ xác nhận</p>
                  <p className="text-[11px] text-slate-400">Lịch được xếp từ phòng khám</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-[#EBF7F4] text-[#169C89] border border-[#BCE5DC] font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800">Bệnh nhân đã đến</p>
                  <p className="text-[11px] text-slate-400">Đã có mặt tại phòng chờ</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-[#EBF7F4] text-[#169C89] border border-[#BCE5DC] font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800">Bắt đầu khám</p>
                  <p className="text-[11px] text-slate-400">Tiến hành khám và can thiệp</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-[#EBF7F4] text-[#169C89] border border-[#BCE5DC] font-bold text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800">Hoàn thành</p>
                  <p className="text-[11px] text-slate-400">Kết thúc ca và đồng bộ phác đồ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Note card at bottom matching mockup */}
          <div className="mt-6 p-3.5 rounded-2xl bg-[#F0FAF7] border border-[#D5EFE8] text-center">
            <span className="text-xs font-semibold text-[#0F6F61]">
              Chỉ cập nhật trạng thái hợp lệ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
