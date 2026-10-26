import React from 'react';
import { ActiveTab, AdTask, AppRegisterTask, SurveyTask, Transaction, UserProfile } from '../types/mmo';
import { formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import { getUserLevelProgress } from '../utils/level';
import {
  Sparkles,
  Calendar,
  PlaySquare,
  FileText,
  Gift,
  CreditCard,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Award,
  Smartphone,
  ArrowRight,
} from 'lucide-react';

interface HeroOverviewProps {
  user: UserProfile;
  setActiveTab: (tab: ActiveTab) => void;
  ads: AdTask[];
  surveys: SurveyTask[];
  transactions: Transaction[];
  appRegisters?: AppRegisterTask[];
  onSelectAd: (ad: AdTask) => void;
  onSelectSurvey: (survey: SurveyTask) => void;
  onOpenLevelModal: () => void;
}

export const HeroOverview: React.FC<HeroOverviewProps> = ({
  user,
  setActiveTab,
  ads,
  surveys,
  transactions,
  appRegisters = [],
  onSelectAd,
  onSelectSurvey,
  onOpenLevelModal,
}) => {
  const completedCount = transactions.filter((t) => t.type !== 'withdraw' && t.status === 'completed').length;
  const levelInfo = getUserLevelProgress(user.totalEarned, completedCount);

  const activeAds = ads.filter((a) => a.isActive !== false);
  const activeSurveys = surveys.filter((s) => s.isActive !== false);
  const featuredAd = activeAds.find((a) => !a.isCompleted) || activeAds[0];
  const featuredSurvey = activeSurveys.find((s) => !s.isCompleted) || activeSurveys[0];
  const featuredApp = appRegisters.find((a) => a.status !== 'approved') || appRegisters[0];

  const todayStr = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = user.lastCheckInDate === todayStr;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Visual Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Column: Headline and Pitch */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-5 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-xs font-semibold text-emerald-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Nền tảng kiếm tiền online uy tín #1 Việt Nam</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Làm nhiệm vụ mỗi ngày <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                Nhận tiền mặt tức thì
              </span>
            </h1>

            <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
              Tích lũy thu nhập từ đăng ký tài khoản ngân hàng số/app, xem video quảng cáo ngắn, làm khảo sát và điểm danh. Hỗ trợ rút tiền miễn phí về MoMo, Ngân hàng và Thẻ cào chỉ trong 1 phút.
            </p>

            {/* Quick Actions Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveTab('app_register');
                  sound.playTick();
                }}
                className="px-5 py-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 hover:from-amber-300 hover:to-teal-200 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-slate-950" />
                <span>Đăng ký App nhận tới 80.000₫</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('ads');
                  sound.playTick();
                }}
                className="px-5 py-3 text-xs font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlaySquare className="w-4 h-4 text-emerald-400" />
                <span>Xem quảng cáo</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero 3D Graphic */}
          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[320px] overflow-hidden">
            <img
              src="/src/assets/images/mmo_hero_banner_1792935622574.jpg"
              alt="MMO VN Digital Earnings Dashboard"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center lg:object-right filter brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-slate-950 lg:via-transparent lg:to-transparent" />
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* MEMBER LEVEL PROGRESS BAR & TIERS CARD */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl relative overflow-hidden transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {levelInfo.currentTier.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${levelInfo.currentTier.badgeBg} ${levelInfo.currentTier.badgeBorder} ${levelInfo.currentTier.badgeColor}`}
                >
                  Cấp {levelInfo.currentTier.level} · {levelInfo.currentTier.name}
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-900 px-2 py-0.5 rounded-full">
                  {levelInfo.currentTier.multiplierLabel}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                {levelInfo.currentTier.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Đã hoàn thành <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{completedCount} nhiệm vụ</strong> · Tổng thu nhập: <strong className="text-slate-900 dark:text-white font-mono">{formatVND(user.totalEarned)}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onOpenLevelModal();
              sound.playTick();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <span>Xem lộ trình 6 cấp bậc</span>
            <ChevronRight className="w-4 h-4 text-amber-500" />
          </button>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              {levelInfo.isMaxLevel ? (
                <span className="text-amber-500 font-bold">👑 Bạn đã đạt Cấp Độ Tối Thượng (Kim Cương)!</span>
              ) : (
                <>
                  Tiến trình lên <strong className="text-slate-900 dark:text-white">{levelInfo.nextTier?.name}</strong>:
                </>
              )}
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {levelInfo.progressPercent}%
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${levelInfo.currentTier.gradient} transition-all duration-700 shadow-sm`}
              style={{ width: `${Math.max(5, levelInfo.progressPercent)}%` }}
            />
          </div>

          {!levelInfo.isMaxLevel && levelInfo.nextTier && (
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              <span>
                Cần thêm: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">+{formatVND(levelInfo.earnedNeeded)}</strong> kiếm được hoặc <strong className="text-amber-600 dark:text-amber-400 font-mono">+{levelInfo.tasksNeeded} nhiệm vụ</strong>
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Mở khóa {levelInfo.nextTier.multiplierLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* NEW OFFER HIGHLIGHT: Đăng Ký Tài Khoản Web / App */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-emerald-950/40 border border-blue-200 dark:border-blue-900/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-colors">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              🔥 Thù lao cao nhất
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Đăng Ký Tài Khoản Web & Cài App Đối Tác (25.000₫ – 80.000₫)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Mở tài khoản MBBank, Cake by VPBank, Binance, ShopeePay hoặc TNEX. Nhận tiền thật trực tiếp vào ví sau khi gửi thông tin xác nhận.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTab('app_register');
            sound.playTick();
          }}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-2 shrink-0 transition-all cursor-pointer active:scale-95"
        >
          <span>Khám phá ngay</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Key Metric Strip (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Số dư khả dụng */}
        <div
          onClick={() => {
            setActiveTab('withdraw');
            sound.playTick();
          }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Số dư khả dụng</span>
            <CreditCard className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {formatVND(user.balance)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>Rút về MoMo / Ngân hàng</span>
            <ChevronRight className="w-3 h-3 text-emerald-500" />
          </div>
        </div>

        {/* Metric 2: Tổng đã kiếm */}
        <div
          onClick={() => {
            setActiveTab('history');
            sound.playTick();
          }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Tổng thu nhập đã kiếm</span>
            <TrendingUp className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            {formatVND(user.totalEarned)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Đang chờ duyệt: <strong className="text-slate-800 dark:text-slate-200 font-mono">{formatVND(user.pendingBalance)}</strong>
          </div>
        </div>

        {/* Metric 3: Chuỗi điểm danh */}
        <div
          onClick={() => {
            setActiveTab('checkin');
            sound.playTick();
          }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Chuỗi điểm danh</span>
            <Calendar className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400 font-mono tabular-nums">
            {user.streakDays} Ngày
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {hasCheckedInToday ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Đã điểm danh hôm nay</span>
            ) : (
              <span className="text-amber-600 dark:text-amber-300 font-semibold animate-pulse">Chưa điểm danh (Bấm nhận)</span>
            )}
          </div>
        </div>

        {/* Metric 4: Danh hiệu & Lượt quay */}
        <div
          onClick={() => {
            onOpenLevelModal();
            sound.playTick();
          }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Cấp độ & Vé quay</span>
            <Gift className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded border ${levelInfo.currentTier.badgeBg} ${levelInfo.currentTier.badgeBorder} ${levelInfo.currentTier.badgeColor}`}
            >
              {levelInfo.currentTier.icon} {levelInfo.currentTier.name}
            </span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
              {user.luckySpins} vé quay
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>Hưởng {levelInfo.currentTier.multiplierLabel}</span>
            <ChevronRight className="w-3 h-3 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Featured 3 Main Pillars Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            Nhiệm vụ kiếm tiền trọng tâm hôm nay
          </h2>
          <span className="text-xs text-slate-500">Cập nhật liên tục 24/7</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Điểm danh hằng ngày */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-amber-400 dark:hover:border-slate-700 transition-all shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Điểm danh hằng ngày</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Đăng nhập đều đặn 7 ngày liên tục để nhận thưởng tiền mặt lũy tiến và rương báu 25.000₫.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Trạng thái</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {hasCheckedInToday ? 'Đã nhận hôm nay' : 'Sẵn sàng nhận thưởng'}
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('checkin');
                  sound.playTick();
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                {hasCheckedInToday ? 'Xem chuỗi' : 'Điểm danh ngay'}
              </button>
            </div>
          </div>

          {/* Pillar 2: Xem quảng cáo */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-emerald-400 dark:hover:border-slate-700 transition-all shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <PlaySquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Xem quảng cáo PTC</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Xem video thương hiệu chỉ từ 15 giây, trả lời câu hỏi xác minh và nhận tiền mặt ngay.
              </p>
              {featuredAd && (
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-xs">
                  <span className="text-slate-600 dark:text-slate-400 line-clamp-1">{featuredAd.title}</span>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    +{formatVND(featuredAd.reward)} · {featuredAd.durationSec}s
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Còn khả dụng</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activeAds.filter((a) => !a.isCompleted).length} chiến dịch
                </div>
              </div>
              <button
                onClick={() => {
                  if (featuredAd && !featuredAd.isCompleted) {
                    onSelectAd(featuredAd);
                  } else {
                    setActiveTab('ads');
                  }
                  sound.playTick();
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
              >
                Xem ngay
              </button>
            </div>
          </div>

          {/* Pillar 3: Khảo sát thị trường */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-teal-400 dark:hover:border-slate-700 transition-all shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Khảo sát thị trường</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Nhiệm vụ có thù lao cao (15.000₫ – 25.000₫). Trả lời các câu hỏi về tài chính, công nghệ và tiêu dùng.
              </p>
              {featuredSurvey && (
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-xs">
                  <span className="text-slate-600 dark:text-slate-400 line-clamp-1">{featuredSurvey.title}</span>
                  <div className="font-mono font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                    +{formatVND(featuredSurvey.reward)} · ~{featuredSurvey.estimatedMinutes} phút
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Thù lao tới</div>
                <div className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">
                  25.000₫ / bài
                </div>
              </div>
              <button
                onClick={() => {
                  if (featuredSurvey && !featuredSurvey.isCompleted) {
                    onSelectSurvey(featuredSurvey);
                  } else {
                    setActiveTab('surveys');
                  }
                  sound.playTick();
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors cursor-pointer"
              >
                Khảo sát ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Categories Grid: Vượt link, Review Map, MXH */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Nhiệm vụ đa dạng: Vượt link, Review Map & Mạng Xã Hội
          </h2>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Thù lao hấp dẫn</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Vượt link */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-amber-400 dark:hover:border-slate-700 transition-all shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-base">
                🔗
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Vượt Link Rút Gọn</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tìm kiếm từ khóa trên Google, vào trang đích lấy mã bí mật 6 số và nhận tiền mặt ngay vào ví.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Thù lao mỗi link</div>
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">3.000₫ – 4.000₫</div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('shortlink');
                  sound.playTick();
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Vượt link
              </button>
            </div>
          </div>

          {/* Card 2: Review Map */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-rose-400 dark:hover:border-slate-700 transition-all shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-base">
                📍
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Review Google Maps 5 Sao</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Đánh giá địa điểm nhà hàng, khách sạn và phòng khám theo nội dung mẫu sẵn có. Thù lao cực cao.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Thù lao mỗi review</div>
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">25.000₫ – 30.000₫</div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('map_review');
                  sound.playTick();
                }}
                className="px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
              >
                Nhận review
              </button>
            </div>
          </div>

          {/* Card 3: Mạng Xã Hội */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-slate-700 transition-all shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-base">
                📱
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Nhiệm Vụ Mạng Xã Hội</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Like video TikTok, Follow Fanpage Facebook, Subscribe kênh Youtube và Follow Instagram.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Thù lao tương tác</div>
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">2.000₫ – 4.500₫</div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('social');
                  sound.playTick();
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-indigo-400 hover:bg-indigo-300 rounded-lg transition-colors cursor-pointer"
              >
                Làm ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Payout Guarantee Footer Callout */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bảo chứng chi trả 100% minh bạch & uy tín</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Hệ thống xử lý lệnh rút tiền tự động qua MoMo, ZaloPay và Chuyển khoản ngân hàng 24/7.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTab('withdraw');
            sound.playTick();
          }}
          className="px-4 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl transition-colors whitespace-nowrap cursor-pointer shadow-sm"
        >
          Kiểm tra quy định rút tiền →
        </button>
      </div>
    </div>
  );
};
