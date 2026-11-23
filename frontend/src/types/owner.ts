/**
 * Type definitions for Owner Portal (Cổng Chủ phòng khám)
 * Roles: CHU_PHONG_KHAM
 */

export type OwnerNavTab =
  | 'overview'
  | 'appointment-requests'
  | 'doctors'
  | 'patients'
  | 'accounts'
  | 'treatments'
  | 'rooms-shifts';

export type TrangThaiYeuCau = 'CHO_PHAN_CONG' | 'DA_PHAN_CONG' | 'TU_CHOI' | 'DA_TU_CHOI' | 'DA_HUY';
export type CaKham = 'CA_SANG' | 'CA_CHIEU';
export type TrangThaiTaiKhoan = 'DANG_HOAT_DONG' | 'BI_KHOA';
export type VaiTroNguoiDung = 'BENH_NHAN' | 'BAC_SI' | 'CHU_PHONG_KHAM';
export type GioiTinh = 'NAM' | 'NU' | 'KHAC';

/**
 * DTO YeuCauDatLichResponse từ Backend GET /api/v1/quan-ly/yeu-cau-dat-lich
 */
export interface YeuCauDatLichResponse {
  maYeuCau: string;
  maBenhNhan: string;
  tenBenhNhan: string;
  ngayMongMuon: string; // YYYY-MM-DD
  caKham: CaKham;
  lyDoKham?: string | null;
  ghiChu?: string | null;
  thoiGianGui: string; // ISO datetime
  trangThai: TrangThaiYeuCau;
  lyDoTuChoi?: string | null;
}

/**
 * DTO PhanCongRequest cho POST /api/v1/phan-cong
 */
export interface PhanCongRequest {
  maChuPhongKham: string;
  maYeuCau: string;
  maBacSi: string;
  maPhong: string;
  gioBatDau: string; // HH:mm:ss hoặc HH:mm
  thoiLuongPhut: number;
}

/**
 * DTO KetQuaPhanCongResponse từ POST /api/v1/phan-cong
 */
export interface KetQuaPhanCongResponse {
  maBacSi: string;
  tenBacSi: string;
  maPhong: string;
  tenPhong: string;
  ngayKham: string;
  gioBatDau: string;
  gioKetThuc: string;
  maNguoiPhanCong?: string;
  tenNguoiPhanCong?: string;
  thoiGianPhanCong?: string;
}

/**
 * DTO PhongKhamResponse từ GET /api/v1/quan-ly/phong-kham
 */
export interface PhongKhamResponse {
  maPhong: string;
  tenPhong: string;
  trangThai: 'TRONG' | 'DANG_SU_DUNG' | 'TAM_NGUNG' | 'BAO_TRI' | string;
  ghiChu?: string | null;
}

/**
 * DTO TuChoiRequest cho POST /api/v1/phan-cong/tu-choi
 */
export interface TuChoiRequest {
  maChuPhongKham: string;
  maYeuCau: string;
  lyDo: string;
}

/**
 * DTO BacSiQuanLyResponse từ GET /api/v1/quan-ly/bac-si
 */
export interface BacSiQuanLyResponse {
  maBacSi: string;
  hoTen: string;
  soDienThoai: string | null;
  soChungChi: string | null;
  dangLamViec: boolean;
  maTaiKhoan: string | null;
  tenDangNhap: string | null;
  trangThaiTaiKhoan: TrangThaiTaiKhoan | null;
  ngayTaoTaiKhoan: string | null;
}

/**
 * DTO BenhNhanQuanLyResponse từ GET /api/v1/quan-ly/benh-nhan
 */
export interface BenhNhanQuanLyResponse {
  maBenhNhan: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string | null;
  soDienThoai: string;
  email: string | null;
  diaChi: string | null;
  tienSuBenh: string | null;
  diUngThuoc: string | null;
  maTaiKhoan: string | null;
  tenDangNhap: string | null;
  trangThaiTaiKhoan: TrangThaiTaiKhoan | null;
  ngayTaoTaiKhoan: string | null;
}

/**
 * DTO TaiKhoanQuanLyResponse từ GET /api/v1/tai-khoan
 */
export interface TaiKhoanQuanLyResponse {
  maTaiKhoan: string;
  tenDangNhap: string;
  vaiTro: VaiTroNguoiDung;
  trangThai: TrangThaiTaiKhoan;
  ngayTao: string;
  maHoSo: string | null;
  hoTen: string | null;
  soDienThoai: string | null;
}

/**
 * DTO TaoTaiKhoanBacSiRequest cho POST /api/v1/tai-khoan/bac-si
 */
export interface TaoTaiKhoanBacSiRequest {
  tenDangNhap: string;
  matKhau: string;
  hoTen: string;
  soDienThoai?: string;
  soChungChi?: string;
}

/**
 * DTO TaoTaiKhoanBenhNhanRequest cho POST /api/v1/tai-khoan/benh-nhan
 */
export interface TaoTaiKhoanBenhNhanRequest {
  tenDangNhap: string;
  matKhau: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: GioiTinh;
  soDienThoai: string;
  email?: string | null;
  diaChi?: string | null;
}

/**
 * DTO CapNhatTaiKhoanRequest cho PUT /api/v1/tai-khoan/{maTaiKhoan}
 */
export interface CapNhatTaiKhoanRequest {
  tenDangNhap?: string;
  matKhauMoi?: string;
}

/**
 * DTO CapNhatTrangThaiTaiKhoanRequest cho PATCH /api/v1/tai-khoan/{maTaiKhoan}/trang-thai
 */
export interface CapNhatTrangThaiTaiKhoanRequest {
  dangHoatDong: boolean;
}

/**
 * KPI Tổng hợp tính toán từ API thực tế cho Owner Dashboard
 */
export interface OwnerKPISummary {
  totalDoctors: number;
  activeDoctors: number;
  treatingDoctors: number;
  ownerDoctors: number;
  totalPatients: number;
  pendingAppointments: number;
  totalAccounts: number;
}

/**
 * ========================================================
 * FE-4.4 – GIÁM SÁT ĐIỀU TRỊ (TREATMENT SUPERVISION) TYPES
 * ========================================================
 */

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

export type TreatmentSupervisionTab = 'patient-plans' | 'template-plans';

/**
 * DTO LoTrinhMauResponse từ GET /api/v1/lo-trinh-mau
 */
export interface LoTrinhMauResponse {
  maLoTrinh: string;
  tenLoTrinh: string;
  moTa?: string | null;
  tongSoBuoi: number;
  thoiGianDuKien?: string | null;
}

/**
 * DTO BuoiMauResponse từ GET /api/v1/lo-trinh-mau/{maLoTrinh}/buoi
 */
export interface BuoiMauResponse {
  maBuoi: string;
  maLoTrinh: string;
  soThuTu: number;
  tenBuoi: string;
  noiDung: string;
  khoangCachMin?: number | null;
  khoangCachMax?: number | null;
  ghiChu?: string | null;
}

/**
 * DTO LoTrinhDieuTriResponse từ GET /api/v1/lo-trinh-dieu-tri/benh-nhan/{maBenhNhan}
 */
export interface LoTrinhDieuTriResponse {
  maLoTrinhDieuTri: string;
  maBenhNhan: string;
  maLoTrinhMau: string;
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

/**
 * DTO BuoiDieuTriResponse từ GET /api/v1/lo-trinh-dieu-tri/{maLoTrinhDieuTri}/buoi
 */
export interface BuoiDieuTriResponse {
  maBuoiDieuTri: string;
  maLoTrinhDieuTri: string;
  soThuTu: number;
  tenBuoi: string;
  noiDung: string;
  khoangCachMin?: number | null;
  khoangCachMax?: number | null;
  ghiChu?: string | null;
  trangThai: TrangThaiBuoiDieuTri;
  buoiBoSung: boolean;
  lyDoBo?: string | null;
  thoiGianTao?: string;
  thoiGianCapNhat?: string;
  version?: number;
  maLichKham?: string | null;
  ngayKham?: string | null;
  gioBatDau?: string | null;
  gioKetThuc?: string | null;
  tenBacSi?: string | null;
  tenPhong?: string | null;
}

/**
 * DTO TaoLoTrinhDieuTriRequest cho POST /api/v1/lo-trinh-dieu-tri
 */
export interface TaoLoTrinhDieuTriRequest {
  maBenhNhan: string;
  maLoTrinhMau: string;
  tenLoTrinh?: string;
  ghiChu?: string;
  maLichKhamBanDau?: string;
  lichCacBuoiTiepTheo?: Array<{
    soThuTu: number;
    ngayKham: string;
    gioBatDau: string;
    thoiLuongPhut: number;
  }>;
}

/**
 * DTO ThemBuoiDieuTriRequest cho POST /api/v1/lo-trinh-dieu-tri/{maLoTrinh}/buoi
 */
export interface ThemBuoiDieuTriRequest {
  soThuTu: number;
  tenBuoi: string;
  noiDung: string;
  khoangCachMin?: number | null;
  khoangCachMax?: number | null;
  ghiChu?: string;
}

/**
 * DTO CapNhatBuoiDieuTriRequest cho PUT /api/v1/lo-trinh-dieu-tri/{maLoTrinh}/buoi/{maBuoi}
 */
export interface CapNhatBuoiDieuTriRequest {
  tenBuoi: string;
  noiDung: string;
  khoangCachMin?: number | null;
  khoangCachMax?: number | null;
  ghiChu?: string;
}

/**
 * DTO BoBuoiDieuTriRequest cho PATCH /api/v1/lo-trinh-dieu-tri/{maLoTrinh}/buoi/{maBuoi}/bo
 */
export interface BoBuoiDieuTriRequest {
  lyDoBo: string;
}

/**
 * DTO LienKetBuoiVoiLichRequest cho POST .../lien-ket-lich
 */
export interface LienKetBuoiVoiLichRequest {
  maLichKham: string;
}

/**
 * Ánh xạ trạng thái buổi điều trị sang giao diện trực quan
 */
export const TRANG_THAI_BUOI_MAP: Record<TrangThaiBuoiDieuTri, { label: string; badgeClass: string }> = {
  CHUA_LEN_LICH: {
    label: 'Chưa lên lịch',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  DA_LEN_LICH: {
    label: 'Đã lên lịch',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  LICH_DA_HUY: {
    label: 'Lịch đã hủy',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  DANG_THUC_HIEN: {
    label: 'Đang thực hiện',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  HOAN_THANH: {
    label: 'Hoàn thành',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  TAM_HOAN: {
    label: 'Tạm hoãn',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  DA_BO: {
    label: 'Đã bỏ buổi',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

/**
 * Ánh xạ trạng thái lộ trình điều trị
 */
export const TRANG_THAI_LO_TRINH_MAP: Record<TrangThaiLoTrinh, { label: string; badgeClass: string }> = {
  CHUA_BAT_DAU: {
    label: 'Chưa bắt đầu',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  DANG_DIEU_TRI: {
    label: 'Đang điều trị',
    badgeClass: 'bg-teal-50 text-[#169C89] border-teal-200',
  },
  TAM_DUNG: {
    label: 'Tạm dừng',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  HOAN_THANH: {
    label: 'Hoàn thành',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  DA_HUY: {
    label: 'Đã hủy',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

/**
 * DTO CaLamViecResponse từ GET /api/v1/quan-ly/ca-lam-viec
 */
export interface CaLamViecResponse {
  maCa: string;
  maBacSi: string;
  tenBacSi: string;
  soChungChi?: string | null;
  ngayLamViec: string; // YYYY-MM-DD
  caKham: CaKham; // CA_SANG | CA_CHIEU
  gioBatDau: string; // HH:mm:ss
  gioKetThuc: string; // HH:mm:ss
  soBenhNhanToiDa: number;
  dangHoatDong: boolean;
  soLichDaXep: number;
}

export interface TaoCaLamViecRequest {
  maBacSi: string;
  ngayLamViec: string; // YYYY-MM-DD
  caKham: CaKham;
  gioBatDau?: string; // HH:mm
  gioKetThuc?: string; // HH:mm
  soBenhNhanToiDa?: number;
  dangHoatDong?: boolean;
}

export interface CapNhatCaLamViecRequest {
  gioBatDau?: string;
  gioKetThuc?: string;
  soBenhNhanToiDa?: number;
  dangHoatDong?: boolean;
}
