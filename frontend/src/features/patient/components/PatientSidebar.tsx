import React from 'react';
import { 
  Home, 
  CalendarPlus, 
  CalendarCheck2, 
  ClipboardList, 
  User, 
  Bell, 
  HelpCircle, 
  LogOut, 
  Globe,
  X
} from 'lucide-react';
import type { AuthSession } from '@/types/auth';
import { ToothMascotWithShield } from './PatientIllustrations';

export type PatientNavTab = 
  | 'overview' 
  | 'booking' 
  | 'appointments' 
  | 'treatment-plan' 
  | 'profile' 
  | 'notifications' 
  | 'faq';

interface PatientSidebarProps {
  currentTab: PatientNavTab;
  onSelectTab: (tab: PatientNavTab) => void;
  onGoToLanding: () => void;
  onLogout: () => void;
  session?: AuthSession;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: PatientNavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Trang chủ', icon: Home },
  { id: 'booking', label: 'Đặt lịch khám', icon: CalendarPlus },
  { id: 'appointments', label: 'Lịch khám của tôi', icon: CalendarCheck2 },
  { id: 'treatment-plan', label: 'Lộ trình điều trị', icon: ClipboardList },
  { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
  { id: 'notifications', label: 'Thông báo', icon: Bell },
  { id: 'faq', label: 'Hỏi đáp (FAQ)', icon: HelpCircle },
];

export const PatientSidebar: React.FC<PatientSidebarProps> = ({
  currentTab,
  onSelectTab,
  onGoToLanding,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const content = (
    <div className="flex flex-col h-full bg-white border-r border-[#E3ECE9] select-none shadow-xs">
      {/* 1. Brand Logo Header */}
      <div className="p-5 pb-4 border-b border-[#EBF2F0] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Green Outline Tooth Icon matching brand & reference */}
          <div className="h-10 w-10 rounded-2xl bg-[#E8F6F2] border border-[#CEEBE2] flex items-center justify-center text-[#169C89] shadow-2xs shrink-0">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 5 2.5 7.5C7.5 18 8 22 10 22s2.5-2.5 2.5-4c0-1.5-.5-3-.5-4s1-2 2-2 2 1 2 2-.5 2.5-.5 4c0 1.5.5 4 2.5 4s2.5-4 3.5-6.5C21.5 13 23 11 23 8c0-3.5-3.5-6-8-6-1.5 0-2.5.5-3 1-.5-.5-1.5-1-3-1z" />
            </svg>
          </div>
          <div className="min-w-0">
            <span className="text-[15px] font-extrabold text-[#1F384C] tracking-tight block truncate leading-tight">
              Nụ Cười Xanh
            </span>
            <span className="text-xs text-[#7A9A93] font-medium block truncate mt-0.5">
              Phòng khám nha khoa
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-xl hover:bg-[#F0F7F5] text-dental-muted transition-colors"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 2. Navigation Menu */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13px] transition-all duration-150 ${
                isActive
                  ? 'bg-[#169C89] text-white shadow-sm font-semibold'
                  : 'text-[#344C52] hover:bg-[#F0F7F5] hover:text-[#169C89] font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-[#5A777E]'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {/* Notification Badge if any */}
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center ${
                    isActive
                      ? 'bg-white text-[#169C89]'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Bottom Decorative Mascot & Utilities */}
      <div className="p-3 border-t border-[#EBF2F0] bg-gradient-to-b from-white to-[#F6FAF9]">
        {/* Cute 3D Tooth Mascot with Medical Shield (Identical to reference screenshot) */}
        <div className="px-1 py-1 flex items-center justify-center">
          <ToothMascotWithShield className="w-32 h-28" />
        </div>

        {/* Quick Portal Switch & Logout */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onGoToLanding}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-[#E3ECE9] bg-white hover:bg-[#E8F6F2] hover:text-[#169C89] text-xs font-semibold text-[#344C52] transition-colors shadow-2xs"
            title="Quay lại Landing Page phòng khám"
          >
            <Globe className="h-3.5 w-3.5 text-[#169C89]" />
            <span>Trang chủ</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-xs font-semibold text-red-600 transition-colors shadow-2xs"
            title="Đăng xuất khỏi tài khoản"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
