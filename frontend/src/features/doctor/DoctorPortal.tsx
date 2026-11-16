import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { AuthSession } from '@/types/auth';
import type {
  DoctorNavTab,
  LichKhamBacSiResponse,
  TrangThaiDatLich
} from '@/types/doctor';
import { doctorService } from '@/services/doctor.service';
import { DoctorSidebar } from './components/DoctorSidebar';
import { DoctorHeader } from './components/DoctorHeader';
import { DoctorDashboard } from './components/DoctorDashboard';
import { DoctorAppointments } from './components/DoctorAppointments';
import { DoctorConsultation } from './components/DoctorConsultation';
import { DoctorTreatmentPlans } from './components/DoctorTreatmentPlans';
import { Toast } from '@/components/ui/Toast';
import { ShieldAlert } from 'lucide-react';

interface DoctorPortalProps {
  session: AuthSession;
  onLogout: () => void;
  onGoToLanding: () => void;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({
  session,
  onLogout,
  onGoToLanding,
}) => {
  const [currentTab, setCurrentTab] = useState<DoctorNavTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as DoctorNavTab;
      if (tabParam && ['overview', 'appointments', 'consultation', 'treatment-plan'].includes(tabParam)) {
        return tabParam;
      }
    }
    return 'overview';
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [schedule, setSchedule] = useState<LichKhamBacSiResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<LichKhamBacSiResponse | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // 1. Role Guard
  const isDoctor = session.user?.vaiTro === 'BAC_SI';

  const handleSelectTab = (tab: DoctorNavTab) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Fetch real schedule from backend
  const loadSchedule = useCallback(async () => {
    if (!session.isAuthenticated || !session.token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await doctorService.getMySchedule();
      setSchedule(data);

      // Đồng bộ lại selectedAppointment nếu có
      if (selectedAppointment) {
        const updated = data.find(item => item.maLich === selectedAppointment.maLich);
        if (updated) {
          setSelectedAppointment(updated);
        }
      }
    } catch (err: any) {
      console.error('Lỗi khi tải lịch khám Bác sĩ:', err);
      setError(err.message || 'Không thể tải lịch khám từ máy chủ.');
      setToast({
        message: err.message || 'Lỗi kết nối khi tải lịch khám.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [session.isAuthenticated, session.token, selectedAppointment]);

  useEffect(() => {
    if (isDoctor) {
      loadSchedule();
    }
  }, [isDoctor, loadSchedule]);

  // 3. KPI Calculations based on schedule
  const kpis = useMemo(() => {
    return doctorService.calculateTodayKPIs(schedule);
  }, [schedule]);

  // 4. Update appointment status workflow
  const handleUpdateStatus = async (maLich: string, trangThai: TrangThaiDatLich) => {
    try {
      await doctorService.updateAppointmentStatus(maLich, trangThai);
      setToast({
        message: `Đã cập nhật ca khám sang trạng thái "${trangThai}" thành công.`,
        type: 'success',
      });
      // Refresh list from server to ensure perfect synchronization
      await loadSchedule();
    } catch (err: any) {
      console.error('Lỗi cập nhật trạng thái:', err);
      setToast({
        message: err.message || 'Không thể cập nhật trạng thái ca khám.',
        type: 'error',
      });
      throw err;
    }
  };

  if (!isDoctor) {
    return (
      <div className="min-h-screen bg-dental-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-soft-card border border-rose-100 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Truy cập bị từ chối</h2>
          <p className="text-xs text-slate-500">
            Khu vực làm việc này chỉ dành riêng cho tài khoản có vai trò Bác sĩ điều trị (BAC_SI).
          </p>
          <button
            onClick={onLogout}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
          >
            Đăng nhập tài khoản khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FBFA] text-slate-800 font-sans antialiased flex flex-col md:flex-row">
      {/* Toast thông báo toàn cục */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* 1. Sidebar Navigation */}
      <DoctorSidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onGoToLanding={onGoToLanding}
        onLogout={onLogout}
        session={session}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col md:pl-64 lg:pl-72 min-h-screen">
        {/* Header */}
        <DoctorHeader
          currentTab={currentTab}
          session={session}
          onLogout={onLogout}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectTab={handleSelectTab}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <DoctorDashboard
              schedule={schedule}
              kpis={kpis}
              loading={loading}
              error={error}
              onRetry={loadSchedule}
              onSelectTab={handleSelectTab}
              onSelectAppointment={(app) => setSelectedAppointment(app)}
            />
          )}

          {currentTab === 'appointments' && (
            <DoctorAppointments
              schedule={schedule}
              kpis={kpis}
              loading={loading}
              error={error}
              onRetry={loadSchedule}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onUpdateStatus={handleUpdateStatus}
              selectedAppointment={selectedAppointment}
              onSelectAppointment={setSelectedAppointment}
              onSelectTab={handleSelectTab}
            />
          )}

          {currentTab === 'consultation' && (
            <DoctorConsultation
              schedule={schedule}
              loading={loading}
              error={error}
              onRetry={loadSchedule}
              selectedAppointment={selectedAppointment}
              onSelectAppointment={setSelectedAppointment}
              onUpdateStatus={handleUpdateStatus}
              onSelectTab={handleSelectTab}
            />
          )}

          {currentTab === 'treatment-plan' && (
            <DoctorTreatmentPlans
              schedule={schedule}
              loading={loading}
              onRefreshSchedule={loadSchedule}
              onSelectTab={handleSelectTab}
            />
          )}
        </main>
      </div>
    </div>
  );
};
