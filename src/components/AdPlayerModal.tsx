import React, { useState, useEffect, useRef } from 'react';
import { AdTask } from '../types/mmo';
import { formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Clock, ShieldCheck, CheckCircle2, AlertCircle, X, ExternalLink, Sparkles } from 'lucide-react';

interface AdPlayerModalProps {
  ad: AdTask;
  onClose: () => void;
  onReward: (adId: string, amount: number) => void;
}

export const AdPlayerModal: React.FC<AdPlayerModalProps> = ({ ad, onClose, onReward }) => {
  const [timeLeft, setTimeLeft] = useState(ad.durationSec);
  const [isCounting, setIsCounting] = useState(true);
  const [hasCompletedTimer, setHasCompletedTimer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer logic
  useEffect(() => {
    if (isCounting && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
        sound.playTick();
      }, 1000);
    } else if (timeLeft === 0 && !hasCompletedTimer) {
      setHasCompletedTimer(true);
      setIsCounting(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isCounting, timeLeft, hasCompletedTimer]);

  const handleSelectOption = (idx: number) => {
    setSelectedAnswer(idx);
    setErrorMessage(null);
  };

  const handleVerify = () => {
    if (selectedAnswer === null) {
      setErrorMessage('Vui lòng chọn 1 câu trả lời.');
      return;
    }

    if (selectedAnswer === ad.verifiedQuestion.correctIndex) {
      setIsSuccess(true);
      sound.playCoin();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onReward(ad.id, ad.reward);
    } else {
      setErrorMessage('Câu trả lời chưa chính xác. Hãy xem kỹ thông tin quảng cáo bên trên và chọn lại!');
    }
  };

  const progressPercent = Math.round(((ad.durationSec - timeLeft) / ad.durationSec) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Nhà tài trợ</span>
            <span className="text-xs text-slate-600">·</span>
            <span className="text-xs font-semibold text-emerald-400">{ad.advertiser}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono tabular-nums">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{timeLeft > 0 ? `Còn ${timeLeft}s` : 'Hoàn tất thời gian'}</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Ad Banner Image Preview */}
          <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 aspect-video group">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-medium text-amber-300 border border-amber-500/20">
              Thưởng: {formatVND(ad.reward)}
            </div>
          </div>

          {/* Ad Description */}
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{ad.title}</h3>
            <p className="mt-1 text-sm text-slate-400 leading-relaxed">{ad.description}</p>
          </div>

          {/* Timer Waiting vs Verification Section */}
          {!hasCompletedTimer ? (
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div className="text-xs text-slate-300">
                <p className="font-semibold text-white">Đang xem quảng cáo xác thực...</p>
                <p className="text-slate-400 mt-0.5">Vui lòng đợi đồng hồ đếm ngược hết {timeLeft} giây để mở câu hỏi nhận thưởng.</p>
              </div>
            </div>
          ) : !isSuccess ? (
            <div className="p-4 rounded-lg bg-slate-950 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-white">Câu hỏi xác thực chống gian lận:</h4>
              </div>
              <p className="text-sm text-emerald-300 font-medium">{ad.verifiedQuestion.question}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {ad.verifiedQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`px-3 py-2.5 text-xs text-left rounded-lg border transition-all ${
                      selectedAnswer === idx
                        ? 'border-emerald-400 bg-emerald-950/50 text-white font-medium shadow-sm'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-slate-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                  </button>
                ))}
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 p-2.5 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleVerify}
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all active:scale-95 shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Xác nhận & Nhận {formatVND(ad.reward)}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="text-base font-bold text-white">Chúc mừng! Bạn đã nhận {formatVND(ad.reward)}</h4>
              <p className="text-xs text-emerald-300/90">
                Tiền thưởng đã được cộng trực tiếp vào số dư ví của bạn (+1 Lượt quay may mắn).
              </p>
              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                >
                  Hoàn tất & Tiếp tục nhiệm vụ khác
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>Cam kết chi trả uy tín qua MoMo / Bank / Thẻ cào</span>
          {ad.sponsorUrl && (
            <a
              href={ad.sponsorUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              Trang đích nhà quảng cáo <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
