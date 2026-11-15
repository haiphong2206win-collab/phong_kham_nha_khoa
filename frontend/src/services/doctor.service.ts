import { apiClient } from './api-client';
import type {
  LichKhamBacSiResponse,
  BenhNhanTrongLichResponse,
  CapNhatTrangThaiLichRequest,
  DoctorNotification,
  TrangThaiDatLich,
  DoctorKPISummary
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
   * Endpoint: GET /api/v1/thong-bao
   */
  async getNotifications(): Promise<DoctorNotification[]> {
    const response = await apiClient.get<DoctorNotification[]>('/thong-bao');
    return response.data || [];
  },

  /**
   * Đếm số lượng thông báo chưa đọc
   * Endpoint: GET /api/v1/thong-bao/chua-doc/dem
   */
  async getUnreadNotificationCount(): Promise<number> {
    const response = await apiClient.get<{ soLuongChuaDoc: number }>('/thong-bao/chua-doc/dem');
    return response.data?.soLuongChuaDoc || 0;
  },

  /**
   * Đánh dấu một thông báo đã đọc
   * Endpoint: PATCH /api/v1/thong-bao/{maThongBao}/da-doc
   */
  async markNotificationAsRead(maThongBao: string): Promise<void> {
    if (!maThongBao) return;
    await apiClient.patch(`/thong-bao/${encodeURIComponent(maThongBao)}/da-doc`);
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
