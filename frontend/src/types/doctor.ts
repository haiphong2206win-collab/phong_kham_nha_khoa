export type TrangThaiDatLich =
  | 'CHO_BENH_NHAN_XAC_NHAN'
  | 'DA_XAC_NHAN'
  | 'YEU_CAU_THAY_DOI'
  | 'DA_DEN'
  | 'DANG_KHAM'
  | 'HOAN_THANH'
  | 'VANG_MAT'
  | 'DA_HUY';

export type GioiTinh = 'NAM' | 'NU' | 'KHAC';

export interface LichKhamBacSiResponse {
  maLich: string;
  ngayKham: string; // YYYY-MM-DD
  gioBatDau: string; // HH:mm:ss
  gioKetThuc: string; // HH:mm:ss
  lyDoKham?: string | null;
  trangThai: TrangThaiDatLich;
  maPhong: string;
  tenPhong: string;
  maBenhNhan: string;
  hoTenBenhNhan: string;
  ngaySinhBenhNhan?: string | null;
  gioiTinhBenhNhan?: GioiTinh | null;
  soDienThoaiBenhNhan?: string | null;
  emailBenhNhan?: string | null;
  tienSuBenh?: string | null;
  diUngThuoc?: string | null;
}

export interface BenhNhanTrongLichResponse {
  maLich: string;
  maBenhNhan: string;
  hoTen: string;
  ngaySinh?: string | null;
  gioiTinh?: GioiTinh | null;
  soDienThoai?: string | null;
  email?: string | null;
  diaChi?: string | null;
  tienSuBenh?: string | null;
  diUngThuoc?: string | null;
}

export interface CapNhatTrangThaiLichRequest {
  trangThai: TrangThaiDatLich;
}

export interface DoctorKPISummary {
  tongLichHomNay: number;
  benhNhanDaDen: number;
  dangKham: number;
  daHoanThanh: number;
}

export interface DoctorNotification {
  maThongBao: string;
  tieuDe: string;
  noiDung: string;
  thoiGianGui: string;
  daDoc: boolean;
  loaiThongBao?: string;
}

export type DoctorNavTab =
  | 'overview'
  | 'appointments'
  | 'consultation'
  | 'treatment-plan';

export interface TrangThaiInfo {
  label: string;
  badgeClass: string;
  dotColor: string;
  stepNumber: number;
  description: string;
}

export const TRANG_THAI_LICH_MAP: Record<TrangThaiDatLich, TrangThaiInfo> = {
  CHO_BENH_NHAN_XAC_NHAN: {
    label: 'Chờ xác nhận',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: '#D97706',
    stepNumber: 1,
    description: 'Chờ bệnh nhân phản hồi xác nhận lịch hẹn',
  },
  DA_XAC_NHAN: {
    label: 'Đã xác nhận',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotColor: '#2563EB',
    stepNumber: 1,
    description: 'Lịch khám đã được xác nhận sẵn sàng tiếp nhận',
  },
  DA_DEN: {
    label: 'Đã đến',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: '#059669',
    stepNumber: 2,
    description: 'Bệnh nhân đã có mặt tại phòng chờ khám',
  },
  DANG_KHAM: {
    label: 'Đang khám',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-300 font-medium',
    dotColor: '#0D9488',
    stepNumber: 3,
    description: 'Bác sĩ đang tiến hành khám và điều trị nha khoa',
  },
  HOAN_THANH: {
    label: 'Hoàn thành',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: '#10B981',
    stepNumber: 4,
    description: 'Ca khám và can thiệp đã kết thúc thành công',
  },
  VANG_MAT: {
    label: 'Vắng mặt',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotColor: '#E11D48',
    stepNumber: 0,
    description: 'Bệnh nhân không đến đúng giờ hẹn khám',
  },
  DA_HUY: {
    label: 'Đã hủy',
    badgeClass: 'bg-gray-100 text-gray-500 border-gray-200',
    dotColor: '#6B7280',
    stepNumber: 0,
    description: 'Lịch khám đã bị hủy bỏ',
  },
  YEU_CAU_THAY_DOI: {
    label: 'Yêu cầu thay đổi',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotColor: '#9333EA',
    stepNumber: 0,
    description: 'Bệnh nhân đề xuất đổi thời gian khám',
  },
};
