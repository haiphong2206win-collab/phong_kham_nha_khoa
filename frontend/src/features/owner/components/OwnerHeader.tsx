import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import type { AuthSession } from '@/types/auth';
import type { OwnerNavTab } from '@/types/owner';

interface OwnerHeaderProps {
  currentTab: OwnerNavTab;
  session: AuthSession;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
}

export const OwnerHeader: React.FC<OwnerHeaderProps> = ({
  currentTab,
  session,
  onLogout,
  onOpenMobileMenu,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'overview':
        return 'Tổng quan';
      case 'appointment-requests':
        return 'Yêu cầu đặt lịch';
      case 'doctors':
        return 'Quản lý Bác sĩ';
      case 'patients':
        return 'Quản lý Bệnh nhân';
      case 'accounts':
        return 'Quản trị Tài khoản';
      case 'treatments':
        return 'Giám sát Điều trị';
      case 'rooms-shifts':
        return 'Phòng & Ca trực';
      default:
        return 'Cổng Chủ phòng khám';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-dental-border sticky top-0 z-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left: Mobile hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-gray-600 hover:text-dental-accent hover:bg-dental-mint/40 transition-colors"
          aria-label="Mở menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-bold text-gray-800 tracking-tight">
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Right: Owner Profile Pill */}
      <div className="relative" ref={userMenuRef}>
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center gap-2 pl-3.5 pr-2.5 py-1.5 rounded-full bg-[#E8F8F5] border border-[#BDE8E0] hover:bg-[#DCF4F0] transition-colors text-sm font-medium text-[#0F2D2A]"
        >
          <span className="text-sm font-medium text-[#0F2D2A]">Chủ phòng khám</span>
          <div className="h-7 w-7 rounded-full bg-[#169C89] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            C
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
        </button>

        {/* User Dropdown */}
        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-dental-border shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs text-gray-500">Tài khoản quản trị</p>
              <p className="text-sm font-bold text-gray-800 truncate">
                {session.user?.tenDangNhap || 'Chủ phòng khám'}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F5] text-[#169C89] border border-[#BDE8E0]">
                CHU_PHONG_KHAM
              </span>
            </div>

            <button
              onClick={() => {
                setIsUserMenuOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
