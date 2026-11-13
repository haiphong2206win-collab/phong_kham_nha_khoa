import { apiClient } from './api-client';
import { AuthResponse, AuthSession, LoginRequest, RegisterRequest } from '@/types/auth';

const TOKEN_KEY = 'clinic_auth_token';
const USER_KEY = 'clinic_auth_user';

/**
 * Kiểm tra xem JWT token đã hết hạn chưa từ payload (exp claim)
 */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    if (parsed.exp && typeof parsed.exp === 'number') {
      return Date.now() >= parsed.exp * 1000;
    }
    return false;
  } catch {
    return true;
  }
}

export const authService = {
  /**
   * Đăng nhập với tên đăng nhập và mật khẩu
   * POST /api/v1/xac-thuc/dang-nhap
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/xac-thuc/dang-nhap', {
      tenDangNhap: credentials.tenDangNhap.trim(),
      matKhau: credentials.matKhau,
    });
    return response.data;
  },

  /**
   * Đăng ký tài khoản bệnh nhân mới
   * POST /api/v1/xac-thuc/dang-ky
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/xac-thuc/dang-ky', {
      tenDangNhap: data.tenDangNhap.trim(),
      matKhau: data.matKhau,
    });
    return response.data;
  },

  /**
   * Lưu phiên đăng nhập an toàn vào localStorage
   */
  saveSession(authData: AuthResponse): void {
    try {
      localStorage.setItem(TOKEN_KEY, authData.token);
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          maTaiKhoan: authData.maTaiKhoan,
          tenDangNhap: authData.tenDangNhap,
          vaiTro: authData.vaiTro,
        })
      );
    } catch {
      // LocalStorage error handling
    }
  },

  /**
   * Xóa thông tin phiên khi đăng xuất
   */
  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Đăng xuất - xóa token và thông tin phiên
   */
  logout(): void {
    this.clearSession();
  },

  /**
   * Khôi phục phiên đăng nhập từ localStorage
   */
  getStoredSession(): AuthSession {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userRaw = localStorage.getItem(USER_KEY);

      if (token && userRaw) {
        if (isTokenExpired(token)) {
          authService.clearSession();
          return {
            user: null,
            token: null,
            isAuthenticated: false,
          };
        }

        const user = JSON.parse(userRaw);
        return {
          user,
          token,
          isAuthenticated: true,
        };
      }
    } catch {
      // JSON parse error, clear invalid state
      authService.clearSession();
    }

    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  },
};
