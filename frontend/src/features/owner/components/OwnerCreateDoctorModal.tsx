import React, { useState } from 'react';
import { X, UserPlus, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { TaoTaiKhoanBacSiRequest } from '@/types/owner';
import { ownerService } from '@/services/owner.service';

interface OwnerCreateDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const OwnerCreateDoctorModal: React.FC<OwnerCreateDoctorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [licenseNumber, setLicenseNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || username.trim().length < 4 || username.trim().length > 50) {
      setErrorMessage('Tên đăng nhập phải có từ 4 đến 50 ký tự.');
      return;
    }
    if (!password || password.length < 8) {
      setErrorMessage('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMessage('Họ tên bác sĩ không được để trống.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const payload: TaoTaiKhoanBacSiRequest = {
        tenDangNhap: username.trim(),
        matKhau: password,
        hoTen: fullName.trim(),
        soDienThoai: phone.trim() || undefined,
        soChungChi: licenseNumber.trim() || undefined,
      };

      const result = await ownerService.createDoctorAccount(payload);
      onSuccess(`Đã tạo thành công tài khoản Bác sĩ ${result.tenDangNhap}!`);
      // Reset form
      setUsername('');
      setPassword('');
      setFullName('');
      setPhone('');
      setLicenseNumber('');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi tạo tài khoản bác sĩ.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-dental-border shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#E8F8F5] border border-[#BDE8E0] flex items-center justify-center text-[#169C89]">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thêm Bác sĩ mới</h3>
              <p className="text-xs text-gray-500">
                Tạo tài khoản đăng nhập và hồ sơ hành nghề Bác sĩ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Tên đăng nhập */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="bacsi_moi"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89] font-mono"
                  required
                />
              </div>
              <span className="text-[10px] text-gray-400">Từ 4 đến 50 ký tự</span>
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Mật khẩu khởi tạo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]"
                  required
                />
              </div>
              <span className="text-[10px] text-gray-400">Tối thiểu 8 ký tự</span>
            </div>
          </div>

          {/* Họ tên */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Họ và tên Bác sĩ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="BS. Nguyễn Văn A"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Số điện thoại */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901234567"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]"
              />
            </div>

            {/* Số chứng chỉ hành nghề */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Số chứng chỉ hành nghề
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="CCHN-12345"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89] font-mono"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-[#169C89] hover:bg-[#138575] text-white font-medium"
            >
              {loading ? 'Đang tạo...' : 'Tạo Bác sĩ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
