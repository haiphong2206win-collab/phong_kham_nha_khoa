import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  Stethoscope,
  Lock,
  Search,
  RefreshCw,
  Plus,
  Eye,
  Edit3,
  Trash2,
  MoreVertical,
  ShieldAlert,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { TaiKhoanQuanLyResponse, VaiTroNguoiDung } from '@/types/owner';
import type { AuthSession } from '@/types/auth';

interface OwnerAccountManagementProps {
  accounts: TaiKhoanQuanLyResponse[];
  loading: boolean;
  onRefresh: () => void;
  onOpenCreateDoctorAccount: () => void;
  onOpenCreatePatientAccount: () => void;
  onOpenDetail: (account: TaiKhoanQuanLyResponse) => void;
  onOpenEdit: (account: TaiKhoanQuanLyResponse) => void;
  onOpenLock: (account: TaiKhoanQuanLyResponse) => void;
  onOpenDelete: (account: TaiKhoanQuanLyResponse) => void;
  currentUser?: AuthSession['user'];
}

export const OwnerAccountManagement: React.FC<OwnerAccountManagementProps> = ({
  accounts,
  loading,
  onRefresh,
  onOpenCreateDoctorAccount,
  onOpenCreatePatientAccount,
  onOpenDetail,
  onOpenEdit,
  onOpenLock,
  onOpenDelete,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Create menu dropdown state
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState<boolean>(false);
  const createMenuRef = useRef<HTMLDivElement>(null);

  // Active row action dropdown menu
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) {
        setIsCreateMenuOpen(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real KPIs calculation
  const totalAccounts = accounts.length;
  const doctorAccountsCount = accounts.filter((a) => a.vaiTro === 'BAC_SI').length;
  const patientAccountsCount = accounts.filter((a) => a.vaiTro === 'BENH_NHAN').length;
  const lockedAccountsCount = accounts.filter((a) => a.trangThai === 'BI_KHOA').length;

  // Filter list
  const filteredAccounts = accounts.filter((acc) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      acc.tenDangNhap.toLowerCase().includes(term) ||
      acc.maTaiKhoan.toLowerCase().includes(term) ||
      (acc.hoTen && acc.hoTen.toLowerCase().includes(term)) ||
      (acc.soDienThoai && acc.soDienThoai.toLowerCase().includes(term));

    const matchesRole = roleFilter === 'ALL' || acc.vaiTro === roleFilter;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'DANG_HOAT_DONG' && acc.trangThai === 'DANG_HOAT_DONG') ||
      (statusFilter === 'BI_KHOA' && acc.trangThai === 'BI_KHOA');

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedAccounts = filteredAccounts.slice(
    (validCurrentPage - 1) * pageSize,
    validCurrentPage * pageSize
  );

  const getRoleBadge = (role: VaiTroNguoiDung) => {
    switch (role) {
      case 'CHU_PHONG_KHAM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            CHU_PHONG_KHAM
          </span>
        );
      case 'BAC_SI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-teal-50 text-[#169C89] border border-teal-200">
            BAC_SI
          </span>
        );
      case 'BENH_NHAN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            BENH_NHAN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Quản trị tài khoản
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý tài khoản đăng nhập, phân quyền và bảo mật toàn hệ thống.
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

          {/* "+ Tạo tài khoản" with Dropdown */}
          <div className="relative" ref={createMenuRef}>
            <Button
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className="bg-[#169C89] hover:bg-[#138575] text-white flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo tài khoản</span>
            </Button>

            {isCreateMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setIsCreateMenuOpen(false);
                    onOpenCreatePatientAccount();
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-teal-50 hover:text-[#169C89] flex items-center gap-2.5 transition-colors"
                >
                  <Users className="w-4 h-4 text-[#169C89]" />
                  <span>Tài khoản Bệnh nhân mới</span>
                </button>
                <button
                  onClick={() => {
                    setIsCreateMenuOpen(false);
                    onOpenCreateDoctorAccount();
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-teal-50 hover:text-[#169C89] flex items-center gap-2.5 transition-colors"
                >
                  <Stethoscope className="w-4 h-4 text-[#169C89]" />
                  <span>Tài khoản Bác sĩ mới</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng tài khoản */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Tổng tài khoản
            </span>
            <span className="text-3xl font-extrabold text-gray-900">{totalAccounts}</span>
            <span className="text-[11px] text-gray-400 block">Tất cả tài khoản hệ thống</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Bác sĩ */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Bác sĩ
            </span>
            <span className="text-3xl font-extrabold text-[#169C89]">{doctorAccountsCount}</span>
            <span className="text-[11px] text-gray-400 block">Tài khoản vai trò BAC_SI</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#169C89] flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Bệnh nhân */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Bệnh nhân
            </span>
            <span className="text-3xl font-extrabold text-blue-600">{patientAccountsCount}</span>
            <span className="text-[11px] text-gray-400 block">Tài khoản khách hàng</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Đang khóa */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Đang khóa
            </span>
            <span className="text-3xl font-extrabold text-rose-600">{lockedAccountsCount}</span>
            <span className="text-[11px] text-gray-400 block">Tạm ngừng truy cập</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Lock className="w-6 h-6" />
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
              placeholder="Tìm tên đăng nhập, họ tên, mã TK..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89]"
            />
          </div>

          {/* Role Filter */}
          <div className="sm:w-48">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89]"
            >
              <option value="ALL">Vai trò: Tất cả</option>
              <option value="CHU_PHONG_KHAM">Chủ phòng khám</option>
              <option value="BAC_SI">Bác sĩ</option>
              <option value="BENH_NHAN">Bệnh nhân</option>
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

      {/* 4. Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#169C89]" />
            <span className="text-sm">Đang tải danh sách tài khoản...</span>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="py-16 text-center text-gray-500 space-y-2">
            <Users className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold">Không tìm thấy tài khoản nào</p>
            <p className="text-xs text-gray-400">Hãy thử thay đổi điều kiện tìm kiếm hoặc lọc.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-[#F8FAFC] text-gray-500 uppercase text-[11px] font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4 text-center w-12">#</th>
                  <th className="py-3.5 px-4">Mã TK</th>
                  <th className="py-3.5 px-4">Tên đăng nhập</th>
                  <th className="py-3.5 px-4">Họ và tên</th>
                  <th className="py-3.5 px-4">Vai trò</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-normal">
                {paginatedAccounts.map((acc, idx) => {
                  const globalIdx = (validCurrentPage - 1) * pageSize + idx + 1;
                  const isActive = acc.trangThai === 'DANG_HOAT_DONG';
                  const isOwner = acc.vaiTro === 'CHU_PHONG_KHAM';
                  const isCurrentLoggedUser =
                    currentUser && acc.tenDangNhap === currentUser.tenDangNhap;
                  const isProtected = isOwner || isCurrentLoggedUser;

                  return (
                    <tr
                      key={acc.maTaiKhoan}
                      className="hover:bg-teal-50/20 transition-colors duration-100"
                    >
                      <td className="py-3.5 px-4 text-center font-medium text-gray-400">
                        {globalIdx}
                      </td>

                      {/* Mã TK */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-50 text-gray-700 border border-gray-200 font-mono">
                          {acc.maTaiKhoan}
                        </span>
                      </td>

                      {/* Tên đăng nhập */}
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        @{acc.tenDangNhap}
                      </td>

                      {/* Họ tên */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-gray-800">
                          {acc.hoTen || 'Chưa cập nhật'}
                        </div>
                        {acc.soDienThoai && (
                          <div className="text-[11px] text-gray-400">{acc.soDienThoai}</div>
                        )}
                      </td>

                      {/* Vai trò */}
                      <td className="py-3.5 px-4 whitespace-nowrap">{getRoleBadge(acc.vaiTro)}</td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                          />
                          {isActive ? 'Đang hoạt động' : 'Bị khóa'}
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* Nút Xem chi tiết */}
                          <button
                            onClick={() => onOpenDetail(acc)}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                            title="Xem chi tiết tài khoản"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Nếu là Chủ phòng khám hoặc chính mình -> BẢO VỆ */}
                          {isProtected ? (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-gray-500 text-[11px] font-semibold border border-gray-200 cursor-not-allowed select-none"
                              title="Tài khoản quản trị – Không thể chỉnh sửa, khóa hoặc xóa từ giao diện"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                              <span>Được bảo vệ</span>
                            </span>
                          ) : (
                            /* Menu Thao tác Dropdown cho tài khoản thường */
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setActiveMenuId(
                                    activeMenuId === acc.maTaiKhoan ? null : acc.maTaiKhoan
                                  )
                                }
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                                title="Thao tác"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {activeMenuId === acc.maTaiKhoan && (
                                <div
                                  ref={actionMenuRef}
                                  className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100"
                                >
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onOpenEdit(acc);
                                    }}
                                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-teal-50 hover:text-[#169C89] flex items-center gap-2 transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-[#169C89]" />
                                    <span>Cập nhật tài khoản</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onOpenLock(acc);
                                    }}
                                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 transition-colors"
                                  >
                                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                                    <span>
                                      {acc.trangThai === 'DANG_HOAT_DONG'
                                        ? 'Khóa tài khoản'
                                        : 'Mở khóa tài khoản'}
                                    </span>
                                  </button>

                                  <div className="my-1 border-t border-gray-100" />

                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onOpenDelete(acc);
                                    }}
                                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Xóa tài khoản</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination Footer */}
        {filteredAccounts.length > 0 && (
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
              <span>bản ghi / trang (Tổng số: {filteredAccounts.length} tài khoản)</span>
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
                  className={`w-7 h-7 rounded-lg font-semibold transition-colors ${validCurrentPage === pg
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
