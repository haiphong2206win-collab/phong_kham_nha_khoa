import React, { useState, useEffect, useCallback } from 'react';
import { 
  PatientSidebar, 
  PatientNavTab 
} from './components/PatientSidebar';
import { PatientHeader } from './components/PatientHeader';
import { PatientDashboard } from './components/PatientDashboard';
import { patientService } from '@/services/patient.service';
import type { AuthSession } from '@/types/auth';
import type { BenhNhanProfile, YeuCauDatLich, PatientDashboardSummary, CaKham } from '@/types/patient';
import { 
  CalendarPlus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldAlert, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Bell
} from 'lucide-react';

interface PatientPortalProps {
  session: AuthSession;
  onLogout: () => void;
  onGoToLanding: () => void;
}

const CA_KHAM_TIME: Record<string, string> = {
  CA_SANG: 'Ca Sáng (08:00 - 11:30)',
  CA_CHIEU: 'Ca Chiều (13:30 - 17:00)',
};

const TRANG_THAI_MAP: Record<string, { label: string; bg: string; text: string; border: string }> = {
  CHO_PHAN_CONG: { label: 'Chờ phân công', bg: 'bg-[#FFFBEB]', text: 'text-[#D97706]', border: 'border-[#FEF3C7]' },
  DA_PHAN_CONG: { label: 'Đã xác nhận', bg: 'bg-[#E8F6F2]', text: 'text-[#169C89]', border: 'border-[#CEEBE2]' },
  CHO_XAC_NHAN: { label: 'Chờ xác nhận', bg: 'bg-[#FFFBEB]', text: 'text-[#D97706]', border: 'border-[#FEF3C7]' },
  DA_XAC_NHAN: { label: 'Đã xác nhận', bg: 'bg-[#E8F6F2]', text: 'text-[#169C89]', border: 'border-[#CEEBE2]' },
  TU_CHOI: { label: 'Từ chối', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  DA_HUY: { label: 'Đã hủy', bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
};

export const PatientPortal: React.FC<PatientPortalProps> = ({
  session,
  onLogout,
  onGoToLanding,
}) => {
  const [currentTab, setCurrentTab] = useState<PatientNavTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [profile, setProfile] = useState<BenhNhanProfile | null>(null);
  const [appointments, setAppointments] = useState<YeuCauDatLich[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Booking form states
  const [bookDate, setBookDate] = useState<string>('');
  const [bookShift, setBookShift] = useState<CaKham>('CA_SANG');
  const [bookReason, setBookReason] = useState<string>('');
  const [bookNote, setBookNote] = useState<string>('');
  const [bookingSubmitting, setBookingSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

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

  // Xử lý gửi yêu cầu đặt lịch thực tế vào MySQL
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookDate || !bookReason.trim()) {
      setBookingError('Vui lòng chọn ngày khám và nhập lý do khám.');
      return;
    }

    setBookingSubmitting(true);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      await patientService.createAppointmentRequest({
        ngayMongMuon: bookDate,
        caKham: bookShift,
        lyDoKham: bookReason.trim(),
        ghiChu: bookNote.trim() || undefined,
      });

      setBookingSuccess('Gửi yêu cầu đặt lịch thành công! Phòng khám sẽ sớm xác nhận.');
      setBookDate('');
      setBookReason('');
      setBookNote('');
      
      // Reload danh sách lịch hẹn từ database
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể gửi yêu cầu đặt lịch.';
      setBookingError(msg);
    } finally {
      setBookingSubmitting(false);
    }
  };

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
        onSelectTab={setCurrentTab}
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
          onNavigateTab={(tab) => setCurrentTab(tab)}
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
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onRetry={loadData}
            />
          )}

          {/* TAB 2: Đặt lịch khám (Form gửi yêu cầu thật vào MySQL) */}
          {currentTab === 'booking' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E3ECE9]">
                <div>
                  <h2 className="text-xl font-bold text-[#1E384C]">Đặt lịch khám trực tuyến</h2>
                  <p className="text-xs text-[#7A9A93] mt-1">
                    Điền thông tin ca khám mong muốn để gửi yêu cầu đến phòng khám Nha Khoa Nụ Cười Xanh.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentTab('overview')}
                  className="px-3.5 py-1.5 rounded-xl border border-[#E3ECE9] text-xs font-semibold text-[#344C52] hover:bg-[#F0F5F3] transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Quay lại</span>
                </button>
              </div>

              {bookingSuccess && (
                <div className="p-4 rounded-2xl bg-[#E8F6F2] border border-[#CEEBE2] text-[#169C89] text-xs font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{bookingSuccess}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('appointments')}
                    className="underline text-xs font-bold hover:text-[#138776]"
                  >
                    Xem lịch đã gửi &gt;
                  </button>
                </div>
              )}

              {bookingError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              <form onSubmit={handleCreateBooking} className="p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E384C] block">
                    Ngày mong muốn khám <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1ECE7] focus:border-[#169C89] outline-hidden text-xs text-[#1E384C] bg-[#F8FBFA]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E384C] block">
                    Ca khám <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(['CA_SANG', 'CA_CHIEU'] as CaKham[]).map((shift) => (
                      <button
                        key={shift}
                        type="button"
                        onClick={() => setBookShift(shift)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                          bookShift === shift
                            ? 'bg-[#E8F6F2] border-[#169C89] text-[#169C89] shadow-2xs'
                            : 'border-[#E3ECE9] hover:bg-[#F0F5F3] text-[#344C52]'
                        }`}
                      >
                        <span className="block">{CA_KHAM_TIME[shift]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E384C] block">
                    Lý do khám / Dịch vụ mong muốn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bookReason}
                    onChange={(e) => setBookReason(e.target.value)}
                    placeholder="Ví dụ: Khám răng định kỳ, cạo vôi răng, đau răng hàm..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1ECE7] focus:border-[#169C89] outline-hidden text-xs text-[#1E384C] bg-[#F8FBFA]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E384C] block">
                    Ghi chú thêm (nếu có)
                  </label>
                  <textarea
                    value={bookNote}
                    onChange={(e) => setBookNote(e.target.value)}
                    rows={3}
                    placeholder="Tình trạng răng miệng hiện tại hoặc thời gian ưu tiên..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1ECE7] focus:border-[#169C89] outline-hidden text-xs text-[#1E384C] bg-[#F8FBFA]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentTab('overview')}
                    className="px-4 py-2.5 rounded-xl border border-[#E3ECE9] text-xs font-bold text-[#344C52] hover:bg-[#F0F5F3] transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-xs font-bold transition-colors shadow-2xs disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    <span>{bookingSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu đặt lịch'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Lịch khám của tôi (Dữ liệu thật từ MySQL) */}
          {currentTab === 'appointments' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E3ECE9]">
                <div>
                  <h2 className="text-xl font-bold text-[#1E384C]">Lịch khám của tôi</h2>
                  <p className="text-xs text-[#7A9A93] mt-1">
                    Danh sách toàn bộ yêu cầu đặt lịch đã gửi và trạng thái xử lý từ phòng khám.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentTab('booking')}
                  className="px-4 py-2 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-xs font-bold transition-colors shadow-2xs inline-flex items-center gap-1.5"
                >
                  <CalendarPlus className="h-3.5 w-3.5" />
                  <span>+ Đặt lịch mới</span>
                </button>
              </div>

              {appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.map((req) => (
                    <div
                      key={req.maYeuCau}
                      className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E3ECE9] shadow-2xs hover:shadow-soft-card transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold text-[#1E384C]">
                            Mã: {req.maYeuCau}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            TRANG_THAI_MAP[req.trangThai]?.border || 'border-gray-200'
                          } ${TRANG_THAI_MAP[req.trangThai]?.bg || 'bg-gray-50'} ${
                            TRANG_THAI_MAP[req.trangThai]?.text || 'text-gray-600'
                          }`}>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{TRANG_THAI_MAP[req.trangThai]?.label || req.trangThai}</span>
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#1E384C]">
                          {req.lyDoKham}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A777E]">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-[#169C89]" />
                            Ngày hẹn: <strong>{req.ngayMongMuon}</strong>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-[#169C89]" />
                            {CA_KHAM_TIME[req.caKham] || req.caKham}
                          </span>
                        </div>

                        {req.ghiChu && (
                          <p className="text-[11px] text-[#7A9A93] italic">
                            Ghi chú: {req.ghiChu}
                          </p>
                        )}
                      </div>

                      <div className="text-right text-[11px] text-[#7A9A93] shrink-0 sm:self-center">
                        <span>Gửi lúc: {new Date(req.thoiGianGui).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card text-center space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center mx-auto">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1E384C]">Chưa có yêu cầu đặt lịch nào</h3>
                  <p className="text-xs text-[#7A9A93] max-w-sm mx-auto">
                    Bạn chưa gửi yêu cầu đặt lịch khám nào trong hệ thống. Hãy gửi yêu cầu để bác sĩ tiếp nhận và phân công.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('booking')}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-xs font-bold transition-colors shadow-2xs inline-flex items-center gap-1.5"
                  >
                    <CalendarPlus className="h-3.5 w-3.5" />
                    <span>Đặt lịch khám ngay</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Lộ trình điều trị */}
          {currentTab === 'treatment-plan' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E3ECE9]">
                <div>
                  <h2 className="text-xl font-bold text-[#1E384C]">Lộ trình điều trị nha khoa</h2>
                  <p className="text-xs text-[#7A9A93] mt-1">
                    Theo dõi các giai đoạn phác đồ điều trị được bác sĩ chuyên khoa phụ trách thiết lập.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentTab('overview')}
                  className="px-3.5 py-1.5 rounded-xl border border-[#E3ECE9] text-xs font-semibold text-[#344C52] hover:bg-[#F0F5F3] transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Quay lại</span>
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#1E384C]">
                    Hồ sơ phác đồ điều trị cá nhân
                  </h3>
                  <p className="text-xs text-[#7A9A93] leading-relaxed">
                    Theo quy trình y khoa chuẩn tại Nha Khoa Nụ Cười Xanh, phác đồ điều trị (chỉnh nha, implant, phục hình răng sứ...) chỉ được kích hoạt sau khi bác sĩ thăm khám và chụp X-quang trực tiếp tại phòng khám.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] text-xs text-[#5A777E] space-y-1">
                  <span className="font-bold text-[#1E384C] block">Phân quyền bảo mật Backend:</span>
                  <p>
                    Endpoint <code>/api/v1/lo-trinh-dieu-tri</code> chỉ cấp quyền truy cập chỉnh sửa cho vai trò <strong>Bác sĩ</strong> và <strong>Chủ phòng khám</strong> để đảm bảo tính an toàn chuyên môn y tế.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentTab('booking')}
                    className="px-4 py-2 rounded-xl bg-[#169C89] hover:bg-[#138776] text-white text-xs font-bold transition-colors shadow-2xs inline-flex items-center gap-1.5"
                  >
                    <CalendarPlus className="h-3.5 w-3.5" />
                    <span>Đặt lịch khám tư vấn lộ trình</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Hồ sơ cá nhân (Dữ liệu thật từ MySQL) */}
          {currentTab === 'profile' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E3ECE9]">
                <div>
                  <h2 className="text-xl font-bold text-[#1E384C]">Hồ sơ cá nhân</h2>
                  <p className="text-xs text-[#7A9A93] mt-1">
                    Thông tin bệnh nhân đăng ký trong hệ thống Nha Khoa Nụ Cười Xanh.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentTab('overview')}
                  className="px-3.5 py-1.5 rounded-xl border border-[#E3ECE9] text-xs font-semibold text-[#344C52] hover:bg-[#F0F5F3] transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Quay lại</span>
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b border-[#F0F5F3]">
                  <div className="h-16 w-16 rounded-full bg-[#E8F6F2] border-2 border-[#70B8AC] text-[#169C89] font-black text-xl flex items-center justify-center">
                    {(profile?.hoTen || session.user?.tenDangNhap || 'B').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1E384C]">
                      {profile?.hoTen || session.user?.tenDangNhap}
                    </h3>
                    <span className="text-xs text-[#169C89] font-semibold">
                      Mã bệnh nhân: {profile?.maBenhNhan || 'BN-Chưa cấp'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1">
                    <span className="text-[#7A9A93] flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-[#169C89]" /> Tên đăng nhập
                    </span>
                    <span className="font-bold text-[#1E384C] block">
                      {session.user?.tenDangNhap}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1">
                    <span className="text-[#7A9A93] flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-[#169C89]" /> Số điện thoại
                    </span>
                    <span className="font-bold text-[#1E384C] block">
                      {profile?.soDienThoai || 'Chưa cập nhật'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1">
                    <span className="text-[#7A9A93] flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#169C89]" /> Ngày sinh
                    </span>
                    <span className="font-bold text-[#1E384C] block">
                      {profile?.ngaySinh || 'Chưa cập nhật'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1">
                    <span className="text-[#7A9A93] flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-[#169C89]" /> Email
                    </span>
                    <span className="font-bold text-[#1E384C] block">
                      {profile?.email || 'Chưa cập nhật'}
                    </span>
                  </div>

                  <div className="sm:col-span-2 p-3 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1">
                    <span className="text-[#7A9A93] flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#169C89]" /> Địa chỉ
                    </span>
                    <span className="font-bold text-[#1E384C] block">
                      {profile?.diaChi || 'Chưa cập nhật'}
                    </span>
                  </div>
                </div>
              </div>
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
                  onClick={() => setCurrentTab('overview')}
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

          {/* TAB 7: Hỏi đáp FAQ */}
          {currentTab === 'faq' && (
            <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E3ECE9]">
                <div>
                  <h2 className="text-xl font-bold text-[#1E384C]">Hỏi đáp & Hỗ trợ (FAQ)</h2>
                  <p className="text-xs text-[#7A9A93] mt-1">
                    Giải đáp thắc mắc thường gặp về quy trình khám và chăm sóc răng miệng.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentTab('overview')}
                  className="px-3.5 py-1.5 rounded-xl border border-[#E3ECE9] text-xs font-semibold text-[#344C52] hover:bg-[#F0F5F3] transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Quay lại</span>
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1">
                  <h4 className="font-bold text-[#1E384C] flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-[#169C89]" />
                    Làm sao để biết lịch hẹn đã được xác nhận?
                  </h4>
                  <p className="text-[#5A777E] leading-relaxed">
                    Sau khi bạn gửi yêu cầu đặt lịch, nhân viên phòng khám sẽ liên hệ và cập nhật trạng thái thành <strong>Đã xác nhận</strong> ngay trên bảng điều khiển của bạn.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FBFA] border border-[#E3ECE9] space-y-1">
                  <h4 className="font-bold text-[#1E384C] flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-[#169C89]" />
                    Tôi có thể đổi lịch hẹn khám không?
                  </h4>
                  <p className="text-[#5A777E] leading-relaxed">
                    Bạn có thể gửi yêu cầu đặt lịch mới với ngày giờ mong muốn hoặc liên hệ hotline phòng khám để được hỗ trợ nhanh nhất.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#E8F6F2] border border-[#CEEBE2] text-[#169C89] font-semibold flex items-center justify-between">
                  <span>Hotline hỗ trợ bệnh nhân 24/7: <strong>1900 6868</strong></span>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('booking')}
                    className="underline text-xs font-bold"
                  >
                    Đặt lịch ngay &gt;
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
