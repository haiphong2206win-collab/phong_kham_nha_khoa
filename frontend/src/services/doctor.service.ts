import { apiClient } from './api-client';
import type {
  LichKhamBacSiResponse,
  BenhNhanTrongLichResponse,
  CapNhatTrangThaiLichRequest,
  DoctorNotification,
  TrangThaiDatLich,
  DoctorKPISummary,
  LoTrinhDieuTriResponse,
  BuoiDieuTriResponse,
  LienKetBuoiVoiLichRequest,
  LoTrinhMauResponse,
  BuoiMauResponse,
  TaoLoTrinhDieuTriRequest
} from '@/types/doctor';

export const doctorService = {
  /**
   * Lấy danh sách toàn bộ lịch khám của bác sĩ đang đăng nhập
   * Endpoint: GET /api/v1/bac-si/lich-kham
   */
  async getMySchedule(): Promise<LichKhamBacSiResponse[]> {
    const response = await apiClient.get<LichKhamBacSiResponse[]>('/bac-si/lich-kham');
    return response.data || [];
  },

  /**
   * Xem chi tiết thông tin bệnh nhân trong lịch khám được phân công
   * Endpoint: GET /api/v1/bac-si/lich-kham/{maLich}/benh-nhan
   */
  async getPatientInSchedule(maLich: string): Promise<BenhNhanTrongLichResponse> {
    if (!maLich) {
      throw new Error('Mã lịch khám không được để trống.');
    }
    const response = await apiClient.get<BenhNhanTrongLichResponse>(
      `/bac-si/lich-kham/${encodeURIComponent(maLich)}/benh-nhan`
    );
    return response.data;
  },

  /**
   * Cập nhật trạng thái tiến trình của ca khám theo máy trạng thái hợp lệ
   * Endpoint: PATCH /api/v1/bac-si/lich-kham/{maLich}/trang-thai
   * Request Body: { trangThai: TrangThaiDatLich }
   */
  async updateAppointmentStatus(
    maLich: string,
    trangThai: TrangThaiDatLich
  ): Promise<LichKhamBacSiResponse> {
    if (!maLich) {
      throw new Error('Mã lịch khám không được để trống.');
    }
    const payload: CapNhatTrangThaiLichRequest = { trangThai };
    const response = await apiClient.patch<LichKhamBacSiResponse>(
      `/bac-si/lich-kham/${encodeURIComponent(maLich)}/trang-thai`,
      payload
    );
    return response.data;
  },

  /**
   * Lấy danh sách thông báo của tài khoản bác sĩ
   * Lưu ý bảo mật: Backend Spring Security hiện chỉ cấu hình /api/v1/thong-bao/** cho vai trò BENH_NHAN.
   * Để tránh bị 401 Unauthorized dẫn đến ngắt phiên làm việc của Bác sĩ, hàm trả về danh sách rỗng
   * cho đến khi Backend mở quyền thông báo riêng cho vai trò BAC_SI.
   */
  async getNotifications(): Promise<DoctorNotification[]> {
    return [];
  },

  /**
   * Đếm số lượng thông báo chưa đọc
   * Lưu ý bảo mật: Backend Spring Security chỉ cho phép vai trò BENH_NHAN truy cập /api/v1/thong-bao/chua-doc/dem.
   */
  async getUnreadNotificationCount(): Promise<number> {
    return 0;
  },

  /**
   * Đánh dấu một thông báo đã đọc
   */
  async markNotificationAsRead(_maThongBao: string): Promise<void> {
    return;
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
   * Lấy danh sách các buổi điều trị của một lộ trình
   * Endpoint: GET /api/v1/lo-trinh-dieu-tri/{maLoTrinhDieuTri}/buoi
   */
  async getTreatmentPlanSessions(maLoTrinhDieuTri: string): Promise<BuoiDieuTriResponse[]> {
    if (!maLoTrinhDieuTri) return [];
    const response = await apiClient.get<BuoiDieuTriResponse[]>(
      `/lo-trinh-dieu-tri/${encodeURIComponent(maLoTrinhDieuTri)}/buoi`
    );
    return response.data || [];
  },

  /**
   * Liên kết buổi điều trị với lịch khám hiện tại của bác sĩ
   * Endpoint: POST /api/v1/lo-trinh-dieu-tri/{maLoTrinh}/buoi/{maBuoi}/lien-ket-lich
   */
  async linkSessionToAppointment(
    maLoTrinh: string,
    maBuoi: string,
    maLichKham: string
  ): Promise<void> {
    if (!maLoTrinh || !maBuoi || !maLichKham) {
      throw new Error('Thiếu thông tin để liên kết buổi điều trị.');
    }
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
    if (!maLoTrinh || !maBuoi) return;
    await apiClient.delete(
      `/lo-trinh-dieu-tri/${encodeURIComponent(maLoTrinh)}/buoi/${encodeURIComponent(maBuoi)}/lich-kham`
    );
  },

  /**
   * Lấy danh sách tất cả lộ trình mẫu (phác đồ mẫu)
   * Endpoint: GET /api/v1/lo-trinh-mau
   */
  async getTemplatePlans(): Promise<LoTrinhMauResponse[]> {
    const response = await apiClient.get<LoTrinhMauResponse[]>('/lo-trinh-mau');
    return response.data || [];
  },

  /**
   * Lấy chi tiết thông tin một lộ trình mẫu
   * Endpoint: GET /api/v1/lo-trinh-mau/{maLoTrinh}
   */
  async getTemplatePlanDetails(maLoTrinh: string): Promise<LoTrinhMauResponse> {
    const response = await apiClient.get<LoTrinhMauResponse>(`/lo-trinh-mau/${encodeURIComponent(maLoTrinh)}`);
    return response.data;
  },

  /**
   * Lấy danh sách các buổi điều trị mẫu của một lộ trình mẫu
   * Endpoint: GET /api/v1/lo-trinh-mau/{maLoTrinh}/buoi
   */
  async getTemplatePlanSessions(maLoTrinh: string): Promise<BuoiMauResponse[]> {
    if (!maLoTrinh) return [];
    const response = await apiClient.get<BuoiMauResponse[]>(`/lo-trinh-mau/${encodeURIComponent(maLoTrinh)}/buoi`);
    return response.data || [];
  },

  /**
   * Tạo lộ trình riêng cho bệnh nhân dựa trên lộ trình mẫu
   * Endpoint: POST /api/v1/lo-trinh-dieu-tri
   * Lưu ý bảo mật: Backend hiện thiếu kiểm tra phân công Bác sĩ - Bệnh nhân.
   */
  async createTreatmentPlan(payload: TaoLoTrinhDieuTriRequest): Promise<LoTrinhDieuTriResponse> {
    const response = await apiClient.post<LoTrinhDieuTriResponse>('/lo-trinh-dieu-tri', payload);
    return response.data;
  },

  /**
   * Tính toán các chỉ số KPI hôm nay theo giờ địa phương Việt Nam (không dùng UTC)
   */
  calculateTodayKPIs(schedule: LichKhamBacSiResponse[]): DoctorKPISummary {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const todayItems = schedule.filter(item => item.ngayKham === todayStr);

    return {
      tongLichHomNay: todayItems.length,
      benhNhanDaDen: todayItems.filter(i => i.trangThai === 'DA_DEN').length,
      dangKham: todayItems.filter(i => i.trangThai === 'DANG_KHAM').length,
      daHoanThanh: todayItems.filter(i => i.trangThai === 'HOAN_THANH').length,
    };
  }
};
