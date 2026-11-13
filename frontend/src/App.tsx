import React, { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import type { AuthResponse, AuthSession } from '@/types/auth';
import { AuthLayout } from '@/features/auth/AuthLayout';
import { LoginForm } from '@/features/auth/LoginForm';
import { RegisterForm } from '@/features/auth/RegisterForm';
import { UserDashboardPlaceholder } from '@/features/auth/UserDashboardPlaceholder';
import { Toast } from '@/components/ui/Toast';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [session, setSession] = useState<AuthSession>(() => authService.getStoredSession());
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Đồng bộ phiên nếu có thay đổi từ storage hoặc khi token hết hạn
  useEffect(() => {
    const currentSession = authService.getStoredSession();
    setSession(currentSession);

    const handleExpired = () => {
      setSession(authService.getStoredSession());
      setActiveTab('login');
      setToast({
        message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.',
        type: 'error',
      });
    };

    window.addEventListener('clinic_auth_expired', handleExpired);
    return () => {
      window.removeEventListener('clinic_auth_expired', handleExpired);
    };
  }, []);

  const handleAuthSuccess = (authData: AuthResponse) => {
    authService.saveSession(authData);
    setSession({
      user: {
        maTaiKhoan: authData.maTaiKhoan,
        tenDangNhap: authData.tenDangNhap,
        vaiTro: authData.vaiTro,
      },
      token: authData.token,
      isAuthenticated: true,
    });
    setToast({
      message: `Chào mừng ${authData.tenDangNhap}! Xác thực thành công.`,
      type: 'success',
    });
  };

  const handleLogout = () => {
    authService.logout();
    setSession(authService.getStoredSession());
    setActiveTab('login');
    setToast({
      message: 'Bạn đã đăng xuất thành công khỏi hệ thống.',
      type: 'info',
    });
  };

  const isLoggedIn = session.isAuthenticated && session.user !== null;

  return (
    <div className="min-h-screen bg-dental-bg text-dental-text font-sans antialiased selection:bg-dental-mint selection:text-dental-accentDark">
      {/* Toast thông báo phản hồi hệ thống */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Điều hướng giao diện theo trạng thái đăng nhập */}
      {isLoggedIn ? (
        <UserDashboardPlaceholder session={session} onLogout={handleLogout} />
      ) : (
        <AuthLayout activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === 'login' ? (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onSwitchToRegister={() => setActiveTab('register')}
            />
          ) : (
            <RegisterForm
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={() => setActiveTab('login')}
            />
          )}
        </AuthLayout>
      )}
    </div>
  );
};

export default App;
