import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Calendar,
  MapPin,
  Mail,
  ShieldCheck,
  Check,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Edit3,
  Save,
  X,
  Pill,
  HeartPulse,
  Layers,
  CalendarCheck,
  RefreshCw,
  Activity,
} from 'lucide-react';
import type { BenhNhanProfile, CapNhatHoSoPayload, GioiTinh } from '@/types/patient';
import type { AuthSession } from '@/types/auth';
import { patientService } from '@/services/patient.service';
import { ProfileHeroArt, ToothMascotWithShield } from './PatientIllustrations';

interface PatientProfileProps {
  session: AuthSession;
  profile: BenhNhanProfile | null;
  onReloadData: () => Promise<void>;
  onNavigateTab?: (tab: 'overview' | 'booking' | 'appointments' | 'treatment-plan' | 'profile' | 'notifications' | 'faq') => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

interface FormState {
  hoTen: string;
  ngaySinh: string;
  gioiTinh: GioiTinh | '';
  soDienThoai: string;
  email: string;
  diaChi: string;
  diUngThuoc: string;
  tienSuBenh?: string;
}

interface FormErrors {
  hoTen?: string;
  ngaySinh?: string;
  soDienThoai?: string;
  email?: string;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  session,
  profile,
  onReloadData,
  onNavigateTab,
  onDirtyChange,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('mode') === 'edit';
    }
    return false;
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Kiểm tra xem Backend response GET có chứa trường tienSuBenh hay chưa
  // (Hiện tại BenhNhanResponse không có trường này nên profile?.tienSuBenh là undefined)
  const hasTienSuBenhFromBackend = Boolean(
    profile && 'tienSuBenh' in profile && profile.tienSuBenh !== undefined
  );

  // Form State
  const [formData, setFormData] = useState<FormState>({
    hoTen: '',
    ngaySinh: '',
    gioiTinh: '',
    soDienThoai: '',
    email: '',
    diaChi: '',
    diUngThuoc: '',
    tienSuBenh: undefined,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Lấy chuỗi ngày hôm nay YYYY-MM-DD
  const getTodayStr = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  // Kiểm tra dữ liệu form đã bị thay đổi so với dữ liệu profile gốc chưa
  const isFormDirty = Boolean(
    profile &&
      (formData.hoTen.trim() !== (profile.hoTen?.trim() || '') ||
        formData.ngaySinh !== (profile.ngaySinh || '') ||
        formData.gioiTinh !== (profile.gioiTinh || '') ||
        formData.soDienThoai.trim() !== (profile.soDienThoai?.trim() || '') ||
        formData.email.trim() !== (profile.email?.trim() || '') ||
        formData.diaChi.trim() !== (profile.diaChi?.trim() || '') ||
        formData.diUngThuoc.trim() !== (profile.diUngThuoc?.trim() || '') ||
        (hasTienSuBenhFromBackend &&
          formData.tienSuBenh !== undefined &&
          formData.tienSuBenh.trim() !== (profile.tienSuBenh?.trim() || '')))
  );

  // Thông báo trạng thái dirty cho component cha
  useEffect(() => {
    onDirtyChange?.(isEditing && isFormDirty);
  }, [isEditing, isFormDirty, onDirtyChange]);

  // Ngăn chặn vô tình đóng tab hoặc reload trình duyệt khi có dữ liệu chưa lưu
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing && isFormDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isEditing, isFormDirty]);

  // Đồng bộ dữ liệu hồ sơ vào Form khi profile thay đổi
  useEffect(() => {
    if (profile) {
      setFormData({
        hoTen: profile.hoTen || '',
        ngaySinh: profile.ngaySinh || '',
        gioiTinh: profile.gioiTinh || '',
        soDienThoai: profile.soDienThoai || '',
        email: profile.email || '',
        diaChi: profile.diaChi || '',
        diUngThuoc: profile.diUngThuoc || '',
        tienSuBenh: hasTienSuBenhFromBackend ? (profile.tienSuBenh || '') : undefined,
      });
    } else {
      setFormData({
        hoTen: '',
        ngaySinh: '',
        gioiTinh: '',
        soDienThoai: '',
        email: '',
        diaChi: '',
        diUngThuoc: '',
        tienSuBenh: undefined,
      });
    }
    setFormErrors({});
    setServerError(null);
  }, [profile, hasTienSuBenhFromBackend]);

  // Kiểm tra điều kiện hoàn thiện hồ sơ (theo BenhNhan.daHoanThienThongTin() từ Backend)
  const todayStr = getTodayStr();
  const isHoTenValid = Boolean(profile?.hoTen && profile.hoTen.trim().length > 0);
  const isNgaySinhValid = Boolean(
    profile?.ngaySinh && profile.ngaySinh < todayStr
  );
  const isPhoneValid = Boolean(
    profile?.soDienThoai && /^0\d{9}$/.test(profile.soDienThoai)
  );
  const isProfileComplete = isHoTenValid && isNgaySinhValid && isPhoneValid;

  // Điều hướng an toàn sang tab khác nếu có thay đổi chưa lưu
  const handleSafeNavigateTab = (tab: 'overview' | 'booking' | 'appointments' | 'treatment-plan' | 'profile' | 'notifications' | 'faq') => {
    if (isEditing && isFormDirty) {
      const confirmLeave = window.confirm(
        'Bạn có thay đổi chưa lưu trong hồ sơ cá nhân. Bạn có chắc chắn muốn chuyển trang mà không lưu?'
      );
      if (!confirmLeave) return;
    }
    onNavigateTab?.(tab);
  };

  // Format ngày hiển thị DD/MM/YYYY
  const formatDateVN = (dateStr?: string | null): string => {
    if (!dateStr) return 'Chưa cập nhật';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Label giới tính tiếng Việt
  const getGenderLabel = (gender?: GioiTinh | '' | null): string => {
    switch (gender) {
      case 'NAM':
        return 'Nam';
      case 'NU':
        return 'Nữ';
      case 'KHAC':
        return 'Khác';
      default:
        return 'Chưa cập nhật';
    }
  };

  // Avatar viết tắt
  const getInitials = (name?: string, username?: string): string => {
    const target = name?.trim() || username?.trim() || 'BN';
    const words = target.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return target.slice(0, 2).toUpperCase();
  };

  // Validate form trước khi submit PUT
  const validate = (): boolean => {
    const errors: FormErrors = {};

    // 1. Họ và tên
    if (!formData.hoTen.trim()) {
      errors.hoTen = 'Họ và tên không được để trống';
    }

    // 2. Ngày sinh (phải có và phải ở quá khứ)
    if (!formData.ngaySinh) {
      errors.ngaySinh = 'Ngày sinh không được để trống';
    } else if (formData.ngaySinh >= todayStr) {
      errors.ngaySinh = 'Ngày sinh phải ở quá khứ';
    }

    // 3. Số điện thoại (10 chữ số, bắt đầu bằng 0)
    if (!formData.soDienThoai.trim()) {
      errors.soDienThoai = 'Số điện thoại không được để trống';
    } else if (!/^0\d{9}$/.test(formData.soDienThoai.trim())) {
      errors.soDienThoai = 'Số điện thoại phải gồm 10 số và bắt đầu bằng số 0';
    }

    // 4. Email (tùy chọn nhưng nếu có phải đúng định dạng)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Email không đúng định dạng';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Xử lý gửi Form PUT /api/v1/benh-nhan/ho-so-cua-toi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Đóng gói đầy đủ payload, tránh gửi thiếu làm ghi đè null trong cơ sở dữ liệu
      const payload: CapNhatHoSoPayload = {
        hoTen: formData.hoTen.trim(),
        ngaySinh: formData.ngaySinh,
        gioiTinh: formData.gioiTinh ? (formData.gioiTinh as GioiTinh) : null,
        soDienThoai: formData.soDienThoai.trim(),
        email: formData.email.trim() || null,
        diaChi: formData.diaChi.trim() || null,
        diUngThuoc: formData.diUngThuoc.trim() || null,
      };

      // CHỈ gửi tienSuBenh khi trường này thực sự được Backend trả về qua GET
      // Nếu Backend chưa hỗ trợ GET tienSuBenh, TUYỆT ĐỐI không đưa tienSuBenh vào payload (để Jackson bỏ qua, Backend Java giữ nguyên)
      if (hasTienSuBenhFromBackend && formData.tienSuBenh !== undefined) {
        payload.tienSuBenh = formData.tienSuBenh.trim() || null;
      }

      await patientService.updateMyProfile(payload);

      // Tải lại dữ liệu toàn cục để Header, Dashboard và Profile đồng bộ
      await onReloadData();

      setSuccessMessage('Hồ sơ cá nhân đã được cập nhật thành công!');
      setIsEditing(false);

      // Tự động ẩn thông báo thành công sau 4 giây
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err: unknown) {
      let errorMsg = 'Không thể cập nhật hồ sơ. Vui lòng kiểm tra lại thông tin.';
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response?: { data?: { message?: string } } }).response;
        if (res?.data?.message) {
          errorMsg = res.data.message;
        }
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      setServerError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hủy chỉnh sửa, khôi phục dữ liệu ban đầu
  const handleCancel = () => {
    if (profile) {
      setFormData({
        hoTen: profile.hoTen || '',
        ngaySinh: profile.ngaySinh || '',
        gioiTinh: profile.gioiTinh || '',
        soDienThoai: profile.soDienThoai || '',
        email: profile.email || '',
        diaChi: profile.diaChi || '',
        diUngThuoc: profile.diUngThuoc || '',
        tienSuBenh: hasTienSuBenhFromBackend ? (profile.tienSuBenh || '') : undefined,
      });
    }
    setFormErrors({});
    setServerError(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER: Hồ sơ cá nhân */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#E6F7F2] via-[#EBF9F5] to-[#DDF4EE] border border-[#CEEDE4] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E384C] tracking-tight">
              Hồ sơ cá nhân
            </h1>
            <p className="text-xs sm:text-sm text-[#527771] font-medium leading-relaxed">
              Quản lý và cập nhật thông tin của bạn để thuận tiện cho quá trình khám và điều trị tại Nha Khoa Nụ Cười Xanh.
            </p>
          </div>

          {/* Minh họa 3D Hero Art */}
          <div className="flex justify-end shrink-0">
            <ProfileHeroArt className="w-56 h-32 sm:w-64 sm:h-36" />
          </div>
        </div>
      </div>

      {/* 2. COMPLETION STATUS BANNER: ĐIỀU KIỆN ĐẶT LỊCH KHÁM */}
      <div
        className={`rounded-2xl p-4 sm:p-4.5 border transition-all ${
          isProfileComplete
            ? 'bg-white/95 border-[#CEEDE4] shadow-xs'
            : 'bg-amber-50/90 border-amber-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                isProfileComplete
                  ? 'bg-[#E8F6F2] text-[#169C89]'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {isProfileComplete ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>

            <div>
              <span
                className={`font-bold text-sm block ${
                  isProfileComplete ? 'text-[#1E384C]' : 'text-amber-900'
                }`}
              >
                {isProfileComplete ? 'Hồ sơ hợp lệ' : 'Hồ sơ chưa hoàn thiện'}
              </span>
              <p className="text-xs text-[#6B858D] mt-0.5">
                {isProfileComplete
                  ? 'Thông tin cơ bản đã đầy đủ theo quy định của phòng khám.'
                  : 'Cần cập nhật đủ Họ tên, Ngày sinh và Số điện thoại hợp lệ để có thể đặt lịch khám.'}
              </p>
            </div>
          </div>

          {/* 3 Checklist Items & Status Pill */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs pt-1 sm:pt-0">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium ${
                isHoTenValid
                  ? 'bg-[#E8F6F2] text-[#169C89]'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}
            >
              {isHoTenValid ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
              <span>Họ và tên</span>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium ${
                isNgaySinhValid
                  ? 'bg-[#E8F6F2] text-[#169C89]'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}
            >
              {isNgaySinhValid ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
              <span>Ngày sinh</span>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium ${
                isPhoneValid
                  ? 'bg-[#E8F6F2] text-[#169C89]'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}
            >
              {isPhoneValid ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
              <span>Số điện thoại</span>
            </div>

            {isProfileComplete ? (
              <button
                type="button"
                onClick={() => handleSafeNavigateTab('booking')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F6F2] hover:bg-[#D7F3EB] text-[#169C89] font-bold text-xs border border-[#BCE7DD] transition-colors cursor-pointer"
                title="Bấm để chuyển nhanh sang trang Đặt lịch khám"
              >
                <CalendarCheck className="h-3.5 w-3.5" />
                <span>Đủ thông tin để đặt lịch khám</span>
              </button>
            ) : (
              !isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-2xs inline-flex items-center gap-1"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Hoàn thiện ngay</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* THÔNG BÁO THÀNH CÔNG HOẶC THẤT BẠI CỦA SERVER */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between gap-3 shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {serverError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{serverError}</span>
          </div>
          <button
            type="button"
            onClick={() => setServerError(null)}
            className="text-red-700 hover:text-red-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 3. MAIN CONTENT: 2 CỘT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI (8 CỘT): HỒ SƠ CHÍNH + THÔNG TIN Y TẾ */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-6">
            {/* PROFILE HEADER: Avatar + Tên + Mã BN + Nút Chỉnh sửa */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0F5F3]">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-full bg-gradient-to-tr from-[#169C89] to-[#2BB89B] text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center shadow-xs shrink-0 select-none">
                  {getInitials(profile?.hoTen, session.user?.tenDangNhap)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1E384C]">
                    {profile?.hoTen || session.user?.tenDangNhap || 'Bệnh nhân'}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F6F2] text-[#169C89]">
                      <User className="h-3 w-3" />
                      <span>Bệnh nhân</span>
                    </span>
                    <span className="text-xs text-[#7A9A93]">
                      Mã bệnh nhân:{' '}
                      <strong className="text-[#1E384C]">
                        {profile?.maBenhNhan || 'BN-Chưa cấp'}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Nút hành động đầu trang */}
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs inline-flex items-center justify-center gap-2 shrink-0"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Chỉnh sửa hồ sơ</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shrink-0">
                  <Edit3 className="h-3.5 w-3.5 text-amber-600" />
                  <span>Chế độ chỉnh sửa</span>
                </span>
              )}
            </div>

            {/* FORM HOẶC VIEW THÔNG TIN */}
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* PHẦN 1: THÔNG TIN CÁ NHÂN */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#169C89]" />
                  <h3 className="text-sm font-bold text-[#1E384C]">Thông tin cá nhân</h3>
                </div>

                {!isEditing ? (
                  /* VIEW MODE: Hiển thị dạng lưới 2 cột */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Họ và tên */}
                    <div className="p-3.5 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1">
                      <span className="text-[#7A9A93] flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-[#169C89]" /> Họ và tên
                      </span>
                      <span className="font-bold text-[#1E384C] text-sm block">
                        {profile?.hoTen || 'Chưa cập nhật'}
                      </span>
                    </div>

                    {/* Ngày sinh */}
                    <div className="p-3.5 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1">
                      <span className="text-[#7A9A93] flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#169C89]" /> Ngày sinh
                      </span>
                      <span className="font-bold text-[#1E384C] text-sm block">
                        {formatDateVN(profile?.ngaySinh)}
                      </span>
                    </div>

                    {/* Số điện thoại */}
                    <div className="p-3.5 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1">
                      <span className="text-[#7A9A93] flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-[#169C89]" /> Số điện thoại
                      </span>
                      <span className="font-bold text-[#1E384C] text-sm block">
                        {profile?.soDienThoai || 'Chưa cập nhật'}
                      </span>
                    </div>

                    {/* Giới tính */}
                    <div className="p-3.5 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1">
                      <span className="text-[#7A9A93] flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-[#169C89]" /> Giới tính
                      </span>
                      <span className="font-bold text-[#1E384C] text-sm block">
                        {getGenderLabel(profile?.gioiTinh)}
                      </span>
                    </div>

                    {/* Địa chỉ */}
                    <div className="p-3.5 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1 sm:col-span-2">
                      <span className="text-[#7A9A93] flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#169C89]" /> Địa chỉ
                      </span>
                      <span className="font-bold text-[#1E384C] text-sm block">
                        {profile?.diaChi || 'Chưa cập nhật'}
                      </span>
                    </div>

                    {/* Email */}
                    <div className="p-3.5 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1 sm:col-span-2">
                      <span className="text-[#7A9A93] flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-[#169C89]" /> Email liên hệ
                      </span>
                      <span className="font-bold text-[#1E384C] text-sm block">
                        {profile?.email || 'Chưa cập nhật'}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* EDIT MODE: Các ô nhập liệu có validation */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Họ và tên * */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#1E384C] flex items-center gap-1">
                        <span>Họ và tên</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.hoTen}
                        onChange={(e) => {
                          setFormData({ ...formData, hoTen: e.target.value });
                          if (formErrors.hoTen) setFormErrors({ ...formErrors, hoTen: undefined });
                        }}
                        placeholder="Nhập họ và tên đầy đủ"
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-[#1E384C] focus:outline-none focus:ring-2 transition-all ${
                          formErrors.hoTen
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-[#CEEDE4] focus:ring-[#169C89]/20 focus:border-[#169C89]'
                        }`}
                      />
                      {formErrors.hoTen && (
                        <p className="text-[11px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          <span>{formErrors.hoTen}</span>
                        </p>
                      )}
                    </div>

                    {/* Ngày sinh * */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#1E384C] flex items-center gap-1">
                        <span>Ngày sinh</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        max={todayStr}
                        value={formData.ngaySinh}
                        onChange={(e) => {
                          setFormData({ ...formData, ngaySinh: e.target.value });
                          if (formErrors.ngaySinh) setFormErrors({ ...formErrors, ngaySinh: undefined });
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-[#1E384C] focus:outline-none focus:ring-2 transition-all ${
                          formErrors.ngaySinh
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-[#CEEDE4] focus:ring-[#169C89]/20 focus:border-[#169C89]'
                        }`}
                      />
                      {formErrors.ngaySinh && (
                        <p className="text-[11px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          <span>{formErrors.ngaySinh}</span>
                        </p>
                      )}
                    </div>

                    {/* Số điện thoại * */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#1E384C] flex items-center gap-1">
                        <span>Số điện thoại</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.soDienThoai}
                        onChange={(e) => {
                          setFormData({ ...formData, soDienThoai: e.target.value });
                          if (formErrors.soDienThoai) setFormErrors({ ...formErrors, soDienThoai: undefined });
                        }}
                        placeholder="Ví dụ: 0912345678"
                        maxLength={10}
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-[#1E384C] focus:outline-none focus:ring-2 transition-all ${
                          formErrors.soDienThoai
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-[#CEEDE4] focus:ring-[#169C89]/20 focus:border-[#169C89]'
                        }`}
                      />
                      {formErrors.soDienThoai && (
                        <p className="text-[11px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          <span>{formErrors.soDienThoai}</span>
                        </p>
                      )}
                    </div>

                    {/* Giới tính */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#1E384C]">Giới tính</label>
                      <select
                        value={formData.gioiTinh}
                        onChange={(e) =>
                          setFormData({ ...formData, gioiTinh: e.target.value as GioiTinh | '' })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CEEDE4] bg-white text-[#1E384C] focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                      >
                        <option value="">-- Chọn giới tính --</option>
                        <option value="NAM">Nam</option>
                        <option value="NU">Nữ</option>
                        <option value="KHAC">Khác</option>
                      </select>
                    </div>

                    {/* Địa chỉ */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-bold text-[#1E384C]">Địa chỉ</label>
                      <input
                        type="text"
                        value={formData.diaChi}
                        onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CEEDE4] bg-white text-[#1E384C] focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-bold text-[#1E384C]">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                        }}
                        placeholder="example@domain.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-[#1E384C] focus:outline-none focus:ring-2 transition-all ${
                          formErrors.email
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-[#CEEDE4] focus:ring-[#169C89]/20 focus:border-[#169C89]'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          <span>{formErrors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* PHẦN 2: THÔNG TIN Y TẾ */}
              <div className="space-y-4 pt-4 border-t border-[#F0F5F3]">
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-[#169C89]" />
                  <h3 className="text-sm font-bold text-[#1E384C]">Thông tin y tế</h3>
                </div>

                {!isEditing ? (
                  /* VIEW MODE: 2 mục riêng biệt - Dị ứng thuốc & Tiền sử bệnh */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Mục A: Dị ứng thuốc */}
                    <div className="p-3.5 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1.5">
                      <span className="text-[#7A9A93] text-xs flex items-center gap-1.5">
                        <Pill className="h-3.5 w-3.5 text-[#169C89]" /> Dị ứng thuốc
                      </span>
                      <span className="font-bold text-[#1E384C] text-sm block">
                        {profile?.diUngThuoc?.trim() || 'Chưa cập nhật'}
                      </span>
                      <p className="text-[11px] text-[#7A9A93]">
                        {profile?.diUngThuoc?.trim()
                          ? 'Đã ghi nhận trong hồ sơ khám và đơn thuốc.'
                          : 'Ghi chú tiền sử dị ứng thuốc giúp bác sĩ lựa chọn phác đồ điều trị và thuốc giảm đau an toàn cho bạn.'}
                      </p>
                    </div>

                    {/* Mục B: Tiền sử bệnh */}
                    <div className="p-3.5 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#7A9A93] text-xs flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-[#169C89]" /> Tiền sử bệnh
                        </span>
                        {!hasTienSuBenhFromBackend && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF3F1] text-[#527771] border border-[#D5E4E0]">
                            Hồ sơ nội bộ
                          </span>
                        )}
                      </div>
                      {hasTienSuBenhFromBackend ? (
                        <span className="font-bold text-[#1E384C] text-sm block">
                          {profile?.tienSuBenh?.trim() || 'Chưa cập nhật'}
                        </span>
                      ) : (
                        <span className="font-semibold text-[#6B858D] text-sm block italic">
                          Chưa đồng bộ dữ liệu từ hệ thống
                        </span>
                      )}
                      <p className="text-[11px] text-[#7A9A93]">
                        {hasTienSuBenhFromBackend
                          ? 'Thông tin tiền sử bệnh lý đã đồng bộ từ hồ sơ bệnh nhân.'
                          : 'Thông tin tiền sử bệnh lý toàn thân (tim mạch, huyết áp, tiểu đường...) đang được lưu trữ tại hồ sơ bệnh án phòng khám và chưa mở đồng bộ qua API bệnh nhân.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* EDIT MODE: 2 mục riêng biệt */
                  <div className="space-y-4">
                    {/* Mục A: Dị ứng thuốc */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#1E384C] text-xs flex items-center gap-1.5">
                        <Pill className="h-3.5 w-3.5 text-[#169C89]" />
                        <span>Dị ứng thuốc & phản ứng phụ</span>
                      </label>
                      <textarea
                        rows={2}
                        value={formData.diUngThuoc}
                        onChange={(e) => setFormData({ ...formData, diUngThuoc: e.target.value })}
                        placeholder="Ví dụ: Dị ứng Penicillin, Aspirin... hoặc ghi 'Không có dị ứng' nếu đã xác nhận rõ."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CEEDE4] bg-white text-[#1E384C] text-xs focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                      />
                      <p className="text-[11px] text-[#7A9A93]">
                        Thông tin này được chuyển tiếp trực tiếp cho Bác sĩ điều trị xem xét trước mỗi thủ thuật.
                      </p>
                    </div>

                    {/* Mục B: Tiền sử bệnh */}
                    {hasTienSuBenhFromBackend ? (
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1E384C] text-xs flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-[#169C89]" />
                          <span>Tiền sử bệnh lý</span>
                        </label>
                        <textarea
                          rows={2}
                          value={formData.tienSuBenh || ''}
                          onChange={(e) => setFormData({ ...formData, tienSuBenh: e.target.value })}
                          placeholder="Ví dụ: Tim mạch, tiểu đường, huyết áp..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#CEEDE4] bg-white text-[#1E384C] text-xs focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                        />
                      </div>
                    ) : (
                      /* Khóa chỉnh sửa an toàn khi chưa đồng bộ từ Backend */
                      <div className="p-3.5 rounded-2xl bg-[#F6F9F8] border border-[#DCE8E4] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1E384C] text-xs flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 text-[#169C89]" />
                            <span>Tiền sử bệnh lý toàn thân</span>
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E2EBE8] text-[#527771]">
                            Tạm khóa trực tuyến
                          </span>
                        </div>
                        <div className="text-xs text-[#527771] bg-white/70 rounded-xl p-2.5 border border-[#E3ECE9] flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-semibold text-[#1E384C]">
                              Chưa đồng bộ dữ liệu từ hệ thống
                            </p>
                            <p className="text-[11px] text-[#6B858D] leading-relaxed">
                              Trường này tạm thời khóa chỉnh sửa trực tuyến để đảm bảo an toàn y khoa. Vui lòng thông báo trực tiếp với Bác sĩ hoặc Lễ tân tại phòng khám để được cập nhật chính xác vào hồ sơ bệnh án.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* NÚT THAO TÁC Ở CHẾ ĐỘ CHỈNH SỬA (LƯU / HỦY) */}
              {isEditing && (
                <div className="pt-4 border-t border-[#F0F5F3] flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E3ECE9] bg-white hover:bg-[#F8FBFA] text-xs font-bold text-[#344C52] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <X className="h-4 w-4" />
                    <span>Hủy</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Lưu thay đổi</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* CỘT PHẢI (4 CỘT): THÔNG TIN TÀI KHOẢN + LƯU Ý BẢO MẬT */}
        <div className="lg:col-span-4 space-y-6">
          {/* CARD 1: THÔNG TIN TÀI KHOẢN (READ-ONLY) */}
          <div className="p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F0F5F3]">
              <Layers className="h-4 w-4 text-[#169C89]" />
              <h3 className="text-sm font-bold text-[#1E384C]">Thông tin tài khoản</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-[#7A9A93]">Tên đăng nhập</span>
                <div className="p-2.5 rounded-xl bg-[#F8FBFA] border border-[#E3ECE9] font-bold text-[#1E384C] flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-[#169C89]" />
                  <span>{session.user?.tenDangNhap || 'benhnhan'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[#7A9A93]">Vai trò</span>
                <div className="p-2.5 rounded-xl bg-[#F8FBFA] border border-[#E3ECE9] font-bold text-[#169C89] flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#169C89]" />
                  <span>Bệnh nhân</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#7A9A93] leading-relaxed pt-1 border-t border-[#F0F5F3]">
              Tên đăng nhập và vai trò được phân quyền cố định từ hệ thống xác thực.
            </p>
          </div>

          {/* CARD 2: LƯU Ý BẢO MẬT & MASCOT */}
          <div className="p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F0F5F3]">
              <ShieldCheck className="h-4 w-4 text-[#169C89]" />
              <h3 className="text-sm font-bold text-[#1E384C]">Lưu ý bảo mật</h3>
            </div>

            <div className="space-y-3 text-xs text-[#5A777E]">
              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-[#E8F6F2] text-[#169C89] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3 w-3" />
                </div>
                <p className="leading-relaxed">
                  Thông tin cá nhân của bạn được bảo mật và chỉ sử dụng cho mục đích khám, điều trị tại phòng khám.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-[#E8F6F2] text-[#169C89] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3 w-3" />
                </div>
                <p className="leading-relaxed">
                  Vui lòng cung cấp thông tin chính xác và cập nhật khi có thay đổi để bác sĩ liên hệ kịp thời.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-[#E8F6F2] text-[#169C89] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3 w-3" />
                </div>
                <p className="leading-relaxed">
                  Nếu cần hỗ trợ cập nhật thông tin đặc biệt, hãy liên hệ trực tiếp với quầy lễ tân tại phòng khám.
                </p>
              </div>
            </div>

            {/* Mascot với Khiên y tế */}
            <div className="pt-2 flex justify-end">
              <ToothMascotWithShield className="w-24 h-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
