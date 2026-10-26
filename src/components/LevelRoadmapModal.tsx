import React from 'react';
import { UserLevelProgress, LEVEL_TIERS } from '../utils/level';
import { formatVND } from '../utils/format';
import { X, CheckCircle2, Lock, Sparkles, ChevronRight, Zap } from 'lucide-react';

interface LevelRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  progressInfo: UserLevelProgress;
  totalEarned: number;
}

export const LevelRoadmapModal: React.FC<LevelRoadmapModalProps> = ({
  isOpen,
  onClose,
  progressInfo,
  totalEarned,
}) => {
  if (!isOpen) return null;

  const { currentTier, nextTier, progressPercent, earnedNeeded, tasksNeeded, isMaxLevel, completedTasksCount } =
    progressInfo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold text-base shadow-md">
              👑
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Hệ Thống Cấp Bậc & Danh Hiệu Thành Viên
              </h3>
              <p className="text-[11px] text-slate-400">
                Gia tăng thu nhập với đặc quyền nhân hệ số thù lao khi thăng hạng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Đóng bảng cấp bậc"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Level Status Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-700/80 flex items-center justify-center text-3xl shadow-lg shrink-0">
                {currentTier.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${currentTier.badgeBg} ${currentTier.badgeBorder} ${currentTier.badgeColor}`}>
                    Cấp {currentTier.level} · {currentTier.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded-full">
                    {currentTier.multiplierLabel}
                  </span>
                </div>
                <h4 className="text-lg font-black text-white mt-1">
                  {currentTier.title}
                </h4>
                <p className="text-xs text-slate-400">
                  Tổng kiếm: <strong className="text-white font-mono">{formatVND(totalEarned)}</strong> · Đã hoàn thành: <strong className="text-emerald-400 font-mono">{completedTasksCount} nhiệm vụ</strong>
                </p>
              </div>
            </div>

            {!isMaxLevel && nextTier && (
              <div className="text-left sm:text-right">
                <div className="text-[11px] text-slate-400">Mục tiêu kế tiếp:</div>
                <div className="text-sm font-bold text-white flex items-center sm:justify-end gap-1.5 mt-0.5">
                  <span>{nextTier.icon}</span>
                  <span>{nextTier.name}</span>
                  <span className="text-emerald-400 text-xs">({nextTier.multiplierLabel})</span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {!isMaxLevel && nextTier ? (
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tiến trình thăng cấp:</span>
                </span>
                <span className="font-mono font-black text-emerald-400">
                  {progressPercent}%
                </span>
              </div>

              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>
                  Còn thiếu: <strong className="text-amber-400">+{formatVND(earnedNeeded)}</strong> hoặc <strong className="text-emerald-400">{tasksNeeded} nhiệm vụ</strong>
                </span>
                <span>Mốc: {formatVND(nextTier.minEarned)}</span>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-cyan-950/40 border border-cyan-800/80 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Chúc mừng bạn đã đạt cấp bậc cao nhất: <strong>Huyền Thoại Kim Cương</strong> với đặc quyền +30% thù lao tối đa!
              </span>
            </div>
          )}
        </div>

        {/* All Tiers Roadmap List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Lộ trình 6 cấp bậc & Đặc quyền thù lao:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {LEVEL_TIERS.map((tier) => {
              const isCurrent = tier.level === currentTier.level;
              const isUnlocked = totalEarned >= tier.minEarned || completedTasksCount >= tier.minTasks;

              return (
                <div
                  key={tier.id}
                  className={`relative p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-slate-950 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                      : isUnlocked
                      ? 'bg-slate-950/80 border-slate-800'
                      : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-2.5 right-4 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                      Cấp hiện tại
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{tier.icon}</span>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>{tier.name}</span>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${tier.badgeBg} ${tier.badgeBorder} ${tier.badgeColor}`}>
                              {tier.multiplierLabel}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">{tier.title}</div>
                        </div>
                      </div>

                      {isUnlocked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                    </div>

                    <div className="mt-2 text-[11px] text-slate-400 font-mono bg-slate-900/80 p-1.5 rounded border border-slate-800/80">
                      Yêu cầu: Từ <strong>{formatVND(tier.minEarned)}</strong> hoặc <strong>{tier.minTasks} nhiệm vụ</strong>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      {tier.perks.map((perk, pIdx) => (
                        <div key={pIdx} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-snug">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-900 text-[10px] text-slate-400 italic">
                    "{tier.tagline}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
