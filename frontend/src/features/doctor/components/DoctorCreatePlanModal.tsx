import React, { useState, useEffect } from 'react';
import { X, ClipboardList, BookOpen, Loader2, Plus, AlertCircle } from 'lucide-react';
import type { LoTrinhMauResponse, LoTrinhDieuTriResponse } from '@/types/doctor';
import { doctorService } from '@/services/doctor.service';

interface DoctorCreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    maBenhNhan: string;
    hoTenBenhNhan: string;
  } | null;
  templatePlans: LoTrinhMauResponse[];
  onSuccess?: (created: LoTrinhDieuTriResponse) => void;
}

export const DoctorCreatePlanModal: React.FC<DoctorCreatePlanModalProps> = ({
  isOpen,
  onClose,
  patient,
  templatePlans,
  onSuccess,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [planName, setPlanName] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (templatePlans.length > 0 && !selectedTemplateId) {
        setSelectedTemplateId(templatePlans[0].maLoTrinh);
        setPlanName(templatePlans[0].tenLoTrinh);
      }
      setNote('');
      setSubmitError(null);
    }
  }, [isOpen, templatePlans, selectedTemplateId]);

  if (!isOpen || !patient) return null;

  const selectedTemplate = templatePlans.find(t => t.maLoTrinh === selectedTemplateId);

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const tmpl = templatePlans.find(t => t.maLoTrinh === id);
    if (tmpl) {
      setPlanName(tmpl.tenLoTrinh);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedTemplateId || !planName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const created = await doctorService.createTreatmentPlan({
        maBenhNhan: patient.maBenhNhan,
        maLoTrinhMau: selectedTemplateId,
        tenLoTrinh: planName.trim(),
        ghiChu: note.trim() || undefined,
      });

      if (onSuccess) {
        onSuccess(created);
      }
      onClose();
    } catch (err: any) {
      console.error('Lỗi khi tạo lộ trình điều trị:', err);
      setSubmitError(err.message || 'Không thể tạo lộ trình điều trị. Vui lòng kiểm tra lại quyền phân công.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-plan-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#E8F8F5] text-[#169C89] border border-[#BCE5DC] flex items-center justify-center shrink-0">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#169C89] uppercase">
                TẠO LỘ TRÌNH ĐIỀU TRỊ
              </span>
              <h3 id="create-plan-title" className="text-base font-bold text-slate-800 leading-tight">
                Khởi tạo cho {patient.hoTenBenhNhan}
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

        {/* Error Alert */}
        {submitError && (
          <div className="mx-5 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span className="font-medium">{submitError}</span>
          </div>
        )}

        {/* Body Form */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Patient Info Card */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Bệnh nhân: </span>
              <span className="font-bold text-slate-800">{patient.hoTenBenhNhan}</span>
            </div>
            <div>
              <span className="text-slate-500">Mã BN: </span>
              <span className="font-mono font-bold text-[#169C89]">{patient.maBenhNhan}</span>
            </div>
          </div>

          {/* Phác đồ mẫu * */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Phác đồ mẫu <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedTemplateId}
                onChange={(e) => handleSelectTemplate(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all disabled:opacity-60"
              >
                {templatePlans.map((tmpl) => (
                  <option key={tmpl.maLoTrinh} value={tmpl.maLoTrinh}>
                    {tmpl.tenLoTrinh} ({tmpl.tongSoBuoi} buổi{tmpl.thoiGianDuKien ? ` • ${tmpl.thoiGianDuKien}` : ''})
                  </option>
                ))}
              </select>
            </div>
            {selectedTemplate && (
              <p className="mt-1.5 text-[11px] text-slate-500 flex items-center gap-1.5">
                <BookOpen className="h-3 w-3 text-[#169C89]" />
                <span>{selectedTemplate.moTa || 'Phác đồ điều trị chuẩn khoa học.'}</span>
              </p>
            )}
          </div>

          {/* Tên lộ trình * */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tên lộ trình <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Nhập tên lộ trình (ví dụ: Niềng răng thẩm mỹ)"
              maxLength={200}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all disabled:opacity-60"
            />
          </div>

          {/* Mô tả / Ghi chú */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Mô tả & Ghi chú lâm sàng
              </label>
              <span className="text-[10px] text-slate-400">
                {note.length} / 500
              </span>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 500))}
              rows={3}
              placeholder="Nhập ghi chú hoặc dặn dò đặc biệt cho bệnh nhân..."
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all resize-none disabled:opacity-60"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!selectedTemplateId || !planName.trim() || isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#169C89] hover:bg-[#0F6F61] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Đang tạo lộ trình...</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>Tạo lộ trình điều trị</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
