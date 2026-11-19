import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  User,
  AlertTriangle,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Stethoscope
} from 'lucide-react';
import type {
  LichKhamBacSiResponse,
  TrangThaiDatLich,
  DoctorKPISummary,
  DoctorNavTab
} from '@/types/doctor';
import { TRANG_THAI_LICH_MAP } from '@/types/doctor';
import { DoctorPatientModal } from './DoctorPatientModal';
import { DoctorStatusConfirmModal } from './DoctorStatusConfirmModal';

interface DoctorAppointmentsProps {
  schedule: LichKhamBacSiResponse[];
  kpis: DoctorKPISummary;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUpdateStatus: (maLich: string, trangThai: TrangThaiDatLich) => Promise<void>;
  selectedAppointment: LichKhamBacSiResponse | null;
  onSelectAppointment: (appointment: LichKhamBacSiResponse | null) => void;
  onSelectTab?: (tab: DoctorNavTab) => void;
}

type DateFilterOption = 'today' | 'tomorrow' | 'all';

export const DoctorAppointments: React.FC<DoctorAppointmentsProps> = ({
  schedule,
  kpis,
  loading,
  error,
  onRetry,
  searchQuery,
  onSearchChange,
  onUpdateStatus,
  selectedAppointment,
  onSelectAppointment,
  onSelectTab,
}) => {
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('today');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState<boolean>(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    appointment: LichKhamBacSiResponse | null;
    targetStatus: TrangThaiDatLich | null;
  }>({
    appointment: null,
    targetStatus: null,
  });
  const [isSubmittingStatus, setIsSubmittingStatus] = useState<boolean>(false);

  // Helper tính ngày theo giờ địa phương Việt Nam
  const getVietnamDate = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const todayStr = getVietnamDate(0);
  const tomorrowStr = getVietnamDate(1);

  // Lọc và sắp xếp danh sách lịch khám
  const filteredSchedule = useMemo(() => {
    return schedule.filter((item) => {
      // 1. Lọc theo ngày
      if (dateFilter === 'today' && item.ngayKham !== todayStr) return false;
      if (dateFilter === 'tomorrow' && item.ngayKham !== tomorrowStr) return false;

      // 2. Lọc theo trạng thái
      if (statusFilter !== 'ALL' && item.trangThai !== statusFilter) return false;

      // 3. Tìm kiếm theo tên hoặc mã lịch
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.hoTenBenhNhan?.toLowerCase().includes(query);
        const matchId = item.maLich?.toLowerCase().includes(query);
        const matchPhone = item.soDienThoaiBenhNhan?.includes(query);
        if (!matchName && !matchId && !matchPhone) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sắp xếp theo ngày tăng dần, sau đó theo giờ tăng dần
      if (a.ngayKham !== b.ngayKham) {
        return a.ngayKham.localeCompare(b.ngayKham);
      }
      return (a.gioBatDau || '').localeCompare(b.gioBatDau || '');
    });
  }, [schedule, dateFilter, statusFilter, searchQuery, todayStr, tomorrowStr]);

  // Tự động chọn phần tử đầu tiên nếu chưa có phần tử được chọn
  const activeAppointment = useMemo(() => {
    if (selectedAppointment && filteredSchedule.some(s => s.maLich === selectedAppointment.maLich)) {
      return selectedAppointment;
    }
    return filteredSchedule.length > 0 ? filteredSchedule[0] : null;
  }, [selectedAppointment, filteredSchedule]);

  const handleOpenStatusConfirm = (appointment: LichKhamBacSiResponse, targetStatus: TrangThaiDatLich) => {
    setConfirmModalData({
      appointment,
      targetStatus,
    });
  };

  const handleExecuteStatusUpdate = async () => {
    if (!confirmModalData.appointment || !confirmModalData.targetStatus || isSubmittingStatus) {
      return;
    }

    setIsSubmittingStatus(true);
    try {
      await onUpdateStatus(
        confirmModalData.appointment.maLich,
        confirmModalData.targetStatus
      );
      setConfirmModalData({ appointment: null, targetStatus: null });
    } catch (e) {
      console.error('Lỗi chuyển trạng thái:', e);
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  // Xác định ngày hiển thị ở tiêu đề danh sách
  const getDateHeaderLabel = () => {
    if (dateFilter === 'today') {
      const todayDate = new Date();
      return `Hôm nay • ${todayDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}`;
    }
    if (dateFilter === 'tomorrow') {
      const tomDate = new Date();
      tomDate.setDate(tomDate.getDate() + 1);
      return `Ngày mai • ${tomDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}`;
    }
    return `Tất cả lịch khám • ${filteredSchedule.length} ca`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Lịch khám của tôi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Chỉ hiển thị các lịch khám được phân công cho bác sĩ đang đăng nhập
        </p>
      </div>

      {/* 2. Filter Bar Card matching mockup */}
      <div className="bg-white rounded-3xl p-5 border border-[#E3ECE9] shadow-soft-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Chọn ngày: Segmented Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Chọn ngày
            </label>
            <div className="flex items-center p-1 bg-[#F5F8F7] border border-[#E0EBE8] rounded-2xl">
              <button
                onClick={() => setDateFilter('today')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  dateFilter === 'today'
                    ? 'bg-white text-[#169C89] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hôm nay
              </button>
              <button
                onClick={() => setDateFilter('tomorrow')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  dateFilter === 'tomorrow'
                    ? 'bg-white text-[#169C89] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ngày mai
              </button>
              <button
                onClick={() => setDateFilter('all')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  dateFilter === 'all'
                    ? 'bg-white text-[#169C89] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả
              </button>
            </div>
          </div>

          {/* Trạng thái dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Trạng thái
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2 text-xs md:text-sm bg-[#F5F8F7] border border-[#E0EBE8] rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89] transition-all text-slate-700 font-medium"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="CHO_BENH_NHAN_XAC_NHAN">Chờ xác nhận</option>
                <option value="DA_XAC_NHAN">Đã xác nhận</option>
                <option value="DA_DEN">Đã đến</option>
                <option value="DANG_KHAM">Đang khám</option>
                <option value="HOAN_THANH">Hoàn thành</option>
                <option value="VANG_MAT">Vắng mặt</option>
                <option value="DA_HUY">Đã hủy</option>
              </select>
            </div>
          </div>

          {/* Tìm theo tên / mã lịch */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Tìm theo tên / mã lịch
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm lịch khám..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs md:text-sm bg-[#F5F8F7] border border-[#E0EBE8] rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89] transition-all text-slate-700 placeholder:text-slate-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. 4 Mini KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#E3ECE9] shadow-soft-card flex items-center gap-3">
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {loading ? '--' : String(kpis.tongLichHomNay).padStart(2, '0')}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 leading-tight">
            Tổng lịch được phân công
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E3ECE9] shadow-soft-card flex items-center gap-3">
          <div className="text-xl sm:text-2xl font-black text-[#059669]">
            {loading ? '--' : String(kpis.benhNhanDaDen).padStart(2, '0')}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 leading-tight">
            Đã đến
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E3ECE9] shadow-soft-card flex items-center gap-3">
          <div className="text-xl sm:text-2xl font-black text-[#0D9488]">
            {loading ? '--' : String(kpis.dangKham).padStart(2, '0')}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 leading-tight">
            Đang khám
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E3ECE9] shadow-soft-card flex items-center gap-3">
          <div className="text-xl sm:text-2xl font-black text-[#10B981]">
            {loading ? '--' : String(kpis.daHoanThanh).padStart(2, '0')}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 leading-tight">
            Hoàn thành
          </div>
        </div>
      </div>

      {/* 4. Error state if any */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
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

      {/* 5. 2-Column Content Grid: List + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Danh sách ca khám (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E3ECE9] p-5 sm:p-6 shadow-soft-card flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  Danh sách ca khám
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {getDateHeaderLabel()}
                </p>
              </div>

              <span className="text-xs font-bold text-[#169C89] bg-[#EBF7F4] px-2.5 py-1 rounded-full border border-[#BCE5DC]">
                {filteredSchedule.length} ca
              </span>
            </div>

            {/* Appointment cards list */}
            <div className="mt-4 space-y-3">
              {loading ? (
                <div className="space-y-3 py-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : filteredSchedule.length === 0 ? (
                <div className="py-14 text-center">
                  <div className="h-14 w-14 mx-auto rounded-full bg-[#EBF7F4] flex items-center justify-center text-[#169C89] mb-3">
                    <Calendar className="h-7 w-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">Không có ca khám nào phù hợp</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Không tìm thấy lịch khám nào khớp với bộ lọc ngày và trạng thái hiện tại.
                  </p>
                  {(dateFilter !== 'all' || statusFilter !== 'ALL' || searchQuery) && (
                    <button
                      onClick={() => {
                        setDateFilter('all');
                        setStatusFilter('ALL');
                        onSearchChange('');
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-[#EBF7F4] text-[#169C89] text-xs font-bold hover:bg-[#D5EFE8] transition-all"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              ) : (
                filteredSchedule.map((app) => {
                  const isSelected = activeAppointment?.maLich === app.maLich;
                  const statusInfo = TRANG_THAI_LICH_MAP[app.trangThai];
                  const timeFormatted = app.gioBatDau?.slice(0, 5) || '--:--';

                  // Xác định nút thao tác nhanh
                  const canMarkArrived = app.trangThai === 'DA_XAC_NHAN' || app.trangThai === 'CHO_BENH_NHAN_XAC_NHAN';
                  const canStartExam = app.trangThai === 'DA_DEN';
                  const canFinishExam = app.trangThai === 'DANG_KHAM';

                  return (
                    <div
                      key={app.maLich}
                      onClick={() => onSelectAppointment(app)}
                      className={`group p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#169C89] bg-[#F7FCFA] shadow-md ring-2 ring-[#169C89]/20'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-[#FAFDFB]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Time badge */}
                          <div className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0 ${
                            isSelected
                              ? 'bg-[#169C89] text-white'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-[#EBF7F4] group-hover:text-[#169C89]'
                          }`}>
                            {timeFormatted}
                          </div>

                          {/* Info */}
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 truncate">
                              {app.hoTenBenhNhan}
                            </h4>
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {app.tenPhong} • {app.lyDoKham || 'Khám điều trị'}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusInfo?.badgeClass}`}>
                            {statusInfo?.label || app.trangThai}
                          </span>
                        </div>
                      </div>

                      {/* Quick Action Button below row matching mockup */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-mono">
                          Mã: {app.maLich.slice(0, 8)}...
                        </span>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          {canMarkArrived && (
                            <>
                              <button
                                onClick={() => handleOpenStatusConfirm(app, 'DA_DEN')}
                                className="px-3 py-1 rounded-xl bg-[#E8F8F5] text-[#169C89] hover:bg-[#169C89] hover:text-white text-xs font-bold border border-[#BCE5DC] transition-all"
                              >
                                Xác nhận đã đến
                              </button>
                              <button
                                onClick={() => handleOpenStatusConfirm(app, 'VANG_MAT')}
                                className="p-1 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Báo vắng mặt"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          {canStartExam && (
                            <button
                              onClick={() => handleOpenStatusConfirm(app, 'DANG_KHAM')}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                            >
                              <PlayCircle className="h-3.5 w-3.5" />
                              <span>Bắt đầu khám</span>
                            </button>
                          )}

                          {canFinishExam && (
                            <button
                              onClick={() => handleOpenStatusConfirm(app, 'HOAN_THANH')}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Hoàn tất ca khám</span>
                            </button>
                          )}

                          {app.trangThai === 'HOAN_THANH' && (
                            <span className="text-xs text-slate-400 font-medium">
                              Đã hoàn thành ca
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Dữ liệu lịch khám cập nhật trực tiếp</span>
            <button
              onClick={onRetry}
              className="text-[#169C89] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {/* Right Column: Chi tiết lịch đã chọn (5 cols) matching mockup */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E3ECE9] p-5 sm:p-6 shadow-soft-card flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                Chi tiết lịch đã chọn
              </h3>
              {activeAppointment ? (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF7F4] border border-[#BCE5DC] text-xs font-bold text-[#169C89]">
                  <User className="h-3.5 w-3.5" />
                  <span>{activeAppointment.hoTenBenhNhan}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-400 mt-1">Chưa chọn ca khám nào</p>
              )}
            </div>

            {activeAppointment ? (
              <div className="mt-4 space-y-3.5">
                {/* Detail rows matching mockup */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400">Ngày khám</span>
                    <span className="font-bold text-slate-800">{activeAppointment.ngayKham}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400">Giờ khám</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {activeAppointment.gioBatDau?.slice(0, 5)} - {activeAppointment.gioKetThuc?.slice(0, 5)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400">Phòng</span>
                    <span className="font-bold text-slate-800">{activeAppointment.tenPhong}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400">Lý do khám</span>
                    <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">
                      {activeAppointment.lyDoKham || 'Tư vấn điều trị'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400 shrink-0">Dị ứng thuốc</span>
                    <span className={`font-semibold text-right max-w-[200px] ${
                      activeAppointment.diUngThuoc ? 'text-rose-600' : 'text-slate-500'
                    }`}>
                      {activeAppointment.diUngThuoc || 'Chưa ghi nhận'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400 shrink-0">Tiền sử bệnh</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[200px]">
                      {activeAppointment.tienSuBenh || 'Chưa ghi nhận'}
                    </span>
                  </div>
                </div>

                {/* Workflow Status Actions Box */}
                <div className="p-4 rounded-2xl bg-[#F8FAFA] border border-slate-100 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Thao tác tiến trình ca khám
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {(activeAppointment.trangThai === 'DA_XAC_NHAN' || activeAppointment.trangThai === 'CHO_BENH_NHAN_XAC_NHAN') && (
                      <>
                        <button
                          onClick={() => handleOpenStatusConfirm(activeAppointment, 'DA_DEN')}
                          className="flex-1 px-3 py-2 rounded-xl bg-[#169C89] hover:bg-[#0F6F61] text-white text-xs font-bold transition-all shadow-xs"
                        >
                          Xác nhận đã đến
                        </button>
                        <button
                          onClick={() => handleOpenStatusConfirm(activeAppointment, 'VANG_MAT')}
                          className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all"
                        >
                          Báo vắng mặt
                        </button>
                      </>
                    )}

                    {activeAppointment.trangThai === 'DA_DEN' && (
                      <div className="flex flex-col gap-2 w-full">
                        <button
                          onClick={() => handleOpenStatusConfirm(activeAppointment, 'DANG_KHAM')}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                        >
                          <PlayCircle className="h-4 w-4" />
                          <span>Bắt đầu khám bệnh nhân</span>
                        </button>
                        {onSelectTab && (
                          <button
                            onClick={() => {
                              onSelectAppointment(activeAppointment);
                              onSelectTab('consultation');
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-teal-50 text-[#169C89] text-xs font-bold border border-[#169C89]/30 transition-all"
                          >
                            <Stethoscope className="h-3.5 w-3.5" />
                            <span>Mở bàn khám & Điều trị (FE-3.3)</span>
                          </button>
                        )}
                      </div>
                    )}

                    {activeAppointment.trangThai === 'DANG_KHAM' && (
                      <div className="flex flex-col gap-2 w-full">
                        {onSelectTab && (
                          <button
                            onClick={() => {
                              onSelectAppointment(activeAppointment);
                              onSelectTab('consultation');
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#169C89] hover:bg-[#0F6F61] text-white text-xs font-bold transition-all shadow-xs"
                          >
                            <Stethoscope className="h-4 w-4" />
                            <span>Vào bàn khám & Điều trị (FE-3.3)</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenStatusConfirm(activeAppointment, 'HOAN_THANH')}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Hoàn tất ca khám này</span>
                        </button>
                      </div>
                    )}

                    {activeAppointment.trangThai === 'HOAN_THANH' && (
                      <div className="w-full p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs text-center font-bold border border-emerald-200">
                        Ca khám đã hoàn tất thành công
                      </div>
                    )}

                    {activeAppointment.trangThai === 'VANG_MAT' && (
                      <div className="w-full p-2.5 rounded-xl bg-rose-50 text-rose-800 text-xs text-center font-bold border border-rose-200">
                        Bệnh nhân vắng mặt
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-slate-400">
                Chọn một ca khám từ danh sách bên trái để xem chi tiết
              </div>
            )}
          </div>

          {/* Primary View Details Button matching mockup */}
          <div className="mt-6">
            <button
              disabled={!activeAppointment}
              onClick={() => setIsPatientModalOpen(true)}
              className="w-full py-3 rounded-2xl bg-[#169C89] hover:bg-[#0F6F61] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Eye className="h-4 w-4" />
              <span>Xem chi tiết bệnh nhân</span>
            </button>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      <DoctorPatientModal
        isOpen={isPatientModalOpen}
        appointment={activeAppointment}
        onClose={() => setIsPatientModalOpen(false)}
      />

      {/* Status Confirmation Modal */}
      <DoctorStatusConfirmModal
        isOpen={Boolean(confirmModalData.appointment && confirmModalData.targetStatus)}
        appointment={confirmModalData.appointment}
        targetStatus={confirmModalData.targetStatus}
        isSubmitting={isSubmittingStatus}
        onConfirm={handleExecuteStatusUpdate}
        onClose={() => setConfirmModalData({ appointment: null, targetStatus: null })}
      />
    </div>
  );
};
