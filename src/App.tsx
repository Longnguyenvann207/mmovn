import { useState, useEffect } from 'react';
import { ActiveTab, AdTask, MapReviewTask, ShortlinkTask, SocialTask, SurveyTask, Transaction, UserProfile } from './types/mmo';
import {
  INITIAL_USER,
  INITIAL_ADS,
  INITIAL_SURVEYS,
  INITIAL_SHORTLINKS,
  INITIAL_MAP_REVIEWS,
  INITIAL_SOCIAL_TASKS,
  INITIAL_TRANSACTIONS,
  SEED_USERS,
  ADMIN_USER,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroOverview } from './components/HeroOverview';
import { AdTasksView } from './components/AdTasksView';
import { SurveyView } from './components/SurveyView';
import { ShortlinkTasksView } from './components/ShortlinkTasksView';
import { MapReviewView } from './components/MapReviewView';
import { SocialTasksView } from './components/SocialTasksView';
import { DailyCheckInView } from './components/DailyCheckInView';
import { LuckyWheelView } from './components/LuckyWheelView';
import { WithdrawView } from './components/WithdrawView';
import { ReferralView } from './components/ReferralView';
import { LeaderboardView } from './components/LeaderboardView';
import { HistoryView } from './components/HistoryView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { AdminSecretModal } from './components/AdminSecretModal';
import { ToastContainer } from './components/ToastContainer';
import { ToastItem } from './types/toast';
import { formatVND } from './utils/format';
import { AdPlayerModal } from './components/AdPlayerModal';
import { SurveyPlayerModal } from './components/SurveyPlayerModal';
import { sound } from './utils/sound';
import { LevelRoadmapModal } from './components/LevelRoadmapModal';
import { getUserLevelProgress } from './utils/level';
import { RotateCcw, ShieldCheck, ShieldAlert, Lock, Ban, AlertCircle } from 'lucide-react';

export default function App() {
  // Users list state
  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('mmovn_users_list');
      return saved ? JSON.parse(saved) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  });

  // Current logged in user
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('mmovn_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Ads state
  const [ads, setAds] = useState<AdTask[]>(() => {
    try {
      const saved = localStorage.getItem('mmovn_ads');
      return saved ? JSON.parse(saved) : INITIAL_ADS;
    } catch {
      return INITIAL_ADS;
    }
  });

  // Surveys state
  const [surveys, setSurveys] = useState<SurveyTask[]>(() => {
    try {
      const saved = localStorage.getItem('mmovn_surveys');
      return saved ? JSON.parse(saved) : INITIAL_SURVEYS;
    } catch {
      return INITIAL_SURVEYS;
    }
  });

  // Shortlinks state
  const [shortlinks, setShortlinks] = useState<ShortlinkTask[]>(() => {
    try {
      const saved = localStorage.getItem('mmovn_shortlinks');
      return saved ? JSON.parse(saved) : INITIAL_SHORTLINKS;
    } catch {
      return INITIAL_SHORTLINKS;
    }
  });

  // Map Reviews state
  const [mapReviews, setMapReviews] = useState<MapReviewTask[]>(() => {
    try {
      const saved = localStorage.getItem('mmovn_map_reviews');
      return saved ? JSON.parse(saved) : INITIAL_MAP_REVIEWS;
    } catch {
      return INITIAL_MAP_REVIEWS;
    }
  });

  // Social Tasks state
  const [socialTasks, setSocialTasks] = useState<SocialTask[]>(() => {
    try {
      const saved = localStorage.getItem('mmovn_social_tasks');
      return saved ? JSON.parse(saved) : INITIAL_SOCIAL_TASKS;
    } catch {
      return INITIAL_SOCIAL_TASKS;
    }
  });

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('mmovn_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Active view tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminSecretModalOpen, setIsAdminSecretModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);

  // Completed tasks count & Member level calculations
  const completedTasksCount = transactions.filter(
    (t) => t.type !== 'withdraw' && t.status === 'completed'
  ).length;

  const levelProgress = getUserLevelProgress(user.totalEarned, completedTasksCount);

  // Active task modals
  const [selectedAd, setSelectedAd] = useState<AdTask | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyTask | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mmovn_users_list', JSON.stringify(usersList));
    } catch {
      // ignore
    }
  }, [usersList]);

  useEffect(() => {
    try {
      localStorage.setItem('mmovn_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('mmovn_ads', JSON.stringify(ads));
    } catch {
      // ignore
    }
  }, [ads]);

  useEffect(() => {
    try {
      localStorage.setItem('mmovn_surveys', JSON.stringify(surveys));
    } catch {
      // ignore
    }
  }, [surveys]);

  useEffect(() => {
    try {
      localStorage.setItem('mmovn_shortlinks', JSON.stringify(shortlinks));
    } catch {
      // ignore
    }
  }, [shortlinks]);

  useEffect(() => {
    try {
      localStorage.setItem('mmovn_map_reviews', JSON.stringify(mapReviews));
    } catch {
      // ignore
    }
  }, [mapReviews]);

  useEffect(() => {
    try {
      localStorage.setItem('mmovn_social_tasks', JSON.stringify(socialTasks));
    } catch {
      // ignore
    }
  }, [socialTasks]);

  useEffect(() => {
    try {
      localStorage.setItem('mmovn_transactions', JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [transactions]);

  // Level-up celebration toast
  const [prevLevel, setPrevLevel] = useState<number>(() => levelProgress.currentTier.level);
  useEffect(() => {
    if (levelProgress.currentTier.level > prevLevel) {
      sound.playCoin();
      addToast({
        type: 'level_up',
        title: `CHÚC MỪNG THĂNG CẤP: ${levelProgress.currentTier.name.toUpperCase()}!`,
        message: `Bạn đã đạt ${levelProgress.currentTier.title}! Hưởng đặc quyền ${levelProgress.currentTier.multiplierLabel} cho mọi nhiệm vụ kiếm tiền.`,
        durationMs: 6000,
      });
      setPrevLevel(levelProgress.currentTier.level);
    }
  }, [levelProgress.currentTier.level, prevLevel]);

  // Current formatted timestamp
  const getTimestamp = () => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${d}/${m}/${y} ${h}:${min}`;
  };

  // Auth Handlers
  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
  };

  const handleRegister = (newUser: UserProfile) => {
    setUsersList((prev) => [newUser, ...prev]);
    setUser(newUser);

    const welcomeTx: Transaction = {
      id: `tx-welcome-${Date.now().toString().slice(-4)}`,
      userId: newUser.id,
      userName: newUser.name,
      type: 'referral',
      title: 'Quà tặng tân thủ đăng ký tài khoản mới',
      amount: 10000,
      date: getTimestamp(),
      status: 'completed',
      note: 'Thưởng khởi đầu chào mừng thành viên mới (+2 Lượt quay)',
    };
    setTransactions((prev) => [welcomeTx, ...prev]);

    addToast({
      type: 'success',
      title: 'Đăng Ký Thành Viên Thành Công!',
      message: 'Chào mừng bạn đến với MMO VN! Bạn nhận được 10.000₫ tiền thưởng và 2 lượt quay may mắn.',
      amount: 10000,
    });
  };

  // 1. Daily Check-in handler
  const handleCheckIn = (dayNumber: number, rewardAmount: number) => {
    const todayStr = new Date().toISOString().split('T')[0];

    const newStreak = user.streakDays + 1;
    const newBalance = user.balance + rewardAmount;
    const newTotal = user.totalEarned + rewardAmount;
    const newSpins = user.luckySpins + 1;

    const updatedUser = {
      ...user,
      streakDays: newStreak,
      lastCheckInDate: todayStr,
      balance: newBalance,
      totalEarned: newTotal,
      luckySpins: newSpins,
    };

    setUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));

    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      userName: user.name,
      type: 'checkin',
      title: `Điểm danh hằng ngày - Ngày ${dayNumber}`,
      amount: rewardAmount,
      date: getTimestamp(),
      status: 'completed',
      note: `Thưởng chuỗi ${newStreak} ngày liên tiếp (+1 Lượt quay)`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'success',
      title: `Điểm Danh Ngày ${dayNumber} Thành Công!`,
      message: `Chuỗi điểm danh của bạn đã đạt ${newStreak} ngày liên tiếp (+1 Lượt quay may mắn).`,
      amount: rewardAmount,
    });
  };

  // Helper to calculate task reward with member VIP level multiplier
  const calculatePayoutWithBonus = (baseAmount: number) => {
    const multiplier = levelProgress.currentTier.multiplier;
    const bonus = multiplier > 1 ? Math.round(baseAmount * (multiplier - 1)) : 0;
    return {
      baseAmount,
      bonusAmount: bonus,
      totalAmount: baseAmount + bonus,
      tier: levelProgress.currentTier,
    };
  };

  // 2. Ad completed reward handler
  const handleAdReward = (adId: string, rewardAmount: number) => {
    setAds((prev) =>
      prev.map((a) => (a.id === adId ? { ...a, isCompleted: true } : a))
    );

    const { baseAmount, bonusAmount, totalAmount, tier } = calculatePayoutWithBonus(rewardAmount);

    const updatedUser = {
      ...user,
      balance: user.balance + totalAmount,
      totalEarned: user.totalEarned + totalAmount,
      luckySpins: user.luckySpins + 1,
    };

    setUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));

    const targetAd = ads.find((a) => a.id === adId);
    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      userName: user.name,
      type: 'ad',
      title: `Xem quảng cáo: ${targetAd?.advertiser || 'Thương hiệu'}`,
      amount: totalAmount,
      date: getTimestamp(),
      status: 'completed',
      note:
        bonusAmount > 0
          ? `Gốc ${formatVND(baseAmount)} + Thưởng VIP (${tier.name}): +${formatVND(bonusAmount)} (+1 Lượt quay)`
          : 'Xác thực trả lời đúng câu hỏi (+1 Lượt quay)',
    };

    setTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'success',
      title: 'Xem Quảng Cáo Thành Công!',
      message:
        bonusAmount > 0
          ? `Đã nhận ${formatVND(baseAmount)} + Thưởng cấp ${tier.name} +${formatVND(bonusAmount)} (+1 Lượt quay).`
          : `Thù lao xem quảng cáo từ "${targetAd?.advertiser || 'nhà tài trợ'}" đã được cộng vào ví (+1 Lượt quay).`,
      amount: totalAmount,
    });
  };

  // 3. Survey completed handler
  const handleSurveyComplete = (surveyId: string, rewardAmount: number) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === surveyId ? { ...s, isCompleted: true } : s))
    );

    const { baseAmount, bonusAmount, totalAmount, tier } = calculatePayoutWithBonus(rewardAmount);

    const updatedUser = {
      ...user,
      balance: user.balance + totalAmount,
      totalEarned: user.totalEarned + totalAmount,
      luckySpins: user.luckySpins + 2,
    };

    setUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));

    const targetSurvey = surveys.find((s) => s.id === surveyId);
    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      userName: user.name,
      type: 'survey',
      title: `Khảo sát: ${targetSurvey?.institution || 'Nghiên cứu thị trường'}`,
      amount: totalAmount,
      date: getTimestamp(),
      status: 'completed',
      note:
        bonusAmount > 0
          ? `Gốc ${formatVND(baseAmount)} + Thưởng VIP (${tier.name}): +${formatVND(bonusAmount)} (+2 Lượt quay)`
          : 'Đã hoàn thành toàn bộ câu hỏi nghiên cứu (+2 Lượt quay)',
    };

    setTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'success',
      title: 'Hoàn Thành Khảo Sát Thị Trường!',
      message:
        bonusAmount > 0
          ? `Cảm ơn ý kiến của bạn! Đã nhận ${formatVND(baseAmount)} + Thưởng ${tier.name} +${formatVND(bonusAmount)} (+2 Lượt quay).`
          : `Cảm ơn ý kiến của bạn cho "${targetSurvey?.institution || 'nghiên cứu'}" (+2 Lượt quay).`,
      amount: totalAmount,
    });
  };

  // 4. Shortlink completed handler
  const handleShortlinkComplete = (taskId: string, rewardAmount: number) => {
    setShortlinks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: true } : t))
    );

    const { baseAmount, bonusAmount, totalAmount, tier } = calculatePayoutWithBonus(rewardAmount);

    const updatedUser = {
      ...user,
      balance: user.balance + totalAmount,
      totalEarned: user.totalEarned + totalAmount,
      luckySpins: user.luckySpins + 1,
    };

    setUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));

    const target = shortlinks.find((t) => t.id === taskId);
    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      userName: user.name,
      type: 'shortlink',
      title: `Vượt link: ${target?.provider || 'Rút gọn link'}`,
      amount: totalAmount,
      date: getTimestamp(),
      status: 'completed',
      note:
        bonusAmount > 0
          ? `Gốc ${formatVND(baseAmount)} + Thưởng VIP (${tier.name}): +${formatVND(bonusAmount)} (+1 Lượt quay)`
          : 'Nhập chính xác mã 6 số bí mật (+1 Lượt quay)',
    };

    setTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'success',
      title: 'Vượt Link Rút Gọn Thành Công!',
      message:
        bonusAmount > 0
          ? `Mã 6 số chính xác! Đã nhận ${formatVND(baseAmount)} + Thưởng ${tier.name} +${formatVND(bonusAmount)} (+1 Lượt quay).`
          : 'Mã bí mật 6 số chính xác! Thù lao đã được cộng vào tài khoản (+1 Lượt quay).',
      amount: totalAmount,
    });
  };

  // 5. Map Review completed handler
  const handleMapReviewComplete = (taskId: string, rewardAmount: number) => {
    setMapReviews((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: true } : t))
    );

    const { baseAmount, bonusAmount, totalAmount, tier } = calculatePayoutWithBonus(rewardAmount);

    const updatedUser = {
      ...user,
      balance: user.balance + totalAmount,
      totalEarned: user.totalEarned + totalAmount,
      luckySpins: user.luckySpins + 2,
    };

    setUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));

    const target = mapReviews.find((t) => t.id === taskId);
    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      userName: user.name,
      type: 'map_review',
      title: `Review Map: ${target?.placeName || 'Địa điểm Google Maps'}`,
      amount: totalAmount,
      date: getTimestamp(),
      status: 'completed',
      note:
        bonusAmount > 0
          ? `Gốc ${formatVND(baseAmount)} + Thưởng VIP (${tier.name}): +${formatVND(bonusAmount)} (+2 Lượt quay)`
          : 'Đánh giá 5 sao thành công (+2 Lượt quay)',
    };

    setTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'success',
      title: 'Review Google Maps 5 Sao Thành Công!',
      message:
        bonusAmount > 0
          ? `Đánh giá địa điểm "${target?.placeName}" thành công! Đã nhận ${formatVND(baseAmount)} + Thưởng ${tier.name} +${formatVND(bonusAmount)} (+2 Lượt quay).`
          : `Đánh giá cho địa điểm "${target?.placeName}" đã được ghi nhận và duyệt thưởng (+2 Lượt quay).`,
      amount: totalAmount,
    });
  };

  // 6. Social Task completed handler
  const handleSocialComplete = (taskId: string, rewardAmount: number) => {
    setSocialTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: true } : t))
    );

    const { baseAmount, bonusAmount, totalAmount, tier } = calculatePayoutWithBonus(rewardAmount);

    const updatedUser = {
      ...user,
      balance: user.balance + totalAmount,
      totalEarned: user.totalEarned + totalAmount,
      luckySpins: user.luckySpins + 1,
    };

    setUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));

    const target = socialTasks.find((t) => t.id === taskId);
    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      userName: user.name,
      type: 'social',
      title: `MXH ${target?.platform.toUpperCase()}: ${target?.title || 'Tương tác'}`,
      amount: totalAmount,
      date: getTimestamp(),
      status: 'completed',
      note:
        bonusAmount > 0
          ? `Gốc ${formatVND(baseAmount)} + Thưởng VIP (${tier.name}): +${formatVND(bonusAmount)} (+1 Lượt quay)`
          : 'Hoàn thành tương tác like/follow (+1 Lượt quay)',
    };

    setTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'success',
      title: `Nhiệm Vụ ${target?.platform.toUpperCase()} Thành Công!`,
      message:
        bonusAmount > 0
          ? `Đã nhận ${formatVND(baseAmount)} + Thưởng cấp ${tier.name} +${formatVND(bonusAmount)} (+1 Lượt quay).`
          : `Đã xác nhận tương tác ${target?.actionType.toUpperCase()}. Thù lao đã chuyển về ví (+1 Lượt quay).`,
      amount: totalAmount,
    });
  };

  // 7. Lucky Wheel Win handler
  const handleLuckyWheelWin = (prize: { label: string; amount: number; spinsAdd?: number }) => {
    const remainingSpins = Math.max(0, user.luckySpins - 1) + (prize.spinsAdd || 0);
    const newBal = user.balance + (prize.amount || 0);
    const newTotal = user.totalEarned + (prize.amount || 0);

    const updatedUser = {
      ...user,
      luckySpins: remainingSpins,
      balance: newBal,
      totalEarned: newTotal,
    };

    setUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));

    if (prize.amount > 0) {
      const newTx: Transaction = {
        id: `tx-${Date.now().toString().slice(-6)}`,
        userId: user.id,
        userName: user.name,
        type: 'wheel',
        title: `Vòng quay may mắn: Trúng ${prize.label}`,
        amount: prize.amount,
        date: getTimestamp(),
        status: 'completed',
        note: 'Giải thưởng tiền mặt từ Vòng Quay May Mắn',
      };
      setTransactions((prev) => [newTx, ...prev]);

      addToast({
        type: 'success',
        title: 'Trúng Thưởng Vòng Quay May Mắn!',
        message: `Chúc mừng bạn đã quay trúng phần quà: ${prize.label}!`,
        amount: prize.amount,
      });
    } else if (prize.spinsAdd && prize.spinsAdd > 0) {
      addToast({
        type: 'info',
        title: 'Nhận Thêm Lượt Quay!',
        message: `Bạn nhận được thêm +${prize.spinsAdd} lượt quay may mắn.`,
      });
    } else {
      addToast({
        type: 'info',
        title: 'Vòng Quay May Mắn',
        message: 'Chúc bạn may mắn và trúng lớn ở lượt quay tiếp theo!',
      });
    }
  };

  // 8. Withdrawal handler
  const handleWithdraw = (amount: number, method: string, details: string): boolean => {
    if (amount > user.balance) {
      addToast({
        type: 'error',
        title: 'Rút Tiền Thất Bại',
        message: 'Số dư khả dụng trong ví không đủ để thực hiện lệnh rút này.',
      });
      return false;
    }

    const updatedUser = {
      ...user,
      balance: user.balance - amount,
    };

    setUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));

    const isCard = method === 'Thẻ cào';
    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      userName: user.name,
      type: 'withdraw',
      title: `Rút tiền qua ${method}`,
      amount: -amount,
      date: getTimestamp(),
      status: isCard ? 'completed' : 'processing',
      details,
      method,
    };

    setTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'success',
      title: 'Tạo Lệnh Rút Tiền Thành Công!',
      message: isCard
        ? 'Thẻ cào đã được xuất mã PIN & Serial tức thì trong Lịch sử giao dịch.'
        : `Yêu cầu rút ${formatVND(amount)} qua ${method} đã được chuyển tới Admin để duyệt thanh toán.`,
      amount: -amount,
    });

    return true;
  };

  // Admin Handlers
  const handleApproveWithdraw = (txId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'completed' } : t))
    );

    addToast({
      type: 'success',
      title: 'Đã Duyệt Thanh Toán Lệnh Rút',
      message: `Lệnh rút tiền #${txId} đã được phê duyệt và giải ngân thành công tới người dùng.`,
    });
  };

  const handleRejectWithdraw = (txId: string, reason: string) => {
    const targetTx = transactions.find((t) => t.id === txId);
    if (!targetTx) return;

    const refundAmount = Math.abs(targetTx.amount);

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? { ...t, status: 'rejected', rejectedReason: reason }
          : t
      )
    );

    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === targetTx.userId || u.name === targetTx.userName) {
          return { ...u, balance: u.balance + refundAmount };
        }
        return u;
      })
    );

    if (user.id === targetTx.userId || user.name === targetTx.userName) {
      setUser((prev) => ({
        ...prev,
        balance: prev.balance + refundAmount,
      }));
    }

    addToast({
      type: 'warning',
      title: 'Đã Từ Chối Lệnh Rút Tiền',
      message: `Đã hoàn trả lại 100% (+${formatVND(refundAmount)}) vào ví người dùng. Lý do: ${reason}`,
    });
  };

  // Admin toggles
  const handleToggleAd = (id: string) => {
    setAds((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: a.isActive === false ? true : false } : a))
    );
    sound.playTick();
  };

  const handleToggleSurvey = (id: string) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: s.isActive === false ? true : false } : s))
    );
    sound.playTick();
  };

  const handleToggleShortlink = (id: string) => {
    setShortlinks((prev) =>
      prev.map((sl) => (sl.id === id ? { ...sl, isActive: sl.isActive === false ? true : false } : sl))
    );
    sound.playTick();
  };

  const handleToggleMapReview = (id: string) => {
    setMapReviews((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: m.isActive === false ? true : false } : m))
    );
    sound.playTick();
  };

  const handleToggleSocialTask = (id: string) => {
    setSocialTasks((prev) =>
      prev.map((soc) => (soc.id === id ? { ...soc, isActive: soc.isActive === false ? true : false } : soc))
    );
    sound.playTick();
  };

  // Admin deletes
  const handleDeleteAd = (id: string) => {
    if (window.confirm('Xóa chiến dịch quảng cáo này?')) {
      setAds((prev) => prev.filter((a) => a.id !== id));
      sound.playTick();
    }
  };

  const handleDeleteSurvey = (id: string) => {
    if (window.confirm('Xóa đề tài khảo sát này?')) {
      setSurveys((prev) => prev.filter((s) => s.id !== id));
      sound.playTick();
    }
  };

  const handleDeleteShortlink = (id: string) => {
    if (window.confirm('Xóa nhiệm vụ vượt link này?')) {
      setShortlinks((prev) => prev.filter((sl) => sl.id !== id));
      sound.playTick();
    }
  };

  const handleDeleteMapReview = (id: string) => {
    if (window.confirm('Xóa review Google Maps này?')) {
      setMapReviews((prev) => prev.filter((m) => m.id !== id));
      sound.playTick();
    }
  };

  const handleDeleteSocialTask = (id: string) => {
    if (window.confirm('Xóa nhiệm vụ mạng xã hội này?')) {
      setSocialTasks((prev) => prev.filter((soc) => soc.id !== id));
      sound.playTick();
    }
  };

  // Admin add tasks
  const handleAddAd = (newAd: AdTask) => {
    setAds((prev) => [newAd, ...prev]);
  };

  const handleAddSurvey = (newSurvey: SurveyTask) => {
    setSurveys((prev) => [newSurvey, ...prev]);
  };

  const handleAddShortlink = (newSl: ShortlinkTask) => {
    setShortlinks((prev) => [newSl, ...prev]);
  };

  const handleAddMapReview = (newMap: MapReviewTask) => {
    setMapReviews((prev) => [newMap, ...prev]);
  };

  const handleAddSocialTask = (newSoc: SocialTask) => {
    setSocialTasks((prev) => [newSoc, ...prev]);
  };

  const handleAdjustUserBalance = (userId: string, deltaAmount: number) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              balance: Math.max(0, u.balance + deltaAmount),
              totalEarned: deltaAmount > 0 ? u.totalEarned + deltaAmount : u.totalEarned,
            }
          : u
      )
    );

    if (user.id === userId) {
      setUser((prev) => ({
        ...prev,
        balance: Math.max(0, prev.balance + deltaAmount),
        totalEarned: deltaAmount > 0 ? prev.totalEarned + deltaAmount : prev.totalEarned,
      }));
    }

    const tx: Transaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      userId,
      type: 'referral',
      title: deltaAmount > 0 ? 'Thưởng sự kiện từ Quản trị viên' : 'Điều chỉnh số dư ví',
      amount: deltaAmount,
      date: getTimestamp(),
      status: 'completed',
      note: 'Admin điều chỉnh trực tiếp',
    };
    setTransactions((prev) => [tx, ...prev]);

    addToast({
      type: 'success',
      title: deltaAmount > 0 ? 'Đã Tặng Thưởng Thành Viên' : 'Điều Chỉnh Số Dư Ví',
      message: `Đã cập nhật ${deltaAmount > 0 ? '+' : ''}${formatVND(deltaAmount)} cho người dùng #${userId}.`,
      amount: deltaAmount,
    });
  };

  // Admin: Update user role
  const handleUpdateUserRole = (userId: string, newRole: 'user' | 'moderator' | 'admin') => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (user.id === userId) {
      setUser((prev) => ({ ...prev, role: newRole }));
    }

    const roleName = newRole === 'admin' ? 'Quản trị viên' : newRole === 'moderator' ? 'Kiểm duyệt viên' : 'Thành viên thường';
    addToast({
      type: 'info',
      title: 'Cập Nhật Vai Trò Thành Công',
      message: `Đã thay đổi vai trò tài khoản thành "${roleName}".`,
    });
  };

  // Admin: Ban / Unban user
  const handleToggleBanUser = (userId: string, reason?: string) => {
    let nextStatus: 'active' | 'banned' = 'banned';
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          nextStatus = u.status === 'banned' ? 'active' : 'banned';
          return {
            ...u,
            status: nextStatus,
            bannedReason: nextStatus === 'banned' ? (reason || 'Vi phạm điều khoản cộng đồng') : undefined,
            bannedAt: nextStatus === 'banned' ? getTimestamp() : undefined,
          };
        }
        return u;
      })
    );
    if (user.id === userId) {
      setUser((prev) => {
        const next = prev.status === 'banned' ? 'active' : 'banned';
        return {
          ...prev,
          status: next,
          bannedReason: next === 'banned' ? (reason || 'Vi phạm điều khoản cộng đồng') : undefined,
          bannedAt: next === 'banned' ? getTimestamp() : undefined,
        };
      });
    }

    addToast({
      type: 'warning',
      title: nextStatus === 'banned' ? 'Đã Khóa Tài Khoản' : 'Đã Mở Khóa Tài Khoản',
      message: nextStatus === 'banned'
        ? `Tài khoản đã bị tạm dừng hoạt động. Lý do: ${reason || 'Vi phạm quy định'}.`
        : 'Tài khoản đã được phục hồi trạng thái hoạt động bình thường.',
    });
  };

  // Admin: Permanently delete user
  const handleDeleteUser = (userId: string) => {
    if (userId === 'user-admin') return;
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    if (user.id === userId) {
      setUser(INITIAL_USER);
    }

    addToast({
      type: 'error',
      title: 'Đã Xóa Vĩnh Viễn Người Dùng',
      message: `Tài khoản #${userId} và dữ liệu liên quan đã được xóa khỏi hệ thống.`,
    });
  };

  // Admin: Update task reward amount
  const handleUpdateTaskReward = (
    category: 'ad' | 'survey' | 'shortlink' | 'map_review' | 'social',
    id: string,
    newReward: number
  ) => {
    if (category === 'ad') {
      setAds((prev) => prev.map((a) => (a.id === id ? { ...a, reward: newReward } : a)));
    } else if (category === 'survey') {
      setSurveys((prev) => prev.map((s) => (s.id === id ? { ...s, reward: newReward } : s)));
    } else if (category === 'shortlink') {
      setShortlinks((prev) => prev.map((sl) => (sl.id === id ? { ...sl, reward: newReward } : sl)));
    } else if (category === 'map_review') {
      setMapReviews((prev) => prev.map((m) => (m.id === id ? { ...m, reward: newReward } : m)));
    } else if (category === 'social') {
      setSocialTasks((prev) => prev.map((soc) => (soc.id === id ? { ...soc, reward: newReward } : soc)));
    }

    addToast({
      type: 'success',
      title: 'Cập Nhật Thù Lao Thành Công!',
      message: `Thù lao nhiệm vụ đã được đặt thành ${formatVND(newReward)} cho mỗi lượt hoàn thành.`,
      amount: newReward,
    });
  };

  // Reset demo data helper
  const handleResetDemoData = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại dữ liệu mẫu ban đầu để kiểm tra các nhiệm vụ từ đầu?')) {
      setUser(INITIAL_USER);
      setUsersList(SEED_USERS);
      setAds(INITIAL_ADS);
      setSurveys(INITIAL_SURVEYS);
      setShortlinks(INITIAL_SHORTLINKS);
      setMapReviews(INITIAL_MAP_REVIEWS);
      setSocialTasks(INITIAL_SOCIAL_TASKS);
      setTransactions(INITIAL_TRANSACTIONS);
      localStorage.clear();
      sound.playTick();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Bar Header */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        completedTasksCount={completedTasksCount}
        onOpenLevelModal={() => setIsLevelModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation sub-strip for quick category access */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-900 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-emerald-400 font-semibold">MMO VN</span>
            <span>/</span>
            <span className="text-white capitalize">
              {activeTab === 'tasks' && 'Tổng quan thu nhập & Nhiệm vụ'}
              {activeTab === 'ads' && 'Xem quảng cáo trả phí (PTC)'}
              {activeTab === 'surveys' && 'Khảo sát thị trường nhận thưởng'}
              {activeTab === 'shortlink' && 'Vượt link rút gọn tìm mã 6 số'}
              {activeTab === 'map_review' && 'Đánh giá 5 sao Google Maps'}
              {activeTab === 'social' && 'Nhiệm vụ Mạng Xã Hội (Like & Follow)'}
              {activeTab === 'checkin' && 'Điểm danh hằng ngày'}
              {activeTab === 'wheel' && 'Vòng quay may mắn'}
              {activeTab === 'withdraw' && 'Rút tiền về MoMo / Ngân hàng / Thẻ cào'}
              {activeTab === 'referral' && 'Tiếp thị liên kết & Mời bạn bè'}
              {activeTab === 'leaderboard' && 'Bảng vàng vinh danh thu nhập'}
              {activeTab === 'history' && 'Lịch sử giao dịch chi tiết'}
              {activeTab === 'admin' && 'Trang Quản trị Hệ Thống (Admin Portal)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <>
                <button
                  onClick={() => { setActiveTab('admin'); sound.playTick(); }}
                  className={`flex items-center gap-1 font-bold transition-colors ${activeTab === 'admin' ? 'text-purple-400' : 'text-slate-400 hover:text-purple-300'}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin Dashboard</span>
                </button>
                <span className="text-slate-700">·</span>
              </>
            )}
            <button
              onClick={() => { setActiveTab('referral'); sound.playTick(); }}
              className={`hover:text-emerald-400 transition-colors ${activeTab === 'referral' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
            >
              Mời bạn bè (+10%)
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => { setActiveTab('leaderboard'); sound.playTick(); }}
              className={`hover:text-amber-400 transition-colors ${activeTab === 'leaderboard' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
            >
              Đua top tuần
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => { setActiveTab('history'); sound.playTick(); }}
              className={`hover:text-slate-200 transition-colors ${activeTab === 'history' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
            >
              Lịch sử ví
            </button>
          </div>
        </div>

        {/* View Routing */}
        {activeTab === 'tasks' && (
          <HeroOverview
            user={user}
            setActiveTab={setActiveTab}
            ads={ads}
            surveys={surveys}
            onSelectAd={(ad) => setSelectedAd(ad)}
            onSelectSurvey={(survey) => setSelectedSurvey(survey)}
            transactions={transactions}
            onOpenLevelModal={() => setIsLevelModalOpen(true)}
          />
        )}

        {activeTab === 'ads' && (
          <AdTasksView
            ads={ads}
            onSelectAd={(ad) => setSelectedAd(ad)}
          />
        )}

        {activeTab === 'surveys' && (
          <SurveyView
            surveys={surveys}
            onSelectSurvey={(survey) => setSelectedSurvey(survey)}
          />
        )}

        {activeTab === 'shortlink' && (
          <ShortlinkTasksView
            shortlinks={shortlinks}
            onCompleteTask={handleShortlinkComplete}
          />
        )}

        {activeTab === 'map_review' && (
          <MapReviewView
            reviews={mapReviews}
            onCompleteTask={handleMapReviewComplete}
          />
        )}

        {activeTab === 'social' && (
          <SocialTasksView
            socialTasks={socialTasks}
            onCompleteTask={handleSocialComplete}
          />
        )}

        {activeTab === 'checkin' && (
          <DailyCheckInView
            user={user}
            onCheckIn={handleCheckIn}
          />
        )}

        {activeTab === 'wheel' && (
          <LuckyWheelView
            luckySpins={user.luckySpins}
            onWinPrize={handleLuckyWheelWin}
            onNavigateToTasks={() => setActiveTab('ads')}
          />
        )}

        {activeTab === 'withdraw' && (
          <WithdrawView
            user={user}
            onWithdraw={handleWithdraw}
          />
        )}

        {activeTab === 'referral' && (
          <ReferralView user={user} />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView />
        )}

        {activeTab === 'history' && (
          <HistoryView transactions={transactions} />
        )}

        {activeTab === 'admin' && (
          user.role === 'admin' ? (
            <AdminDashboard
              currentUser={user}
              transactions={transactions}
              ads={ads}
              surveys={surveys}
              shortlinks={shortlinks}
              mapReviews={mapReviews}
              socialTasks={socialTasks}
              usersList={usersList}
              onApproveWithdraw={handleApproveWithdraw}
              onRejectWithdraw={handleRejectWithdraw}
              onToggleAd={handleToggleAd}
              onToggleSurvey={handleToggleSurvey}
              onToggleShortlink={handleToggleShortlink}
              onToggleMapReview={handleToggleMapReview}
              onToggleSocialTask={handleToggleSocialTask}
              onDeleteAd={handleDeleteAd}
              onDeleteSurvey={handleDeleteSurvey}
              onDeleteShortlink={handleDeleteShortlink}
              onDeleteMapReview={handleDeleteMapReview}
              onDeleteSocialTask={handleDeleteSocialTask}
              onAddAd={handleAddAd}
              onAddSurvey={handleAddSurvey}
              onAddShortlink={handleAddShortlink}
              onAddMapReview={handleAddMapReview}
              onAddSocialTask={handleAddSocialTask}
              onAdjustUserBalance={handleAdjustUserBalance}
              onUpdateUserRole={handleUpdateUserRole}
              onToggleBanUser={handleToggleBanUser}
              onDeleteUser={handleDeleteUser}
              onUpdateTaskReward={handleUpdateTaskReward}
            />
          ) : (
            /* Protected from standard usernames - Generic 404 forbidden view */
            <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-md mx-auto my-12">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">404 - Không Tìm Thấy Trang</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nội dung này không tồn tại hoặc bạn không có quyền truy cập vào đường dẫn này.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => { setActiveTab('tasks'); sound.playTick(); }}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
                >
                  Quay lại Trang Chủ
                </button>
              </div>
            </div>
          )
        )}

      </main>

      {/* Interactive Ad Viewer Modal */}
      {selectedAd && (
        <AdPlayerModal
          ad={selectedAd}
          onClose={() => setSelectedAd(null)}
          onReward={handleAdReward}
        />
      )}

      {/* Interactive Survey Wizard Modal */}
      {selectedSurvey && (
        <SurveyPlayerModal
          survey={selectedSurvey}
          onClose={() => setSelectedSurvey(null)}
          onComplete={handleSurveyComplete}
        />
      )}

      {/* Auth Modal (Login / Register for users) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        usersList={usersList}
      />

      {/* Admin Secret Portal Modal (Dedicated isolated access) */}
      <AdminSecretModal
        isOpen={isAdminSecretModalOpen}
        onClose={() => setIsAdminSecretModalOpen(false)}
        onAdminLogin={(admin) => {
          handleLogin(admin);
          setActiveTab('admin');
        }}
        usersList={usersList}
      />

      {/* Member Level & VIP Tier Roadmap Modal */}
      <LevelRoadmapModal
        isOpen={isLevelModalOpen}
        onClose={() => setIsLevelModalOpen(false)}
        progressInfo={levelProgress}
        totalEarned={user.totalEarned}
      />

      {/* Banned User Alert Overlay - Prevents banned users from actions */}
      {user.status === 'banned' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-rose-800 rounded-2xl p-6 space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
              <Ban className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-rose-400">Tài Khoản Đã Bị Khóa</h3>
            <div className="p-3.5 bg-rose-950/40 border border-rose-900/60 rounded-xl text-xs text-rose-200 text-left space-y-1.5 font-mono">
              <div><strong className="text-white">Thành viên:</strong> {user.name}</div>
              <div><strong className="text-white">Email:</strong> {user.email}</div>
              <div className="text-rose-300">
                <strong className="text-white">Lý do xử phạt:</strong> {user.bannedReason || 'Gian lận click ảo / Sử dụng công cụ auto bot'}
              </div>
              <div className="text-slate-400 text-[10px]">
                Mọi quyền kiếm tiền và rút tiền đã bị tạm ngừng.
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nếu bạn cho rằng việc khóa tài khoản này là sự nhầm lẫn, vui lòng liên hệ đội ngũ hỗ trợ MMO VN.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  handleLogin(INITIAL_USER);
                  sound.playTick();
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
              >
                Đăng Xuất & Chuyển Tài Khoản Khác
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">MMO VN</span>
            <span>—</span>
            <span>Nền tảng làm nhiệm vụ kiếm tiền online uy tín tại Việt Nam</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {user.role === 'admin' ? (
              <button
                onClick={() => {
                  handleLogin(INITIAL_USER);
                  setActiveTab('tasks');
                  sound.playTick();
                }}
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Thoát Chế Độ Quản Trị</span>
              </button>
            ) : (
              /* Discreet, private entry for system administrators only - invisible to ordinary users */
              <button
                onClick={() => {
                  setIsAdminSecretModalOpen(true);
                  sound.playTick();
                }}
                className="text-slate-800 hover:text-slate-600 transition-colors p-1"
                title="Cổng nội bộ"
                aria-label="Cổng nội bộ"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleResetDemoData}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors p-1"
              title="Đặt lại dữ liệu mẫu ban đầu để trải nghiệm lại từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại dữ liệu</span>
            </button>
          </div>

        </div>
      </footer>

      {/* Floating Push Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
