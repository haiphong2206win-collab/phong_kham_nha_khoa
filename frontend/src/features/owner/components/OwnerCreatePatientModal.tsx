import React, { useState } from 'react';
import { X, UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { TaoTaiKhoanBenhNhanRequest, GioiTinh } from '@/types/owner';
import { ownerService } from '@/services/owner.service';

interface OwnerCreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const OwnerCreatePatientModal: React.FC<OwnerCreatePatientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [gender, setGender] = useState<GioiTinh>('NAM');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation
    const trimmedUsername = username.trim();
    if (!trimmedUsername || trimmedUsername.length < 4 || trimmedUsername.length > 50) {
      setErrorMessage('Tên đăng nhập phải có từ 4 đến 50 ký tự.');
      return;
    }

    if (!password || password.length < 8) {
      setErrorMessage('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }

    const trimmedFullName = fullName.trim();
    if (!trimmedFullName) {
      setErrorMessage('Họ tên bệnh nhân không được để trống.');
      return;
    }

    if (!birthDate) {
      setErrorMessage('Ngày sinh không được để trống.');
      return;
    }

    if (birthDate > todayStr) {
      setErrorMessage('Ngày sinh không được ở tương lai.');
      return;
    }

    const trimmedPhone = phone.trim();
    if (!trimmedPhone || !/^0\d{9}$/.test(trimmedPhone)) {
      setErrorMessage('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0 (ví dụ: 0912345678).');
      return;
    }

    const trimmedEmail = email.trim();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Địa chỉ email không đúng định dạng.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const payload: TaoTaiKhoanBenhNhanRequest = {
        tenDangNhap: trimmedUsername,
        matKhau: password,
        hoTen: trimmedFullName,
        ngaySinh: birthDate,
        gioiTinh: gender,
        soDienThoai: trimmedPhone,
        email: trimmedEmail || null,
        diaChi: address.trim() || null,
      };

      const result = await ownerService.createPatientAccount(payload);
      onSuccess(`Tạo tài khoản và hồ sơ bệnh nhân "${trimmedFullName}" thành công (Mã TK: ${result.maTaiKhoan})!`);
      onClose();
    } catch (err: unknown) {
      let msg = 'Không thể tạo tài khoản bệnh nhân.';
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
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5 text-gray-900">
            <div className="p-2 rounded-xl bg-teal-50 text-[#169C89]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Thêm Bệnh nhân mới</h2>
              <p className="text-xs text-gray-500">Tạo tài khoản người dùng và hồ sơ bệnh nhân đồng bộ</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                placeholder="Ví dụ: bn_lananh"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89]"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Từ 4 đến 50 ký tự</span>
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mật khẩu ban đầu <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ít nhất 8 ký tự"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">Tối thiểu 8 ký tự</span>
            </div>
          </div>

          {/* Họ tên */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Họ và tên bệnh nhân <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Thị Lan Anh"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ngày sinh */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Ngày sinh <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                max={todayStr}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89]"
              />
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Giới tính <span className="text-rose-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as GioiTinh)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89]"
              >
                <option value="NAM">Nam</option>
                <option value="NU">Nữ</option>
                <option value="KHAC">Khác</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Số điện thoại */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Số điện thoại <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912345678"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89]"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">10 số, bắt đầu bằng 0</span>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email (không bắt buộc)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lananh@gmail.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89]"
              />
            </div>
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Địa chỉ liên hệ (không bắt buộc)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, đường, phường/xã, quận/huyện..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89]"
            />
          </div>

          {/* Buttons */}
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
              disabled={loading}
              className="bg-[#169C89] hover:bg-[#138575] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs"
            >
              {loading ? 'Đang tạo...' : 'Tạo Bệnh nhân'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
