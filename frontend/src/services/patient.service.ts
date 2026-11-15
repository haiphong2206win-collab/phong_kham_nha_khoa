import { apiClient } from './api-client';
import type { BenhNhanProfile, CapNhatHoSoPayload, YeuCauDatLich, CaKham } from '@/types/patient';

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
};
