import { apiClient } from './api-client';
import type {
  YeuCauDatLichResponse,
  PhanCongRequest,
  KetQuaPhanCongResponse,
  TuChoiRequest,
  BacSiQuanLyResponse,
  BenhNhanQuanLyResponse,
  TaiKhoanQuanLyResponse,
  TaoTaiKhoanBacSiRequest,
  CapNhatTaiKhoanRequest,
  CapNhatTrangThaiTaiKhoanRequest,
  OwnerKPISummary,
  VaiTroNguoiDung,
  TrangThaiTaiKhoan
} from '@/types/owner';

export const ownerService = {
  /**
   * Lấy danh sách toàn bộ yêu cầu đặt lịch phòng khám
   * Endpoint: GET /api/v1/quan-ly/yeu-cau-dat-lich
   */
  async getAppointmentRequests(): Promise<YeuCauDatLichResponse[]> {
    const response = await apiClient.get<YeuCauDatLichResponse[]>('/quan-ly/yeu-cau-dat-lich');
    return response.data || [];
  },

  /**
   * Phân công ca khám cho yêu cầu đặt lịch
   * Endpoint: POST /api/v1/phan-cong
   */
  async assignAppointment(payload: PhanCongRequest): Promise<KetQuaPhanCongResponse> {
    const response = await apiClient.post<KetQuaPhanCongResponse>('/phan-cong', payload);
    return response.data;
  },

  /**
   * Từ chối yêu cầu đặt lịch kèm lý do
   * Endpoint: POST /api/v1/phan-cong/tu-choi
   */
  async rejectAppointment(payload: TuChoiRequest): Promise<string> {
    const response = await apiClient.post<string>('/phan-cong/tu-choi', payload);
    return response.data;
  },

  /**
   * Lấy danh sách toàn bộ hồ sơ bác sĩ
   * Endpoint: GET /api/v1/quan-ly/bac-si
   */
  async getDoctors(): Promise<BacSiQuanLyResponse[]> {
    const response = await apiClient.get<BacSiQuanLyResponse[]>('/quan-ly/bac-si');
    return response.data || [];
  },

  /**
   * Xem chi tiết một bác sĩ theo mã
   * Endpoint: GET /api/v1/quan-ly/bac-si/{maBacSi}
   */
  async getDoctorDetail(maBacSi: string): Promise<BacSiQuanLyResponse> {
    if (!maBacSi) throw new Error('Mã bác sĩ không được để trống.');
    const response = await apiClient.get<BacSiQuanLyResponse>(
      `/quan-ly/bac-si/${encodeURIComponent(maBacSi)}`
    );
    return response.data;
  },

  /**
   * Lấy danh sách toàn bộ hồ sơ bệnh nhân
   * Endpoint: GET /api/v1/quan-ly/benh-nhan
   */
  async getPatients(): Promise<BenhNhanQuanLyResponse[]> {
    const response = await apiClient.get<BenhNhanQuanLyResponse[]>('/quan-ly/benh-nhan');
    return response.data || [];
  },

  /**
   * Xem chi tiết một bệnh nhân theo mã
   * Endpoint: GET /api/v1/quan-ly/benh-nhan/{maBenhNhan}
   */
  async getPatientDetail(maBenhNhan: string): Promise<BenhNhanQuanLyResponse> {
    if (!maBenhNhan) throw new Error('Mã bệnh nhân không được để trống.');
    const response = await apiClient.get<BenhNhanQuanLyResponse>(
      `/quan-ly/benh-nhan/${encodeURIComponent(maBenhNhan)}`
    );
    return response.data;
  },

  /**
   * Lấy danh sách toàn bộ tài khoản hệ thống (hỗ trợ lọc theo vai trò và trạng thái)
   * Endpoint: GET /api/v1/tai-khoan
   */
  async getAccounts(
    vaiTro?: VaiTroNguoiDung,
    trangThai?: TrangThaiTaiKhoan
  ): Promise<TaiKhoanQuanLyResponse[]> {
    const params: Record<string, string> = {};
    if (vaiTro) params.vaiTro = vaiTro;
    if (trangThai) params.trangThai = trangThai;

    const response = await apiClient.get<TaiKhoanQuanLyResponse[]>('/tai-khoan', { params });
    return response.data || [];
  },

  /**
   * Xem chi tiết một tài khoản theo mã
   * Endpoint: GET /api/v1/tai-khoan/{maTaiKhoan}
   */
  async getAccountDetail(maTaiKhoan: string): Promise<TaiKhoanQuanLyResponse> {
    if (!maTaiKhoan) throw new Error('Mã tài khoản không được để trống.');
    const response = await apiClient.get<TaiKhoanQuanLyResponse>(
      `/tai-khoan/${encodeURIComponent(maTaiKhoan)}`
    );
    return response.data;
  },

  /**
   * Tạo tài khoản bác sĩ mới kèm hồ sơ bác sĩ
   * Endpoint: POST /api/v1/tai-khoan/bac-si
   */
  async createDoctorAccount(payload: TaoTaiKhoanBacSiRequest): Promise<TaiKhoanQuanLyResponse> {
    const response = await apiClient.post<TaiKhoanQuanLyResponse>('/tai-khoan/bac-si', payload);
    return response.data;
  },

  /**
   * Cập nhật thông tin đăng nhập tài khoản (tên đăng nhập / mật khẩu mới)
   * Endpoint: PUT /api/v1/tai-khoan/{maTaiKhoan}
   */
  async updateAccount(
    maTaiKhoan: string,
    payload: CapNhatTaiKhoanRequest
  ): Promise<TaiKhoanQuanLyResponse> {
    if (!maTaiKhoan) throw new Error('Mã tài khoản không được để trống.');
    const response = await apiClient.put<TaiKhoanQuanLyResponse>(
      `/tai-khoan/${encodeURIComponent(maTaiKhoan)}`,
      payload
    );
    return response.data;
  },

  /**
   * Khóa hoặc kích hoạt tài khoản
   * Endpoint: PATCH /api/v1/tai-khoan/{maTaiKhoan}/trang-thai
   */
  async updateAccountStatus(
    maTaiKhoan: string,
    dangHoatDong: boolean
  ): Promise<TaiKhoanQuanLyResponse> {
    if (!maTaiKhoan) throw new Error('Mã tài khoản không được để trống.');
    const payload: CapNhatTrangThaiTaiKhoanRequest = { dangHoatDong };
    const response = await apiClient.patch<TaiKhoanQuanLyResponse>(
      `/tai-khoan/${encodeURIComponent(maTaiKhoan)}/trang-thai`,
      payload
    );
    return response.data;
  },

  /**
   * Xóa mềm tài khoản (chuyển sang trạng thái bị khóa)
   * Endpoint: DELETE /api/v1/tai-khoan/{maTaiKhoan}
   */
  async softDeleteAccount(maTaiKhoan: string): Promise<void> {
    if (!maTaiKhoan) throw new Error('Mã tài khoản không được để trống.');
    await apiClient.delete(`/tai-khoan/${encodeURIComponent(maTaiKhoan)}`);
  },

  /**
   * Tính toán các chỉ số KPI thống kê từ dữ liệu thực tế cho Owner Dashboard
   */
  calculateKPISummary(
    doctors: BacSiQuanLyResponse[],
    patients: BenhNhanQuanLyResponse[],
    accounts: TaiKhoanQuanLyResponse[],
    requests: YeuCauDatLichResponse[]
  ): OwnerKPISummary {
    const totalDoctors = doctors.length;
    const activeDoctors = doctors.filter((d) => d.dangLamViec).length;

    // Đếm bác sĩ điều trị (role BAC_SI) và chủ phòng khám (role CHU_PHONG_KHAM)
    const ownerDoctors = accounts.filter((a) => a.vaiTro === 'CHU_PHONG_KHAM').length;
    const treatingDoctors = accounts.filter((a) => a.vaiTro === 'BAC_SI').length;

    const totalPatients = patients.length;
    const pendingAppointments = requests.filter((r) => r.trangThai === 'CHO_PHAN_CONG').length;
    const totalAccounts = accounts.length;

    return {
      totalDoctors,
      activeDoctors,
      treatingDoctors,
      ownerDoctors,
      totalPatients,
      pendingAppointments,
      totalAccounts,
    };
  },
};
