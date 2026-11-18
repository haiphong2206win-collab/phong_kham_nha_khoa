import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Filter,
  RotateCcw,
  Eye,
  Info,
  CalendarPlus,
  Hourglass,
  Loader2,
  CalendarCheck2,
  UserCheck,
  Building2,
  Check,
} from 'lucide-react';
import type { AuthSession } from '@/types/auth';
import type {
  BenhNhanProfile,
  YeuCauDatLich,
  CaKham,
  TrangThaiYeuCau,
  LichKhamBenhNhan,
  TrangThaiDatLich,
} from '@/types/patient';
import type { PatientNavTab } from './PatientSidebar';
import { patientService } from '@/services/patient.service';
import {
  AppointmentsHeroArt,
  MiniCalendarArt,
  ToothWithHeadset,
} from './PatientIllustrations';

export interface PatientAppointmentsProps {
  session: AuthSession;
  profile: BenhNhanProfile | null;
  appointments: YeuCauDatLich[];
  officialAppointments?: LichKhamBenhNhan[];
  onNavigateTab: (tab: PatientNavTab) => void;
  onReloadData: () => Promise<void>;
}

type AppointmentViewMode = 'OFFICIAL' | 'REQUESTS';

type FilterStatus = 'ALL' | 'CHO_PHAN_CONG' | 'DA_PHAN_CONG' | 'TU_CHOI' | 'DA_HUY';
type OfficialFilterStatus = 'ALL' | 'CHO_BENH_NHAN_XAC_NHAN' | 'DA_XAC_NHAN' | 'DA_HUY' | 'HOAN_THANH';
type FilterTime = 'ALL' | 'UPCOMING_VISIT' | 'THIS_MONTH_VISIT' | 'LAST_7_DAYS_SUBMITTED';

const CA_KHAM_LABEL: Record<CaKham, string> = {
  CA_SANG: 'Ca Sáng',
  CA_CHIEU: 'Ca Chiều',
};

const TRANG_THAI_DAT_LICH_CONFIG: Record<
  TrangThaiDatLich,
  { label: string; subLabel: string; bg: string; text: string; border: string; icon: 'clock' | 'check' | 'alert' | 'x' | 'building' }
> = {
  CHO_BENH_NHAN_XAC_NHAN: {
    label: 'Chờ bạn xác nhận',
    subLabel: 'Phòng khám đã xếp lịch, chờ bạn đồng ý',
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#D97706]',
    border: 'border-[#F59E0B]/40',
    icon: 'clock',
  },
  DA_XAC_NHAN: {
    label: 'Đã xác nhận',
    subLabel: 'Lịch khám chính thức đã sẵn sàng',
    bg: 'bg-[#E8F6F2]',
    text: 'text-[#169C89]',
    border: 'border-[#CEEBE2]',
    icon: 'check',
  },
  DA_DEN: {
    label: 'Đã đến phòng khám',
    subLabel: 'Bệnh nhân đã có mặt tại quầy',
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#2563EB]',
    border: 'border-[#BFDBFE]',
    icon: 'check',
  },
  DANG_KHAM: {
    label: 'Đang khám',
    subLabel: 'Bác sĩ đang thực hiện thăm khám',
    bg: 'bg-[#F5F3FF]',
    text: 'text-[#7C3AED]',
    border: 'border-[#DDD6FE]',
    icon: 'building',
  },
  HOAN_THANH: {
    label: 'Đã hoàn thành',
    subLabel: 'Buổi khám kết thúc thành công',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: 'check',
  },
  VANG_MAT: {
    label: 'Vắng mặt',
    subLabel: 'Bệnh nhân không đến theo lịch hẹn',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
    icon: 'x',
  },
  DA_HUY: {
    label: 'Đã hủy',
    subLabel: 'Lịch khám đã được hủy bỏ',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    icon: 'alert',
  },
  YEU_CAU_THAY_DOI: {
    label: 'Yêu cầu thay đổi',
    subLabel: 'Cần điều chỉnh thông tin ca khám',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: 'clock',
  },
};

const TRANG_THAI_CONFIG: Record<
  TrangThaiYeuCau,
  { label: string; subLabel: string; bg: string; text: string; border: string; icon: 'clock' | 'check' | 'alert' | 'x' }
> = {
  CHO_PHAN_CONG: {
    label: 'Chờ phân công',
    subLabel: 'YC mới gửi, đang được xem xét',
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#D97706]',
    border: 'border-[#FEF3C7]',
    icon: 'clock',
  },
  DA_PHAN_CONG: {
    label: 'Đã phân công',
    subLabel: 'Phòng khám đã phân công',
    bg: 'bg-[#E8F6F2]',
    text: 'text-[#169C89]',
    border: 'border-[#CEEBE2]',
    icon: 'check',
  },
  CHO_XAC_NHAN: {
    label: 'Chờ xác nhận',
    subLabel: 'Chờ bệnh nhân xác nhận',
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#D97706]',
    border: 'border-[#FEF3C7]',
    icon: 'clock',
  },
  DA_XAC_NHAN: {
    label: 'Đã xác nhận',
    subLabel: 'Đã hoàn tất xác nhận',
    bg: 'bg-[#E8F6F2]',
    text: 'text-[#169C89]',
    border: 'border-[#CEEBE2]',
    icon: 'check',
  },
  TU_CHOI: {
    label: 'Đã từ chối',
    subLabel: 'Yêu cầu không được chấp nhận',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    icon: 'alert',
  },
  DA_HUY: {
    label: 'Đã hủy',
    subLabel: 'Yêu cầu đã được hủy',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    icon: 'x',
  },
};

/**
 * Loại bỏ dấu tiếng Việt để tìm kiếm không phụ thuộc dấu
 */
const removeVietnameseTones = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

/**
 * Định dạng ngày YYYY-MM-DD sang DD/MM/YYYY
 */
const formatDateVN = (dateStr?: string | null): string => {
  if (!dateStr) return 'Chưa rõ';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
};

/**
 * Định dạng thời gian gửi ISO thành DD/MM/YYYY HH:mm
 */
const formatDateTimeVN = (isoStr?: string | null): string => {
  if (!isoStr) return 'Chưa rõ';
  try {
    const d = new Date(isoStr);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    }
  } catch {
    // fallback
  }
  return isoStr;
};

/**
 * Định dạng khung giờ khám HH:mm - HH:mm
 */
const formatTimeRange = (gioBatDau?: string | null, gioKetThuc?: string | null): string => {
  if (!gioBatDau && !gioKetThuc) return 'Chưa rõ giờ';
  const start = gioBatDau ? gioBatDau.substring(0, 5) : '??:??';
  const end = gioKetThuc ? gioKetThuc.substring(0, 5) : '??:??';
  return `${start} - ${end}`;
};

export const PatientAppointments: React.FC<PatientAppointmentsProps> = ({
  session,
  profile,
  appointments,
  officialAppointments = [],
  onNavigateTab,
  onReloadData,
}) => {
  // View mode switcher: Official Appointments vs Requests
  const [viewMode, setViewMode] = useState<AppointmentViewMode>('OFFICIAL');

  // Official Appointments Filter & Search State
  const [officialSearchQuery, setOfficialSearchQuery] = useState<string>('');
  const [officialStatusFilter, setOfficialStatusFilter] = useState<OfficialFilterStatus>('ALL');

  // Requests Filter & Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [timeFilter, setTimeFilter] = useState<FilterTime>('ALL');

  // Loading & Action State
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [actionToast, setActionToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Detail Modal States
  const [selectedAppointment, setSelectedAppointment] = useState<YeuCauDatLich | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [selectedOfficialAppointment, setSelectedOfficialAppointment] = useState<LichKhamBenhNhan | null>(null);

  // Reject Modal State
  const [rejectingAppointment, setRejectingAppointment] = useState<LichKhamBenhNhan | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [isSubmittingReject, setIsSubmittingReject] = useState<boolean>(false);

  // Handle ESC key to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (rejectingAppointment) {
          setRejectingAppointment(null);
        } else if (selectedOfficialAppointment) {
          setSelectedOfficialAppointment(null);
        } else if (selectedAppointment) {
          setSelectedAppointment(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAppointment, selectedOfficialAppointment, rejectingAppointment]);

  // Support openModal query parameter (e.g. ?tab=appointments&openModal=LK-xxx or ?openModal=YC-xxx)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const openModalCode = params.get('openModal');
      if (openModalCode) {
        // First check in official appointments
        const foundOfficial = officialAppointments.find((a) => a.maLich === openModalCode);
        if (foundOfficial) {
          setViewMode('OFFICIAL');
          setSelectedOfficialAppointment(foundOfficial);
          return;
        }
        // Then check in requests
        const foundReq = appointments.find((a) => a.maYeuCau === openModalCode);
        if (foundReq) {
          setViewMode('REQUESTS');
          handleOpenDetail(foundReq);
        }
      }
    }
  }, [appointments, officialAppointments]);

  // Reload handler with spinner
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onReloadData();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Open detail modal for Request
  const handleOpenDetail = async (item: YeuCauDatLich) => {
    setSelectedAppointment(item);
    setIsLoadingDetail(true);
    try {
      const freshDetail = await patientService.getAppointmentRequestById(item.maYeuCau);
      setSelectedAppointment(freshDetail);
    } catch (err) {
      console.warn('Không thể tải chi tiết mới nhất từ API, hiển thị dữ liệu bộ nhớ đệm:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // ==========================================
  // OFFICIAL APPOINTMENTS COMPUTATIONS
  // ==========================================
  const officialStatCounts = useMemo(() => {
    const total = officialAppointments.length;
    const pending = officialAppointments.filter((a) => a.trangThai === 'CHO_BENH_NHAN_XAC_NHAN').length;
    const confirmed = officialAppointments.filter((a) => a.trangThai === 'DA_XAC_NHAN').length;
    const completed = officialAppointments.filter((a) => a.trangThai === 'HOAN_THANH').length;
    const canceled = officialAppointments.filter((a) => a.trangThai === 'DA_HUY').length;

    return { total, pending, confirmed, completed, canceled };
  }, [officialAppointments]);

  const filteredOfficialAppointments = useMemo(() => {
    return officialAppointments.filter((item) => {
      // 1. Status Filter
      if (officialStatusFilter !== 'ALL') {
        if (item.trangThai !== officialStatusFilter) {
          return false;
        }
      }

      // 2. Search Query
      if (officialSearchQuery.trim()) {
        const queryNorm = removeVietnameseTones(officialSearchQuery.trim());
        const codeNorm = removeVietnameseTones(item.maLich || '');
        const drNorm = removeVietnameseTones(item.tenBacSi || '');
        const roomNorm = removeVietnameseTones(item.tenPhong || '');
        const reasonNorm = removeVietnameseTones(item.lyDoKham || '');

        const match =
          codeNorm.includes(queryNorm) ||
          drNorm.includes(queryNorm) ||
          roomNorm.includes(queryNorm) ||
          reasonNorm.includes(queryNorm);

        if (!match) return false;
      }

      return true;
    });
  }, [officialAppointments, officialStatusFilter, officialSearchQuery]);

  const hasActiveOfficialFilters = officialSearchQuery.trim() !== '' || officialStatusFilter !== 'ALL';

  // ==========================================
  // REQUESTS COMPUTATIONS
  // ==========================================
  const statCounts = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter(
      (a) => a.trangThai === 'CHO_PHAN_CONG' || a.trangThai === 'CHO_XAC_NHAN'
    ).length;
    const assigned = appointments.filter(
      (a) => a.trangThai === 'DA_PHAN_CONG' || a.trangThai === 'DA_XAC_NHAN'
    ).length;
    const rejected = appointments.filter((a) => a.trangThai === 'TU_CHOI').length;
    const canceled = appointments.filter((a) => a.trangThai === 'DA_HUY').length;

    return { total, pending, assigned, rejected, canceled };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      // 1. Status Filter
      if (statusFilter === 'CHO_PHAN_CONG') {
        if (item.trangThai !== 'CHO_PHAN_CONG' && item.trangThai !== 'CHO_XAC_NHAN') {
          return false;
        }
      } else if (statusFilter === 'DA_PHAN_CONG') {
        if (item.trangThai !== 'DA_PHAN_CONG' && item.trangThai !== 'DA_XAC_NHAN') {
          return false;
        }
      } else if (statusFilter === 'TU_CHOI') {
        if (item.trangThai !== 'TU_CHOI') {
          return false;
        }
      } else if (statusFilter === 'DA_HUY') {
        if (item.trangThai !== 'DA_HUY') {
          return false;
        }
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const queryNorm = removeVietnameseTones(searchQuery.trim());
        const codeNorm = removeVietnameseTones(item.maYeuCau || '');
        const reasonNorm = removeVietnameseTones(item.lyDoKham || '');
        const noteNorm = removeVietnameseTones(item.ghiChu || '');
        const shiftNorm = removeVietnameseTones(
          item.caKham === 'CA_SANG' ? 'ca sang' : 'ca chieu'
        );

        const match =
          codeNorm.includes(queryNorm) ||
          reasonNorm.includes(queryNorm) ||
          noteNorm.includes(queryNorm) ||
          shiftNorm.includes(queryNorm);

        if (!match) return false;
      }

      // 3. Time Filter
      if (timeFilter !== 'ALL') {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const currentDate = now.getDate();
        const localTodayStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDate).padStart(2, '0')}`;

        if (timeFilter === 'UPCOMING_VISIT') {
          if (!item.ngayMongMuon || item.ngayMongMuon < localTodayStr) {
            return false;
          }
        } else if (timeFilter === 'THIS_MONTH_VISIT') {
          if (!item.ngayMongMuon) return false;
          const [y, m] = item.ngayMongMuon.split('-').map((v) => parseInt(v, 10));
          if (y !== currentYear || m !== currentMonth) {
            return false;
          }
        } else if (timeFilter === 'LAST_7_DAYS_SUBMITTED') {
          if (!item.thoiGianGui) return false;
          const sevenDaysAgoStart = new Date(currentYear, now.getMonth(), currentDate - 7, 0, 0, 0, 0).getTime();
          const sentTime = new Date(item.thoiGianGui).getTime();
          if (isNaN(sentTime) || sentTime < sevenDaysAgoStart) {
            return false;
          }
        }
      }

      return true;
    });
  }, [appointments, statusFilter, searchQuery, timeFilter]);

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'ALL' || timeFilter !== 'ALL';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setTimeFilter('ALL');
  };

  const handleResetOfficialFilters = () => {
    setOfficialSearchQuery('');
    setOfficialStatusFilter('ALL');
  };

  // ==========================================
  // CONFIRM & REJECT HANDLERS
  // ==========================================
  const handleConfirmAppointment = async (maLich: string) => {
    setConfirmingId(maLich);
    try {
      await patientService.confirmAppointment(maLich);
      setActionToast({
        type: 'success',
        message: `Đã xác nhận lịch khám ${maLich} thành công! Hẹn gặp bạn tại phòng khám đúng giờ.`,
      });
      if (selectedOfficialAppointment?.maLich === maLich) {
        setSelectedOfficialAppointment((prev) =>
          prev ? { ...prev, trangThai: 'DA_XAC_NHAN' } : null
        );
      }
      await onReloadData();
    } catch (err: unknown) {
      console.error('Lỗi xác nhận lịch khám:', err);
      const errMsg =
        err instanceof Error ? err.message : 'Không thể xác nhận lịch khám. Vui lòng thử lại sau.';
      setActionToast({
        type: 'error',
        message: errMsg,
      });
    } finally {
      setConfirmingId(null);
    }
  };

  const handleOpenRejectModal = (item: LichKhamBenhNhan) => {
    setRejectingAppointment(item);
    setRejectReason('');
    setRejectError(null);
  };

  const handleCloseRejectModal = () => {
    setRejectingAppointment(null);
    setRejectReason('');
    setRejectError(null);
  };

  const handleSubmitReject = async () => {
    if (!rejectingAppointment) return;
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      setRejectError('Vui lòng nhập lý do từ chối lịch khám');
      return;
    }

    setIsSubmittingReject(true);
    setRejectError(null);
    try {
      await patientService.rejectAppointment(rejectingAppointment.maLich, trimmed);
      setActionToast({
        type: 'success',
        message: `Đã từ chối lịch khám ${rejectingAppointment.maLich}. Phòng khám đã ghi nhận phản hồi của bạn.`,
      });
      if (selectedOfficialAppointment?.maLich === rejectingAppointment.maLich) {
        setSelectedOfficialAppointment((prev) =>
          prev ? { ...prev, trangThai: 'DA_HUY', lyDoHuyThayDoi: trimmed } : null
        );
      }
      handleCloseRejectModal();
      await onReloadData();
    } catch (err: unknown) {
      console.error('Lỗi từ chối lịch khám:', err);
      const errMsg =
        err instanceof Error ? err.message : 'Không thể từ chối lịch khám. Vui lòng thử lại sau.';
      setRejectError(errMsg);
    } finally {
      setIsSubmittingReject(false);
    }
  };

  // Helper render badges
  const renderStatusBadge = (trangThai: TrangThaiYeuCau) => {
    const cfg = TRANG_THAI_CONFIG[trangThai] || {
      label: trangThai,
      subLabel: '',
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
      icon: 'clock',
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} shadow-2xs whitespace-nowrap`}
      >
        {cfg.icon === 'clock' && <Clock className="w-3.5 h-3.5 shrink-0" />}
        {cfg.icon === 'check' && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
        {cfg.icon === 'alert' && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
        {cfg.icon === 'x' && <X className="w-3.5 h-3.5 shrink-0" />}
        <span>{cfg.label}</span>
      </span>
    );
  };

  const renderOfficialStatusBadge = (trangThai: TrangThaiDatLich) => {
    const cfg = TRANG_THAI_DAT_LICH_CONFIG[trangThai] || {
      label: trangThai,
      subLabel: '',
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
      icon: 'clock',
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} shadow-2xs whitespace-nowrap`}
      >
        {cfg.icon === 'clock' && <Clock className="w-3.5 h-3.5 shrink-0" />}
        {cfg.icon === 'check' && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
        {cfg.icon === 'alert' && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
        {cfg.icon === 'x' && <X className="w-3.5 h-3.5 shrink-0" />}
        {cfg.icon === 'building' && <Building2 className="w-3.5 h-3.5 shrink-0" />}
        <span>{cfg.label}</span>
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EBF7F4] via-[#F0F9F7] to-[#E3F4EF] border border-[#CEEDE4] p-6 sm:p-8 lg:p-10 shadow-soft-card">
        <div className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-1/2 pointer-events-none hidden md:block">
          <AppointmentsHeroArt />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#CEEDE4] text-xs font-bold text-[#169C89] shadow-2xs backdrop-blur-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>Nha Khoa Nụ Cười Xanh • Hồ sơ: {profile?.hoTen || session.user?.tenDangNhap}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E384C] tracking-tight">
            Lịch khám của tôi
          </h1>

          <p className="text-sm sm:text-base text-[#5A777E] leading-relaxed max-w-xl">
            Theo dõi lịch khám chính thức đã được phòng khám xếp lịch, xác nhận lịch hẹn hoặc quản lý các yêu cầu đặt lịch đã gửi.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('booking')}
              className="px-4 py-2.5 rounded-2xl bg-[#169C89] hover:bg-[#138776] text-white text-xs sm:text-sm font-bold shadow-soft transition-all duration-200 inline-flex items-center gap-2 active:scale-98"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>+ Đặt lịch khám mới</span>
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-[#5A777E] hover:text-[#1E384C] border border-[#CEEDE4] text-xs sm:text-sm font-semibold shadow-2xs transition-all inline-flex items-center gap-1.5 active:scale-98 disabled:opacity-50"
              title="Tải lại dữ liệu từ hệ thống"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#169C89]' : ''}`} />
              <span>{isRefreshing ? 'Đang cập nhật...' : 'Làm mới'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ACTION TOAST BANNER */}
      {actionToast && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold transition-all ${
            actionToast.type === 'success'
              ? 'bg-[#E8F6F2] text-[#169C89] border border-[#CEEDE4]'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionToast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#169C89]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span>{actionToast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionToast(null)}
            className="p-1 hover:opacity-75 transition-opacity"
            title="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. VIEW MODE SWITCHER TABS */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-1.5 bg-[#F0F7F5] rounded-2xl border border-[#CEEDE4] w-fit shadow-2xs">
        <button
          type="button"
          onClick={() => setViewMode('OFFICIAL')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
            viewMode === 'OFFICIAL'
              ? 'bg-[#169C89] text-white shadow-soft'
              : 'text-[#5A777E] hover:text-[#1E384C] hover:bg-white/60'
          }`}
        >
          <CalendarCheck2 className="w-4 h-4" />
          <span>Lịch khám chính thức</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              viewMode === 'OFFICIAL' ? 'bg-white/20 text-white' : 'bg-white text-[#169C89] border border-[#CEEDE4]'
            }`}
          >
            {officialAppointments.length}
          </span>
          {officialStatCounts.pending > 0 && (
            <span
              className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"
              title="Có lịch hẹn chờ bạn xác nhận"
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setViewMode('REQUESTS')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
            viewMode === 'REQUESTS'
              ? 'bg-[#169C89] text-white shadow-soft'
              : 'text-[#5A777E] hover:text-[#1E384C] hover:bg-white/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Yêu cầu đặt lịch</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              viewMode === 'REQUESTS' ? 'bg-white/20 text-white' : 'bg-white text-[#5A777E] border border-[#E3ECE9]'
            }`}
          >
            {appointments.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SECTION: LỊCH KHÁM CHÍNH THỨC (OFFICIAL APPOINTMENTS VIEW)  */}
      {/* ========================================================= */}
      {viewMode === 'OFFICIAL' && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          {/* STAT CARDS FOR OFFICIAL APPOINTMENTS */}
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* Card 1: Tất cả lịch */}
            <button
              type="button"
              onClick={() => setOfficialStatusFilter('ALL')}
              className={`p-4 sm:p-5 rounded-3xl text-left transition-all duration-200 border ${
                officialStatusFilter === 'ALL'
                  ? 'bg-white border-[#169C89] ring-2 ring-[#169C89]/20 shadow-soft-card'
                  : 'bg-white border-[#E3ECE9] hover:border-[#CEEDE4] hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#7A9A93]">Tất cả lịch khám</span>
                <div className="w-9 h-9 rounded-2xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1E384C]">
                {officialStatCounts.total}
              </div>
              <p className="text-[11px] text-[#7A9A93] mt-1">Lịch khám chính thức</p>
            </button>

            {/* Card 2: Chờ bạn xác nhận */}
            <button
              type="button"
              onClick={() => setOfficialStatusFilter('CHO_BENH_NHAN_XAC_NHAN')}
              className={`p-4 sm:p-5 rounded-3xl text-left transition-all duration-200 border ${
                officialStatusFilter === 'CHO_BENH_NHAN_XAC_NHAN'
                  ? 'bg-white border-[#F59E0B] ring-2 ring-[#F59E0B]/20 shadow-soft-card'
                  : 'bg-white border-[#E3ECE9] hover:border-[#FEF3C7] hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#7A9A93]">Chờ bạn xác nhận</span>
                <div className="w-9 h-9 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#D97706]">
                {officialStatCounts.pending}
              </div>
              <p className="text-[11px] text-[#7A9A93] mt-1">Cần bạn xác nhận ngay</p>
            </button>

            {/* Card 3: Đã xác nhận */}
            <button
              type="button"
              onClick={() => setOfficialStatusFilter('DA_XAC_NHAN')}
              className={`p-4 sm:p-5 rounded-3xl text-left transition-all duration-200 border ${
                officialStatusFilter === 'DA_XAC_NHAN'
                  ? 'bg-white border-[#169C89] ring-2 ring-[#169C89]/20 shadow-soft-card'
                  : 'bg-white border-[#E3ECE9] hover:border-[#CEEBE2] hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#7A9A93]">Đã xác nhận</span>
                <div className="w-9 h-9 rounded-2xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#169C89]">
                {officialStatCounts.confirmed}
              </div>
              <p className="text-[11px] text-[#7A9A93] mt-1">Đã sẵn sàng đến khám</p>
            </button>

            {/* Card 4: Hoàn thành */}
            <button
              type="button"
              onClick={() => setOfficialStatusFilter('HOAN_THANH')}
              className={`p-4 sm:p-5 rounded-3xl text-left transition-all duration-200 border ${
                officialStatusFilter === 'HOAN_THANH'
                  ? 'bg-white border-emerald-400 ring-2 ring-emerald-400/20 shadow-soft-card'
                  : 'bg-white border-[#E3ECE9] hover:border-emerald-200 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#7A9A93]">Đã hoàn thành</span>
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                {officialStatCounts.completed}
              </div>
              <p className="text-[11px] text-[#7A9A93] mt-1">Đã khám hoàn tất</p>
            </button>

            {/* Card 5: Đã hủy */}
            <button
              type="button"
              onClick={() => setOfficialStatusFilter('DA_HUY')}
              className={`p-4 sm:p-5 rounded-3xl text-left transition-all duration-200 border ${
                officialStatusFilter === 'DA_HUY'
                  ? 'bg-white border-red-400 ring-2 ring-red-400/20 shadow-soft-card'
                  : 'bg-white border-[#E3ECE9] hover:border-red-200 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#7A9A93]">Đã hủy</span>
                <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                  <X className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-red-500">
                {officialStatCounts.canceled}
              </div>
              <p className="text-[11px] text-[#7A9A93] mt-1">Đã từ chối hoặc hủy</p>
            </button>
          </section>

          {/* FILTER & SEARCH FOR OFFICIAL APPOINTMENTS */}
          <section className="space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setOfficialStatusFilter('ALL')}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  officialStatusFilter === 'ALL'
                    ? 'bg-[#169C89] text-white shadow-soft'
                    : 'bg-white text-[#5A777E] hover:text-[#1E384C] hover:bg-[#F0F5F3] border border-[#E3ECE9]'
                }`}
              >
                Tất cả ({officialStatCounts.total})
              </button>

              <button
                type="button"
                onClick={() => setOfficialStatusFilter('CHO_BENH_NHAN_XAC_NHAN')}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  officialStatusFilter === 'CHO_BENH_NHAN_XAC_NHAN'
                    ? 'bg-[#169C89] text-white shadow-soft'
                    : 'bg-white text-[#5A777E] hover:text-[#1E384C] hover:bg-[#F0F5F3] border border-[#E3ECE9]'
                }`}
              >
                Chờ xác nhận ({officialStatCounts.pending})
              </button>

              <button
                type="button"
                onClick={() => setOfficialStatusFilter('DA_XAC_NHAN')}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  officialStatusFilter === 'DA_XAC_NHAN'
                    ? 'bg-[#169C89] text-white shadow-soft'
                    : 'bg-white text-[#5A777E] hover:text-[#1E384C] hover:bg-[#F0F5F3] border border-[#E3ECE9]'
                }`}
              >
                Đã xác nhận ({officialStatCounts.confirmed})
              </button>

              <button
                type="button"
                onClick={() => setOfficialStatusFilter('HOAN_THANH')}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  officialStatusFilter === 'HOAN_THANH'
                    ? 'bg-[#169C89] text-white shadow-soft'
                    : 'bg-white text-[#5A777E] hover:text-[#1E384C] hover:bg-[#F0F5F3] border border-[#E3ECE9]'
                }`}
              >
                Đã hoàn thành ({officialStatCounts.completed})
              </button>

              <button
                type="button"
                onClick={() => setOfficialStatusFilter('DA_HUY')}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  officialStatusFilter === 'DA_HUY'
                    ? 'bg-[#169C89] text-white shadow-soft'
                    : 'bg-white text-[#5A777E] hover:text-[#1E384C] hover:bg-[#F0F5F3] border border-[#E3ECE9]'
                }`}
              >
                Đã hủy ({officialStatCounts.canceled})
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A9A93]" />
                <input
                  type="text"
                  value={officialSearchQuery}
                  onChange={(e) => setOfficialSearchQuery(e.target.value)}
                  placeholder="Tìm theo mã lịch, bác sĩ, phòng khám, lý do..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-[#E3ECE9] text-xs sm:text-sm text-[#1E384C] placeholder-[#94A3B8] focus:outline-none focus:border-[#169C89] focus:ring-2 focus:ring-[#169C89]/20 transition-all shadow-2xs"
                />
                {officialSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setOfficialSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A9A93] hover:text-[#1E384C] p-0.5"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {hasActiveOfficialFilters && (
                <button
                  type="button"
                  onClick={handleResetOfficialFilters}
                  className="px-3.5 py-2.5 rounded-2xl bg-[#F0F5F3] hover:bg-[#E3ECE9] text-[#5A777E] hover:text-[#1E384C] text-xs font-semibold transition-all inline-flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Xóa bộ lọc</span>
                </button>
              )}
            </div>
          </section>

          {/* OFFICIAL APPOINTMENTS LIST */}
          <section className="rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card overflow-hidden">
            {filteredOfficialAppointments.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E3ECE9] bg-[#F8FBFA] text-[11px] font-bold text-[#7A9A93] uppercase tracking-wider">
                        <th className="py-4 px-6">Mã lịch</th>
                        <th className="py-4 px-6">Bác sĩ phụ trách</th>
                        <th className="py-4 px-6">Phòng khám</th>
                        <th className="py-4 px-6">Ngày & Giờ khám</th>
                        <th className="py-4 px-6">Dịch vụ / Lý do</th>
                        <th className="py-4 px-6">Trạng thái</th>
                        <th className="py-4 px-6 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F5F3] text-xs text-[#1E384C]">
                      {filteredOfficialAppointments.map((app) => (
                        <tr
                          key={app.maLich}
                          className="hover:bg-[#F8FBFA]/80 transition-colors group"
                        >
                          {/* Mã lịch */}
                          <td className="py-4 px-6 font-mono font-bold text-[#169C89]">
                            <button
                              type="button"
                              onClick={() => setSelectedOfficialAppointment(app)}
                              className="hover:underline focus:outline-none"
                            >
                              {app.maLich}
                            </button>
                          </td>

                          {/* Bác sĩ */}
                          <td className="py-4 px-6">
                            <div className="inline-flex items-center gap-1.5 font-bold text-[#1E384C]">
                              <UserCheck className="w-3.5 h-3.5 text-[#169C89] shrink-0" />
                              <span>{app.tenBacSi || 'Chưa rõ'}</span>
                            </div>
                          </td>

                          {/* Phòng khám */}
                          <td className="py-4 px-6">
                            <div className="inline-flex items-center gap-1.5 text-[#5A777E]">
                              <Building2 className="w-3.5 h-3.5 text-[#7A9A93] shrink-0" />
                              <span>{app.tenPhong || 'Chưa xếp phòng'}</span>
                            </div>
                          </td>

                          {/* Ngày & Giờ khám */}
                          <td className="py-4 px-6">
                            <div className="inline-flex items-center gap-1.5 font-semibold text-[#1E384C]">
                              <Calendar className="w-3.5 h-3.5 text-[#169C89]" />
                              <span>{formatDateVN(app.ngayKham)}</span>
                            </div>
                            <div className="inline-flex items-center gap-1 text-[11px] text-[#7A9A93] mt-0.5">
                              <Clock className="w-3 h-3 text-[#7A9A93]" />
                              <span>{formatTimeRange(app.gioBatDau, app.gioKetThuc)}</span>
                            </div>
                          </td>

                          {/* Lý do */}
                          <td className="py-4 px-6">
                            <div className="max-w-xs font-semibold text-[#1E384C] truncate" title={app.lyDoKham || undefined}>
                              {app.lyDoKham || 'Khám tổng quát'}
                            </div>
                            {app.lyDoHuyThayDoi && (
                              <div className="text-[11px] text-red-600 line-clamp-1 mt-0.5" title={app.lyDoHuyThayDoi || undefined}>
                                Phản hồi: {app.lyDoHuyThayDoi}
                              </div>
                            )}
                          </td>

                          {/* Trạng thái */}
                          <td className="py-4 px-6">
                            {renderOfficialStatusBadge(app.trangThai)}
                          </td>

                          {/* Thao tác */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {app.trangThai === 'CHO_BENH_NHAN_XAC_NHAN' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleConfirmAppointment(app.maLich)}
                                    disabled={confirmingId === app.maLich}
                                    className="px-3 py-1.5 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white font-bold text-xs transition-all shadow-2xs inline-flex items-center gap-1 disabled:opacity-50"
                                    title="Xác nhận lịch khám này"
                                  >
                                    {confirmingId === app.maLich ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Check className="w-3.5 h-3.5" />
                                    )}
                                    <span>Xác nhận</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleOpenRejectModal(app)}
                                    className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-all inline-flex items-center gap-1"
                                    title="Từ chối lịch khám này"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Từ chối</span>
                                  </button>
                                </>
                              )}

                              <button
                                type="button"
                                onClick={() => setSelectedOfficialAppointment(app)}
                                className="px-3 py-1.5 rounded-xl border border-[#CEEDE4] text-[#169C89] hover:bg-[#E8F6F2] font-bold text-xs transition-all inline-flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Chi tiết</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-[#F0F5F3]">
                  {filteredOfficialAppointments.map((app) => (
                    <div key={app.maLich} className="p-4 space-y-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-xs text-[#169C89]">
                          {app.maLich}
                        </span>
                        {renderOfficialStatusBadge(app.trangThai)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#1E384C]">
                          <Calendar className="w-3.5 h-3.5 text-[#169C89] shrink-0" />
                          <span>{formatDateVN(app.ngayKham)}</span>
                          <span className="text-[#5A777E]">({formatTimeRange(app.gioBatDau, app.gioKetThuc)})</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#1E384C]">
                          <UserCheck className="w-3.5 h-3.5 text-[#169C89] shrink-0" />
                          <span className="font-bold">Bác sĩ: {app.tenBacSi || 'Chưa rõ'}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#5A777E]">
                          <Building2 className="w-3.5 h-3.5 text-[#7A9A93] shrink-0" />
                          <span>Phòng: {app.tenPhong || 'Chưa xếp phòng'}</span>
                        </div>

                        <p className="text-xs font-bold text-[#1E384C] pt-0.5">
                          {app.lyDoKham || 'Khám nha khoa'}
                        </p>

                        {app.lyDoHuyThayDoi && (
                          <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">
                            Phản hồi: {app.lyDoHuyThayDoi}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-1 flex flex-col gap-2">
                        {app.trangThai === 'CHO_BENH_NHAN_XAC_NHAN' && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleConfirmAppointment(app.maLich)}
                              disabled={confirmingId === app.maLich}
                              className="w-full py-2 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white font-bold text-xs shadow-soft transition-all text-center inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
                            >
                              {confirmingId === app.maLich ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                              <span>Xác nhận</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenRejectModal(app)}
                              className="w-full py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors text-center inline-flex items-center justify-center gap-1.5"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Từ chối</span>
                            </button>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedOfficialAppointment(app)}
                          className="w-full py-2 rounded-xl border border-[#CEEDE4] text-[#169C89] hover:bg-[#E8F6F2] font-bold text-xs transition-colors text-center inline-flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem chi tiết</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* EMPTY STATE FOR OFFICIAL APPOINTMENTS */
              <div className="p-10 sm:p-14 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center mx-auto shadow-2xs">
                  {hasActiveOfficialFilters ? (
                    <Search className="w-8 h-8" />
                  ) : (
                    <CalendarCheck2 className="w-8 h-8" />
                  )}
                </div>

                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-base sm:text-lg font-bold text-[#1E384C]">
                    {hasActiveOfficialFilters
                      ? 'Không tìm thấy lịch khám phù hợp'
                      : 'Chưa có lịch khám chính thức nào'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7A9A93] leading-relaxed">
                    {hasActiveOfficialFilters
                      ? 'Không có lịch khám nào khớp với điều kiện tìm kiếm hoặc bộ lọc hiện tại. Vui lòng thử từ khóa khác hoặc đặt lại bộ lọc.'
                      : 'Khi phòng khám tiếp nhận yêu cầu đặt lịch và phân công bác sĩ, lịch khám chính thức sẽ hiển thị tại đây để bạn xác nhận.'}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  {hasActiveOfficialFilters ? (
                    <button
                      type="button"
                      onClick={handleResetOfficialFilters}
                      className="px-4 py-2.5 rounded-2xl bg-[#169C89] hover:bg-[#138776] text-white text-xs sm:text-sm font-bold shadow-soft transition-all inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Xóa bộ lọc</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setViewMode('REQUESTS')}
                      className="px-5 py-2.5 rounded-2xl bg-[#169C89] hover:bg-[#138776] text-white text-xs sm:text-sm font-bold shadow-soft transition-all inline-flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Xem yêu cầu đặt lịch đã gửi</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION: YÊU CẦU ĐẶT LỊCH (BOOKING REQUESTS VIEW)          */}
      {/* ========================================================= */}
      {viewMode === 'REQUESTS' && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          {/* 5 STAT CARDS FOR REQUESTS */}
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* Card 1: Tất cả yêu cầu */}
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`p-4 sm:p-5 rounded-3xl text-left transition-all duration-200 border ${
                statusFilter === 'ALL'
                  ? 'bg-white border-[#169C89] ring-2 ring-[#169C89]/20 shadow-soft-card'
                  : 'bg-white border-[#E3ECE9] hover:border-[#CEEDE4] hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#7A9A93]">Tất cả yêu cầu</span>
                <div className="w-9 h-9 rounded-2xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1E384C]">
                {statCounts.total}
              </div>
              <p className="text-[11px] text-[#7A9A93] mt-1">Tổng số yêu cầu đã gửi</p>
            </button>

            {/* Card 2: Chờ phân công */}
            <button
              type="button"
              onClick={() => setStatusFilter('CHO_PHAN_CONG')}
              className={`p-4 sm:p-5 rounded-3xl text-left transition-all duration-200 border ${
                statusFilter === 'CHO_PHAN_CONG'
                  ? 'bg-white border-[#F59E0B] ring-2 ring-[#F59E0B]/20 shadow-soft-card'
                  : 'bg-white border-[#E3ECE9] hover:border-[#FEF3C7] hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#7A9A93]">Chờ phân công</span>
                <div className="w-9 h-9 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                  <Hourglass className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#D97706]">
                {statCounts.pending}
              </div>
              <p className="text-[11px] text-[#7A9A93] mt-1">Đang chờ xử lý</p>
            </button>

            {/* Card 3: Đã phân công */}
            <button
              type="button"
              onClick={() => setStatusFilter('DA_PHAN_CONG')}
              className={`p-4 sm:p-5 rounded-3xl text-left transition-all duration-200 border ${
                statusFilter === 'DA_PHAN_CONG'
                  ? 'bg-white border-[#169C89] ring-2 ring-[#169C89]/20 shadow-soft-card'
                  : 'bg-white border-[#E3ECE9] hover:border-[#CEEBE2] hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#7A9A93]">Đã phân công</span>
                <div className="w-9 h-9 rounded-2xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#169C89]">
                {statCounts.assigned}
              </div>
              <p className="text-[11px] text-[#7A9A93] mt-1">Phòng khám đã phân công</p>
            </button>

            {/* Card 4: Đã từ chối */}
            <button
              type="button"
              onClick={() => setStatusFilter('TU_CHOI')}
              className={`p-4 sm:p-5 rounded-3xl text-left transition-all duration-200 border ${
                statusFilter === 'TU_CHOI'
                  ? 'bg-white border-red-400 ring-2 ring-red-400/20 shadow-soft-card'
                  : 'bg-white border-[#E3ECE9] hover:border-red-200 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#7A9A93]">Đã từ chối</span>
                <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-red-500">
                {statCounts.rejected}
              </div>
              <p className="text-[11px] text-[#7A9A93] mt-1">Không được chấp nhận</p>
            </button>

            {/* Card 5: Đã hủy */}
            <button
              type="button"
              onClick={() => setStatusFilter('DA_HUY')}
              className={`p-4 sm:p-5 rounded-3xl text-left transition-all duration-200 border ${
                statusFilter === 'DA_HUY'
                  ? 'bg-white border-gray-400 ring-2 ring-gray-400/20 shadow-soft-card'
                  : 'bg-white border-[#E3ECE9] hover:border-gray-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#7A9A93]">Đã hủy</span>
                <div className="w-9 h-9 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center">
                  <X className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-600">
                {statCounts.canceled}
              </div>
              <p className="text-[11px] text-[#7A9A93] mt-1">Yêu cầu đã được hủy</p>
            </button>
          </section>

          {/* FILTER & SEARCH FOR REQUESTS */}
          <section className="space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-[#169C89] text-white shadow-soft'
                    : 'bg-white text-[#5A777E] hover:text-[#1E384C] hover:bg-[#F0F5F3] border border-[#E3ECE9]'
                }`}
              >
                Tất cả ({statCounts.total})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('CHO_PHAN_CONG')}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  statusFilter === 'CHO_PHAN_CONG'
                    ? 'bg-[#169C89] text-white shadow-soft'
                    : 'bg-white text-[#5A777E] hover:text-[#1E384C] hover:bg-[#F0F5F3] border border-[#E3ECE9]'
                }`}
              >
                Chờ phân công ({statCounts.pending})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('DA_PHAN_CONG')}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  statusFilter === 'DA_PHAN_CONG'
                    ? 'bg-[#169C89] text-white shadow-soft'
                    : 'bg-white text-[#5A777E] hover:text-[#1E384C] hover:bg-[#F0F5F3] border border-[#E3ECE9]'
                }`}
              >
                Đã phân công ({statCounts.assigned})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('TU_CHOI')}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  statusFilter === 'TU_CHOI'
                    ? 'bg-[#169C89] text-white shadow-soft'
                    : 'bg-white text-[#5A777E] hover:text-[#1E384C] hover:bg-[#F0F5F3] border border-[#E3ECE9]'
                }`}
              >
                Đã từ chối ({statCounts.rejected})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('DA_HUY')}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  statusFilter === 'DA_HUY'
                    ? 'bg-[#169C89] text-white shadow-soft'
                    : 'bg-white text-[#5A777E] hover:text-[#1E384C] hover:bg-[#F0F5F3] border border-[#E3ECE9]'
                }`}
              >
                Đã hủy ({statCounts.canceled})
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A9A93]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo mã yêu cầu, lý do khám..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-[#E3ECE9] text-xs sm:text-sm text-[#1E384C] placeholder-[#94A3B8] focus:outline-none focus:border-[#169C89] focus:ring-2 focus:ring-[#169C89]/20 transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A9A93] hover:text-[#1E384C] p-0.5"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="relative">
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value as FilterTime)}
                    aria-label="Lọc theo khoảng thời gian"
                    className="appearance-none pl-9 pr-8 py-2.5 rounded-2xl bg-white border border-[#E3ECE9] text-xs sm:text-sm font-semibold text-[#1E384C] hover:border-[#CEEDE4] focus:outline-none focus:border-[#169C89] focus:ring-2 focus:ring-[#169C89]/20 transition-all shadow-2xs cursor-pointer"
                  >
                    <option value="ALL">Tất cả thời gian</option>
                    <option value="UPCOMING_VISIT">Ngày khám: Sắp tới (từ hôm nay)</option>
                    <option value="THIS_MONTH_VISIT">Ngày khám: Trong tháng này</option>
                    <option value="LAST_7_DAYS_SUBMITTED">Thời gian gửi: 7 ngày qua</option>
                  </select>
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#169C89] pointer-events-none" />
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A9A93] pointer-events-none" />
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-3 py-2.5 rounded-2xl bg-[#F0F5F3] hover:bg-[#E3ECE9] text-[#5A777E] hover:text-[#1E384C] text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                    title="Đặt lại toàn bộ bộ lọc"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Xóa bộ lọc</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* REQUESTS LIST TABLE & CARDS */}
          <section className="rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card overflow-hidden">
            {filteredAppointments.length > 0 ? (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E3ECE9] bg-[#F8FBFA] text-[11px] font-bold text-[#7A9A93] uppercase tracking-wider">
                        <th className="py-4 px-6">Mã yêu cầu</th>
                        <th className="py-4 px-6">Lý do / Dịch vụ khám</th>
                        <th className="py-4 px-6">Ngày khám mong muốn</th>
                        <th className="py-4 px-6">Trạng thái</th>
                        <th className="py-4 px-6">Thời gian gửi</th>
                        <th className="py-4 px-6 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F5F3] text-xs text-[#1E384C]">
                      {filteredAppointments.map((req) => (
                        <tr
                          key={req.maYeuCau}
                          className="hover:bg-[#F8FBFA]/80 transition-colors group"
                        >
                          <td className="py-4 px-6 font-mono font-bold text-[#169C89]">
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(req)}
                              className="hover:underline focus:outline-none"
                            >
                              {req.maYeuCau}
                            </button>
                          </td>

                          <td className="py-4 px-6">
                            <div className="font-bold text-[#1E384C] max-w-xs sm:max-w-sm truncate" title={req.lyDoKham || undefined}>
                              {req.lyDoKham}
                            </div>
                            {req.ghiChu && (
                              <div className="text-[11px] text-[#7A9A93] line-clamp-1 mt-0.5" title={req.ghiChu || undefined}>
                                Ghi chú: {req.ghiChu}
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-6">
                            <div className="inline-flex items-center gap-1.5 font-semibold text-[#1E384C]">
                              <Calendar className="w-3.5 h-3.5 text-[#169C89]" />
                              <span>{formatDateVN(req.ngayMongMuon)}</span>
                            </div>
                            <div className="text-[11px] text-[#7A9A93] mt-0.5">
                              ({CA_KHAM_LABEL[req.caKham] || req.caKham})
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            {renderStatusBadge(req.trangThai)}
                          </td>

                          <td className="py-4 px-6 text-[#5A777E]">
                            {formatDateTimeVN(req.thoiGianGui)}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(req)}
                              className="px-3.5 py-1.5 rounded-xl border border-[#CEEDE4] text-[#169C89] hover:bg-[#E8F6F2] hover:border-[#169C89] font-bold text-xs transition-all shadow-2xs inline-flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Xem chi tiết</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden divide-y divide-[#F0F5F3]">
                  {filteredAppointments.map((req) => (
                    <div key={req.maYeuCau} className="p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-xs text-[#169C89]">
                          {req.maYeuCau}
                        </span>
                        {renderStatusBadge(req.trangThai)}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#1E384C]">
                          <Calendar className="w-3.5 h-3.5 text-[#169C89] shrink-0" />
                          <span>{formatDateVN(req.ngayMongMuon)}</span>
                          <span className="text-[#7A9A93]">({CA_KHAM_LABEL[req.caKham] || req.caKham})</span>
                        </div>

                        <p className="text-xs font-bold text-[#1E384C] leading-snug">
                          {req.lyDoKham}
                        </p>

                        {req.ghiChu && (
                          <p className="text-[11px] text-[#7A9A93] italic line-clamp-2">
                            Ghi chú: {req.ghiChu}
                          </p>
                        )}

                        <div className="flex items-center gap-1.5 text-[11px] text-[#7A9A93] pt-0.5">
                          <Clock className="w-3 h-3 text-[#7A9A93]" />
                          <span>Gửi lúc: {formatDateTimeVN(req.thoiGianGui)}</span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(req)}
                          className="w-full py-2 rounded-xl border border-[#CEEDE4] text-[#169C89] hover:bg-[#E8F6F2] font-bold text-xs transition-colors text-center inline-flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem chi tiết</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-10 sm:p-14 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center mx-auto shadow-2xs">
                  {hasActiveFilters ? (
                    <Search className="w-8 h-8" />
                  ) : (
                    <Calendar className="w-8 h-8" />
                  )}
                </div>

                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-base sm:text-lg font-bold text-[#1E384C]">
                    {hasActiveFilters
                      ? 'Không tìm thấy yêu cầu phù hợp'
                      : 'Chưa có yêu cầu đặt lịch nào'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7A9A93] leading-relaxed">
                    {hasActiveFilters
                      ? 'Không có yêu cầu nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại. Vui lòng thử từ khóa khác hoặc đặt lại bộ lọc.'
                      : 'Bạn chưa gửi yêu cầu đặt lịch khám nào trong hệ thống. Hãy gửi yêu cầu để phòng khám tiếp nhận và sắp xếp bác sĩ.'}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  {hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-2.5 rounded-2xl bg-[#169C89] hover:bg-[#138776] text-white text-xs sm:text-sm font-bold shadow-soft transition-all inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Xóa bộ lọc</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onNavigateTab('booking')}
                      className="px-5 py-2.5 rounded-2xl bg-[#169C89] hover:bg-[#138776] text-white text-xs sm:text-sm font-bold shadow-soft transition-all inline-flex items-center gap-2"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      <span>Đặt lịch khám ngay</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* 5. 2 BOTTOM CARDS: "Lưu ý về lịch khám" & "Bạn cần hỗ trợ?" */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card flex items-start gap-4">
          <MiniCalendarArt className="w-14 h-14 sm:w-16 sm:h-16 shrink-0" />
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-[#1E384C]">
              Lưu ý về lịch khám
            </h3>
            <ul className="text-xs text-[#5A777E] space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#169C89] mt-1.5 shrink-0" />
                <span>Khi phòng khám xếp lịch, bạn sẽ nhận được thông báo để xác nhận lịch khám chính thức.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#169C89] mt-1.5 shrink-0" />
                <span>Vui lòng kiểm tra kỹ ngày giờ, bác sĩ phụ trách trước khi nhấn Xác nhận lịch.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#169C89] mt-1.5 shrink-0" />
                <span>Nếu có thay đổi đột xuất, vui lòng thông báo sớm hoặc liên hệ hotline phòng khám.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card flex items-start gap-4">
          <ToothWithHeadset className="w-14 h-14 sm:w-16 sm:h-16 shrink-0" />
          <div className="space-y-2 flex-1">
            <h3 className="text-sm sm:text-base font-bold text-[#1E384C]">
              Bạn cần hỗ trợ?
            </h3>
            <p className="text-xs text-[#5A777E] leading-relaxed">
              Tìm hiểu thêm về quy trình đặt lịch, các bước khám và những câu hỏi thường gặp.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onNavigateTab('faq')}
                className="px-3.5 py-1.5 rounded-xl bg-[#E8F6F2] hover:bg-[#D5EFE8] text-[#169C89] text-xs font-bold transition-all inline-flex items-center gap-1.5 active:scale-98"
              >
                <span>Xem câu hỏi thường gặp</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. MODAL XEM CHI TIẾT YÊU CẦU ĐẶT LỊCH (REQUEST DETAIL)    */}
      {/* ========================================================= */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-50 bg-[#1E384C]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white border border-[#CEEDE4] shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#F0F5F3]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#1E384C]">
                    Chi tiết yêu cầu đặt lịch
                  </h3>
                  {isLoadingDetail && (
                    <Loader2 className="w-4 h-4 animate-spin text-[#169C89]" />
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="w-8 h-8 rounded-full bg-[#F0F5F3] hover:bg-[#E3ECE9] text-[#7A9A93] hover:text-[#1E384C] flex items-center justify-center transition-colors"
                title="Đóng modal (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-mono font-extrabold text-sm sm:text-base text-[#1E384C]">
                  {selectedAppointment.maYeuCau}
                </div>
                <div className="text-[11px] text-[#7A9A93]">
                  Gửi lúc: {formatDateTimeVN(selectedAppointment.thoiGianGui)}
                </div>
              </div>
              <div className="shrink-0">
                {renderStatusBadge(selectedAppointment.trangThai)}
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-white border border-[#F0F5F3] space-y-1">
                <span className="text-[11px] font-semibold text-[#7A9A93] uppercase tracking-wider block">
                  Dịch vụ / Lý do khám
                </span>
                <span className="font-bold text-[#1E384C] block">
                  {selectedAppointment.lyDoKham}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-[#F0F5F3] space-y-1">
                  <span className="text-[11px] font-semibold text-[#7A9A93] uppercase tracking-wider block">
                    Ngày khám mong muốn
                  </span>
                  <div className="inline-flex items-center gap-1.5 font-bold text-[#1E384C]">
                    <Calendar className="w-3.5 h-3.5 text-[#169C89]" />
                    <span>{formatDateVN(selectedAppointment.ngayMongMuon)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#F0F5F3] space-y-1">
                  <span className="text-[11px] font-semibold text-[#7A9A93] uppercase tracking-wider block">
                    Ca khám mong muốn
                  </span>
                  <div className="inline-flex items-center gap-1.5 font-bold text-[#1E384C]">
                    <Clock className="w-3.5 h-3.5 text-[#169C89]" />
                    <span>
                      {CA_KHAM_LABEL[selectedAppointment.caKham] || selectedAppointment.caKham}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#F0F5F3] space-y-1">
                <span className="text-[11px] font-semibold text-[#7A9A93] uppercase tracking-wider block">
                  Triệu chứng / Ghi chú
                </span>
                <p className="text-xs text-[#5A777E] leading-relaxed italic">
                  {selectedAppointment.ghiChu || 'Không có ghi chú thêm.'}
                </p>
              </div>

              {selectedAppointment.lyDoTuChoi && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                    Lý do từ chối:
                  </span>
                  <p>{selectedAppointment.lyDoTuChoi}</p>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#E8F6F2]/70 border border-[#CEEDE4] flex items-start gap-2.5 text-xs text-[#1E384C]">
              <Info className="w-4 h-4 text-[#169C89] mt-0.5 shrink-0" />
              <p className="leading-relaxed">
                Để điều chỉnh ngày giờ khám hoặc hủy yêu cầu, vui lòng thông báo trực tiếp với nhân viên khi phòng khám gọi xác nhận hoặc liên hệ tại quầy tiếp đón.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="px-5 py-2.5 rounded-2xl bg-[#169C89] hover:bg-[#138776] text-white text-xs sm:text-sm font-bold shadow-soft transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. MODAL XEM CHI TIẾT LỊCH KHÁM CHÍNH THỨC                */}
      {/* ========================================================= */}
      {selectedOfficialAppointment && (
        <div
          className="fixed inset-0 z-50 bg-[#1E384C]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedOfficialAppointment(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white border border-[#CEEDE4] shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#F0F5F3]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1E384C]">
                  Chi tiết lịch khám chính thức
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOfficialAppointment(null)}
                className="w-8 h-8 rounded-full bg-[#F0F5F3] hover:bg-[#E3ECE9] text-[#7A9A93] hover:text-[#1E384C] flex items-center justify-center transition-colors"
                title="Đóng modal (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-mono font-extrabold text-sm sm:text-base text-[#1E384C]">
                  {selectedOfficialAppointment.maLich}
                </div>
                <div className="text-[11px] text-[#7A9A93]">
                  {selectedOfficialAppointment.maYeuCau ? `Từ yêu cầu: ${selectedOfficialAppointment.maYeuCau}` : 'Đặt trực tiếp'}
                </div>
              </div>
              <div className="shrink-0">
                {renderOfficialStatusBadge(selectedOfficialAppointment.trangThai)}
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-[#F0F5F3] space-y-1">
                  <span className="text-[11px] font-semibold text-[#7A9A93] uppercase tracking-wider block">
                    Bác sĩ phụ trách
                  </span>
                  <div className="inline-flex items-center gap-1.5 font-bold text-[#1E384C]">
                    <UserCheck className="w-3.5 h-3.5 text-[#169C89]" />
                    <span>{selectedOfficialAppointment.tenBacSi || 'Chưa rõ'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#F0F5F3] space-y-1">
                  <span className="text-[11px] font-semibold text-[#7A9A93] uppercase tracking-wider block">
                    Phòng khám
                  </span>
                  <div className="inline-flex items-center gap-1.5 font-bold text-[#1E384C]">
                    <Building2 className="w-3.5 h-3.5 text-[#169C89]" />
                    <span>{selectedOfficialAppointment.tenPhong || 'Chưa xếp phòng'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-[#F0F5F3] space-y-1">
                  <span className="text-[11px] font-semibold text-[#7A9A93] uppercase tracking-wider block">
                    Ngày khám
                  </span>
                  <div className="inline-flex items-center gap-1.5 font-bold text-[#1E384C]">
                    <Calendar className="w-3.5 h-3.5 text-[#169C89]" />
                    <span>{formatDateVN(selectedOfficialAppointment.ngayKham)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#F0F5F3] space-y-1">
                  <span className="text-[11px] font-semibold text-[#7A9A93] uppercase tracking-wider block">
                    Khung giờ khám
                  </span>
                  <div className="inline-flex items-center gap-1.5 font-bold text-[#1E384C]">
                    <Clock className="w-3.5 h-3.5 text-[#169C89]" />
                    <span>
                      {formatTimeRange(
                        selectedOfficialAppointment.gioBatDau,
                        selectedOfficialAppointment.gioKetThuc
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#F0F5F3] space-y-1">
                <span className="text-[11px] font-semibold text-[#7A9A93] uppercase tracking-wider block">
                  Dịch vụ / Lý do khám
                </span>
                <span className="font-bold text-[#1E384C] block">
                  {selectedOfficialAppointment.lyDoKham || 'Khám nha khoa tổng quát'}
                </span>
              </div>

              {selectedOfficialAppointment.lyDoHuyThayDoi && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                    Lý do hủy / phản hồi:
                  </span>
                  <p>{selectedOfficialAppointment.lyDoHuyThayDoi}</p>
                </div>
              )}
            </div>

            {selectedOfficialAppointment.trangThai === 'CHO_BENH_NHAN_XAC_NHAN' && (
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#F59E0B]/30 space-y-3">
                <div className="flex items-start gap-2 text-xs text-[#D97706] font-semibold leading-relaxed">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Lịch khám này đã được phân công và đang chờ bạn xác nhận. Bạn có đồng ý với thời gian và bác sĩ này không?
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleConfirmAppointment(selectedOfficialAppointment.maLich)}
                    disabled={confirmingId === selectedOfficialAppointment.maLich}
                    className="flex-1 py-2 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white font-bold text-xs shadow-soft transition-all inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {confirmingId === selectedOfficialAppointment.maLich ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Xác nhận lịch khám</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenRejectModal(selectedOfficialAppointment)}
                    className="py-2 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Từ chối</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOfficialAppointment(null)}
                className="px-5 py-2.5 rounded-2xl bg-[#F0F5F3] hover:bg-[#E3ECE9] text-[#1E384C] text-xs sm:text-sm font-bold transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. MODAL TỪ CHỐI LỊCH KHÁM (REJECT MODAL CÓ NHẬP LÝ DO)     */}
      {/* ========================================================= */}
      {rejectingAppointment && (
        <div
          className="fixed inset-0 z-50 bg-[#1E384C]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={handleCloseRejectModal}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white border border-red-200 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F3]">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-bold text-[#1E384C]">
                  Từ chối lịch khám {rejectingAppointment.maLich}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseRejectModal}
                className="w-8 h-8 rounded-full bg-[#F0F5F3] hover:bg-[#E3ECE9] text-[#7A9A93] hover:text-[#1E384C] flex items-center justify-center transition-colors"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#7A9A93]">Bác sĩ:</span>
                <span className="font-bold text-[#1E384C]">{rejectingAppointment.tenBacSi || 'Chưa rõ'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A9A93]">Thời gian:</span>
                <span className="font-bold text-[#1E384C]">
                  {formatDateVN(rejectingAppointment.ngayKham)} ({formatTimeRange(rejectingAppointment.gioBatDau, rejectingAppointment.gioKetThuc)})
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reject-reason-input" className="block text-xs font-bold text-[#1E384C]">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reject-reason-input"
                rows={3}
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                  if (rejectError) setRejectError(null);
                }}
                placeholder="Ví dụ: Tôi bận đột xuất khung giờ này, muốn dời sang ngày khác..."
                className={`w-full p-3 rounded-2xl border text-xs sm:text-sm text-[#1E384C] placeholder-[#94A3B8] focus:outline-none focus:ring-2 transition-all ${
                  rejectError
                    ? 'border-red-400 focus:ring-red-400/20'
                    : 'border-[#E3ECE9] focus:border-red-400 focus:ring-red-400/20'
                }`}
              />
              {rejectError && (
                <p className="text-[11px] font-semibold text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{rejectError}</span>
                </p>
              )}
            </div>

            <p className="text-[11px] text-[#7A9A93] leading-relaxed">
              Sau khi từ chối, lịch khám sẽ được đánh dấu đã hủy và phòng khám sẽ nhận được lý do của bạn.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCloseRejectModal}
                disabled={isSubmittingReject}
                className="px-4 py-2.5 rounded-2xl bg-[#F0F5F3] hover:bg-[#E3ECE9] text-[#5A777E] hover:text-[#1E384C] text-xs font-bold transition-all disabled:opacity-50"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={handleSubmitReject}
                disabled={isSubmittingReject}
                className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-soft transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmittingReject ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
                <span>Xác nhận từ chối</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
