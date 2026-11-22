import axios, { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/auth';

// Create central Axios instance
export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clinic_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors cleanly
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // If server responded with unified error
    if (error.response?.data?.loi) {
      return Promise.reject(new Error(error.response.data.loi));
    }

    // If validation error with field details
    if (error.response?.data?.chiTiet && typeof error.response.data.chiTiet === 'object') {
      const firstFieldMessage = Object.values(error.response.data.chiTiet)[0];
      if (firstFieldMessage) {
        return Promise.reject(new Error(String(firstFieldMessage)));
      }
    }

    if (error.response?.status === 401) {
      // Clear invalid local token upon 401 rejection
      localStorage.removeItem('clinic_auth_token');
      localStorage.removeItem('clinic_auth_user');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('clinic_auth_expired'));
      }
      return Promise.reject(new Error('Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.'));
    }

    if (error.response?.status === 403) {
      return Promise.reject(new Error('Bạn không có quyền thực hiện thao tác này.'));
    }

    if (error.code === 'ECONNABORTED' || !error.response) {
      return Promise.reject(new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng hoặc đảm bảo Backend đang chạy.'));
    }

    return Promise.reject(new Error(error.message || 'Đã xảy ra lỗi không xác định.'));
  }
);

