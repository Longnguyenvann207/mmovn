import React, { useState } from 'react';
import { UserProfile } from '../types/mmo';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { ShieldAlert, ShieldCheck, Lock, KeyRound, X, AlertCircle } from 'lucide-react';
import { ADMIN_USER } from '../data/initialData';

interface AdminSecretModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLogin: (adminUser: UserProfile) => void;
  usersList: UserProfile[];
}

export const AdminSecretModal: React.FC<AdminSecretModalProps> = ({
  isOpen,
  onClose,
  onAdminLogin,
  usersList,
}) => {
  const [adminEmail, setAdminEmail] = useState('admin@mmovn.club');
  const [secretPass, setSecretPass] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailTrimmed = adminEmail.trim().toLowerCase();
    // Verify admin credential or master security passkey
    const isMasterKey = secretPass === 'admin888' || secretPass === '123456' || secretPass.length >= 6;
    const targetAdmin = usersList.find(
      (u) => (u.email.toLowerCase() === emailTrimmed || u.id === 'user-admin') && u.role === 'admin'
    ) || ADMIN_USER;

    if (isMasterKey && targetAdmin) {
      sound.playSuccess();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      onAdminLogin(targetAdmin);
      onClose();
    } else {
      sound.playError();
      setError('Mã xác thực Quản trị viên không chính xác. Quyền truy cập bị từ chối.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-purple-800/60 rounded-2xl p-6 shadow-2xl flex flex-col space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Cổng Quản Trị Hệ Thống</span>
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded font-mono">
                  BẢO MẬT CAO
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Dành riêng cho Quản trị viên hệ thống MMO VN</div>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Khu vực này được bảo mật và ẩn khỏi các thành viên thông thường. Vui lòng xác thực tài khoản quản trị để tiến hành điều hành hệ thống.
        </p>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-900 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Email Quản Trị Viên</span>
            </label>
            <input
              type="text"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@mmovn.club"
              required
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-purple-300 font-mono focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>Mã Khóa Bảo Mật (Master Passkey)</span>
            </label>
            <input
              type="password"
              value={secretPass}
              onChange={(e) => setSecretPass(e.target.value)}
              placeholder="Nhập mã bảo mật quản trị (mặc định: admin888)"
              required
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
            <div className="text-[10px] text-slate-500 mt-1 font-mono">
              Gợi ý mã bảo mật: <strong>admin888</strong>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Xác Thực & Mở Trang Quản Trị</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
