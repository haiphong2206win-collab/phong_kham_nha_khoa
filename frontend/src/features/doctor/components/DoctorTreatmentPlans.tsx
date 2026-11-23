import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ClipboardList,
  BookOpen,
  User,
  Search,
  RefreshCw,
  Plus,
  ChevronRight,
  ChevronLeft,
  Clock,
  FileText,
  Info,
  Loader2,
  Sparkles,
  ShieldAlert,
  Pencil,
  Ban
} from 'lucide-react';
import type {
  LichKhamBacSiResponse,
  LoTrinhMauResponse,
  BuoiMauResponse,
  LoTrinhDieuTriResponse,
  BuoiDieuTriResponse,
  TreatmentPlanTab
} from '@/types/doctor';
import { TRANG_THAI_LO_TRINH_MAP, TRANG_THAI_BUOI_MAP } from '@/types/doctor';
import { doctorService } from '@/services/doctor.service';
import { DoctorCreatePlanModal } from './DoctorCreatePlanModal';
import { OwnerAddSessionModal } from '@/features/owner/components/OwnerAddSessionModal';
import { OwnerEditSessionModal } from '@/features/owner/components/OwnerEditSessionModal';
import { OwnerSkipSessionModal } from '@/features/owner/components/OwnerSkipSessionModal';

interface DoctorTreatmentPlansProps {
  schedule: LichKhamBacSiResponse[];
  loading?: boolean;
  onRefreshSchedule?: () => void;
  onSelectTab?: (tab: any) => void;
}

export const DoctorTreatmentPlans: React.FC<DoctorTreatmentPlansProps> = ({
  schedule,
  loading: _parentLoading = false,
  onRefreshSchedule,
}) => {
  // Tab state: 'patient-plans' | 'template-plans'
  const [activeTab, setActiveTab] = useState<TreatmentPlanTab>('patient-plans');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Template plans state (LIVE BACKEND DATA)
  const [templatePlans, setTemplatePlans] = useState<LoTrinhMauResponse[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<LoTrinhMauResponse | null>(null);
  const [templateSessions, setTemplateSessions] = useState<BuoiMauResponse[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState<boolean>(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState<boolean>(false);

  // Patient plans state
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientPlans, setPatientPlans] = useState<LoTrinhDieuTriResponse[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<LoTrinhDieuTriResponse | null>(null);
  const [patientPlansLoading, setPatientPlansLoading] = useState<boolean>(false);
  const [patientPlansError, setPatientPlansError] = useState<string | null>(null);

  // Patient sessions state
  const [patientSessions, setPatientSessions] = useState<BuoiDieuTriResponse[]>([]);
  const [patientSessionsLoading, setPatientSessionsLoading] = useState<boolean>(false);
  const [patientSessionsError, setPatientSessionsError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const pageSize = 5;

  // Create plan modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isAddSessionOpen, setIsAddSessionOpen] = useState<boolean>(false);
  const [isEditSessionOpen, setIsEditSessionOpen] = useState<boolean>(false);
  const [isSkipSessionOpen, setIsSkipSessionOpen] = useState<boolean>(false);
  const [actionSession, setActionSession] = useState<BuoiDieuTriResponse | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Test hook to allow QA verification of locked create plan modal
  useEffect(() => {
    const handleTestOpen = () => setIsCreateModalOpen(true);
    window.addEventListener('open_doctor_create_plan_modal', handleTestOpen);
    return () => window.removeEventListener('open_doctor_create_plan_modal', handleTestOpen);
  }, []);

  // 1. Fetch Template Plans (Live API: GET /api/v1/lo-trinh-mau)
  const loadTemplatePlans = useCallback(async () => {
    setTemplatesLoading(true);
    setTemplatesError(null);
    try {
      const data = await doctorService.getTemplatePlans();
      const valid = Array.isArray(data) ? data : [];
      setTemplatePlans(valid);
      setSelectedTemplate((current) => {
        if (valid.length === 0) return null;
        if (!current) return valid[0];
        return valid.find(item => item.maLoTrinh === current.maLoTrinh) ?? valid[0];
      });
    } catch (err: any) {
      console.error('Lỗi khi tải phác đồ mẫu:', err);
      setTemplatesError(err.message || 'Không thể tải danh sách phác đồ mẫu.');
    } finally {
      setTemplatesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplatePlans();
  }, [loadTemplatePlans]);

  // 2. Fetch Template Sessions when a template is selected
  useEffect(() => {
    if (!selectedTemplate) {
      setTemplateSessions([]);
      return;
    }
    let isMounted = true;
    setSessionsLoading(true);

    doctorService.getTemplatePlanSessions(selectedTemplate.maLoTrinh)
      .then((data) => {
        if (!isMounted) return;
        setTemplateSessions(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Lỗi khi tải buổi mẫu:', err);
        setTemplateSessions([]);
      })
      .finally(() => {
        if (isMounted) setSessionsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedTemplate]);

  // 3. Fetch Patient Treatment Plans (GET /api/v1/lo-trinh-dieu-tri/benh-nhan/{maBenhNhan})
  const loadPatientPlans = useCallback(async (patientId: string) => {
    setPatientPlansLoading(true);
    setPatientPlansError(null);
    try {
      const data = await doctorService.getPatientTreatmentPlans(patientId);
      const valid = Array.isArray(data) ? data : [];
      setPatientPlans(valid);
      setSelectedPlan((prev) => {
        if (prev && valid.some(p => p.maLoTrinhDieuTri === prev.maLoTrinhDieuTri)) {
          return valid.find(p => p.maLoTrinhDieuTri === prev.maLoTrinhDieuTri) || null;
        }
        return valid.length > 0 ? valid[0] : null;
      });
    } catch (err: any) {
      console.error('Lỗi khi tải lộ trình bệnh nhân:', err);
      const isForbidden = err?.response?.status === 403 || err?.message?.includes('403');
      setPatientPlansError(
        isForbidden
          ? 'Bác sĩ không có quyền truy cập lộ trình của bệnh nhân này.'
          : (err.message || 'Không thể tải danh sách lộ trình điều trị của bệnh nhân.')
      );
      setPatientPlans([]);
      setSelectedPlan(null);
    } finally {
      setPatientPlansLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      loadPatientPlans(selectedPatientId);
    } else {
      setPatientPlans([]);
      setSelectedPlan(null);
    }
  }, [selectedPatientId, loadPatientPlans]);

  // 4. Fetch Sessions for Selected Plan (GET /api/v1/lo-trinh-dieu-tri/{maLoTrinhDieuTri}/buoi)
  const loadPatientSessions = useCallback(async (planId: string) => {
    setPatientSessionsLoading(true);
    setPatientSessionsError(null);
    try {
      const data = await doctorService.getTreatmentPlanSessions(planId);
      setPatientSessions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Lỗi khi tải buổi điều trị của lộ trình:', err);
      setPatientSessionsError(err.message || 'Không thể tải danh sách buổi điều trị.');
      setPatientSessions([]);
    } finally {
      setPatientSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      loadPatientSessions(selectedPlan.maLoTrinhDieuTri);
    } else {
      setPatientSessions([]);
    }
  }, [selectedPlan, loadPatientSessions]);

  // 5. Unique patients derived safely from Doctor's assigned schedule
  const assignedPatients = useMemo(() => {
    const map = new Map<string, {
      maBenhNhan: string;
      hoTenBenhNhan: string;
      ngaySinhBenhNhan?: string | null;
      gioiTinhBenhNhan?: string | null;
      soDienThoaiBenhNhan?: string | null;
      emailBenhNhan?: string | null;
    }>();

    schedule.forEach((item) => {
      if (item.maBenhNhan && !map.has(item.maBenhNhan)) {
        map.set(item.maBenhNhan, {
          maBenhNhan: item.maBenhNhan,
          hoTenBenhNhan: item.hoTenBenhNhan,
          ngaySinhBenhNhan: item.ngaySinhBenhNhan,
          gioiTinhBenhNhan: item.gioiTinhBenhNhan,
          soDienThoaiBenhNhan: item.soDienThoaiBenhNhan,
          emailBenhNhan: item.emailBenhNhan,
        });
      }
    });

    return Array.from(map.values());
  }, [schedule]);

  // Filter patients by search query
  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return assignedPatients;
    return assignedPatients.filter((p) =>
      p.hoTenBenhNhan.toLowerCase().includes(q) ||
      p.maBenhNhan.toLowerCase().includes(q)
    );
  }, [assignedPatients, searchQuery]);

  // Auto-select first patient if none selected
  useEffect(() => {
    if (assignedPatients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(assignedPatients[0].maBenhNhan);
    }
  }, [assignedPatients, selectedPatientId]);

  const activePatient = useMemo(() => {
    return assignedPatients.find(p => p.maBenhNhan === selectedPatientId) || null;
  }, [assignedPatients, selectedPatientId]);

  // Filter templates by search
  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return templatePlans;
    return templatePlans.filter(t =>
      t.tenLoTrinh.toLowerCase().includes(q) ||
      t.maLoTrinh.toLowerCase().includes(q) ||
      (t.moTa && t.moTa.toLowerCase().includes(q))
    );
  }, [templatePlans, searchQuery]);

  // Filter patient plans by status
  const filteredPatientPlans = useMemo(() => {
    if (statusFilter === 'all') return patientPlans;
    return patientPlans.filter(p => p.trangThai === statusFilter);
  }, [patientPlans, statusFilter]);

  // Helper age calculator
  const calculateAge = (dobStr?: string | null) => {
    if (!dobStr) return 'Chưa có thông tin';
    const birth = new Date(dobStr);
    if (isNaN(birth.getTime())) return 'Chưa có thông tin';
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return `${dobStr} (${age} tuổi)`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#169C89] uppercase tracking-wider mb-1">
            <ClipboardList className="h-4 w-4" />
            <span>KHÔNG GIAN BÁC SĨ • PHÂN HỆ ĐIỀU TRỊ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lộ trình điều trị
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quản lý phác đồ mẫu chuẩn khoa học và theo dõi tiến độ điều trị theo quyền truy cập y tế.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="inline-flex p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 self-start md:self-auto shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('patient-plans')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'patient-plans'
                ? 'bg-[#169C89] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Lộ trình bệnh nhân</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('template-plans')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'template-plans'
                ? 'bg-[#169C89] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Phác đồ mẫu</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">
              {templatePlans.length}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Global Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'patient-plans'
                ? 'Tìm theo tên bệnh nhân, mã bệnh nhân...'
                : 'Tìm kiếm phác đồ (ví dụ: niềng răng, implant, tủy)...'
            }
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'patient-plans' && (
            <>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
              >
                <option value="all">Trạng thái: Tất cả</option>
                <option value="DANG_DIEU_TRI">Đang điều trị</option>
                <option value="HOAN_THANH">Đã hoàn thành</option>
                <option value="CHUA_BAT_DAU">Chưa bắt đầu</option>
                <option value="TAM_DUNG">Tạm dừng</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/20 focus:border-[#169C89] transition-all"
              >
                <option value="all">Răng/điều trị: Tất cả</option>
                <option value="NIENG_RANG">Niềng răng</option>
                <option value="IMPLANT">Implant</option>
                <option value="DIEU_TRI_TUY">Điều trị tủy</option>
              </select>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              if (activeTab === 'template-plans') {
                loadTemplatePlans();
              } else {
                if (selectedPatientId) {
                  loadPatientPlans(selectedPatientId);
                }
                if (onRefreshSchedule) {
                  onRefreshSchedule();
                }
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#169C89] text-xs font-bold transition-all border border-teal-200"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* 3. TAB A: PHÁC ĐỒ MẪU (100% LIVE BACKEND INTEGRATION) */}
      {activeTab === 'template-plans' && (
        <div className="space-y-6">
          {templatesLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-8 w-8 text-[#169C89] animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500">Đang tải danh sách phác đồ mẫu từ hệ thống...</p>
            </div>
          ) : templatesError ? (
            <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-3">
              <ShieldAlert className="h-8 w-8 text-rose-600 mx-auto" />
              <p className="text-sm font-bold text-rose-800">{templatesError}</p>
              <button
                type="button"
                onClick={loadTemplatePlans}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all"
              >
                Thử lại kết nối
              </button>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-100">
              <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">Không tìm thấy phác đồ mẫu phù hợp</h3>
              <p className="text-xs text-slate-400 mt-1">Thử thay đổi từ khóa tìm kiếm</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left List of Templates */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                  <span>DANH MỤC PHÁC ĐỒ CHUẨN</span>
                  <span>{filteredTemplates.length} phác đồ</span>
                </div>

                <div className="space-y-3">
                  {filteredTemplates.map((tmpl) => {
                    const isSelected = selectedTemplate?.maLoTrinh === tmpl.maLoTrinh;
                    return (
                      <div
                        key={tmpl.maLoTrinh}
                        onClick={() => setSelectedTemplate(tmpl)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#F7FCFA] border-[#169C89] shadow-md ring-2 ring-[#169C89]/20'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-[#169C89] border border-emerald-200 flex items-center justify-center shrink-0">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-sm text-slate-900 truncate">
                                {tmpl.tenLoTrinh}
                              </h3>
                              <span className="text-[11px] font-mono font-bold text-[#169C89] bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100">
                                {tmpl.tongSoBuoi} buổi
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {tmpl.moTa || 'Phác đồ điều trị lâm sàng nha khoa.'}
                            </p>
                            <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-slate-400" />
                                <span>{tmpl.thoiGianDuKien || 'Theo chỉ định'}</span>
                              </div>
                              <span className="text-slate-300">•</span>
                              <span className="font-mono text-[10px] text-slate-400">
                                Mã: {tmpl.maLoTrinh}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className={`h-5 w-5 shrink-0 transition-transform ${
                            isSelected ? 'text-[#169C89] translate-x-0.5' : 'text-slate-300'
                          }`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Detail of Selected Template */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                {selectedTemplate ? (
                  <>
                    {/* Header info */}
                    <div className="pb-5 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#169C89] uppercase tracking-wider mb-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>CHI TIẾT PHÁC ĐỒ CHUẨN KHOA HỌC</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {selectedTemplate.tenLoTrinh}
                      </h2>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {selectedTemplate.moTa}
                      </p>

                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Mã phác đồ</span>
                          <p className="font-mono font-bold text-xs text-slate-800 mt-0.5">{selectedTemplate.maLoTrinh}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Tổng số buổi</span>
                          <p className="font-bold text-xs text-[#169C89] mt-0.5">{selectedTemplate.tongSoBuoi} giai đoạn điều trị</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Thời gian dự kiến</span>
                          <p className="font-bold text-xs text-slate-800 mt-0.5">{selectedTemplate.thoiGianDuKien || 'Theo lộ trình'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline of template sessions */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#169C89]" />
                          <span>Quy trình các buổi điều trị mẫu ({templateSessions.length})</span>
                        </h3>
                        <span className="text-[11px] text-slate-400">Được chuẩn hóa y khoa</span>
                      </div>

                      {sessionsLoading ? (
                        <div className="py-12 text-center">
                          <Loader2 className="h-6 w-6 text-[#169C89] animate-spin mx-auto mb-2" />
                          <p className="text-xs text-slate-400">Đang tải các bước điều trị...</p>
                        </div>
                      ) : templateSessions.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                          Chưa có thông tin buổi mẫu
                        </div>
                      ) : (
                        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                          {templateSessions.map((session) => (
                            <div key={session.maBuoi} className="relative group">
                              <div className="absolute -left-6 top-1.5 h-5 w-5 rounded-full bg-teal-50 border-2 border-[#169C89] flex items-center justify-center text-[10px] font-bold text-[#169C89]">
                                {session.soThuTu}
                              </div>
                              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 group-hover:border-teal-300 group-hover:bg-[#F9FCFB] transition-all">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="font-bold text-xs text-slate-800">
                                    Buổi {session.soThuTu}: {session.tenBuoi}
                                  </h4>
                                  {(session.khoangCachMin != null || session.khoangCachMax != null) && (
                                    <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                      Cách buổi trước: {session.khoangCachMin ?? 0} - {session.khoangCachMax ?? 'N/A'} ngày
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                                  {session.noiDung}
                                </p>
                                {session.ghiChu && (
                                  <div className="mt-2 text-[11px] text-amber-700 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60 flex items-start gap-1.5">
                                    <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
                                    <span>{session.ghiChu}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-20 text-center text-slate-400 text-xs">
                    Chọn một phác đồ mẫu để xem chi tiết
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB B: LỘ TRÌNH BỆNH NHÂN (3-COLUMN WORKBENCH) */}
      {activeTab === 'patient-plans' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Danh sách bệnh nhân (col-span-3) */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                DANH SÁCH BỆNH NHÂN ({assignedPatients.length})
              </span>
              <span className="text-[10px] text-slate-400">Được phân công</span>
            </div>

            {assignedPatients.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <User className="h-8 w-8 text-slate-300 mx-auto" />
                <p>Chưa có bệnh nhân nào trong lịch khám được phân công.</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Không tìm thấy bệnh nhân phù hợp
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPatients.slice((page - 1) * pageSize, page * pageSize).map((p) => {
                  const isSelected = selectedPatientId === p.maBenhNhan;
                  return (
                    <div
                      key={p.maBenhNhan}
                      onClick={() => setSelectedPatientId(p.maBenhNhan)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-[#F7FCFA] border-[#169C89] shadow-sm ring-1 ring-[#169C89]/30'
                          : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-[#169C89] text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {p.hoTenBenhNhan.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-800 truncate leading-tight">
                            {p.hoTenBenhNhan}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">
                            {p.maBenhNhan}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${
                        isSelected ? 'text-[#169C89] translate-x-0.5' : 'text-slate-300'
                      }`} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {filteredPatients.length > pageSize && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  className="p-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span>
                  Trang {page} / {Math.ceil(filteredPatients.length / pageSize)}
                </span>
                <button
                  type="button"
                  disabled={page >= Math.ceil(filteredPatients.length / pageSize)}
                  onClick={() => setPage(prev => prev + 1)}
                  className="p-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Column 2: Các lộ trình điều trị của bệnh nhân (col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            {activePatient ? (
              <>
                {/* Patient Summary Header Card */}
                <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-teal-50 text-[#169C89] border border-teal-200 flex items-center justify-center font-bold text-base shrink-0 shadow-inner">
                      {activePatient.hoTenBenhNhan.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-sm text-slate-900 truncate">
                          {activePatient.hoTenBenhNhan}
                        </h2>
                        <span className="font-mono text-[10px] font-bold text-[#169C89] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                          {activePatient.maBenhNhan}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                        <span>{calculateAge(activePatient.ngaySinhBenhNhan)}</span>
                        <span>•</span>
                        <span>{activePatient.gioiTinhBenhNhan === 'NAM' ? 'Nam' : activePatient.gioiTinhBenhNhan === 'NU' ? 'Nữ' : 'Chưa có thông tin'}</span>
                        <span>•</span>
                        <span>{activePatient.soDienThoaiBenhNhan || 'Chưa có SĐT'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Create Plan Button */}
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#169C89] hover:bg-[#0F6F61] text-white text-xs font-bold transition-all shadow-xs shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Tạo lộ trình</span>
                  </button>
                </div>

                {/* Treatment Plans Section Header */}
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    CÁC LỘ TRÌNH ĐIỀU TRỊ ({filteredPatientPlans.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {patientPlans.length} lộ trình tổng cộng
                  </span>
                </div>

                {patientPlansLoading ? (
                  <div className="py-12 text-center bg-white rounded-3xl border border-slate-100">
                    <Loader2 className="h-6 w-6 text-[#169C89] animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Đang tải lộ trình của bệnh nhân...</p>
                  </div>
                ) : patientPlansError ? (
                  <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                    <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Không thể tải lộ trình</p>
                      <p className="text-rose-700 mt-0.5">{patientPlansError}</p>
                    </div>
                  </div>
                ) : filteredPatientPlans.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <ClipboardList className="h-8 w-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Chưa có lộ trình điều trị nào</p>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                      Bệnh nhân chưa có phác đồ điều trị. Nhấn nút <strong>Tạo lộ trình</strong> phía trên để khởi tạo từ phác đồ mẫu.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredPatientPlans.map((plan) => {
                      const isSelected = selectedPlan?.maLoTrinhDieuTri === plan.maLoTrinhDieuTri;
                      const statusInfo = TRANG_THAI_LO_TRINH_MAP[plan.trangThai];
                      return (
                        <div
                          key={plan.maLoTrinhDieuTri}
                          onClick={() => setSelectedPlan(plan)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#F7FCFA] border-[#169C89] shadow-md ring-2 ring-[#169C89]/20'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                                  {plan.tenLoTrinh}
                                </h4>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${statusInfo?.badgeClass || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                  {statusInfo?.label || plan.trangThai}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                                <span className="font-semibold text-[#169C89]">
                                  Tiến độ: {plan.soBuoiHoanThanh}/{plan.tongSoBuoi} buổi
                                </span>
                                {plan.thoiGianTao && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <span>Tạo ngày: {plan.thoiGianTao.slice(0, 10)}</span>
                                  </>
                                )}
                              </div>
                              {plan.ghiChu && (
                                <p className="text-[11px] text-slate-500 italic mt-1.5 truncate">
                                  {plan.ghiChu}
                                </p>
                              )}
                            </div>
                            <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${
                              isSelected ? 'text-[#169C89] translate-x-0.5' : 'text-slate-300'
                            }`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 text-xs">
                Chọn một bệnh nhân từ danh sách bên trái để theo dõi lộ trình
              </div>
            )}
          </div>

          {/* Column 3: Chi tiết lộ trình và danh sách buổi (col-span-4) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                CHI TIẾT LỘ TRÌNH
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400">
                  {selectedPlan ? `${patientSessions.length} buổi` : 'Phân hệ lâm sàng'}
                </span>
                {selectedPlan && (
                  <button
                    type="button"
                    onClick={() => {
                      setActionMessage(null);
                      setIsAddSessionOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#169C89] hover:bg-[#0F6F61] text-white text-[10px] font-bold transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Thêm buổi
                  </button>
                )}
              </div>
            </div>

            {actionMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-800">
                {actionMessage}
              </div>
            )}

            {!selectedPlan ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Chọn một lộ trình điều trị từ danh sách để xem chi tiết các buổi khám
              </div>
            ) : patientSessionsLoading ? (
              <div className="py-12 text-center">
                <Loader2 className="h-6 w-6 text-[#169C89] animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-400">Đang tải các buổi điều trị...</p>
              </div>
            ) : patientSessionsError ? (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                <p className="font-bold">Lỗi tải danh sách buổi</p>
                <p className="text-[11px] mt-0.5">{patientSessionsError}</p>
              </div>
            ) : patientSessions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Lộ trình này chưa có buổi điều trị nào được lập.
              </div>
            ) : (
              <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 max-h-[600px] overflow-y-auto pr-1">
                {patientSessions.map((session) => {
                  const statusInfo = TRANG_THAI_BUOI_MAP[session.trangThai];
                  const isUpcomingScheduledSession = session.trangThai === 'DA_LEN_LICH'
                    && !!session.ngayKham
                    && !!session.gioBatDau
                    && new Date(`${session.ngayKham}T${session.gioBatDau}`).getTime() > Date.now();
                  const canEditSession = session.trangThai === 'CHUA_LEN_LICH'
                    || isUpcomingScheduledSession;
                  return (
                    <div key={session.maBuoiDieuTri} className="relative group">
                      <div className="absolute -left-6 top-1.5 h-5 w-5 rounded-full bg-teal-50 border-2 border-[#169C89] flex items-center justify-center text-[10px] font-bold text-[#169C89]">
                        {session.soThuTu}
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 group-hover:border-teal-300 group-hover:bg-[#F9FCFB] transition-all">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-xs text-slate-800">
                            Buổi {session.soThuTu}: {session.tenBuoi}
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${statusInfo?.badgeClass || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {statusInfo?.label || session.trangThai}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          {session.noiDung}
                        </p>
                        {session.maLichKham && (
                          <div className="mt-2 text-[10px] text-[#0D6E60] bg-teal-50 px-2 py-1 rounded border border-teal-200 inline-block">
                            {session.ngayKham && session.gioBatDau
                              ? `Lịch khám: ${session.ngayKham} • ${session.gioBatDau.slice(0, 5)}–${session.gioKetThuc?.slice(0, 5)}`
                              : `Đã liên kết lịch: ${session.maLichKham.slice(0, 8)}...`}
                            {session.tenPhong ? ` • ${session.tenPhong}` : ''}
                          </div>
                        )}
                        {(session.khoangCachMin != null || session.khoangCachMax != null) && (
                          <div className="mt-1.5 text-[10px] text-slate-400">
                            Khoảng cách khuyến nghị: {session.khoangCachMin ?? 0} - {session.khoangCachMax ?? 'N/A'} ngày
                          </div>
                        )}
                        {session.ghiChu && (
                          <div className="mt-1.5 text-[11px] text-amber-700 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60 flex items-start gap-1.5">
                            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
                            <span>{session.ghiChu}</span>
                          </div>
                        )}
                        {canEditSession && (
                          <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActionMessage(null);
                                setActionSession(session);
                                setIsEditSessionOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-teal-200 text-[#0F6F61] text-[10px] font-bold hover:bg-teal-50 transition-colors"
                            >
                              <Pencil className="h-3 w-3" />
                              Chỉnh sửa
                            </button>
                            {session.trangThai === 'CHUA_LEN_LICH' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActionMessage(null);
                                  setActionSession(session);
                                  setIsSkipSessionOpen(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 text-[10px] font-bold hover:bg-rose-50 transition-colors"
                              >
                                <Ban className="h-3 w-3" />
                                Bỏ buổi
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 text-[11px] text-teal-800 flex items-start gap-2">
              <Info className="h-4 w-4 text-[#169C89] shrink-0 mt-0.5" />
              <span>
                Bác sĩ có thể chuyển sang tab <strong>Phác đồ mẫu</strong> để xem trước quy trình chuẩn của các dịch vụ Niềng răng, Implant, Điều trị tủy.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create Plan Modal */}
      <DoctorCreatePlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        patient={activePatient}
        templatePlans={templatePlans}
        schedule={schedule}
        onSuccess={() => {
          if (selectedPatientId) {
            loadPatientPlans(selectedPatientId);
          }
          onRefreshSchedule?.();
        }}
      />

      {selectedPlan && (
        <OwnerAddSessionModal
          isOpen={isAddSessionOpen}
          onClose={() => setIsAddSessionOpen(false)}
          onSuccess={(message) => {
            setActionMessage(message);
            loadPatientSessions(selectedPlan.maLoTrinhDieuTri);
            loadPatientPlans(selectedPlan.maBenhNhan);
          }}
          maLoTrinh={selectedPlan.maLoTrinhDieuTri}
          nextSoThuTu={
            (patientSessions.length > 0
              ? Math.max(...patientSessions.map((session) => session.soThuTu))
              : 0) + 1
          }
        />
      )}

      {selectedPlan && actionSession && (
        <OwnerEditSessionModal
          isOpen={isEditSessionOpen}
          onClose={() => {
            setIsEditSessionOpen(false);
            setActionSession(null);
          }}
          onSuccess={(message) => {
            setActionMessage(message);
            loadPatientSessions(selectedPlan.maLoTrinhDieuTri);
            onRefreshSchedule?.();
          }}
          maLoTrinh={selectedPlan.maLoTrinhDieuTri}
          session={actionSession}
        />
      )}

      {selectedPlan && actionSession && (
        <OwnerSkipSessionModal
          isOpen={isSkipSessionOpen}
          onClose={() => {
            setIsSkipSessionOpen(false);
            setActionSession(null);
          }}
          onSuccess={(message) => {
            setActionMessage(message);
            loadPatientSessions(selectedPlan.maLoTrinhDieuTri);
            loadPatientPlans(selectedPlan.maBenhNhan);
          }}
          maLoTrinh={selectedPlan.maLoTrinhDieuTri}
          session={actionSession}
        />
      )}
    </div>
  );
};
