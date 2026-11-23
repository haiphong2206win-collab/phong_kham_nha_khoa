import { apiClient } from './api-client';
import type {
  YeuCauDatLichResponse,
  PhanCongRequest,
  KetQuaPhanCongResponse,
  TuChoiRequest,
  BacSiQuanLyResponse,
  BenhNhanQuanLyResponse,
  PhongKhamResponse,
  TaiKhoanQuanLyResponse,
  TaoTaiKhoanBacSiRequest,
  TaoTaiKhoanBenhNhanRequest,
  CapNhatTaiKhoanRequest,
  CapNhatTrangThaiTaiKhoanRequest,
  OwnerKPISummary,
  VaiTroNguoiDung,
  TrangThaiTaiKhoan,
  LoTrinhMauResponse,
  BuoiMauResponse,
  LoTrinhDieuTriResponse,
  BuoiDieuTriResponse,
  TaoLoTrinhDieuTriRequest,
  ThemBuoiDieuTriRequest,
  CapNhatBuoiDieuTriRequest,
  BoBuoiDieuTriRequest,
  LienKetBuoiVoiLichRequest,
  CaLamViecResponse,
  TaoCaLamViecRequest,
  CapNhatCaLamViecRequest
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
   * Lấy danh sách toàn bộ phòng khám
   * Endpoint: GET /api/v1/quan-ly/phong-kham
   */
  async getRooms(): Promise<PhongKhamResponse[]> {
    const response = await apiClient.get<PhongKhamResponse[]>('/quan-ly/phong-kham');
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
   * Tạo tài khoản bệnh nhân mới kèm hồ sơ bệnh nhân
   * Endpoint: POST /api/v1/tai-khoan/benh-nhan
   */
  async createPatientAccount(payload: TaoTaiKhoanBenhNhanRequest): Promise<TaiKhoanQuanLyResponse> {
    const response = await apiClient.post<TaiKhoanQuanLyResponse>('/tai-khoan/benh-nhan', payload);
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

  /**
   * ========================================================
   * FE-4.4 – GIÁM SÁT ĐIỀU TRỊ (TREATMENT SUPERVISION) APIS
   * ========================================================
   */

  /**
   * Lấy danh sách tất cả lộ trình mẫu (phác đồ mẫu chuẩn)
   * Endpoint: GET /api/v1/lo-trinh-mau
   */
  async getTemplatePlans(): Promise<LoTrinhMauResponse[]> {
    const response = await apiClient.get<LoTrinhMauResponse[]>('/lo-trinh-mau');
    return response.data || [];
  },

  /**
   * Lấy chi tiết một lộ trình mẫu
   * Endpoint: GET /api/v1/lo-trinh-mau/{maLoTrinh}
   */
  async getTemplatePlanDetails(maLoTrinh: string): Promise<LoTrinhMauResponse> {
    const response = await apiClient.get<LoTrinhMauResponse>(`/lo-trinh-mau/${encodeURIComponent(maLoTrinh)}`);
    return response.data;
  },

  /**
   * Lấy danh sách các buổi của lộ trình mẫu
   * Endpoint: GET /api/v1/lo-trinh-mau/{maLoTrinh}/buoi
   */
  async getTemplatePlanSessions(maLoTrinh: string): Promise<BuoiMauResponse[]> {
    if (!maLoTrinh) return [];
    const response = await apiClient.get<BuoiMauResponse[]>(`/lo-trinh-mau/${encodeURIComponent(maLoTrinh)}/buoi`);
    return response.data || [];
  },

  /**
   * Lấy danh sách lộ trình điều trị của bệnh nhân
   * Endpoint: GET /api/v1/lo-trinh-dieu-tri/benh-nhan/{maBenhNhan}
   */
  async getPatientTreatmentPlans(maBenhNhan: string): Promise<LoTrinhDieuTriResponse[]> {
    if (!maBenhNhan) return [];
    const response = await apiClient.get<LoTrinhDieuTriResponse[]>(
      `/lo-trinh-dieu-tri/benh-nhan/${encodeURIComponent(maBenhNhan)}`
    );
    return response.data || [];
  },

  /**
   * Lấy chi tiết thông tin một lộ trình điều trị
   * Endpoint: GET /api/v1/lo-trinh-dieu-tri/{maLoTrinhDieuTri}
   */
  async getTreatmentPlanDetails(maLoTrinh: string): Promise<LoTrinhDieuTriResponse> {
    const response = await apiClient.get<LoTrinhDieuTriResponse>(
      `/lo-trinh-dieu-tri/${encodeURIComponent(maLoTrinh)}`
    );
    return response.data;
  },

  /**
   * Lấy danh sách các buổi điều trị của một lộ trình
   * Endpoint: GET /api/v1/lo-trinh-dieu-tri/{maLoTrinhDieuTri}/buoi
   */
  async getTreatmentPlanSessions(maLoTrinh: string): Promise<BuoiDieuTriResponse[]> {
    if (!maLoTrinh) return [];
    const response = await apiClient.get<BuoiDieuTriResponse[]>(
      `/lo-trinh-dieu-tri/${encodeURIComponent(maLoTrinh)}/buoi`
    );
    return response.data || [];
  },

  /**
   * Tạo lộ trình điều trị mới cho bệnh nhân từ phác đồ mẫu
   * Endpoint: POST /api/v1/lo-trinh-dieu-tri
   */
  async createTreatmentPlan(payload: TaoLoTrinhDieuTriRequest): Promise<LoTrinhDieuTriResponse> {
    const response = await apiClient.post<LoTrinhDieuTriResponse>('/lo-trinh-dieu-tri', payload);
    return response.data;
  },

  /**
   * Thêm buổi điều trị mới vào lộ trình
   * Endpoint: POST /api/v1/lo-trinh-dieu-tri/{maLoTrinh}/buoi
   */
  async addTreatmentSession(
    maLoTrinh: string,
    payload: ThemBuoiDieuTriRequest
  ): Promise<BuoiDieuTriResponse> {
    const response = await apiClient.post<BuoiDieuTriResponse>(
      `/lo-trinh-dieu-tri/${encodeURIComponent(maLoTrinh)}/buoi`,
      payload
    );
    return response.data;
  },

  /**
   * Cập nhật nội dung buổi điều trị; có thể đổi ngày giờ nếu buổi đã lên lịch và còn ở tương lai
   * Endpoint: PUT /api/v1/lo-trinh-dieu-tri/{maLoTrinh}/buoi/{maBuoi}
   */
  async updateTreatmentSession(
    maLoTrinh: string,
    maBuoi: string,
    payload: CapNhatBuoiDieuTriRequest
  ): Promise<BuoiDieuTriResponse> {
    const response = await apiClient.put<BuoiDieuTriResponse>(
      `/lo-trinh-dieu-tri/${encodeURIComponent(maLoTrinh)}/buoi/${encodeURIComponent(maBuoi)}`,
      payload
    );
    return response.data;
  },

  /**
   * Bỏ buổi điều trị (chuyển trạng thái DA_BO, không xóa dữ liệu)
   * Endpoint: PATCH /api/v1/lo-trinh-dieu-tri/{maLoTrinh}/buoi/{maBuoi}/bo
   */
  async skipTreatmentSession(
    maLoTrinh: string,
    maBuoi: string,
    lyDoBo: string
  ): Promise<BuoiDieuTriResponse> {
    const payload: BoBuoiDieuTriRequest = { lyDoBo };
    const response = await apiClient.patch<BuoiDieuTriResponse>(
      `/lo-trinh-dieu-tri/${encodeURIComponent(maLoTrinh)}/buoi/${encodeURIComponent(maBuoi)}/bo`,
      payload
    );
    return response.data;
  },

  /**
   * Liên kết buổi điều trị với lịch khám
   * Endpoint: POST /api/v1/lo-trinh-dieu-tri/{maLoTrinh}/buoi/{maBuoi}/lien-ket-lich
   */
  async linkSessionToAppointment(
    maLoTrinh: string,
    maBuoi: string,
    maLichKham: string
  ): Promise<void> {
    const payload: LienKetBuoiVoiLichRequest = { maLichKham };
    await apiClient.post(
      `/lo-trinh-dieu-tri/${encodeURIComponent(maLoTrinh)}/buoi/${encodeURIComponent(maBuoi)}/lien-ket-lich`,
      payload
    );
  },

  /**
   * Gỡ liên kết lịch khám khỏi buổi điều trị
   * Endpoint: DELETE /api/v1/lo-trinh-dieu-tri/{maLoTrinh}/buoi/{maBuoi}/lich-kham
   */
  async unlinkSessionFromAppointment(maLoTrinh: string, maBuoi: string): Promise<void> {
    await apiClient.delete(
      `/lo-trinh-dieu-tri/${encodeURIComponent(maLoTrinh)}/buoi/${encodeURIComponent(maBuoi)}/lich-kham`
    );
  },

  /**
   * Lấy danh sách ca làm việc của bác sĩ
   * Endpoint: GET /api/v1/quan-ly/ca-lam-viec
   */
  async getShifts(params?: { tuNgay?: string; denNgay?: string; maBacSi?: string }): Promise<CaLamViecResponse[]> {
    const response = await apiClient.get<CaLamViecResponse[]>('/quan-ly/ca-lam-viec', { params });
    return response.data || [];
  },

  /**
   * Xem chi tiết một ca làm việc
   * Endpoint: GET /api/v1/quan-ly/ca-lam-viec/{maCa}
   */
  async getShiftDetail(maCa: string): Promise<CaLamViecResponse> {
    const response = await apiClient.get<CaLamViecResponse>(`/quan-ly/ca-lam-viec/${encodeURIComponent(maCa)}`);
    return response.data;
  },

  /**
   * Tạo ca làm việc mới cho bác sĩ
   * Endpoint: POST /api/v1/quan-ly/ca-lam-viec
   */
  async createShift(payload: TaoCaLamViecRequest): Promise<CaLamViecResponse> {
    const response = await apiClient.post<CaLamViecResponse>('/quan-ly/ca-lam-viec', payload);
    return response.data;
  },

  /**
   * Cập nhật thông tin ca làm việc
   * Endpoint: PUT /api/v1/quan-ly/ca-lam-viec/{maCa}
   */
  async updateShift(maCa: string, payload: CapNhatCaLamViecRequest): Promise<CaLamViecResponse> {
    const response = await apiClient.put<CaLamViecResponse>(
      `/quan-ly/ca-lam-viec/${encodeURIComponent(maCa)}`,
      payload
    );
    return response.data;
  },

  /**
   * Xóa một ca làm việc
   * Endpoint: DELETE /api/v1/quan-ly/ca-lam-viec/{maCa}
   */
  async deleteShift(maCa: string): Promise<void> {
    await apiClient.delete(`/quan-ly/ca-lam-viec/${encodeURIComponent(maCa)}`);
  },
};
