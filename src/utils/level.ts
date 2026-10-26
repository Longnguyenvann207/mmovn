export interface LevelTier {
  level: number;
  id: string;
  name: string;
  title: string;
  minEarned: number;
  minTasks: number;
  multiplier: number;
  multiplierLabel: string;
  badgeColor: string;
  badgeBorder: string;
  badgeBg: string;
  textColor: string;
  gradient: string;
  icon: string;
  tagline: string;
  perks: string[];
}

export const LEVEL_TIERS: LevelTier[] = [
  {
    level: 1,
    id: 'tan_thu',
    name: 'Tân Thủ',
    title: 'Thành viên Khởi Đầu',
    minEarned: 0,
    minTasks: 0,
    multiplier: 1.0,
    multiplierLabel: '1.00x (Gốc)',
    badgeColor: 'text-slate-300',
    badgeBorder: 'border-slate-700',
    badgeBg: 'bg-slate-900',
    textColor: 'text-slate-300',
    gradient: 'from-slate-600 to-slate-400',
    icon: '🌱',
    tagline: 'Khởi đầu hành trình MMO',
    perks: [
      'Rút tiền tối thiểu chỉ từ 20.000₫',
      'Tặng 10.000₫ quà tân thủ & 2 lượt quay may mắn',
      'Tham gia không giới hạn các nhiệm vụ cơ bản',
    ],
  },
  {
    level: 2,
    id: 'dong',
    name: 'Hạng Đồng',
    title: 'Thành viên Đồng',
    minEarned: 50000,
    minTasks: 5,
    multiplier: 1.05,
    multiplierLabel: '+5% Thù lao',
    badgeColor: 'text-amber-600',
    badgeBorder: 'border-amber-800/80',
    badgeBg: 'bg-amber-950/40',
    textColor: 'text-amber-500',
    gradient: 'from-amber-700 via-amber-600 to-amber-500',
    icon: '🥉',
    tagline: 'Bước đầu tạo thu nhập ổn định',
    perks: [
      'Cộng thêm +5% thù lao mọi nhiệm vụ',
      '+1 Lượt quay may mắn hằng ngày khi điểm danh',
      'Huy hiệu Đồng xác thực tài khoản',
    ],
  },
  {
    level: 3,
    id: 'bac',
    name: 'Hạng Bạc',
    title: 'Thành viên Bạc',
    minEarned: 200000,
    minTasks: 15,
    multiplier: 1.1,
    multiplierLabel: '+10% Thù lao',
    badgeColor: 'text-slate-200',
    badgeBorder: 'border-slate-500/80',
    badgeBg: 'bg-slate-800/60',
    textColor: 'text-slate-200',
    gradient: 'from-slate-400 via-slate-300 to-slate-100',
    icon: '🥈',
    tagline: 'Kinh nghiệm làm nhiệm vụ thành thạo',
    perks: [
      'Cộng thêm +10% thù lao tất cả nhiệm vụ',
      'Ưu tiên xét duyệt lệnh rút tiền siêu tốc',
      'Mở khóa các đề tài khảo sát thị trường thù lao cao',
      'Tăng tỷ lệ trúng thưởng lớn ở Vòng quay may mắn',
    ],
  },
  {
    level: 4,
    id: 'vang',
    name: 'Hạng Vàng',
    title: 'Thành viên Vàng',
    minEarned: 500000,
    minTasks: 35,
    multiplier: 1.15,
    multiplierLabel: '+15% Thù lao',
    badgeColor: 'text-amber-300',
    badgeBorder: 'border-amber-500/80',
    badgeBg: 'bg-amber-950/70',
    textColor: 'text-amber-400',
    gradient: 'from-amber-500 via-yellow-400 to-amber-300',
    icon: '🥇',
    tagline: 'Chuyên gia kiếm tiền online thực thụ',
    perks: [
      'Cộng thêm +15% thù lao tất cả nhiệm vụ',
      'Miễn 100% phí rút tiền qua MoMo & Ngân hàng',
      '+3 Lượt quay may mắn mỗi tuần',
      'Huy hiệu Vàng phát sáng rực rỡ',
    ],
  },
  {
    level: 5,
    id: 'bach_kim',
    name: 'Bạch Kim',
    title: 'Thành viên Bạch Kim',
    minEarned: 1200000,
    minTasks: 70,
    multiplier: 1.2,
    multiplierLabel: '+20% Thù lao',
    badgeColor: 'text-purple-300',
    badgeBorder: 'border-purple-600/80',
    badgeBg: 'bg-purple-950/70',
    textColor: 'text-purple-300',
    gradient: 'from-purple-500 via-indigo-400 to-purple-300',
    icon: '💠',
    tagline: 'Thành viên ưu tú cấp cao',
    perks: [
      'Cộng thêm +20% thù lao tất cả nhiệm vụ',
      'Hạn mức rút tiền tối đa lên đến 20.000.000₫/ngày',
      'Quà tặng tiền mặt nóng vào dịp lễ & sinh nhật',
      'Kênh hỗ trợ chăm sóc ưu tiên 24/7',
    ],
  },
  {
    level: 6,
    id: 'kim_cuong',
    name: 'Kim Cương',
    title: 'Huyền Thoại Kim Cương',
    minEarned: 3000000,
    minTasks: 150,
    multiplier: 1.3,
    multiplierLabel: '+30% Thù lao',
    badgeColor: 'text-cyan-300',
    badgeBorder: 'border-cyan-400/90',
    badgeBg: 'bg-cyan-950/80',
    textColor: 'text-cyan-300',
    gradient: 'from-cyan-400 via-teal-300 to-emerald-300',
    icon: '👑',
    tagline: 'Cấp bậc danh dự tối thượng của MMO VN',
    perks: [
      'Cộng tối đa +30% thù lao cho TẤT CẢ các loại nhiệm vụ',
      'Rút tiền tự động tức thì không cần chờ duyệt',
      'Hạn mức rút tiền không giới hạn',
      'Vương miện Kim Cương danh dự vinh danh Top 1 bảng xếp hạng',
    ],
  },
];

export interface UserLevelProgress {
  currentTier: LevelTier;
  nextTier: LevelTier | null;
  progressPercent: number;
  earnedNeeded: number;
  tasksNeeded: number;
  isMaxLevel: boolean;
  completedTasksCount: number;
}

/**
 * Calculates user's level, next level requirements, and progress percentage
 * based on total money earned OR completed tasks count.
 */
export function getUserLevelProgress(
  totalEarned: number,
  completedTasksCount: number = 0
): UserLevelProgress {
  let currentTierIndex = 0;

  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    const tier = LEVEL_TIERS[i];
    // User qualifies if they reached the earned money OR tasks count milestone
    if (totalEarned >= tier.minEarned || completedTasksCount >= tier.minTasks) {
      currentTierIndex = i;
      break;
    }
  }

  const currentTier = LEVEL_TIERS[currentTierIndex];
  const isMaxLevel = currentTierIndex === LEVEL_TIERS.length - 1;
  const nextTier = isMaxLevel ? null : LEVEL_TIERS[currentTierIndex + 1];

  let progressPercent = 100;
  let earnedNeeded = 0;
  let tasksNeeded = 0;

  if (nextTier) {
    const prevEarned = currentTier.minEarned;
    const targetEarned = nextTier.minEarned;
    const earnedProgress = Math.max(0, Math.min(100, ((totalEarned - prevEarned) / (targetEarned - prevEarned)) * 100));

    const prevTasks = currentTier.minTasks;
    const targetTasks = nextTier.minTasks;
    const tasksProgress = targetTasks > prevTasks
      ? Math.max(0, Math.min(100, ((completedTasksCount - prevTasks) / (targetTasks - prevTasks)) * 100))
      : 0;

    progressPercent = Math.min(100, Math.max(earnedProgress, tasksProgress));
    earnedNeeded = Math.max(0, targetEarned - totalEarned);
    tasksNeeded = Math.max(0, targetTasks - completedTasksCount);
  }

  return {
    currentTier,
    nextTier,
    progressPercent: Math.round(progressPercent),
    earnedNeeded,
    tasksNeeded,
    isMaxLevel,
    completedTasksCount,
  };
}
