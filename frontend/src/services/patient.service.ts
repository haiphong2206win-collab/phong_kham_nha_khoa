import { apiClient } from './api-client';
import type {
  BenhNhanProfile,
  CapNhatHoSoPayload,
  YeuCauDatLich,
  CaKham,
  LoTrinhDieuTri,
  BuoiDieuTri,
  LichKhamBenhNhan,
  ThongBaoItem,
} from '@/types/patient';

export interface TaoYeuCauDatLichPayload {
  ngayMongMuon: string;
  caKham: CaKham;
  lyDoKham: string;
  ghiChu?: string;
}

export const patientService = {
  /**
   * Lấy hồ sơ của tài khoản bệnh nhân đang đăng nhập
   * GET /api/v1/benh-nhan/ho-so-cua-toi
   */
  async getMyProfile(): Promise<BenhNhanProfile> {
    const response = await apiClient.get<BenhNhanProfile>('/benh-nhan/ho-so-cua-toi');
    return response.data;
  },

  /**
   * Hoàn thiện hoặc cập nhật hồ sơ cá nhân của tài khoản bệnh nhân đang đăng nhập
   * PUT /api/v1/benh-nhan/ho-so-cua-toi
   */
  async updateMyProfile(payload: CapNhatHoSoPayload): Promise<BenhNhanProfile> {
    const response = await apiClient.put<BenhNhanProfile>('/benh-nhan/ho-so-cua-toi', payload);
    return response.data;
  },

  /**
   * Lấy danh sách các yêu cầu đặt lịch của bệnh nhân
   * GET /api/v1/yeu-cau-dat-lich/cua-toi
   */
  async getMyAppointmentRequests(): Promise<YeuCauDatLich[]> {
    const response = await apiClient.get<YeuCauDatLich[]>('/yeu-cau-dat-lich/cua-toi');
    return response.data;
  },

  /**
   * Bệnh nhân gửi yêu cầu đặt lịch mới vào hệ thống MySQL
   * POST /api/v1/yeu-cau-dat-lich
   */
  async createAppointmentRequest(payload: TaoYeuCauDatLichPayload): Promise<YeuCauDatLich> {
    const response = await apiClient.post<YeuCauDatLich>('/yeu-cau-dat-lich', payload);
    return response.data;
  },

  /**
   * Lấy chi tiết một yêu cầu đặt lịch theo mã yêu cầu
   * GET /api/v1/yeu-cau-dat-lich/{maYeuCau}
   */
  async getAppointmentRequestById(maYeuCau: string): Promise<YeuCauDatLich> {
    const response = await apiClient.get<YeuCauDatLich>(`/yeu-cau-dat-lich/${maYeuCau}`);
    return response.data;
  },

  /**
   * FE-2B.5: Kiểm tra và lấy danh sách lộ trình điều trị của bệnh nhân đang đăng nhập
   * Endpoint chuẩn bị: GET /api/v1/benh-nhan/lo-trinh-cua-toi
   * Phân biệt rõ:
   * - API chưa tồn tại (404 hoặc NoResourceFoundException / No static resource): trả về available: false
   * - Lỗi xác thực (401), phân quyền (403), lỗi máy chủ nội bộ (500) hoặc lỗi mạng: ném lỗi để UI hiển thị và thử lại
   */
  async getMyTreatmentPlans(): Promise<{ available: boolean; plans: LoTrinhDieuTri[]; message?: string }> {
    try {
      const response = await apiClient.get<LoTrinhDieuTri[]>('/benh-nhan/lo-trinh-cua-toi');
      return { available: true, plans: response.data || [] };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);

      // Phân biệt API chưa tồn tại trên Backend (Spring Boot NoResourceFoundException hoặc 404 Not Found)
      const isEndpointMissing =
        msg.includes('No static resource') ||
        msg.includes('NoResourceFoundException') ||
        msg.includes('404') ||
        msg.includes('Not Found');

      if (isEndpointMissing) {
        return {
          available: false,
          plans: [],
          message: 'Thông tin lộ trình điều trị đang được kết nối với hệ thống phòng khám.',
        };
      }

      // Các lỗi khác (401 hết hạn, 403 phân quyền, 500 lỗi máy chủ nội bộ, hoặc lỗi mạng):
      // Ném lỗi để UI hiển thị thông báo lỗi phù hợp và cho phép thử lại, không gom vào trạng thái Chờ kết nối
      throw error;
    }
  },

  /**
   * FE-2B.5: Lấy danh sách buổi điều trị của một lộ trình
   * Endpoint chuẩn bị: GET /api/v1/benh-nhan/lo-trinh/{maLoTrinh}/buoi
   */
  async getTreatmentSessions(maLoTrinh: string): Promise<BuoiDieuTri[]> {
    try {
      const response = await apiClient.get<BuoiDieuTri[]>(`/benh-nhan/lo-trinh/${maLoTrinh}/buoi`);
      return response.data || [];
    } catch {
      return [];
    }
  },

  /**
   * FE-2C: Lấy danh sách lịch khám chính thức của bệnh nhân đăng nhập
   * GET /api/v1/benh-nhan/lich-kham
   */
  async getMyOfficialAppointments(): Promise<LichKhamBenhNhan[]> {
    const response = await apiClient.get<LichKhamBenhNhan[]>('/benh-nhan/lich-kham');
    return response.data || [];
  },

  /**
   * FE-2C: Bệnh nhân xác nhận lịch khám đã được phân công
   * PATCH /api/v1/benh-nhan/lich-kham/{maLich}/xac-nhan
   */
  async confirmAppointment(maLich: string): Promise<LichKhamBenhNhan> {
    const response = await apiClient.patch<LichKhamBenhNhan>(`/benh-nhan/lich-kham/${maLich}/xac-nhan`);
    return response.data;
  },

  /**
   * FE-2C: Bệnh nhân từ chối lịch khám đã được phân công
   * PATCH /api/v1/benh-nhan/lich-kham/{maLich}/tu-choi
   */
  async rejectAppointment(maLich: string, lyDo: string): Promise<LichKhamBenhNhan> {
    const response = await apiClient.patch<LichKhamBenhNhan>(`/benh-nhan/lich-kham/${maLich}/tu-choi`, {
      lyDo: lyDo.trim(),
    });
    return response.data;
  },

  /**
   * FE-2C: Lấy danh sách thông báo của tài khoản bệnh nhân đang đăng nhập
   * GET /api/v1/thong-bao
   */
  async getNotifications(): Promise<ThongBaoItem[]> {
    const response = await apiClient.get<ThongBaoItem[]>('/thong-bao');
    return response.data || [];
  },

  /**
   * FE-2C: Lấy số lượng thông báo chưa đọc
   * GET /api/v1/thong-bao/chua-doc/dem -> { soLuongChuaDoc: number }
   */
  async getUnreadNotificationCount(): Promise<number> {
    const response = await apiClient.get<{ soLuongChuaDoc: number }>('/thong-bao/chua-doc/dem');
    return response.data?.soLuongChuaDoc ?? 0;
  },

  /**
   * FE-2C: Đánh dấu một thông báo đã đọc
   * PATCH /api/v1/thong-bao/{maThongBao}/da-doc
   */
  async markNotificationAsRead(maThongBao: string): Promise<void> {
    await apiClient.patch(`/thong-bao/${maThongBao}/da-doc`);
  },
};
