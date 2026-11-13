import React, { useEffect } from 'react';
import { X, CheckCircle2, Calendar, Stethoscope } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  steps: string[];
  indications: string[];
  tag: string;
}

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBookAppointment: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookAppointment,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (service) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Background click overlay */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Content Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-dental-border shadow-soft-float overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header Image */}
        <div className="relative h-48 sm:h-56 w-full bg-dental-mint/30 shrink-0">
          <ImageWithFallback
            src={service.image}
            alt={service.title}
            fallbackTitle={service.title}
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ chi tiết dịch vụ"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white text-dental-text shadow-sm transition-colors focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Badge & Title on image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-dental-accent text-white text-[10px] font-bold uppercase tracking-wider mb-1 shadow-sm">
              {service.tag}
            </span>
            <h3 id="modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {service.title}
            </h3>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-dental-text">
          <div>
            <h4 className="text-sm font-bold text-dental-text mb-1.5 flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4 text-dental-accent" />
              Tổng quan dịch vụ
            </h4>
            <p className="text-dental-muted leading-relaxed text-xs">
              {service.fullDesc}
            </p>
          </div>

          {/* Indications */}
          <div className="p-4 rounded-2xl bg-dental-bg border border-dental-border space-y-2">
            <h4 className="text-xs font-bold text-dental-text uppercase tracking-wider">
              Trường hợp chỉ định phổ biến:
            </h4>
            <ul className="space-y-1.5">
              {service.indications.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-dental-text/90">
                  <CheckCircle2 className="h-3.5 w-3.5 text-dental-accent shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Process steps */}
          <div>
            <h4 className="text-xs font-bold text-dental-text uppercase tracking-wider mb-2.5">
              Quy trình thực hiện tại phòng khám:
            </h4>
            <div className="space-y-2">
              {service.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-dental-mint/20 border border-dental-mint/40">
                  <span className="h-5 w-5 rounded-full bg-dental-accent text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-dental-text leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-dental-border bg-dental-bg/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-dental-muted text-center sm:text-left">
            Bác sĩ sẽ kiểm tra lâm sàng và tư vấn chi tiết trước khi thực hiện.
          </span>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-dental-border bg-white text-xs font-semibold text-dental-text hover:bg-dental-bg transition-colors"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookAppointment();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-dental-accent hover:bg-dental-accent-hover text-xs font-semibold text-white shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Đặt hẹn tư vấn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

