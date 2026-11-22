import React, { useState, useEffect } from 'react';
import { X, KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { TaiKhoanQuanLyResponse, CapNhatTaiKhoanRequest } from '@/types/owner';
import { ownerService } from '@/services/owner.service';

interface OwnerAccountEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: TaiKhoanQuanLyResponse | null;
  onSuccess: (message: string) => void;
}

export const OwnerAccountEditModal: React.FC<OwnerAccountEditModalProps> = ({
  isOpen,
  onClose,
  account,
  onSuccess,
}) => {
  const [username, setUsername] = useState<string>('');
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      setUsername(account.tenDangNhap);
      setChangePassword(false);
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage(null);
    }
  }, [account, isOpen]);

  if (!isOpen || !account) return null;

  const isOwner = account.vaiTro === 'CHU_PHONG_KHAM';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isOwner) {
      setErrorMessage('Không thể chỉnh sửa tài khoản quản trị Chủ phòng khám.');
      return;
    }

    const trimmedUsername = username.trim();
    if (!trimmedUsername || trimmedUsername.length < 4 || trimmedUsername.length > 50) {
      setErrorMessage('Tên đăng nhập phải có từ 4 đến 50 ký tự.');
      return;
    }

    const payload: CapNhatTaiKhoanRequest = {};
    const isUsernameChanged = trimmedUsername !== account.tenDangNhap;
    if (isUsernameChanged) {
      payload.tenDangNhap = trimmedUsername;
    }

    if (changePassword) {
      if (!newPassword || newPassword.length < 8) {
        setErrorMessage('Mật khẩu mới phải có ít nhất 8 ký tự.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage('Xác nhận mật khẩu không khớp.');
        return;
      }
      payload.matKhauMoi = newPassword;
    }

    if (!isUsernameChanged && !changePassword) {
      setErrorMessage('Vui lòng thay đổi tên đăng nhập hoặc chọn đổi mật khẩu mới.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await ownerService.updateAccount(account.maTaiKhoan, payload);
      onSuccess(`Cập nhật tài khoản "${trimmedUsername}" thành công!`);
      onClose();
    } catch (err: unknown) {
      let msg = 'Không thể cập nhật tài khoản.';
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
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-[#169C89]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Cập nhật tài khoản</h2>
              <p className="text-xs text-gray-500">Mã TK: {account.maTaiKhoan}</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Tên đăng nhập */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tên đăng nhập <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89]"
            />
            <span className="text-[11px] text-gray-400 mt-1 block">Từ 4 đến 50 ký tự</span>
          </div>

          {/* Checkbox Đổi mật khẩu mới */}
          <div className="pt-2">
            <label className="inline-flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={changePassword}
                onChange={(e) => setChangePassword(e.target.checked)}
                className="w-4 h-4 rounded-sm border-gray-300 text-[#169C89] focus:ring-[#169C89]"
              />
              <span className="text-sm font-semibold text-gray-800">Đổi mật khẩu mới</span>
            </label>
          </div>

          {/* Mật khẩu mới & Xác nhận */}
          {changePassword && (
            <div className="space-y-3.5 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mật khẩu mới <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={changePassword}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ít nhất 8 ký tự"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Xác nhận mật khẩu <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required={changePassword}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors"
            >
              Hủy
            </button>
            <Button
              type="submit"
              disabled={loading || isOwner}
              className="bg-[#169C89] hover:bg-[#138575] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
