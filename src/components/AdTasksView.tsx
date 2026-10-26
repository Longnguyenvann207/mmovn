import React, { useState } from 'react';
import { AdTask } from '../types/mmo';
import { formatNumber, formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import { PlaySquare, Clock, CheckCircle2, Eye, Filter } from 'lucide-react';

interface AdTasksViewProps {
  ads: AdTask[];
  onSelectAd: (ad: AdTask) => void;
}

export const AdTasksView: React.FC<AdTasksViewProps> = ({ ads, onSelectAd }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'Công nghệ', label: 'Công nghệ' },
    { id: 'Thương mại điện tử', label: 'Thương mại điện tử' },
    { id: 'Tài chính', label: 'Tài chính' },
    { id: 'Trò chơi', label: 'Trò chơi' },
    { id: 'Ẩm thực', label: 'Ẩm thực' },
  ];

  const visibleAds = ads.filter((ad) => ad.isActive !== false);

  const filteredAds = visibleAds.filter((ad) => {
    if (selectedCategory === 'all') return true;
    return ad.category === selectedCategory;
  });

  const totalAvailableReward = visibleAds
    .filter((a) => !a.isCompleted)
    .reduce((sum, item) => sum + item.reward, 0);

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <PlaySquare className="w-4 h-4" />
            <span>Nhiệm vụ xem quảng cáo trả phí (Paid-to-Click)</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Xem video quảng cáo & Nhận tiền liền tay
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Mỗi quảng cáo chỉ cần xem từ 12 - 25 giây, trả lời 1 câu hỏi xác thực đơn giản để nhận tiền ngay vào số dư ví.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-3.5 shrink-0 flex items-center gap-4">
          <div>
            <div className="text-[11px] text-slate-400">Tổng thù lao hôm nay</div>
            <div className="text-xl font-black text-amber-400 font-mono tabular-nums">
              {formatVND(totalAvailableReward)}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-[11px] text-slate-400">Chiến dịch khả dụng</div>
            <div className="text-xl font-bold text-white font-mono tabular-nums">
              {ads.filter((a) => !a.isCompleted).length} / {ads.length}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <div className="text-xs text-slate-500 mr-2 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Lọc theo:
        </div>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              sound.playTick();
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-emerald-400 text-slate-950 font-semibold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAds.map((ad) => {
          const isDone = ad.isCompleted;

          return (
            <div
              key={ad.id}
              className={`rounded-xl border transition-all flex flex-col justify-between overflow-hidden ${
                isDone
                  ? 'bg-slate-900/30 border-slate-800/60 opacity-60'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-emerald-500/5'
              }`}
            >
              {/* Image Preview with Category Tag */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-medium text-slate-300 border border-slate-800">
                  {ad.category}
                </div>
                <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono text-slate-300 flex items-center gap-1 border border-slate-800">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {ad.durationSec}s
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate font-medium">{ad.advertiser}</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0 font-mono">
                      <Eye className="w-3 h-3" />
                      {formatNumber(ad.viewsCount)}
                    </span>
                  </div>

                  <h3 className="mt-1.5 text-sm font-bold text-white line-clamp-2 leading-snug">
                    {ad.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {ad.description}
                  </p>
                </div>

                {/* Footer with Reward & Action */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">Thù lao hoàn tất</div>
                    <div className="text-base font-extrabold text-emerald-400 font-mono tabular-nums">
                      +{formatVND(ad.reward)}
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
                        sound.playTick();
                        onSelectAd(ad);
                      }}
                      className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all active:scale-95 shadow-md flex items-center gap-1.5"
                    >
                      <PlaySquare className="w-3.5 h-3.5" />
                      Xem ngay
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
