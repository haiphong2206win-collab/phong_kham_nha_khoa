import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { TaiKhoanQuanLyResponse } from '@/types/owner';
import { ownerService } from '@/services/owner.service';

interface OwnerAccountLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: TaiKhoanQuanLyResponse | null;
  onSuccess: (message: string) => void;
}

export const OwnerAccountLockModal: React.FC<OwnerAccountLockModalProps> = ({
  isOpen,
  onClose,
  account,
  onSuccess,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !account) return null;

  const isCurrentlyActive = account.trangThai === 'DANG_HOAT_DONG';
  const targetDangHoatDong = !isCurrentlyActive;
  const isOwner = account.vaiTro === 'CHU_PHONG_KHAM';

  const handleConfirm = async () => {
    if (isOwner) {
      setErrorMessage('Không thể khóa hoặc thao tác trạng thái tài khoản Chủ phòng khám.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await ownerService.updateAccountStatus(account.maTaiKhoan, targetDangHoatDong);
      const actionText = targetDangHoatDong ? 'Mở khóa' : 'Khóa';
      onSuccess(`${actionText} tài khoản "${account.tenDangNhap}" thành công!`);
      onClose();
    } catch (err: unknown) {
      let msg = 'Không thể cập nhật trạng thái tài khoản.';
      if (err && typeof err === 'object') {
        const errorObj = err as {
          response?: { data?: { message?: string } | string };
          message?: string;
        };
        if (typeof errorObj.response?.data === 'string') {
          msg = errorObj.response.data;
        } else if (errorObj.response?.data?.message) {
          msg = errorObj.response.data.message;
        } else if (errorObj.message) {
          msg = errorObj.message;
        }
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F8FAFC]">
          <h2 className="text-base font-bold text-gray-900">
            {isCurrentlyActive ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản'}
          </h2>
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
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <div
            className={`p-4 rounded-2xl border text-center space-y-2 ${
              isCurrentlyActive
                ? 'bg-amber-50/70 border-amber-200/80'
                : 'bg-emerald-50/70 border-emerald-200/80'
            }`}
          >
            <div className="flex justify-center">
              {isCurrentlyActive ? (
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              )}
            </div>

            <p className="text-sm font-bold text-gray-900 leading-snug">
              Bạn có chắc chắn muốn {isCurrentlyActive ? 'khóa' : 'mở khóa'} tài khoản{' '}
              <span className="font-mono text-[#169C89]">{account.maTaiKhoan}</span> (
              <span className="font-semibold">{account.tenDangNhap}</span>)?
            </p>

            <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
              {isCurrentlyActive
                ? 'Tài khoản sẽ không thể đăng nhập vào hệ thống cho đến khi được mở khóa lại.'
                : 'Tài khoản sẽ được kích hoạt lại và có thể đăng nhập bình thường vào hệ thống.'}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-semibold transition-colors"
          >
            Hủy
          </button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading || isOwner}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-xs ${
              isCurrentlyActive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#169C89] hover:bg-[#138575]'
            }`}
          >
            {loading
              ? 'Đang xử lý...'
              : isCurrentlyActive
              ? 'Khóa tài khoản'
              : 'Mở khóa tài khoản'}
          </Button>
        </div>
      </div>
    </div>
  );
};
