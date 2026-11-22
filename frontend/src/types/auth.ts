// Backend Role Enum
export type UserRole = 'BENH_NHAN' | 'BAC_SI' | 'CHU_PHONG_KHAM';

// Request DTO - Login
export interface LoginRequest {
  tenDangNhap: string;
  matKhau: string;
}

// Request DTO - Register (Client side validates confirm password)
export interface RegisterRequest {
  tenDangNhap: string;
  matKhau: string;
  xacNhanMatKhau?: string;
}

// Response DTO - Auth Result (Matches com.example.clinic.demo_phongkham_nhakhoa.dto.response.KetQuaXacThucResponse)
export interface AuthResponse {
  token: string;
  loaiToken: string;
  maTaiKhoan: string;
  tenDangNhap: string;
  vaiTro: UserRole;
}

// Unified Backend Error Response (Matches GlobalExceptionHandler)
export interface ApiErrorResponse {
  thoiGian?: string;
  trangThai?: number;
  loi: string;
  chiTiet?: Record<string, string> | string;
}

// Client Auth Session State
export interface AuthSession {
  user: {
    maTaiKhoan: string;
    tenDangNhap: string;
    vaiTro: UserRole;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
}

