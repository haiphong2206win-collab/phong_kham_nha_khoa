import React, { useState } from 'react';
import {
  X,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  HeartPulse,
  AlertCircle,
  FileText,
  Lock,
} from 'lucide-react';
import type { BenhNhanQuanLyResponse } from '@/types/owner';

interface OwnerPatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: BenhNhanQuanLyResponse | null;
}

export const OwnerPatientDetailModal: React.FC<OwnerPatientDetailModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'medical' | 'account'>('personal');

  if (!isOpen || !patient) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Chưa cập nhật';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getGenderLabel = (g?: string | null) => {
    if (!g) return 'Chưa cập nhật';
    switch (g.toUpperCase()) {
      case 'NAM':
        return 'Nam';
      case 'NU':
        return 'Nữ';
      case 'KHAC':
        return 'Khác';
      default:
        return g;
    }
  };

  const isAccountActive = patient.trangThaiTaiKhoan === 'DANG_HOAT_DONG';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient & avatar */}
        <div className="relative bg-gradient-to-r from-[#169C89] to-[#0D6E60] p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
              {patient.hoTen.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">{patient.hoTen}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
                  Mã BN: {patient.maBenhNhan}
                </span>
                {patient.trangThaiTaiKhoan ? (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                      isAccountActive
                        ? 'bg-emerald-400/20 text-emerald-100 border border-emerald-300/30'
                        : 'bg-rose-400/20 text-rose-100 border border-rose-300/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isAccountActive ? 'bg-emerald-300 animate-pulse' : 'bg-rose-300'
                      }`}
                    />
                    {isAccountActive ? 'Đang hoạt động' : 'Bị khóa'}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-400/20 text-gray-200">
                    Chưa tạo tài khoản
                  </span>
                )}
              </div>
              <p className="text-xs text-white/80 mt-1 flex items-center gap-3">
                <span>Điện thoại: {patient.soDienThoai || 'Chưa cập nhật'}</span>
                {patient.tenDangNhap && (
                  <span>• Tên đăng nhập: @{patient.tenDangNhap}</span>
                )}
              </p>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-2 mt-6 border-t border-white/15 pt-3">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'personal'
                  ? 'bg-white text-[#0D6E60] shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab('medical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'medical'
                  ? 'bg-white text-[#0D6E60] shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Thông tin y tế – Chỉ xem
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'account'
                  ? 'bg-white text-[#0D6E60] shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Tài khoản liên kết
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Tab 1: Thông tin cá nhân */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-[#169C89] mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Họ và tên</span>
                  <span className="text-sm font-semibold text-gray-900">{patient.hoTen}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-[#169C89] mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Ngày sinh</span>
                  <span className="text-sm font-semibold text-gray-900">{formatDate(patient.ngaySinh)}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-[#169C89] mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Giới tính</span>
                  <span className="text-sm font-semibold text-gray-900">{getGenderLabel(patient.gioiTinh)}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-[#169C89] mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Số điện thoại</span>
                  <span className="text-sm font-semibold text-gray-900">{patient.soDienThoai || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-[#169C89] mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Email</span>
                  <span className="text-sm font-semibold text-gray-900">{patient.email || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-[#169C89] mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Địa chỉ</span>
                  <span className="text-sm font-semibold text-gray-900">{patient.diaChi || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Thông tin y tế (Chỉ xem) */}
          {activeTab === 'medical' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/70 flex items-start gap-3 text-amber-900">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong className="font-semibold">Lưu ý nghiệp vụ:</strong> Thông tin y tế (tiền sử bệnh, dị ứng thuốc) do Bác sĩ điều trị ghi nhận và quản lý trong quá trình thăm khám. Chủ phòng khám chỉ xem, không trực tiếp sửa đổi trên cổng quản trị.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <HeartPulse className="w-4 h-4 text-[#169C89]" />
                  Tiền sử bệnh lý
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 min-h-[60px] whitespace-pre-wrap">
                  {patient.tienSuBenh || 'Chưa ghi nhận tiền sử bệnh lý.'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <FileText className="w-4 h-4 text-[#169C89]" />
                  Dị ứng thuốc & thức ăn
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 min-h-[60px] whitespace-pre-wrap">
                  {patient.diUngThuoc || 'Chưa ghi nhận dị ứng thuốc hoặc thức ăn.'}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Tài khoản liên kết */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              {patient.maTaiKhoan ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100">
                    <span className="text-xs text-gray-500 font-medium block">Mã tài khoản</span>
                    <span className="text-sm font-bold text-gray-900">{patient.maTaiKhoan}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100">
                    <span className="text-xs text-gray-500 font-medium block">Tên đăng nhập</span>
                    <span className="text-sm font-bold text-[#169C89]">@{patient.tenDangNhap}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100">
                    <span className="text-xs text-gray-500 font-medium block">Vai trò người dùng</span>
                    <span className="text-sm font-semibold text-gray-900">Bệnh nhân (BENH_NHAN)</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100">
                    <span className="text-xs text-gray-500 font-medium block">Trạng thái</span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${
                        isAccountActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isAccountActive ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      {isAccountActive ? 'Đang hoạt động' : 'Bị khóa'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 md:col-span-2">
                    <span className="text-xs text-gray-500 font-medium block">Ngày tạo tài khoản</span>
                    <span className="text-sm font-medium text-gray-900">
                      {patient.ngayTaoTaiKhoan ? formatDate(patient.ngayTaoTaiKhoan) : 'Chưa có thông tin'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 space-y-2">
                  <Lock className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-sm font-semibold text-gray-700">Chưa liên kết tài khoản</p>
                  <p className="text-xs text-gray-500">
                    Hồ sơ bệnh nhân này chưa được liên kết với tài khoản người dùng nào.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
