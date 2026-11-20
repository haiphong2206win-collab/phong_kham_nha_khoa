import React, { useState, useEffect, useCallback } from 'react';
import type { AuthSession } from '@/types/auth';
import type {
  OwnerNavTab,
  YeuCauDatLichResponse,
  BacSiQuanLyResponse,
  BenhNhanQuanLyResponse,
  TaiKhoanQuanLyResponse,
  PhongKhamResponse,
  OwnerKPISummary,
} from '@/types/owner';
import { ownerService } from '@/services/owner.service';
import { OwnerSidebar } from './components/OwnerSidebar';
import { OwnerHeader } from './components/OwnerHeader';
import { OwnerDashboard } from './components/OwnerDashboard';
import { OwnerAppointmentRequests } from './components/OwnerAppointmentRequests';
import { OwnerDoctorManagement } from './components/OwnerDoctorManagement';
import { OwnerAssignModal } from './components/OwnerAssignModal';
import { OwnerRejectModal } from './components/OwnerRejectModal';
import { OwnerDoctorDetailModal } from './components/OwnerDoctorDetailModal';
import { OwnerCreateDoctorModal } from './components/OwnerCreateDoctorModal';
import { OwnerUpdateAccountModal } from './components/OwnerUpdateAccountModal';
import { OwnerPatientManagement } from './components/OwnerPatientManagement';
import { OwnerPatientDetailModal } from './components/OwnerPatientDetailModal';
import { OwnerCreatePatientModal } from './components/OwnerCreatePatientModal';
import { OwnerAccountManagement } from './components/OwnerAccountManagement';
import { OwnerAccountDetailModal } from './components/OwnerAccountDetailModal';
import { OwnerAccountEditModal } from './components/OwnerAccountEditModal';
import { OwnerAccountLockModal } from './components/OwnerAccountLockModal';
import { OwnerAccountDeleteModal } from './components/OwnerAccountDeleteModal';
import { OwnerTreatmentSupervision } from './components/OwnerTreatmentSupervision';
import { OwnerRoomsShifts } from './components/OwnerRoomsShifts';
import { Toast } from '@/components/ui/Toast';

interface OwnerPortalProps {
  session: AuthSession;
  onLogout: () => void;
  onGoToLanding?: () => void;
}

export const OwnerPortal: React.FC<OwnerPortalProps> = ({
  session,
  onLogout,
}) => {
  const [currentTab, setCurrentTab] = useState<OwnerNavTab>('overview');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  // Dữ liệu thực tế từ Backend
  const [requests, setRequests] = useState<YeuCauDatLichResponse[]>([]);
  const [doctors, setDoctors] = useState<BacSiQuanLyResponse[]>([]);
  const [patients, setPatients] = useState<BenhNhanQuanLyResponse[]>([]);
  const [accounts, setAccounts] = useState<TaiKhoanQuanLyResponse[]>([]);
  const [rooms, setRooms] = useState<PhongKhamResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Modals state
  const [assignRequest, setAssignRequest] = useState<YeuCauDatLichResponse | null>(null);
  const [rejectRequest, setRejectRequest] = useState<YeuCauDatLichResponse | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<BacSiQuanLyResponse | null>(null);
  const [isDoctorDetailOpen, setIsDoctorDetailOpen] = useState<boolean>(false);
  const [isCreateDoctorOpen, setIsCreateDoctorOpen] = useState<boolean>(false);
  const [accountModalDoctor, setAccountModalDoctor] = useState<BacSiQuanLyResponse | null>(null);
  const [accountModalMode, setAccountModalMode] = useState<'toggle-status' | 'reset-password'>(
    'toggle-status'
  );
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);

  // Patient modals state (FE-4.3A)
  const [selectedPatient, setSelectedPatient] = useState<BenhNhanQuanLyResponse | null>(null);
  const [isPatientDetailOpen, setIsPatientDetailOpen] = useState<boolean>(false);
  const [isCreatePatientOpen, setIsCreatePatientOpen] = useState<boolean>(false);

  // Account modals state (FE-4.3B)
  const [selectedAccount, setSelectedAccount] = useState<TaiKhoanQuanLyResponse | null>(null);
  const [isAccountDetailOpen, setIsAccountDetailOpen] = useState<boolean>(false);
  const [isAccountEditOpen, setIsAccountEditOpen] = useState<boolean>(false);
  const [isAccountLockOpen, setIsAccountLockOpen] = useState<boolean>(false);
  const [isAccountDeleteOpen, setIsAccountDeleteOpen] = useState<boolean>(false);

  // Tải dữ liệu toàn diện từ các API thật
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reqList, docList, patList, accList, roomList] = await Promise.all([
        ownerService.getAppointmentRequests().catch((e) => {
          console.warn('Lỗi tải yêu cầu đặt lịch:', e);
          return [];
        }),
        ownerService.getDoctors().catch((e) => {
          console.warn('Lỗi tải bác sĩ:', e);
          return [];
        }),
        ownerService.getPatients().catch((e) => {
          console.warn('Lỗi tải bệnh nhân:', e);
          return [];
        }),
        ownerService.getAccounts().catch((e) => {
          console.warn('Lỗi tải tài khoản:', e);
          return [];
        }),
        ownerService.getRooms().catch((e) => {
          console.warn('Lỗi tải phòng khám:', e);
          return [];
        }),
      ]);

      setRequests(reqList);
      setDoctors(docList);
      setPatients(patList);
      setAccounts(accList);
      setRooms(roomList);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải dữ liệu từ máy chủ.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Tính toán chỉ số KPI
  const kpi: OwnerKPISummary = ownerService.calculateKPISummary(
    doctors,
    patients,
    accounts,
    requests
  );

  // Tìm mã Bác sĩ của Chủ phòng khám đang đăng nhập
  const ownerDoc =
    doctors.find((d) => d.tenDangNhap === session.user?.tenDangNhap) ||
    doctors.find((d) => d.maBacSi.includes('CHU')) || { maBacSi: 'BS_CHU_DEMO' };

  const handleActionSuccess = (msg: string) => {
    setToast({ message: msg, type: 'success' });
    fetchAllData();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-[#0F2D2A]">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Sidebar */}
      <OwnerSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onLogout={onLogout}
        session={session}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <OwnerHeader
          currentTab={currentTab}
          session={session}
          onLogout={onLogout}
          onOpenMobileMenu={() => setIsOpenMobile(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'overview' && (
            <OwnerDashboard
              kpi={kpi}
              requests={requests}
              doctors={doctors}
              loading={loading}
              error={error}
              onRefresh={fetchAllData}
              onSelectTab={setCurrentTab}
              onOpenAssignModal={(req) => setAssignRequest(req)}
              onOpenRejectModal={(req) => setRejectRequest(req)}
            />
          )}

          {currentTab === 'appointment-requests' && (
            <OwnerAppointmentRequests
              requests={requests}
              loading={loading}
              onRefresh={fetchAllData}
              onOpenAssignModal={(req) => setAssignRequest(req)}
              onOpenRejectModal={(req) => setRejectRequest(req)}
            />
          )}

          {currentTab === 'doctors' && (
            <OwnerDoctorManagement
              doctors={doctors}
              kpi={kpi}
              loading={loading}
              onRefresh={fetchAllData}
              onOpenCreateDoctorModal={() => setIsCreateDoctorOpen(true)}
              onOpenDoctorDetailModal={(doc) => {
                setSelectedDoctor(doc);
                setIsDoctorDetailOpen(true);
              }}
              onOpenToggleStatusModal={(doc) => {
                setAccountModalDoctor(doc);
                setAccountModalMode('toggle-status');
                setIsAccountModalOpen(true);
              }}
              onOpenResetPasswordModal={(doc) => {
                setAccountModalDoctor(doc);
                setAccountModalMode('reset-password');
                setIsAccountModalOpen(true);
              }}
            />
          )}

          {currentTab === 'patients' && (
            <OwnerPatientManagement
              patients={patients}
              loading={loading}
              onRefresh={fetchAllData}
              onOpenCreatePatientModal={() => setIsCreatePatientOpen(true)}
              onOpenPatientDetailModal={(pat) => {
                setSelectedPatient(pat);
                setIsPatientDetailOpen(true);
              }}
            />
          )}

          {currentTab === 'accounts' && (
            <OwnerAccountManagement
              accounts={accounts}
              loading={loading}
              onRefresh={fetchAllData}
              onOpenCreateDoctorAccount={() => setIsCreateDoctorOpen(true)}
              onOpenCreatePatientAccount={() => setIsCreatePatientOpen(true)}
              onOpenDetail={(acc) => {
                setSelectedAccount(acc);
                setIsAccountDetailOpen(true);
              }}
              onOpenEdit={(acc) => {
                setSelectedAccount(acc);
                setIsAccountEditOpen(true);
              }}
              onOpenLock={(acc) => {
                setSelectedAccount(acc);
                setIsAccountLockOpen(true);
              }}
              onOpenDelete={(acc) => {
                setSelectedAccount(acc);
                setIsAccountDeleteOpen(true);
              }}
              currentUser={session.user}
            />
          )}

          {currentTab === 'treatments' && (
            <OwnerTreatmentSupervision />
          )}

          {currentTab === 'rooms-shifts' && (
            <OwnerRoomsShifts
              doctors={doctors}
              rooms={rooms}
              onRefreshRooms={fetchAllData}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <OwnerAssignModal
        isOpen={Boolean(assignRequest)}
        onClose={() => setAssignRequest(null)}
        request={assignRequest}
        doctors={doctors}
        rooms={rooms}
        currentOwnerDoctorId={ownerDoc.maBacSi}
        onSuccess={handleActionSuccess}
      />

      <OwnerRejectModal
        isOpen={Boolean(rejectRequest)}
        onClose={() => setRejectRequest(null)}
        request={rejectRequest}
        currentOwnerDoctorId={ownerDoc.maBacSi}
        onSuccess={handleActionSuccess}
      />

      <OwnerDoctorDetailModal
        isOpen={isDoctorDetailOpen}
        onClose={() => {
          setIsDoctorDetailOpen(false);
          setSelectedDoctor(null);
        }}
        doctor={selectedDoctor}
      />

      <OwnerCreateDoctorModal
        isOpen={isCreateDoctorOpen}
        onClose={() => setIsCreateDoctorOpen(false)}
        onSuccess={handleActionSuccess}
      />

      <OwnerUpdateAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => {
          setIsAccountModalOpen(false);
          setAccountModalDoctor(null);
        }}
        doctor={accountModalDoctor}
        mode={accountModalMode}
        onSuccess={handleActionSuccess}
      />

      {/* FE-4.3A Modals */}
      <OwnerPatientDetailModal
        isOpen={isPatientDetailOpen}
        onClose={() => {
          setIsPatientDetailOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
      />

      <OwnerCreatePatientModal
        isOpen={isCreatePatientOpen}
        onClose={() => setIsCreatePatientOpen(false)}
        onSuccess={handleActionSuccess}
      />

      {/* FE-4.3B Modals */}
      <OwnerAccountDetailModal
        isOpen={isAccountDetailOpen}
        onClose={() => {
          setIsAccountDetailOpen(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount}
      />

      <OwnerAccountEditModal
        isOpen={isAccountEditOpen}
        onClose={() => {
          setIsAccountEditOpen(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount}
        onSuccess={handleActionSuccess}
      />

      <OwnerAccountLockModal
        isOpen={isAccountLockOpen}
        onClose={() => {
          setIsAccountLockOpen(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount}
        onSuccess={handleActionSuccess}
      />

      <OwnerAccountDeleteModal
        isOpen={isAccountDeleteOpen}
        onClose={() => {
          setIsAccountDeleteOpen(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
};
