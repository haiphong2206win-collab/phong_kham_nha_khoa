import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Layers,
  RefreshCw,
  AlertCircle,
  Info,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Activity,
  PauseCircle,
  XCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import type {
  LoTrinhDieuTri,
  BuoiDieuTri,
  TrangThaiLoTrinh,
  TrangThaiBuoiDieuTri,
} from '@/types/patient';
import type { AuthSession } from '@/types/auth';
import { patientService } from '@/services/patient.service';
import {
  TreatmentHeroArt,
  ToothMascotWithQuestion,
} from './PatientIllustrations';

interface PatientTreatmentProps {
  session: AuthSession;
  onNavigateTab?: (tab: 'overview' | 'booking' | 'appointments' | 'treatment-plan' | 'profile' | 'notifications' | 'faq') => void;
}

export const PatientTreatment: React.FC<PatientTreatmentProps> = ({
  session: _session,
  onNavigateTab,
}) => {
  // Trạng thái dữ liệu Backend
  const [loading, setLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [realPlans, setRealPlans] = useState<LoTrinhDieuTri[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPlanSessions, setSelectedPlanSessions] = useState<BuoiDieuTri[]>([]);
  const [loadingSessions, setLoadingSessions] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Bộ lọc trạng thái lộ trình: 'ALL' | TrangThaiLoTrinh
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Gọi kiểm tra kết nối API thật của Backend dành cho Bệnh nhân
  const fetchTreatmentPlans = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await patientService.getMyTreatmentPlans();
      setIsBackendConnected(res.available);
      setRealPlans(res.plans || []);
      if (res.available && res.plans && res.plans.length > 0) {
        setSelectedPlanId(res.plans[0].maLoTrinhDieuTri);
      } else {
        setSelectedPlanId(null);
      }
    } catch (err: unknown) {
      setIsBackendConnected(false);
      setRealPlans([]);
      setSelectedPlanId(null);
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Đã xảy ra lỗi không xác định khi kết nối máy chủ.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatmentPlans();
  }, []);

  // Tải danh sách buổi điều trị thật khi chọn một lộ trình thật
  useEffect(() => {
    if (!selectedPlanId || !isBackendConnected) {
      setSelectedPlanSessions([]);
      return;
    }

    let isMounted = true;
    const fetchSessions = async () => {
      setLoadingSessions(true);
      try {
        const sessions = await patientService.getTreatmentSessions(selectedPlanId);
        if (isMounted) {
          setSelectedPlanSessions(sessions);
        }
      } catch {
        if (isMounted) {
          setSelectedPlanSessions([]);
        }
      } finally {
        if (isMounted) {
          setLoadingSessions(false);
        }
      }
    };

    fetchSessions();
    return () => {
      isMounted = false;
    };
  }, [selectedPlanId, isBackendConnected]);

  // Lọc danh sách lộ trình thật theo bộ lọc
  const filteredRealPlans = realPlans.filter((plan) => {
    if (statusFilter === 'ALL') return true;
    return plan.trangThai === statusFilter;
  });

  // Lộ trình thật đang được chọn
  const activePlan = realPlans.find((p) => p.maLoTrinhDieuTri === selectedPlanId);

  // Tính toán số liệu thống kê: Phân biệt rõ dữ liệu chưa có (hiển thị '—')
  const statTotalPlans = isBackendConnected ? realPlans.length : '—';
  const statCompletedSessions = isBackendConnected
    ? realPlans.reduce((acc, p) => acc + (p.soBuoiHoanThanh || 0), 0)
    : '—';
  const statActivePlans = isBackendConnected
    ? realPlans.filter((p) => p.trangThai === 'DANG_DIEU_TRI').length
    : '—';

  // Tính phần trăm tiến độ của lộ trình đang chọn (tránh chia cho 0, loại trừ DA_BO)
  const currentTotalSessions = activePlan?.tongSoBuoi || 0;
  const currentCompletedSessions = activePlan?.soBuoiHoanThanh || 0;
  const progressPercent =
    currentTotalSessions > 0
      ? Math.min(100, Math.round((currentCompletedSessions / currentTotalSessions) * 100))
      : 0;

  // Nhãn tiếng Việt cho trạng thái Lộ trình
  const getPlanStatusLabel = (status: TrangThaiLoTrinh): { label: string; className: string } => {
    switch (status) {
      case 'DANG_DIEU_TRI':
        return { label: 'Đang điều trị', className: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'HOAN_THANH':
        return { label: 'Hoàn thành', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'TAM_DUNG':
        return { label: 'Tạm dừng', className: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'CHUA_BAT_DAU':
        return { label: 'Chưa bắt đầu', className: 'bg-slate-50 text-slate-600 border-slate-200' };
      case 'DA_HUY':
        return { label: 'Đã hủy', className: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: status, className: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  // Badge trạng thái Buổi điều trị
  const renderSessionStatusBadge = (status: TrangThaiBuoiDieuTri) => {
    switch (status) {
      case 'HOAN_THANH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Hoàn thành</span>
          </span>
        );
      case 'DA_LEN_LICH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <span>Đã lên lịch</span>
          </span>
        );
      case 'DANG_THUC_HIEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            <Activity className="h-3.5 w-3.5 text-teal-600 animate-pulse" />
            <span>Đang thực hiện</span>
          </span>
        );
      case 'LICH_DA_HUY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="h-3.5 w-3.5 text-rose-600" />
            <span>Lịch đã hủy</span>
          </span>
        );
      case 'TAM_HOAN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <PauseCircle className="h-3.5 w-3.5 text-amber-600" />
            <span>Tạm hoãn</span>
          </span>
        );
      case 'DA_BO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200 line-through">
            <XCircle className="h-3.5 w-3.5 text-gray-400" />
            <span>Đã bỏ</span>
          </span>
        );
      case 'CHUA_LEN_LICH':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Chưa lên lịch</span>
          </span>
        );
    }
  };

  // Node timeline icon
  const renderTimelineNode = (status: TrangThaiBuoiDieuTri) => {
    switch (status) {
      case 'HOAN_THANH':
        return (
          <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs ring-4 ring-emerald-50">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        );
      case 'DA_LEN_LICH':
        return (
          <div className="h-7 w-7 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs ring-4 ring-blue-50">
            <Calendar className="h-4 w-4" />
          </div>
        );
      case 'DANG_THUC_HIEN':
        return (
          <div className="h-7 w-7 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs ring-4 ring-teal-50 animate-pulse">
            <Activity className="h-4 w-4" />
          </div>
        );
      case 'LICH_DA_HUY':
      case 'TAM_HOAN':
        return (
          <div className="h-7 w-7 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs ring-4 ring-amber-50">
            <PauseCircle className="h-4 w-4" />
          </div>
        );
      case 'DA_BO':
        return (
          <div className="h-7 w-7 rounded-full bg-gray-400 text-white flex items-center justify-center shrink-0 shadow-xs ring-4 ring-gray-100">
            <XCircle className="h-4 w-4" />
          </div>
        );
      case 'CHUA_LEN_LICH':
      default:
        return (
          <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 shadow-xs ring-4 ring-slate-50">
            <Clock className="h-3.5 w-3.5" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER: LỘ TRÌNH ĐIỀU TRỊ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#E6F7F2] via-[#EBF9F5] to-[#DDF4EE] border border-[#CEEDE4] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E384C] tracking-tight">
                Lộ trình điều trị
              </h1>
              <span className="p-1 rounded-full bg-white/70 text-[#169C89] shadow-2xs">
                <Sparkles className="h-4 w-4" />
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#527771] font-medium leading-relaxed">
              Theo dõi từng bước chăm sóc nụ cười của bạn tại Nha Khoa Nụ Cười Xanh.
            </p>
          </div>

          {/* Minh họa Mascot Nha Khoa 3D Hero Art */}
          <div className="flex justify-end shrink-0">
            <TreatmentHeroArt className="w-56 h-32 sm:w-64 sm:h-36" />
          </div>
        </div>
      </div>

      {/* 2. BA THẺ THỐNG KÊ (STATS CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Thẻ 1: Lộ trình của tôi */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E3ECE9] shadow-soft-card flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          <div className="h-12 w-12 rounded-2xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center shrink-0">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#7A9A93] block">Lộ trình của tôi</span>
            <div className="text-xl sm:text-2xl font-black text-[#1E384C] tracking-tight mt-0.5">
              {loading ? (
                <div className="h-6 w-8 bg-slate-200 animate-pulse rounded" />
              ) : (
                statTotalPlans
              )}
            </div>
          </div>
        </div>

        {/* Thẻ 2: Buổi đã hoàn thành */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E3ECE9] shadow-soft-card flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#7A9A93] block">Buổi đã hoàn thành</span>
            <div className="text-xl sm:text-2xl font-black text-[#1E384C] tracking-tight mt-0.5">
              {loading ? (
                <div className="h-6 w-8 bg-slate-200 animate-pulse rounded" />
              ) : (
                statCompletedSessions
              )}
            </div>
          </div>
        </div>

        {/* Thẻ 3: Đang thực hiện */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E3ECE9] shadow-soft-card flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <RefreshCw className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#7A9A93] block">Đang thực hiện</span>
            <div className="text-xl sm:text-2xl font-black text-[#1E384C] tracking-tight mt-0.5">
              {loading ? (
                <div className="h-6 w-8 bg-slate-200 animate-pulse rounded" />
              ) : (
                statActivePlans
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2.1 TRƯỜNG HỢP LỖI HỆ THỐNG / MẠNG / PHÂN QUYỀN (HTTP 500 / 403 / MẠNG) */}
      {/* (Không gom vào trạng thái Chờ kết nối, hiển thị thông báo lỗi & nút Thử lại) */}
      {/* ==================================================================== */}
      {errorMsg && !loading && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-red-200 shadow-soft-card space-y-4 max-w-2xl mx-auto text-center">
          <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-xs">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-[#1E384C]">
              Không thể tải dữ liệu lộ trình điều trị
            </h3>
            <p className="text-xs text-red-600 leading-relaxed font-medium">
              {errorMsg}
            </p>
            <p className="text-xs text-[#7A9A93] leading-relaxed pt-1">
              Hệ thống gặp sự cố khi tải dữ liệu từ máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={fetchTreatmentPlans}
              className="px-5 py-2.5 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Thử lại kết nối</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. TRƯỜNG HỢP A: BACKEND CHƯA CUNG CẤP API ĐỌC LỘ TRÌNH CHO BỆNH NHÂN */}
      {/* (Hiển thị khi API chưa tồn tại, không có lỗi 500/mạng/phân quyền)        */}
      {/* ==================================================================== */}
      {!isBackendConnected && !loading && !errorMsg && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* KHỐI TRÁI & GIỮA: THÔNG BÁO CHỜ KẾT NỐI CHUẨN Y KHOA */}
          <div className="lg:col-span-9 p-6 sm:p-8 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0F5F3]">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-[#169C89]" />
                <h2 className="text-base font-bold text-[#1E384C]">
                  Hồ sơ phác đồ điều trị chuyên khoa
                </h2>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EBF3F1] text-[#527771] border border-[#D5E4E0]">
                Hồ sơ phòng khám
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#F0FAF7] border border-[#CEEDE4] space-y-3">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-[#169C89] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#1E384C]">
                    Thông tin lộ trình điều trị đang được kết nối với hệ thống.
                  </h3>
                  <p className="text-xs text-[#527771] leading-relaxed">
                    Theo quy trình y khoa chuẩn tại Nha Khoa Nụ Cười Xanh, phác đồ điều trị chuyên sâu (chỉnh nha, cấy ghép implant, điều trị tủy...) chỉ được kích hoạt sau khi Bác sĩ chuyên khoa thăm khám, chụp phim X-quang và thiết lập hồ sơ bệnh án trực tiếp tại phòng khám.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] text-xs text-[#527771] space-y-1.5">
              <span className="font-bold text-[#1E384C] block">Quy định y khoa phòng khám:</span>
              <p className="leading-relaxed">
                Hồ sơ lộ trình điều trị được Bác sĩ phụ trách thiết lập sau ca thăm khám lâm sàng. Quý khách vui lòng liên hệ phòng khám hoặc Bác sĩ điều trị để được tư vấn chi tiết về phác đồ.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateTab?.('booking')}
                className="px-5 py-2.5 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Đặt lịch khám tư vấn lộ trình</span>
              </button>

              <button
                type="button"
                onClick={fetchTreatmentPlans}
                className="px-4 py-2.5 rounded-xl border border-[#BDE5DC] bg-white hover:bg-[#E8F6F2] text-[#169C89] font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Kiểm tra lại kết nối</span>
              </button>
            </div>
          </div>

          {/* CỘT PHẢI (3 CỘT): LƯU Ý VÀ HỖ TRỢ */}
          <div className="lg:col-span-3 space-y-6">
            {/* CARD 1: LƯU Ý VỀ LỊCH ĐIỀU TRỊ */}
            <div className="p-5 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0F5F3]">
                <CalendarCheck className="h-4 w-4 text-[#169C89]" />
                <h3 className="text-xs font-bold text-[#1E384C]">Lưu ý về lịch điều trị</h3>
              </div>

              <div className="p-3 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-[#169C89] shrink-0 mt-0.5" />
                  <p className="text-[#527771] leading-relaxed">
                    Lịch hẹn và thời gian thực tế do phòng khám xác nhận.
                  </p>
                </div>
                <p className="text-[11px] text-[#7A9A93] leading-relaxed">
                  Khoảng cách giữa các buổi điều trị chỉ mang tính dự kiến và có thể được Bác sĩ điều chỉnh dựa trên tình trạng lành thương thực tế.
                </p>
              </div>
            </div>

            {/* CARD 2: HỖ TRỢ & HƯỚNG DẪN */}
            <div className="p-5 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0F5F3]">
                <HelpCircle className="h-4 w-4 text-[#169C89]" />
                <h3 className="text-xs font-bold text-[#1E384C]">Hỗ trợ & hướng dẫn</h3>
              </div>

              <ul className="space-y-2.5 text-xs text-[#527771]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#169C89] shrink-0 mt-0.5" />
                  <span>Tìm hiểu quy trình điều trị tiêu chuẩn</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#169C89] shrink-0 mt-0.5" />
                  <span>Các lưu ý vệ sinh trong quá trình điều trị</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#169C89] shrink-0 mt-0.5" />
                  <span>Giải đáp các thắc mắc thường gặp</span>
                </li>
              </ul>

              {/* Mascot Nha Khoa Với Dấu Hỏi */}
              <div className="pt-2 flex justify-center">
                <ToothMascotWithQuestion className="w-24 h-24" />
              </div>

              {/* Nút xem câu hỏi thường gặp */}
              <button
                type="button"
                onClick={() => onNavigateTab?.('faq')}
                className="w-full py-2.5 px-3 rounded-xl border border-[#CEEDE4] bg-[#F0FAF7] hover:bg-[#E2F5EF] text-xs font-bold text-[#169C89] transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Xem câu hỏi thường gặp (FAQ)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. TRƯỜNG HỢP B: BACKEND ĐÃ KẾT NỐI NHƯNG DANH SÁCH LỘ TRÌNH RỖNG    */}
      {/* ==================================================================== */}
      {isBackendConnected && !loading && !errorMsg && realPlans.length === 0 && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card text-center space-y-4 max-w-xl mx-auto">
          <div className="h-16 w-16 rounded-3xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center mx-auto shadow-xs">
            <CalendarCheck className="h-8 w-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-[#1E384C]">
              Bạn chưa có lộ trình điều trị nào.
            </h3>
            <p className="text-xs text-[#527771] leading-relaxed max-w-md mx-auto">
              Lộ trình điều trị sẽ xuất hiện tại đây khi phòng khám tạo kế hoạch điều trị cho bạn.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigateTab?.('booking')}
              className="px-5 py-2.5 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs inline-flex items-center gap-1.5"
            >
              <Calendar className="h-4 w-4" />
              <span>Đặt lịch khám ngay</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. TRƯỜNG HỢP C: BACKEND ĐÃ KẾT NỐI VÀ CÓ LỘ TRÌNH THẬT             */}
      {/* ==================================================================== */}
      {isBackendConnected && !loading && !errorMsg && realPlans.length > 0 && activePlan && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CỘT 1 (4 CỘT): DANH SÁCH LỘ TRÌNH THẬT */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F0F5F3]">
                <Layers className="h-4 w-4 text-[#169C89]" />
                <h2 className="text-sm font-bold text-[#1E384C]">
                  Danh sách lộ trình điều trị
                </h2>
              </div>

              {/* BỘ LỌC TRẠNG THÁI */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'ALL', label: 'Tất cả' },
                  { key: 'DANG_DIEU_TRI', label: 'Đang điều trị' },
                  { key: 'HOAN_THANH', label: 'Hoàn thành' },
                  { key: 'TAM_DUNG', label: 'Tạm dừng' },
                  { key: 'CHUA_BAT_DAU', label: 'Chưa bắt đầu' },
                  { key: 'DA_HUY', label: 'Đã hủy' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === tab.key
                        ? 'bg-[#169C89] text-white shadow-xs'
                        : 'bg-[#F4F9F7] text-[#5A777E] hover:bg-[#E8F6F2] hover:text-[#169C89]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* DANH SÁCH THẺ LỘ TRÌNH THẬT */}
              <div className="space-y-2.5 pt-1">
                {filteredRealPlans.map((plan) => {
                  const isSelected = plan.maLoTrinhDieuTri === activePlan.maLoTrinhDieuTri;
                  const statusInfo = getPlanStatusLabel(plan.trangThai);
                  return (
                    <div
                      key={plan.maLoTrinhDieuTri}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedPlanId(plan.maLoTrinhDieuTri)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedPlanId(plan.maLoTrinhDieuTri);
                        }
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#169C89] bg-[#F0FAF7] ring-1 ring-[#169C89]/30 shadow-xs'
                          : 'border-[#E3ECE9] bg-white hover:bg-[#F8FBFA] hover:border-[#CEEDE4]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white shadow-2xs text-[#169C89]' : 'bg-[#F4F9F7] text-[#7A9A93]'
                          }`}
                        >
                          <Activity className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-[#1E384C] block">
                            {plan.tenLoTrinh}
                          </span>
                          <span className="text-[11px] text-[#7A9A93] block mt-0.5">
                            {plan.tongSoBuoi} buổi • {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isSelected ? 'text-[#169C89] translate-x-0.5' : 'text-slate-300'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CỘT 2 (5 CỘT): CHI TIẾT LỘ TRÌNH THẬT */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-6">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#F0F5F3]">
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="h-5 w-5 text-[#169C89]" />
                  <h3 className="text-base font-bold text-[#1E384C]">
                    Chi tiết lộ trình: {activePlan.tenLoTrinh}
                  </h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPlanStatusLabel(activePlan.trangThai).className}`}>
                  {getPlanStatusLabel(activePlan.trangThai).label}
                </span>
              </div>

              {/* THANH TIẾN ĐỘ LỘ TRÌNH */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#1E384C]">Tiến độ lộ trình</span>
                  <span className="text-[#169C89] font-extrabold">{progressPercent}%</span>
                </div>
                <div className="h-2.5 w-full bg-[#E8F3F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#169C89] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#7A9A93] text-right">
                  Đã hoàn thành {currentCompletedSessions} trên tổng số {currentTotalSessions} buổi áp dụng
                </p>
              </div>

              {/* TIMELINE CÁC BUỔI ĐIỀU TRỊ THẬT */}
              {loadingSessions ? (
                <div className="p-8 text-center text-xs text-[#7A9A93]">
                  <RefreshCw className="h-5 w-5 animate-spin text-[#169C89] mx-auto mb-2" />
                  <span>Đang tải các buổi điều trị...</span>
                </div>
              ) : selectedPlanSessions.length > 0 ? (
                <div className="relative pl-6 sm:pl-8 space-y-6 pt-2">
                  <div className="absolute left-3.5 sm:left-4.5 top-5 bottom-5 w-0.5 bg-[#E2ECE8] -translate-x-1/2" />
                  {selectedPlanSessions.map((session) => (
                    <div key={session.maBuoiDieuTri} className="relative flex items-start gap-3.5 sm:gap-4">
                      <div className="absolute -left-6 sm:-left-8 top-0.5 z-10 -translate-x-1/2">
                        {renderTimelineNode(session.trangThai)}
                      </div>

                      <div className="flex-1 p-3.5 sm:p-4 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-[#1E384C]">
                            Buổi {session.soThuTu}: {session.tenBuoi}
                          </h4>
                          <div>
                            {renderSessionStatusBadge(session.trangThai)}
                          </div>
                        </div>

                        {session.noiDung && (
                          <p className="text-xs text-[#527771] leading-relaxed">
                            {session.noiDung}
                          </p>
                        )}

                        {session.ngayKham && session.gioBatDau && (
                          <div className="mt-2 p-2.5 rounded-xl bg-white border border-teal-200 text-[11px] text-[#0D6E60]">
                            <div className="flex items-center gap-1.5 font-bold">
                              <CalendarCheck className="h-3.5 w-3.5" />
                              <span>
                                Ngày khám: {session.ngayKham.split('-').reverse().join('/')} •{' '}
                                {session.gioBatDau.slice(0, 5)}–{session.gioKetThuc?.slice(0, 5)}
                              </span>
                            </div>
                            <div className="mt-1 text-[#527771]">
                              {session.tenBacSi ? `Bác sĩ ${session.tenBacSi}` : ''}
                              {session.tenPhong ? ` • ${session.tenPhong}` : ''}
                            </div>
                          </div>
                        )}

                        {session.khoangCachMin != null && session.khoangCachMax != null && (
                          <p className="text-[11px] text-[#7A9A93] flex items-center gap-1 pt-0.5">
                            <Clock className="h-3 w-3 shrink-0" />
                            <span>Khoảng cách dự kiến: {session.khoangCachMin} - {session.khoangCachMax} ngày</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[#7A9A93] bg-[#F8FBFA] rounded-2xl border border-dashed border-[#E3ECE9]">
                  Chưa có thông tin buổi điều trị cho lộ trình này.
                </div>
              )}
            </div>
          </div>

          {/* CỘT 3 (3 CỘT): HƯỚNG DẪN */}
          <div className="lg:col-span-3 space-y-6">
            <div className="p-5 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0F5F3]">
                <CalendarCheck className="h-4 w-4 text-[#169C89]" />
                <h3 className="text-xs font-bold text-[#1E384C]">Lưu ý về lịch điều trị</h3>
              </div>

              <div className="p-3 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-[#169C89] shrink-0 mt-0.5" />
                  <p className="text-[#527771] leading-relaxed">
                    Ngày giờ trong lộ trình đã được bác sĩ lập thành lịch khám chính thức. Bạn có thể xem lại đồng thời tại mục Lịch khám của tôi.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0F5F3]">
                <HelpCircle className="h-4 w-4 text-[#169C89]" />
                <h3 className="text-xs font-bold text-[#1E384C]">Hỗ trợ & hướng dẫn</h3>
              </div>

              <div className="pt-2 flex justify-center">
                <ToothMascotWithQuestion className="w-24 h-24" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
