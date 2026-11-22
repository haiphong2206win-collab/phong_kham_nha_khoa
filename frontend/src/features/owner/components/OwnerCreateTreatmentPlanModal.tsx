import React, { useState, useEffect } from 'react';
import { X, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type {
  BenhNhanQuanLyResponse,
  LoTrinhMauResponse,
  TaoLoTrinhDieuTriRequest,
} from '@/types/owner';
import { ownerService } from '@/services/owner.service';

interface OwnerCreateTreatmentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  patients: BenhNhanQuanLyResponse[];
  templates: LoTrinhMauResponse[];
  preselectedPatient?: BenhNhanQuanLyResponse | null;
}

export const OwnerCreateTreatmentPlanModal: React.FC<OwnerCreateTreatmentPlanModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  patients,
  templates,
  preselectedPatient,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedTemplateCode, setSelectedTemplateCode] = useState<string>('');
  const [tenLoTrinh, setTenLoTrinh] = useState<string>('');
  const [ghiChu, setGhiChu] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialPatId = preselectedPatient?.maBenhNhan || (patients.length > 0 ? patients[0].maBenhNhan : '');
      const defaultTpl = templates.length > 0 ? templates[0] : null;
      setSelectedPatientId(initialPatId);
      setSelectedTemplateCode(defaultTpl?.maLoTrinh || '');
      setTenLoTrinh(defaultTpl ? defaultTpl.tenLoTrinh : '');
      setGhiChu('');
      setErrorMessage(null);
    }
  }, [isOpen, preselectedPatient, patients, templates]);

  // Handle template selection change
  const handleTemplateChange = (code: string) => {
    setSelectedTemplateCode(code);
    if (code) {
      const t = templates.find((item) => item.maLoTrinh === code);
      if (t) {
        setTenLoTrinh(t.tenLoTrinh);
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatientId) {
      setErrorMessage('Vui lòng chọn bệnh nhân tiếp nhận.');
      return;
    }

    if (!selectedTemplateCode) {
      setErrorMessage('Vui lòng chọn một phác đồ chuẩn mẫu.');
      return;
    }

    const trimmedTen = tenLoTrinh.trim();
    if (!trimmedTen) {
      setErrorMessage('Tên lộ trình không được để trống.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const payload: TaoLoTrinhDieuTriRequest = {
        maBenhNhan: selectedPatientId,
        maLoTrinhMau: selectedTemplateCode,
        tenLoTrinh: trimmedTen,
        ghiChu: ghiChu.trim() || undefined,
      };

      const result = await ownerService.createTreatmentPlan(payload);
      onSuccess(`Tạo lộ trình điều trị "${result.tenLoTrinh}" thành công!`);
      onClose();
    } catch (err: unknown) {
      let msg = 'Không thể lập lộ trình điều trị.';
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
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Lập lộ trình điều trị mới</h2>
              <p className="text-xs text-gray-500">Khởi tạo lộ trình cho bệnh nhân từ phác đồ chuẩn mẫu</p>
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

          {/* Chọn Bệnh nhân */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Bệnh nhân tiếp nhận <span className="text-red-500">*</span>
            </label>
            {preselectedPatient ? (
              <div className="p-3 bg-teal-50/60 border border-teal-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">{preselectedPatient.hoTen}</div>
                  <div className="text-[11px] text-teal-700 font-mono">Mã BN: {preselectedPatient.maBenhNhan}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#169C89] text-white">
                  Đã chọn
                </span>
              </div>
            ) : (
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] bg-white"
              >
                <option value="">-- Chọn bệnh nhân --</option>
                {patients.map((p) => (
                  <option key={p.maBenhNhan} value={p.maBenhNhan}>
                    {p.hoTen} ({p.maBenhNhan}) - {p.soDienThoai}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Chọn phác đồ mẫu */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Phác đồ chuẩn mẫu <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedTemplateCode}
              onChange={(e) => handleTemplateChange(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] bg-white"
            >
              <option value="">-- Chọn phác đồ mẫu --</option>
              {templates.map((tpl) => (
                <option key={tpl.maLoTrinh} value={tpl.maLoTrinh}>
                  {tpl.tenLoTrinh} ({tpl.tongSoBuoi} buổi{tpl.thoiGianDuKien ? ` · ${tpl.thoiGianDuKien}` : ''})
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-gray-500">
              Các buổi chuẩn của phác đồ mẫu sẽ được tự động sao chép sang lộ trình bệnh nhân.
            </p>
          </div>

          {/* Tên lộ trình */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Tên lộ trình điều trị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={tenLoTrinh}
              onChange={(e) => setTenLoTrinh(e.target.value)}
              placeholder="Ví dụ: Điều trị tủy răng hàm dưới..."
              required
              maxLength={255}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89]"
            />
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Ghi chú lộ trình (tùy chọn)
            </label>
            <textarea
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              placeholder="Chỉ định điều trị, tiền sử cần lưu ý hoặc hướng dẫn theo dõi..."
              rows={3}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] resize-none"
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
              {loading ? 'Đang tạo...' : 'Tạo lộ trình'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};