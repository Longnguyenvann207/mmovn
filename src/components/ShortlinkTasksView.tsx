import React, { useState } from 'react';
import { ShortlinkTask } from '../types/mmo';
import { formatNumber, formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Link2, Search, Copy, Check, CheckCircle2, AlertCircle, ArrowRight, X, ExternalLink, KeyRound } from 'lucide-react';

interface ShortlinkTasksViewProps {
  shortlinks: ShortlinkTask[];
  onCompleteTask: (taskId: string, reward: number) => void;
}

export const ShortlinkTasksView: React.FC<ShortlinkTasksViewProps> = ({
  shortlinks,
  onCompleteTask,
}) => {
  const [activeTask, setActiveTask] = useState<ShortlinkTask | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKw, setCopiedKw] = useState(false);
  const [simulatingCode, setSimulatingCode] = useState(false);
  const [simulatedCountdown, setSimulatedCountdown] = useState(0);

  const visibleTasks = shortlinks.filter((t) => t.isActive !== false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKw(true);
    sound.playTick();
    setTimeout(() => setCopiedKw(false), 2000);
  };

  const handleStartSimulateTimer = (correctCode: string) => {
    setSimulatingCode(true);
    setSimulatedCountdown(5); // 5s fast preview simulation
    sound.playTick();

    const interval = setInterval(() => {
      setSimulatedCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSimulatingCode(false);
          setCodeInput(correctCode);
          sound.playCoin();
          return 0;
        }
        sound.playTick();
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyCode = () => {
    if (!activeTask) return;
    setErrorMessage(null);

    const cleanInput = codeInput.trim();
    if (cleanInput === activeTask.correctCode) {
      sound.playSuccess();
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 },
      });
      onCompleteTask(activeTask.id, activeTask.reward);
      setActiveTask(null);
      setCodeInput('');
    } else {
      setErrorMessage(`Mã xác thực chưa chính xác. Gợi ý mã của nhiệm vụ này là: ${activeTask.correctCode}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <Link2 className="w-4 h-4" />
            <span>Nhiệm vụ Vượt Link Rút Gọn (Shortlink Traffic)</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Vượt link tìm mã 6 số nhận tiền ngay
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Tìm kiếm từ khóa chỉ định trên Google, vào trang đích cuộn xuống chân trang lấy mã xác thực 6 số để nhận tiền mặt từ 3.000₫ – 4.000₫ / lượt.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-3.5 shrink-0 flex items-center gap-4">
          <div>
            <div className="text-[11px] text-slate-400">Nhiệm vụ khả dụng</div>
            <div className="text-xl font-bold text-amber-400 font-mono tabular-nums">
              {visibleTasks.filter((t) => !t.isCompleted).length} / {visibleTasks.length} link
            </div>
          </div>
        </div>
      </div>

      {/* Shortlink Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleTasks.map((task) => {
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
                  <span className="font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/60">
                    {task.provider}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {formatNumber(task.completionsCount)} lượt xong
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                  {task.title}
                </h3>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Từ khóa Google:</span>
                    <strong className="text-emerald-400 font-mono">{task.searchKeyword}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Tên miền đích:</span>
                    <strong className="text-slate-300 font-mono">{task.targetDomain}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Thù lao nhận</div>
                  <div className="text-base font-extrabold text-amber-400 font-mono tabular-nums">
                    +{formatVND(task.reward)}
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
                      setActiveTask(task);
                      setCodeInput('');
                      setErrorMessage(null);
                      sound.playTick();
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all active:scale-95 shadow-md flex items-center gap-1.5"
                  >
                    <span>Làm nhiệm vụ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Execution Modal */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Vượt link nhận {formatVND(activeTask.reward)}</h3>
              </div>
              <button onClick={() => setActiveTask(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps Guide */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-300">Các bước thực hiện:</div>
              <div className="space-y-2 text-xs">
                
                {/* Step 1 */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-slate-400">Bước 1: Tìm kiếm trên Google:</div>
                    <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                      {activeTask.searchKeyword}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(activeTask.searchKeyword)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-xs flex items-center gap-1"
                  >
                    {copiedKw ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKw ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                </div>

                {/* Step 2 */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Bước 2: Tìm và bấm vào website:</div>
                  <div className="font-mono font-semibold text-amber-300 mt-0.5 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{activeTask.targetDomain}</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Bước 3: Lấy mã xác thực 6 số</div>
                  <div className="text-slate-300 mt-0.5 leading-relaxed">
                    Kéo xuống cuối chân trang web, tìm nút <strong>"Lấy Mã / Get Code"</strong> và chờ đếm ngược để lấy mã 6 chữ số.
                  </div>
                </div>

              </div>
            </div>

            {/* Fast simulation helper button for test demo */}
            <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl flex items-center justify-between text-xs">
              <span className="text-amber-300">Chế độ test nhanh (Mô phỏng đếm ngược lấy mã):</span>
              <button
                onClick={() => handleStartSimulateTimer(activeTask.correctCode)}
                disabled={simulatingCode}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors"
              >
                {simulatingCode ? `Đang chờ ${simulatedCountdown}s...` : 'Lấy mã tự động'}
              </button>
            </div>

            {/* Input code verification */}
            <div className="space-y-2">
              <label className="block text-xs text-slate-300 font-medium">
                Nhập mã 6 số bạn tìm được vào đây:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Ví dụ: 749201"
                    maxLength={10}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white font-mono tracking-widest focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  onClick={handleVerifyCode}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  Xác nhận & Nhận tiền
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
