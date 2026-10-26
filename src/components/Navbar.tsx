import React from 'react';
import { ActiveTab, UserProfile } from '../types/mmo';
import { formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import { getUserLevelProgress } from '../utils/level';
import { useTheme } from '../context/ThemeContext';
import {
  Volume2,
  VolumeX,
  Sparkles,
  CreditCard,
  Gift,
  FileText,
  PlaySquare,
  Calendar,
  ShieldCheck,
  User,
  Link2,
  MapPin,
  Share2,
  Smartphone,
  Sun,
  Moon,
} from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onOpenAuthModal: () => void;
  completedTasksCount?: number;
  onOpenLevelModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  onOpenAuthModal,
  completedTasksCount = 0,
  onOpenLevelModal,
}) => {
  const { theme, toggleTheme } = useTheme();

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    if (next) sound.playTick();
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'tasks', label: 'Tổng quan', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'ads', label: 'Xem quảng cáo', icon: <PlaySquare className="w-4 h-4" /> },
    { id: 'surveys', label: 'Làm khảo sát', icon: <FileText className="w-4 h-4" /> },
    { id: 'app_register', label: 'Đăng ký App', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'shortlink', label: 'Vượt link', icon: <Link2 className="w-4 h-4" /> },
    { id: 'map_review', label: 'Review Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'social', label: 'Nhiệm vụ MXH', icon: <Share2 className="w-4 h-4" /> },
    { id: 'checkin', label: 'Điểm danh', icon: <Calendar className="w-4 h-4" /> },
    { id: 'wheel', label: 'Vòng quay', icon: <Gift className="w-4 h-4" /> },
    { id: 'withdraw', label: 'Rút tiền', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const isAdmin = user.role === 'admin';
  const levelInfo = getUserLevelProgress(user.totalEarned, completedTasksCount);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => {
            setActiveTab('tasks');
            sound.playTick();
          }}
          className="flex items-center gap-2 cursor-pointer select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <span className="text-slate-950 font-black text-lg tracking-tighter">₫</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 whitespace-nowrap">
              MMO<span className="text-emerald-500 dark:text-emerald-400">VN</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  sound.playTick();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-900 shadow-sm border border-emerald-200 dark:border-slate-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Admin shortcut tab if user is admin */}
          {isAdmin && (
            <button
              onClick={() => {
                setActiveTab('admin');
                sound.playTick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'admin'
                  ? 'text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 shadow-sm'
                  : 'text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/40'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Admin Portal</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Wallet Counter & Primary Action & Auth Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Theme Toggle (Dark / Light Mode) */}
          <button
            onClick={() => {
              toggleTheme();
              sound.playTick();
            }}
            title={theme === 'dark' ? 'Chuyển sang Chế độ Sáng' : 'Chuyển sang Chế độ Tối'}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800 active:scale-95"
            aria-label="Chuyển đổi giao diện Sáng / Tối"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors hidden sm:block cursor-pointer"
            aria-label="Cài đặt âm thanh"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Member Level Badge button */}
          <button
            onClick={() => {
              if (onOpenLevelModal) {
                onOpenLevelModal();
                sound.playTick();
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
            title="Bấm để xem tiến trình thăng cấp & bảng đặc quyền"
          >
            <span className="text-sm">{levelInfo.currentTier.icon}</span>
            <div className="text-left hidden md:block">
              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider leading-none">
                Cấp {levelInfo.currentTier.level}
              </div>
              <div className={`text-xs font-bold leading-tight ${levelInfo.currentTier.textColor}`}>
                {levelInfo.currentTier.name}
              </div>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-900/60 px-1.5 py-0.2 rounded-full hidden lg:inline-block">
              {levelInfo.currentTier.multiplierLabel}
            </span>
          </button>

          {/* Wallet Balance Display */}
          <div
            onClick={() => {
              setActiveTab('withdraw');
              sound.playTick();
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:border-emerald-400 dark:hover:border-slate-700 transition-colors shadow-sm"
          >
            <div className="text-right">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                Số dư ví
              </div>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums leading-tight">
                {formatVND(user.balance)}
              </div>
            </div>
          </div>

          {/* User Account / Switch Button */}
          <button
            onClick={() => {
              sound.playTick();
              onOpenAuthModal();
            }}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all shrink-0 cursor-pointer shadow-sm"
            title="Đăng nhập / Đổi tài khoản"
          >
            <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="text-left hidden md:block max-w-[100px] truncate">
              <div className="truncate text-slate-900 dark:text-white text-[11px] leading-tight font-bold">
                {user.name}
              </div>
              <div className="text-[9px] text-emerald-600 dark:text-emerald-400 uppercase font-mono">
                {user.role === 'admin' ? 'Quản trị' : levelInfo.currentTier.name}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation bar */}
      <div className="xl:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-200 dark:border-slate-900 gap-1.5 no-scrollbar bg-slate-50 dark:bg-slate-950">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                sound.playTick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}

        {isAdmin && (
          <button
            onClick={() => {
              setActiveTab('admin');
              sound.playTick();
            }}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'admin'
                ? 'text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-800'
                : 'text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        )}
      </div>
    </header>
  );
};
