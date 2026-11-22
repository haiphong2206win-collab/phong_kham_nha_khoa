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
import type {
  BenhNhanProfile,
  YeuCauDatLich,
  PatientDashboardSummary,
  LichKhamBenhNhan,
  ThongBaoItem,
  LoTrinhDieuTri,
} from '@/types/patient';
import {
  ArrowLeft,
  ShieldAlert,
  Bell,
  CheckCircle2,
  CalendarCheck2,
  Clock,
  RotateCcw,
  Calendar,
  CheckCheck,
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
  const [officialAppointments, setOfficialAppointments] = useState<LichKhamBenhNhan[]>([]);
  const [treatmentPlans, setTreatmentPlans] = useState<LoTrinhDieuTri[]>([]);
  const [treatmentPlansAvailable, setTreatmentPlansAvailable] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<ThongBaoItem[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingNotifId, setIsMarkingNotifId] = useState<string | null>(null);

  // 1. Role Guard: Chỉ cho phép tài khoản BENH_NHAN
  const isBenhNhan = session.user?.vaiTro === 'BENH_NHAN';

  const loadData = useCallback(async () => {
    if (!session.isAuthenticated || !session.token) return;

    setLoading(true);
    setError(null);

    try {
      // Gọi song song hồ sơ, yêu cầu đặt lịch, lịch khám chính thức, thông báo và lộ trình điều trị từ MySQL thực
      const [profileRes, appointmentsRes, officialRes, notifsRes, unreadRes, treatmentPlansRes] = await Promise.allSettled([
        patientService.getMyProfile(),
        patientService.getMyAppointmentRequests(),
        patientService.getMyOfficialAppointments(),
        patientService.getNotifications(),
        patientService.getUnreadNotificationCount(),
        patientService.getMyTreatmentPlans(),
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

      if (officialRes.status === 'fulfilled') {
        setOfficialAppointments(officialRes.value || []);
      } else {
        console.warn('Lỗi khi tải lịch khám chính thức:', officialRes.reason);
      }

      if (treatmentPlansRes.status === 'fulfilled') {
        setTreatmentPlans(treatmentPlansRes.value.plans || []);
        setTreatmentPlansAvailable(treatmentPlansRes.value.available);
      } else {
        console.warn('Lỗi khi tải lộ trình điều trị:', treatmentPlansRes.reason);
      }

      if (notifsRes.status === 'fulfilled') {
        setNotifications(notifsRes.value || []);
      } else {
        console.warn('Lỗi khi tải thông báo:', notifsRes.reason);
      }

      if (unreadRes.status === 'fulfilled') {
        setUnreadNotifCount(unreadRes.value ?? 0);
      } else {
        console.warn('Lỗi khi tải số thông báo chưa đọc:', unreadRes.reason);
      }

      if (profileRes.status === 'rejected' && appointmentsRes.status === 'rejected' && officialRes.status === 'rejected') {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định khi tải dữ liệu.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [session.isAuthenticated, session.token]);

  const handleMarkNotificationAsRead = async (maThongBao: string) => {
    setIsMarkingNotifId(maThongBao);
    try {
      await patientService.markNotificationAsRead(maThongBao);
      setNotifications((prev) =>
        prev.map((n) => (n.maThongBao === maThongBao ? { ...n, daDoc: true } : n))
      );
      setUnreadNotifCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Không thể đánh dấu thông báo đã đọc:', err);
    } finally {
      setIsMarkingNotifId(null);
    }
  };

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
  const nearestReq = appointments.length > 0 ? appointments[0] : null;
  const nearestOff = officialAppointments.length > 0 ? officialAppointments[0] : null;
  const activePlan = treatmentPlans.length > 0
    ? (treatmentPlans.find(p => p.trangThai === 'DANG_DIEU_TRI') ||
       treatmentPlans.find(p => p.trangThai === 'CHUA_BAT_DAU') ||
       treatmentPlans[0])
    : null;

  const dashboardSummary: PatientDashboardSummary = {
    profile,
    appointmentRequests: appointments,
    officialAppointments,
    nearestAppointment: nearestReq,
    nearestOfficialAppointment: nearestOff,
    treatmentPlanAvailable: treatmentPlansAvailable && treatmentPlans.length > 0,
    treatmentPlanNote: treatmentPlans.length > 0
      ? `Đang có ${treatmentPlans.length} lộ trình điều trị trong hồ sơ bệnh án.`
      : 'Bệnh nhân chưa có lộ trình điều trị được khởi tạo.',
    treatmentPlans,
    activeTreatmentPlan: activePlan,
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
        unreadNotifCount={unreadNotifCount}
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
          unreadNotifCount={unreadNotifCount}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
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

          {/* TAB 3: Lịch khám của tôi (FE-2C - Lịch chính thức + Yêu cầu đặt lịch) */}
          {currentTab === 'appointments' && (
            <PatientAppointments
              session={session}
              profile={profile}
              appointments={appointments}
              officialAppointments={officialAppointments}
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

          {/* TAB 6: Thông báo (FE-2C Tích hợp dữ liệu thật từ Backend) */}
          {currentTab === 'notifications' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E3ECE9]">
                <div>
                  <h2 className="text-xl font-bold text-[#1E384C]">Thông báo hệ thống</h2>
                  <p className="text-xs text-[#7A9A93] mt-1">
                    Cập nhật lịch khám, phân công bác sĩ và các nhắc nhở y tế quan trọng.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadData}
                    className="p-2 rounded-xl border border-[#E3ECE9] text-xs font-semibold text-[#5A777E] hover:bg-[#F0F5F3] hover:text-[#169C89] transition-colors inline-flex items-center gap-1.5"
                    title="Tải lại thông báo"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Làm mới</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectTab('overview')}
                    className="px-3.5 py-2 rounded-xl border border-[#E3ECE9] text-xs font-semibold text-[#344C52] hover:bg-[#F0F5F3] transition-colors inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Quay lại</span>
                  </button>
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[#5A777E]">
                  Tất cả: <strong className="text-[#1E384C]">{notifications.length}</strong> thông báo
                </span>
                {unreadNotifCount > 0 ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-bold text-[11px]">
                    {unreadNotifCount} chưa đọc
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F6F2] text-[#169C89] border border-[#CEEBE2] font-semibold text-[11px] inline-flex items-center gap-1">
                    <CheckCheck className="w-3 h-3" />
                    Đã đọc tất cả
                  </span>
                )}
              </div>

              {/* Notification List */}
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((item) => {
                    const isUnread = !item.daDoc;
                    return (
                      <div
                        key={item.maThongBao}
                        className={`p-4 sm:p-5 rounded-3xl border transition-all space-y-2.5 shadow-2xs ${
                          isUnread
                            ? 'bg-[#F4FAF8] border-[#CEEDE4] ring-1 ring-[#169C89]/20'
                            : 'bg-white border-[#E3ECE9]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                              item.loaiThongBao === 'LICH_DA_PHAN_CONG'
                                ? 'bg-[#E8F6F2] text-[#169C89]'
                                : item.loaiThongBao === 'LICH_DA_XAC_NHAN'
                                ? 'bg-[#EFF6FF] text-[#2563EB]'
                                : item.loaiThongBao === 'LICH_BI_HUY'
                                ? 'bg-red-50 text-red-600'
                                : 'bg-[#FFFBEB] text-[#D97706]'
                            }`}>
                              {item.loaiThongBao === 'LICH_DA_PHAN_CONG' ? (
                                <CalendarCheck2 className="w-4 h-4" />
                              ) : item.loaiThongBao === 'LICH_DA_XAC_NHAN' ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <Bell className="w-4 h-4" />
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <h3 className={`text-sm font-bold ${isUnread ? 'text-[#169C89]' : 'text-[#1E384C]'}`}>
                                {item.tieuDe}
                              </h3>
                              <div className="flex items-center gap-2 text-[11px] text-[#7A9A93]">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {item.thoiGianTao
                                    ? new Date(item.thoiGianTao).toLocaleString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                      })
                                    : 'Vừa xong'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {isUnread && (
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold shrink-0">
                              Mới
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#344C52] leading-relaxed pl-12">
                          {item.noiDung}
                        </p>

                        {/* Action buttons inside card */}
                        <div className="pt-2 pl-12 flex flex-wrap items-center gap-2.5">
                          {item.maLich && (
                            <button
                              type="button"
                              onClick={() => handleSelectTab('appointments')}
                              className="px-3 py-1.5 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white font-bold text-xs shadow-2xs inline-flex items-center gap-1.5 transition-colors"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Xem lịch khám liên quan</span>
                            </button>
                          )}

                          {isUnread && (
                            <button
                              type="button"
                              disabled={isMarkingNotifId === item.maThongBao}
                              onClick={() => handleMarkNotificationAsRead(item.maThongBao)}
                              className="px-3 py-1.5 rounded-xl border border-[#CEEBE2] bg-white hover:bg-[#E8F6F2] text-[#169C89] font-bold text-xs inline-flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>{isMarkingNotifId === item.maThongBao ? 'Đang lưu...' : 'Đánh dấu đã đọc'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card text-center space-y-2">
                  <div className="h-10 w-10 rounded-2xl bg-[#F0F5F3] text-[#7A9A93] flex items-center justify-center mx-auto">
                    <Bell className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1E384C]">Chưa có thông báo mới</h3>
                  <p className="text-xs text-[#7A9A93] max-w-sm mx-auto">
                    Các thông báo từ phòng khám và bác sĩ phụ trách sẽ hiển thị tại đây khi có lịch hẹn mới được phân công.
                  </p>
                </div>
              )}
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
