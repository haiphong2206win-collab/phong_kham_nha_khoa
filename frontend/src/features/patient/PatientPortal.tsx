import React, { useState, useEffect, useCallback } from 'react';
import { 
  PatientSidebar, 
  PatientNavTab 
} from './components/PatientSidebar';
import { PatientHeader } from './components/PatientHeader';
import { PatientDashboard } from './components/PatientDashboard';
import { PatientBooking } from './components/PatientBooking';
import { PatientAppointments } from './components/PatientAppointments';
import { PatientProfile } from './components/PatientProfile';
import { PatientTreatment } from './components/PatientTreatment';
import { PatientFAQ } from './components/PatientFAQ';
import { patientService } from '@/services/patient.service';
import type { AuthSession } from '@/types/auth';
import type { BenhNhanProfile, YeuCauDatLich, PatientDashboardSummary } from '@/types/patient';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Bell
} from 'lucide-react';

interface PatientPortalProps {
  session: AuthSession;
  onLogout: () => void;
  onGoToLanding: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  session,
  onLogout,
  onGoToLanding,
}) => {
  const [currentTab, setCurrentTab] = useState<PatientNavTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as PatientNavTab;
      const validTabs: PatientNavTab[] = ['overview', 'booking', 'appointments', 'treatment-plan', 'profile', 'notifications', 'faq'];
      if (tabParam && validTabs.includes(tabParam)) {
        return tabParam;
      }
    }
    return 'overview';
  });

  const [isProfileDirty, setIsProfileDirty] = useState<boolean>(false);

  const handleSelectTab = (tab: PatientNavTab) => {
    if (currentTab === 'profile' && isProfileDirty && tab !== 'profile') {
      const confirmLeave = window.confirm(
        'Bạn có thay đổi chưa lưu trong hồ sơ cá nhân. Bạn có chắc chắn muốn chuyển trang mà không lưu?'
      );
      if (!confirmLeave) return;
      setIsProfileDirty(false);
    }
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [profile, setProfile] = useState<BenhNhanProfile | null>(null);
  const [appointments, setAppointments] = useState<YeuCauDatLich[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Role Guard: Chỉ cho phép tài khoản BENH_NHAN
  const isBenhNhan = session.user?.vaiTro === 'BENH_NHAN';

  const loadData = useCallback(async () => {
    if (!session.isAuthenticated || !session.token) return;

    setLoading(true);
    setError(null);

    try {
      // Gọi song song hồ sơ và danh sách yêu cầu đặt lịch từ MySQL thực
      const [profileRes, appointmentsRes] = await Promise.allSettled([
        patientService.getMyProfile(),
        patientService.getMyAppointmentRequests(),
      ]);

      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value);
      } else {
        console.warn('Lỗi khi tải hồ sơ bệnh nhân:', profileRes.reason);
      }

      if (appointmentsRes.status === 'fulfilled') {
        const sorted = [...appointmentsRes.value].sort(
          (a, b) => new Date(b.thoiGianGui).getTime() - new Date(a.thoiGianGui).getTime()
        );
        setAppointments(sorted);
      } else {
        console.warn('Lỗi khi tải yêu cầu đặt lịch:', appointmentsRes.reason);
      }

      if (profileRes.status === 'rejected' && appointmentsRes.status === 'rejected') {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra dịch vụ Backend.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định khi tải dữ liệu.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [session.isAuthenticated, session.token]);

  useEffect(() => {
    if (isBenhNhan) {
      loadData();
    }
  }, [isBenhNhan, loadData]);

  // Nếu không phải quyền Bệnh Nhân -> hiển thị cảnh báo phân quyền Role Guard
  if (!isBenhNhan) {
    return (
      <div className="min-h-screen bg-[#F8FBFA] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-[#1E384C]">
              Truy cập bị từ chối (403 Forbidden)
            </h2>
            <p className="text-xs text-[#6B858D] leading-relaxed">
              Khu vực này chỉ dành riêng cho tài khoản có vai trò <strong>BỆNH NHÂN</strong>. Tài khoản của bạn hiện có vai trò: <span className="font-bold text-[#1E384C]">{session.user?.vaiTro || 'Chưa xác định'}</span>.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={onGoToLanding}
              className="w-full py-2.5 px-4 rounded-xl border border-[#E3ECE9] bg-[#F8FBFA] hover:bg-[#E8F6F2] text-xs font-bold text-[#344C52] transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4 text-[#169C89]" />
              <span>Về trang chủ phòng khám</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2.5 px-4 rounded-xl border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chuẩn bị Summary Dashboard
  const nearest = appointments.length > 0 ? appointments[0] : null;
  const dashboardSummary: PatientDashboardSummary = {
    profile,
    appointmentRequests: appointments,
    nearestAppointment: nearest,
    treatmentPlanAvailable: false,
    treatmentPlanNote: 'Phân quyền API hiện tại (/api/v1/lo-trinh-dieu-tri) chỉ mở cho Bác sĩ và Chủ phòng khám (hasAnyRole: BAC_SI, CHU_PHONG_KHAM). Bác sĩ sẽ trực tiếp cập nhật tiến độ lộ trình trong các buổi khám.',
  };

  return (
    <div className="min-h-screen bg-[#F8FBFA] flex text-[#344C52]">
      {/* 1. Sidebar Trái */}
      <PatientSidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onGoToLanding={onGoToLanding}
        onLogout={onLogout}
        session={session}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Layout Cột Phải */}
      <div className="flex-1 flex flex-col min-w-0">
        <PatientHeader
          session={session}
          profile={profile}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigateTab={handleSelectTab}
          onGoToLanding={onGoToLanding}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-y-auto">
          {/* TAB 1: Trang chủ / Overview */}
          {currentTab === 'overview' && (
            <PatientDashboard
              summary={dashboardSummary}
              session={session}
              loading={loading}
              error={error}
              onNavigateTab={handleSelectTab}
              onRetry={loadData}
            />
          )}

          {/* TAB 2: Đặt lịch khám (FE-2B.2 Giao diện chuẩn duyệt + Dữ liệu thật) */}
          {currentTab === 'booking' && (
            <PatientBooking
              session={session}
              profile={profile}
              appointments={appointments}
              onNavigateTab={handleSelectTab}
              onReloadData={loadData}
            />
          )}

          {/* TAB 3: Lịch khám của tôi (FE-2B.3 - Giao diện chuẩn duyệt + Dữ liệu thật) */}
          {currentTab === 'appointments' && (
            <PatientAppointments
              session={session}
              profile={profile}
              appointments={appointments}
              onNavigateTab={handleSelectTab}
              onReloadData={loadData}
            />
          )}

          {/* TAB 4: Lộ trình điều trị (FE-2B.5) */}
          {currentTab === 'treatment-plan' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              <PatientTreatment
                session={session}
                onNavigateTab={handleSelectTab}
              />
            </div>
          )}

          {/* TAB 5: Hồ sơ cá nhân (FE-2B.4 kết nối Backend thật qua PUT/GET) */}
          {currentTab === 'profile' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              <PatientProfile
                session={session}
                profile={profile}
                onReloadData={loadData}
                onNavigateTab={handleSelectTab}
                onDirtyChange={setIsProfileDirty}
              />
            </div>
          )}

          {/* TAB 6: Thông báo */}
          {currentTab === 'notifications' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E3ECE9]">
                <div>
                  <h2 className="text-xl font-bold text-[#1E384C]">Thông báo hệ thống</h2>
                  <p className="text-xs text-[#7A9A93] mt-1">
                    Các thông báo nhắc hẹn khám và cập nhật hồ sơ y tế.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectTab('overview')}
                  className="px-3.5 py-1.5 rounded-xl border border-[#E3ECE9] text-xs font-semibold text-[#344C52] hover:bg-[#F0F5F3] transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Quay lại</span>
                </button>
              </div>

              <div className="p-10 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card text-center space-y-2">
                <div className="h-10 w-10 rounded-2xl bg-[#F0F5F3] text-[#7A9A93] flex items-center justify-center mx-auto">
                  <Bell className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-[#1E384C]">Chưa có thông báo mới</h3>
                <p className="text-xs text-[#7A9A93] max-w-sm mx-auto">
                  Các thông báo từ phòng khám và bác sĩ phụ trách sẽ hiển thị tại đây khi có lịch hẹn mới được xác nhận.
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: Câu hỏi thường gặp (FE-2B.6) */}
          {currentTab === 'faq' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              <PatientFAQ onNavigateTab={handleSelectTab} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
