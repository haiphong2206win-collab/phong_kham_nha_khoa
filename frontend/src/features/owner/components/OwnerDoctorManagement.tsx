import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  RefreshCw,
  Loader2,
  KeyRound,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { BacSiQuanLyResponse, OwnerKPISummary } from '@/types/owner';

interface OwnerDoctorManagementProps {
  doctors: BacSiQuanLyResponse[];
  kpi: OwnerKPISummary;
  loading: boolean;
  onRefresh: () => void;
  onOpenCreateDoctorModal: () => void;
  onOpenDoctorDetailModal: (doctor: BacSiQuanLyResponse) => void;
  onOpenToggleStatusModal: (doctor: BacSiQuanLyResponse) => void;
  onOpenResetPasswordModal: (doctor: BacSiQuanLyResponse) => void;
}

export const OwnerDoctorManagement: React.FC<OwnerDoctorManagementProps> = ({
  doctors,
  kpi,
  loading,
  onRefresh,
  onOpenCreateDoctorModal,
  onOpenDoctorDetailModal,
  onOpenToggleStatusModal,
  onOpenResetPasswordModal,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.maBacSi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.soChungChi && doc.soChungChi.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.tenDangNhap && doc.tenDangNhap.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && doc.dangLamViec && doc.trangThaiTaiKhoan === 'DANG_HOAT_DONG') ||
      (statusFilter === 'LOCKED' && doc.trangThaiTaiKhoan === 'BI_KHOA');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Bar with "+ Thêm Bác sĩ" button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Đội ngũ Bác sĩ
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý hồ sơ, tài khoản và trạng thái hoạt động của Bác sĩ.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-600 transition-colors shadow-xs"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#169C89]' : ''}`} />
          </button>

          <Button
            size="sm"
            onClick={onOpenCreateDoctorModal}
            className="bg-[#169C89] hover:bg-[#138575] text-white font-semibold flex items-center gap-2 shadow-xs"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Thêm Bác sĩ</span>
          </Button>
        </div>
      </div>

      {/* 2. Three KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Hồ sơ Bác sĩ */}
        <div className="rounded-2xl bg-white border border-dental-border p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#169C89]" />
            <span className="text-xs font-bold text-gray-700">Hồ sơ Bác sĩ</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {loading ? <Loader2 className="h-8 w-8 animate-spin text-[#169C89]" /> : kpi.totalDoctors}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Gồm hồ sơ Chủ phòng khám</p>
        </div>

        {/* Card 2: Bác sĩ điều trị */}
        <div className="rounded-2xl bg-white border border-dental-border p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
            <span className="text-xs font-bold text-gray-700">Bác sĩ điều trị</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {loading ? <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" /> : kpi.treatingDoctors}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Role BAC_SI</p>
        </div>

        {/* Card 3: Chủ phòng khám */}
        <div className="rounded-2xl bg-white border border-dental-border p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
            <span className="text-xs font-bold text-gray-700">Chủ phòng khám</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {loading ? <Loader2 className="h-8 w-8 animate-spin text-[#F59E0B]" /> : kpi.ownerDoctors}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Role CHU_PHONG_KHAM</p>
        </div>
      </div>

      {/* 3. Main Box: Danh sách Bác sĩ */}
      <div className="rounded-3xl bg-white border border-dental-border shadow-xs p-5 sm:p-6 space-y-4">
        {/* Title & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Danh sách Bác sĩ</h2>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã hoặc họ tên Bác sĩ..."
                className="w-full sm:w-64 pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:outline-hidden focus:ring-2 focus:ring-[#169C89] focus:bg-white transition-all"
              />
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:outline-hidden focus:ring-2 focus:ring-[#169C89] text-gray-700 font-medium"
            >
              <option value="ALL">Trạng thái: Tất cả</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="LOCKED">Đã khóa</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-bold">
                <th className="py-3 px-3">Mã Bác sĩ</th>
                <th className="py-3 px-3">Họ tên</th>
                <th className="py-3 px-3">Vai trò</th>
                <th className="py-3 px-3">Trạng thái</th>
                <th className="py-3 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <Loader2 className="h-6 w-6 animate-spin text-[#169C89] mx-auto mb-2" />
                    <span>Đang tải danh sách bác sĩ...</span>
                  </td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Không tìm thấy Bác sĩ nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => {
                  const isOwner = doc.maBacSi.includes('CHU');
                  const isLocked = doc.trangThaiTaiKhoan === 'BI_KHOA';

                  return (
                    <tr key={doc.maBacSi} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-gray-800">
                        {doc.maBacSi}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-gray-900">{doc.hoTen}</span>
                        {doc.soChungChi && (
                          <span className="block text-[11px] text-gray-400 font-mono">
                            {doc.soChungChi}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-[11px] text-gray-500 font-medium">
                          {isOwner ? 'CHU_PHONG_KHAM' : 'BAC_SI'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        {isLocked ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            Đã khóa
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Đang hoạt động
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right space-x-2 whitespace-nowrap">
                        {isOwner ? (
                          <span className="inline-block px-3 py-1 rounded-xl text-xs font-medium bg-gray-100 text-gray-500 cursor-not-allowed select-none">
                            Tài khoản quản trị
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => onOpenDoctorDetailModal(doc)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#E8F8F5] text-[#169C89] border border-[#BDE8E0] hover:bg-[#169C89] hover:text-white transition-colors"
                            >
                              Chi tiết
                            </button>
                            <button
                              onClick={() => onOpenToggleStatusModal(doc)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                isLocked
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-600 hover:text-white'
                              }`}
                            >
                              {isLocked ? 'Mở khóa' : 'Khóa'}
                            </button>
                            <button
                              onClick={() => onOpenResetPasswordModal(doc)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                              title="Cấp lại mật khẩu"
                            >
                              <KeyRound className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer note */}
      <div className="pt-4 text-center">
        <span className="text-xs text-gray-400 font-medium">
          Hệ thống Quản lý Bác sĩ Nha Khoa Nụ Cười Xanh • Tài khoản Quản trị được bảo vệ tối cao
        </span>
      </div>
    </div>
  );
};
