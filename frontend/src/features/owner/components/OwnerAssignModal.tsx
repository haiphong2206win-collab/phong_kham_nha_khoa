import React, { useState, useEffect } from 'react';
import { X, Calendar, ShieldAlert, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type {
  YeuCauDatLichResponse,
  BacSiQuanLyResponse,
  PhongKhamResponse,
  PhanCongRequest
} from '@/types/owner';
import { ownerService } from '@/services/owner.service';

interface OwnerAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: YeuCauDatLichResponse | null;
  doctors: BacSiQuanLyResponse[];
  rooms: PhongKhamResponse[];
  currentOwnerDoctorId: string;
  onSuccess: (message: string) => void;
}

export const OwnerAssignModal: React.FC<OwnerAssignModalProps> = ({
  isOpen,
  onClose,
  request,
  doctors,
  rooms,
  currentOwnerDoctorId,
  onSuccess,
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('08:30');
  const [duration, setDuration] = useState<number>(30);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (request) {
      // Đặt giờ mặc định theo ca sáng hoặc ca chiều
      setStartTime(request.caKham === 'CA_SANG' ? '08:30' : '14:00');
      // Mặc định chọn bác sĩ điều trị đầu tiên
      const treatingDoc = doctors.find((d) => d.maBacSi !== currentOwnerDoctorId && d.dangLamViec);
      setSelectedDoctorId(treatingDoc ? treatingDoc.maBacSi : doctors[0]?.maBacSi || '');

      // Mặc định chọn phòng khám sẵn sàng đầu tiên
      const availableRoom =
        rooms.find((r) => r.trangThai === 'TRONG') ||
        rooms.find((r) => r.trangThai !== 'BAO_TRI' && r.trangThai !== 'TAM_NGUNG');
      setSelectedRoomId(availableRoom ? availableRoom.maPhong : (rooms[0]?.maPhong || ''));

      setDuration(30);
      setIsConfirmed(false);
      setErrorMessage(null);
    }
  }, [request, doctors, rooms, currentOwnerDoctorId]);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      setErrorMessage('Vui lòng chọn bác sĩ phụ trách ca khám.');
      return;
    }
    if (!selectedRoomId) {
      setErrorMessage('Vui lòng chọn phòng khám.');
      return;
    }
    if (!startTime) {
      setErrorMessage('Vui lòng chọn giờ bắt đầu khám.');
      return;
    }
    if (!isConfirmed) {
      setErrorMessage('Vui lòng tích xác nhận thông tin phân công.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const payload: PhanCongRequest = {
        maChuPhongKham: currentOwnerDoctorId || 'BS_CHU_001',
        maYeuCau: request.maYeuCau,
        maBacSi: selectedDoctorId,
        maPhong: selectedRoomId,
        gioBatDau: startTime.length === 5 ? `${startTime}:00` : startTime,
        thoiLuongPhut: Number(duration),
      };

      const result = await ownerService.assignAppointment(payload);
      onSuccess(`Phân công thành công cho Bác sĩ ${result.tenBacSi} tại ${result.tenPhong}!`);
      onClose();
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : 'Lỗi khi phân công ca khám.';
      if (msg.includes('status code') || msg.includes('Request failed')) {
        msg = 'Không thể phân công. Vui lòng kiểm tra lại ca trực của bác sĩ hoặc phòng khám.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-dental-border shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#E8F8F5] border border-[#BDE8E0] flex items-center justify-center text-[#169C89]">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Phân công Bác sĩ & Phòng khám</h3>
              <p className="text-xs text-gray-500 font-mono">Yêu cầu: {request.maYeuCau}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tóm tắt thông tin bệnh nhân */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-gray-500">Bệnh nhân:</span>
            <span className="font-semibold text-gray-800">{request.tenBenhNhan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ngày mong muốn:</span>
            <span className="font-semibold text-gray-800">
              {request.ngayMongMuon} ({request.caKham === 'CA_SANG' ? 'Ca sáng' : 'Ca chiều'})
            </span>
          </div>
          {request.lyDoKham && (
            <div className="flex justify-between">
              <span className="text-gray-500">Lý do khám:</span>
              <span className="font-medium text-gray-700 max-w-[240px] truncate text-right">
                {request.lyDoKham}
              </span>
            </div>
          )}
        </div>

        {/* Hướng dẫn phân công ca làm việc */}
        <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-[#169C89] shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <p className="font-bold">Lưu ý phân công:</p>
            <p className="text-[11px] text-teal-800">
              Bác sĩ phụ trách cần có ca làm việc vào ngày {request.ngayMongMuon} ({request.caKham === 'CA_SANG' ? 'Ca sáng' : 'Ca chiều'}).
            </p>
          </div>
        </div>

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Chọn Bác sĩ */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Bác sĩ phụ trách khám <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89] focus:border-transparent font-medium"
              required
            >
              <option value="">-- Chọn Bác sĩ --</option>
              {doctors.map((doc) => (
                <option key={doc.maBacSi} value={doc.maBacSi}>
                  {doc.hoTen} ({doc.maBacSi}) {doc.dangLamViec ? '• Đang làm việc' : '• Tạm nghỉ'}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn Phòng khám (Đã mở khóa kết nối API thật) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Phòng khám <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89] focus:border-transparent font-medium"
              required
            >
              <option value="">-- Chọn Phòng khám --</option>
              {rooms.map((room) => {
                const isBlocked = room.trangThai === 'BAO_TRI' || room.trangThai === 'TAM_NGUNG';
                return (
                  <option key={room.maPhong} value={room.maPhong} disabled={isBlocked}>
                    {room.tenPhong} ({room.maPhong}) {room.trangThai === 'TRONG' ? '• Sẵn sàng' : room.trangThai === 'DANG_SU_DUNG' ? '• Đang sử dụng' : `• ${room.trangThai}`}
                  </option>
                );
              })}
            </select>
            <p className="mt-1 text-[11px] text-gray-400">
              Chọn phòng khám điều trị phù hợp cho ca hẹn.
            </p>
          </div>

          {/* Giờ bắt đầu & Thời lượng */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Giờ bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89] font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Thời lượng (phút) <span className="text-red-500">*</span>
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#169C89]"
              >
                <option value={15}>15 phút</option>
                <option value={30}>30 phút (Chuẩn)</option>
                <option value={45}>45 phút</option>
                <option value={60}>60 phút</option>
              </select>
            </div>
          </div>

          {/* Checkbox xác nhận 2 bước */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-sm border-gray-300 text-[#169C89] focus:ring-[#169C89]"
              />
              <span className="text-xs text-gray-600 leading-snug">
                Tôi xác nhận thông tin phân công trên là chính xác và đồng ý tạo lịch khám chính thức trong hệ thống.
              </span>
            </label>
          </div>

          {/* Báo lỗi nếu có */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading || !selectedDoctorId || !selectedRoomId || !startTime || !isConfirmed}
              className="bg-[#169C89] hover:bg-[#138575] text-white font-medium px-4 py-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang phân công...' : 'Xác nhận phân công'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
