import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar,
  User,
  MapPin,
  AlertTriangle,
  ShieldAlert,
  HeartPulse,
  PlayCircle,
  CheckCircle2,
  Clock,
  Link2,
  RefreshCw,
  Loader2,
  FileText,
  Phone,
  Mail,
  ShieldCheck,
  Stethoscope,
  Info
} from 'lucide-react';
import type {
  LichKhamBacSiResponse,
  BenhNhanTrongLichResponse,
  TrangThaiDatLich,
  BuoiDieuTriResponse,
  DoctorNavTab
} from '@/types/doctor';
import { TRANG_THAI_LICH_MAP, TRANG_THAI_BUOI_MAP } from '@/types/doctor';
import { doctorService } from '@/services/doctor.service';
import { DoctorStatusConfirmModal } from './DoctorStatusConfirmModal';
import { DoctorLinkSessionModal } from './DoctorLinkSessionModal';

interface DoctorConsultationProps {
  schedule: LichKhamBacSiResponse[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  selectedAppointment: LichKhamBacSiResponse | null;
  onSelectAppointment: (appointment: LichKhamBacSiResponse | null) => void;
  onUpdateStatus: (maLich: string, trangThai: TrangThaiDatLich) => Promise<void>;
  onSelectTab: (tab: DoctorNavTab) => void;
}

export const DoctorConsultation: React.FC<DoctorConsultationProps> = ({
  schedule,
  loading,
  error,
  onRetry,
  selectedAppointment,
  onSelectAppointment,
  onUpdateStatus,
  onSelectTab,
}) => {
  // Lọc lịch (Hôm nay / Tất cả)
  const [dateFilter, setDateFilter] = useState<'today' | 'all'>('today');

  // Dữ liệu bệnh nhân chi tiết của ca khám đang chọn
  const [patientDetail, setPatientDetail] = useState<BenhNhanTrongLichResponse | null>(null);
  const [patientLoading, setPatientLoading] = useState<boolean>(false);
  const [patientError, setPatientError] = useState<string | null>(null);

  // Buổi điều trị liên kết với ca khám hiện tại
  const [linkedSession, setLinkedSession] = useState<BuoiDieuTriResponse | null>(null);
  const [sessionLoading, setSessionLoading] = useState<boolean>(false);
  const [unlinkError, setUnlinkError] = useState<string | null>(null);

  // Modals
  const [isLinkModalOpen, setIsLinkModalOpen] = useState<boolean>(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    appointment: LichKhamBacSiResponse | null;
    targetStatus: TrangThaiDatLich | null;
  }>({
    appointment: null,
    targetStatus: null,
  });
  const [isSubmittingStatus, setIsSubmittingStatus] = useState<boolean>(false);

  // Test hook to allow QA verification of locked link modal
  useEffect(() => {
    const handleTestOpen = () => setIsLinkModalOpen(true);
    window.addEventListener('open_doctor_link_modal', handleTestOpen);
    return () => window.removeEventListener('open_doctor_link_modal', handleTestOpen);
  }, []);

  // Helper tính ngày theo giờ địa phương Việt Nam
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Lọc danh sách theo ngày
  const filteredSchedule = useMemo(() => {
    return schedule.filter((item) => {
      if (dateFilter === 'today' && item.ngayKham !== todayStr) return false;
      return true;
    }).sort((a, b) => {
      if (a.ngayKham !== b.ngayKham) return a.ngayKham.localeCompare(b.ngayKham);
      return (a.gioBatDau || '').localeCompare(b.gioBatDau || '');
    });
  }, [schedule, dateFilter, todayStr]);

  // Tự động chọn ca khám đầu tiên nếu chưa chọn ca nào
  const activeAppointment = useMemo(() => {
    if (selectedAppointment && schedule.some(s => s.maLich === selectedAppointment.maLich)) {
      return selectedAppointment;
    }
    return filteredSchedule.length > 0 ? filteredSchedule[0] : (schedule.length > 0 ? schedule[0] : null);
  }, [selectedAppointment, schedule, filteredSchedule]);

  // Load chi tiết bệnh nhân khi đổi ca khám
  const loadPatientDetail = useCallback(async (app: LichKhamBacSiResponse) => {
    setPatientLoading(true);
    setPatientError(null);
    try {
      const data = await doctorService.getPatientInSchedule(app.maLich);
      setPatientDetail(data);
    } catch (err: any) {
      console.warn('Không thể tải chi tiết bệnh nhân:', err);
      setPatientError(err.message || 'Không thể tải chi tiết hồ sơ bệnh nhân.');
      setPatientDetail(null);
    } finally {
      setPatientLoading(false);
    }
  }, []);

  // Load buổi điều trị liên kết (nếu có)
  const loadLinkedSession = useCallback(async (app: LichKhamBacSiResponse) => {
    if (!app || !app.maBenhNhan || !app.maLich) {
      setLinkedSession(null);
      setSessionLoading(false);
      return;
    }
    setSessionLoading(true);
    setUnlinkError(null);
    try {
      const plans = await doctorService.getPatientTreatmentPlans(app.maBenhNhan);
      if (Array.isArray(plans) && plans.length > 0) {
        let matched: BuoiDieuTriResponse | null = null;
        for (const plan of plans) {
          const sessions = await doctorService.getTreatmentPlanSessions(plan.maLoTrinhDieuTri);
          if (Array.isArray(sessions)) {
            const found = sessions.find((s) => s.maLichKham === app.maLich);
            if (found) {
              matched = found;
              break;
            }
          }
        }
        setLinkedSession(matched);
      } else {
        setLinkedSession(null);
      }
    } catch (err) {
      console.warn('Không thể nạp thông tin buổi điều trị liên kết:', err);
      setLinkedSession(null);
    } finally {
      setSessionLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeAppointment) {
      loadPatientDetail(activeAppointment);
      loadLinkedSession(activeAppointment);
    } else {
      setPatientDetail(null);
      setLinkedSession(null);
    }
  }, [activeAppointment, loadPatientDetail, loadLinkedSession]);

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
      if (activeAppointment) {
        loadLinkedSession(activeAppointment);
      }
    } catch (e) {
      console.error('Lỗi chuyển trạng thái:', e);
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  const handleUnlinkSession = async () => {
    if (!linkedSession || !linkedSession.maLoTrinhDieuTri || !linkedSession.maBuoiDieuTri) return;
    setUnlinkError(null);
    try {
      setSessionLoading(true);
      await doctorService.unlinkSessionFromAppointment(
        linkedSession.maLoTrinhDieuTri,
        linkedSession.maBuoiDieuTri
      );
      setLinkedSession(null);
    } catch (e: any) {
      console.error('Lỗi khi hủy liên kết buổi điều trị:', e);
      setUnlinkError(e.message || 'Không thể gỡ liên kết buổi điều trị. Lưu ý: Chỉ được gỡ khi ca khám bị hủy hoặc vắng mặt.');
    } finally {
      setSessionLoading(false);
    }
  };

  const currentStatusInfo = activeAppointment ? TRANG_THAI_LICH_MAP[activeAppointment.trangThai] : null;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF7F4] border border-[#BCE5DC] text-[11px] font-bold tracking-wider text-[#169C89] uppercase shadow-2xs mb-1.5">
            <Stethoscope className="h-3.5 w-3.5" />
            <span>BÀN KHÁM LÂM SÀNG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Khám & Điều trị
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tiếp nhận bệnh nhân, kiểm tra tiền sử y tế và thực hiện can thiệp nha khoa
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-[#E0EBE8] text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#169C89]" />
            <span>Làm mới ca khám</span>
          </button>
        </div>
      </div>

      {/* 2. Error Banner if any */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={onRetry}
            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors shrink-0"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* 3. Three-Column Medical Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* =========================================================================
            CỘT 1 (3 cols): DANH SÁCH LỊCH KHÁM CỦA TÔI
        ========================================================================= */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-[#E3ECE9] p-4 sm:p-5 shadow-soft-card flex flex-col justify-between max-h-[820px]">
          <div>
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  Hàng chờ khám
                </h3>
                <p className="text-[11px] text-slate-400">
                  {dateFilter === 'today' ? 'Các ca hôm nay' : 'Tất cả các ca'} ({filteredSchedule.length})
                </p>
              </div>

              {/* Segmented Filter */}
              <div className="inline-flex p-0.5 bg-[#F5F8F7] rounded-xl border border-slate-200/80 text-[11px]">
                <button
                  onClick={() => setDateFilter('today')}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                    dateFilter === 'today' ? 'bg-white text-[#169C89] shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Hôm nay
                </button>
                <button
                  onClick={() => setDateFilter('all')}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                    dateFilter === 'all' ? 'bg-white text-[#169C89] shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Tất cả
                </button>
              </div>
            </div>

            {/* List */}
            <div className="mt-3 space-y-2.5 overflow-y-auto max-h-[660px] pr-1">
              {loading ? (
                <div className="space-y-2.5 py-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : filteredSchedule.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="h-12 w-12 mx-auto rounded-full bg-[#EBF7F4] flex items-center justify-center text-[#169C89] mb-2">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">Chưa có ca khám</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1">
                    Không có lịch hẹn nào trong hàng chờ.
                  </p>
                  <button
                    onClick={() => onSelectTab('appointments')}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-[#EBF7F4] text-[#169C89] text-xs font-bold hover:bg-[#D5EFE8] transition-all"
                  >
                    Xem mục Lịch khám
                  </button>
                </div>
              ) : (
                filteredSchedule.map((app) => {
                  const isSelected = activeAppointment?.maLich === app.maLich;
                  const statusInfo = TRANG_THAI_LICH_MAP[app.trangThai];
                  const timeFormatted = app.gioBatDau?.slice(0, 5) || '--:--';

                  return (
                    <div
                      key={app.maLich}
                      onClick={() => onSelectAppointment(app)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#169C89] bg-[#E8F8F5]/50 ring-2 ring-[#169C89]/20 shadow-xs'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-[#FAFDFB]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold ${
                          isSelected ? 'bg-[#169C89] text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {timeFormatted}
                        </span>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${statusInfo?.badgeClass}`}>
                          {statusInfo?.label || app.trangThai}
                        </span>
                      </div>

                      <div className="mt-1.5">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {app.hoTenBenhNhan}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {app.tenPhong} • {app.lyDoKham || 'Khám răng'}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            CỘT 2 (4 cols): HỒ SƠ BỆNH NHÂN LÂM SÀNG
        ========================================================================= */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E3ECE9] p-5 sm:p-6 shadow-soft-card flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Hồ sơ bệnh nhân
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Thông tin y tế lâm sàng ca hiện tại
                </p>
              </div>

              {activeAppointment && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {activeAppointment.maBenhNhan}
                </span>
              )}
            </div>

            {/* Content */}
            {activeAppointment ? (
              <div className="mt-4 space-y-4">
                {patientLoading && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-50/60 text-teal-700 text-xs">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang nạp hồ sơ chi tiết bệnh nhân...</span>
                  </div>
                )}
                {patientError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 text-amber-700 text-xs">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>{patientError}</span>
                  </div>
                )}

                {/* Patient Header Summary */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFA] border border-slate-100">
                  <div className="h-11 w-11 rounded-2xl bg-[#169C89] text-white font-bold text-base flex items-center justify-center shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-slate-800 truncate">
                      {activeAppointment.hoTenBenhNhan}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {activeAppointment.ngaySinhBenhNhan || patientDetail?.ngaySinh || 'Chưa có thông tin'} • {
                        (activeAppointment.gioiTinhBenhNhan || patientDetail?.gioiTinh) === 'NAM'
                          ? 'Nam'
                          : (activeAppointment.gioiTinhBenhNhan || patientDetail?.gioiTinh) === 'NU'
                          ? 'Nữ'
                          : 'Chưa có thông tin'
                      }
                    </p>
                  </div>
                </div>

                {/* 1. HERO ALERT CARD: DỊ ỨNG THUỐC */}
                <div className="p-4 rounded-2xl bg-rose-50/80 border-2 border-rose-200/90 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs uppercase tracking-wider">
                    <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>DỊ ỨNG THUỐC (LƯU Ý ĐẶC BIỆT)</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-rose-950 pl-6">
                    {patientDetail?.diUngThuoc?.trim() || activeAppointment.diUngThuoc?.trim() || 'Chưa có thông tin'}
                  </p>
                </div>

                {/* 2. HERO ALERT CARD: TIỀN SỬ BỆNH */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
                    <HeartPulse className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>TIỀN SỬ BỆNH & BỆNH NỀN</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-amber-950 pl-6">
                    {patientDetail?.tienSuBenh?.trim() || activeAppointment.tienSuBenh?.trim() || 'Chưa có thông tin'}
                  </p>
                </div>

                {/* 3. Reason for Visit */}
                <div className="p-3.5 rounded-2xl border border-slate-100 bg-white space-y-1">
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                    <FileText className="h-3.5 w-3.5 text-[#169C89]" />
                    <span>Lý do đến khám:</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 pl-5">
                    {activeAppointment.lyDoKham?.trim() || 'Chưa có thông tin'}
                  </p>
                </div>

                {/* Contact details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{activeAppointment.soDienThoaiBenhNhan || patientDetail?.soDienThoai || 'Chưa có thông tin'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{activeAppointment.emailBenhNhan || patientDetail?.email || 'Chưa có thông tin'}</span>
                  </div>
                </div>

                {/* Patient Address */}
                {patientDetail?.diaChi && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{patientDetail.diaChi}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                <User className="h-10 w-10 mx-auto text-slate-300" />
                <p>Chọn một ca khám từ cột bên trái để nạp hồ sơ bệnh nhân</p>
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
            <span>Hồ sơ được bảo mật, chỉ truy cập trong phạm vi ca khám phân công.</span>
          </div>
        </div>

        {/* =========================================================================
            CỘT 3 (5 cols): THÔNG TIN CA KHÁM & BUỔI ĐIỀU TRỊ
        ========================================================================= */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E3ECE9] p-5 sm:p-6 shadow-soft-card flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Thông tin ca khám & Buổi điều trị
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Thao tác lâm sàng và liên kết phác đồ nha khoa
                </p>
              </div>

              {currentStatusInfo && (
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold border ${currentStatusInfo.badgeClass}`}>
                  {currentStatusInfo.label}
                </span>
              )}
            </div>

            {activeAppointment ? (
              <div className="mt-4 space-y-4">
                {/* 1. Appointment Info Header */}
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-[#F8FAFA] border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phòng khám:</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-[#169C89]" />
                      {activeAppointment.tenPhong}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Thời gian hẹn:</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5 font-mono">
                      <Clock className="h-3.5 w-3.5 text-[#169C89]" />
                      {activeAppointment.gioBatDau?.slice(0, 5)} - {activeAppointment.gioKetThuc?.slice(0, 5)}
                    </span>
                  </div>
                </div>

                {/* 2. State Transition Action Bar */}
                <div className="p-4 rounded-2xl bg-[#EBF7F4]/60 border border-[#BCE5DC] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F6F61] uppercase tracking-wider">
                      Tiến trình ca khám
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Mã: {activeAppointment.maLich.slice(0, 8)}...
                    </span>
                  </div>

                  {/* Dynamic Action Buttons */}
                  <div>
                    {activeAppointment.trangThai === 'DA_DEN' && (
                      <button
                        onClick={() => handleOpenStatusConfirm(activeAppointment, 'DANG_KHAM')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#169C89] hover:bg-[#0F6F61] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg"
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>Mời bệnh nhân vào ghế – Bắt đầu khám</span>
                      </button>
                    )}

                    {activeAppointment.trangThai === 'DANG_KHAM' && (
                      <button
                        onClick={() => handleOpenStatusConfirm(activeAppointment, 'HOAN_THANH')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Hoàn tất ca khám này</span>
                      </button>
                    )}

                    {(activeAppointment.trangThai === 'DA_XAC_NHAN' || activeAppointment.trangThai === 'CHO_BENH_NHAN_XAC_NHAN') && (
                      <div className="space-y-2">
                        <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                          Bệnh nhân chưa có mặt tại ghế khám. Vui lòng đón tiếp tại phòng chờ.
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenStatusConfirm(activeAppointment, 'DA_DEN')}
                            className="flex-1 py-2 px-3 rounded-xl bg-[#169C89] hover:bg-[#0F6F61] text-white text-xs font-bold transition-all"
                          >
                            Xác nhận đã đến
                          </button>
                          <button
                            onClick={() => handleOpenStatusConfirm(activeAppointment, 'VANG_MAT')}
                            className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all"
                          >
                            Báo vắng mặt
                          </button>
                        </div>
                      </div>
                    )}

                    {activeAppointment.trangThai === 'HOAN_THANH' && (
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Ca khám đã hoàn tất và kết thúc</span>
                      </div>
                    )}

                    {activeAppointment.trangThai === 'VANG_MAT' && (
                      <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center font-bold">
                        Bệnh nhân vắng mặt trong ca khám này
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Linked Treatment Session (Buổi điều trị liên kết) */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-[#169C89]" />
                      <span className="text-xs font-bold text-slate-800">
                        Buổi điều trị liên kết
                      </span>
                    </div>

                    {linkedSession ? (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${TRANG_THAI_BUOI_MAP[linkedSession.trangThai]?.badgeClass || ''}`}>
                        {TRANG_THAI_BUOI_MAP[linkedSession.trangThai]?.label || linkedSession.trangThai}
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500 border border-slate-200">
                        Chưa liên kết
                      </span>
                    )}
                  </div>

                  {sessionLoading ? (
                    <div className="py-6 flex items-center justify-center text-xs text-slate-400 gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-[#169C89]" />
                      <span>Đang kiểm tra liên kết lộ trình...</span>
                    </div>
                  ) : linkedSession ? (
                    <div className="space-y-2 text-xs">
                      {unlinkError && (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                          {unlinkError}
                        </div>
                      )}

                      <div>
                        <span className="text-slate-400 block text-[11px]">Bước điều trị:</span>
                        <p className="font-bold text-slate-800 mt-0.5">
                          Buổi {linkedSession.soThuTu}: {linkedSession.tenBuoi}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">Nội dung can thiệp nha khoa:</span>
                        <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-0.5">
                          {linkedSession.noiDung}
                        </p>
                      </div>

                      {linkedSession.ghiChu && (
                        <div>
                          <span className="text-slate-400 block text-[11px]">Ghi chú chuyên môn:</span>
                          <p className="text-slate-600 italic mt-0.5">
                            {linkedSession.ghiChu}
                          </p>
                        </div>
                      )}

                      {/* Nút thao tác đổi/hủy buổi liên kết */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <button
                          onClick={() => setIsLinkModalOpen(true)}
                          className="text-[#169C89] hover:text-[#0D6E60] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Link2 className="h-3.5 w-3.5" />
                          <span>Đổi buổi liên kết</span>
                        </button>
                        <button
                          onClick={handleUnlinkSession}
                          disabled={sessionLoading}
                          className="text-rose-600 hover:text-rose-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Gỡ liên kết
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center space-y-2">
                      {unlinkError && (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left mb-2">
                          {unlinkError}
                        </div>
                      )}
                      <p className="text-xs text-slate-600 font-medium">
                        Chưa có buổi điều trị được liên kết với ca khám này.
                      </p>
                      <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                        Liên kết ca khám với bước điều trị cụ thể trong lộ trình giúp hệ thống tự động đồng bộ tiến độ khi hoàn thành khám.
                      </p>
                      <button
                        onClick={() => setIsLinkModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#169C89] text-xs font-bold border border-teal-200 transition-all cursor-pointer shadow-xs"
                      >
                        <Link2 className="h-3.5 w-3.5" />
                        <span>Liên kết buổi điều trị</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-slate-400">
                Chọn một ca khám để thao tác tiến trình
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
            <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>Trạng thái ca khám và buổi điều trị được đồng bộ tự động trên toàn hệ thống.</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <DoctorStatusConfirmModal
        isOpen={Boolean(confirmModalData.appointment && confirmModalData.targetStatus)}
        appointment={confirmModalData.appointment}
        targetStatus={confirmModalData.targetStatus}
        isSubmitting={isSubmittingStatus}
        onConfirm={handleExecuteStatusUpdate}
        onClose={() => setConfirmModalData({ appointment: null, targetStatus: null })}
      />

      {/* Link Session Modal */}
      <DoctorLinkSessionModal
        isOpen={isLinkModalOpen}
        appointment={activeAppointment}
        onClose={() => setIsLinkModalOpen(false)}
        onLinkedSuccess={() => {
          if (activeAppointment) {
            loadLinkedSession(activeAppointment);
          }
        }}
      />
    </div>
  );
};
