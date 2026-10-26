import React, { useState } from 'react';
import { AdTask, MapReviewTask, ShortlinkTask, SocialTask, SurveyTask, Transaction, UserProfile, AppRegisterTask } from '../types/mmo';
import { formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Clock,
  PlaySquare,
  FileText,
  Users,
  Search,
  Trash2,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  AlertCircle,
  Link2,
  MapPin,
  Share2,
  Edit3,
  Save,
  Ban,
  UserCheck,
  ShieldAlert,
  Coins,
  Check,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: UserProfile;
  transactions: Transaction[];
  ads: AdTask[];
  surveys: SurveyTask[];
  shortlinks: ShortlinkTask[];
  mapReviews: MapReviewTask[];
  socialTasks: SocialTask[];
  appRegisters: AppRegisterTask[];
  usersList: UserProfile[];
  onApproveWithdraw: (txId: string) => void;
  onRejectWithdraw: (txId: string, reason: string) => void;
  onApproveAppRegister: (taskId: string) => void;
  onRejectAppRegister: (taskId: string, reason: string) => void;
  onToggleAd: (adId: string) => void;
  onToggleSurvey: (surveyId: string) => void;
  onToggleShortlink: (id: string) => void;
  onToggleMapReview: (id: string) => void;
  onToggleSocialTask: (id: string) => void;
  onToggleAppRegister: (id: string) => void;
  onDeleteAd: (adId: string) => void;
  onDeleteSurvey: (surveyId: string) => void;
  onDeleteShortlink: (id: string) => void;
  onDeleteMapReview: (id: string) => void;
  onDeleteSocialTask: (id: string) => void;
  onDeleteAppRegister: (id: string) => void;
  onAddAd: (newAd: AdTask) => void;
  onAddSurvey: (newSurvey: SurveyTask) => void;
  onAddShortlink: (newShortlink: ShortlinkTask) => void;
  onAddMapReview: (newReview: MapReviewTask) => void;
  onAddSocialTask: (newSocial: SocialTask) => void;
  onAddAppRegister: (newApp: AppRegisterTask) => void;
  onAdjustUserBalance: (userId: string, deltaAmount: number) => void;
  // Member & Task Management controls
  onUpdateUserRole: (userId: string, newRole: 'user' | 'moderator' | 'admin') => void;
  onToggleBanUser: (userId: string, reason?: string) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateTaskReward: (category: 'ad' | 'survey' | 'shortlink' | 'map_review' | 'social' | 'app_register', id: string, newReward: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  transactions,
  ads,
  surveys,
  shortlinks,
  mapReviews,
  socialTasks,
  appRegisters,
  usersList,
  onApproveWithdraw,
  onRejectWithdraw,
  onApproveAppRegister,
  onRejectAppRegister,
  onToggleAd,
  onToggleSurvey,
  onToggleShortlink,
  onToggleMapReview,
  onToggleSocialTask,
  onToggleAppRegister,
  onDeleteAd,
  onDeleteSurvey,
  onDeleteShortlink,
  onDeleteMapReview,
  onDeleteSocialTask,
  onDeleteAppRegister,
  onAddAd,
  onAddSurvey,
  onAddShortlink,
  onAddMapReview,
  onAddSocialTask,
  onAddAppRegister,
  onAdjustUserBalance,
  onUpdateUserRole,
  onToggleBanUser,
  onDeleteUser,
  onUpdateTaskReward,
}) => {
  const [adminTab, setAdminTab] = useState<'withdrawals' | 'app_registers' | 'tasks' | 'add_task' | 'members'>('withdrawals');
  
  // Withdrawal filter
  const [withdrawFilter, setWithdrawFilter] = useState<'all' | 'processing' | 'completed' | 'rejected'>('processing');
  const [rejectModalTx, setRejectModalTx] = useState<Transaction | null>(null);
  const [rejectReason, setRejectReason] = useState('Thông tin tài khoản nhận tiền không chính xác');

  // App register review state
  const [appRegisterFilter, setAppRegisterFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [rejectModalApp, setRejectModalApp] = useState<AppRegisterTask | null>(null);
  const [rejectAppReason, setRejectAppReason] = useState('Thông tin đăng ký chưa được ghi nhận trên hệ thống đối tác');

  // Task sub category in task toggle list
  const [manageCategory, setManageCategory] = useState<'ads' | 'surveys' | 'app_register' | 'shortlink' | 'map_review' | 'social'>('ads');

  // Inline Reward editing state { [taskId]: number }
  const [editingRewards, setEditingRewards] = useState<{ [id: string]: number }>({});
  const [savedRewardId, setSavedRewardId] = useState<string | null>(null);

  // Modal to edit task reward & details
  const [editTaskModal, setEditTaskModal] = useState<{
    category: 'ad' | 'survey' | 'shortlink' | 'map_review' | 'social' | 'app_register';
    id: string;
    title: string;
    reward: number;
  } | null>(null);

  // Ban Member Modal State
  const [banModalUser, setBanModalUser] = useState<UserProfile | null>(null);
  const [banReasonInput, setBanReasonInput] = useState('Phát hiện hành vi gian lận / Auto tool');

  // Delete Member Confirmation State
  const [deleteModalUser, setDeleteModalUser] = useState<UserProfile | null>(null);

  // Add Task sub-tab
  const [taskTypeToAdd, setTaskTypeToAdd] = useState<'ad' | 'survey' | 'app_register' | 'shortlink' | 'map_review' | 'social'>('ad');

  // New App Register form state
  const [newAppTitle, setNewAppTitle] = useState('');
  const [newAppPartner, setNewAppPartner] = useState('');
  const [newAppCategory, setNewAppCategory] = useState<AppRegisterTask['category']>('Ngân hàng số');
  const [newAppPlatform, setNewAppPlatform] = useState<AppRegisterTask['platform']>('all');
  const [newAppReward, setNewAppReward] = useState('45000');
  const [newAppUrl, setNewAppUrl] = useState('https://mbbank.com.vn');
  const [newAppRequirement, setNewAppRequirement] = useState('');
  const [newAppSteps, setNewAppSteps] = useState('Bước 1: Tải ứng dụng từ liên kết đối tác\nBước 2: Đăng ký tài khoản và hoàn tất eKYC\nBước 3: Nhập số điện thoại đăng ký');
  const [newAppProofPlaceholder, setNewAppProofPlaceholder] = useState('Nhập SĐT hoặc Số tài khoản đăng ký');

  // New Ad form state
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdAdvertiser, setNewAdAdvertiser] = useState('');
  const [newAdReward, setNewAdReward] = useState('5000');
  const [newAdDuration, setNewAdDuration] = useState('15');
  const [newAdCategory, setNewAdCategory] = useState<AdTask['category']>('Công nghệ');
  const [newAdImage, setNewAdImage] = useState('/src/assets/images/ad_tech_gadget_1792935623115.jpg');
  const [newAdDesc, setNewAdDesc] = useState('');
  const [newAdQuestion, setNewAdQuestion] = useState('');
  const [newAdOpt0, setNewAdOpt0] = useState('');
  const [newAdOpt1, setNewAdOpt1] = useState('');
  const [newAdOpt2, setNewAdOpt2] = useState('');
  const [newAdOpt3, setNewAdOpt3] = useState('');
  const [newAdCorrectIdx, setNewAdCorrectIdx] = useState(0);

  // New Survey form state
  const [newSurvTitle, setNewSurvTitle] = useState('');
  const [newSurvInst, setNewSurvInst] = useState('');
  const [newSurvReward, setNewSurvReward] = useState('20000');
  const [newSurvDuration, setNewSurvDuration] = useState('3');
  const [newSurvCat, setNewSurvCat] = useState<SurveyTask['category']>('Hành vi tiêu dùng');
  const [newSurvDesc, setNewSurvDesc] = useState('');
  const [newSurvQ1, setNewSurvQ1] = useState('Bạn đánh giá chất lượng sản phẩm như thế nào?');
  const [newSurvQ2, setNewSurvQ2] = useState('Yếu tố nào tác động lớn nhất đến quyết định mua của bạn?');

  // New Shortlink form state
  const [newSlTitle, setNewSlTitle] = useState('');
  const [newSlProvider, setNewSlProvider] = useState('Link1s Pro');
  const [newSlKeyword, setNewSlKeyword] = useState('');
  const [newSlDomain, setNewSlDomain] = useState('');
  const [newSlCode, setNewSlCode] = useState('');
  const [newSlReward, setNewSlReward] = useState('3500');

  // New Map Review form state
  const [newMapTitle, setNewMapTitle] = useState('');
  const [newMapPlace, setNewMapPlace] = useState('');
  const [newMapCategory, setNewMapCategory] = useState<MapReviewTask['category']>('Nhà hàng & Ẩm thực');
  const [newMapAddress, setNewMapAddress] = useState('');
  const [newMapReward, setNewMapReward] = useState('25000');
  const [newMapUrl, setNewMapUrl] = useState('https://maps.google.com');
  const [newMapContent, setNewMapContent] = useState('');

  // New Social form state
  const [newSocTitle, setNewSocTitle] = useState('');
  const [newSocPlatform, setNewSocPlatform] = useState<SocialTask['platform']>('tiktok');
  const [newSocAction, setNewSocAction] = useState<SocialTask['actionType']>('like');
  const [newSocTarget, setNewSocTarget] = useState('');
  const [newSocUrl, setNewSocUrl] = useState('');
  const [newSocReward, setNewSocReward] = useState('3000');
  const [newSocGuide, setNewSocGuide] = useState('');

  // Search in member list
  const [userSearch, setUserSearch] = useState('');
  const [formAlert, setFormAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Filter withdrawals
  const withdrawalTxs = transactions.filter((t) => t.type === 'withdraw');
  const filteredWithdrawals = withdrawalTxs.filter((t) => {
    if (withdrawFilter === 'all') return true;
    return t.status === withdrawFilter;
  });

  const pendingCount = withdrawalTxs.filter((t) => t.status === 'processing').length;
  const pendingTotal = withdrawalTxs
    .filter((t) => t.status === 'processing')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalActiveTasks =
    ads.filter((a) => a.isActive !== false).length +
    surveys.filter((s) => s.isActive !== false).length +
    shortlinks.filter((sl) => sl.isActive !== false).length +
    mapReviews.filter((m) => m.isActive !== false).length +
    socialTasks.filter((soc) => soc.isActive !== false).length;

  // Handlers for approval / reject
  const handleApprove = (txId: string) => {
    sound.playSuccess();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    onApproveWithdraw(txId);
  };

  const handleOpenReject = (tx: Transaction) => {
    setRejectModalTx(tx);
    setRejectReason('Thông tin tài khoản nhận tiền không chính xác');
  };

  const handleConfirmReject = () => {
    if (!rejectModalTx) return;
    sound.playTick();
    onRejectWithdraw(rejectModalTx.id, rejectReason);
    setRejectModalTx(null);
  };

  // Quick save reward handler
  const handleSaveInlineReward = (
    category: 'ad' | 'survey' | 'shortlink' | 'map_review' | 'social',
    id: string,
    currentReward: number
  ) => {
    const val = editingRewards[id] !== undefined ? editingRewards[id] : currentReward;
    if (isNaN(val) || val < 100) return;

    onUpdateTaskReward(category, id, val);
    sound.playCoin();
    setSavedRewardId(id);
    setTimeout(() => {
      setSavedRewardId(null);
    }, 2000);
  };

  // Save reward via modal
  const handleSaveModalReward = () => {
    if (!editTaskModal) return;
    const val = editTaskModal.reward;
    if (isNaN(val) || val < 100) return;

    onUpdateTaskReward(editTaskModal.category, editTaskModal.id, val);
    sound.playSuccess();
    setEditTaskModal(null);
  };

  // Confirm Ban Member
  const handleConfirmBan = () => {
    if (!banModalUser) return;
    onToggleBanUser(banModalUser.id, banReasonInput);
    sound.playTick();
    setBanModalUser(null);
  };

  // Confirm Delete Member
  const handleConfirmDelete = () => {
    if (!deleteModalUser) return;
    onDeleteUser(deleteModalUser.id);
    sound.playTick();
    setDeleteModalUser(null);
  };

  // Submit New Ad
  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormAlert(null);

    if (!newAdTitle || !newAdAdvertiser || !newAdQuestion || !newAdOpt0 || !newAdOpt1) {
      setFormAlert({ type: 'error', msg: 'Vui lòng điền đầy đủ tiêu đề, nhà tài trợ và câu hỏi xác thực.' });
      return;
    }

    const createdAd: AdTask = {
      id: `ad-${Date.now()}`,
      title: newAdTitle.trim(),
      advertiser: newAdAdvertiser.trim(),
      reward: parseInt(newAdReward, 10) || 3000,
      durationSec: parseInt(newAdDuration, 10) || 15,
      category: newAdCategory,
      imageUrl: newAdImage.trim() || '/src/assets/images/ad_tech_gadget_1792935623115.jpg',
      viewsCount: 0,
      isActive: true,
      description: newAdDesc.trim() || 'Xem quảng cáo giới thiệu sản phẩm để nhận tiền mặt.',
      verifiedQuestion: {
        question: newAdQuestion.trim(),
        options: [newAdOpt0.trim(), newAdOpt1.trim(), newAdOpt2.trim() || 'Phương án C', newAdOpt3.trim() || 'Phương án D'],
        correctIndex: newAdCorrectIdx,
      },
    };

    onAddAd(createdAd);
    sound.playSuccess();
    setFormAlert({ type: 'success', msg: `Đã thêm thành công chiến dịch quảng cáo "${newAdTitle}"!` });
    setNewAdTitle('');
    setNewAdAdvertiser('');
  };

  // Submit New Survey
  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    setFormAlert(null);

    if (!newSurvTitle || !newSurvInst || !newSurvQ1) {
      setFormAlert({ type: 'error', msg: 'Vui lòng điền đầy đủ tiêu đề, cơ quan khảo sát và câu hỏi.' });
      return;
    }

    const createdSurvey: SurveyTask = {
      id: `survey-${Date.now()}`,
      title: newSurvTitle.trim(),
      institution: newSurvInst.trim(),
      reward: parseInt(newSurvReward, 10) || 15000,
      estimatedMinutes: parseInt(newSurvDuration, 10) || 3,
      category: newSurvCat,
      imageUrl: '/src/assets/images/survey_consumer_lifestyle_1792935622861.jpg',
      participantsCount: 0,
      rating: 5.0,
      isActive: true,
      description: newSurvDesc.trim() || 'Khảo sát ý kiến người tiêu dùng với thù lao tiền mặt hấp dẫn.',
      questions: [
        {
          id: 1,
          question: newSurvQ1.trim(),
          type: 'single',
          options: ['Rất hài lòng / Thường xuyên', 'Khá hài lòng / Đôi khi', 'Bình thường / Chưa chắc', 'Không hài lòng / Chưa từng'],
        },
        {
          id: 2,
          question: newSurvQ2.trim() || 'Đóng góp ý kiến thêm:',
          type: 'text',
          options: [],
        },
      ],
    };

    onAddSurvey(createdSurvey);
    sound.playSuccess();
    setFormAlert({ type: 'success', msg: `Đã thêm thành công đề tài khảo sát "${newSurvTitle}"!` });
    setNewSurvTitle('');
    setNewSurvInst('');
  };

  // Submit New Shortlink
  const handleCreateShortlink = (e: React.FormEvent) => {
    e.preventDefault();
    setFormAlert(null);

    if (!newSlTitle || !newSlKeyword || !newSlDomain || !newSlCode) {
      setFormAlert({ type: 'error', msg: 'Vui lòng điền đầy đủ tiêu đề, từ khóa, tên miền và mã 6 số.' });
      return;
    }

    const createdSl: ShortlinkTask = {
      id: `sl-${Date.now()}`,
      title: newSlTitle.trim(),
      provider: newSlProvider.trim(),
      reward: parseInt(newSlReward, 10) || 3500,
      searchKeyword: newSlKeyword.trim(),
      targetDomain: newSlDomain.trim(),
      correctCode: newSlCode.trim(),
      steps: [
        `Tìm kiếm từ khóa Google: ${newSlKeyword.trim()}`,
        `Bấm vào kết quả website ${newSlDomain.trim()}`,
        'Cuộn xuống chân trang đợi đếm ngược lấy mã',
        'Dán mã xác nhận vào hệ thống để nhận tiền',
      ],
      isActive: true,
      completionsCount: 0,
    };

    onAddShortlink(createdSl);
    sound.playSuccess();
    setFormAlert({ type: 'success', msg: `Đã thêm nhiệm vụ vượt link "${newSlTitle}"!` });
    setNewSlTitle('');
    setNewSlKeyword('');
    setNewSlDomain('');
    setNewSlCode('');
  };

  // Submit New Map Review
  const handleCreateMapReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormAlert(null);

    if (!newMapTitle || !newMapPlace || !newMapAddress || !newMapContent) {
      setFormAlert({ type: 'error', msg: 'Vui lòng điền tên địa điểm, địa chỉ và nội dung review mẫu.' });
      return;
    }

    const createdMap: MapReviewTask = {
      id: `map-${Date.now()}`,
      title: newMapTitle.trim(),
      placeName: newMapPlace.trim(),
      category: newMapCategory,
      address: newMapAddress.trim(),
      reward: parseInt(newMapReward, 10) || 25000,
      mapUrl: newMapUrl.trim() || 'https://maps.google.com',
      suggestedContent: newMapContent.trim(),
      minRating: 5,
      isActive: true,
      reviewsCount: 0,
    };

    onAddMapReview(createdMap);
    sound.playSuccess();
    setFormAlert({ type: 'success', msg: `Đã thêm chiến dịch review Google Maps "${newMapPlace}"!` });
    setNewMapTitle('');
    setNewMapPlace('');
    setNewMapAddress('');
    setNewMapContent('');
  };

  // Submit New Social Task
  const handleCreateSocialTask = (e: React.FormEvent) => {
    e.preventDefault();
    setFormAlert(null);

    if (!newSocTitle || !newSocTarget || !newSocUrl) {
      setFormAlert({ type: 'error', msg: 'Vui lòng điền tiêu đề, tên tài khoản mục tiêu và link đích.' });
      return;
    }

    const createdSocial: SocialTask = {
      id: `soc-${Date.now()}`,
      platform: newSocPlatform,
      actionType: newSocAction,
      title: newSocTitle.trim(),
      targetName: newSocTarget.trim(),
      targetUrl: newSocUrl.trim(),
      reward: parseInt(newSocReward, 10) || 3000,
      guideText: newSocGuide.trim() || 'Bấm vào liên kết, thực hiện tương tác và bấm xác nhận.',
      isActive: true,
      completionsCount: 0,
    };

    onAddSocialTask(createdSocial);
    sound.playSuccess();
    setFormAlert({ type: 'success', msg: `Đã thêm nhiệm vụ MXH "${newSocTitle}"!` });
    setNewSocTitle('');
    setNewSocTarget('');
    setNewSocUrl('');
  };

  // Submit New App Register Task
  const handleCreateAppRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFormAlert(null);

    if (!newAppTitle || !newAppPartner || !newAppRequirement) {
      setFormAlert({ type: 'error', msg: 'Vui lòng điền đầy đủ tiêu đề, tên đối tác và yêu cầu thực hiện.' });
      return;
    }

    const stepsArray = newAppSteps
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const createdApp: AppRegisterTask = {
      id: `app-${Date.now()}`,
      title: newAppTitle.trim(),
      partnerName: newAppPartner.trim(),
      category: newAppCategory,
      platform: newAppPlatform,
      reward: parseInt(newAppReward, 10) || 45000,
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&auto=format&fit=crop&q=80',
      downloadOrRegisterUrl: newAppUrl.trim() || 'https://mbbank.com.vn',
      requirement: newAppRequirement.trim(),
      steps: stepsArray.length > 0 ? stepsArray : ['Tải app từ liên kết', 'Đăng ký và xác thực', 'Gửi SĐT đăng ký'],
      proofPlaceholder: newAppProofPlaceholder.trim() || 'Nhập SĐT hoặc Số tài khoản đăng ký',
      status: 'not_started',
      isActive: true,
      completionsCount: 0,
    };

    onAddAppRegister(createdApp);
    sound.playSuccess();
    setFormAlert({ type: 'success', msg: `Đã thêm thành công nhiệm vụ đăng ký "${newAppPartner}"!` });
    setNewAppTitle('');
    setNewAppPartner('');
    setNewAppRequirement('');
  };

  const pendingAppCount = appRegisters.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-800/40 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Khu vực Quản trị Độc Lập & Bảo Mật Cao (Admin Portal)</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Trung Tâm Điều Hành Quản Trị MMO VN
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Toàn quyền quản lý: Phê duyệt rút tiền, duyệt thù lao đăng ký app, sửa tiền thưởng nhiệm vụ, bật/tắt/xóa nhiệm vụ, sửa vai trò thành viên, khóa/mở khóa tài khoản.
          </p>
        </div>

        {/* Admin Overview Stats */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <div className="text-[11px] text-amber-400 font-medium">Lệnh rút chờ duyệt</div>
            <div className="text-xl font-black text-amber-400 font-mono tabular-nums mt-0.5">
              {pendingCount} lệnh ({formatVND(pendingTotal)})
            </div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
            <div className="text-[11px] text-blue-400 font-medium">Đăng ký App chờ duyệt</div>
            <div className="text-xl font-black text-blue-400 font-mono tabular-nums mt-0.5">
              {pendingAppCount} yêu cầu
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar shadow-sm">
        <button
          onClick={() => { setAdminTab('withdrawals'); sound.playTick(); }}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            adminTab === 'withdrawals'
              ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Duyệt Rút Tiền ({pendingCount})</span>
        </button>

        <button
          onClick={() => { setAdminTab('app_registers'); sound.playTick(); }}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            adminTab === 'app_registers'
              ? 'bg-blue-600 text-white shadow-sm font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Duyệt Đăng Ký App ({pendingAppCount})</span>
        </button>

        <button
          onClick={() => { setAdminTab('tasks'); sound.playTick(); }}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            adminTab === 'tasks'
              ? 'bg-emerald-500 text-white shadow-sm font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Quản Lý & Sửa Thù Lao ({totalActiveTasks})</span>
        </button>

        <button
          onClick={() => { setAdminTab('add_task'); sound.playTick(); }}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
            adminTab === 'add_task'
              ? 'bg-teal-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Thêm Nhiệm Vụ Mới</span>
        </button>

        <button
          onClick={() => { setAdminTab('members'); sound.playTick(); }}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
            adminTab === 'members'
              ? 'bg-purple-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Quản Lý Thành Viên ({usersList.length})</span>
        </button>
      </div>

      {/* TAB 1: DUYỆT RÚT TIỀN */}
      {adminTab === 'withdrawals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {(['processing', 'completed', 'rejected', 'all'] as const).map((status) => {
                const labels = {
                  processing: `Chờ duyệt (${pendingCount})`,
                  completed: 'Đã thanh toán',
                  rejected: 'Đã từ chối',
                  all: 'Tất cả lệnh',
                };
                return (
                  <button
                    key={status}
                    onClick={() => { setWithdrawFilter(status); sound.playTick(); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      withdrawFilter === status
                        ? 'bg-slate-800 text-white font-bold border border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {labels[status]}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Tổng số lệnh: {filteredWithdrawals.length}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3 font-medium">Mã GD & Thành viên</th>
                    <th className="px-5 py-3 font-medium">Hình thức rút</th>
                    <th className="px-5 py-3 font-medium">Thông tin nhận tiền</th>
                    <th className="px-5 py-3 font-medium text-right">Số tiền rút</th>
                    <th className="px-5 py-3 font-medium text-right">Trạng thái & Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredWithdrawals.length > 0 ? (
                    filteredWithdrawals.map((item) => {
                      const isPending = item.status === 'processing';
                      const isCompleted = item.status === 'completed';
                      const isRejected = item.status === 'rejected';

                      return (
                        <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-white">{item.userName || 'Thành viên'}</div>
                            <div className="text-[11px] text-slate-500 font-mono">#{item.id} · {item.date}</div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-xs font-medium text-slate-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                              {item.method || 'Rút tiền'}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-slate-300 font-mono text-[11px] max-w-sm">
                            <div className="truncate">{item.details || item.note}</div>
                            {item.rejectedReason && (
                              <div className="text-rose-400 text-[10px] mt-0.5">Lý do từ chối: {item.rejectedReason}</div>
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-mono font-bold text-sm text-amber-400 whitespace-nowrap">
                            {formatVND(Math.abs(item.amount))}
                          </td>

                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            {isPending ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleApprove(item.id)}
                                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Duyệt & Chuyển tiền</span>
                                </button>

                                <button
                                  onClick={() => handleOpenReject(item)}
                                  className="px-2.5 py-1.5 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Từ chối</span>
                                </button>
                              </div>
                            ) : isCompleted ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3" />
                                Đã thanh toán thành công
                              </span>
                            ) : isRejected ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-950/60 border border-rose-900/60 px-2 py-0.5 rounded">
                                <XCircle className="w-3 h-3" />
                                Đã từ chối (Đã hoàn tiền)
                              </span>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        Không có yêu cầu rút tiền nào trong danh mục này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUẢN LÝ NHIỆM VỤ & SỬA SỐ TIỀN THƯỞNG */}
      {adminTab === 'tasks' && (
        <div className="space-y-5">
          
          {/* Sub category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'ads', label: `Quảng Cáo (${ads.length})`, icon: <PlaySquare className="w-3.5 h-3.5" /> },
              { id: 'surveys', label: `Khảo Sát (${surveys.length})`, icon: <FileText className="w-3.5 h-3.5" /> },
              { id: 'shortlink', label: `Vượt Link (${shortlinks.length})`, icon: <Link2 className="w-3.5 h-3.5" /> },
              { id: 'map_review', label: `Review Map (${mapReviews.length})`, icon: <MapPin className="w-3.5 h-3.5" /> },
              { id: 'social', label: `Nhiệm Vụ MXH (${socialTasks.length})`, icon: <Share2 className="w-3.5 h-3.5" /> },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setManageCategory(cat.id as typeof manageCategory); sound.playTick(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  manageCategory === cat.id
                    ? 'bg-emerald-400 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>Tính năng Quản trị:</strong> Bạn có thể sửa trực tiếp số tiền nhận được khi hoàn thành nhiệm vụ và bấm nút "Lưu thù lao" (hoặc bật/tắt/xóa).
              </span>
            </span>
          </div>

          {/* 1. ADS LIST */}
          {manageCategory === 'ads' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <PlaySquare className="w-4 h-4 text-emerald-400" />
                    Quản Lý Xem Quảng Cáo ({ads.length} chiến dịch)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Sửa số tiền thưởng thành công, bật/tắt hoặc xóa chiến dịch.</p>
                </div>
                <button
                  onClick={() => { setAdminTab('add_task'); setTaskTypeToAdd('ad'); sound.playTick(); }}
                  className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Thêm Quảng Cáo
                </button>
              </div>

              <div className="space-y-3">
                {ads.map((ad) => {
                  const isActive = ad.isActive !== false;
                  const currentRewardVal = editingRewards[ad.id] !== undefined ? editingRewards[ad.id] : ad.reward;
                  const isSaved = savedRewardId === ad.id;

                  return (
                    <div
                      key={ad.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isActive ? 'bg-slate-950 border-slate-800' : 'bg-slate-950/40 border-slate-900 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-9 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                          <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white line-clamp-1">{ad.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5 font-mono">
                            {ad.advertiser} · {ad.durationSec}s · {ad.category}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        {/* Edit reward input */}
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
                          <span className="text-[10px] text-slate-400">Thù lao:</span>
                          <input
                            type="number"
                            step={500}
                            min={500}
                            value={currentRewardVal}
                            onChange={(e) => setEditingRewards({ ...editingRewards, [ad.id]: parseInt(e.target.value, 10) || 0 })}
                            className="w-24 px-1.5 py-0.5 text-xs bg-slate-950 border border-slate-700 rounded text-emerald-400 font-mono text-right font-bold focus:outline-none focus:border-emerald-500"
                          />
                          <span className="text-xs text-slate-400">₫</span>
                          <button
                            onClick={() => handleSaveInlineReward('ad', ad.id, ad.reward)}
                            title="Lưu số tiền thưởng mới"
                            className={`p-1.5 rounded transition-colors ${
                              isSaved ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300'
                            }`}
                          >
                            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Status Toggle */}
                        <button
                          onClick={() => onToggleAd(ad.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isActive
                              ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-300'
                              : 'bg-slate-900 border border-slate-800 text-slate-500'
                          }`}
                        >
                          {isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                          <span>{isActive ? 'BẬT' : 'TẮT'}</span>
                        </button>

                        {/* Delete button */}
                        <button onClick={() => onDeleteAd(ad.id)} title="Xóa nhiệm vụ" className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. SURVEYS LIST */}
          {manageCategory === 'surveys' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-400" />
                    Quản Lý Khảo Sát Thị Trường ({surveys.length} đề tài)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Sửa số tiền thưởng thành công của khảo sát, bật/tắt hoặc xóa đề tài.</p>
                </div>
                <button
                  onClick={() => { setAdminTab('add_task'); setTaskTypeToAdd('survey'); sound.playTick(); }}
                  className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Thêm Khảo Sát
                </button>
              </div>

              <div className="space-y-3">
                {surveys.map((survey) => {
                  const isActive = survey.isActive !== false;
                  const currentRewardVal = editingRewards[survey.id] !== undefined ? editingRewards[survey.id] : survey.reward;
                  const isSaved = savedRewardId === survey.id;

                  return (
                    <div
                      key={survey.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isActive ? 'bg-slate-950 border-slate-800' : 'bg-slate-950/40 border-slate-900 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{survey.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5 font-mono">
                          {survey.institution} · {survey.questions.length} câu hỏi · {survey.estimatedMinutes} phút
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
                          <span className="text-[10px] text-slate-400">Thù lao:</span>
                          <input
                            type="number"
                            step={1000}
                            min={1000}
                            value={currentRewardVal}
                            onChange={(e) => setEditingRewards({ ...editingRewards, [survey.id]: parseInt(e.target.value, 10) || 0 })}
                            className="w-24 px-1.5 py-0.5 text-xs bg-slate-950 border border-slate-700 rounded text-teal-300 font-mono text-right font-bold focus:outline-none focus:border-teal-500"
                          />
                          <span className="text-xs text-slate-400">₫</span>
                          <button
                            onClick={() => handleSaveInlineReward('survey', survey.id, survey.reward)}
                            title="Lưu số tiền thưởng mới"
                            className={`p-1.5 rounded transition-colors ${
                              isSaved ? 'bg-teal-500 text-slate-950' : 'bg-teal-950/60 hover:bg-teal-900 text-teal-300'
                            }`}
                          >
                            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <button
                          onClick={() => onToggleSurvey(survey.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isActive
                              ? 'bg-teal-950/60 border border-teal-800/80 text-teal-300'
                              : 'bg-slate-900 border border-slate-800 text-slate-500'
                          }`}
                        >
                          {isActive ? <ToggleRight className="w-4 h-4 text-teal-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                          <span>{isActive ? 'BẬT' : 'TẮT'}</span>
                        </button>

                        <button onClick={() => onDeleteSurvey(survey.id)} title="Xóa khảo sát" className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. SHORTLINKS LIST */}
          {manageCategory === 'shortlink' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-amber-400" />
                    Quản Lý Vượt Link Rút Gọn ({shortlinks.length} liên kết)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Sửa thù lao khi nhập đúng mã 6 số, đổi trạng thái hoặc xóa link.</p>
                </div>
                <button
                  onClick={() => { setAdminTab('add_task'); setTaskTypeToAdd('shortlink'); sound.playTick(); }}
                  className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Thêm Vượt Link
                </button>
              </div>

              <div className="space-y-3">
                {shortlinks.map((sl) => {
                  const isActive = sl.isActive !== false;
                  const currentRewardVal = editingRewards[sl.id] !== undefined ? editingRewards[sl.id] : sl.reward;
                  const isSaved = savedRewardId === sl.id;

                  return (
                    <div
                      key={sl.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isActive ? 'bg-slate-950 border-slate-800' : 'bg-slate-950/40 border-slate-900 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{sl.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5 font-mono">
                          Mã đúng: <strong className="text-amber-400">{sl.correctCode}</strong> · Domain: <span className="text-slate-300">{sl.targetDomain}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
                          <span className="text-[10px] text-slate-400">Thù lao:</span>
                          <input
                            type="number"
                            step={500}
                            min={500}
                            value={currentRewardVal}
                            onChange={(e) => setEditingRewards({ ...editingRewards, [sl.id]: parseInt(e.target.value, 10) || 0 })}
                            className="w-24 px-1.5 py-0.5 text-xs bg-slate-950 border border-slate-700 rounded text-amber-400 font-mono text-right font-bold focus:outline-none focus:border-amber-500"
                          />
                          <span className="text-xs text-slate-400">₫</span>
                          <button
                            onClick={() => handleSaveInlineReward('shortlink', sl.id, sl.reward)}
                            title="Lưu số tiền thưởng mới"
                            className={`p-1.5 rounded transition-colors ${
                              isSaved ? 'bg-amber-400 text-slate-950' : 'bg-amber-950/60 hover:bg-amber-900 text-amber-300'
                            }`}
                          >
                            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <button
                          onClick={() => onToggleShortlink(sl.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isActive
                              ? 'bg-amber-950/60 border border-amber-800/80 text-amber-300'
                              : 'bg-slate-900 border border-slate-800 text-slate-500'
                          }`}
                        >
                          {isActive ? <ToggleRight className="w-4 h-4 text-amber-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                          <span>{isActive ? 'BẬT' : 'TẮT'}</span>
                        </button>

                        <button onClick={() => onDeleteShortlink(sl.id)} title="Xóa vượt link" className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. MAP REVIEWS LIST */}
          {manageCategory === 'map_review' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    Quản Lý Review Google Maps 5 Sao ({mapReviews.length} địa điểm)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Sửa số tiền thưởng khi thành viên review địa điểm thành công.</p>
                </div>
                <button
                  onClick={() => { setAdminTab('add_task'); setTaskTypeToAdd('map_review'); sound.playTick(); }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Thêm Review Map
                </button>
              </div>

              <div className="space-y-3">
                {mapReviews.map((m) => {
                  const isActive = m.isActive !== false;
                  const currentRewardVal = editingRewards[m.id] !== undefined ? editingRewards[m.id] : m.reward;
                  const isSaved = savedRewardId === m.id;

                  return (
                    <div
                      key={m.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isActive ? 'bg-slate-950 border-slate-800' : 'bg-slate-950/40 border-slate-900 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{m.placeName}</div>
                        <div className="text-xs text-slate-400 mt-0.5 font-mono">
                          {m.category} · {m.address}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
                          <span className="text-[10px] text-slate-400">Thù lao:</span>
                          <input
                            type="number"
                            step={1000}
                            min={1000}
                            value={currentRewardVal}
                            onChange={(e) => setEditingRewards({ ...editingRewards, [m.id]: parseInt(e.target.value, 10) || 0 })}
                            className="w-24 px-1.5 py-0.5 text-xs bg-slate-950 border border-slate-700 rounded text-rose-300 font-mono text-right font-bold focus:outline-none focus:border-rose-500"
                          />
                          <span className="text-xs text-slate-400">₫</span>
                          <button
                            onClick={() => handleSaveInlineReward('map_review', m.id, m.reward)}
                            title="Lưu số tiền thưởng mới"
                            className={`p-1.5 rounded transition-colors ${
                              isSaved ? 'bg-rose-500 text-white' : 'bg-rose-950/60 hover:bg-rose-900 text-rose-300'
                            }`}
                          >
                            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <button
                          onClick={() => onToggleMapReview(m.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isActive
                              ? 'bg-rose-950/60 border border-rose-800/80 text-rose-300'
                              : 'bg-slate-900 border border-slate-800 text-slate-500'
                          }`}
                        >
                          {isActive ? <ToggleRight className="w-4 h-4 text-rose-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                          <span>{isActive ? 'BẬT' : 'TẮT'}</span>
                        </button>

                        <button onClick={() => onDeleteMapReview(m.id)} title="Xóa review map" className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. SOCIAL TASKS LIST */}
          {manageCategory === 'social' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-indigo-400" />
                    Quản Lý Nhiệm Vụ Mạng Xã Hội ({socialTasks.length} nhiệm vụ)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Sửa thù lao khi like bài viết, follow trang trên TikTok, Facebook, YouTube.</p>
                </div>
                <button
                  onClick={() => { setAdminTab('add_task'); setTaskTypeToAdd('social'); sound.playTick(); }}
                  className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-indigo-400 hover:bg-indigo-300 rounded-lg flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Thêm Nhiệm Vụ MXH
                </button>
              </div>

              <div className="space-y-3">
                {socialTasks.map((soc) => {
                  const isActive = soc.isActive !== false;
                  const currentRewardVal = editingRewards[soc.id] !== undefined ? editingRewards[soc.id] : soc.reward;
                  const isSaved = savedRewardId === soc.id;

                  return (
                    <div
                      key={soc.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isActive ? 'bg-slate-950 border-slate-800' : 'bg-slate-950/40 border-slate-900 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{soc.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5 font-mono">
                          {soc.platform.toUpperCase()} · {soc.actionType.toUpperCase()} · {soc.targetName}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
                          <span className="text-[10px] text-slate-400">Thù lao:</span>
                          <input
                            type="number"
                            step={500}
                            min={500}
                            value={currentRewardVal}
                            onChange={(e) => setEditingRewards({ ...editingRewards, [soc.id]: parseInt(e.target.value, 10) || 0 })}
                            className="w-24 px-1.5 py-0.5 text-xs bg-slate-950 border border-slate-700 rounded text-indigo-300 font-mono text-right font-bold focus:outline-none focus:border-indigo-500"
                          />
                          <span className="text-xs text-slate-400">₫</span>
                          <button
                            onClick={() => handleSaveInlineReward('social', soc.id, soc.reward)}
                            title="Lưu số tiền thưởng mới"
                            className={`p-1.5 rounded transition-colors ${
                              isSaved ? 'bg-indigo-500 text-white' : 'bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300'
                            }`}
                          >
                            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <button
                          onClick={() => onToggleSocialTask(soc.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isActive
                              ? 'bg-indigo-950/60 border border-indigo-800/80 text-indigo-300'
                              : 'bg-slate-900 border border-slate-800 text-slate-500'
                          }`}
                        >
                          {isActive ? <ToggleRight className="w-4 h-4 text-indigo-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                          <span>{isActive ? 'BẬT' : 'TẮT'}</span>
                        </button>

                        <button onClick={() => onDeleteSocialTask(soc.id)} title="Xóa nhiệm vụ" className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: THÊM NHIỆM VỤ MỚI */}
      {adminTab === 'add_task' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-teal-400" />
              Tạo và Thêm Nhiệm Vụ Kiếm Tiền Mới
            </h3>

            {/* Task Type Switch */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto no-scrollbar">
              {[
                { id: 'ad', label: 'Quảng Cáo PTC' },
                { id: 'survey', label: 'Khảo Sát' },
                { id: 'shortlink', label: 'Vượt Link' },
                { id: 'map_review', label: 'Review Map' },
                { id: 'social', label: 'Mạng Xã Hội' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setTaskTypeToAdd(t.id as typeof taskTypeToAdd); setFormAlert(null); sound.playTick(); }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    taskTypeToAdd === t.id
                      ? 'bg-teal-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {formAlert && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              formAlert.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                : 'bg-rose-950/60 border border-rose-800 text-rose-300'
            }`}>
              {formAlert.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{formAlert.msg}</span>
            </div>
          )}

          {/* Form 1: Add Ad */}
          {taskTypeToAdd === 'ad' && (
            <form onSubmit={handleCreateAd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Nhà tài trợ / Thương hiệu</label>
                  <input
                    type="text"
                    value={newAdAdvertiser}
                    onChange={(e) => setNewAdAdvertiser(e.target.value)}
                    placeholder="Ví dụ: Shopee Mall, VPBank..."
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Thù lao mỗi lượt xem (VNĐ)</label>
                  <input
                    type="number"
                    value={newAdReward}
                    onChange={(e) => setNewAdReward(e.target.value)}
                    min={500}
                    step={500}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Thời gian xem bắt buộc (giây)</label>
                  <input
                    type="number"
                    value={newAdDuration}
                    onChange={(e) => setNewAdDuration(e.target.value)}
                    min={5}
                    max={120}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tiêu đề quảng cáo</label>
                  <input
                    type="text"
                    value={newAdTitle}
                    onChange={(e) => setNewAdTitle(e.target.value)}
                    placeholder="Ví dụ: Trải nghiệm công nghệ tai nghe chống ồn mới"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Danh mục quảng cáo</label>
                  <select
                    value={newAdCategory}
                    onChange={(e) => setNewAdCategory(e.target.value as AdTask['category'])}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="Công nghệ">Công nghệ</option>
                    <option value="Thương mại điện tử">Thương mại điện tử</option>
                    <option value="Tài chính">Tài chính</option>
                    <option value="Trò chơi">Trò chơi</option>
                    <option value="Ẩm thực">Ẩm thực</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-amber-400">Câu hỏi chống gian lận (Anti-bot):</div>
                <input
                  type="text"
                  value={newAdQuestion}
                  onChange={(e) => setNewAdQuestion(e.target.value)}
                  placeholder="Ví dụ: Màu sắc chủ đạo của sản phẩm là gì?"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={newAdOpt0}
                    onChange={(e) => setNewAdOpt0(e.target.value)}
                    placeholder="Đáp án A (Đúng)"
                    required
                    className="px-2.5 py-1.5 text-xs bg-slate-900 border border-emerald-800/80 rounded text-emerald-300"
                  />
                  <input
                    type="text"
                    value={newAdOpt1}
                    onChange={(e) => setNewAdOpt1(e.target.value)}
                    placeholder="Đáp án B"
                    required
                    className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-white"
                  />
                  <input
                    type="text"
                    value={newAdOpt2}
                    onChange={(e) => setNewAdOpt2(e.target.value)}
                    placeholder="Đáp án C"
                    className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-white"
                  />
                  <input
                    type="text"
                    value={newAdOpt3}
                    onChange={(e) => setNewAdOpt3(e.target.value)}
                    placeholder="Đáp án D"
                    className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>

              <button type="submit" className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl">
                Lưu & Kích Hoạt Chiến Dịch Quảng Cáo
              </button>
            </form>
          )}

          {/* Form 2: Add Survey */}
          {taskTypeToAdd === 'survey' && (
            <form onSubmit={handleCreateSurvey} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Cơ quan / Tổ chức khảo sát</label>
                  <input
                    type="text"
                    value={newSurvInst}
                    onChange={(e) => setNewSurvInst(e.target.value)}
                    placeholder="Ví dụ: Viện Nghiên Cứu Tiêu Dùng VN"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Thù lao mỗi phiếu (VNĐ)</label>
                  <input
                    type="number"
                    value={newSurvReward}
                    onChange={(e) => setNewSurvReward(e.target.value)}
                    min={5000}
                    step={1000}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Thời gian ước tính (phút)</label>
                  <input
                    type="number"
                    value={newSurvDuration}
                    onChange={(e) => setNewSurvDuration(e.target.value)}
                    min={1}
                    max={30}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Tiêu đề khảo sát</label>
                <input
                  type="text"
                  value={newSurvTitle}
                  onChange={(e) => setNewSurvTitle(e.target.value)}
                  placeholder="Ví dụ: Khảo sát thói quen mua sắm trực tuyến 2026"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Câu hỏi khảo sát chính 1</label>
                <input
                  type="text"
                  value={newSurvQ1}
                  onChange={(e) => setNewSurvQ1(e.target.value)}
                  placeholder="Nhập câu hỏi 1..."
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <button type="submit" className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl">
                Lưu & Kích Hoạt Khảo Sát Mới
              </button>
            </form>
          )}

          {/* Form 3: Add Shortlink */}
          {taskTypeToAdd === 'shortlink' && (
            <form onSubmit={handleCreateShortlink} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Mạng rút gọn (Provider)</label>
                  <input
                    type="text"
                    value={newSlProvider}
                    onChange={(e) => setNewSlProvider(e.target.value)}
                    placeholder="Link1s Pro, Traffic120..."
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Thù lao mỗi lượt vượt (VNĐ)</label>
                  <input
                    type="number"
                    value={newSlReward}
                    onChange={(e) => setNewSlReward(e.target.value)}
                    min={1000}
                    step={500}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Mã xác minh 6 số (Secret Code)</label>
                  <input
                    type="text"
                    value={newSlCode}
                    onChange={(e) => setNewSlCode(e.target.value)}
                    placeholder="Ví dụ: 892341"
                    required
                    maxLength={8}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Từ khóa tìm kiếm trên Google</label>
                  <input
                    type="text"
                    value={newSlKeyword}
                    onChange={(e) => setNewSlKeyword(e.target.value)}
                    placeholder="Ví dụ: tải game bài đổi thưởng uy tín"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tên miền trang đích cần tìm</label>
                  <input
                    type="text"
                    value={newSlDomain}
                    onChange={(e) => setNewSlDomain(e.target.value)}
                    placeholder="Ví dụ: gamebai88.vn"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Tiêu đề nhiệm vụ</label>
                <input
                  type="text"
                  value={newSlTitle}
                  onChange={(e) => setNewSlTitle(e.target.value)}
                  placeholder="Ví dụ: Vượt link tìm kiếm mã website Game bài 88"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <button type="submit" className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl">
                Lưu & Kích Hoạt Nhiệm Vụ Vượt Link
              </button>
            </form>
          )}

          {/* Form 4: Add Map Review */}
          {taskTypeToAdd === 'map_review' && (
            <form onSubmit={handleCreateMapReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tên địa điểm Google Maps</label>
                  <input
                    type="text"
                    value={newMapPlace}
                    onChange={(e) => setNewMapPlace(e.target.value)}
                    placeholder="Ví dụ: Nha Khoa Thẩm Mỹ Quốc Tế Sài Gòn"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Danh mục địa điểm</label>
                  <select
                    value={newMapCategory}
                    onChange={(e) => setNewMapCategory(e.target.value as MapReviewTask['category'])}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="Nhà hàng & Ẩm thực">Nhà hàng & Ẩm thực</option>
                    <option value="Dịch vụ & Spa">Dịch vụ & Spa</option>
                    <option value="Nha khoa & Y tế">Nha khoa & Y tế</option>
                    <option value="Khách sạn">Khách sạn</option>
                    <option value="Công ty & Dịch vụ">Công ty & Dịch vụ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Thù lao mỗi đánh giá 5 sao (VNĐ)</label>
                  <input
                    type="number"
                    value={newMapReward}
                    onChange={(e) => setNewMapReward(e.target.value)}
                    min={5000}
                    step={1000}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Địa chỉ chính xác</label>
                <input
                  type="text"
                  value={newMapAddress}
                  onChange={(e) => setNewMapAddress(e.target.value)}
                  placeholder="Ví dụ: 120 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Nội dung đánh giá mẫu (Chuẩn 5 sao tự nhiên)</label>
                <textarea
                  rows={3}
                  value={newMapContent}
                  onChange={(e) => setNewMapContent(e.target.value)}
                  placeholder="Dịch vụ ở đây rất chuyên nghiệp, bác sĩ tư vấn tận tình, cơ sở sạch sẽ hiện đại. Rất hài lòng và sẽ quay lại!"
                  required
                  className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <button type="submit" className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl">
                Lưu & Kích Hoạt Chiến Dịch Review Map
              </button>
            </form>
          )}

          {/* Form 5: Add Social */}
          {taskTypeToAdd === 'social' && (
            <form onSubmit={handleCreateSocialTask} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Nền tảng mạng xã hội</label>
                  <select
                    value={newSocPlatform}
                    onChange={(e) => setNewSocPlatform(e.target.value as SocialTask['platform'])}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold"
                  >
                    <option value="tiktok">TikTok Video/Kênh</option>
                    <option value="facebook">Facebook Post/Page</option>
                    <option value="youtube">YouTube Video/Kênh</option>
                    <option value="instagram">Instagram Reel/Profile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Hành động tương tác</label>
                  <select
                    value={newSocAction}
                    onChange={(e) => setNewSocAction(e.target.value as SocialTask['actionType'])}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="like">Like / Thả tim</option>
                    <option value="follow">Follow trang / kênh</option>
                    <option value="subscribe">Đăng ký kênh (Subscribe)</option>
                    <option value="share">Chia sẻ bài viết</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Thù lao mỗi tương tác (VNĐ)</label>
                  <input
                    type="number"
                    value={newSocReward}
                    onChange={(e) => setNewSocReward(e.target.value)}
                    min={1000}
                    step={500}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Tiêu đề nhiệm vụ hiển thị</label>
                <input
                  type="text"
                  value={newSocTitle}
                  onChange={(e) => setNewSocTitle(e.target.value)}
                  placeholder="Ví dụ: Follow kênh TikTok Chia Sẻ Kinh Nghiệm MMO"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tên tài khoản / Kênh mục tiêu</label>
                  <input
                    type="text"
                    value={newSocTarget}
                    onChange={(e) => setNewSocTarget(e.target.value)}
                    placeholder="Ví dụ: @mmovietnamofficial"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Đường dẫn đích (URL)</label>
                  <input
                    type="text"
                    value={newSocUrl}
                    onChange={(e) => setNewSocUrl(e.target.value)}
                    placeholder="https://tiktok.com/@..."
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <button type="submit" className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-indigo-400 hover:bg-indigo-300 rounded-xl">
                Lưu & Kích Hoạt Nhiệm Vụ Mạng Xã Hội
              </button>
            </form>
          )}

        </div>
      )}

      {/* TAB 4: QUẢN LÝ THÀNH VIÊN (SỬA VAI TRÒ, BAN, XÓA VĨNH VIỄN) */}
      {adminTab === 'members' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Quản Lý Tài Khoản Thành Viên ({usersList.length} người dùng)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Sửa vai trò (Thành viên/Kiểm duyệt/Admin), khóa tài khoản (Ban), xóa vĩnh viễn hoặc tặng thưởng nóng.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Tìm theo tên hoặc email..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-medium">Thành viên</th>
                  <th className="px-5 py-3 font-medium">Trạng thái</th>
                  <th className="px-5 py-3 font-medium">Sửa Vai trò</th>
                  <th className="px-5 py-3 font-medium text-right">Số dư ví</th>
                  <th className="px-5 py-3 font-medium text-right">Thao tác Quản trị</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {usersList
                  .filter((u) => {
                    if (!userSearch.trim()) return true;
                    const q = userSearch.toLowerCase();
                    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                  })
                  .map((usr) => {
                    const isBanned = usr.status === 'banned';
                    const isRootAdmin = usr.id === 'user-admin';

                    return (
                      <tr key={usr.id} className={`hover:bg-slate-800/30 transition-colors ${isBanned ? 'bg-rose-950/20' : ''}`}>
                        <td className="px-5 py-3.5 flex items-center gap-2.5">
                          <img src={usr.avatar} alt={usr.name} className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{usr.name}</span>
                              {isRootAdmin && (
                                <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800 px-1 py-0.2 rounded font-mono">
                                  GỐC
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">{usr.email}</div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          {isBanned ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/70 border border-rose-800 px-2 py-0.5 rounded uppercase">
                              <Ban className="w-3 h-3" />
                              Đã khóa
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded uppercase">
                              <UserCheck className="w-3 h-3" />
                              Hoạt động
                            </span>
                          )}
                          {isBanned && usr.bannedReason && (
                            <div className="text-[10px] text-slate-400 line-clamp-1 max-w-[140px] mt-0.5">
                              {usr.bannedReason}
                            </div>
                          )}
                        </td>

                        {/* Sửa Vai trò */}
                        <td className="px-5 py-3.5">
                          {isRootAdmin ? (
                            <span className="text-purple-300 font-mono text-[11px] font-bold">Admin Tối Cao</span>
                          ) : (
                            <select
                              value={usr.role}
                              onChange={(e) => {
                                const newRole = e.target.value as 'user' | 'moderator' | 'admin';
                                onUpdateUserRole(usr.id, newRole);
                                sound.playTick();
                              }}
                              className={`px-2 py-1 text-xs rounded border bg-slate-950 font-semibold focus:outline-none ${
                                usr.role === 'admin'
                                  ? 'text-purple-300 border-purple-800'
                                  : usr.role === 'moderator'
                                  ? 'text-amber-300 border-amber-800'
                                  : 'text-slate-300 border-slate-800'
                              }`}
                            >
                              <option value="user">Thành viên thường</option>
                              <option value="moderator">Kiểm duyệt viên</option>
                              <option value="admin">Quản trị viên (Admin)</option>
                            </select>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                          {formatVND(usr.balance)}
                        </td>

                        {/* Thao tác: Ban, Xóa vĩnh viễn, Thưởng nóng */}
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Ban / Unban button */}
                            {!isRootAdmin && (
                              <button
                                onClick={() => {
                                  if (isBanned) {
                                    onToggleBanUser(usr.id);
                                    sound.playTick();
                                  } else {
                                    setBanModalUser(usr);
                                  }
                                }}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded border transition-colors flex items-center gap-1 ${
                                  isBanned
                                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                                    : 'bg-amber-950/40 border-amber-800/80 text-amber-300 hover:bg-amber-900/60'
                                }`}
                              >
                                <Ban className="w-3 h-3" />
                                <span>{isBanned ? 'Mở khóa' : 'Khóa TK'}</span>
                              </button>
                            )}

                            {/* Xóa vĩnh viễn */}
                            {!isRootAdmin && (
                              <button
                                onClick={() => setDeleteModalUser(usr)}
                                title="Xóa vĩnh viễn thành viên"
                                className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/80 text-rose-300 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Thưởng nhanh */}
                            <button
                              onClick={() => {
                                onAdjustUserBalance(usr.id, 20000);
                                sound.playCoin();
                              }}
                              className="px-2 py-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-800/60 rounded transition-colors"
                            >
                              +20k
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: KHÓA TÀI KHOẢN (BAN MEMBER) */}
      {banModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-rose-900/80 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>Khóa tài khoản: {banModalUser.name}</span>
            </div>

            <p className="text-xs text-slate-300">
              Khi bị khóa, người dùng này sẽ không thể đăng nhập, không thể làm bất kỳ nhiệm vụ nào và không thể rút tiền từ hệ thống.
            </p>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Lý do khóa tài khoản:</label>
              <textarea
                rows={3}
                value={banReasonInput}
                onChange={(e) => setBanReasonInput(e.target.value)}
                placeholder="Nhập lý do xử phạt vi phạm..."
                className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setBanModalUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmBan}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md transition-colors flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Xác nhận Khóa Tài Khoản</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: XÓA VĨNH VIỄN THÀNH VIÊN */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-rose-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <Trash2 className="w-5 h-5" />
              <span>Xóa vĩnh viễn người dùng</span>
            </div>

            <div className="p-3 bg-rose-950/40 border border-rose-900 rounded-xl text-xs text-rose-200">
              <strong>CẢNH BÁO BẢO MẬT:</strong> Bạn đang chuẩn bị xóa vĩnh viễn tài khoản của <strong>{deleteModalUser.name}</strong> ({deleteModalUser.email}).
              <br />
              Thao tác này sẽ xóa toàn bộ số dư <strong>{formatVND(deleteModalUser.balance)}</strong> và lịch sử liên quan khỏi hệ thống và <strong>KHÔNG THỂ KHÔI PHỤC</strong>.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModalUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xác nhận Xóa Vĩnh Viễn</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <XCircle className="w-5 h-5" />
              <span>Từ chối lệnh rút tiền #{rejectModalTx.id}</span>
            </div>

            <p className="text-xs text-slate-300">
              Số tiền <strong className="text-amber-400 font-mono">{formatVND(Math.abs(rejectModalTx.amount))}</strong> sẽ được tự động hoàn trả lại số dư ví của thành viên <strong>{rejectModalTx.userName || 'người dùng'}</strong>.
            </p>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Lý do từ chối gửi cho thành viên:</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalTx(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-md"
              >
                Xác nhận từ chối & Hoàn tiền
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
