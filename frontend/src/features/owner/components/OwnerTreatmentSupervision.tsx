import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw,
} from 'lucide-react';
import type {
  BenhNhanQuanLyResponse,
  LoTrinhMauResponse,
  BuoiMauResponse,
  LoTrinhDieuTriResponse,
  BuoiDieuTriResponse,
  TreatmentSupervisionTab,
} from '@/types/owner';
import { ownerService } from '@/services/owner.service';
import { OwnerTreatmentTemplateTab } from './OwnerTreatmentTemplateTab';
import { OwnerPatientTreatmentTab } from './OwnerPatientTreatmentTab';
import { OwnerCreateTreatmentPlanModal } from './OwnerCreateTreatmentPlanModal';
import { OwnerTreatmentSessionDetailModal } from './OwnerTreatmentSessionDetailModal';
import { OwnerSkipSessionModal } from './OwnerSkipSessionModal';
import { OwnerAddSessionModal } from './OwnerAddSessionModal';
import { OwnerEditSessionModal } from './OwnerEditSessionModal';

export const OwnerTreatmentSupervision: React.FC = () => {
  // Active Tab
  const [activeTab, setActiveTab] = useState<TreatmentSupervisionTab>('patient-plans');

  // Templates Tab State
  const [templates, setTemplates] = useState<LoTrinhMauResponse[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<LoTrinhMauResponse | null>(null);
  const [templateSessions, setTemplateSessions] = useState<BuoiMauResponse[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(false);
  const [loadingTemplateSessions, setLoadingTemplateSessions] = useState<boolean>(false);
  const [errorTemplates, setErrorTemplates] = useState<string | null>(null);

  // Patients Tab State
  const [patients, setPatients] = useState<BenhNhanQuanLyResponse[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<BenhNhanQuanLyResponse | null>(null);
  const [patientPlans, setPatientPlans] = useState<LoTrinhDieuTriResponse[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<LoTrinhDieuTriResponse | null>(null);
  const [planSessions, setPlanSessions] = useState<BuoiDieuTriResponse[]>([]);
  const [loadingPatients, setLoadingPatients] = useState<boolean>(false);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(false);
  const [loadingPlanSessions, setLoadingPlanSessions] = useState<boolean>(false);

  // Modals
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState<boolean>(false);
  const [isAddSessionOpen, setIsAddSessionOpen] = useState<boolean>(false);
  const [isEditSessionOpen, setIsEditSessionOpen] = useState<boolean>(false);
  const [isSkipSessionOpen, setIsSkipSessionOpen] = useState<boolean>(false);
  const [isSessionDetailOpen, setIsSessionDetailOpen] = useState<boolean>(false);

  // Selected session targets
  const [detailTemplateSession, setDetailTemplateSession] = useState<BuoiMauResponse | null>(null);
  const [detailPatientSession, setDetailPatientSession] = useState<BuoiDieuTriResponse | null>(null);
  const [actionPatientSession, setActionPatientSession] = useState<BuoiDieuTriResponse | null>(null);

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // 1. Fetch Templates
  const fetchTemplates = useCallback(async () => {
    setLoadingTemplates(true);
    setErrorTemplates(null);
    try {
      const data = await ownerService.getTemplatePlans();
      setTemplates(data);
      if (data.length > 0 && !selectedTemplate) {
        setSelectedTemplate(data[0]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi nạp danh sách phác đồ mẫu';
      setErrorTemplates(msg);
    } finally {
      setLoadingTemplates(false);
    }
  }, [selectedTemplate]);

  // 2. Fetch Template Sessions when selectedTemplate changes
  useEffect(() => {
    if (!selectedTemplate) return;
    let isCurrent = true;

    const fetchSessions = async () => {
      setLoadingTemplateSessions(true);
      try {
        const sessions = await ownerService.getTemplatePlanSessions(selectedTemplate.maLoTrinh);
        if (isCurrent) {
          setTemplateSessions(sessions);
        }
      } catch (err) {
        console.warn('Lỗi nạp buổi mẫu:', err);
        if (isCurrent) {
          setTemplateSessions([]);
        }
      } finally {
        if (isCurrent) setLoadingTemplateSessions(false);
      }
    };

    fetchSessions();
    return () => {
      isCurrent = false;
    };
  }, [selectedTemplate]);

  // 3. Fetch Patients
  const fetchPatients = useCallback(async () => {
    setLoadingPatients(true);
    try {
      const data = await ownerService.getPatients();
      setPatients(data);
      if (data.length > 0 && !selectedPatient) {
        setSelectedPatient(data[0]);
      }
    } catch (err: unknown) {
      console.warn('Lỗi nạp danh sách bệnh nhân:', err);
    } finally {
      setLoadingPatients(false);
    }
  }, [selectedPatient]);

  // Initial load
  useEffect(() => {
    fetchTemplates();
    fetchPatients();
  }, [fetchTemplates, fetchPatients]);

  // 4. Fetch Treatment Plans when selectedPatient changes
  const fetchPatientPlans = useCallback(async (maBenhNhan: string) => {
    setLoadingPlans(true);
    try {
      const plans = await ownerService.getPatientTreatmentPlans(maBenhNhan);
      setPatientPlans(plans);
      if (plans.length > 0) {
        setSelectedPlan(plans[0]);
      } else {
        setSelectedPlan(null);
        setPlanSessions([]);
      }
    } catch (err) {
      console.warn('Lỗi nạp lộ trình của bệnh nhân:', err);
      setPatientPlans([]);
      setSelectedPlan(null);
      setPlanSessions([]);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientPlans(selectedPatient.maBenhNhan);
    } else {
      setPatientPlans([]);
      setSelectedPlan(null);
      setPlanSessions([]);
    }
  }, [selectedPatient, fetchPatientPlans]);

  // 5. Fetch Plan Sessions when selectedPlan changes
  const fetchPlanSessions = useCallback(async (maLoTrinhDieuTri: string) => {
    setLoadingPlanSessions(true);
    try {
      const sessions = await ownerService.getTreatmentPlanSessions(maLoTrinhDieuTri);
      setPlanSessions(sessions);
    } catch (err) {
      console.warn('Lỗi nạp các buổi điều trị của lộ trình:', err);
      setPlanSessions([]);
    } finally {
      setLoadingPlanSessions(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      fetchPlanSessions(selectedPlan.maLoTrinhDieuTri);
    } else {
      setPlanSessions([]);
    }
  }, [selectedPlan, fetchPlanSessions]);

  // Refresh current view
  const handleRefresh = () => {
    if (activeTab === 'template-plans') {
      fetchTemplates();
      if (selectedTemplate) {
        ownerService.getTemplatePlanSessions(selectedTemplate.maLoTrinh).then(setTemplateSessions);
      }
    } else {
      fetchPatients();
      if (selectedPatient) {
        fetchPatientPlans(selectedPatient.maBenhNhan);
        if (selectedPlan) {
          fetchPlanSessions(selectedPlan.maLoTrinhDieuTri);
        }
      }
    }
    showToast('Đã làm mới dữ liệu!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold animate-in slide-in-from-bottom duration-200 ${
            toast.type === 'success'
              ? 'bg-teal-50 border-teal-200 text-teal-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#169C89]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="p-1 hover:bg-black/5 rounded-lg ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Header & Tab Pill Switcher matching Images */}
      <div className="space-y-4">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Giám sát Điều trị
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Theo dõi phác đồ và lộ trình điều trị trong phòng khám
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200 bg-white"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-teal-50 text-[#169C89] border border-teal-100 uppercase tracking-wide">
              Chủ phòng khám
            </span>
          </div>
        </div>

        {/* Tab Buttons (Lộ trình Bệnh nhân | Phác đồ chuẩn mẫu) */}
        <div className="flex items-center gap-3">
          <div className="grid grid-cols-2 max-w-md w-full bg-gray-100 p-1 rounded-2xl border border-gray-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('patient-plans')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'patient-plans'
                  ? 'bg-[#169C89] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Lộ trình Bệnh nhân
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('template-plans')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'template-plans'
                  ? 'bg-[#169C89] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Phác đồ chuẩn mẫu
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Lộ trình Bệnh nhân */}
      {activeTab === 'patient-plans' && (
        <OwnerPatientTreatmentTab
          patients={patients}
          selectedPatient={selectedPatient}
          onSelectPatient={(p) => setSelectedPatient(p)}
          loadingPatients={loadingPatients}
          patientPlans={patientPlans}
          selectedPlan={selectedPlan}
          onSelectPlan={(plan) => setSelectedPlan(plan)}
          loadingPlans={loadingPlans}
          sessions={planSessions}
          loadingSessions={loadingPlanSessions}
          onOpenCreatePlan={() => setIsCreatePlanOpen(true)}
          onOpenAddSession={() => {
            if (!selectedPlan) {
              showToast('Vui lòng chọn lộ trình điều trị trước!', 'error');
              return;
            }
            setIsAddSessionOpen(true);
          }}
          onOpenEditSession={(s) => {
            setActionPatientSession(s);
            setIsEditSessionOpen(true);
          }}
          onOpenSkipSession={(s) => {
            setActionPatientSession(s);
            setIsSkipSessionOpen(true);
          }}
          onOpenSessionDetail={(s) => {
            setDetailPatientSession(s);
            setDetailTemplateSession(null);
            setIsSessionDetailOpen(true);
          }}
        />
      )}

      {/* Tab 2: Phác đồ chuẩn mẫu */}
      {activeTab === 'template-plans' && (
        <OwnerTreatmentTemplateTab
          templates={templates}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={(t) => setSelectedTemplate(t)}
          sessions={templateSessions}
          loadingTemplates={loadingTemplates}
          loadingSessions={loadingTemplateSessions}
          errorTemplates={errorTemplates}
          onOpenSessionDetail={(s) => {
            setDetailTemplateSession(s);
            setDetailPatientSession(null);
            setIsSessionDetailOpen(true);
          }}
        />
      )}

      {/* Modal: Tạo lộ trình mới */}
      <OwnerCreateTreatmentPlanModal
        isOpen={isCreatePlanOpen}
        onClose={() => setIsCreatePlanOpen(false)}
        onSuccess={(msg) => {
          showToast(msg, 'success');
          if (selectedPatient) {
            fetchPatientPlans(selectedPatient.maBenhNhan);
          }
        }}
        patients={patients}
        templates={templates}
        preselectedPatient={selectedPatient}
      />

      {/* Modal: Thêm buổi điều trị */}
      {selectedPlan && (
        <OwnerAddSessionModal
          isOpen={isAddSessionOpen}
          onClose={() => setIsAddSessionOpen(false)}
          onSuccess={(msg) => {
            showToast(msg, 'success');
            fetchPlanSessions(selectedPlan.maLoTrinhDieuTri);
          }}
          maLoTrinh={selectedPlan.maLoTrinhDieuTri}
          nextSoThuTu={
            (planSessions.length > 0 ? Math.max(...planSessions.map((s) => s.soThuTu)) : 0) + 1
          }
        />
      )}

      {/* Modal: Sửa buổi điều trị */}
      {selectedPlan && actionPatientSession && (
        <OwnerEditSessionModal
          isOpen={isEditSessionOpen}
          onClose={() => {
            setIsEditSessionOpen(false);
            setActionPatientSession(null);
          }}
          onSuccess={(msg) => {
            showToast(msg, 'success');
            fetchPlanSessions(selectedPlan.maLoTrinhDieuTri);
          }}
          maLoTrinh={selectedPlan.maLoTrinhDieuTri}
          session={actionPatientSession}
        />
      )}

      {/* Modal: Bỏ buổi điều trị */}
      {selectedPlan && actionPatientSession && (
        <OwnerSkipSessionModal
          isOpen={isSkipSessionOpen}
          onClose={() => {
            setIsSkipSessionOpen(false);
            setActionPatientSession(null);
          }}
          onSuccess={(msg) => {
            showToast(msg, 'success');
            fetchPlanSessions(selectedPlan.maLoTrinhDieuTri);
          }}
          maLoTrinh={selectedPlan.maLoTrinhDieuTri}
          session={actionPatientSession}
        />
      )}

      {/* Modal: Chi tiết buổi điều trị */}
      <OwnerTreatmentSessionDetailModal
        isOpen={isSessionDetailOpen}
        onClose={() => {
          setIsSessionDetailOpen(false);
          setDetailTemplateSession(null);
          setDetailPatientSession(null);
        }}
        templateSession={detailTemplateSession}
        patientSession={detailPatientSession}
      />
    </div>
  );
};