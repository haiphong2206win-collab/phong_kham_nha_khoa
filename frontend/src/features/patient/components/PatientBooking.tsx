import React, { useState, useMemo, useEffect } from 'react';
import type { AuthSession } from '@/types/auth';
import type { BenhNhanProfile, YeuCauDatLich, CaKham } from '@/types/patient';
import type { PatientNavTab } from './PatientSidebar';
import { patientService } from '@/services/patient.service';
import {
  BookingHeroDentalArt,
  ToothWithHeadset
} from './PatientIllustrations';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  X,
  Eye,
  Info,
  HelpCircle,
  Edit3,
  ArrowRight,
  RotateCcw,
  Check,
  CalendarCheck,
  Stethoscope
} from 'lucide-react';

interface PatientBookingProps {
  session: AuthSession;
  profile: BenhNhanProfile | null;
  appointments: YeuCauDatLich[];
  onNavigateTab: (tab: PatientNavTab) => void;
  onReloadData: () => Promise<void>;
}

const DENTAL_SERVICES = [
  'Khám ban đầu & tư vấn (chưa rõ vấn đề)',
  'Khám răng định kỳ & cạo vôi răng',
  'Tư vấn niềng răng - Chỉnh nha',
  'Trồng răng Implant kỹ thuật số',
  'Nhổ răng khôn / Tiểu phẫu nha khoa',
  'Điều trị tủy & Sâu răng thẩm mỹ',
  'Tẩy trắng răng & Bọc răng sứ thẩm mỹ',
];

const CA_KHAM_CONFIG: Record<CaKham, { label: string; time: string }> = {
  CA_SANG: { label: 'Ca Sáng', time: '08:00 - 11:30' },
  CA_CHIEU: { label: 'Ca Chiều', time: '13:30 - 17:00' },
};

const TRANG_THAI_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  CHO_PHAN_CONG: {
    label: 'Chờ phân công',
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#D97706]',
    border: 'border-[#FEF3C7]'
  },
  DA_PHAN_CONG: {
    label: 'Đã xác nhận',
    bg: 'bg-[#E8F6F2]',
    text: 'text-[#169C89]',
    border: 'border-[#CEEBE2]'
  },
  CHO_XAC_NHAN: {
    label: 'Chờ xác nhận',
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#D97706]',
    border: 'border-[#FEF3C7]'
  },
  DA_XAC_NHAN: {
    label: 'Đã xác nhận',
    bg: 'bg-[#E8F6F2]',
    text: 'text-[#169C89]',
    border: 'border-[#CEEBE2]'
  },
  TU_CHOI: {
    label: 'Từ chối',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200'
  },
  DA_HUY: {
    label: 'Đã hủy',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200'
  },
};

export const PatientBooking: React.FC<PatientBookingProps> = ({
  session,
  profile,
  appointments,
  onNavigateTab,
  onReloadData,
}) => {
  // Stepper: 1: Chọn thông tin, 2: Xác nhận, 3: Hoàn tất
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [service, setService] = useState<string>('Khám ban đầu & tư vấn (chưa rõ vấn đề)');
  const [date, setDate] = useState<string>('');
  const [shift, setShift] = useState<CaKham>('CA_SANG');
  const [reason, setReason] = useState<string>('');

  // Submission & Feedback States
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdAppointment, setCreatedAppointment] = useState<YeuCauDatLich | null>(null);

  // Detail Modal State
  const [detailModal, setDetailModal] = useState<YeuCauDatLich | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Open detail using real Backend GET /api/v1/yeu-cau-dat-lich/{maYeuCau}
  const handleOpenDetail = async (maYeuCau: string, fallbackReq: YeuCauDatLich) => {
    setDetailModal(fallbackReq);
    setLoadingDetail(true);
    try {
      const realDetail = await patientService.getAppointmentRequestById(maYeuCau);
      setDetailModal(realDetail);
    } catch (err) {
      console.warn('Lỗi khi tải chi tiết yêu cầu đặt lịch từ Backend:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Support opening modal directly from parameter: ?openModal=YC-xxxx
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const openModalId = params.get('openModal');
      if (openModalId && appointments.length > 0) {
        const target = appointments.find((a) => a.maYeuCau === openModalId);
        if (target) {
          handleOpenDetail(target.maYeuCau, target);
        }
      }
    }
  }, [appointments]);

  // Minimum date is today
  const todayStr = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Pre-condition: Check if profile has required phone & DOB according to Backend BenhNhan entity
  const isProfileIncomplete = useMemo(() => {
    if (!profile) return false;
    const hasPhone = Boolean(profile.soDienThoai && /^0\d{9}$/.test(profile.soDienThoai.trim()));
    const hasName = Boolean(profile.hoTen && profile.hoTen.trim().length > 0);
    return !hasPhone || !hasName;
  }, [profile]);

  // Handle Form Cancel / Reset
  const handleResetForm = () => {
    setService('Khám ban đầu & tư vấn (chưa rõ vấn đề)');
    setDate('');
    setShift('CA_SANG');
    setReason('');
    setFormError(null);
    setCurrentStep(1);
  };

  // Step 1 Validation -> Move to Step 2 Review
  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!date) {
      setFormError('Vui lòng chọn ngày bạn muốn khám.');
      return;
    }

    if (date < todayStr) {
      setFormError('Ngày hẹn khám không thể ở quá khứ. Vui lòng chọn ngày từ hôm nay trở đi.');
      return;
    }

    if (!reason.trim()) {
      setFormError('Vui lòng mô tả lý do khám hoặc vấn đề răng miệng bạn đang gặp phải.');
      return;
    }

    // Check duplicate request on the same date & shift in existing appointments
    const isDuplicate = appointments.some(
      (app) =>
        app.ngayMongMuon === date &&
        app.caKham === shift &&
        (app.trangThai === 'CHO_PHAN_CONG' || app.trangThai === 'DA_PHAN_CONG')
    );

    if (isDuplicate) {
      setFormError(`Bạn đã có một yêu cầu khám đang chờ xử lý vào ngày ${date} (${CA_KHAM_CONFIG[shift].label}). Vui lòng chọn ngày hoặc ca khám khác.`);
      return;
    }

    // Switch to step 2 for review
    setCurrentStep(2);
  };

  // Step 2 Confirm -> Call Real Backend API
  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    setFormError(null);

    try {
      const response = await patientService.createAppointmentRequest({
        ngayMongMuon: date,
        caKham: shift,
        lyDoKham: service,
        ghiChu: reason.trim(),
      });

      setCreatedAppointment(response);
      setCurrentStep(3);
      // Reload appointment list from database
      await onReloadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể gửi yêu cầu đặt lịch. Vui lòng thử lại sau.';
      setFormError(msg);
      // Stay on step 2 or go back to step 1
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. HERO BANNER - ĐẶT LỊCH KHÁM */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#D7F1EA] via-[#E9F8F4] to-[#CDEEE4] border border-[#CEEBE2] shadow-soft-card p-6 sm:p-8 min-h-[148px] flex items-center justify-between">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-[#169C89] text-white flex items-center justify-center shadow-md shadow-[#169C89]/20 shrink-0">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1E384C] tracking-tight">
                Đặt lịch khám
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#4E6B65] font-medium leading-relaxed pl-1 sm:pl-0">
            Gửi yêu cầu đặt lịch khám tại Nha Khoa Nụ Cười Xanh. Chúng tôi sẽ liên hệ xác nhận sớm nhất.
          </p>
        </div>

        {/* Right Hero Graphic */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-80 lg:w-96">
          <BookingHeroDentalArt />
        </div>
      </div>

      {/* 2. PROFILE INCOMPLETE ALERT (If phone or name missing in MySQL) */}
      {isProfileIncomplete && (
        <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FEF3C7] text-amber-800 text-xs font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              Hồ sơ của bạn chưa đủ số điện thoại hoặc thông tin bắt buộc theo quy định phòng khám. Vui lòng hoàn thiện hồ sơ để hệ thống xác nhận lịch nhanh nhất.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('profile')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shrink-0 shadow-2xs"
          >
            Cập nhật hồ sơ
          </button>
        </div>
      )}

      {/* 3. MAIN SECTION: FORM + GUIDANCE (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: INTERACTIVE FORM WITH STEPPER (8 COLS) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E3ECE9] shadow-soft-card p-6 sm:p-8 space-y-6">
          {/* STEPPER BAR */}
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-4 pb-4 border-b border-[#F0F5F3]">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep === 1
                  ? 'bg-[#169C89] text-white shadow-sm shadow-[#169C89]/30'
                  : currentStep > 1
                    ? 'bg-[#E8F6F2] text-[#169C89]'
                    : 'bg-[#F0F5F3] text-[#7A9A93]'
              }`}>
                {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className={`text-xs font-bold transition-colors ${
                currentStep === 1 ? 'text-[#1E384C]' : 'text-[#7A9A93]'
              }`}>
                Chọn thông tin
              </span>
            </div>

            <div className="w-8 sm:w-14 h-[2px] bg-[#E3ECE9]" />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep === 2
                  ? 'bg-[#169C89] text-white shadow-sm shadow-[#169C89]/30'
                  : currentStep > 2
                    ? 'bg-[#E8F6F2] text-[#169C89]'
                    : 'bg-[#F0F5F3] text-[#7A9A93]'
              }`}>
                {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <span className={`text-xs font-bold transition-colors ${
                currentStep === 2 ? 'text-[#1E384C]' : 'text-[#7A9A93]'
              }`}>
                Xác nhận
              </span>
            </div>

            <div className="w-8 sm:w-14 h-[2px] bg-[#E3ECE9]" />

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep === 3
                  ? 'bg-[#169C89] text-white shadow-sm shadow-[#169C89]/30'
                  : 'bg-[#F0F5F3] text-[#7A9A93]'
              }`}>
                3
              </div>
              <span className={`text-xs font-bold transition-colors ${
                currentStep === 3 ? 'text-[#1E384C]' : 'text-[#7A9A93]'
              }`}>
                Hoàn tất
              </span>
            </div>
          </div>

          {/* FORM ERROR BANNER */}
          {formError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: FORM INPUT */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedToConfirm} className="space-y-5">
              {/* Field 1: Dịch vụ khám */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1E384C] flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4 text-[#169C89]" />
                  <span>Dịch vụ khám</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E1ECE7] bg-[#F8FBFA] focus:bg-white focus:border-[#169C89] focus:ring-2 focus:ring-[#169C89]/20 outline-hidden text-xs sm:text-sm font-semibold text-[#1E384C] transition-all cursor-pointer appearance-none pr-10"
                  >
                    {DENTAL_SERVICES.map((srv) => (
                      <option key={srv} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#7A9A93]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Field 2: Ngày muốn khám + Ca khám (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ngày muốn khám */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E384C] flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#169C89]" />
                    <span>Ngày muốn khám</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={todayStr}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-[#E1ECE7] bg-[#F8FBFA] focus:bg-white focus:border-[#169C89] focus:ring-2 focus:ring-[#169C89]/20 outline-hidden text-xs sm:text-sm font-semibold text-[#1E384C] transition-all"
                  />
                </div>

                {/* Ca khám */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E384C] flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#169C89]" />
                    <span>Ca khám</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={shift}
                      onChange={(e) => setShift(e.target.value as CaKham)}
                      className="w-full px-4 py-3 rounded-2xl border border-[#E1ECE7] bg-[#F8FBFA] focus:bg-white focus:border-[#169C89] focus:ring-2 focus:ring-[#169C89]/20 outline-hidden text-xs sm:text-sm font-semibold text-[#1E384C] transition-all cursor-pointer appearance-none pr-10"
                    >
                      {(['CA_SANG', 'CA_CHIEU'] as CaKham[]).map((ca) => (
                        <option key={ca} value={ca}>
                          {CA_KHAM_CONFIG[ca].label} ({CA_KHAM_CONFIG[ca].time})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#7A9A93]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Field 3: Lý do khám / Vấn đề răng miệng */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1E384C] flex items-center gap-1.5">
                  <Edit3 className="h-4 w-4 text-[#169C89]" />
                  <span>Lý do khám / Vấn đề răng miệng</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ví dụ: Đau răng, chảy máu chân răng, kiểm tra định kỳ, tư vấn niềng răng..."
                    required
                    className="w-full px-4 py-3 pb-8 rounded-2xl border border-[#E1ECE7] bg-[#F8FBFA] focus:bg-white focus:border-[#169C89] focus:ring-2 focus:ring-[#169C89]/20 outline-hidden text-xs sm:text-sm text-[#1E384C] placeholder-[#8EA59E] transition-all resize-none"
                  />
                  <div className="absolute right-3.5 bottom-2.5 text-[11px] font-semibold text-[#8EA59E]">
                    {reason.length} / 500
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-2.5 rounded-2xl border border-[#E3ECE9] bg-white hover:bg-[#F0F5F3] text-xs font-bold text-[#4E6B65] transition-all inline-flex items-center gap-1.5"
                >
                  <X className="h-4 w-4" />
                  <span>Hủy</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#169C89] hover:bg-[#138776] active:scale-[0.98] text-white text-xs font-bold transition-all shadow-md shadow-[#169C89]/20 inline-flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Gửi yêu cầu đặt lịch</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: REVIEW & CONFIRM */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#1E384C]">
                  Xác nhận thông tin đặt lịch khám
                </h3>
                <p className="text-xs text-[#7A9A93]">
                  Vui lòng kiểm tra lại các thông tin bên dưới trước khi gửi yêu cầu đến phòng khám.
                </p>
              </div>

              {/* Review Card */}
              <div className="p-5 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#E3ECE9]">
                  <div>
                    <span className="text-[#7A9A93] block">Bệnh nhân</span>
                    <span className="font-bold text-[#1E384C] text-sm">
                      {profile?.hoTen || session.user?.tenDangNhap}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7A9A93] block">Số điện thoại liên hệ</span>
                    <span className="font-bold text-[#1E384C] text-sm">
                      {profile?.soDienThoai || 'Chưa cập nhật'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#E3ECE9]">
                  <div>
                    <span className="text-[#7A9A93] block">Dịch vụ đã chọn</span>
                    <span className="font-bold text-[#169C89] text-sm flex items-center gap-1.5 mt-0.5">
                      <Stethoscope className="h-4 w-4 shrink-0" />
                      {service}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7A9A93] block">Ngày & Ca khám mong muốn</span>
                    <span className="font-bold text-[#1E384C] text-sm flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-4 w-4 text-[#169C89] shrink-0" />
                      {date} ({CA_KHAM_CONFIG[shift].label} - {CA_KHAM_CONFIG[shift].time})
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[#7A9A93] block">Lý do khám / Vấn đề răng miệng</span>
                  <p className="font-medium text-[#1E384C] text-xs mt-1 p-3 rounded-xl bg-white border border-[#E3ECE9] leading-relaxed">
                    {reason}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-2xl border border-[#E3ECE9] bg-white hover:bg-[#F0F5F3] text-xs font-bold text-[#4E6B65] transition-all inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Quay lại chỉnh sửa</span>
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmSubmit}
                  className="px-6 py-2.5 rounded-2xl bg-[#169C89] hover:bg-[#138776] active:scale-[0.98] text-white text-xs font-bold transition-all shadow-md shadow-[#169C89]/20 inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang gửi yêu cầu...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Xác nhận gửi yêu cầu</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {currentStep === 3 && createdAppointment && (
            <div className="py-8 px-4 text-center space-y-5 animate-fadeIn">
              <div className="h-16 w-16 rounded-full bg-[#E8F6F2] border-2 border-[#169C89] text-[#169C89] flex items-center justify-center mx-auto shadow-md shadow-[#169C89]/20">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-lg font-black text-[#1E384C]">
                  Gửi yêu cầu đặt lịch thành công!
                </h3>
                <p className="text-xs text-[#5A777E] leading-relaxed">
                  Hệ thống phòng khám đã tiếp nhận yêu cầu đặt lịch của bạn. Nhân viên tư vấn sẽ liên hệ để xác nhận thời gian chính xác.
                </p>
              </div>

              {/* Receipt Summary Box */}
              <div className="p-4 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#E3ECE9]">
                  <span className="text-[#7A9A93]">Mã yêu cầu:</span>
                  <span className="font-mono font-bold text-[#1E384C] text-sm">
                    {createdAppointment.maYeuCau}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A9A93]">Dịch vụ:</span>
                  <span className="font-bold text-[#1E384C]">
                    {createdAppointment.lyDoKham}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A9A93]">Ngày mong muốn:</span>
                  <span className="font-bold text-[#1E384C]">
                    {createdAppointment.ngayMongMuon}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A9A93]">Ca khám:</span>
                  <span className="font-bold text-[#169C89]">
                    {CA_KHAM_CONFIG[createdAppointment.caKham]?.label || createdAppointment.caKham}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#7A9A93]">Trạng thái:</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-[#FEF3C7] bg-[#FFFBEB] text-[#D97706]">
                    <Clock className="h-3 w-3" />
                    <span>Chờ phân công</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-2.5 rounded-2xl border border-[#E3ECE9] bg-white hover:bg-[#F0F5F3] text-xs font-bold text-[#4E6B65] transition-all inline-flex items-center gap-1.5"
                >
                  <CalendarCheck className="h-4 w-4" />
                  <span>Đặt thêm lịch khác</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('appointments')}
                  className="px-6 py-2.5 rounded-2xl bg-[#169C89] hover:bg-[#138776] text-white text-xs font-bold transition-all shadow-md shadow-[#169C89]/20 inline-flex items-center gap-1.5"
                >
                  <span>Xem danh sách lịch hẹn</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: GUIDANCE CARDS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* CARD 1: HƯỚNG DẪN ĐẶT LỊCH KHÁM */}
          <div className="p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-4">
            <div className="flex items-center gap-2 text-[#169C89]">
              <Info className="h-5 w-5" />
              <h3 className="text-sm font-bold text-[#1E384C]">
                Hướng dẫn đặt lịch khám
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-[#E8F6F2] text-[#169C89] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-[#4E6B65] leading-relaxed">
                  Chọn dịch vụ, ngày và ca khám phù hợp với thời gian biểu của bạn.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-[#E8F6F2] text-[#169C89] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-[#4E6B65] leading-relaxed">
                  Nhập lý do khám để bác sĩ có sự chuẩn bị tốt nhất trước buổi hẹn.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-[#E8F6F2] text-[#169C89] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-[#4E6B65] leading-relaxed">
                  Gửi yêu cầu và chờ phòng khám liên hệ xác nhận trong vòng 15-30 phút.
                </p>
              </div>
            </div>
          </div>

          {/* CARD 2: CẦN HỖ TRỢ ĐẶT LỊCH? (WITH MASCOT TOOTH WITH HEADSET) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#E8F6F2] via-white to-[#F0F9F6] border border-[#CEEBE2] shadow-soft-card relative overflow-hidden">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-2 z-10 max-w-[200px]">
                <div className="flex items-center gap-2 text-[#169C89]">
                  <HelpCircle className="h-5 w-5" />
                  <h3 className="text-sm font-bold text-[#1E384C]">
                    Cần hỗ trợ đặt lịch?
                  </h3>
                </div>
                <p className="text-xs text-[#5A777E] leading-relaxed">
                  Bộ phận tiếp đón phòng khám sẵn sàng hỗ trợ và giải đáp thắc mắc của bạn.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigateTab('faq')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-[#CEEBE2] hover:border-[#169C89] text-[#169C89] text-xs font-bold shadow-2xs hover:shadow-xs transition-all"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Xem câu hỏi thường gặp</span>
                  </button>
                </div>
              </div>

              {/* Cute 3D Tooth Mascot with Headset */}
              <div className="shrink-0 -mr-2 -mb-2">
                <ToothWithHeadset className="w-24 h-24 sm:w-28 sm:h-28" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM TABLE CARD: CÁC YÊU CẦU ĐẶT LỊCH GẦN ĐÂY */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F3]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-[#1E384C]">
              Các yêu cầu đặt lịch gần đây
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0F5F3] text-[#7A9A93]">
              {appointments.length} yêu cầu
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('appointments')}
            className="text-xs font-bold text-[#169C89] hover:underline inline-flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Table Content */}
        {appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3ECE9] text-[11px] font-bold text-[#7A9A93] uppercase tracking-wider">
                  <th className="py-3 px-3">Mã yêu cầu</th>
                  <th className="py-3 px-3">Dịch vụ</th>
                  <th className="py-3 px-3">Ngày mong muốn</th>
                  <th className="py-3 px-3">Ca khám</th>
                  <th className="py-3 px-3">Trạng thái</th>
                  <th className="py-3 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5F3] text-xs">
                {appointments.slice(0, 5).map((req) => {
                  const statusInfo = TRANG_THAI_CONFIG[req.trangThai] || {
                    label: req.trangThai,
                    bg: 'bg-gray-100',
                    text: 'text-gray-600',
                    border: 'border-gray-200',
                  };
                  const shiftInfo = CA_KHAM_CONFIG[req.caKham] || {
                    label: req.caKham,
                    time: '',
                  };

                  return (
                    <tr key={req.maYeuCau} className="hover:bg-[#F8FBFA] transition-colors">
                      {/* Mã yêu cầu */}
                      <td className="py-3.5 px-3 font-mono font-bold text-[#1E384C]">
                        {req.maYeuCau}
                      </td>

                      {/* Dịch vụ */}
                      <td className="py-3.5 px-3 font-semibold text-[#1E384C]">
                        {req.lyDoKham}
                      </td>

                      {/* Ngày mong muốn */}
                      <td className="py-3.5 px-3 text-[#4E6B65] font-medium">
                        {req.ngayMongMuon}
                      </td>

                      {/* Ca khám */}
                      <td className="py-3.5 px-3 text-[#5A777E]">
                        <div>{shiftInfo.label}</div>
                        {shiftInfo.time && (
                          <div className="text-[10px] text-[#7A9A93]">({shiftInfo.time})</div>
                        )}
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusInfo.border} ${statusInfo.bg} ${statusInfo.text}`}>
                          {req.trangThai === 'DA_PHAN_CONG' || req.trangThai === 'DA_XAC_NHAN' ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          <span>{statusInfo.label}</span>
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(req.maYeuCau, req)}
                          className="px-3 py-1.5 rounded-xl border border-[#E3ECE9] hover:border-[#169C89] hover:bg-[#E8F6F2] text-[#169C89] text-xs font-bold transition-all inline-flex items-center gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Xem chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center space-y-2">
            <div className="h-10 w-10 rounded-2xl bg-[#F0F5F3] text-[#7A9A93] flex items-center justify-center mx-auto">
              <Calendar className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-[#1E384C]">Chưa có yêu cầu đặt lịch nào gần đây</h4>
            <p className="text-[11px] text-[#7A9A93]">
              Hãy điền form phía trên để gửi yêu cầu đặt lịch đầu tiên của bạn đến phòng khám.
            </p>
          </div>
        )}
      </div>

      {/* 5. DETAIL MODAL DIALOG */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E384C]/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E3ECE9] shadow-2xl p-6 sm:p-7 space-y-5 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F3]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E384C]">Chi tiết yêu cầu đặt lịch</h3>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#7A9A93]">
                    <span>Mã: {detailModal.maYeuCau}</span>
                    {loadingDetail && (
                      <span className="text-[#169C89] font-sans font-semibold text-[10px] animate-pulse">
                        (Đang đồng bộ dữ liệu...)
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailModal(null)}
                className="h-8 w-8 rounded-xl bg-[#F0F5F3] hover:bg-[#E3ECE9] text-[#7A9A93] flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#7A9A93]">Trạng thái:</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    TRANG_THAI_CONFIG[detailModal.trangThai]?.border || 'border-gray-200'
                  } ${TRANG_THAI_CONFIG[detailModal.trangThai]?.bg || 'bg-gray-100'} ${
                    TRANG_THAI_CONFIG[detailModal.trangThai]?.text || 'text-gray-600'
                  }`}>
                    {detailModal.trangThai === 'DA_PHAN_CONG' || detailModal.trangThai === 'DA_XAC_NHAN' ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    <span>{TRANG_THAI_CONFIG[detailModal.trangThai]?.label || detailModal.trangThai}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#7A9A93]">Dịch vụ đăng ký:</span>
                  <span className="font-bold text-[#1E384C]">{detailModal.lyDoKham}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#7A9A93]">Ngày muốn khám:</span>
                  <span className="font-bold text-[#169C89]">{detailModal.ngayMongMuon}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#7A9A93]">Ca khám:</span>
                  <span className="font-bold text-[#1E384C]">
                    {CA_KHAM_CONFIG[detailModal.caKham]?.label || detailModal.caKham} ({CA_KHAM_CONFIG[detailModal.caKham]?.time})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#7A9A93]">Thời gian gửi yêu cầu:</span>
                  <span className="font-medium text-[#4E6B65]">
                    {new Date(detailModal.thoiGianGui).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>

              {/* Ghi chú / Vấn đề răng miệng */}
              {detailModal.ghiChu && (
                <div className="space-y-1">
                  <span className="text-[#7A9A93] font-semibold">Mô tả triệu chứng / Ghi chú:</span>
                  <p className="p-3 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] text-[#1E384C] leading-relaxed">
                    {detailModal.ghiChu}
                  </p>
                </div>
              )}

              {/* Notice for changing or canceling */}
              <div className="p-3.5 rounded-2xl bg-[#E8F6F2] border border-[#CEEBE2] text-[11px] text-[#169C89] space-y-1">
                <span className="font-bold block">Bạn cần đổi lịch hoặc hủy yêu cầu?</span>
                <p className="text-[#344C52] leading-relaxed">
                  Để điều chỉnh ngày giờ khám hoặc hủy yêu cầu, vui lòng thông báo trực tiếp với nhân viên khi phòng khám gọi xác nhận hoặc liên hệ tại quầy tiếp đón.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModal(null)}
                className="px-5 py-2 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-xs font-bold transition-colors shadow-2xs"
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
