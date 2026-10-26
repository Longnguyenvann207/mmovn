import React, { useState } from 'react';
import { UserProfile } from '../types/mmo';
import { formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { LogIn, UserPlus, Shield, Sparkles, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ADMIN_USER, INITIAL_USER } from '../data/initialData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  onRegister: (newUser: UserProfile) => void;
  usersList: UserProfile[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  usersList,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regReferral, setRegReferral] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (targetUser: UserProfile) => {
    sound.playSuccess();
    onLogin(targetUser);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrimmed = loginEmail.trim().toLowerCase();
    const found = usersList.find(
      (u) => u.email.toLowerCase() === emailTrimmed || u.id === emailTrimmed
    );

    if (found) {
      if (found.status === 'banned') {
        setErrorMessage(`Tài khoản này đã bị KHÓA do vi phạm chính sách: ${found.bannedReason || 'Hệ thống phát hiện hành vi gian lận'}. Vui lòng liên hệ ban quản trị.`);
        return;
      }
      sound.playSuccess();
      onLogin(found);
      onClose();
    } else {
      setErrorMessage('Không tìm thấy tài khoản với email này. Vui lòng kiểm tra lại hoặc chuyển sang tab Đăng Ký.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrimmed = regEmail.trim().toLowerCase();
    if (!regName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!emailTrimmed.includes('@')) {
      setErrorMessage('Địa chỉ email không đúng định dạng.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Mật khẩu cần ít nhất 6 ký tự.');
      return;
    }

    const existing = usersList.find((u) => u.email.toLowerCase() === emailTrimmed);
    if (existing) {
      setErrorMessage('Email này đã được sử dụng. Hãy đăng nhập.');
      return;
    }

    // New registered user gets 10.000đ welcome bonus and 2 spins
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();

    const newUser: UserProfile = {
      id: `user-${Date.now().toString().slice(-6)}`,
      name: regName.trim(),
      email: emailTrimmed,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(regName.trim())}`,
      balance: 10000, // 10.000₫ tân thủ
      pendingBalance: 0,
      totalEarned: 10000,
      vipLevel: 1,
      vipMultiplier: 1.0,
      luckySpins: 2,
      streakDays: 0,
      lastCheckInDate: null,
      referralCode: `MMO${Math.floor(1000 + Math.random() * 9000)}`,
      referralCount: 0,
      referralEarnings: 0,
      joinedDate: `${d}/${m}/${y}`,
    };

    sound.playSuccess();
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    onRegister(newUser);
    setSuccessMessage(`Đăng ký thành công! Bạn nhận được quà tân thủ ${formatVND(10000)}.`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              ₫
            </div>
            <span className="text-sm font-bold text-white">Tài khoản MMO VN</span>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="p-1.5 bg-slate-950 flex border-b border-slate-800">
          <button
            onClick={() => { setMode('login'); setErrorMessage(null); sound.playTick(); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'login'
                ? 'bg-slate-900 text-white shadow-sm border border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>

          <button
            onClick={() => { setMode('register'); setErrorMessage(null); sound.playTick(); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'register'
                ? 'bg-slate-900 text-emerald-400 shadow-sm border border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Đăng Ký (+10.000₫ Quà)</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          {/* Quick Demo Login Shortcuts */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
              <span>Đăng nhập nhanh (Tài khoản thử nghiệm):</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(INITIAL_USER)}
                className="py-2 px-2.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/70 text-emerald-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-left"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Thành viên Quân</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const nam = usersList.find((u) => u.id === 'user-nam') || INITIAL_USER;
                  handleQuickLogin(nam);
                }}
                className="py-2 px-2.5 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/70 text-cyan-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-left"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Thành viên Nam (VIP)</span>
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Email hoặc Tên đăng nhập</label>
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Ví dụ: quanmmo@gmail.com"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Đăng Nhập Vào Hệ Thống
                </button>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Họ và tên của bạn</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Địa chỉ Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="ban@example.com"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Mật khẩu bảo mật</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Mã giới thiệu (Không bắt buộc)</label>
                <input
                  type="text"
                  value={regReferral}
                  onChange={(e) => setRegReferral(e.target.value)}
                  placeholder="Ví dụ: MMO88VN"
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono uppercase"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Đăng Ký & Nhận {formatVND(10000)} Quà Tân Thủ
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
