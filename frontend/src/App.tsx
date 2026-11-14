import React, { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import type { AuthResponse, AuthSession } from '@/types/auth';
import { LandingPage } from '@/pages/LandingPage';
import { AuthLayout } from '@/features/auth/AuthLayout';
import { LoginForm } from '@/features/auth/LoginForm';
import { RegisterForm } from '@/features/auth/RegisterForm';
import { UserDashboardPlaceholder } from '@/features/auth/UserDashboardPlaceholder';
import { PatientPortal } from '@/features/patient/PatientPortal';
import { Toast } from '@/components/ui/Toast';

type ViewMode = 'landing' | 'auth' | 'dashboard';

export const App: React.FC = () => {
  const [session, setSession] = useState<AuthSession>(() => authService.getStoredSession());
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const init = authService.getStoredSession();
    return init.isAuthenticated && init.user ? 'dashboard' : 'landing';
  });
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
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
      setViewMode('auth');
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

  const handleOpenAuth = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setViewMode('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDashboard = () => {
    setViewMode('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setViewMode('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    setViewMode('dashboard');
    setToast({
      message: `Chào mừng ${authData.tenDangNhap}! Xác thực thành công.`,
      type: 'success',
    });
  };

  const handleLogout = () => {
    authService.logout();
    setSession(authService.getStoredSession());
    setViewMode('landing');
    setActiveTab('login');
    setToast({
      message: 'Bạn đã đăng xuất thành công khỏi hệ thống.',
      type: 'info',
    });
  };

  return (
    <div className="min-h-screen bg-dental-bg text-dental-text font-sans antialiased selection:bg-dental-mint selection:text-dental-accentDark">
      {/* Toast thông báo toàn cục */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Điều hướng giao diện mượt mà không mất session */}
      {viewMode === 'landing' && (
        <LandingPage
          session={session}
          onOpenAuth={handleOpenAuth}
          onOpenDashboard={handleOpenDashboard}
          onLogout={handleLogout}
        />
      )}

      {viewMode === 'dashboard' && (
        session.user?.vaiTro === 'BENH_NHAN' ? (
          <PatientPortal
            session={session}
            onLogout={handleLogout}
            onGoToLanding={handleBackToLanding}
          />
        ) : (
          <UserDashboardPlaceholder
            session={session}
            onLogout={handleLogout}
            onGoToLanding={handleBackToLanding}
          />
        )
      )}

      {viewMode === 'auth' && (
        <AuthLayout
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onBackToHome={handleBackToLanding}
        >
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
