import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, ShieldAlert, Info, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { YeuCauDatLichResponse, BacSiQuanLyResponse, PhanCongRequest } from '@/types/owner';
import { ownerService } from '@/services/owner.service';

interface OwnerAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: YeuCauDatLichResponse | null;
  doctors: BacSiQuanLyResponse[];
  currentOwnerDoctorId: string;
  onSuccess: (message: string) => void;
}

export const OwnerAssignModal: React.FC<OwnerAssignModalProps> = ({
  isOpen,
  onClose,
  request,
  doctors,
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

  // Backend hiện thiếu API GET danh sách phòng khám (/api/v1/quan-ly/phong-kham)
  // Đánh dấu trạng thái BLOCKED theo quy chuẩn bảo vệ dữ liệu sản xuất
  const isRoomApiAvailable = false;

  useEffect(() => {
    if (request) {
      // Đặt giờ mặc định theo ca sáng hoặc ca chiều
      setStartTime(request.caKham === 'CA_SANG' ? '08:30' : '14:00');
      // Mặc định chọn bác sĩ điều trị đầu tiên
      const treatingDoc = doctors.find((d) => d.maBacSi !== currentOwnerDoctorId && d.dangLamViec);
      setSelectedDoctorId(treatingDoc ? treatingDoc.maBacSi : doctors[0]?.maBacSi || '');
      setSelectedRoomId('');
      setDuration(30);
      setIsConfirmed(false);
      setErrorMessage(null);
    }
  }, [request, doctors, currentOwnerDoctorId]);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRoomApiAvailable) {
      setErrorMessage('Chức năng phân công đang tạm hoãn (BLOCKED) do Backend chưa có API danh mục phòng khám.');
      return;
    }
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
        maChuPhongKham: currentOwnerDoctorId || 'BS_CHU_DEMO',
        maYeuCau: request.maYeuCau,
        maBacSi: selectedDoctorId,
        maPhong: selectedRoomId,
        gioBatDau: startTime.length === 5 ? `${startTime}:00` : startTime,
        thoiLuongPhut: Number(duration),
      };

      const result = await ownerService.assignAppointment(payload);
      onSuccess(result.thongBao || `Phân công thành công ca khám ${result.maLich}!`);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi phân công ca khám.';
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

        {/* Cảnh báo trạng thái BLOCKED do thiếu API phòng khám */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <p className="font-bold">Tính năng phân công phòng khám đang tạm hoãn (BLOCKED):</p>
            <p className="text-[11px] text-amber-800">
              Backend hiện chưa cung cấp endpoint <code className="font-mono font-semibold">GET /api/v1/quan-ly/phong-kham</code> để truy vấn danh mục phòng khám thực tế.
              Để ngăn chặn việc tạo lịch khám với mã phòng chưa được xác minh trong hệ thống sản xuất, nút phân công tạm thời được khóa cho đến khi Backend bổ sung API này.
            </p>
          </div>
        </div>

        {/* Cảnh báo quy tắc ca làm việc (Trung tính) */}
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <p className="font-bold">Quy tắc phân công ca trực:</p>
            <p className="text-[11px] text-blue-800">
              Backend yêu cầu Bác sĩ được chọn phải có ca làm việc đăng ký trên hệ thống vào ngày {request.ngayMongMuon} ({request.caKham === 'CA_SANG' ? 'Ca sáng' : 'Ca chiều'}).
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

          {/* Chọn Phòng khám (Bị khóa do thiếu API) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700">
                Phòng khám <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                <Lock className="h-3 w-3" /> Chờ API Backend
              </span>
            </div>
            <select
              value=""
              disabled={true}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed font-medium"
            >
              <option value="">-- Chờ Backend bổ sung API danh mục phòng khám --</option>
            </select>
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
                disabled={!isRoomApiAvailable}
                className="mt-0.5 h-4 w-4 rounded-sm border-gray-300 text-[#169C89] focus:ring-[#169C89] disabled:opacity-50"
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
              disabled={true}
              className="bg-gray-300 text-gray-500 cursor-not-allowed font-medium px-4 py-2"
              title="Chức năng tạm khóa do Backend chưa có API danh mục phòng khám"
            >
              Tạm khóa (Chờ API phòng khám)
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
