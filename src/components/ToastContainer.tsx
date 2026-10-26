import React, { useEffect, useState } from 'react';
import { ToastItem } from '../types/toast';
import { formatVND } from '../utils/format';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, Crown, Sparkles } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none sm:right-6">
      {toasts.map((toast) => (
        <ToastSingle key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastSingle: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const duration = toast.durationMs || 4000;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [toast.id, duration, onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          border: 'border-emerald-500/60 shadow-emerald-500/10',
          bg: 'bg-slate-900/95',
          iconColor: 'text-emerald-400',
          progressColor: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
        };
      case 'error':
        return {
          border: 'border-rose-500/60 shadow-rose-500/10',
          bg: 'bg-slate-900/95',
          iconColor: 'text-rose-400',
          progressColor: 'bg-rose-500',
          icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
        };
      case 'warning':
        return {
          border: 'border-amber-500/60 shadow-amber-500/10',
          bg: 'bg-slate-900/95',
          iconColor: 'text-amber-400',
          progressColor: 'bg-amber-500',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
        };
      case 'level_up':
        return {
          border: 'border-amber-400/80 shadow-amber-500/25 ring-1 ring-amber-400/30',
          bg: 'bg-gradient-to-br from-amber-950/90 via-slate-900/95 to-slate-900/95',
          iconColor: 'text-amber-300',
          progressColor: 'bg-gradient-to-r from-amber-400 to-yellow-300',
          icon: (
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
              <Crown className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </div>
          ),
        };
      case 'info':
      default:
        return {
          border: 'border-cyan-500/60 shadow-cyan-500/10',
          bg: 'bg-slate-900/95',
          iconColor: 'text-cyan-400',
          progressColor: 'bg-cyan-500',
          icon: <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-xl border ${style.border} ${style.bg} p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-in flex items-start gap-3`}
      role="alert"
    >
      {style.icon}

      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-white tracking-tight leading-snug">
            {toast.title}
          </h4>
          {toast.amount !== undefined && (
            <span
              className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                toast.amount >= 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {toast.amount >= 0 ? `+${formatVND(toast.amount)}` : formatVND(toast.amount)}
            </span>
          )}
        </div>

        {toast.message && (
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed break-words">
            {toast.message}
          </p>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white transition-colors p-0.5 -mt-1 -mr-1"
        aria-label="Đóng thông báo"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress countdown bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/80">
        <div
          className={`h-full ${style.progressColor} transition-all duration-75 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
