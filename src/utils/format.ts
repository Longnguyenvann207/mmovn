/**
 * Format number to Vietnamese Dong currency display (e.g. 85.000 đ)
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format pure number with dots
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Get VIP Level details
 */
export function getVipBadge(level: number): { label: string; color: string; multiplier: string } {
  switch (level) {
    case 5:
      return { label: 'Kim Cương', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80', multiplier: '+20%' };
    case 4:
      return { label: 'Bạch Kim', color: 'text-purple-300 bg-purple-950/60 border-purple-800/80', multiplier: '+15%' };
    case 3:
      return { label: 'Vàng', color: 'text-amber-400 bg-amber-950/60 border-amber-800/80', multiplier: '+10%' };
    case 2:
      return { label: 'Bạc', color: 'text-slate-300 bg-slate-800/70 border-slate-700/80', multiplier: '+5%' };
    case 1:
    default:
      return { label: 'Đồng', color: 'text-amber-600 bg-amber-950/40 border-amber-900/60', multiplier: 'Chuẩn' };
  }
}
