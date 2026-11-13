import React, { useState } from 'react';
import { User, Lock, ArrowRight, Stethoscope, Building2, UserCheck } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import { PasswordField } from '@/components/ui/PasswordField';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { authService } from '@/services/auth.service';
import { AuthResponse } from '@/types/auth';

interface LoginFormProps {
  onSuccess: (authData: AuthResponse) => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ tenDangNhap?: string; matKhau?: string }>({});

  const validate = (): boolean => {
    const errors: { tenDangNhap?: string; matKhau?: string } = {};

    if (!tenDangNhap.trim()) {
      errors.tenDangNhap = 'Vui lòng nhập tên đăng nhập';
    }

    if (!matKhau) {
      errors.matKhau = 'Vui lòng nhập mật khẩu';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = await authService.login({
        tenDangNhap: tenDangNhap.trim(),
        matKhau,
      });

      authService.saveSession(result);
      onSuccess(result);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for QA/Reviewers in DEV mode (username only, no hardcoded password)
  const fillDemoAccount = (username: string) => {
    setTenDangNhap(username);
    setMatKhau('');
    setErrorMessage(null);
    setFieldErrors({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-dental-text tracking-tight">
          Đăng nhập hệ thống
        </h2>
        <p className="text-xs text-dental-muted mt-1">
          Nhập tài khoản được cấp bởi phòng khám để truy cập hồ sơ và lộ trình điều trị.
        </p>
      </div>

      <FormError message={errorMessage} />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField
          label="Tên đăng nhập"
          id="login-username"
          placeholder="Nhập tên đăng nhập..."
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
          id="login-password"
          placeholder="Nhập mật khẩu..."
          value={matKhau}
          onChange={(e) => {
            setMatKhau(e.target.value);
            if (fieldErrors.matKhau) setFieldErrors((prev) => ({ ...prev, matKhau: undefined }));
          }}
          leftIcon={<Lock className="h-4 w-4" />}
          error={fieldErrors.matKhau}
          disabled={isLoading}
          required
          autoComplete="current-password"
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            isLoading={isLoading}
          >
            <span>Đăng nhập</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </form>

      {/* Demo Account Presets for Reviewers & Testing - DEV ONLY */}
      {import.meta.env.DEV && (
        <div className="pt-4 border-t border-dental-border/60">
          <p className="text-[11px] font-semibold text-dental-muted mb-2 uppercase tracking-wider">
            Tài khoản kiểm thử nhanh (Chỉ môi trường phát triển):
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('bs_demo')}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dental-border bg-dental-bg hover:bg-dental-mint/40 text-[11px] text-dental-text font-medium transition-colors"
              title="Điền tên đăng nhập Bác sĩ"
            >
              <Stethoscope className="h-3 w-3 text-dental-accent" />
              <span>Bác sĩ</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('bn_demo')}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dental-border bg-dental-bg hover:bg-dental-mint/40 text-[11px] text-dental-text font-medium transition-colors"
              title="Điền tên đăng nhập Bệnh nhân"
            >
              <UserCheck className="h-3 w-3 text-dental-accent" />
              <span>Bệnh nhân</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('chu_demo')}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dental-border bg-dental-bg hover:bg-dental-mint/40 text-[11px] text-dental-text font-medium transition-colors"
              title="Điền tên đăng nhập Quản trị"
            >
              <Building2 className="h-3 w-3 text-dental-accent" />
              <span>Chủ khám</span>
            </button>
          </div>
        </div>
      )}

      {/* Switch to Register link */}
      <div className="text-center text-xs text-dental-muted">
        Chưa có tài khoản bệnh nhân?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-semibold text-dental-accent hover:text-dental-accent-hover underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-dental-accent rounded transition-colors"
        >
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
};

