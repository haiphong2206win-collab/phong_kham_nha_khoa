import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Bell,
  Search,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import type { AuthSession } from '@/types/auth';
import type { DoctorNavTab, DoctorNotification } from '@/types/doctor';
import { doctorService } from '@/services/doctor.service';

interface DoctorHeaderProps {
  currentTab: DoctorNavTab;
  session: AuthSession;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectTab: (tab: DoctorNavTab) => void;
}

export const DoctorHeader: React.FC<DoctorHeaderProps> = ({
  currentTab,
  session,
  onLogout,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  onSelectTab,
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<DoctorNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Load unread notification count
  const fetchNotifs = async () => {
    try {
      const [count, list] = await Promise.all([
        doctorService.getUnreadNotificationCount().catch(() => 0),
        doctorService.getNotifications().catch(() => []),
      ]);
      setUnreadCount(count);
      setNotifications(list);
    } catch {
      // Ignore background notification fetch errors
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 45000); // 45s poll
    return () => clearInterval(interval);
  }, []);

  // Handle outside click for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await doctorService.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.maThongBao === id ? { ...n, daDoc: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error('Failed to mark read', e);
    }
  };

  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'overview':
        return 'Tổng quan';
      case 'appointments':
        return 'Lịch khám của tôi';
      case 'consultation':
        return 'Khám & Điều trị';
      case 'treatment-plan':
        return 'Lộ trình điều trị';
      default:
        return 'Tổng quan';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E3ECE9] px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-dental-text hover:bg-dental-mint/30 transition-colors"
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5 text-dental-text" />
          </button>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500">
            <span className="text-slate-400">Không gian Bác sĩ</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-semibold">{getBreadcrumbTitle()}</span>
          </div>
        </div>

        {/* Right: Search, Notifications & User Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Search bar */}
          <div className="relative hidden sm:block w-48 md:w-64 lg:w-72">
            <input
              type="text"
              placeholder="Tìm kiếm trong lịch khám..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentTab !== 'appointments' && e.target.value.trim().length > 0) {
                  onSelectTab('appointments');
                }
              }}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs md:text-sm bg-[#F5F8F7] border border-[#E0EBE8] rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#169C89]/30 focus:border-[#169C89] transition-all placeholder:text-slate-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Thông báo hệ thống"
              aria-label="Thông báo"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">Thông báo</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-[#169C89] font-semibold border border-teal-200">
                        {unreadCount} mới
                      </span>
                    )}
                  </div>
                  <button
                    onClick={fetchNotifs}
                    className="text-xs text-[#169C89] hover:underline"
                  >
                    Làm mới
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      Chưa có thông báo nào
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.maThongBao}
                        onClick={() => !n.daDoc && handleMarkAsRead(n.maThongBao)}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                          !n.daDoc ? 'bg-teal-50/40' : ''
                        }`}
                      >
                        <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${!n.daDoc ? 'bg-[#169C89]' : 'bg-transparent'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${!n.daDoc ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                            {n.tieuDe}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                            {n.noiDung}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {n.thoiGianGui ? new Date(n.thoiGianGui).toLocaleString('vi-VN') : ''}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(prev => !prev)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-[#D5E5E1] bg-white hover:bg-slate-50 transition-all shadow-2xs"
            >
              <div className="h-7 w-7 rounded-full bg-[#169C89] text-white flex items-center justify-center font-bold text-xs tracking-wider">
                BS
              </div>
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline max-w-[120px] truncate">
                {session.user?.tenDangNhap || 'Bác sĩ'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#169C89]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#169C89]">
                      BÁC SĨ CHUYÊN KHOA
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 mt-1 truncate">
                    {session.user?.tenDangNhap}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    Nha Khoa Nụ Cười Xanh
                  </p>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onSelectTab('appointments');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
                  >
                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    <span>Lịch khám của tôi</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất tài khoản</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
