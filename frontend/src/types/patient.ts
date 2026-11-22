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

// ============================================================================
// FE-2C: LỊCH KHÁM CHÍNH THỨC & THÔNG BÁO BỆNH NHÂN
// ============================================================================

export type TrangThaiDatLich =
  | 'CHO_BENH_NHAN_XAC_NHAN'
  | 'DA_XAC_NHAN'
  | 'YEU_CAU_THAY_DOI'
  | 'DA_DEN'
  | 'DANG_KHAM'
  | 'HOAN_THANH'
  | 'VANG_MAT'
  | 'DA_HUY';

export interface LichKhamBenhNhan {
  maLich: string;
  maYeuCau?: string | null;
  maBacSi: string;
  tenBacSi: string;
  maPhong: string;
  tenPhong: string;
  ngayKham: string;
  gioBatDau: string;
  gioKetThuc: string;
  lyDoKham?: string | null;
  trangThai: TrangThaiDatLich;
  lyDoHuyThayDoi?: string | null;
  thoiGianTao: string;
}

export type LoaiThongBao =
  | 'LICH_DA_TAO'
  | 'LICH_DA_PHAN_CONG'
  | 'LICH_DA_XAC_NHAN'
  | 'YEU_CAU_THAY_DOI'
  | 'LICH_BI_HUY';

export interface ThongBaoItem {
  maThongBao: string;
  loaiThongBao: LoaiThongBao;
  tieuDe: string;
  noiDung: string;
  maLich?: string | null;
  daDoc: boolean;
  thoiGianTao: string;
}

export interface PatientDashboardSummary {
  profile: BenhNhanProfile | null;
  appointmentRequests: YeuCauDatLich[];
  officialAppointments?: LichKhamBenhNhan[];
  nearestAppointment: YeuCauDatLich | null;
  nearestOfficialAppointment?: LichKhamBenhNhan | null;
  treatmentPlanAvailable: boolean;
  treatmentPlanNote: string;
  treatmentPlans?: LoTrinhDieuTri[];
  activeTreatmentPlan?: LoTrinhDieuTri | null;
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
  ngayKham?: string | null;
  gioBatDau?: string | null;
  gioKetThuc?: string | null;
  tenBacSi?: string | null;
  tenPhong?: string | null;
}
