import React, { useState } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type {
  YeuCauDatLichResponse,
  TrangThaiYeuCau,
} from '@/types/owner';

interface OwnerAppointmentRequestsProps {
  requests: YeuCauDatLichResponse[];
  loading: boolean;
  onRefresh: () => void;
  onOpenAssignModal: (req: YeuCauDatLichResponse) => void;
  onOpenRejectModal: (req: YeuCauDatLichResponse) => void;
}

export const OwnerAppointmentRequests: React.FC<OwnerAppointmentRequestsProps> = ({
  requests,
  loading,
  onRefresh,
  onOpenAssignModal,
  onOpenRejectModal,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.tenBenhNhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.maYeuCau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.lyDoKham && req.lyDoKham.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'TU_CHOI'
        ? req.trangThai === 'TU_CHOI' || req.trangThai === 'DA_TU_CHOI'
        : req.trangThai === statusFilter);

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TrangThaiYeuCau) => {
    switch (status) {
      case 'CHO_PHAN_CONG':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Chờ phân công
          </span>
        );
      case 'DA_PHAN_CONG':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            <CheckCircle2 className="h-3 w-3 text-teal-600" />
            Đã phân công
          </span>
        );
      case 'DA_TU_CHOI':
      case 'TU_CHOI':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="h-3 w-3 text-rose-600" />
            Đã từ chối
          </span>
        );
      case 'DA_HUY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            <XCircle className="h-3 w-3 text-gray-500" />
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Quản lý Yêu cầu Đặt lịch
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tiếp nhận, phê duyệt và phân công bác sĩ khám chữa bệnh cho bệnh nhân.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#169C89]' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-dental-border shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã yêu cầu, tên bệnh nhân..."
            className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:outline-hidden focus:ring-2 focus:ring-[#169C89] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:outline-hidden focus:ring-2 focus:ring-[#169C89] focus:bg-white text-gray-700 font-medium"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="CHO_PHAN_CONG">Chờ phân công</option>
            <option value="DA_PHAN_CONG">Đã phân công</option>
            <option value="TU_CHOI">Đã từ chối</option>
            <option value="DA_HUY">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Table Area */}
      <div className="rounded-3xl bg-white border border-dental-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-bold">
                <th className="py-3 px-4">Mã yêu cầu</th>
                <th className="py-3 px-4">Bệnh nhân</th>
                <th className="py-3 px-4">Ngày khám</th>
                <th className="py-3 px-4">Ca khám</th>
                <th className="py-3 px-4">Lý do khám</th>
                <th className="py-3 px-4">Thời gian gửi</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <Loader2 className="h-6 w-6 animate-spin text-[#169C89] mx-auto mb-2" />
                    <span>Đang tải danh sách yêu cầu đặt lịch...</span>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    Không tìm thấy yêu cầu đặt lịch nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.maYeuCau} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-800">
                      {req.maYeuCau}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-gray-900">{req.tenBenhNhan}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{req.maBenhNhan}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-800">
                      {req.ngayMongMuon}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-gray-700">
                        {req.caKham === 'CA_SANG' ? 'Ca sáng (08h - 12h)' : 'Ca chiều (13h - 17h)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-gray-600" title={req.lyDoKham || ''}>
                      {req.lyDoKham || 'Khám răng tổng quát'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                      {new Date(req.thoiGianGui).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(req.trangThai)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      {req.trangThai === 'CHO_PHAN_CONG' ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => onOpenAssignModal(req)}
                            className="bg-[#169C89] hover:bg-[#138575] text-white text-xs px-2.5 py-1"
                          >
                            Phân công
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onOpenRejectModal(req)}
                            className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs px-2.5 py-1"
                          >
                            Từ chối
                          </Button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          {req.trangThai === 'DA_TU_CHOI' && req.lyDoTuChoi
                            ? `Lý do: ${req.lyDoTuChoi}`
                            : 'Đã hoàn tất'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
