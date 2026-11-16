import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Stethoscope,
  ClipboardList,
  X,
  LogOut,
  Globe
} from 'lucide-react';
import type { DoctorNavTab } from '@/types/doctor';
import type { AuthSession } from '@/types/auth';

interface DoctorSidebarProps {
  currentTab: DoctorNavTab;
  onSelectTab: (tab: DoctorNavTab) => void;
  onGoToLanding: () => void;
  onLogout: () => void;
  session?: AuthSession;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItemConfig {
  id: DoctorNavTab;
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  badge?: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'overview',
    number: '01',
    label: 'Tổng quan',
    icon: LayoutDashboard
  },
  {
    id: 'appointments',
    number: '02',
    label: 'Lịch khám của tôi',
    icon: CalendarCheck
  },
  {
    id: 'consultation',
    number: '03',
    label: 'Khám & Điều trị',
    icon: Stethoscope
  },
  {
    id: 'treatment-plan',
    number: '04',
    label: 'Lộ trình điều trị',
    icon: ClipboardList,
    disabled: true,
    badge: 'Sắp có'
  },
];

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  currentTab,
  onSelectTab,
  onGoToLanding,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const content = (
    <div className="flex flex-col h-full bg-[#063C36] text-white select-none">
      {/* 1. Brand Logo Header */}
      <div className="p-5 pb-4 border-b border-[#0A4D45] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#70B8AC] shadow-inner shrink-0">
            <svg
              className="h-6 w-6 text-emerald-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C8 2 6 5 6 8c0 3 1.5 5.5 2.5 8 .8 2 1.5 4 3.5 4s2.7-2 3.5-4c1-2.5 2.5-5 2.5-8 0-3-2-6-6-6z" />
              <path d="M9 10c1 1 2 1 3 0" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight tracking-tight">
              Nha Khoa
            </div>
            <div className="font-extrabold text-[#70B8AC] text-sm leading-tight">
              Nụ Cười Xanh
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 2. Sub-brand Badge */}
      <div className="px-5 pt-4 pb-2">
        <span className="text-[10px] font-bold tracking-widest text-[#70B8AC] uppercase">
          KHÔNG GIAN BÁC SĨ
        </span>
      </div>

      {/* 3. Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <div
                key={item.id}
                className="group relative flex items-center justify-between px-3.5 py-3 rounded-2xl text-white/40 cursor-not-allowed transition-all select-none"
                title={`${item.label} (Tính năng đang được phát triển ở giai đoạn tiếp theo)`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-white/30 px-1.5 py-0.5 rounded bg-white/5">
                    {item.number}
                  </span>
                  <Icon className="h-4 w-4 text-white/30 shrink-0" />
                  <span className="text-sm font-medium text-white/50">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/50 border border-white/10">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[#169C89] text-white shadow-md font-semibold'
                  : 'text-[#C5E4DE] hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-[#70B8AC] group-hover:text-white'
                  }`}
                >
                  {item.number}
                </span>
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-[#70B8AC] group-hover:text-white'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* 4. Footer Brand & Links */}
      <div className="p-4 border-t border-[#0A4D45] space-y-3">
        {/* Quick External Links */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={onGoToLanding}
            className="flex items-center gap-1.5 text-xs text-[#9ECFC6] hover:text-white transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Trang chủ</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-200 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>

        {/* Brand Card at Bottom matching reference design */}
        <div className="bg-[#042E29] border border-[#0D554D] rounded-2xl p-3 flex items-center gap-3 shadow-inner">
          <div className="h-9 w-9 rounded-xl bg-[#169C89]/30 border border-[#169C89]/40 flex items-center justify-center shrink-0">
            {/* Mascot Smiley Tooth */}
            <svg className="w-5 h-5 text-emerald-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8 2 6 5 6 8c0 3 1.5 5.5 2.5 8 .8 2 1.5 4 3.5 4s2.7-2 3.5-4c1-2.5 2.5-5 2.5-8 0-3-2-6-6-6z" opacity="0.25" />
              <path fillRule="evenodd" clipRule="evenodd" d="M12 3C8.5 3 7 5.5 7 8c0 2.5 1.2 4.8 2.2 7.2.7 1.8 1.4 3.5 2.8 3.8.3-1.8.8-3.2 1.3-4.5.3-.8.6-1.6.9-2.5.3.9.6 1.7.9 2.5.5 1.3 1 2.7 1.3 4.5 1.4-.3 2.1-2 2.8-3.8 1-2.4 2.2-4.7 2.2-7.2 0-2.5-1.5-5-5-5h-1.5z" fill="#4ADE80" />
              <circle cx="10" cy="8" r="1" fill="#063C36" />
              <circle cx="14" cy="8" r="1" fill="#063C36" />
              <path d="M10 11c.8.8 3.2.8 4 0" stroke="#063C36" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Nha Khoa Nụ Cười Xanh</p>
            <p className="text-[11px] text-[#81C7BA] truncate">Chăm sóc tận tâm mỗi ngày</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 md:flex-col md:fixed md:inset-y-0 z-30 shadow-xl">
        {content}
      </aside>

      {/* Mobile drawer backdrop & sidebar */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#063C36] shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
