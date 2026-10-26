import React from 'react';
import { SurveyTask } from '../types/mmo';
import { formatNumber, formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import { FileText, Clock, Users, Star, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';

interface SurveyViewProps {
  surveys: SurveyTask[];
  onSelectSurvey: (survey: SurveyTask) => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ surveys, onSelectSurvey }) => {
  const visibleSurveys = surveys.filter((s) => s.isActive !== false);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/60 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <FileText className="w-4 h-4" />
            <span>Nhiệm vụ làm khảo sát nghiên cứu thị trường</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Khảo sát trả thưởng trực tiếp (Paid Surveys)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Các khảo sát đến từ viện nghiên cứu, doanh nghiệp hàng tiêu dùng & công nghệ. Trả lời trung thực để nhận thù lao cao từ 15.000₫ – 25.000₫ mỗi bài.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-3.5 shrink-0 flex items-center gap-4">
          <div>
            <div className="text-[11px] text-slate-400">Khảo sát có sẵn</div>
            <div className="text-xl font-bold text-teal-400 font-mono tabular-nums">
              {visibleSurveys.filter((s) => !s.isCompleted).length} khảo sát
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-[11px] text-slate-400">Tỷ lệ duyệt thưởng</div>
            <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
              100% Tự động
            </div>
          </div>
        </div>
      </div>

      {/* Trust Notice */}
      <div className="p-3.5 rounded-lg bg-teal-950/20 border border-teal-800/40 flex items-center gap-3 text-xs text-teal-300">
        <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
        <span>
          Mẹo kiếm nhiều tiền hơn: Hãy đọc kỹ từng câu hỏi và lựa chọn câu trả lời thực tế. Hệ thống đối chiếu dữ liệu để mở khóa các khảo sát VIP giá trị cao hơn.
        </span>
      </div>

      {/* Survey Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visibleSurveys.map((survey) => {
          const isDone = survey.isCompleted;

          return (
            <div
              key={survey.id}
              className={`rounded-xl border p-5 transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-slate-900/30 border-slate-800/60 opacity-60'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:shadow-xl'
              }`}
            >
              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-teal-400 truncate max-w-[200px]">
                    {survey.institution}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{survey.rating}</span>
                    <span className="text-slate-600">·</span>
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatNumber(survey.participantsCount)}</span>
                  </div>
                </div>

                {/* Survey Title */}
                <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
                  {survey.title}
                </h3>

                <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {survey.description}
                </p>

                {/* Badges */}
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Khoảng {survey.estimatedMinutes} phút</span>
                  </div>
                  <span className="text-slate-700">/</span>
                  <div className="flex items-center gap-1">
                    <span>{survey.questions.length} câu hỏi</span>
                  </div>
                  <span className="text-slate-700">/</span>
                  <div className="text-slate-300 font-medium">
                    {survey.category}
                  </div>
                </div>
              </div>

              {/* Reward and Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Thù lao trả thẳng</div>
                  <div className="text-lg font-black text-emerald-400 font-mono tabular-nums">
                    +{formatVND(survey.reward)}
                  </div>
                </div>

                {isDone ? (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Đã nhận tiền</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      sound.playTick();
                      onSelectSurvey(survey);
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-all active:scale-95 shadow-md flex items-center gap-1"
                  >
                    <span>Bắt đầu khảo sát</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
