import React, { useState } from 'react';
import { SocialTask } from '../types/mmo';
import { formatNumber, formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  Share2,
  ThumbsUp,
  UserPlus,
  PlaySquare,
  Instagram,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  X,
  Filter,
  Sparkles
} from 'lucide-react';

interface SocialTasksViewProps {
  socialTasks: SocialTask[];
  onCompleteTask: (taskId: string, reward: number) => void;
}

export const SocialTasksView: React.FC<SocialTasksViewProps> = ({
  socialTasks,
  onCompleteTask,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [activeTask, setActiveTask] = useState<SocialTask | null>(null);
  const [hasVisited, setHasVisited] = useState(false);
  const [checking, setChecking] = useState(false);

  const visibleTasks = socialTasks.filter((t) => t.isActive !== false);

  const filtered = visibleTasks.filter((t) => {
    if (selectedPlatform === 'all') return true;
    return t.platform === selectedPlatform;
  });

  const getPlatformIcon = (platform: SocialTask['platform']) => {
    switch (platform) {
      case 'tiktok':
        return <span className="font-black text-pink-400">TikTok</span>;
      case 'facebook':
        return <span className="font-black text-blue-400">Facebook</span>;
      case 'youtube':
        return <span className="font-black text-red-400">YouTube</span>;
      case 'instagram':
        return <span className="font-black text-purple-400">Instagram</span>;
    }
  };

  const getActionBadge = (action: SocialTask['actionType']) => {
    switch (action) {
      case 'like':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60">
            <ThumbsUp className="w-3 h-3 text-rose-400" /> Like / Thả tim
          </span>
        );
      case 'follow':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/60">
            <UserPlus className="w-3 h-3 text-teal-400" /> Follow Trang / Kênh
          </span>
        );
      case 'subscribe':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-red-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60">
            <PlaySquare className="w-3 h-3 text-red-400" /> Subscribe Kênh
          </span>
        );
      default:
        return (
          <span className="text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            Tương tác MXH
          </span>
        );
    }
  };

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
    setHasVisited(true);
    sound.playTick();
  };

  const handleVerifyAndClaim = () => {
    if (!activeTask) return;
    setChecking(true);
    sound.playTick();

    setTimeout(() => {
      setChecking(false);
      sound.playSuccess();
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 },
      });
      onCompleteTask(activeTask.id, activeTask.reward);
      setActiveTask(null);
      setHasVisited(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
            <Share2 className="w-4 h-4" />
            <span>Nhiệm vụ Mạng Xã Hội (Facebook, TikTok, YouTube, Instagram)</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Like bài viết, Follow trang & Kênh nhận tiền liền tay
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Tương tác thật với các tài khoản mạng xã hội của đối tác: Like video TikTok, Follow Fanpage, Subscribe kênh Youtube.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-3.5 shrink-0 flex items-center gap-4">
          <div>
            <div className="text-[11px] text-slate-400">Nhiệm vụ khả dụng</div>
            <div className="text-xl font-bold text-indigo-400 font-mono tabular-nums">
              {filtered.filter((t) => !t.isCompleted).length} / {filtered.length} nhiệm vụ
            </div>
          </div>
        </div>
      </div>

      {/* Platform Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <div className="text-xs text-slate-500 mr-2 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Nền tảng:
        </div>
        {[
          { id: 'all', label: 'Tất cả MXH' },
          { id: 'tiktok', label: 'TikTok' },
          { id: 'facebook', label: 'Facebook' },
          { id: 'youtube', label: 'YouTube' },
          { id: 'instagram', label: 'Instagram' },
        ].map((plat) => (
          <button
            key={plat.id}
            onClick={() => { setSelectedPlatform(plat.id); sound.playTick(); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedPlatform === plat.id
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {plat.label}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((task) => {
          const isDone = task.isCompleted;

          return (
            <div
              key={task.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                isDone
                  ? 'bg-slate-900/30 border-slate-800/60 opacity-60'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:shadow-xl'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  {getPlatformIcon(task.platform)}
                  {getActionBadge(task.actionType)}
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                  {task.title}
                </h3>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                  <div className="text-[10px] text-slate-500 font-medium">ĐỐI TÁC:</div>
                  <div className="font-mono font-semibold text-slate-200 truncate">
                    {task.targetName}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                    {task.guideText}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Thù lao hoàn tất</div>
                  <div className="text-base font-extrabold text-emerald-400 font-mono tabular-nums">
                    +{formatVND(task.reward)}
                  </div>
                </div>

                {isDone ? (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Đã nhận</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveTask(task);
                      setHasVisited(false);
                      setChecking(false);
                      sound.playTick();
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-indigo-400 hover:bg-indigo-300 rounded-lg transition-all active:scale-95 shadow-md flex items-center gap-1.5"
                  >
                    <span>Làm ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Execution Modal */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Nhiệm vụ {activeTask.platform.toUpperCase()}</h3>
              </div>
              <button onClick={() => setActiveTask(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-slate-400 text-[11px]">Nội dung yêu cầu:</div>
                <h4 className="text-sm font-bold text-white mt-0.5">{activeTask.title}</h4>
              </div>

              {/* Step 1 */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-semibold text-indigo-400">
                  <span>Bước 1: Tới trang mạng xã hội đích</span>
                  {hasVisited && (
                    <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã mở liên kết
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleOpenLink(activeTask.targetUrl)}
                  className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Mở {activeTask.targetName} trên {activeTask.platform}</span>
                </button>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="font-semibold text-slate-300">Bước 2: Thực hiện tương tác</div>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  {activeTask.guideText}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleVerifyAndClaim}
                disabled={checking}
                className={`w-full py-3 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                  checking
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 hover:from-indigo-400 hover:to-emerald-300 text-slate-950'
                }`}
              >
                {checking ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    <span>Hệ thống đang kiểm tra tương tác...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Kiểm tra & Nhận {formatVND(activeTask.reward)}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
