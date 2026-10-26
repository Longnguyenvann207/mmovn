import React, { useState } from 'react';
import { TOP_LEADERBOARD } from '../data/initialData';
import { formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import { Trophy, Medal, Crown } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  const top3 = TOP_LEADERBOARD.slice(0, 3);
  const remaining = TOP_LEADERBOARD.slice(3);

  return (
    <div className="space-y-6">
      
      {/* Contest Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <Trophy className="w-4 h-4" />
            <span>Đua Top Nhận Thưởng Tiền Mặt Hằng Tuần</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Bảng Vàng Thu Nhập Thành Viên MMO VN
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Thành viên có thu nhập cao nhất mỗi tuần sẽ được trao thưởng tiền mặt tự động vào ví: Top 1: 500.000₫ · Top 2: 300.000₫ · Top 3: 150.000₫!
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
          {(['today', 'week', 'month'] as const).map((p) => {
            const labels = { today: 'Hôm nay', week: 'Tuần này', month: 'Tháng này' };
            return (
              <button
                key={p}
                onClick={() => { setPeriod(p); sound.playTick(); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  period === p
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {/* Rank 2 (Silver) */}
        <div className="md:order-1 p-5 rounded-2xl bg-slate-900 border border-slate-700/60 flex flex-col items-center text-center justify-between relative order-2">
          <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black text-sm flex items-center justify-center absolute -top-3 shadow-md">
            2
          </div>
          <div className="mt-2 space-y-2">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-400 mx-auto shadow-lg bg-slate-950">
              <img src={top3[1].avatar} alt={top3[1].name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-white text-sm">{top3[1].name}</h3>
            <span className="text-[11px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/80">
              {top3[1].level}
            </span>
          </div>

          <div className="w-full mt-4 pt-3 border-t border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400">Thu nhập hôm nay</div>
            <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
              {formatVND(top3[1].earnedToday)}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Tổng kiếm: {formatVND(top3[1].totalEarned)}
            </div>
          </div>
        </div>

        {/* Rank 1 (Gold) */}
        <div className="md:order-2 p-6 rounded-2xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-400/80 shadow-xl shadow-amber-500/10 flex flex-col items-center text-center justify-between relative order-1 md:-translate-y-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-base flex items-center justify-center absolute -top-5 shadow-lg border-2 border-slate-950">
            <Crown className="w-5 h-5 fill-slate-950" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400 mx-auto shadow-xl bg-slate-950">
              <img src={top3[0].avatar} alt={top3[0].name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-extrabold text-white text-base">{top3[0].name}</h3>
            <span className="text-xs text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-600/80 font-semibold">
              Quán Quân · {top3[0].level}
            </span>
          </div>

          <div className="w-full mt-4 pt-3 border-t border-slate-800 space-y-1">
            <div className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">Thu nhập hôm nay</div>
            <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
              {formatVND(top3[0].earnedToday)}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Tổng kiếm: {formatVND(top3[0].totalEarned)}
            </div>
          </div>
        </div>

        {/* Rank 3 (Bronze) */}
        <div className="md:order-3 p-5 rounded-2xl bg-slate-900 border border-amber-900/40 flex flex-col items-center text-center justify-between relative order-3">
          <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-black text-sm flex items-center justify-center absolute -top-3 shadow-md">
            3
          </div>
          <div className="mt-2 space-y-2">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-700 mx-auto shadow-lg bg-slate-950">
              <img src={top3[2].avatar} alt={top3[2].name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-white text-sm">{top3[2].name}</h3>
            <span className="text-[11px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
              {top3[2].level}
            </span>
          </div>

          <div className="w-full mt-4 pt-3 border-t border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400">Thu nhập hôm nay</div>
            <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
              {formatVND(top3[2].earnedToday)}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Tổng kiếm: {formatVND(top3[2].totalEarned)}
            </div>
          </div>
        </div>
      </div>

      {/* Ranks 4 to 10 Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Medal className="w-4 h-4 text-emerald-400" />
            Các thứ hạng tiếp theo
          </h3>
          <span className="text-xs text-slate-500 font-mono">Cập nhật lúc 06:30</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3 font-medium">Hạng</th>
                <th className="px-6 py-3 font-medium">Thành viên</th>
                <th className="px-6 py-3 font-medium">Cấp bậc</th>
                <th className="px-6 py-3 font-medium text-right">Thu nhập hôm nay</th>
                <th className="px-6 py-3 font-medium text-right">Tổng đã rút</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {remaining.map((item) => (
                <tr
                  key={item.rank}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    item.name.includes('(Bạn)') ? 'bg-emerald-950/20 font-semibold' : ''
                  }`}
                >
                  <td className="px-6 py-3.5 font-bold font-mono text-slate-400">
                    #{item.rank}
                  </td>
                  <td className="px-6 py-3.5 flex items-center gap-2.5">
                    <img src={item.avatar} alt={item.name} className="w-6 h-6 rounded-full bg-slate-800" />
                    <span className={item.name.includes('(Bạn)') ? 'text-emerald-400' : 'text-slate-200'}>
                      {item.name}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-slate-400">{item.level}</span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-emerald-400">
                    {formatVND(item.earnedToday)}
                  </td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-400">
                    {formatVND(item.totalEarned)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
