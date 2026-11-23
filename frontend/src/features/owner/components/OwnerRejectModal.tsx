import React, { useState } from 'react';
import { X, AlertOctagon, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { YeuCauDatLichResponse, TuChoiRequest } from '@/types/owner';
import { ownerService } from '@/services/owner.service';

interface OwnerRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: YeuCauDatLichResponse | null;
  currentOwnerDoctorId: string;
  onSuccess: (message: string) => void;
}

export const OwnerRejectModal: React.FC<OwnerRejectModalProps> = ({
  isOpen,
  onClose,
  request,
  currentOwnerDoctorId,
  onSuccess,
}) => {
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMessage('Vui lòng nhập lý do từ chối yêu cầu.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const payload: TuChoiRequest = {
        maChuPhongKham: currentOwnerDoctorId || 'BS_CHU_001',
        maYeuCau: request.maYeuCau,
        lyDo: reason.trim(),
      };

      const result = await ownerService.rejectAppointment(payload);
      onSuccess(result || 'Đã từ chối yêu cầu đặt lịch thành công.');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi từ chối yêu cầu.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl bg-white border border-dental-border shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertOctagon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Từ chối Yêu cầu Đặt lịch</h3>
              <p className="text-xs text-gray-500 font-mono">Mã: {request.maYeuCau}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Thông tin bệnh nhân */}
        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1">
          <p className="text-gray-600">
            Bệnh nhân: <span className="font-semibold text-gray-900">{request.tenBenhNhan}</span>
          </p>
          <p className="text-gray-600">
            Ngày yêu cầu: <span className="font-semibold text-gray-900">{request.ngayMongMuon} ({request.caKham})</span>
          </p>
        </div>

        {/* Form lý do */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Lý do từ chối <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do cụ thể gửi đến bệnh nhân (ví dụ: Phòng khám đã kín lịch khám buổi này, vui lòng chọn ngày khác...)"
              rows={3}
              maxLength={250}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-transparent placeholder:text-gray-400 resize-none"
              required
            />
            <p className="text-[11px] text-gray-400 text-right mt-1">{reason.length}/250 ký tự</p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Quay lại
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading || !reason.trim()}
              className="bg-rose-600 hover:bg-rose-700 text-white font-medium"
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
