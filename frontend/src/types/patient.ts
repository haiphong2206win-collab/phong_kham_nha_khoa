export type GioiTinh = 'NAM' | 'NU' | 'KHAC';

export interface BenhNhanProfile {
  maBenhNhan: string;
  hoTen: string;
  ngaySinh?: string | null;
  gioiTinh?: GioiTinh | null;
  diaChi?: string | null;
  soDienThoai?: string | null;
  email?: string | null;
  tienSuBenh?: string | null;
  diUngThuoc?: string | null;
  maTaiKhoan?: string | null;
}

export interface CapNhatHoSoPayload {
  hoTen: string;
  ngaySinh: string;
  gioiTinh?: GioiTinh | null;
  soDienThoai: string;
  email?: string | null;
  diaChi?: string | null;
  tienSuBenh?: string | null;
  diUngThuoc?: string | null;
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

// ============================================================================
// FE-2B.5: LỘ TRÌNH ĐIỀU TRỊ & BUỔI ĐIỀU TRỊ (TREATMENT PLAN CONTRACT)
// ============================================================================

export type TrangThaiLoTrinh =
  | 'CHUA_BAT_DAU'
  | 'DANG_DIEU_TRI'
  | 'TAM_DUNG'
  | 'HOAN_THANH'
  | 'DA_HUY';

export type TrangThaiBuoiDieuTri =
  | 'CHUA_LEN_LICH'
  | 'DA_LEN_LICH'
  | 'LICH_DA_HUY'
  | 'DANG_THUC_HIEN'
  | 'HOAN_THANH'
  | 'TAM_HOAN'
  | 'DA_BO';

export interface LoTrinhDieuTri {
  maLoTrinhDieuTri: string;
  maBenhNhan: string;
  maLoTrinhMau?: string | null;
  tenLoTrinh: string;
  ghiChu?: string | null;
  trangThai: TrangThaiLoTrinh;
  tongSoBuoi: number;
  soBuoiHoanThanh: number;
  soBuoiDaBo: number;
  thoiGianTao: string;
  thoiGianCapNhat?: string | null;
  version?: number;
}

export interface BuoiDieuTri {
  maBuoiDieuTri: string;
  maLoTrinhDieuTri: string;
  soThuTu: number;
  tenBuoi: string;
  noiDung?: string | null;
  khoangCachMin?: number | null;
  khoangCachMax?: number | null;
  ghiChu?: string | null;
  trangThai: TrangThaiBuoiDieuTri;
  buoiBoSung?: boolean;
  lyDoBo?: string | null;
  thoiGianTao?: string;
  thoiGianCapNhat?: string | null;
  version?: number;
  maLichKham?: string | null;
}
