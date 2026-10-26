import React, { useState } from 'react';
import { AppRegisterTask } from '../types/mmo';
import { formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import {
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  X,
  Send,
  Building2,
  Wallet,
  Coins,
  ShoppingBag,
  RotateCcw,
} from 'lucide-react';

interface AppRegisterViewProps {
  tasks: AppRegisterTask[];
  onSubmitProof: (taskId: string, proof: string) => void;
}

export const AppRegisterView: React.FC<AppRegisterViewProps> = ({ tasks, onSubmitProof }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTask, setActiveTask] = useState<AppRegisterTask | null>(null);
  const [proofInput, setProofInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Tất cả nhiệm vụ', icon: Sparkles },
    { id: 'Ngân hàng số', label: 'Ngân hàng số', icon: Building2 },
    { id: 'Ví điện tử', label: 'Ví điện tử', icon: Wallet },
    { id: 'Sàn tiền số / Crypto', label: 'Sàn Crypto', icon: Coins },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (t.isActive === false) return false;
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const totalPotential = tasks.reduce((sum, t) => sum + t.reward, 0);
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const approvedCount = tasks.filter((t) => t.status === 'approved').length;

  const handleOpenModal = (task: AppRegisterTask) => {
    setActiveTask(task);
    setProofInput(task.submittedProof || '');
    setErrorMsg('');
    sound.playTick();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofInput.trim()) {
      setErrorMsg('Vui lòng nhập số điện thoại hoặc mã tài khoản bạn đã dùng đăng ký.');
      sound.playError();
      return;
    }

    if (activeTask) {
      onSubmitProof(activeTask.id, proofInput.trim());
      sound.playSuccess();
      setActiveTask(null);
      setProofInput('');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Nhiệm Vụ Thù Lao Cao Nhất MMO</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Đăng Ký Tài Khoản Web & Tải App Nhận Tiền
          </h2>

          <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
            Kiếm từ <strong>25.000₫ đến 80.000₫</strong> cho mỗi lần mở tài khoản ngân hàng số, ví điện tử
            hoặc sàn giao dịch uy tín đối tác. Duyệt thù lao nhanh chóng và cộng trực tiếp vào số dư ví của bạn!
          </p>

          {/* Quick stats strip */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium">
            <div className="bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl flex items-center gap-2">
              <span className="text-emerald-300 font-bold">{tasks.length}</span>
              <span className="text-blue-100">Dịch vụ đối tác</span>
            </div>
            <div className="bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl flex items-center gap-2">
              <span className="text-amber-300 font-bold">~{formatVND(totalPotential)}</span>
              <span className="text-blue-100">Tổng thu nhập chờ đón</span>
            </div>
            {pendingCount > 0 && (
              <div className="bg-amber-500/30 border border-amber-300/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span className="text-amber-200 font-bold">{pendingCount} yêu cầu đang chờ duyệt</span>
              </div>
            )}
            {approvedCount > 0 && (
              <div className="bg-emerald-500/30 border border-emerald-300/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-emerald-200 font-bold">{approvedCount} đã duyệt thành công</span>
              </div>
            )}
          </div>
        </div>

        {/* Ambient decorative elements */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                sound.playTick();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              {cat.id === 'all' && (
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tasks.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTasks.map((task) => {
          const isPending = task.status === 'pending';
          const isApproved = task.status === 'approved';
          const isRejected = task.status === 'rejected';

          return (
            <div
              key={task.id}
              className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-lg transition-all duration-200"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={task.imageUrl}
                      alt={task.partnerName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900/50">
                        {task.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {task.partnerName}
                      </h4>
                    </div>
                  </div>

                  {/* Reward pill */}
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      +{formatVND(task.reward)}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Thù lao</span>
                  </div>
                </div>

                {/* Title & requirement */}
                <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed mb-2">
                  {task.title}
                </h5>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-normal mb-4 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80">
                  <strong className="text-slate-700 dark:text-slate-300">Yêu cầu:</strong> {task.requirement}
                </p>
              </div>

              {/* Status / Action Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                {isApproved ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Đã duyệt thành công</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      +{formatVND(task.reward)}
                    </span>
                  </div>
                ) : isPending ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
                      <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold">
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-spin" />
                        <span>Đang chờ Admin duyệt</span>
                      </div>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">5-15 phút</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate px-1">
                      Bằng chứng: {task.submittedProof}
                    </p>
                  </div>
                ) : isRejected ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs">
                      <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-medium">
                        <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span className="truncate">{task.rejectedReason || 'Thông tin chưa trùng khớp'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenModal(task)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Gửi lại bằng chứng</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenModal(task)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Làm nhiệm vụ (+{formatVND(task.reward)})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail & Proof Submission Modal */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <img
                  src={activeTask.imageUrl}
                  alt={activeTask.partnerName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeTask.partnerName} — Nhận {formatVND(activeTask.reward)}
                  </h3>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                    {activeTask.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveTask(null)}
                className="w-8 h-8 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {/* External Partner Link CTA */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    Bước 1: Mở liên kết tải ứng dụng hoặc đăng ký
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Liên kết an toàn tới hệ thống chính thức của đối tác
                  </div>
                </div>

                <a
                  href={activeTask.downloadOrRegisterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
                >
                  <span>Mở Trang Đối Tác</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Step by step guide */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Quy trình các bước thực hiện:</span>
                </h4>
                <div className="space-y-2">
                  {activeTask.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proof Submission Form */}
              <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <label className="block">
                  <span className="font-bold text-slate-900 dark:text-white mb-1 block">
                    Bước 2: Nhập thông tin bằng chứng hoàn thành
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-2">
                    {activeTask.proofPlaceholder}
                  </span>
                  <input
                    type="text"
                    value={proofInput}
                    onChange={(e) => setProofInput(e.target.value)}
                    placeholder={activeTask.proofPlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  />
                </label>

                {errorMsg && (
                  <p className="text-[11px] text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errorMsg}</span>
                  </p>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTask(null)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Bằng Chứng Duyệt Thưởng</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
