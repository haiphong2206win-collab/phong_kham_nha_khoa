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
} from 'lucide-react';
import type { AuthSession } from '@/types/auth';
import type { BenhNhanProfile, YeuCauDatLich, CaKham, TrangThaiYeuCau } from '@/types/patient';
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
  onNavigateTab: (tab: PatientNavTab) => void;
  onReloadData: () => Promise<void>;
}

type FilterStatus = 'ALL' | 'CHO_PHAN_CONG' | 'DA_PHAN_CONG' | 'TU_CHOI' | 'DA_HUY';
type FilterTime = 'ALL' | 'UPCOMING_VISIT' | 'THIS_MONTH_VISIT' | 'LAST_7_DAYS_SUBMITTED';

const CA_KHAM_LABEL: Record<CaKham, string> = {
  CA_SANG: 'Ca Sáng',
  CA_CHIEU: 'Ca Chiều',
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
 * Hàm loại bỏ dấu tiếng Việt để tìm kiếm không phụ thuộc dấu
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

export const PatientAppointments: React.FC<PatientAppointmentsProps> = ({
  session,
  profile,
  appointments,
  onNavigateTab,
  onReloadData,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [timeFilter, setTimeFilter] = useState<FilterTime>('ALL');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Detail Modal State
  const [selectedAppointment, setSelectedAppointment] = useState<YeuCauDatLich | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedAppointment) {
        setSelectedAppointment(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAppointment]);

  // Support openModal query parameter (e.g. ?tab=appointments&openModal=YC-66c8ff84)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const openModalCode = params.get('openModal');
      if (openModalCode && appointments.length > 0) {
        const found = appointments.find((a) => a.maYeuCau === openModalCode);
        if (found && !selectedAppointment) {
          handleOpenDetail(found);
        }
      }
    }
  }, [appointments]);

  // Reload handler with spinner
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onReloadData();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Open detail modal with API fetch
  const handleOpenDetail = async (item: YeuCauDatLich) => {
    setSelectedAppointment(item);
    setIsLoadingDetail(true);
    try {
      const freshDetail = await patientService.getAppointmentRequestById(item.maYeuCau);
      setSelectedAppointment(freshDetail);
    } catch (err) {
      // Keep existing data if network/API error
      console.warn('Không thể tải chi tiết mới nhất từ API, hiển thị dữ liệu bộ nhớ đệm:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // 5 Stat counts (tách bạch rõ ràng DA_HUY và TU_CHOI)
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

  // Filtered appointments list
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

      // 2. Search Query (Unaccented Vietnamese)
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

      // 3. Time Filter (sử dụng ngày theo múi giờ địa phương)
      if (timeFilter !== 'ALL') {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 1-12
        const currentDate = now.getDate(); // 1-31

        // Định dạng YYYY-MM-DD theo giờ địa phương
        const localTodayStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDate).padStart(2, '0')}`;

        if (timeFilter === 'UPCOMING_VISIT') {
          // Lọc theo ngày mong muốn khám: từ hôm nay trở về sau
          if (!item.ngayMongMuon || item.ngayMongMuon < localTodayStr) {
            return false;
          }
        } else if (timeFilter === 'THIS_MONTH_VISIT') {
          // Lọc theo ngày mong muốn khám: cùng năm và tháng với tháng hiện tại
          if (!item.ngayMongMuon) return false;
          const [y, m] = item.ngayMongMuon.split('-').map((v) => parseInt(v, 10));
          if (y !== currentYear || m !== currentMonth) {
            return false;
          }
        } else if (timeFilter === 'LAST_7_DAYS_SUBMITTED') {
          // Lọc theo thời gian gửi yêu cầu: tính từ 00:00:00 của 7 ngày trước theo giờ địa phương
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

  // Helper render status badge
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. HERO BANNER (Đồng bộ nhận diện Nha Khoa Nụ Cười Xanh & Mockup) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EBF7F4] via-[#F0F9F7] to-[#E3F4EF] border border-[#CEEDE4] p-6 sm:p-8 lg:p-10 shadow-soft-card">
        {/* Vector Mascot Art Positioned on Right */}
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
            Theo dõi các yêu cầu đặt lịch, tình trạng xử lý và thông tin khám của bạn một cách dễ dàng.
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

      {/* 2. 5 STAT CARDS (Tách biệt rõ ràng Đã phân công, Chờ phân công, Đã từ chối và Đã hủy) */}
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

        {/* Card 5: Đã hủy (Riêng biệt, không gộp với từ chối) */}
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

      {/* 3. BỘ LỌC VÀ TÌM KIẾM (Pills + Input Search + Time Dropdown) */}
      <section className="space-y-3.5">
        {/* Hàng 1: Tabs Trạng thái (Pills) */}
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

        {/* Hàng 2: Thanh tìm kiếm & Dropdown thời gian */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Ô Tìm kiếm */}
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

          {/* Dropdown Thời gian & Nút Xóa lọc (Xác định rõ Ngày khám vs Thời gian gửi) */}
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

      {/* 4. DANH SÁCH YÊU CẦU ĐẶT LỊCH (Bảng Desktop & Card Mobile) */}
      <section className="rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card overflow-hidden">
        {filteredAppointments.length > 0 ? (
          <>
            {/* DESKTOP TABLE VIEW (Ẩn trên mobile < 768px) */}
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
                      {/* Mã yêu cầu */}
                      <td className="py-4 px-6 font-mono font-bold text-[#169C89]">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(req)}
                          className="hover:underline focus:outline-none"
                        >
                          {req.maYeuCau}
                        </button>
                      </td>

                      {/* Lý do / Dịch vụ khám */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#1E384C] max-w-xs sm:max-w-sm truncate" title={req.lyDoKham}>
                          {req.lyDoKham}
                        </div>
                        {req.ghiChu && (
                          <div className="text-[11px] text-[#7A9A93] line-clamp-1 mt-0.5" title={req.ghiChu}>
                            Ghi chú: {req.ghiChu}
                          </div>
                        )}
                      </td>

                      {/* Ngày khám mong muốn & Ca */}
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center gap-1.5 font-semibold text-[#1E384C]">
                          <Calendar className="w-3.5 h-3.5 text-[#169C89]" />
                          <span>{formatDateVN(req.ngayMongMuon)}</span>
                        </div>
                        <div className="text-[11px] text-[#7A9A93] mt-0.5">
                          ({CA_KHAM_LABEL[req.caKham] || req.caKham})
                        </div>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-4 px-6">
                        {renderStatusBadge(req.trangThai)}
                      </td>

                      {/* Thời gian gửi */}
                      <td className="py-4 px-6 text-[#5A777E]">
                        {formatDateTimeVN(req.thoiGianGui)}
                      </td>

                      {/* Thao tác */}
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

            {/* MOBILE CARD VIEW (Hiển thị khi < 768px, khớp chuẩn giao diện mobile trong ảnh duyệt) */}
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
          /* EMPTY STATE (Khi không có dữ liệu hoặc không khớp bộ lọc) */
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

      {/* 5. 2 BOTTOM CARDS (Khớp 100% Mockup: "Lưu ý về lịch khám" & "Bạn cần hỗ trợ?") */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Card 1: Lưu ý về lịch khám */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card flex items-start gap-4">
          <MiniCalendarArt className="w-14 h-14 sm:w-16 sm:h-16 shrink-0" />
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-[#1E384C]">
              Lưu ý về lịch khám
            </h3>
            <ul className="text-xs text-[#5A777E] space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#169C89] mt-1.5 shrink-0" />
                <span>Đây là danh sách các yêu cầu đặt lịch bạn đã gửi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#169C89] mt-1.5 shrink-0" />
                <span>Phòng khám sẽ liên hệ để xác nhận và phân công lịch khám chính thức.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#169C89] mt-1.5 shrink-0" />
                <span>Vui lòng giữ điện thoại liên lạc để không bỏ lỡ thông tin.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Card 2: Bạn cần hỗ trợ? */}
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

      {/* 6. MODAL XEM CHI TIẾT YÊU CẦU ĐẶT LỊCH (Dữ liệu thật từ Backend API) */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-50 bg-[#1E384C]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white border border-[#CEEDE4] shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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

            {/* Modal Top Card: Mã & Thời gian gửi & Trạng thái */}
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

            {/* Chi tiết từng trường */}
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

              {/* Nếu có lý do từ chối */}
              {selectedAppointment.lyDoTuChoi && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
                  <span className="font-bold block flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                    Lý do từ chối:
                  </span>
                  <p>{selectedAppointment.lyDoTuChoi}</p>
                </div>
              )}
            </div>

            {/* Thông báo hướng dẫn trung thực (Khớp chuẩn Mockup duyệt) */}
            <div className="p-3.5 rounded-2xl bg-[#E8F6F2]/70 border border-[#CEEDE4] flex items-start gap-2.5 text-xs text-[#1E384C]">
              <Info className="w-4 h-4 text-[#169C89] mt-0.5 shrink-0" />
              <p className="leading-relaxed">
                Để điều chỉnh ngày giờ khám hoặc hủy yêu cầu, vui lòng thông báo trực tiếp với nhân viên khi phòng khám gọi xác nhận hoặc liên hệ tại quầy tiếp đón.
              </p>
            </div>

            {/* Modal Actions */}
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
    </div>
  );
};
