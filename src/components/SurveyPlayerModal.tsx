import React, { useState } from 'react';
import { SurveyTask } from '../types/mmo';
import { formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { ChevronRight, ChevronLeft, CheckCircle2, Award, Star, X, Sparkles, Building2 } from 'lucide-react';

interface SurveyPlayerModalProps {
  survey: SurveyTask;
  onClose: () => void;
  onComplete: (surveyId: string, amount: number) => void;
}

export const SurveyPlayerModal: React.FC<SurveyPlayerModalProps> = ({ survey, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentQ = survey.questions[currentStep];
  const totalQuestions = survey.questions.length;
  const progressPercent = Math.round(((currentStep + 1) / totalQuestions) * 100);

  const handleSelectOption = (option: string) => {
    setErrorMsg(null);
    sound.playTick();
    if (currentQ.type === 'multiple') {
      const existing = (answers[currentQ.id] as string[]) || [];
      if (existing.includes(option)) {
        setAnswers({ ...answers, [currentQ.id]: existing.filter((item) => item !== option) });
      } else {
        setAnswers({ ...answers, [currentQ.id]: [...existing, option] });
      }
    } else {
      setAnswers({ ...answers, [currentQ.id]: option });
    }
  };

  const handleTextChange = (text: string) => {
    setErrorMsg(null);
    setAnswers({ ...answers, [currentQ.id]: text });
  };

  const handleNext = () => {
    // Validation
    const currentVal = answers[currentQ.id];
    if (
      !currentVal ||
      (Array.isArray(currentVal) && currentVal.length === 0) ||
      (typeof currentVal === 'string' && currentVal.trim() === '')
    ) {
      setErrorMsg('Vui lòng trả lời câu hỏi trước khi tiếp tục.');
      return;
    }

    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
      setErrorMsg(null);
    } else {
      // Submit survey
      setIsFinished(true);
      sound.playSuccess();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
      });
      onComplete(survey.id, survey.reward);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setErrorMsg(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300 truncate max-w-xs">{survey.institution}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-amber-300 font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 font-mono">
              Thù lao: {formatVND(survey.reward)}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {!isFinished && (
          <div className="w-full bg-slate-800 h-1.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!isFinished ? (
            <>
              {/* Question Index & Category */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-emerald-400">
                  Câu hỏi {currentStep + 1} / {totalQuestions}
                </span>
                <span>{survey.category}</span>
              </div>

              {/* Question Text */}
              <h3 className="text-lg font-bold text-white leading-snug">
                {currentQ.question}
              </h3>

              {/* Input rendering according to type */}
              {currentQ.type === 'text' ? (
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={(answers[currentQ.id] as string) || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="Nhập câu trả lời hoặc ý kiến đóng góp của bạn tại đây..."
                    className="w-full p-3.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors resize-none placeholder:text-slate-600"
                  />
                  <p className="text-[11px] text-slate-500">Ý kiến chân thực của bạn đóng vai trò rất quan trọng cho nghiên cứu thị trường.</p>
                </div>
              ) : currentQ.type === 'rating' ? (
                <div className="space-y-2">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full p-3 text-left text-xs rounded-lg border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-medium'
                            : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Star className={`w-4 h-4 ${isSelected ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                          {opt}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const isMulti = currentQ.type === 'multiple';
                    const isSelected = isMulti
                      ? ((answers[currentQ.id] as string[]) || []).includes(opt)
                      : answers[currentQ.id] === opt;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full p-3.5 text-left text-xs sm:text-sm rounded-lg border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-medium shadow-sm'
                            : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-5 h-5 rounded flex items-center justify-center text-xs font-mono shrink-0 ${
                              isSelected
                                ? 'bg-emerald-500 text-slate-950 font-bold'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isMulti ? (isSelected ? '✓' : '□') : String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <p className="text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 p-2.5 rounded-lg">
                  {errorMsg}
                </p>
              )}
            </>
          ) : (
            /* Completed Screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Award className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Khảo sát hoàn tất xuất sắc!</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                  Cảm ơn bạn đã đóng góp câu trả lời chất lượng cho {survey.institution}.
                </p>
              </div>

              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl inline-block max-w-sm w-full">
                <div className="text-xs text-emerald-300">Thù lao khảo sát nhận được:</div>
                <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums mt-1">
                  +{formatVND(survey.reward)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Đã cộng vào số dư ví của bạn
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-md"
                >
                  Đóng & Nhận thêm khảo sát khác
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        {!isFinished && (
          <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                currentStep === 0
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Quay lại
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-lg transition-all active:scale-95 shadow-sm"
            >
              <span>{currentStep === totalQuestions - 1 ? 'Nộp khảo sát & Nhận tiền' : 'Tiếp theo'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
