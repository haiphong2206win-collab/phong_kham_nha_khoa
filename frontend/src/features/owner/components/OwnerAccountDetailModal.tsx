import React from 'react';
import {
  X,
  User,
  ShieldCheck,
  ShieldAlert,
  Hash,
  AtSign,
} from 'lucide-react';
import type { TaiKhoanQuanLyResponse } from '@/types/owner';

interface OwnerAccountDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: TaiKhoanQuanLyResponse | null;
}

export const OwnerAccountDetailModal: React.FC<OwnerAccountDetailModalProps> = ({
  isOpen,
  onClose,
  account,
}) => {
  if (!isOpen || !account) return null;

  const isOwner = account.vaiTro === 'CHU_PHONG_KHAM';
  const isActive = account.trangThai === 'DANG_HOAT_DONG';

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'CHU_PHONG_KHAM':
        return {
          label: 'Chủ phòng khám',
          color: 'bg-amber-50 text-amber-800 border-amber-200/80',
          icon: ShieldAlert,
        };
      case 'BAC_SI':
        return {
          label: 'Bác sĩ điều trị',
          color: 'bg-teal-50 text-[#169C89] border-teal-200/80',
          icon: ShieldCheck,
        };
      case 'BENH_NHAN':
        return {
          label: 'Bệnh nhân',
          color: 'bg-blue-50 text-blue-700 border-blue-200/80',
          icon: User,
        };
      default:
        return {
          label: role,
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: User,
        };
    }
  };

  const roleInfo = getRoleBadge(account.vaiTro);
  const RoleIcon = roleInfo.icon;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Chưa cập nhật';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-[#169C89]">
              <RoleIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Chi tiết Tài khoản</h2>
              <p className="text-xs text-gray-500">Mã định danh: {account.maTaiKhoan}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Protected Owner Banner */}
          {isOwner && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-amber-900">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <strong className="font-semibold">Tài khoản quản trị cấp cao:</strong> Tài khoản này giữ vai trò Chủ phòng khám và được bảo vệ an toàn. Hệ thống không cho phép sửa đổi, khóa hoặc xóa từ giao diện quản trị.
              </div>
            </div>
          )}

          {/* Account Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-xs text-gray-500 font-medium block flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-gray-400" /> Mã tài khoản
              </span>
              <span className="text-sm font-bold text-gray-900 font-mono mt-0.5 block">
                {account.maTaiKhoan}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-xs text-gray-500 font-medium block flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-[#169C89]" /> Tên đăng nhập
              </span>
              <span className="text-sm font-bold text-[#169C89] mt-0.5 block">
                @{account.tenDangNhap}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-xs text-gray-500 font-medium block">Vai trò</span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold border mt-1 ${roleInfo.color}`}
              >
                {roleInfo.label}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-xs text-gray-500 font-medium block">Trạng thái</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                {isActive ? 'Đang hoạt động' : 'Bị khóa'}
              </span>
            </div>
          </div>

          {/* Linked Profile Section */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-200/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Hồ sơ người dùng liên kết
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Mã hồ sơ:</span>
                <span className="font-semibold text-gray-900 font-mono">
                  {account.maHoSo || 'Chưa liên kết'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Họ và tên:</span>
                <span className="font-semibold text-gray-900">
                  {account.hoTen || 'Chưa cập nhật'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Số điện thoại:</span>
                <span className="font-medium text-gray-700">
                  {account.soDienThoai || 'Chưa cập nhật'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Ngày khởi tạo:</span>
                <span className="font-medium text-gray-600 text-xs">
                  {formatDate(account.ngayTao)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
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
