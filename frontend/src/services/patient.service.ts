import { apiClient } from './api-client';
import type { BenhNhanProfile, YeuCauDatLich, CaKham } from '@/types/patient';

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
};
