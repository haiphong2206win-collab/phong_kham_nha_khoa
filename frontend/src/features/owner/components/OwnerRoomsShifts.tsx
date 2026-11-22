import React, { useState, useEffect, useCallback } from 'react';
import {
  DoorOpen,
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Loader2,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  UserCheck,
  CalendarCheck2,
  X,
} from 'lucide-react';
import type {
  BacSiQuanLyResponse,
  PhongKhamResponse,
  CaLamViecResponse,
  TaoCaLamViecRequest,
  CapNhatCaLamViecRequest,
  CaKham,
} from '@/types/owner';
import { ownerService } from '@/services/owner.service';

interface OwnerRoomsShiftsProps {
  doctors: BacSiQuanLyResponse[];
  rooms: PhongKhamResponse[];
  onRefreshRooms?: () => void;
}

export const OwnerRoomsShifts: React.FC<OwnerRoomsShiftsProps> = ({
  doctors,
  rooms,
  onRefreshRooms,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'shifts' | 'rooms'>('shifts');

  // Shifts state
  const [shifts, setShifts] = useState<CaLamViecResponse[]>([]);
  const [loadingShifts, setLoadingShifts] = useState<boolean>(true);
  const [shiftError, setShiftError] = useState<string | null>(null);

  // Filters
  const [doctorFilter, setDoctorFilter] = useState<string>('ALL');
  const [sessionFilter, setSessionFilter] = useState<string>('ALL');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingShift, setEditingShift] = useState<CaLamViecResponse | null>(null);
  const [deletingShift, setDeletingShift] = useState<CaLamViecResponse | null>(null);

  // Form states for Create
  const [createDoctor, setCreateDoctor] = useState<string>('');
  const [createDate, setCreateDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [createSession, setCreateSession] = useState<CaKham>('CA_SANG');
  const [createStartTime, setCreateStartTime] = useState<string>('08:00');
  const [createEndTime, setCreateEndTime] = useState<string>('12:00');
  const [createMaxPatients, setCreateMaxPatients] = useState<number>(10);
  const [createActive, setCreateActive] = useState<boolean>(true);
  const [createSubmitting, setCreateSubmitting] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Form states for Edit
  const [editStartTime, setEditStartTime] = useState<string>('');
  const [editEndTime, setEditEndTime] = useState<string>('');
  const [editMaxPatients, setEditMaxPatients] = useState<number>(10);
  const [editActive, setEditActive] = useState<boolean>(true);
  const [editSubmitting, setEditSubmitting] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete modal state
  const [deleteSubmitting, setDeleteSubmitting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch shifts
  const fetchShifts = useCallback(async () => {
    try {
      setLoadingShifts(true);
      setShiftError(null);
      const params: { tuNgay?: string; denNgay?: string; maBacSi?: string } = {};
      if (doctorFilter !== 'ALL') params.maBacSi = doctorFilter;
      if (startDateFilter) params.tuNgay = startDateFilter;
      if (endDateFilter) params.denNgay = endDateFilter;

      const data = await ownerService.getShifts(params);
      setShifts(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải danh sách ca trực.';
      setShiftError(msg);
    } finally {
      setLoadingShifts(false);
    }
  }, [doctorFilter, startDateFilter, endDateFilter]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  // Handle session change in create modal
  const handleSessionChange = (session: CaKham) => {
    setCreateSession(session);
    if (session === 'CA_SANG') {
      setCreateStartTime('08:00');
      setCreateEndTime('12:00');
    } else {
      setCreateStartTime('13:00');
      setCreateEndTime('17:00');
    }
  };

  // Open Edit Modal
  const openEditModal = (shift: CaLamViecResponse) => {
    setEditingShift(shift);
    setEditStartTime(shift.gioBatDau.substring(0, 5));
    setEditEndTime(shift.gioKetThuc.substring(0, 5));
    setEditMaxPatients(shift.soBenhNhanToiDa);
    setEditActive(shift.dangHoatDong);
    setEditError(null);
  };

  // Submit Create
  const handleCreateShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createDoctor) {
      setCreateError('Vui lòng chọn bác sĩ.');
      return;
    }
    if (!createDate) {
      setCreateError('Vui lòng chọn ngày làm việc.');
      return;
    }
    if (!createStartTime || !createEndTime) {
      setCreateError('Vui lòng nhập giờ bắt đầu và kết thúc.');
      return;
    }
    if (createStartTime >= createEndTime) {
      setCreateError('Giờ bắt đầu phải trước giờ kết thúc.');
      return;
    }

    try {
      setCreateSubmitting(true);
      setCreateError(null);

      const payload: TaoCaLamViecRequest = {
        maBacSi: createDoctor,
        ngayLamViec: createDate,
        caKham: createSession,
        gioBatDau: createStartTime.length === 5 ? `${createStartTime}:00` : createStartTime,
        gioKetThuc: createEndTime.length === 5 ? `${createEndTime}:00` : createEndTime,
        soBenhNhanToiDa: Number(createMaxPatients),
        dangHoatDong: createActive,
      };

      await ownerService.createShift(payload);
      setIsCreateModalOpen(false);
      fetchShifts();
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : 'Lỗi khi tạo ca làm việc.';
      if (msg.includes('status code') || msg.includes('Request failed')) {
        msg = 'Không thể tạo ca trực. Vui lòng kiểm tra lại thông tin và thử lại.';
      }
      setCreateError(msg);
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Submit Edit
  const handleEditShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShift) return;
    if (!editStartTime || !editEndTime) {
      setEditError('Vui lòng nhập giờ bắt đầu và kết thúc.');
      return;
    }
    if (editStartTime >= editEndTime) {
      setEditError('Giờ bắt đầu phải trước giờ kết thúc.');
      return;
    }

    try {
      setEditSubmitting(true);
      setEditError(null);

      const payload: CapNhatCaLamViecRequest = {
        gioBatDau: editStartTime.length === 5 ? `${editStartTime}:00` : editStartTime,
        gioKetThuc: editEndTime.length === 5 ? `${editEndTime}:00` : editEndTime,
        soBenhNhanToiDa: Number(editMaxPatients),
        dangHoatDong: editActive,
      };

      await ownerService.updateShift(editingShift.maCa, payload);
      setEditingShift(null);
      fetchShifts();
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : 'Lỗi khi cập nhật ca làm việc.';
      if (msg.includes('status code') || msg.includes('Request failed')) {
        msg = 'Không thể cập nhật ca trực. Vui lòng kiểm tra lại thông tin và thử lại.';
      }
      setEditError(msg);
    } finally {
      setEditSubmitting(false);
    }
  };

  // Submit Delete
  const handleDeleteShift = async () => {
    if (!deletingShift) return;

    try {
      setDeleteSubmitting(true);
      setDeleteError(null);
      await ownerService.deleteShift(deletingShift.maCa);
      setDeletingShift(null);
      fetchShifts();
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : 'Lỗi khi xóa ca làm việc.';
      if (msg.includes('status code') || msg.includes('Request failed')) {
        msg = 'Không thể xóa ca trực. Vui lòng kiểm tra lại trạng thái ca trực.';
      }
      setDeleteError(msg);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Filtered shifts in memory (for session filter)
  const filteredShifts = shifts.filter((s) => {
    if (sessionFilter !== 'ALL' && s.caKham !== sessionFilter) return false;
    return true;
  });

  // Shift Stats
  const totalShifts = filteredShifts.length;
  const morningShifts = filteredShifts.filter((s) => s.caKham === 'CA_SANG').length;
  const afternoonShifts = filteredShifts.filter((s) => s.caKham === 'CA_CHIEU').length;
  const uniqueDoctorsInShifts = new Set(filteredShifts.map((s) => s.maBacSi)).size;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Phòng & Ca trực
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý lịch làm việc của Bác sĩ và giám sát phòng khám phục vụ phân công lịch hẹn.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeSubTab === 'shifts' && (
            <button
              onClick={() => {
                // Pre-populate with first active doctor
                const firstActive = doctors.find((d) => d.dangLamViec);
                if (firstActive) setCreateDoctor(firstActive.maBacSi);
                setCreateError(null);
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#169C89] hover:bg-[#138575] text-white text-sm font-semibold transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm ca trực mới</span>
            </button>
          )}

          <button
            onClick={() => {
              if (activeSubTab === 'shifts') {
                fetchShifts();
              } else if (onRefreshRooms) {
                onRefreshRooms();
              }
            }}
            disabled={loadingShifts}
            className="p-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-600 transition-colors shadow-xs"
            title="Làm mới"
          >
            <RefreshCw className={`h-4 w-4 ${loadingShifts ? 'animate-spin text-[#169C89]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Sub-tab Selection */}
      <div className="flex gap-2 p-1 bg-gray-100/80 rounded-2xl w-fit">
        <button
          onClick={() => setActiveSubTab('shifts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeSubTab === 'shifts'
              ? 'bg-white text-[#063C36] shadow-xs'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <CalendarCheck2 className="h-4 w-4 text-[#169C89]" />
          <span>Ca làm việc Bác sĩ</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-[#169C89] font-mono">
            {shifts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('rooms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeSubTab === 'rooms'
              ? 'bg-white text-[#063C36] shadow-xs'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <DoorOpen className="h-4 w-4 text-[#169C89]" />
          <span>Danh sách Phòng khám</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-[#169C89] font-mono">
            {rooms.length}
          </span>
        </button>
      </div>

      {/* SUB-TAB 1: CA LÀM VIỆC */}
      {activeSubTab === 'shifts' && (
        <div className="space-y-6">
          {/* Shift Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#169C89]">
                <CalendarCheck2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{totalShifts}</div>
                <div className="text-xs text-gray-500">Tổng số ca trực</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{morningShifts}</div>
                <div className="text-xs text-gray-500">Ca sáng (08:00 - 12:00)</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{afternoonShifts}</div>
                <div className="text-xs text-gray-500">Ca chiều (13:00 - 17:00)</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{uniqueDoctorsInShifts}</div>
                <div className="text-xs text-gray-500">Bác sĩ có ca trực</div>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
              <Filter className="h-3.5 w-3.5 text-[#169C89]" />
              <span>Bộ lọc ca làm việc</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Doctor filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Bác sĩ</label>
                <select
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                >
                  <option value="ALL">Tất cả Bác sĩ</option>
                  {doctors.map((d) => (
                    <option key={d.maBacSi} value={d.maBacSi}>
                      {d.hoTen} ({d.maBacSi})
                    </option>
                  ))}
                </select>
              </div>

              {/* Session filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Buổi khám</label>
                <select
                  value={sessionFilter}
                  onChange={(e) => setSessionFilter(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                >
                  <option value="ALL">Tất cả các ca</option>
                  <option value="CA_SANG">Ca sáng</option>
                  <option value="CA_CHIEU">Ca chiều</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Từ ngày</label>
                <input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Đến ngày</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                  />
                  {(doctorFilter !== 'ALL' || sessionFilter !== 'ALL' || startDateFilter || endDateFilter) && (
                    <button
                      onClick={() => {
                        setDoctorFilter('ALL');
                        setSessionFilter('ALL');
                        setStartDateFilter('');
                        setEndDateFilter('');
                      }}
                      className="px-2.5 py-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
                      title="Xóa bộ lọc"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Shift Table / List */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
            {shiftError && (
              <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-700 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{shiftError}</span>
              </div>
            )}

            {loadingShifts ? (
              <div className="p-12 text-center text-gray-400">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#169C89] mb-2" />
                <p className="text-sm">Đang tải danh sách ca trực...</p>
              </div>
            ) : filteredShifts.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800">Không tìm thấy ca trực nào</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  Chưa có ca làm việc nào phù hợp với bộ lọc hiện tại. Nhấn "Thêm ca trực mới" để tạo ca làm việc cho bác sĩ.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Mã ca</th>
                      <th className="px-5 py-3.5">Bác sĩ</th>
                      <th className="px-5 py-3.5">Ngày làm việc</th>
                      <th className="px-5 py-3.5">Buổi & Giờ</th>
                      <th className="px-5 py-3.5 text-center">BN Tối đa</th>
                      <th className="px-5 py-3.5 text-center">Lịch đã xếp</th>
                      <th className="px-5 py-3.5 text-center">Trạng thái</th>
                      <th className="px-5 py-3.5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredShifts.map((shift) => {
                      const isMorning = shift.caKham === 'CA_SANG';
                      return (
                        <tr key={shift.maCa} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-xs font-bold text-[#063C36]">
                            {shift.maCa}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-gray-900">{shift.tenBacSi}</div>
                            <div className="text-xs text-gray-400 font-mono">{shift.maBacSi}</div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-gray-800">
                              {new Date(shift.ngayLamViec).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">{shift.ngayLamViec}</div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                  isMorning
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {isMorning ? 'Sáng' : 'Chiều'}
                              </span>
                              <span className="font-mono text-xs text-gray-600">
                                {shift.gioBatDau.substring(0, 5)} - {shift.gioKetThuc.substring(0, 5)}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-center font-semibold text-gray-700">
                            {shift.soBenhNhanToiDa}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                shift.soLichDaXep > 0
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {shift.soLichDaXep} lịch
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            {shift.dangHoatDong ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Hoạt động</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                                <XCircle className="h-3 w-3" />
                                <span>Tạm nghỉ</span>
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => openEditModal(shift)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-[#169C89] hover:bg-teal-50 transition-colors"
                              title="Chỉnh sửa ca trực"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setDeletingShift(shift);
                                setDeleteError(null);
                              }}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Xóa ca trực"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PHÒNG KHÁM */}
      {activeSubTab === 'rooms' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#169C89]">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Danh mục Phòng khám điều trị</h3>
                <p className="text-xs text-gray-500">
                  Các phòng khám được sử dụng để phân công ghế điều trị khi phê duyệt lịch hẹn.
                </p>
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-[#169C89] bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
              Tổng số: {rooms.length} phòng
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => {
              const isAvailable = room.trangThai === 'TRONG';
              return (
                <div
                  key={room.maPhong}
                  className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#169C89]/40 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#063C36] px-2 py-0.5 rounded-md bg-teal-50 border border-teal-100">
                      {room.maPhong}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {isAvailable ? 'Sẵn sàng' : room.trangThai}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-gray-900">{room.tenPhong}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Trạng thái: <span className="font-medium text-gray-700">{room.trangThai === 'TRONG' ? 'Sẵn sàng đón tiếp' : room.trangThai}</span>
                    </p>
                  </div>

                  {room.ghiChu && (
                    <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 italic">
                      {room.ghiChu}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: TẠO CA TRỰC MỚI */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#169C89]">
                  <Plus className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Tạo ca làm việc cho Bác sĩ</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShift} className="p-6 space-y-4">
              {createError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              {/* Bác sĩ */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Chọn Bác sĩ <span className="text-rose-500">*</span>
                </label>
                <select
                  value={createDoctor}
                  onChange={(e) => setCreateDoctor(e.target.value)}
                  required
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2.5 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctors
                    .filter((d) => d.dangLamViec)
                    .map((d) => (
                      <option key={d.maBacSi} value={d.maBacSi}>
                        {d.hoTen} ({d.maBacSi})
                      </option>
                    ))}
                </select>
              </div>

              {/* Ngày làm việc */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ngày làm việc <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={createDate}
                  onChange={(e) => setCreateDate(e.target.value)}
                  required
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2.5 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                />
              </div>

              {/* Buổi khám */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Buổi làm việc <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSessionChange('CA_SANG')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      createSession === 'CA_SANG'
                        ? 'border-[#169C89] bg-teal-50 text-[#169C89]'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Ca sáng (08:00 - 12:00)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSessionChange('CA_CHIEU')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      createSession === 'CA_CHIEU'
                        ? 'border-[#169C89] bg-teal-50 text-[#169C89]'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Ca chiều (13:00 - 17:00)
                  </button>
                </div>
              </div>

              {/* Giờ bắt đầu / kết thúc */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Giờ bắt đầu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={createStartTime}
                    onChange={(e) => setCreateStartTime(e.target.value)}
                    required
                    className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Giờ kết thúc <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={createEndTime}
                    onChange={(e) => setCreateEndTime(e.target.value)}
                    required
                    className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                  />
                </div>
              </div>

              {/* Số bệnh nhân tối đa */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số bệnh nhân tối đa
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={createMaxPatients}
                  onChange={(e) => setCreateMaxPatients(Number(e.target.value))}
                  required
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                />
              </div>

              {/* Đang hoạt động checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="createActiveCheck"
                  checked={createActive}
                  onChange={(e) => setCreateActive(e.target.checked)}
                  className="rounded text-[#169C89] focus:ring-[#169C89]"
                />
                <label htmlFor="createActiveCheck" className="text-xs font-medium text-gray-700 cursor-pointer">
                  Kích hoạt ca làm việc ngay (cho phép phân công)
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={createSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#169C89] hover:bg-[#138575] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  {createSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Tạo ca trực</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CHỈNH SỬA CA TRỰC */}
      {editingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#169C89]">
                  <Edit2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Chỉnh sửa ca trực</h3>
                  <div className="text-xs text-gray-500 font-mono">Mã ca: {editingShift.maCa}</div>
                </div>
              </div>
              <button
                onClick={() => setEditingShift(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditShift} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {/* Thông tin cố định */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/60 text-xs space-y-1">
                <div>
                  Bác sĩ: <span className="font-bold text-gray-900">{editingShift.tenBacSi}</span> ({editingShift.maBacSi})
                </div>
                <div>
                  Ngày trực: <span className="font-bold text-gray-900">{editingShift.ngayLamViec}</span> ({editingShift.caKham === 'CA_SANG' ? 'Ca sáng' : 'Ca chiều'})
                </div>
                <div>
                  Lịch khám đã xếp:{' '}
                  <span className="font-bold text-[#169C89]">{editingShift.soLichDaXep} lịch</span>
                </div>
              </div>

              {/* Giờ bắt đầu / kết thúc */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Giờ bắt đầu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    required
                    className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Giờ kết thúc <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    required
                    className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                  />
                </div>
              </div>

              {/* Số bệnh nhân tối đa */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số bệnh nhân tối đa
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={editMaxPatients}
                  onChange={(e) => setEditMaxPatients(Number(e.target.value))}
                  required
                  className="w-full text-xs rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
                />
              </div>

              {/* Đang hoạt động checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editActiveCheck"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  className="rounded text-[#169C89] focus:ring-[#169C89]"
                />
                <label htmlFor="editActiveCheck" className="text-xs font-medium text-gray-700 cursor-pointer">
                  Đang hoạt động (cho phép phân công lịch khám)
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingShift(null)}
                  disabled={editSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#169C89] hover:bg-[#138575] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  {editSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: XÁC NHẬN XÓA CA TRỰC */}
      {deletingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-rose-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                  <Trash2 className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Xóa ca làm việc</h3>
              </div>
              <button
                onClick={() => setDeletingShift(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {deleteError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}

              <p className="text-sm text-gray-600">
                Bạn có chắc chắn muốn xóa ca làm việc sau?
              </p>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/60 text-xs space-y-1">
                <div>
                  Mã ca: <span className="font-mono font-bold text-gray-800">{deletingShift.maCa}</span>
                </div>
                <div>
                  Bác sĩ: <span className="font-bold text-gray-900">{deletingShift.tenBacSi}</span> ({deletingShift.maBacSi})
                </div>
                <div>
                  Ngày trực: <span className="font-bold text-gray-900">{deletingShift.ngayLamViec}</span> ({deletingShift.caKham === 'CA_SANG' ? 'Sáng' : 'Chiều'})
                </div>
                <div>
                  Lịch khám đã xếp:{' '}
                  <span className={`font-bold ${deletingShift.soLichDaXep > 0 ? 'text-rose-600' : 'text-gray-700'}`}>
                    {deletingShift.soLichDaXep} lịch
                  </span>
                </div>
              </div>

              {deletingShift.soLichDaXep > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    <strong>Cảnh báo:</strong> Ca trực này đã có lịch khám được xếp. Hệ thống sẽ từ chối xóa ca nếu vẫn còn lịch khám hoạt động!
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeletingShift(null)}
                  disabled={deleteSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleDeleteShift}
                  disabled={deleteSubmitting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  {deleteSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Xóa ca trực</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
