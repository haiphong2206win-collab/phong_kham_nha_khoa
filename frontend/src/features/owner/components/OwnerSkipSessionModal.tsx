import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { BuoiDieuTriResponse } from '@/types/owner';
import { ownerService } from '@/services/owner.service';

interface OwnerSkipSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  maLoTrinh: string;
  session: BuoiDieuTriResponse | null;
}

export const OwnerSkipSessionModal: React.FC<OwnerSkipSessionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  maLoTrinh,
  session,
}) => {
  const [lyDoBo, setLyDoBo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLyDoBo('');
      setErrorMessage(null);
    }
  }, [isOpen, session]);

  if (!isOpen || !session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedLyDo = lyDoBo.trim();
    if (!trimmedLyDo) {
      setErrorMessage('Vui lòng nhập lý do bỏ buổi điều trị.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await ownerService.skipTreatmentSession(maLoTrinh, session.maBuoiDieuTri, trimmedLyDo);
      onSuccess(`Đã bỏ qua Buổi ${session.soThuTu}: "${session.tenBuoi}" thành công.`);
      onClose();
    } catch (err: unknown) {
      let msg = 'Không thể bỏ buổi điều trị.';
      if (err && typeof err === 'object') {
        const errorObj = err as {
          response?: { data?: { message?: string } | string };
          message?: string;
        };
        if (typeof errorObj.response?.data === 'string') {
          msg = errorObj.response.data;
        } else if (errorObj.response?.data?.message) {
          msg = errorObj.response.data.message;
        } else if (errorObj.message) {
          msg = errorObj.message;
        }
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FFFBEB]">
          <div className="flex items-center gap-2.5 text-amber-800">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Bỏ qua buổi điều trị</h2>
              <p className="text-xs text-amber-700">Đánh dấu phiên điều trị không thực hiện</p>
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
            <div className="text-[11px] text-gray-500 font-medium">Buổi điều trị sẽ bỏ qua:</div>
            <div className="font-bold text-gray-900 text-xs">
              Buổi {session.soThuTu}: {session.tenBuoi}
            </div>
            <div className="text-[11px] text-gray-500 font-mono">Mã buổi: {session.maBuoiDieuTri}</div>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Bạn có chắc chắn muốn bỏ qua buổi điều trị này không? Buổi sẽ chuyển sang trạng thái{' '}
            <span className="font-bold text-red-600">ĐÃ BỎ</span> và không tính vào các buổi cần thực hiện.
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Lý do bỏ buổi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={lyDoBo}
              onChange={(e) => setLyDoBo(e.target.value)}
              placeholder="Ví dụ: Răng đã lành ổn định theo đánh giá của bác sĩ, bệnh nhân yêu cầu bỏ qua bước này..."
              rows={3}
              required
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? 'Đang xử lý...' : 'Xác nhận bỏ buổi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};