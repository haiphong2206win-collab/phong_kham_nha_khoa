import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  Plus,
  Eye,
  Calendar,
  Phone,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { BenhNhanQuanLyResponse } from '@/types/owner';

interface OwnerPatientManagementProps {
  patients: BenhNhanQuanLyResponse[];
  loading: boolean;
  onRefresh: () => void;
  onOpenCreatePatientModal: () => void;
  onOpenPatientDetailModal: (patient: BenhNhanQuanLyResponse) => void;
}

export const OwnerPatientManagement: React.FC<OwnerPatientManagementProps> = ({
  patients,
  loading,
  onRefresh,
  onOpenCreatePatientModal,
  onOpenPatientDetailModal,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Compute real KPIs
  const totalPatients = patients.length;
  const activeAccountsCount = patients.filter(
    (p) => p.trangThaiTaiKhoan === 'DANG_HOAT_DONG'
  ).length;
  const lockedAccountsCount = patients.filter(
    (p) => p.trangThaiTaiKhoan === 'BI_KHOA'
  ).length;

  // Filter list
  const filteredPatients = patients.filter((pat) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      pat.hoTen.toLowerCase().includes(term) ||
      pat.maBenhNhan.toLowerCase().includes(term) ||
      (pat.soDienThoai && pat.soDienThoai.toLowerCase().includes(term)) ||
      (pat.email && pat.email.toLowerCase().includes(term)) ||
      (pat.tenDangNhap && pat.tenDangNhap.toLowerCase().includes(term));

    const matchesGender =
      genderFilter === 'ALL' ||
      (pat.gioiTinh && pat.gioiTinh.toUpperCase() === genderFilter);

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'DANG_HOAT_DONG' && pat.trangThaiTaiKhoan === 'DANG_HOAT_DONG') ||
      (statusFilter === 'BI_KHOA' && pat.trangThaiTaiKhoan === 'BI_KHOA');

    return matchesSearch && matchesGender && matchesStatus;
  });

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPatients = filteredPatients.slice(
    (validCurrentPage - 1) * pageSize,
    validCurrentPage * pageSize
  );

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Quản lý Bệnh nhân
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tra cứu và quản lý hồ sơ bệnh nhân toàn phòng khám.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-600 transition-colors shadow-xs"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Button
            onClick={onOpenCreatePatientModal}
            className="bg-[#169C89] hover:bg-[#138575] text-white flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Bệnh nhân</span>
          </Button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Tổng hồ sơ */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Tổng hồ sơ
            </span>
            <span className="text-3xl font-extrabold text-gray-900">{totalPatients}</span>
            <span className="text-[11px] text-gray-400 block">Hồ sơ bệnh nhân lưu trữ</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#169C89] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Tài khoản hoạt động */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Tài khoản hoạt động
            </span>
            <span className="text-3xl font-extrabold text-emerald-600">{activeAccountsCount}</span>
            <span className="text-[11px] text-gray-400 block">Có thể đăng nhập hệ thống</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Tài khoản bị khóa */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Tài khoản bị khóa
            </span>
            <span className="text-3xl font-extrabold text-rose-600">{lockedAccountsCount}</span>
            <span className="text-[11px] text-gray-400 block">Đang tạm ngưng đăng nhập</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <UserX className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo tên, mã bệnh nhân, số điện thoại..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89]"
            />
          </div>

          {/* Gender Filter */}
          <div className="sm:w-44">
            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89]"
            >
              <option value="ALL">Giới tính: Tất cả</option>
              <option value="NAM">Nam</option>
              <option value="NU">Nữ</option>
              <option value="KHAC">Khác</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89]"
            >
              <option value="ALL">Trạng thái: Tất cả</option>
              <option value="DANG_HOAT_DONG">Đang hoạt động</option>
              <option value="BI_KHOA">Bị khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Patients Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#169C89]" />
            <span className="text-sm">Đang tải danh sách bệnh nhân...</span>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="py-16 text-center text-gray-500 space-y-2">
            <Users className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold">Không tìm thấy hồ sơ bệnh nhân nào</p>
            <p className="text-xs text-gray-400">
              Hãy thử thay đổi điều kiện tìm kiếm hoặc lọc theo trạng thái khác.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-[#F8FAFC] text-gray-500 uppercase text-[11px] font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4 text-center w-12">#</th>
                  <th className="py-3.5 px-4">Mã BN</th>
                  <th className="py-3.5 px-4">Họ và tên</th>
                  <th className="py-3.5 px-4">Ngày sinh</th>
                  <th className="py-3.5 px-4">Liên hệ</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-normal">
                {paginatedPatients.map((pat, idx) => {
                  const globalIdx = (validCurrentPage - 1) * pageSize + idx + 1;
                  const isAccountActive = pat.trangThaiTaiKhoan === 'DANG_HOAT_DONG';

                  return (
                    <tr
                      key={pat.maBenhNhan}
                      className="hover:bg-teal-50/20 transition-colors duration-100"
                    >
                      <td className="py-3.5 px-4 text-center font-medium text-gray-400">
                        {globalIdx}
                      </td>

                      {/* Mã BN */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-50 text-[#169C89] border border-teal-200/60 font-mono">
                          {pat.maBenhNhan}
                        </span>
                      </td>

                      {/* Họ tên */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-[#169C89] flex items-center justify-center font-bold text-xs shrink-0">
                            {pat.hoTen.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 block">{pat.hoTen}</span>
                            {pat.tenDangNhap && (
                              <span className="text-[11px] text-gray-400">@{pat.tenDangNhap}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Ngày sinh */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatDate(pat.ngaySinh)}</span>
                        </div>
                      </td>

                      {/* Liên hệ */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{pat.soDienThoai || 'Chưa cập nhật'}</span>
                        </div>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {pat.trangThaiTaiKhoan ? (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              isAccountActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isAccountActive ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            {isAccountActive ? 'Đang hoạt động' : 'Bị khóa'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Chưa có TK
                          </span>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onOpenPatientDetailModal(pat)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 text-[#169C89] hover:bg-teal-100 font-semibold text-xs transition-colors"
                          title="Xem chi tiết bệnh nhân"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination Footer */}
        {filteredPatients.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span>Hiển thị</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-lg border border-gray-200 bg-white font-medium"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>bản ghi / trang (Tổng số: {filteredPatients.length} hồ sơ)</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage <= 1}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-7 h-7 rounded-lg font-semibold transition-colors ${
                    validCurrentPage === pg
                      ? 'bg-[#169C89] text-white'
                      : 'border border-gray-200 hover:bg-white text-gray-700'
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage >= totalPages}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
