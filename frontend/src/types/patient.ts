export type GioiTinh = 'NAM' | 'NU' | 'KHAC';

export interface BenhNhanProfile {
  maBenhNhan: string;
  hoTen: string;
  ngaySinh?: string | null;
  gioiTinh?: GioiTinh | null;
  diaChi?: string | null;
  soDienThoai?: string | null;
  email?: string | null;
  diUngThuoc?: string | null;
  maTaiKhoan?: string | null;
}

export type CaKham = 'CA_SANG' | 'CA_CHIEU';
export type TrangThaiYeuCau = 'CHO_PHAN_CONG' | 'DA_PHAN_CONG' | 'CHO_XAC_NHAN' | 'DA_XAC_NHAN' | 'TU_CHOI' | 'DA_HUY';

export interface YeuCauDatLich {
  maYeuCau: string;
  maBenhNhan: string;
  tenBenhNhan: string;
  ngayMongMuon: string;
  caKham: CaKham;
  lyDoKham: string;
  ghiChu?: string | null;
  thoiGianGui: string;
  trangThai: TrangThaiYeuCau;
  lyDoTuChoi?: string | null;
}

export interface PatientDashboardSummary {
  profile: BenhNhanProfile | null;
  appointmentRequests: YeuCauDatLich[];
  nearestAppointment: YeuCauDatLich | null;
  treatmentPlanAvailable: boolean;
  treatmentPlanNote: string;
}

