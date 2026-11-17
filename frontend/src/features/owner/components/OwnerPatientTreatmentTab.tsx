import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  FileText,
  Calendar,
  Loader2,
  ChevronRight,
  ClipboardList,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type {
  BenhNhanQuanLyResponse,
  LoTrinhDieuTriResponse,
  BuoiDieuTriResponse
} from '@/types/owner';
import {
  TRANG_THAI_BUOI_MAP,
  TRANG_THAI_LO_TRINH_MAP
} from '@/types/owner';

interface OwnerPatientTreatmentTabProps {
  patients: BenhNhanQuanLyResponse[];
  selectedPatient: BenhNhanQuanLyResponse | null;
  onSelectPatient: (patient: BenhNhanQuanLyResponse) => void;
  loadingPatients: boolean;
  patientPlans: LoTrinhDieuTriResponse[];
  selectedPlan: LoTrinhDieuTriResponse | null;
  onSelectPlan: (plan: LoTrinhDieuTriResponse) => void;
  loadingPlans: boolean;
  sessions: BuoiDieuTriResponse[];
  loadingSessions: boolean;
  onOpenCreatePlan: () => void;
  onOpenAddSession: () => void;
  onOpenEditSession: (session: BuoiDieuTriResponse) => void;
  onOpenSkipSession: (session: BuoiDieuTriResponse) => void;
  onOpenSessionDetail: (session: BuoiDieuTriResponse) => void;
}

export const OwnerPatientTreatmentTab: React.FC<OwnerPatientTreatmentTabProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  loadingPatients,
  patientPlans,
  selectedPlan,
  onSelectPlan,
  loadingPlans,
  sessions,
  loadingSessions,
  onOpenCreatePlan,
  onOpenAddSession,
  onOpenEditSession,
  onOpenSkipSession,
  onOpenSessionDetail,
}) => {
  const [patientSearch, setPatientSearch] = useState<string>('');

  // Filter patients by search term
  const filteredPatients = useMemo(() => {
    const q = patientSearch.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.hoTen.toLowerCase().includes(q) ||
        p.maBenhNhan.toLowerCase().includes(q) ||
        (p.soDienThoai && p.soDienThoai.includes(q))
    );
  }, [patients, patientSearch]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* ======================================================== */}
      {/* CỘT 1: Danh sách bệnh nhân (3 cột lg)                     */}
      {/* ======================================================== */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 space-y-3.5">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Danh sách bệnh nhân</h2>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Chọn một bệnh nhân để xem lộ trình
          </p>
        </div>

        {/* Ô tìm kiếm bệnh nhân */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
            placeholder="Tìm theo tên, mã BN, số điện thoại"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89] transition-all"
          />
        </div>

        {/* Danh sách bệnh nhân */}
        {loadingPatients ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#169C89]" />
            <span className="text-xs">Đang tải bệnh nhân...</span>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            Không tìm thấy bệnh nhân nào.
          </div>
        ) : (
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredPatients.map((p) => {
              const isSelected = selectedPatient?.maBenhNhan === p.maBenhNhan;
              const initials = p.hoTen
                ? p.hoTen.split(' ').map((n) => n[0]).slice(-2).join('').toUpperCase()
                : 'BN';

              return (
                <div
                  key={p.maBenhNhan}
                  onClick={() => onSelectPatient(p)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2.5 ${isSelected
                      ? 'border-[#169C89] bg-[#E8F8F5]/60 shadow-xs text-[#0D6E60]'
                      : 'border-gray-200/70 bg-white hover:border-[#169C89]/40 hover:bg-gray-50/60'
                    }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isSelected
                          ? 'bg-[#169C89]/20 text-[#0D6E60]'
                          : 'bg-teal-50 text-[#169C89]'
                        }`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h3
                        className={`text-xs font-bold truncate ${isSelected ? 'text-[#0D6E60]' : 'text-gray-900'
                          }`}
                      >
                        {p.hoTen}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-mono truncate">
                        {p.maBenhNhan} · {p.soDienThoai}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-[#169C89] translate-x-0.5' : 'text-gray-300'
                      }`}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-2 border-t border-gray-100 text-center">
          <span className="text-[11px] text-gray-500 font-medium">
            Tổng số: {filteredPatients.length} bệnh nhân
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CỘT 2: Lộ trình điều trị (4 cột lg)                       */}
      {/* ======================================================== */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 space-y-4">
        {/* Thẻ bệnh nhân đang chọn */}
        {selectedPatient ? (
          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-200/70 text-[#0D6E60] font-extrabold text-xs flex items-center justify-center shrink-0">
              BN
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {selectedPatient.hoTen}
              </h3>
              <p className="text-xs text-gray-500 font-mono truncate">
                Mã BN: {selectedPatient.maBenhNhan} · {selectedPatient.soDienThoai}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/60 text-xs text-gray-500">
            Chưa chọn bệnh nhân
          </div>
        )}

        {/* Tiêu đề nhóm & Nút Lập lộ trình mới */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-sm font-bold text-gray-900">Lộ trình điều trị</h2>
          <Button
            type="button"
            size="sm"
            onClick={onOpenCreatePlan}
            disabled={!selectedPatient}
            className="bg-[#169C89] hover:bg-[#138575] text-white text-xs font-semibold px-3 py-1.5 h-auto rounded-xl shadow-xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Lập lộ trình mới</span>
          </Button>
        </div>

        {/* Danh sách lộ trình hoặc Empty State */}
        {loadingPlans ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#169C89]" />
            <span className="text-xs font-medium">Đang tải danh sách lộ trình...</span>
          </div>
        ) : patientPlans.length === 0 ? (
          /* EMPTY STATE CỘT 2: KHỚP 100% ẢNH 1 */
          <div className="py-16 px-4 text-center space-y-3 border border-dashed border-gray-200 rounded-2xl bg-[#F8FAFC]">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#169C89]">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-900">
                Chưa có lộ trình điều trị
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                Bệnh nhân này chưa được tạo lộ trình. Có thể bắt đầu từ một phác đồ mẫu.
              </p>
            </div>
          </div>
        ) : (
          /* DANH SÁCH LỘ TRÌNH KHI CÓ DỮ LIỆU */
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {patientPlans.map((plan) => {
              const isSelected = selectedPlan?.maLoTrinhDieuTri === plan.maLoTrinhDieuTri;
              const statusCfg = TRANG_THAI_LO_TRINH_MAP[plan.trangThai] || {
                label: plan.trangThai,
                badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
              };
              const pct =
                plan.tongSoBuoi > 0
                  ? Math.round((plan.soBuoiHoanThanh / plan.tongSoBuoi) * 100)
                  : 0;

              return (
                <div
                  key={plan.maLoTrinhDieuTri}
                  onClick={() => onSelectPlan(plan)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 ${isSelected
                      ? 'border-[#169C89] bg-[#E8F8F5]/40 shadow-xs ring-1 ring-[#169C89]/30'
                      : 'border-gray-200/80 bg-white hover:border-[#169C89]/40 hover:bg-gray-50/50'
                    }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {plan.tenLoTrinh}
                      </h4>
                      <p className="text-[11px] font-mono text-gray-400 uppercase mt-0.5">
                        Mẫu: {plan.maLoTrinhMau}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${statusCfg.badgeClass}`}
                    >
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Tiến độ thanh phần trăm */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                      <span>Tiến độ</span>
                      <span className="text-[#169C89]">
                        {plan.soBuoiHoanThanh}/{plan.tongSoBuoi} buổi ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#169C89] transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1 border-t border-gray-100">
                    <span>
                      Tạo ngày: {new Date(plan.thoiGianTao).toLocaleDateString('vi-VN')}
                    </span>
                    {plan.soBuoiDaBo > 0 && (
                      <span className="text-rose-600 font-medium">
                        Đã bỏ: {plan.soBuoiDaBo} buổi
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CỘT 3: Tiến độ & các buổi điều trị (5 cột lg)             */}
      {/* ======================================================== */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-sm font-bold text-gray-900">
            Tiến độ & các buổi điều trị
          </h2>
          {selectedPlan && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenAddSession}
              className="text-xs px-2.5 py-1 h-auto font-semibold text-[#169C89] border-teal-200 hover:bg-[#E8F8F5]"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Thêm buổi
            </Button>
          )}
        </div>

        {/* Trạng thái chưa chọn lộ trình hoặc không có lộ trình (EMPTY STATE CỘT 3 - KHỚP 100% ẢNH 1) */}
        {!selectedPlan || patientPlans.length === 0 ? (
          <div className="py-20 px-6 text-center space-y-4">
            {/* Rounded light green icon box */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#E8F8F5] border border-[#BDE8E0] flex items-center justify-center text-[#169C89]">
              <FileText className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-gray-900">
                Chọn lộ trình để xem tiến độ
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                Timeline, trạng thái từng buổi và liên kết lịch khám sẽ xuất hiện tại đây.
              </p>
            </div>

            <div className="pt-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                Vui lòng chọn hoặc lập lộ trình điều trị ở cột bên
              </span>
            </div>
          </div>
        ) : (
          /* TIMELINE CHI TIẾT KHI CÓ LỘ TRÌNH ĐƯỢC CHỌN */
          <div className="space-y-4">
            {/* Header tóm tắt lộ trình đang xem */}
            <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900">
                  {selectedPlan.tenLoTrinh}
                </span>
                <span className="text-xs font-bold text-[#169C89]">
                  {selectedPlan.soBuoiHoanThanh}/{selectedPlan.tongSoBuoi} buổi
                </span>
              </div>
              {selectedPlan.ghiChu && (
                <p className="text-xs text-gray-600 italic">
                  &ldquo;{selectedPlan.ghiChu}&rdquo;
                </p>
              )}
            </div>

            {/* Danh sách các buổi dạng Timeline dọc */}
            {loadingSessions ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin text-[#169C89]" />
                <span className="text-xs font-medium">Đang tải timeline các buổi...</span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 border border-dashed rounded-xl">
                Lộ trình này chưa có buổi điều trị nào.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {sessions.map((session) => {
                  const statusCfg = TRANG_THAI_BUOI_MAP[session.trangThai] || {
                    label: session.trangThai,
                    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
                  };
                  const canEditOrSkip = session.trangThai === 'CHUA_LEN_LICH';

                  return (
                    <div
                      key={session.maBuoiDieuTri}
                      className="p-3.5 rounded-xl border border-gray-200/80 bg-white hover:border-[#169C89]/30 hover:shadow-xs transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-[#169C89]/10 text-[#0D6E60] font-bold text-xs flex items-center justify-center shrink-0">
                            {session.soThuTu}
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {session.tenBuoi}
                          </h4>
                          {session.buoiBoSung && (
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.2 rounded-md">
                              Bổ sung
                            </span>
                          )}
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${statusCfg.badgeClass}`}
                        >
                          {statusCfg.label}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed pl-8.5">
                        {session.noiDung}
                      </p>

                      {/* Thông tin lịch khám liên kết nếu có */}
                      {session.maLichKham && (
                        <div className="pl-8.5 text-[11px] text-blue-700 flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>Liên kết lịch khám: {session.maLichKham}</span>
                        </div>
                      )}

                      {/* Lý do bỏ nếu có */}
                      {session.lyDoBo && (
                        <div className="pl-8.5 text-[11px] text-rose-600 italic">
                          Lý do bỏ: {session.lyDoBo}
                        </div>
                      )}

                      {/* Thao tác từng buổi */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-1.5 pl-8.5">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => onOpenSessionDetail(session)}
                          className="text-[11px] px-2.5 py-1 h-auto font-medium text-gray-600 hover:text-[#169C89] hover:bg-[#E8F8F5]"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Chi tiết
                        </Button>

                        {canEditOrSkip && (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onOpenEditSession(session)}
                              className="text-[11px] px-2.5 py-1 h-auto font-medium text-teal-700 border-teal-200 hover:bg-teal-50"
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Sửa
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onOpenSkipSession(session)}
                              className="text-[11px] px-2.5 py-1 h-auto font-medium text-rose-600 border-rose-200 hover:bg-rose-50"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Bỏ buổi
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};