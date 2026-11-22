import React from 'react';
import {
  X,
  FileText,
  AlertCircle,
  Link2,
  Info,
} from 'lucide-react';
import type { BuoiMauResponse, BuoiDieuTriResponse } from '@/types/owner';
import { TRANG_THAI_BUOI_MAP } from '@/types/owner';

interface OwnerTreatmentSessionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateSession?: BuoiMauResponse | null;
  patientSession?: BuoiDieuTriResponse | null;
}

export const OwnerTreatmentSessionDetailModal: React.FC<OwnerTreatmentSessionDetailModalProps> = ({
  isOpen,
  onClose,
  templateSession,
  patientSession,
}) => {
  if (!isOpen) return null;

  const isTemplate = Boolean(templateSession);
  const title = isTemplate
    ? `Buổi ${templateSession?.soThuTu}: ${templateSession?.tenBuoi}`
    : `Buổi ${patientSession?.soThuTu}: ${patientSession?.tenBuoi}`;

  const statusConfig = patientSession?.trangThai
    ? TRANG_THAI_BUOI_MAP[patientSession.trangThai]
    : null;

  const formatKhoangCach = (min?: number | null, max?: number | null) => {
    if (min === null || min === undefined) {
      if (max === null || max === undefined) return 'Theo chỉ định lâm sàng';
      return `Tối đa ${max} ngày`;
    }
    if (max === null || max === undefined) return `Tối thiểu ${min} ngày`;
    if (min === max) return `${min} ngày`;
    return `${min} – ${max} ngày`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5 text-gray-900">
            <div className="p-2 rounded-xl bg-teal-50 text-[#169C89]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">{title}</h2>
                {isTemplate && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                    PHÁC ĐỒ MẪU
                  </span>
                )}
                {patientSession?.buoiBoSung && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                    BỔ SUNG
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {isTemplate
                  ? 'Nội dung và quy trình chuẩn theo phác đồ phòng khám'
                  : 'Hồ sơ phiên điều trị của bệnh nhân'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Trạng thái nếu là buổi của bệnh nhân */}
          {patientSession && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-gray-600 font-medium">Trạng thái buổi khám:</span>
              {statusConfig && (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.badgeClass}`}
                >
                  {statusConfig.label}
                </span>
              )}
            </div>
          )}

          {/* Nếu bị bỏ buổi */}
          {patientSession?.trangThai === 'DA_BO' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span>Buổi này đã bị bỏ qua</span>
              </div>
              <p className="text-[11px] text-red-600 pl-5.5">
                Lý do: <span className="font-semibold">{patientSession.lyDoBo || 'Không có lý do'}</span>
              </p>
            </div>
          )}

          {/* Grid thông tin chung */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1">
              <span className="text-[11px] text-gray-500 font-medium">Thứ tự thực hiện</span>
              <div className="font-bold text-gray-900 text-sm">
                Buổi {isTemplate ? templateSession?.soThuTu : patientSession?.soThuTu}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1">
              <span className="text-[11px] text-gray-500 font-medium">Khoảng cách khuyến nghị</span>
              <div className="font-bold text-gray-900 text-sm">
                {isTemplate
                  ? formatKhoangCach(templateSession?.khoangCachMin, templateSession?.khoangCachMax)
                  : formatKhoangCach(patientSession?.khoangCachMin, patientSession?.khoangCachMax)}
              </div>
            </div>
          </div>

          {/* Nội dung điều trị */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-gray-800">Nội dung & Chỉ định điều trị</h3>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 leading-relaxed text-xs">
              {isTemplate
                ? templateSession?.noiDung || 'Không có mô tả chi tiết.'
                : patientSession?.noiDung || 'Không có mô tả chi tiết.'}
            </div>
          </div>

          {/* Ghi chú thêm nếu có */}
          {((isTemplate && templateSession?.ghiChu) || (!isTemplate && patientSession?.ghiChu)) && (
            <div className="space-y-1.5">
              <h3 className="font-bold text-gray-800">Ghi chú bổ sung</h3>
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-900 text-xs">
                {isTemplate ? templateSession?.ghiChu : patientSession?.ghiChu}
              </div>
            </div>
          )}

          {/* Thông tin lịch khám liên kết (nếu có trong patientSession) */}
          {patientSession && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <h3 className="font-bold text-gray-800 flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-[#169C89]" />
                <span>Liên kết lịch hẹn khám</span>
              </h3>
              {patientSession.maLichKham ? (
                <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-teal-800 font-semibold">
                      Mã lịch: {patientSession.maLichKham}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-200 text-teal-900">
                      ĐÃ LIÊN KẾT
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-2 text-gray-500">
                  <Info className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>Buổi điều trị này chưa được liên kết với lịch hẹn khám nào.</span>
                </div>
              )}
            </div>
          )}

          {/* Footer close */}
          <div className="pt-3 flex items-center justify-end border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};