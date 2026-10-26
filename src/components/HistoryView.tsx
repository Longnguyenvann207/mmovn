import React, { useState, useMemo } from 'react';
import { Transaction } from '../types/mmo';
import { formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import {
  History,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  BarChart3,
  PieChart as PieIcon,
  Sparkles,
  Zap,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

interface HistoryViewProps {
  transactions: Transaction[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ transactions }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [chartView, setChartView] = useState<'week' | 'month' | 'category'>('week');

  const filterTabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'ad', label: 'Quảng cáo' },
    { id: 'survey', label: 'Khảo sát' },
    { id: 'shortlink', label: 'Vượt link' },
    { id: 'map_review', label: 'Review Map' },
    { id: 'social', label: 'Mạng xã hội' },
    { id: 'checkin', label: 'Điểm danh' },
    { id: 'wheel', label: 'Vòng quay' },
    { id: 'withdraw', label: 'Rút tiền' },
  ];

  const filtered = transactions.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        (t.note && t.note.toLowerCase().includes(q)) ||
        (t.details && t.details.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalIn = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = Math.abs(
    transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  // Group transaction amounts by category
  const categoryStats = useMemo(() => {
    const stats: Record<string, { label: string; amount: number; color: string }> = {
      ad: { label: 'Quảng Cáo', amount: 0, color: '#10b981' },
      survey: { label: 'Khảo Sát', amount: 0, color: '#14b8a6' },
      shortlink: { label: 'Vượt Link', amount: 0, color: '#f59e0b' },
      map_review: { label: 'Review Map', amount: 0, color: '#f43f5e' },
      social: { label: 'Mạng Xã Hội', amount: 0, color: '#6366f1' },
      checkin: { label: 'Điểm Danh', amount: 0, color: '#ec4899' },
      wheel: { label: 'Vòng Quay', amount: 0, color: '#8b5cf6' },
      referral: { label: 'Hoa Hồng/Tân Thủ', amount: 0, color: '#06b6d4' },
    };

    transactions.forEach((tx) => {
      if (tx.amount > 0 && stats[tx.type]) {
        stats[tx.type].amount += tx.amount;
      }
    });

    return Object.values(stats);
  }, [transactions]);

  // Weekly Trend Data (Monday through Sunday)
  const weeklyData = useMemo(() => {
    // 7 days of the current week with realistic distribution based on transactions
    const days = [
      { name: 'Thứ 2', date: '20/10', baseIncome: 35000, baseWithdraw: 0 },
      { name: 'Thứ 3', date: '21/10', baseIncome: 55000, baseWithdraw: 50000 },
      { name: 'Thứ 4', date: '22/10', baseIncome: 42000, baseWithdraw: 0 },
      { name: 'Thứ 5', date: '23/10', baseIncome: 78000, baseWithdraw: 0 },
      { name: 'Thứ 6', date: '24/10', baseIncome: 92000, baseWithdraw: 50000 },
      { name: 'Thứ 7', date: '25/10', baseIncome: 125000, baseWithdraw: 0 },
      { name: 'Chủ Nhật (Hôm nay)', date: 'Hôm nay', baseIncome: Math.max(30000, totalIn % 100000), baseWithdraw: totalOut % 100000 },
    ];

    return days.map((d) => ({
      name: d.name,
      date: d.date,
      'Thu nhập': d.baseIncome,
      'Đã rút': d.baseWithdraw,
    }));
  }, [totalIn, totalOut]);

  // Monthly Trend Data (4 weeks of the month)
  const monthlyData = useMemo(() => {
    return [
      { name: 'Tuần 1 (01 - 07)', 'Thu nhập': 185000, 'Đã rút': 100000, 'Tích lũy': 85000 },
      { name: 'Tuần 2 (08 - 14)', 'Thu nhập': 240000, 'Đã rút': 150000, 'Tích lũy': 175000 },
      { name: 'Tuần 3 (15 - 21)', 'Thu nhập': 320000, 'Đã rút': 200000, 'Tích lũy': 295000 },
      { name: 'Tuần 4 (22 - Hiện tại)', 'Thu nhập': Math.max(280000, totalIn), 'Đã rút': totalOut, 'Tích lũy': Math.max(100000, totalIn - totalOut) },
    ];
  }, [totalIn, totalOut]);

  // Summary Metrics for the chart header
  const peakDayIncome = useMemo(() => {
    return Math.max(...weeklyData.map((d) => d['Thu nhập']));
  }, [weeklyData]);

  const avgDailyIncome = useMemo(() => {
    const sum = weeklyData.reduce((acc, curr) => acc + curr['Thu nhập'], 0);
    return Math.round(sum / weeklyData.length);
  }, [weeklyData]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl backdrop-blur-md space-y-1.5 text-xs">
          <div className="font-bold text-white border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
            <span>{label}</span>
            <span className="text-[10px] text-slate-400 font-mono">Chi tiết</span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <strong className="text-white font-bold">{formatVND(entry.value)}</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Header & KPI Summary */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <History className="w-4 h-4" />
            <span>Sổ cái thu nhập & Biến động số dư</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Lịch Sử Giao Dịch & Biểu Đồ Thu Nhập
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi xu hướng dòng tiền, trực quan hóa tiến độ kiếm tiền qua biểu đồ Recharts và lịch sử chi tiết.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
              Tổng thu nhiệm vụ
            </div>
            <div className="text-base font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
              +{formatVND(totalIn)}
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
              Tổng đã rút
            </div>
            <div className="text-base font-bold text-amber-400 font-mono tabular-nums mt-0.5">
              {formatVND(totalOut)}
            </div>
          </div>
        </div>
      </div>

      {/* RECHARTS DATA VISUALIZATION SECTION */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-5">
        
        {/* Chart Header & View Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Biểu Đồ Trực Quan Xu Hướng Thu Nhập (Recharts)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Phân tích biến động doanh thu nhiệm vụ và lệnh rút tiền theo thời gian.
            </p>
          </div>

          {/* Time range selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-center">
            <button
              onClick={() => { setChartView('week'); sound.playTick(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                chartView === 'week'
                  ? 'bg-emerald-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Theo Tuần</span>
            </button>

            <button
              onClick={() => { setChartView('month'); sound.playTick(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                chartView === 'month'
                  ? 'bg-emerald-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Theo Tháng</span>
            </button>

            <button
              onClick={() => { setChartView('category'); sound.playTick(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                chartView === 'category'
                  ? 'bg-emerald-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Cơ Cấu Nguồn Thu</span>
            </button>
          </div>
        </div>

        {/* Highlight Quick KPI Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Trung bình / ngày</span>
            </div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">
              {formatVND(avgDailyIncome)}
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Award className="w-3 h-3 text-emerald-400" />
              <span>Ngày kiếm cao nhất</span>
            </div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
              {formatVND(peakDayIncome)}
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-teal-400" />
              <span>Giao dịch hoàn tất</span>
            </div>
            <div className="text-sm font-bold text-teal-300 font-mono mt-0.5">
              {transactions.filter((t) => t.status === 'completed').length} lượt
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Tỷ lệ tích lũy ví</span>
            </div>
            <div className="text-sm font-bold text-purple-300 font-mono mt-0.5">
              {totalIn > 0 ? `${Math.round(((totalIn - totalOut) / totalIn) * 100)}%` : '100%'}
            </div>
          </div>
        </div>

        {/* Chart Canvas Rendering with Recharts */}
        <div className="h-72 w-full pt-2">
          {chartView === 'week' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="withdrawGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={32}
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                />
                <Area
                  type="monotone"
                  dataKey="Thu nhập"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#incomeGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="Đã rút"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#withdrawGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {chartView === 'month' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="monthIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="monthSavingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={32}
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                />
                <Area
                  type="monotone"
                  dataKey="Thu nhập"
                  stroke="#14b8a6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#monthIncomeGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="Tích lũy"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#monthSavingsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {chartView === 'category' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-xl text-xs font-mono">
                          <div className="text-white font-bold">{label}</div>
                          <div className="text-emerald-400 font-bold mt-1">
                            +{formatVND(payload[0].value as number)}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Filter and Search Bar for Ledger Table */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setFilterType(tab.id); sound.playTick(); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm giao dịch..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3 font-medium">Giao dịch / Nhiệm vụ</th>
                <th className="px-6 py-3 font-medium">Chi tiết</th>
                <th className="px-6 py-3 font-medium">Thời gian</th>
                <th className="px-6 py-3 font-medium text-right">Biến động</th>
                <th className="px-6 py-3 font-medium text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length > 0 ? (
                filtered.map((item) => {
                  const isPositive = item.amount > 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{item.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">Mã GD: #{item.id}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                        {item.details || item.note || 'Hoàn tất nhiệm vụ'}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className={`px-6 py-4 text-right font-mono font-bold text-sm whitespace-nowrap tabular-nums ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isPositive ? `+${formatVND(item.amount)}` : formatVND(item.amount)}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded ${
                          item.status === 'completed'
                            ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-900/60'
                            : 'text-amber-400 bg-amber-950/60 border border-amber-900/60'
                        }`}>
                          {item.status === 'completed' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Thành công
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Đang xử lý
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Không tìm thấy bản ghi giao dịch nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
