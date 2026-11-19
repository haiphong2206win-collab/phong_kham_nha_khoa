import React, { useState, useMemo } from 'react';
import {
  Search,
  Clock,
  Layers,
  Database,
  Eye,
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { LoTrinhMauResponse, BuoiMauResponse } from '@/types/owner';

interface OwnerTreatmentTemplateTabProps {
  templates: LoTrinhMauResponse[];
  selectedTemplate: LoTrinhMauResponse | null;
  onSelectTemplate: (template: LoTrinhMauResponse) => void;
  sessions: BuoiMauResponse[];
  loadingTemplates: boolean;
  loadingSessions: boolean;
  errorTemplates?: string | null;
  onOpenSessionDetail: (session: BuoiMauResponse) => void;
}

export const OwnerTreatmentTemplateTab: React.FC<OwnerTreatmentTemplateTabProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
  sessions,
  loadingTemplates,
  loadingSessions,
  errorTemplates,
  onOpenSessionDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter templates
  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter(
      (t) =>
        t.tenLoTrinh.toLowerCase().includes(q) ||
        t.maLoTrinh.toLowerCase().includes(q) ||
        (t.moTa && t.moTa.toLowerCase().includes(q))
    );
  }, [templates, searchQuery]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* CỘT TRÁI: Thư viện phác đồ mẫu (3) - 5 cột lg */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              Thư viện phác đồ mẫu ({templates.length})
            </h2>
            <span className="text-[11px] font-medium text-gray-400">Chỉ xem</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Quy trình điều trị tiêu chuẩn nha khoa</p>
        </div>

        {/* Ô tìm kiếm phác đồ */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm phác đồ theo tên..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89] transition-all"
          />
        </div>

        {/* Trạng thái tải / lỗi / danh sách phác đồ */}
        {loadingTemplates ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#169C89]" />
            <span className="text-xs font-medium">Đang tải phác đồ mẫu...</span>
          </div>
        ) : errorTemplates ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorTemplates}</span>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            Không tìm thấy phác đồ mẫu phù hợp.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTemplates.map((item, idx) => {
              const isSelected = selectedTemplate?.maLoTrinh === item.maLoTrinh;
              return (
                <div
                  key={item.maLoTrinh}
                  onClick={() => onSelectTemplate(item)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#169C89] bg-[#E8F8F5]/50 shadow-xs'
                      : 'border-gray-200/80 bg-white hover:border-[#169C89]/40 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Vòng tròn số thứ tự */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#169C89]/20 text-[#0D6E60]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-bold truncate ${
                          isSelected ? 'text-[#0D6E60]' : 'text-gray-900'
                        }`}
                      >
                        {item.tenLoTrinh}
                      </h3>
                      <p className="text-[11px] font-mono text-gray-400 uppercase mt-0.5">
                        {item.maLoTrinh}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1 font-semibold text-gray-700">
                          <Layers className="w-3.5 h-3.5 text-gray-400" />
                          {item.tongSoBuoi} buổi
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {item.thoiGianDuKien || 'Theo chỉ định'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CỘT PHẢI: Chi tiết phác đồ đang chọn - 7 cột lg */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 space-y-6">
        {selectedTemplate ? (
          <>
            {/* 1. Header chi tiết */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedTemplate.tenLoTrinh}
                </h2>
                <p className="text-xs font-mono text-gray-400 uppercase mt-0.5">
                  {selectedTemplate.maLoTrinh}
                </p>
                {selectedTemplate.moTa && (
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {selectedTemplate.moTa}
                  </p>
                )}
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200 select-none">
                CHỈ ĐỌC
              </span>
            </div>

            {/* 2. 3 Thẻ thống kê tóm tắt */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-100">
                <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
                  Tổng số buổi
                </span>
                <span className="text-lg font-bold text-[#169C89] mt-0.5 block">
                  {selectedTemplate.tongSoBuoi} buổi
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
                <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider block">
                  Thời gian dự kiến
                </span>
                <span className="text-lg font-bold text-blue-700 mt-0.5 block">
                  {selectedTemplate.thoiGianDuKien || 'Theo phác đồ'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100">
                <span className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider block">
                  Nguồn dữ liệu
                </span>
                <span className="text-lg font-bold text-purple-700 mt-0.5 block flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-purple-600" />
                  Backend API
                </span>
              </div>
            </div>

            {/* 3. Danh sách các buổi trong phác đồ */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Các buổi trong phác đồ
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Sắp xếp theo soThuTu tăng dần
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#169C89] bg-[#E8F8F5] px-2.5 py-1 rounded-lg">
                  {sessions.length} buổi
                </span>
              </div>

              {loadingSessions ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin text-[#169C89]" />
                  <span className="text-xs font-medium">Đang tải chi tiết các buổi...</span>
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400 border border-dashed rounded-xl">
                  Chưa có dữ liệu buổi cho phác đồ này.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sessions.map((session) => (
                    <div
                      key={session.maBuoi}
                      className="p-3.5 rounded-xl border border-gray-100 bg-[#F8FAFC] hover:bg-white hover:border-[#169C89]/30 hover:shadow-xs transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-teal-100/70 text-[#0D6E60] font-bold text-xs flex items-center justify-center shrink-0">
                          {session.soThuTu}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {session.tenBuoi}
                          </h4>
                          <p className="text-[11px] text-gray-500 truncate mt-0.5">
                            {session.noiDung}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => onOpenSessionDetail(session)}
                        className="text-xs px-3 py-1.5 h-auto shrink-0 font-semibold text-[#169C89] hover:bg-[#E8F8F5]"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Chi tiết
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer quy chuẩn phác đồ */}
            <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
              <Info className="w-3.5 h-3.5 text-[#169C89] shrink-0" />
              <span>Nội dung và thứ tự từng buổi được áp dụng chuẩn hóa từ danh mục phác đồ điều trị của phòng khám.</span>
            </div>
          </>
        ) : (
          <div className="py-20 text-center text-gray-400 space-y-2">
            <Layers className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-sm font-semibold">Chọn một phác đồ mẫu ở cột bên trái</p>
          </div>
        )}
      </div>
    </div>
  );
};