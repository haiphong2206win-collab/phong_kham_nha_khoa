import React, { useState, useEffect } from 'react';
import { X, ClipboardList, Loader2, AlertCircle, Link2, Info } from 'lucide-react';
import type {
  LichKhamBacSiResponse,
  LoTrinhDieuTriResponse,
  BuoiDieuTriResponse
} from '@/types/doctor';
import { TRANG_THAI_BUOI_MAP } from '@/types/doctor';
import { doctorService } from '@/services/doctor.service';

interface DoctorLinkSessionModalProps {
  isOpen: boolean;
  appointment: LichKhamBacSiResponse | null;
  onClose: () => void;
  onLinkedSuccess: () => void;
}

export const DoctorLinkSessionModal: React.FC<DoctorLinkSessionModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onLinkedSuccess,
}) => {
  const [plans, setPlans] = useState<LoTrinhDieuTriResponse[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [sessions, setSessions] = useState<BuoiDieuTriResponse[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load treatment plans of patient
  useEffect(() => {
    if (!isOpen || !appointment) {
      setPlans([]);
      setSelectedPlanId('');
      setSessions([]);
      setSelectedSessionId('');
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    doctorService.getPatientTreatmentPlans(appointment.maBenhNhan)
      .then((data) => {
        if (!isMounted) return;
        const validPlans = Array.isArray(data) ? data : [];
        setPlans(validPlans);
        if (validPlans.length > 0) {
          setSelectedPlanId(validPlans[0].maLoTrinhDieuTri);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Lỗi khi tải lộ trình điều trị:', err);
        setError(err.message || 'Không thể tải lộ trình điều trị của bệnh nhân.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, appointment?.maBenhNhan]);

  // Load sessions when plan changes
  useEffect(() => {
    if (!selectedPlanId) {
      setSessions([]);
      setSelectedSessionId('');
      return;
    }

    let isMounted = true;
    setLoading(true);

    doctorService.getTreatmentPlanSessions(selectedPlanId)
      .then((data) => {
        if (!isMounted) return;
        const validSessions = Array.isArray(data) ? data : [];
        setSessions(validSessions);
        // Tự động chọn buổi chưa lên lịch đầu tiên
        const available = validSessions.find(s => s.trangThai === 'CHUA_LEN_LICH' || s.trangThai === 'TAM_HOAN' || s.trangThai === 'LICH_DA_HUY');
        if (available) {
          setSelectedSessionId(available.maBuoiDieuTri);
        } else if (validSessions.length > 0) {
          setSelectedSessionId(validSessions[0].maBuoiDieuTri);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Lỗi khi tải buổi điều trị:', err);
        setError(err.message || 'Không thể tải danh sách buổi điều trị.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedPlanId]);

  if (!isOpen || !appointment) return null;

  const handleConfirmLink = async () => {
    if (!selectedPlanId || !selectedSessionId || !appointment || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await doctorService.linkSessionToAppointment(
        selectedPlanId,
        selectedSessionId,
        appointment.maLich
      );
      onLinkedSuccess();
      onClose();
    } catch (err: any) {
      console.error('Lỗi liên kết buổi điều trị:', err);
      setError(err.message || 'Không thể liên kết buổi điều trị với ca khám này.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSession = sessions.find(s => s.maBuoiDieuTri === selectedSessionId);
  const isLinkable = selectedSession && (
    selectedSession.trangThai === 'CHUA_LEN_LICH' ||
    selectedSession.trangThai === 'TAM_HOAN' ||
    selectedSession.trangThai === 'LICH_DA_HUY'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/60 to-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#E8F8F5] border border-[#BCE5DC] flex items-center justify-center text-[#169C89]">
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#169C89] uppercase">
                LIÊN KẾT BUỔI ĐIỀU TRỊ
              </span>
              <h3 className="text-base font-bold text-slate-800 leading-tight">
                Chọn bước điều trị cho {appointment.hoTenBenhNhan}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>


        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-7 w-7 text-[#169C89] animate-spin" />
              <p className="text-xs text-slate-500">Đang tải phác đồ điều trị của bệnh nhân...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <div className="h-12 w-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ClipboardList className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">Chưa có lộ trình điều trị</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Bệnh nhân này hiện chưa được khởi tạo lộ trình điều trị nào trong hệ thống.
              </p>
            </div>
          ) : (
            <>
              {/* Chọn lộ trình nếu bệnh nhân có nhiều lộ trình */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Lộ trình điều trị của bệnh nhân
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs md:text-sm bg-[#F5F8F7] border border-[#E0EBE8] rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#169C89]/30 text-slate-800 font-semibold"
                >
                  {plans.map((p) => (
                    <option key={p.maLoTrinhDieuTri} value={p.maLoTrinhDieuTri}>
                      {p.tenLoTrinh} ({p.soBuoiHoanThanh}/{p.tongSoBuoi} buổi hoàn thành)
                    </option>
                  ))}
                </select>
              </div>

              {/* Danh sách các buổi trong lộ trình */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Chọn buổi điều trị cần thực hiện trong ca khám này:
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {sessions.map((s) => {
                    const isSelected = selectedSessionId === s.maBuoiDieuTri;
                    const canLink = s.trangThai === 'CHUA_LEN_LICH' || s.trangThai === 'TAM_HOAN' || s.trangThai === 'LICH_DA_HUY';
                    const statusInfo = TRANG_THAI_BUOI_MAP[s.trangThai];

                    return (
                      <div
                        key={s.maBuoiDieuTri}
                        onClick={() => canLink && setSelectedSessionId(s.maBuoiDieuTri)}
                        className={`p-3 rounded-2xl border transition-all ${!canLink
                            ? 'opacity-50 bg-slate-50 border-slate-200 cursor-not-allowed'
                            : isSelected
                              ? 'border-[#169C89] bg-[#E8F8F5]/60 ring-2 ring-[#169C89]/20 cursor-pointer'
                              : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/60 cursor-pointer'
                          }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="h-6 w-6 rounded-lg bg-slate-200/80 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                              {s.soThuTu}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">
                                {s.tenBuoi}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {s.noiDung}
                              </p>
                            </div>
                          </div>

                          <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${statusInfo?.badgeClass}`}>
                            {statusInfo?.label || s.trangThai}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Info Note */}
              <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-200 text-teal-800 text-[11px] flex items-start gap-2">
                <Info className="h-4 w-4 text-[#169C89] shrink-0 mt-0.5" />
                <span>
                  Sau khi liên kết, ca khám này sẽ đại diện cho buổi điều trị được chọn. Khi bác sĩ chuyển trạng thái khám, tiến độ buổi điều trị sẽ tự động được cập nhật.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/60">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            onClick={handleConfirmLink}
            disabled={!selectedPlanId || !selectedSessionId || !isLinkable || isSubmitting}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              isLinkable && !isSubmitting
                ? 'bg-gradient-to-r from-[#169C89] to-[#0D6E60] text-white hover:opacity-95 shadow-md shadow-[#169C89]/20 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Đang liên kết...</span>
              </>
            ) : (
              <>
                <Link2 className="h-3.5 w-3.5" />
                <span>Xác nhận liên kết</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
