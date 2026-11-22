import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  ShieldAlert,
  HeartPulse,
  Calendar,
  Clock,
  Loader2,
  FileText
} from 'lucide-react';
import type { LichKhamBacSiResponse, BenhNhanTrongLichResponse } from '@/types/doctor';
import { doctorService } from '@/services/doctor.service';

interface DoctorPatientModalProps {
  appointment: LichKhamBacSiResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorPatientModal: React.FC<DoctorPatientModalProps> = ({
  appointment,
  isOpen,
  onClose,
}) => {
  const [patientDetail, setPatientDetail] = useState<BenhNhanTrongLichResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !appointment) {
      setPatientDetail(null);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    doctorService.getPatientInSchedule(appointment.maLich)
      .then((data) => {
        if (isMounted) {
          setPatientDetail(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching patient detail:', err);
          setError(err.message || 'Không thể tải thông tin bệnh nhân từ lịch khám.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, appointment?.maLich]);

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#E8F8F5] border border-[#BCE5DC] flex items-center justify-center text-[#169C89] font-bold text-lg">
              <User className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#169C89] uppercase">
                HỒ SƠ BỆNH NHÂN TRONG LỊCH
              </span>
              <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
                {appointment.hoTenBenhNhan}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 text-[#169C89] animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Đang tải hồ sơ từ máy chủ bảo mật...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <>
              {/* Medical Alerts (Dị ứng & Tiền sử) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Dị ứng thuốc */}
                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Dị ứng thuốc</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-rose-900 mt-2">
                    {patientDetail?.diUngThuoc || appointment.diUngThuoc || 'Chưa ghi nhận dị ứng thuốc'}
                  </p>
                </div>

                {/* Tiền sử bệnh */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                    <HeartPulse className="h-4 w-4" />
                    <span>Tiền sử bệnh</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-amber-900 mt-2">
                    {patientDetail?.tienSuBenh || appointment.tienSuBenh || 'Chưa ghi nhận tiền sử bệnh'}
                  </p>
                </div>
              </div>

              {/* Administrative Details */}
              <div className="rounded-2xl border border-slate-100 bg-[#F9FBFA] p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Thông tin hành chính
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Mã bệnh nhân</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {patientDetail?.maBenhNhan || appointment.maBenhNhan}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Ngày sinh / Giới tính</span>
                    <span className="font-semibold text-slate-800">
                      {patientDetail?.ngaySinh || appointment.ngaySinhBenhNhan || 'Chưa cập nhật'} • {
                        patientDetail?.gioiTinh === 'NAM' ? 'Nam' :
                        patientDetail?.gioiTinh === 'NU' ? 'Nữ' : 'Khác'
                      }
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Số điện thoại</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {patientDetail?.soDienThoai || appointment.soDienThoaiBenhNhan || 'Chưa cập nhật'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Email</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5 truncate">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {patientDetail?.email || appointment.emailBenhNhan || 'Chưa cập nhật'}
                    </span>
                  </div>

                  {patientDetail?.diaChi && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block">Địa chỉ</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {patientDetail.diaChi}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Appointment Context */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ca khám hiện tại
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-[#169C89]" />
                    <span>Ngày khám: <strong>{appointment.ngayKham}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4 text-[#169C89]" />
                    <span>Giờ khám: <strong>{appointment.gioBatDau?.slice(0, 5)} - {appointment.gioKetThuc?.slice(0, 5)}</strong></span>
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-[#169C89]" />
                    <span>Phòng: <strong>{appointment.tenPhong}</strong></span>
                  </div>
                  {appointment.lyDoKham && (
                    <div className="sm:col-span-2 flex items-start gap-2 text-slate-600">
                      <FileText className="h-4 w-4 text-[#169C89] shrink-0 mt-0.5" />
                      <span>Lý do khám: <em>{appointment.lyDoKham}</em></span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-xs"
          >
            Đóng hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};
