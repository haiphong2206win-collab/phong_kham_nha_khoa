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
  | 'rooms-shifts'
  | 'reports';

export type TrangThaiYeuCau = 'CHO_PHAN_CONG' | 'DA_PHAN_CONG' | 'TU_CHOI' | 'DA_TU_CHOI' | 'DA_HUY';
export type CaKham = 'CA_SANG' | 'CA_CHIEU';
export type TrangThaiTaiKhoan = 'DANG_HOAT_DONG' | 'BI_KHOA';
export type VaiTroNguoiDung = 'BENH_NHAN' | 'BAC_SI' | 'CHU_PHONG_KHAM';

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
  maLich: string;
  maYeuCau: string;
  maBacSi: string;
  tenBacSi: string;
  maPhong: string;
  tenPhong: string;
  ngayKham: string;
  gioBatDau: string;
  gioKetThuc: string;
  trangThaiLich: string;
  thongBao: string;
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
