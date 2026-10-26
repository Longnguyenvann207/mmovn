import React, { useState } from 'react';
import { MapReviewTask } from '../types/mmo';
import { formatNumber, formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { MapPin, Star, Copy, Check, CheckCircle2, ArrowRight, X, ExternalLink, ShieldCheck } from 'lucide-react';

interface MapReviewViewProps {
  reviews: MapReviewTask[];
  onCompleteTask: (taskId: string, reward: number) => void;
}

export const MapReviewView: React.FC<MapReviewViewProps> = ({
  reviews,
  onCompleteTask,
}) => {
  const [activeTask, setActiveTask] = useState<MapReviewTask | null>(null);
  const [googleName, setGoogleName] = useState('Minh Quân (Local Guide)');
  const [copiedReview, setCopiedReview] = useState(false);
  const [hasOpenedMap, setHasOpenedMap] = useState(false);

  const visibleReviews = reviews.filter((r) => r.isActive !== false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedReview(true);
    sound.playTick();
    setTimeout(() => setCopiedReview(false), 2000);
  };

  const handleOpenMap = (url: string) => {
    window.open(url, '_blank');
    setHasOpenedMap(true);
    sound.playTick();
  };

  const handleSubmitReview = () => {
    if (!activeTask) return;

    sound.playSuccess();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });

    onCompleteTask(activeTask.id, activeTask.reward);
    setActiveTask(null);
    setHasOpenedMap(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/40 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-1">
            <MapPin className="w-4 h-4" />
            <span>Nhiệm vụ Đánh giá Google Maps (5-Star Maps Review)</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Review Google Maps thù lao cao tới 30.000₫ / địa điểm
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Đánh giá 5 sao kèm bài viết mẫu chân thực cho nhà hàng, khách sạn và phòng khám. Nhiệm vụ có thù lao cao nhất trên hệ thống MMO VN.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-3.5 shrink-0 flex items-center gap-4">
          <div>
            <div className="text-[11px] text-slate-400">Thù lao trung bình</div>
            <div className="text-xl font-bold text-rose-400 font-mono tabular-nums">
              25.000₫ – 30.000₫
            </div>
          </div>
        </div>
      </div>

      {/* Guide Note */}
      <div className="p-3.5 bg-rose-950/20 border border-rose-900/40 rounded-xl flex items-center gap-3 text-xs text-rose-300">
        <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
        <span>
          Lưu ý quan trọng: Vui lòng để lại đánh giá 5 sao và sao chép đúng nội dung gợi ý để hệ thống tự động quét và duyệt thù lao nhanh nhất.
        </span>
      </div>

      {/* Map Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleReviews.map((task) => {
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
                  <span className="font-bold text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-800/60">
                    {task.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-mono text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>5.0</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-500">{formatNumber(task.reviewsCount)} review</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
                  {task.title}
                </h3>

                <div className="text-xs text-slate-400 flex items-start gap-1.5 leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{task.address}</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                  <div className="text-[10px] text-slate-500 font-medium">BÀI ĐÁNH GIÁ MẪU:</div>
                  <p className="text-slate-300 mt-1 line-clamp-2 italic">
                    "{task.suggestedContent}"
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Thù lao đánh giá</div>
                  <div className="text-lg font-black text-emerald-400 font-mono tabular-nums">
                    +{formatVND(task.reward)}
                  </div>
                </div>

                {isDone ? (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Đã nhận tiền</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveTask(task);
                      setCopiedReview(false);
                      setHasOpenedMap(false);
                      sound.playTick();
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-all active:scale-95 shadow-md flex items-center gap-1.5"
                  >
                    <span>Nhận review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Modal */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold text-white truncate max-w-xs">{activeTask.placeName}</h3>
              </div>
              <button onClick={() => setActiveTask(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Address card */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Địa chỉ địa điểm:</div>
                <div className="font-semibold text-white mt-0.5">{activeTask.address}</div>
              </div>

              {/* Step 1: Open Google Maps */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="font-semibold text-rose-400 flex items-center justify-between">
                  <span>Bước 1: Mở địa điểm trên Google Maps</span>
                  {hasOpenedMap && <span className="text-emerald-400 text-[11px] font-normal flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Đã mở</span>}
                </div>
                <button
                  onClick={() => handleOpenMap(activeTask.mapUrl)}
                  className="w-full py-2.5 px-3 bg-rose-600/90 hover:bg-rose-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Mở Google Maps để viết đánh giá</span>
                </button>
              </div>

              {/* Step 2: Copy Content */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="font-semibold text-amber-400 flex items-center justify-between">
                  <span>Bước 2: Sao chép bài đánh giá mẫu 5 sao:</span>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-slate-200 leading-relaxed italic">
                  "{activeTask.suggestedContent}"
                </div>

                <button
                  onClick={() => handleCopy(activeTask.suggestedContent)}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copiedReview ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedReview ? 'Đã sao chép nội dung!' : 'Sao chép nội dung bài đánh giá'}</span>
                </button>
              </div>

              {/* Step 3: Confirmation */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="font-semibold text-slate-300">Bước 3: Tên tài khoản Google đã đánh giá:</div>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Minh Quân"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-medium focus:outline-none focus:border-rose-500"
                />
              </div>

            </div>

            <div className="pt-2">
              <button
                onClick={handleSubmitReview}
                className="w-full py-3 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400 hover:from-rose-400 hover:to-emerald-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hoàn tất & Nhận ngay {formatVND(activeTask.reward)}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
