import React, { useEffect, useMemo, useState } from 'react';
import { X, ClipboardList, BookOpen, Loader2, Plus, AlertCircle, CalendarClock } from 'lucide-react';
import type {
  BuoiMauResponse,
  LichBuoiDieuTriRequest,
  LichKhamBacSiResponse,
  LoTrinhMauResponse,
  LoTrinhDieuTriResponse,
} from '@/types/doctor';
import { doctorService } from '@/services/doctor.service';

interface DoctorCreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: { maBenhNhan: string; hoTenBenhNhan: string } | null;
  templatePlans: LoTrinhMauResponse[];
  schedule: LichKhamBacSiResponse[];
  onSuccess?: (created: LoTrinhDieuTriResponse) => void;
}

interface ScheduleInput {
  ngayKham: string;
  gioBatDau: string;
  thoiLuongPhut: number;
}

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DoctorCreatePlanModal: React.FC<DoctorCreatePlanModalProps> = ({
  isOpen,
  onClose,
  patient,
  templatePlans,
  schedule,
  onSuccess,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedInitialAppointmentId, setSelectedInitialAppointmentId] = useState('');
  const [planName, setPlanName] = useState('');
  const [note, setNote] = useState('');
  const [templateSessions, setTemplateSessions] = useState<BuoiMauResponse[]>([]);
  const [sessionSchedules, setSessionSchedules] = useState<Record<number, ScheduleInput>>({});
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const completedAppointments = useMemo(() => {
    if (!patient) return [];
    return schedule
      .filter((item) => item.maBenhNhan === patient.maBenhNhan && item.trangThai === 'HOAN_THANH')
      .sort((a, b) => `${b.ngayKham}T${b.gioBatDau}`.localeCompare(`${a.ngayKham}T${a.gioBatDau}`));
  }, [patient, schedule]);

  const initialAppointment = completedAppointments.find(
    (item) => item.maLich === selectedInitialAppointmentId
  );
  const selectedTemplate = templatePlans.find((item) => item.maLoTrinh === selectedTemplateId);
  const futureSessions = templateSessions.filter((item) => item.soThuTu > 1);

  useEffect(() => {
    if (!isOpen) return;
    const firstTemplate = templatePlans[0];
    setSelectedTemplateId(firstTemplate?.maLoTrinh || '');
    setPlanName(firstTemplate?.tenLoTrinh || '');
    setSelectedInitialAppointmentId(completedAppointments[0]?.maLich || '');
    setNote('');
    setSubmitError(null);
  }, [isOpen, patient?.maBenhNhan, templatePlans, completedAppointments]);

  useEffect(() => {
    if (!isOpen || !selectedTemplateId) {
      setTemplateSessions([]);
      return;
    }
    let active = true;
    setLoadingSessions(true);
    doctorService.getTemplatePlanSessions(selectedTemplateId)
      .then((sessions) => {
        if (active) setTemplateSessions([...sessions].sort((a, b) => a.soThuTu - b.soThuTu));
      })
      .catch((error) => {
        if (active) {
          setTemplateSessions([]);
          setSubmitError(error instanceof Error ? error.message : 'Không tải được các buổi mẫu.');
        }
      })
      .finally(() => {
        if (active) setLoadingSessions(false);
      });
    return () => { active = false; };
  }, [isOpen, selectedTemplateId]);

  useEffect(() => {
    if (!initialAppointment || templateSessions.length === 0) {
      setSessionSchedules({});
      return;
    }
    const suggestions: Record<number, ScheduleInput> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let cursor = new Date(`${initialAppointment.ngayKham}T00:00:00`);
    if (cursor < today) cursor = new Date(today);

    for (let index = 1; index < templateSessions.length; index += 1) {
      const previousSession = templateSessions[index - 1];
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() + (previousSession.khoangCachMin ?? 7));
      suggestions[templateSessions[index].soThuTu] = {
        ngayKham: formatDateInput(cursor),
        gioBatDau: initialAppointment.gioBatDau.slice(0, 5),
        thoiLuongPhut: 60,
      };
    }
    setSessionSchedules(suggestions);
  }, [initialAppointment?.maLich, templateSessions]);

  if (!isOpen || !patient) return null;

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const template = templatePlans.find((item) => item.maLoTrinh === id);
    if (template) setPlanName(template.tenLoTrinh);
    setSubmitError(null);
  };

  const updateSchedule = (soThuTu: number, changes: Partial<ScheduleInput>) => {
    setSessionSchedules((current) => ({
      ...current,
      [soThuTu]: { ...current[soThuTu], ...changes },
    }));
  };

  const hasCompleteSchedule = futureSessions.length > 0 && futureSessions.every((session) => {
    const value = sessionSchedules[session.soThuTu];
    return value?.ngayKham && value?.gioBatDau && value.thoiLuongPhut >= 15;
  });

  const handleSubmit = async () => {
    if (!selectedTemplateId || !planName.trim() || !initialAppointment || !hasCompleteSchedule) {
      setSubmitError('Vui lòng chọn buổi khám đầu và nhập đủ ngày, giờ cho các buổi tiếp theo.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const lichCacBuoiTiepTheo: LichBuoiDieuTriRequest[] = futureSessions.map((session) => ({
        soThuTu: session.soThuTu,
        ngayKham: sessionSchedules[session.soThuTu].ngayKham,
        gioBatDau: `${sessionSchedules[session.soThuTu].gioBatDau}:00`,
        thoiLuongPhut: sessionSchedules[session.soThuTu].thoiLuongPhut,
      }));
      const created = await doctorService.createTreatmentPlan({
        maBenhNhan: patient.maBenhNhan,
        maLoTrinhMau: selectedTemplateId,
        tenLoTrinh: planName.trim(),
        ghiChu: note.trim() || undefined,
        maLichKhamBanDau: initialAppointment.maLich,
        lichCacBuoiTiepTheo,
      });
      onSuccess?.(created);
      onClose();
    } catch (error: any) {
      setSubmitError(error?.response?.data?.message || error?.message
        || 'Không thể tạo lộ trình và lịch khám. Vui lòng kiểm tra trùng lịch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[94vh]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#E8F8F5] text-[#169C89] border border-[#BCE5DC] flex items-center justify-center">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#169C89] uppercase">LẬP LỘ TRÌNH VÀ LỊCH KHÁM</span>
              <h3 className="text-base font-bold text-slate-800">{patient.hoTenBenhNhan}</h3>
            </div>
          </div>
          <button onClick={onClose} disabled={isSubmitting} className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100" aria-label="Đóng">
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitError && (
          <div className="mx-5 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" /><span>{submitError}</span>
          </div>
        )}

        <div className="p-5 overflow-y-auto space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Buổi khám đầu đã hoàn thành *</label>
              <select value={selectedInitialAppointmentId}
                onChange={(event) => setSelectedInitialAppointmentId(event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white">
                <option value="">Chọn ca khám...</option>
                {completedAppointments.map((item) => (
                  <option key={item.maLich} value={item.maLich}>
                    {item.ngayKham} • {item.gioBatDau.slice(0, 5)} • {item.tenPhong}
                  </option>
                ))}
              </select>
              {completedAppointments.length === 0 && (
                <p className="mt-1.5 text-[11px] text-rose-600">Bệnh nhân chưa có ca khám hoàn thành với bác sĩ.</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Phác đồ mẫu *</label>
              <select value={selectedTemplateId} onChange={(event) => handleSelectTemplate(event.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white">
                {templatePlans.map((template) => (
                  <option key={template.maLoTrinh} value={template.maLoTrinh}>
                    {template.tenLoTrinh} ({template.tongSoBuoi} buổi)
                  </option>
                ))}
              </select>
              {selectedTemplate && (
                <p className="mt-1.5 text-[11px] text-slate-500 flex gap-1.5"><BookOpen className="h-3 w-3" />{selectedTemplate.moTa}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tên lộ trình *</label>
              <input value={planName} onChange={(event) => setPlanName(event.target.value)} maxLength={200}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Ghi chú cho bệnh nhân</label>
              <input value={note} onChange={(event) => setNote(event.target.value.slice(0, 500))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs" />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CalendarClock className="h-4 w-4 text-[#169C89]" />Ngày giờ các buổi tiếp theo
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 mb-2">Dùng cùng bác sĩ và phòng của buổi đầu; hệ thống tự kiểm tra trùng lịch.</p>

            {loadingSessions ? (
              <div className="py-8 text-center"><Loader2 className="h-5 w-5 animate-spin text-[#169C89] mx-auto" /></div>
            ) : (
              <div className="space-y-2.5">
                {futureSessions.map((session) => {
                  const value = sessionSchedules[session.soThuTu];
                  return (
                    <div key={session.maBuoi} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="sm:col-span-5">
                        <div className="text-[10px] font-bold text-[#169C89]">BUỔI {session.soThuTu}</div>
                        <div className="text-xs font-bold text-slate-800">{session.tenBuoi}</div>
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] text-slate-500 mb-1">Ngày khám *</label>
                        <input type="date" value={value?.ngayKham || ''}
                          onChange={(event) => updateSchedule(session.soThuTu, { ngayKham: event.target.value })}
                          className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-slate-500 mb-1">Giờ *</label>
                        <input type="time" value={value?.gioBatDau || ''}
                          onChange={(event) => updateSchedule(session.soThuTu, { gioBatDau: event.target.value })}
                          className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-slate-500 mb-1">Số phút *</label>
                        <input type="number" min={15} max={480} step={15} value={value?.thoiLuongPhut || 60}
                          onChange={(event) => updateSchedule(session.soThuTu, { thoiLuongPhut: Number(event.target.value) })}
                          className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs bg-white" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <button onClick={onClose} disabled={isSubmitting} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Hủy</button>
          <button onClick={handleSubmit}
            disabled={!initialAppointment || !selectedTemplateId || !planName.trim() || !hasCompleteSchedule || isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#169C89] hover:bg-[#0F6F61] text-white text-xs font-bold disabled:opacity-50">
            {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            {isSubmitting ? 'Đang tạo lịch...' : 'Tạo lộ trình và gửi thông báo'}
          </button>
        </div>
      </div>
    </div>
  );
};
