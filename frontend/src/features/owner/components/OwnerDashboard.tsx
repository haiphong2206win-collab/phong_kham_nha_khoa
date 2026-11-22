import React from 'react';
import {
  Info,
  RefreshCw,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type {
  YeuCauDatLichResponse,
  BacSiQuanLyResponse,
  OwnerKPISummary,
  OwnerNavTab,
} from '@/types/owner';

interface OwnerDashboardProps {
  kpi: OwnerKPISummary;
  requests: YeuCauDatLichResponse[];
  doctors: BacSiQuanLyResponse[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onSelectTab: (tab: OwnerNavTab) => void;
  onOpenAssignModal: (req: YeuCauDatLichResponse) => void;
  onOpenRejectModal: (req: YeuCauDatLichResponse) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  kpi,
  requests,
  loading,
  error,
  onRefresh,
  onSelectTab,
  onOpenAssignModal,
  onOpenRejectModal,
}) => {
  // Lấy các yêu cầu chờ phân công (ưu tiên hiển thị)
  const pendingRequests = requests.filter((r) => r.trangThai === 'CHO_PHAN_CONG');
  const displayRequests = pendingRequests.length > 0 ? pendingRequests : requests.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CHO_PHAN_CONG':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Chờ phân công
          </span>
        );
      case 'DA_PHAN_CONG':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            Đã phân công
          </span>
        );
      case 'DA_TU_CHOI':
      case 'TU_CHOI':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Đã từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Welcome Banner */}
      <div className="rounded-3xl bg-linear-to-r from-[#E8F8F5] via-[#EBF9F7] to-[#F0FAF8] border border-[#C5ECE4] p-6 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#063C36] tracking-tight">
              Chào mừng trở lại!
            </h1>
            <p className="text-sm text-[#0F4A43] mt-1 font-medium">
              Theo dõi hoạt động điều hành và các yêu cầu cần xử lý.
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#BDE8E0] hover:bg-[#DCF4F0] text-[#0F2D2A] text-xs font-bold transition-all shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[#169C89] ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Đang cập nhật...' : 'Làm mới dữ liệu'}</span>
          </button>
        </div>
      </div>

      {/* Error banner if fetch failed */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={onRefresh}>
            Thử lại
          </Button>
        </div>
      )}

      {/* 2. Four KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Hồ sơ Bác sĩ */}
        <div className="rounded-2xl bg-white border border-dental-border p-5 shadow-xs hover:border-[#169C89]/40 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#169C89]" />
            <span className="text-xs font-bold text-gray-700">Hồ sơ Bác sĩ</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {loading ? <Loader2 className="h-8 w-8 animate-spin text-[#169C89]" /> : kpi.totalDoctors}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Tính từ GET /quan-ly/bac-si</p>
        </div>

        {/* KPI 2: Hồ sơ Bệnh nhân */}
        <div className="rounded-2xl bg-white border border-dental-border p-5 shadow-xs hover:border-[#169C89]/40 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
            <span className="text-xs font-bold text-gray-700">Hồ sơ Bệnh nhân</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {loading ? <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" /> : kpi.totalPatients}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Tính từ GET /quan-ly/benh-nhan</p>
        </div>

        {/* KPI 3: Yêu cầu chờ phân công */}
        <div className="rounded-2xl bg-white border border-dental-border p-5 shadow-xs hover:border-[#F59E0B]/40 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
            <span className="text-xs font-bold text-gray-700">Yêu cầu chờ phân công</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#D97706] tracking-tight">
            {loading ? <Loader2 className="h-8 w-8 animate-spin text-[#F59E0B]" /> : kpi.pendingAppointments}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Trạng thái CHO_PHAN_CONG</p>
        </div>

        {/* KPI 4: Tài khoản */}
        <div className="rounded-2xl bg-white border border-dental-border p-5 shadow-xs hover:border-[#169C89]/40 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />
            <span className="text-xs font-bold text-gray-700">Tài khoản</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {loading ? <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" /> : kpi.totalAccounts}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Tính từ GET /tai-khoan</p>
        </div>
      </div>

      {/* 3. Two Columns: Left = Appointment Requests, Right = Operational Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Cols): Yêu cầu đặt lịch cần xử lý */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-dental-border p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Yêu cầu đặt lịch cần xử lý
              </h2>
              <button
                onClick={() => onSelectTab('appointment-requests')}
                className="text-xs font-bold text-[#169C89] bg-[#E8F8F5] px-3 py-1 rounded-full border border-[#BDE8E0] hover:bg-[#DCF4F0] transition-colors"
              >
                Xem tất cả
              </button>
            </div>

            {/* Table of appointment requests */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-bold">
                    <th className="py-2.5 px-3">Mã yêu cầu</th>
                    <th className="py-2.5 px-3">Bệnh nhân</th>
                    <th className="py-2.5 px-3">Ngày khám</th>
                    <th className="py-2.5 px-3">Buổi</th>
                    <th className="py-2.5 px-3">Trạng thái</th>
                    <th className="py-2.5 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        Chưa có yêu cầu đặt lịch nào trong hệ thống.
                      </td>
                    </tr>
                  ) : (
                    displayRequests.map((req) => (
                      <tr key={req.maYeuCau} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-3 font-mono font-semibold text-gray-800">
                          {req.maYeuCau}
                        </td>
                        <td className="py-3 px-3 font-medium text-gray-900">
                          {req.tenBenhNhan}
                        </td>
                        <td className="py-3 px-3 text-gray-700">
                          {req.ngayMongMuon}
                        </td>
                        <td className="py-3 px-3 font-medium text-gray-600">
                          {req.caKham === 'CA_SANG' ? 'CA_SANG' : 'CA_CHIEU'}
                        </td>
                        <td className="py-3 px-3">
                          {getStatusBadge(req.trangThai)}
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                          {req.trangThai === 'CHO_PHAN_CONG' ? (
                            <>
                              <button
                                onClick={() => onOpenAssignModal(req)}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#E8F8F5] text-[#169C89] border border-[#BDE8E0] hover:bg-[#169C89] hover:text-white transition-colors"
                              >
                                Phân công
                              </button>
                              <button
                                onClick={() => onOpenRejectModal(req)}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white transition-colors"
                              >
                                Từ chối
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400 text-[11px]">Đã xử lý</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-gray-600 font-medium">
                Chọn yêu cầu để xem chi tiết, phân công hoặc từ chối.
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Không tạo lịch giả hoặc cập nhật MySQL khi xem màn hình.
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => onSelectTab('appointment-requests')}
              className="bg-[#169C89] hover:bg-[#138575] text-white font-medium shrink-0"
            >
              Mở danh sách
            </Button>
          </div>
        </div>

        {/* Right (1 Col): Hướng dẫn vận hành */}
        <div className="rounded-3xl bg-white border border-dental-border p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight pb-3 border-b border-gray-100 mb-4">
              Hướng dẫn vận hành
            </h2>

            {/* Operational Guideline Notice */}
            <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/90 text-xs text-teal-900 space-y-2 mb-4">
              <div className="flex items-center gap-2 font-bold text-teal-900 text-sm">
                <Info className="h-4 w-4 text-[#169C89]" />
                <span>Quy định phân công lịch hẹn</span>
              </div>
              <p className="text-xs text-teal-800 leading-relaxed">
                Chỉ phân công bác sĩ có ca làm việc phù hợp vào ngày và buổi khám của bệnh nhân.
              </p>
            </div>

            {/* Bullets */}
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#169C89] mt-1.5 shrink-0" />
                <span>Kiểm tra ca trực trước khi phân công lịch hẹn.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#169C89] mt-1.5 shrink-0" />
                <span>Đảm bảo phòng khám ở trạng thái sẵn sàng đón tiếp.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#169C89] mt-1.5 shrink-0" />
                <span>Theo dõi và xử lý kịp thời các yêu cầu đặt lịch mới.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <span className="text-[10px] text-gray-400 block font-mono text-center">
              Hệ thống phòng khám Nha Khoa Nụ Cười Xanh
            </span>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="pt-4 text-center">
        <span className="text-xs text-gray-400 font-medium">
          Hệ thống Quản trị Phòng khám Nha Khoa Nụ Cười Xanh
        </span>
      </div>
    </div>
  );
};
