import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  User, 
  LogOut, 
  Globe
} from 'lucide-react';
import type { AuthSession } from '@/types/auth';
import type { BenhNhanProfile } from '@/types/patient';

interface PatientHeaderProps {
  session: AuthSession;
  profile: BenhNhanProfile | null;
  onOpenMobileMenu: () => void;
  onNavigateTab?: (tab: 'profile' | 'notifications') => void;
  onGoToLanding?: () => void;
  onLogout?: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  session,
  profile,
  onOpenMobileMenu,
  onNavigateTab,
  onGoToLanding,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.hoTen || session.user?.tenDangNhap || 'Nguyễn Thị Như Ngọc';
  const roleDisplay = 'Bệnh nhân';

  // Keyboard shortcut Ctrl + K / Cmd + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 px-4 sm:px-6 lg:px-8 bg-white/95 backdrop-blur-md border-b border-[#E5EFEA] flex items-center justify-between sticky top-0 z-20 select-none">
      {/* 1. Left Search Input & Mobile Menu Toggle */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-2xl border border-[#E3ECE9] hover:bg-[#F0F7F5] text-[#344C52] transition-colors"
          aria-label="Mở menu điều hướng"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search input field with shortcut badge (khớp ảnh tham khảo) */}
        <div className="relative w-full hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A9A93]">
            <Search className="h-4 w-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm dịch vụ, bác sĩ, thông tin..."
            className="w-full pl-10 pr-20 py-2.5 bg-[#F6FAF9] hover:bg-[#F0F7F5] focus:bg-white text-xs sm:text-[13px] text-[#2D4A43] placeholder-[#8EA59E] border border-[#E1ECE7] focus:border-[#70B8AC] rounded-2xl outline-hidden transition-all shadow-2xs"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-[#6B858D] bg-white border border-[#D5E3DE] rounded-lg shadow-2xs">
              Ctrl + K
            </kbd>
          </div>
        </div>
      </div>

      {/* 2. Right Actions: Notifications & User Identity Pill */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-2.5 rounded-2xl text-[#4A676E] hover:text-[#169C89] hover:bg-[#E8F6F2] transition-colors"
            aria-label="Thông báo"
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* Notifications Dropdown Popover */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#EBF2F0]">
                <h4 className="text-xs font-bold text-[#1E384C]">Thông báo của bạn</h4>
                <span className="text-[10px] font-semibold text-[#7A9A93] bg-[#F0F5F3] px-2 py-0.5 rounded-full">
                  0 chưa đọc
                </span>
              </div>

              <div className="py-6 px-4 text-center space-y-2">
                <div className="h-10 w-10 rounded-2xl bg-[#E8F6F2] text-[#169C89] flex items-center justify-center mx-auto">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#1E384C] block">
                    Chưa có thông báo mới
                  </span>
                  <p className="text-[11px] text-[#7A9A93] leading-relaxed max-w-xs mx-auto">
                    Thông báo về xác nhận lịch hẹn và lịch tái khám sẽ hiển thị tại đây khi bác sĩ cập nhật.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Identity Pill (Avatar + Tên + Vai trò + Dropdown) */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 pl-1 pr-2.5 py-1 rounded-2xl hover:bg-[#F0F7F5] transition-all group"
          >
            {/* Avatar Circle with soft border */}
            <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-[#70B8AC]/40 bg-[#E8F6F2] flex items-center justify-center text-[#169C89] font-bold text-sm shrink-0">
              {/* Fallback to styled photo avatar or user initial */}
              <img
                src="/backgrounds/bg-smile-left.jpg"
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails, hide img and show initial
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center bg-[#169C89] text-white text-xs font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* User Info Text */}
            <div className="text-left hidden sm:block">
              <span className="text-[13px] font-bold text-[#1E384C] block leading-tight group-hover:text-[#169C89] transition-colors">
                {displayName}
              </span>
              <span className="text-[11px] text-[#7A9A93] font-medium block">
                {roleDisplay}
              </span>
            </div>

            {/* Dropdown Chevron */}
            <ChevronDown className="h-4 w-4 text-[#7A9A93] group-hover:text-[#169C89] transition-transform duration-150" />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-[#E3ECE9] shadow-soft-card p-3 space-y-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#EBF2F0] space-y-0.5">
                <span className="text-xs font-bold text-[#1E384C] block truncate">
                  {displayName}
                </span>
                <span className="text-[11px] text-[#7A9A93] block truncate">
                  {session.user?.tenDangNhap || 'Tài khoản bệnh nhân'}
                </span>
                {profile?.soDienThoai && (
                  <span className="text-[10px] text-[#169C89] font-medium block">
                    SĐT: {profile.soDienThoai}
                  </span>
                )}
              </div>

              <div className="space-y-1 text-xs">
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateTab('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#E8F6F2] hover:text-[#169C89] text-[#344C52] font-semibold transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Hồ sơ cá nhân</span>
                  </button>
                )}

                {onGoToLanding && (
                  <button
                    type="button"
                    onClick={() => {
                      onGoToLanding();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#E8F6F2] hover:text-[#169C89] text-[#344C52] font-semibold transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Trang chủ phòng khám</span>
                  </button>
                )}

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-semibold transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
