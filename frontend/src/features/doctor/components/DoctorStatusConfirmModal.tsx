import React from 'react';
import { AlertCircle, CheckCircle, Clock, X, Loader2, ArrowRight } from 'lucide-react';
import type { LichKhamBacSiResponse, TrangThaiDatLich } from '@/types/doctor';
import { TRANG_THAI_LICH_MAP } from '@/types/doctor';

interface DoctorStatusConfirmModalProps {
  isOpen: boolean;
  appointment: LichKhamBacSiResponse | null;
  targetStatus: TrangThaiDatLich | null;
  isSubmitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DoctorStatusConfirmModal: React.FC<DoctorStatusConfirmModalProps> = ({
  isOpen,
  appointment,
  targetStatus,
  isSubmitting,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !appointment || !targetStatus) return null;

  const currentInfo = TRANG_THAI_LICH_MAP[appointment.trangThai];
  const targetInfo = TRANG_THAI_LICH_MAP[targetStatus];

  const getActionTitle = () => {
    switch (targetStatus) {
      case 'DA_DEN':
        return 'Xác nhận bệnh nhân đã đến';
      case 'DANG_KHAM':
        return 'Bắt đầu ca khám điều trị';
      case 'HOAN_THANH':
        return 'Xác nhận hoàn thành ca khám';
      case 'VANG_MAT':
        return 'Ghi nhận bệnh nhân vắng mặt';
      default:
        return 'Cập nhật trạng thái lịch khám';
    }
  };

  const getActionDescription = () => {
    switch (targetStatus) {
      case 'DA_DEN':
        return `Bạn đang xác nhận bệnh nhân ${appointment.hoTenBenhNhan} đã có mặt tại phòng khám và sẵn sàng vào ghế điều trị.`;
      case 'DANG_KHAM':
        return `Bạn đang mời bệnh nhân ${appointment.hoTenBenhNhan} vào phòng ${appointment.tenPhong} để bắt đầu quá trình khám và can thiệp nha khoa.`;
      case 'HOAN_THANH':
        return `Bạn đang xác nhận ca khám cho bệnh nhân ${appointment.hoTenBenhNhan} đã kết thúc. Nếu lịch này liên kết với buổi điều trị, tiến độ sẽ tự động đồng bộ.`;
      case 'VANG_MAT':
        return `Bạn đang ghi nhận bệnh nhân ${appointment.hoTenBenhNhan} đã không đến đúng giờ hẹn. Lịch khám sẽ được chuyển sang trạng thái Vắng mặt.`;
      default:
        return 'Vui lòng xác nhận chuyển trạng thái tiến trình ca khám.';
    }
  };

  const isDestructive = targetStatus === 'VANG_MAT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 pb-4 border-b border-slate-100 flex items-center justify-between ${
          isDestructive ? 'bg-rose-50/60' : 'bg-[#EBF7F4]/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-bold ${
              isDestructive
                ? 'bg-rose-100 text-rose-700'
                : 'bg-teal-100 text-[#169C89]'
            }`}>
              {isDestructive ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
            </div>
            <div>
              <span className={`text-[10px] font-bold tracking-widest uppercase ${
                isDestructive ? 'text-rose-700' : 'text-[#169C89]'
              }`}>
                QUY TRÌNH TIẾP NHẬN BỆNH NHÂN
              </span>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">
                {getActionTitle()}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {getActionDescription()}
          </p>

          {/* State transition comparison */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFA] border border-slate-200/80 flex items-center justify-between">
            <div className="text-center flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Hiện tại
              </span>
              <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${currentInfo?.badgeClass}`}>
                {currentInfo?.label || appointment.trangThai}
              </span>
            </div>

            <ArrowRight className="h-4 w-4 text-slate-400 mx-2 shrink-0" />

            <div className="text-center flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Chuyển thành
              </span>
              <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${targetInfo?.badgeClass}`}>
                {targetInfo?.label || targetStatus}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Thao tác sẽ cập nhật dữ liệu trực tiếp và thông báo đến hệ thống.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/60">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>

          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#169C89] hover:bg-[#0F6F61]'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>Xác nhận thực hiện</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
