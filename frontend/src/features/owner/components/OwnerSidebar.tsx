import React from 'react';
import {
  LayoutDashboard,
  CalendarClock,
  UserCheck,
  Users,
  ShieldCheck,
  ClipboardList,
  DoorOpen,
  X,
  LogOut,
} from 'lucide-react';
import type { OwnerNavTab } from '@/types/owner';
import type { AuthSession } from '@/types/auth';

interface OwnerSidebarProps {
  currentTab: OwnerNavTab;
  onSelectTab: (tab: OwnerNavTab) => void;
  onLogout: () => void;
  session?: AuthSession;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItemConfig {
  id: OwnerNavTab;
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
    icon: LayoutDashboard,
  },
  {
    id: 'appointment-requests',
    number: '02',
    label: 'Yêu cầu đặt lịch',
    icon: CalendarClock,
  },
  {
    id: 'doctors',
    number: '03',
    label: 'Quản lý Bác sĩ',
    icon: UserCheck,
  },
  {
    id: 'patients',
    number: '04',
    label: 'Quản lý Bệnh nhân',
    icon: Users,
  },
  {
    id: 'accounts',
    number: '05',
    label: 'Quản trị Tài khoản',
    icon: ShieldCheck,
  },
  {
    id: 'treatments',
    number: '06',
    label: 'Giám sát Điều trị',
    icon: ClipboardList,
  },
  {
    id: 'rooms-shifts',
    number: '07',
    label: 'Phòng & Ca trực',
    icon: DoorOpen,
  },
];

export const OwnerSidebar: React.FC<OwnerSidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const content = (
    <div className="flex flex-col h-full bg-[#063C36] text-white select-none">
      {/* 1. Brand Logo Header */}
      <div className="p-5 pb-4 border-b border-[#0A4D45] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner shrink-0 font-bold text-lg">
            N
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
          CỔNG CHỦ PHÒNG KHÁM
        </span>
      </div>

      {/* 3. Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <div
                key={item.id}
                className="group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-white/35 cursor-not-allowed transition-all select-none"
                title={`${item.label} (${item.badge})`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-white/25 px-1.5 py-0.5 rounded bg-white/5">
                    {item.number}
                  </span>
                  <Icon className="h-4 w-4 text-white/30 shrink-0" />
                  <span className="text-sm font-medium text-white/45">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-white/10 text-white/40 border border-white/10">
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[#169C89] text-white shadow-md font-semibold'
                  : 'text-[#C5E4DE] hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-[#70B8AC]'
                  }`}
                >
                  {item.number}
                </span>
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-[#70B8AC]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* 4. Bottom User / Logout Area */}
      <div className="p-4 border-t border-[#0A4D45] space-y-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#FCA5A5] hover:text-white hover:bg-red-500/20 transition-all font-medium"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Đăng xuất</span>
        </button>
        <div className="px-3 text-[11px] text-[#70B8AC]/80 font-mono">
          Vai trò: CHU_PHONG_KHAM
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 shrink-0 border-r border-[#0A4D45] z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
