import React from 'react';
import { LogOut, Stethoscope, User, Building2, ShieldCheck, Clock, KeyRound, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AuthSession } from '@/types/auth';

interface UserDashboardPlaceholderProps {
  session: AuthSession;
  onLogout: () => void;
  onGoToLanding?: () => void;
}

export const UserDashboardPlaceholder: React.FC<UserDashboardPlaceholderProps> = ({
  session,
  onLogout,
  onGoToLanding,
}) => {
  const { user } = session;
  if (!user) return null;

  // Space configuration according to role
  const roleConfig = {
    BAC_SI: {
      title: 'Không gian làm việc Bác sĩ Điều trị',
      badge: 'BÁC SĨ CHUYÊN KHOA',
      badgeColor: 'bg-dental-accent/15 text-dental-accent border-dental-accent/30',
      icon: <Stethoscope className="h-6 w-6 text-dental-accent" />,
      description: 'Quyền hạn: Xem lộ trình mẫu, tạo và hiệu chỉnh lộ trình điều trị riêng cho bệnh nhân, gán lịch khám và cập nhật trạng thái buổi điều trị.',
      scope: 'Truy cập các API: /api/v1/lo-trinh-dieu-tri/**, /api/v1/bac-si/**'
    },
    BENH_NHAN: {
      title: 'Cổng thông tin Bệnh nhân',
      badge: 'BỆNH NHÂN',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <User className="h-6 w-6 text-emerald-600" />,
      description: 'Quyền hạn: Theo dõi tiến độ lộ trình điều trị cá nhân, gửi yêu cầu đặt lịch hẹn, xem lịch sử khám và thông báo.',
      scope: 'Truy cập các API: /api/v1/benh-nhan/**, /api/v1/yeu-cau-dat-lich/**'
    },
    CHU_PHONG_KHAM: {
      title: 'Khu vực Quản trị Chủ phòng khám',
      badge: 'CHỦ PHÒNG KHÁM',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: <Building2 className="h-6 w-6 text-purple-600" />,
      description: 'Quyền hạn: Phân công bác sĩ, quản lý tài khoản, xem toàn bộ yêu cầu đặt lịch và giám sát hoạt động phòng khám.',
      scope: 'Giao diện quản trị riêng chưa triển khai; hiển thị trạng thái phân quyền đúng chuẩn Backend.'
    },
  };

  const currentRole = roleConfig[user.vaiTro] || {
    title: 'Không gian người dùng',
    badge: user.vaiTro,
    badgeColor: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: <User className="h-6 w-6 text-gray-600" />,
    description: 'Tài khoản đã xác thực thành công.',
    scope: 'Quyền hạn cơ bản.'
  };

  return (
    <div className="min-h-screen bg-dental-bg p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-3xl border border-dental-border bg-white p-6 sm:p-8 shadow-soft-card space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-dental-border">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-dental-mint/60 border border-dental-mint flex items-center justify-center">
              {currentRole.icon}
            </div>
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider mb-1 ${currentRole.badgeColor}`}>
                {currentRole.badge}
              </span>
              <h1 className="text-xl font-bold text-dental-text tracking-tight">
                {currentRole.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onGoToLanding && (
              <Button
                variant="outline"
                size="sm"
                onClick={onGoToLanding}
                className="text-dental-text border-dental-border hover:bg-dental-mint/30"
              >
                <Home className="h-3.5 w-3.5 mr-1.5 text-dental-accent" />
                <span>Trang chủ</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-dental-error hover:bg-dental-error-bg hover:border-dental-error/40"
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              <span>Đăng xuất</span>
            </Button>
          </div>
        </div>

        {/* User Details Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-dental-bg border border-dental-border">
            <span className="text-dental-muted block text-[11px] uppercase tracking-wider font-semibold">Tên đăng nhập</span>
            <span className="text-sm font-bold text-dental-text mt-0.5 block">{user.tenDangNhap}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-dental-bg border border-dental-border">
            <span className="text-dental-muted block text-[11px] uppercase tracking-wider font-semibold">Mã tài khoản (UUID)</span>
            <span className="text-sm font-mono text-dental-text mt-0.5 block truncate">{user.maTaiKhoan}</span>
          </div>
        </div>

        {/* Permissions & Scope description */}
        <div className="p-4 rounded-2xl bg-dental-mint/30 border border-dental-mint space-y-2">
          <h3 className="text-xs font-bold text-dental-text flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-dental-accent" />
            Phân quyền hệ thống đã xác thực
          </h3>
          <p className="text-xs text-dental-text/90 leading-relaxed">
            {currentRole.description}
          </p>
          <p className="text-[11px] text-dental-muted font-mono pt-1">
            {currentRole.scope}
          </p>
        </div>

        {/* Technical Session Verification */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-700 font-medium">
            <span className="flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-slate-500" />
              Phiên đăng nhập đã được xác thực
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <Clock className="h-3.5 w-3.5" /> Thời hạn phiên: 2 giờ
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Mã định danh phiên (Bearer Token) đã được ghi nhận cục bộ cho phiên làm việc hiện tại và tự động đính kèm vào các yêu cầu REST API kế tiếp.
          </p>
        </div>

        {/* Next Phase Indicator */}
        <div className="text-center pt-2">
          <p className="text-xs text-dental-muted">
            Giai đoạn tiếp theo: Module Lộ trình điều trị dành cho Bác sĩ (Bố cục 3 cột) sẽ được kết nối trực tiếp tại không gian này.
          </p>
        </div>

      </div>
    </div>
  );
};

