import React from 'react';
import { X, Phone, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { BacSiQuanLyResponse } from '@/types/owner';

interface OwnerDoctorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: BacSiQuanLyResponse | null;
}

export const OwnerDoctorDetailModal: React.FC<OwnerDoctorDetailModalProps> = ({
  isOpen,
  onClose,
  doctor,
}) => {
  if (!isOpen || !doctor) return null;

  const isOwner = doctor.maBacSi.includes('CHU');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-dental-border shadow-2xl p-6 sm:p-7 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-[#E8F8F5] border border-[#BDE8E0] flex items-center justify-center text-[#169C89] font-bold text-lg">
              {doctor.hoTen ? doctor.hoTen.charAt(0).toUpperCase() : 'B'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">{doctor.hoTen}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isOwner
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-[#E8F8F5] text-[#169C89] border-[#BDE8E0]'
                  }`}
                >
                  {isOwner ? 'CHU_PHONG_KHAM' : 'BAC_SI'}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-mono mt-0.5">Mã hồ sơ: {doctor.maBacSi}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Thông tin chi tiết */}
        <div className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200">
              <span className="text-gray-500 flex items-center gap-1.5 mb-1">
                <Award className="h-3.5 w-3.5 text-dental-accent" />
                Số chứng chỉ hành nghề:
              </span>
              <p className="font-semibold text-gray-800 text-sm">
                {doctor.soChungChi || 'Chưa cập nhật'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200">
              <span className="text-gray-500 flex items-center gap-1.5 mb-1">
                <Phone className="h-3.5 w-3.5 text-dental-accent" />
                Số điện thoại:
              </span>
              <p className="font-semibold text-gray-800 text-sm">
                {doctor.soDienThoai || 'Chưa cập nhật'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <span className="text-gray-500 font-semibold block mb-1">Trạng thái làm việc & Tài khoản:</span>
            <div className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="text-gray-600">Trạng thái nhân sự:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                  doctor.dangLamViec
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {doctor.dangLamViec ? 'Đang làm việc' : 'Tạm nghỉ'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="text-gray-600">Tên đăng nhập hệ thống:</span>
              <span className="font-mono font-semibold text-gray-800">
                {doctor.tenDangNhap || 'Không có'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Trạng thái tài khoản:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                  doctor.trangThaiTaiKhoan === 'DANG_HOAT_DONG'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {doctor.trangThaiTaiKhoan === 'DANG_HOAT_DONG' ? 'Đang hoạt động' : doctor.trangThaiTaiKhoan || 'Chưa kích hoạt'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <Button
            type="button"
            size="sm"
            onClick={onClose}
            className="bg-[#169C89] hover:bg-[#138575] text-white"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};
