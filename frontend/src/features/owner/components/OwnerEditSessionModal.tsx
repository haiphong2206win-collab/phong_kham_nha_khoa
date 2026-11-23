import React, { useState, useEffect } from 'react';
import { X, Edit2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { BuoiDieuTriResponse, CapNhatBuoiDieuTriRequest } from '@/types/owner';
import { ownerService } from '@/services/owner.service';

interface OwnerEditSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  maLoTrinh: string;
  session: BuoiDieuTriResponse | null;
}

export const OwnerEditSessionModal: React.FC<OwnerEditSessionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  maLoTrinh,
  session,
}) => {
  const [tenBuoi, setTenBuoi] = useState<string>('');
  const [noiDung, setNoiDung] = useState<string>('');
  const [khoangCachMin, setKhoangCachMin] = useState<string>('');
  const [khoangCachMax, setKhoangCachMax] = useState<string>('');
  const [ghiChu, setGhiChu] = useState<string>('');
  const [ngayKham, setNgayKham] = useState<string>('');
  const [gioBatDau, setGioBatDau] = useState<string>('');
  const [thoiLuongPhut, setThoiLuongPhut] = useState<string>('30');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && session) {
      setTenBuoi(session.tenBuoi || '');
      setNoiDung(session.noiDung || '');
      setKhoangCachMin(session.khoangCachMin !== undefined && session.khoangCachMin !== null ? String(session.khoangCachMin) : '');
      setKhoangCachMax(session.khoangCachMax !== undefined && session.khoangCachMax !== null ? String(session.khoangCachMax) : '');
      setGhiChu(session.ghiChu || '');
      setNgayKham(session.ngayKham || '');
      setGioBatDau(session.gioBatDau?.slice(0, 5) || '');
      if (session.gioBatDau && session.gioKetThuc) {
        const [startHour, startMinute] = session.gioBatDau.split(':').map(Number);
        const [endHour, endMinute] = session.gioKetThuc.split(':').map(Number);
        setThoiLuongPhut(String((endHour * 60 + endMinute) - (startHour * 60 + startMinute)));
      } else {
        setThoiLuongPhut('30');
      }
      setErrorMessage(null);
    }
  }, [isOpen, session]);

  if (!isOpen || !session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTen = tenBuoi.trim();
    if (!trimmedTen) {
      setErrorMessage('Tên buổi điều trị không được để trống.');
      return;
    }

    const trimmedNoiDung = noiDung.trim();
    if (!trimmedNoiDung) {
      setErrorMessage('Nội dung điều trị không được để trống.');
      return;
    }

    if (session.trangThai === 'DA_LEN_LICH'
      && (!ngayKham || !gioBatDau || Number(thoiLuongPhut) < 15)) {
      setErrorMessage('Vui lòng nhập đầy đủ ngày, giờ và thời lượng tối thiểu 15 phút.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const payload: CapNhatBuoiDieuTriRequest = {
        tenBuoi: trimmedTen,
        noiDung: trimmedNoiDung,
        khoangCachMin: khoangCachMin ? Number(khoangCachMin) : null,
        khoangCachMax: khoangCachMax ? Number(khoangCachMax) : null,
        ghiChu: ghiChu.trim() || undefined,
        ...(session.trangThai === 'DA_LEN_LICH' ? {
          ngayKham,
          gioBatDau,
          thoiLuongPhut: Number(thoiLuongPhut),
        } : {}),
      };

      const result = await ownerService.updateTreatmentSession(
        maLoTrinh,
        session.maBuoiDieuTri,
        payload
      );
      onSuccess(`Đã cập nhật thông tin Buổi ${result.soThuTu}: "${result.tenBuoi}"!`);
      onClose();
    } catch (err: unknown) {
      let msg = 'Không thể cập nhật buổi điều trị.';
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
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5 text-gray-900">
            <div className="p-2 rounded-xl bg-teal-50 text-[#169C89]">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Chỉnh sửa Buổi {session.soThuTu}
              </h2>
              <p className="text-xs text-gray-500">
                {session.trangThai === 'DA_LEN_LICH'
                  ? 'Cập nhật nội dung và lịch hẹn sắp tới'
                  : 'Cập nhật nội dung và yêu cầu thực hiện'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Tên buổi điều trị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={tenBuoi}
              onChange={(e) => setTenBuoi(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89]"
            />
          </div>

          {session.trangThai === 'DA_LEN_LICH' && (
            <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/60 space-y-3">
              <div>
                <p className="text-xs font-bold text-teal-900">Lịch hẹn sắp tới</p>
                <p className="text-[11px] text-teal-700 mt-0.5">
                  Bệnh nhân sẽ nhận thông báo sau khi bạn lưu thay đổi.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ngày khám</label>
                  <input
                    type="date"
                    value={ngayKham}
                    min={new Date().toLocaleDateString('en-CA')}
                    onChange={(e) => setNgayKham(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Giờ bắt đầu</label>
                  <input
                    type="time"
                    value={gioBatDau}
                    onChange={(e) => setGioBatDau(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Thời lượng (phút)</label>
                  <input
                    type="number"
                    min={15}
                    max={480}
                    step={5}
                    value={thoiLuongPhut}
                    onChange={(e) => setThoiLuongPhut(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89]"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nội dung & Chỉ định điều trị <span className="text-red-500">*</span>
            </label>
            <textarea
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              rows={3}
              required
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Khoảng cách tối thiểu (ngày)
              </label>
              <input
                type="number"
                min={0}
                value={khoangCachMin}
                onChange={(e) => setKhoangCachMin(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Khoảng cách tối đa (ngày)
              </label>
              <input
                type="number"
                min={0}
                value={khoangCachMax}
                onChange={(e) => setKhoangCachMax(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Ghi chú thêm
            </label>
            <input
              type="text"
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89]"
            />
          </div>

          {/* Footer actions */}
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
              className="bg-[#169C89] hover:bg-[#138575] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
