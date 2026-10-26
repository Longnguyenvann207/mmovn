export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  status?: 'active' | 'banned';
  bannedReason?: string;
  bannedAt?: string;
  avatar: string;
  balance: number; // in VNĐ
  pendingBalance: number;
  totalEarned: number;
  vipLevel: number; // 1: Đồng, 2: Bạc, 3: Vàng, 4: Bạch Kim, 5: Kim Cương
  vipMultiplier: number;
  luckySpins: number;
  streakDays: number;
  lastCheckInDate: string | null; // YYYY-MM-DD
  referralCode: string;
  referralCount: number;
  referralEarnings: number;
  joinedDate?: string;
}

export interface AdTask {
  id: string;
  title: string;
  advertiser: string;
  reward: number; // in VNĐ
  durationSec: number;
  category: 'Công nghệ' | 'Thương mại điện tử' | 'Tài chính' | 'Trò chơi' | 'Ẩm thực';
  imageUrl: string;
  viewsCount: number;
  verifiedQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
  };
  isActive?: boolean;
  isCompleted?: boolean;
  sponsorUrl?: string;
  description: string;
}

export interface SurveyQuestion {
  id: number;
  question: string;
  type: 'single' | 'multiple' | 'rating' | 'text';
  options: string[];
}

export interface SurveyTask {
  id: string;
  title: string;
  institution: string;
  reward: number;
  estimatedMinutes: number;
  category: 'Hành vi tiêu dùng' | 'Tài chính số' | 'Công nghệ & AI' | 'Giải trí';
  imageUrl: string;
  participantsCount: number;
  rating: number;
  questions: SurveyQuestion[];
  isActive?: boolean;
  isCompleted?: boolean;
  description: string;
}

export interface ShortlinkTask {
  id: string;
  title: string;
  provider: string; // e.g. Link1s, Traffic120, YeuLink
  reward: number;
  searchKeyword: string;
  targetDomain: string;
  correctCode: string;
  steps: string[];
  isActive?: boolean;
  isCompleted?: boolean;
  completionsCount: number;
}

export interface MapReviewTask {
  id: string;
  title: string;
  placeName: string;
  category: 'Nhà hàng & Ẩm thực' | 'Dịch vụ & Spa' | 'Nha khoa & Y tế' | 'Khách sạn' | 'Công ty & Dịch vụ';
  address: string;
  reward: number;
  mapUrl: string;
  suggestedContent: string;
  minRating: number;
  isActive?: boolean;
  isCompleted?: boolean;
  reviewsCount: number;
}

export interface SocialTask {
  id: string;
  platform: 'facebook' | 'tiktok' | 'youtube' | 'instagram';
  actionType: 'like' | 'follow' | 'subscribe' | 'comment' | 'share';
  title: string;
  targetName: string;
  targetUrl: string;
  reward: number;
  guideText: string;
  isActive?: boolean;
  isCompleted?: boolean;
  completionsCount: number;
}

export interface AppRegisterTask {
  id: string;
  title: string;
  partnerName: string;
  platform: 'all' | 'android' | 'ios' | 'web';
  category: 'Ngân hàng số' | 'Ví điện tử' | 'Sàn tiền số / Crypto' | 'Thương mại điện tử' | 'Đầu tư tài chính';
  reward: number; // in VNĐ
  imageUrl: string;
  downloadOrRegisterUrl: string;
  requirement: string;
  steps: string[];
  proofPlaceholder: string;
  status?: 'not_started' | 'pending' | 'approved' | 'rejected';
  submittedProof?: string;
  submittedAt?: string;
  reviewedAt?: string;
  rejectedReason?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  completionsCount: number;
}

export interface DailyCheckInDay {
  day: number;
  reward: number;
  bonusTitle?: string;
  isSpecial?: boolean;
}

export interface Transaction {
  id: string;
  userId?: string;
  userName?: string;
  type: 'ad' | 'survey' | 'checkin' | 'wheel' | 'referral' | 'withdraw' | 'shortlink' | 'map_review' | 'social' | 'app_register';
  title: string;
  amount: number;
  date: string;
  status: 'completed' | 'processing' | 'failed' | 'rejected';
  note?: string;
  method?: string;
  details?: string;
  rejectedReason?: string;
}

export type ActiveTab =
  | 'tasks'
  | 'ads'
  | 'surveys'
  | 'shortlink'
  | 'map_review'
  | 'social'
  | 'app_register'
  | 'checkin'
  | 'wheel'
  | 'withdraw'
  | 'referral'
  | 'leaderboard'
  | 'history'
  | 'admin';

export type ThemeMode = 'dark' | 'light';
