import React from 'react';
import { DAILY_CHECKIN_SCHEDULE } from '../data/initialData';
import { UserProfile } from '../types/mmo';
import { formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Calendar, CheckCircle2, Gift, Flame, ShieldAlert, Sparkles, Clock } from 'lucide-react';

interface DailyCheckInViewProps {
  user: UserProfile;
  onCheckIn: (dayNumber: number, rewardAmount: number) => void;
}

export const DailyCheckInView: React.FC<DailyCheckInViewProps> = ({ user, onCheckIn }) => {
  // Check if user has already checked in today (based on lastCheckInDate matching today)
  const todayStr = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = user.lastCheckInDate === todayStr;

  // Next day in the 7-day cycle
  const currentDayIndex = (user.streakDays % 7);
  const nextRewardDay = DAILY_CHECKIN_SCHEDULE[currentDayIndex] || DAILY_CHECKIN_SCHEDULE[0];

  const handleClaim = () => {
    if (hasCheckedInToday) return;

    sound.playCoin();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });

    onCheckIn(nextRewardDay.day, nextRewardDay.reward);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span>Chuỗi điểm danh liên tiếp: {user.streakDays} ngày</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Điểm danh hằng ngày nhận tiền thưởng
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Duy trì chuỗi đăng nhập mỗi ngày để nhận số tiền thưởng lũy tiến. Đạt mốc ngày thứ 7 để mở khóa Rương Thần Tài trị giá lên tới 25.000₫!
            </p>
          </div>

          {/* Action Card */}
          <div className="shrink-0 bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center min-w-[240px] text-center">
            {hasCheckedInToday ? (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Đã điểm danh hôm nay!</div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center justify-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Quay lại vào 00:00 ngày mai
                  </div>
                </div>
                <button
                  disabled
                  className="w-full py-2 px-4 rounded-lg bg-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed"
                >
                  Đã nhận thưởng
                </button>
              </div>
            ) : (
              <div className="space-y-3 w-full">
                <div className="text-xs text-slate-400">Thưởng điểm danh hôm nay:</div>
                <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
                  +{formatVND(nextRewardDay.reward)}
                </div>
                <button
                  onClick={handleClaim}
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 hover:from-amber-300 hover:to-teal-200 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  Điểm danh ngay
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 7-Day Road / Schedule */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Lộ trình thưởng 7 ngày
          </span>
          <span>Chu kỳ tự động quay vòng sau 7 ngày</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {DAILY_CHECKIN_SCHEDULE.map((item, idx) => {
            const isCompleted = idx < currentDayIndex || (idx === currentDayIndex && hasCheckedInToday);
            const isCurrent = idx === currentDayIndex && !hasCheckedInToday;
            const isSpecial = item.isSpecial;

            return (
              <div
                key={item.day}
                className={`relative rounded-xl p-4 flex flex-col justify-between transition-all border ${
                  isCompleted
                    ? 'bg-slate-900/60 border-emerald-900/40 text-slate-300'
                    : isCurrent
                    ? 'bg-gradient-to-b from-slate-900 to-emerald-950/40 border-emerald-400/80 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-400/50 scale-[1.02]'
                    : isSpecial
                    ? 'bg-gradient-to-b from-amber-950/20 to-slate-900 border-amber-500/30'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-80'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Ngày {item.day}</span>
                  {isCompleted ? (
                    <span className="text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : isSpecial ? (
                    <span className="text-amber-400">
                      <Gift className="w-4 h-4" />
                    </span>
                  ) : null}
                </div>

                {/* Reward Amount */}
                <div className="my-3 text-center">
                  <div
                    className={`text-lg font-black font-mono tabular-nums ${
                      isCompleted
                        ? 'text-slate-400 line-through'
                        : isCurrent
                        ? 'text-emerald-400'
                        : isSpecial
                        ? 'text-amber-400'
                        : 'text-slate-200'
                    }`}
                  >
                    {formatVND(item.reward)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">{item.bonusTitle}</div>
                </div>

                {/* Status tag */}
                <div className="text-center pt-1 border-t border-slate-800/60">
                  {isCompleted ? (
                    <span className="text-[11px] text-emerald-400 font-medium">Đã nhận</span>
                  ) : isCurrent ? (
                    <span className="text-[11px] text-emerald-300 font-bold animate-pulse">Sẵn sàng nhận</span>
                  ) : (
                    <span className="text-[11px] text-slate-500">Chưa mở</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Check-in rules & Protection guide */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">Giữ chuỗi không đứt đoạn</h4>
            <p className="mt-0.5 text-slate-400">Nếu bỏ lỡ 1 ngày, chuỗi sẽ quay về ngày 1. Hãy đặt báo thức điểm danh mỗi ngày!</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">Tặng thêm vé quay may mắn</h4>
            <p className="mt-0.5 text-slate-400">Mỗi lần điểm danh thành công, bạn được tặng kèm +1 lượt quay Vòng Quay May Mắn.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">Bảo lưu số dư vĩnh viễn</h4>
            <p className="mt-0.5 text-slate-400">Tiền thưởng điểm danh được cộng thẳng vào số dư khả dụng và có thể rút ngay khi đạt hạn mức.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
