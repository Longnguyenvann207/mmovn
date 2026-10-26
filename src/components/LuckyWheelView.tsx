import React, { useState, useEffect, useRef } from 'react';
import { formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, HelpCircle, AlertCircle, Trophy } from 'lucide-react';

interface LuckyWheelViewProps {
  luckySpins: number;
  onWinPrize: (prize: { label: string; amount: number; spinsAdd?: number }) => void;
  onNavigateToTasks: () => void;
}

interface WheelSegment {
  label: string;
  amount: number;
  spinsAdd?: number;
  color: string;
  textColor: string;
}

const SEGMENTS: WheelSegment[] = [
  { label: '1.000₫', amount: 1000, color: '#0f766e', textColor: '#ffffff' }, // Teal
  { label: '5.000₫', amount: 5000, color: '#b45309', textColor: '#ffffff' }, // Amber
  { label: '+1 Lượt quay', amount: 0, spinsAdd: 1, color: '#1d4ed8', textColor: '#ffffff' }, // Blue
  { label: '2.000₫', amount: 2000, color: '#334155', textColor: '#ffffff' }, // Slate
  { label: '50.000₫', amount: 50000, color: '#047857', textColor: '#ffffff' }, // Emerald
  { label: 'Chúc bạn may mắn', amount: 0, color: '#1e293b', textColor: '#94a3b8' }, // Dark
  { label: '10.000₫', amount: 10000, color: '#6d28d9', textColor: '#ffffff' }, // Purple
  { label: '100.000₫ JACKPOT', amount: 100000, color: '#d97706', textColor: '#ffffff' }, // Gold
];

export const LuckyWheelView: React.FC<LuckyWheelViewProps> = ({
  luckySpins,
  onWinPrize,
  onNavigateToTasks,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<WheelSegment | null>(null);
  const [showPrizeModal, setShowPrizeModal] = useState(false);

  // Draw the wheel onto canvas
  const drawWheel = (rotationAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 16;
    const numSegments = SEGMENTS.length;
    const arcSize = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, size, size);

    // Outer glow rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();

    // Outer metallic ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + 4, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Draw slices
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rotationAngle);

    for (let i = 0; i < numSegments; i++) {
      const seg = SEGMENTS[i];
      const startAngle = i * arcSize;
      const endAngle = startAngle + arcSize;

      // Fill segment
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      // Divider stroke
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text label inside slice
      ctx.save();
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = seg.textColor;
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(seg.label, radius - 20, 0);
      ctx.restore();
    }

    // Outer decorative studs / lights
    for (let i = 0; i < numSegments * 2; i++) {
      const angle = (i * Math.PI) / numSegments;
      const x = Math.cos(angle) * (radius + 2);
      const y = Math.sin(angle) * (radius + 2);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#fde047' : '#ffffff';
      ctx.fill();
    }

    ctx.restore();

    // Center circular badge
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#090d16';
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#34d399';
    ctx.font = '900 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('MMO', center, center);
    ctx.restore();
  };

  useEffect(() => {
    drawWheel(currentRotation);
  }, [currentRotation]);

  const handleSpin = () => {
    if (isSpinning || luckySpins <= 0) return;

    setIsSpinning(true);
    setWonPrize(null);

    // Pick a random segment (weighted slightly toward good prizes so it's delightful)
    const weights = [0.25, 0.2, 0.2, 0.15, 0.08, 0.07, 0.04, 0.01]; // sum to 1
    const rand = Math.random();
    let cumulative = 0;
    let chosenIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (rand <= cumulative) {
        chosenIndex = i;
        break;
      }
    }

    const numSegments = SEGMENTS.length;
    const arcSize = (2 * Math.PI) / numSegments;
    // The top pointer points to 270 degrees (3 * Math.PI / 2)
    // We want the chosen segment's center to align with top pointer
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5 to 7 full rotations
    const targetSegmentCenter = chosenIndex * arcSize + arcSize / 2;
    // Top pointer is at angle -Math.PI / 2
    const finalAngle = fullSpins * 2 * Math.PI + (3 * Math.PI) / 2 - targetSegmentCenter;

    const startAngle = currentRotation % (2 * Math.PI);
    const totalRotation = finalAngle - startAngle;
    const duration = 4500; // 4.5 seconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newAngle = startAngle + totalRotation * easeOut;

      setCurrentRotation(newAngle);

      // Play tick sound every ~45 deg of rotation
      if (Math.floor(newAngle / (Math.PI / 6)) !== Math.floor((newAngle - 0.1) / (Math.PI / 6))) {
        sound.playTick();
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const winningSeg = SEGMENTS[chosenIndex];
        setWonPrize(winningSeg);
        setShowPrizeModal(true);

        if (winningSeg.amount > 0 || (winningSeg.spinsAdd && winningSeg.spinsAdd > 0)) {
          sound.playCoin();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
        onWinPrize({
          label: winningSeg.label,
          amount: winningSeg.amount,
          spinsAdd: winningSeg.spinsAdd,
        });
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <Gift className="w-4 h-4" />
            <span>Vòng quay may mắn hằng ngày (Lucky Wheel)</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Quay số trúng thưởng tức thì tới 100.000₫
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Sử dụng vé quay tích lũy được từ việc hoàn thành xem quảng cáo, làm khảo sát và điểm danh để rinh giải thưởng tiền mặt.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-3.5 shrink-0 flex items-center gap-4">
          <div>
            <div className="text-[11px] text-slate-400">Lượt quay khả dụng</div>
            <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
              {luckySpins} lượt
            </div>
          </div>
        </div>
      </div>

      {/* Wheel Area & Rules Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Interactive Canvas Wheel */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-900/40 rounded-2xl border border-slate-800">
          <div className="relative">
            {/* Top Indicator Arrow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 flex flex-col items-center">
              <div className="w-5 h-6 bg-amber-400 border-2 border-slate-950 rounded-b-md shadow-lg transform rotate-180 clip-triangle" 
                   style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={380}
              height={380}
              className="max-w-full drop-shadow-2xl"
            />
          </div>

          {/* Action button */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              onClick={handleSpin}
              disabled={isSpinning || luckySpins <= 0}
              className={`px-8 py-3 text-sm font-extrabold rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2 ${
                isSpinning
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : luckySpins <= 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 hover:from-amber-300 hover:to-teal-200 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {isSpinning ? 'Đang quay...' : luckySpins > 0 ? `QUAY NGAY (${luckySpins} LƯỢT)` : 'Hết lượt quay hôm nay'}
            </button>

            {luckySpins <= 0 && (
              <p className="text-xs text-amber-400/90 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Hãy làm thêm nhiệm vụ hoặc điểm danh để nhận thêm vé quay!
              </p>
            )}
          </div>
        </div>

        {/* How to get more spins & Recent Winners */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              Cách kiếm thêm lượt quay miễn phí
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Điểm danh hằng ngày</div>
                  <div className="text-slate-400 mt-0.5">Mỗi ngày đăng nhập nhận thưởng</div>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">+1 Lượt</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Hoàn tất 1 khảo sát</div>
                  <div className="text-slate-400 mt-0.5">Khảo sát thị trường chất lượng</div>
                </div>
                <span className="font-mono font-bold text-teal-400 text-sm">+2 Lượt</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Xem video quảng cáo</div>
                  <div className="text-slate-400 mt-0.5">Xem đủ thời gian và xác thực</div>
                </div>
                <span className="font-mono font-bold text-amber-400 text-sm">+1 Lượt</span>
              </div>
            </div>

            <button
              onClick={onNavigateToTasks}
              className="w-full py-2.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              Đi tới làm nhiệm vụ nhận vé quay
            </button>
          </div>

          {/* Recent Jackpots / Live ticker style */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Thành viên trúng thưởng gần đây</span>
            </div>
            <div className="space-y-1.5 text-slate-400 text-[11px]">
              <div className="flex justify-between">
                <span>Trần**88 vừa trúng</span>
                <span className="text-amber-400 font-mono font-bold">50.000₫</span>
              </div>
              <div className="flex justify-between">
                <span>LeMinh** vừa trúng</span>
                <span className="text-emerald-400 font-mono font-bold">10.000₫</span>
              </div>
              <div className="flex justify-between">
                <span>NguyenVan** vừa trúng</span>
                <span className="text-amber-300 font-mono font-bold">100.000₫ JACKPOT</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Prize Modal */}
      {showPrizeModal && wonPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Gift className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                {wonPrize.amount > 0 || wonPrize.spinsAdd
                  ? 'Xin chúc mừng bạn!'
                  : 'Rất tiếc lần này!'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {wonPrize.amount > 0 || wonPrize.spinsAdd
                  ? 'Bạn đã quay trúng phần quà:'
                  : 'Chúc bạn may mắn hơn ở lượt quay tiếp theo.'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
                {wonPrize.label}
              </div>
              {wonPrize.amount > 0 && (
                <div className="text-[11px] text-emerald-400 mt-1">Đã cộng vào số dư ví của bạn</div>
              )}
            </div>

            <button
              onClick={() => setShowPrizeModal(false)}
              className="w-full py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-md"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
