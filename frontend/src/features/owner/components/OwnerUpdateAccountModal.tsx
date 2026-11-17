import React, { useState } from 'react';
import { X, Lock, Unlock, KeyRound, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { BacSiQuanLyResponse, CapNhatTaiKhoanRequest } from '@/types/owner';
import { ownerService } from '@/services/owner.service';

interface OwnerUpdateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: BacSiQuanLyResponse | null;
  mode: 'toggle-status' | 'reset-password';
  onSuccess: (message: string) => void;
}

export const OwnerUpdateAccountModal: React.FC<OwnerUpdateAccountModalProps> = ({
  isOpen,
  onClose,
  doctor,
  mode,
  onSuccess,
}) => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [newUsername, setNewUsername] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !doctor || !doctor.maTaiKhoan) return null;

  const isOwnerAccount = doctor.maBacSi.includes('CHU') || doctor.tenDangNhap === 'chu_demo';
  const isCurrentlyActive = doctor.trangThaiTaiKhoan === 'DANG_HOAT_DONG';

  const handleToggleStatus = async () => {
    if (isOwnerAccount) {
      setErrorMessage('Không thể khóa tài khoản Chủ phòng khám.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const nextStatus = !isCurrentlyActive;
      await ownerService.updateAccountStatus(doctor.maTaiKhoan!, nextStatus);
      onSuccess(
        `Đã ${nextStatus ? 'mở khóa' : 'khóa'} thành công tài khoản ${doctor.tenDangNhap}!`
      );
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi cập nhật trạng thái tài khoản.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setErrorMessage('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const payload: CapNhatTaiKhoanRequest = {
        matKhauMoi: newPassword,
        tenDangNhap: newUsername.trim() || undefined,
      };

      await ownerService.updateAccount(doctor.maTaiKhoan!, payload);
      onSuccess(`Đã cập nhật thông tin đăng nhập cho tài khoản ${doctor.tenDangNhap}!`);
      setNewPassword('');
      setNewUsername('');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi cập nhật tài khoản.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl bg-white border border-dental-border shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-2xl flex items-center justify-center ${
                mode === 'toggle-status'
                  ? isCurrentlyActive
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-[#E8F8F5] text-[#169C89] border border-[#BDE8E0]'
              }`}
            >
              {mode === 'toggle-status' ? (
                isCurrentlyActive ? (
                  <Lock className="h-5 w-5" />
                ) : (
                  <Unlock className="h-5 w-5" />
                )
              ) : (
                <KeyRound className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {mode === 'toggle-status'
                  ? isCurrentlyActive
                    ? 'Khóa tài khoản Bác sĩ'
                    : 'Mở khóa tài khoản Bác sĩ'
                  : 'Cấp lại thông tin đăng nhập'}
              </h3>
              <p className="text-xs text-gray-500 font-mono">Tài khoản: {doctor.tenDangNhap}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Mode 1: Toggle status */}
        {mode === 'toggle-status' ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 leading-relaxed">
              Bạn có chắc chắn muốn {isCurrentlyActive ? 'khóa' : 'mở khóa'} tài khoản{' '}
              <span className="font-bold text-gray-900">{doctor.tenDangNhap}</span> ({doctor.hoTen})?
              {isCurrentlyActive && (
                <p className="mt-1 text-amber-700">
                  Khi bị khóa, bác sĩ sẽ không thể đăng nhập vào Doctor Portal.
                </p>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleToggleStatus}
                disabled={loading}
                className={
                  isCurrentlyActive
                    ? 'bg-amber-600 hover:bg-amber-700 text-white font-medium'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium'
                }
              >
                {loading
                  ? 'Đang xử lý...'
                  : isCurrentlyActive
                  ? 'Xác nhận Khóa'
                  : 'Xác nhận Mở khóa'}
              </Button>
            </div>
          </div>
        ) : (
          /* Content Mode 2: Reset password / username */
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tên đăng nhập mới (để trống nếu giữ nguyên)
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder={doctor.tenDangNhap || ''}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 8 ký tự"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]"
                required
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="bg-[#169C89] hover:bg-[#138575] text-white font-medium"
              >
                {loading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
