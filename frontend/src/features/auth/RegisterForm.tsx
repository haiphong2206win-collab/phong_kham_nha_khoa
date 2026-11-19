import React, { useState } from 'react';
import { User, Lock, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import { PasswordField } from '@/components/ui/PasswordField';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { authService } from '@/services/auth.service';
import { AuthResponse } from '@/types/auth';

interface RegisterFormProps {
  onSuccess: (authData: AuthResponse) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    tenDangNhap?: string;
    matKhau?: string;
    xacNhanMatKhau?: string;
  }>({});

  const validate = (): boolean => {
    const errors: {
      tenDangNhap?: string;
      matKhau?: string;
      xacNhanMatKhau?: string;
    } = {};

    const trimmedUsername = tenDangNhap.trim();

    if (!trimmedUsername) {
      errors.tenDangNhap = 'Vui lòng nhập tên đăng nhập';
    } else if (trimmedUsername.length < 3) {
      errors.tenDangNhap = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(trimmedUsername)) {
      errors.tenDangNhap = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
    }

    if (!matKhau) {
      errors.matKhau = 'Vui lòng nhập mật khẩu';
    } else if (matKhau.length < 6) {
      errors.matKhau = 'Mật khẩu phải có ít nhất 6 ký tự để đảm bảo an toàn';
    }

    if (!xacNhanMatKhau) {
      errors.xacNhanMatKhau = 'Vui lòng nhập lại mật khẩu';
    } else if (matKhau !== xacNhanMatKhau) {
      errors.xacNhanMatKhau = 'Mật khẩu xác nhận không khớp';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = await authService.register({
        tenDangNhap: tenDangNhap.trim(),
        matKhau,
      });

      setSuccessInfo(`Đăng ký tài khoản "${result.tenDangNhap}" thành công! Đang chuyển về đăng nhập...`);
      
      // Auto switch or notify after short delay for user to read success
      setTimeout(() => {
        onSuccess(result);
      }, 1500);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-dental-text tracking-tight">
          Đăng ký tài khoản Bệnh nhân
        </h2>
        <p className="text-xs text-dental-muted mt-1">
          Tạo tài khoản để theo dõi phác đồ điều trị, kết quả lâm sàng và quản lý lịch hẹn.
        </p>
      </div>

      {/* Role notice as required by Backend architecture */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-dental-bg border border-dental-border text-[11px] text-dental-muted">
        <ShieldAlert className="h-4 w-4 text-dental-accent shrink-0 mt-0.5" />
        <span>
          Cổng đăng ký trực tuyến công khai dành riêng cho <strong>Bệnh nhân</strong>. Bác sĩ và Nhân viên y tế được cấp tài khoản nội bộ bởi Chủ phòng khám.
        </span>
      </div>

      <FormError message={errorMessage} />

      {successInfo && (
        <div className="flex items-start gap-2.5 rounded-xl border border-dental-success/30 bg-dental-success-bg px-3.5 py-2.5 text-sm text-dental-success transition-all duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="leading-snug">{successInfo}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField
          label="Tên đăng nhập"
          id="register-username"
          placeholder="Ví dụ: nguyen_van_a"
          value={tenDangNhap}
          onChange={(e) => {
            setTenDangNhap(e.target.value);
            if (fieldErrors.tenDangNhap) setFieldErrors((prev) => ({ ...prev, tenDangNhap: undefined }));
          }}
          leftIcon={<User className="h-4 w-4" />}
          error={fieldErrors.tenDangNhap}
          disabled={isLoading}
          required
          autoComplete="username"
        />

        <PasswordField
          label="Mật khẩu"
          id="register-password"
          placeholder="Tối thiểu 6 ký tự..."
          value={matKhau}
          onChange={(e) => {
            setMatKhau(e.target.value);
            if (fieldErrors.matKhau) setFieldErrors((prev) => ({ ...prev, matKhau: undefined }));
          }}
          leftIcon={<Lock className="h-4 w-4" />}
          error={fieldErrors.matKhau}
          disabled={isLoading}
          required
          autoComplete="new-password"
        />

        <PasswordField
          label="Xác nhận mật khẩu"
          id="register-confirm-password"
          placeholder="Nhập lại mật khẩu..."
          value={xacNhanMatKhau}
          onChange={(e) => {
            setXacNhanMatKhau(e.target.value);
            if (fieldErrors.xacNhanMatKhau) setFieldErrors((prev) => ({ ...prev, xacNhanMatKhau: undefined }));
          }}
          leftIcon={<Lock className="h-4 w-4" />}
          error={fieldErrors.xacNhanMatKhau}
          disabled={isLoading}
          required
          autoComplete="new-password"
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            isLoading={isLoading}
          >
            <span>Đăng ký tài khoản</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </form>

      {/* Switch to Login link */}
      <div className="text-center text-xs text-dental-muted">
        Đã có tài khoản?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-dental-accent hover:text-dental-accent-hover underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-dental-accent rounded transition-colors"
        >
          Đăng nhập ngay
        </button>
      </div>
    </div>
  );
};

