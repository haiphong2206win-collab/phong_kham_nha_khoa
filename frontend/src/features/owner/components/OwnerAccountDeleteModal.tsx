import React, { useState } from 'react';
import { X, Trash2, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { TaiKhoanQuanLyResponse } from '@/types/owner';
import { ownerService } from '@/services/owner.service';

interface OwnerAccountDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: TaiKhoanQuanLyResponse | null;
  onSuccess: (message: string) => void;
}

export const OwnerAccountDeleteModal: React.FC<OwnerAccountDeleteModalProps> = ({
  isOpen,
  onClose,
  account,
  onSuccess,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !account) return null;

  const isOwner = account.vaiTro === 'CHU_PHONG_KHAM';

  const handleDelete = async () => {
    if (isOwner) {
      setErrorMessage('Không thể xóa tài khoản quản trị Chủ phòng khám.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await ownerService.softDeleteAccount(account.maTaiKhoan);
      onSuccess(`Đã xóa mềm và chuyển tài khoản "${account.tenDangNhap}" sang trạng thái bị khóa!`);
      onClose();
    } catch (err: unknown) {
      let msg = 'Không thể xóa tài khoản.';
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
          <div className="flex items-center gap-2 text-rose-600">
            <Trash2 className="w-5 h-5" />
            <h2 className="text-base font-bold text-gray-900">Xóa tài khoản người dùng</h2>
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
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertOctagon className="w-7 h-7" />
              </div>
            </div>

            <p className="text-sm font-bold text-gray-900 leading-snug">
              Bạn có chắc chắn muốn xóa tài khoản{' '}
              <span className="font-mono text-rose-700">{account.maTaiKhoan}</span> (
              <span className="font-semibold">{account.tenDangNhap}</span>)?
            </p>

            <p className="text-xs text-rose-700/80 leading-relaxed max-w-sm mx-auto">
              Thao tác này thực hiện xóa mềm (chuyển trạng thái sang BỊ KHÓA). Hồ sơ bệnh nhân hoặc bác sĩ liên kết vẫn được bảo toàn nguyên vẹn trong hệ thống.
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
            onClick={handleDelete}
            disabled={loading || isOwner}
            className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs"
          >
            {loading ? 'Đang xóa...' : 'Xóa tài khoản'}
          </Button>
        </div>
      </div>
    </div>
  );
};
