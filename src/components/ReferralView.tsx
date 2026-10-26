import React, { useState } from 'react';
import { UserProfile } from '../types/mmo';
import { formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import { Users, Copy, Check, Share2, DollarSign, Award, ChevronRight } from 'lucide-react';

interface ReferralViewProps {
  user: UserProfile;
}

export const ReferralView: React.FC<ReferralViewProps> = ({ user }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralLink = `https://mmovn.club/join?ref=${user.referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopiedCode(true);
    sound.playTick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    sound.playTick();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const friendsList = [
    { username: 'tranminh_92', joinedDate: 'Hôm nay', tasksDone: 4, commission: 8500, status: 'Hoạt động' },
    { username: 'lethu_thao', joinedDate: 'Hôm qua', tasksDone: 6, commission: 14200, status: 'Hoạt động' },
    { username: 'hoangviet_mmo', joinedDate: '2 ngày trước', tasksDone: 3, commission: 6800, status: 'Hoạt động' },
    { username: 'quynhnga_88', joinedDate: '3 ngày trước', tasksDone: 5, commission: 11000, status: 'Hoạt động' },
    { username: 'ducphuong_99', joinedDate: '5 ngày trước', tasksDone: 1, commission: 1500, status: 'Mới tham gia' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
            <Users className="w-4 h-4" />
            <span>Chương trình Tiếp Thị Liên Kết (Referral Program)</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Giới thiệu bạn bè nhận 10% hoa hồng trọn đời
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Mỗi khi bạn bè hoàn thành 1 khảo sát hoặc xem quảng cáo, bạn tự động nhận ngay 10% hoa hồng tiền mặt không giới hạn.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-center">
            <div className="text-[11px] text-slate-400">Bạn bè đã tham gia</div>
            <div className="text-2xl font-black text-white font-mono tabular-nums">
              {user.referralCount} người
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-center">
            <div className="text-[11px] text-slate-400">Hoa hồng đã nhận</div>
            <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
              {formatVND(user.referralEarnings)}
            </div>
          </div>
        </div>
      </div>

      {/* Share Box & Link */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Share2 className="w-4 h-4 text-emerald-400" />
          Mã giới thiệu & Đường dẫn liên kết của bạn
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">MÃ GIỚI THIỆU</div>
              <div className="font-mono font-bold text-xl text-amber-400 mt-0.5 tracking-wider">
                {user.referralCode}
              </div>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition-colors"
              title="Sao chép mã"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="md:col-span-2 p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
            <div className="truncate flex-1">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">LINK MỜI BẠN BÈ</div>
              <div className="font-mono text-xs text-slate-300 mt-1 truncate">
                {referralLink}
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Đã chép link!' : 'Sao chép link'}</span>
            </button>
          </div>
        </div>

        {/* Benefits breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
              <DollarSign className="w-4 h-4" />
              10% Hoa hồng F1
            </div>
            <p className="text-slate-400 leading-relaxed">
              Nhận ngay 10% giá trị mỗi khi bạn bè trực tiếp hoàn thành nhiệm vụ xem quảng cáo và khảo sát.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-teal-400 font-bold mb-1">
              <Award className="w-4 h-4" />
              +5.000₫ Thưởng nóng
            </div>
            <p className="text-slate-400 leading-relaxed">
              Cộng ngay 5.000₫ tiền mặt vào ví khi người bạn giới thiệu làm xong 3 nhiệm vụ đầu tiên.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1">
              <ChevronRight className="w-4 h-4" />
              3% Hoa hồng F2
            </div>
            <p className="text-slate-400 leading-relaxed">
              Nhận thêm 3% thu nhập thụ động khi bạn bè của bạn tiếp tục giới thiệu người khác tham gia.
            </p>
          </div>
        </div>
      </div>

      {/* Friends list table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Danh sách bạn bè đã mời gần đây</h3>
          <span className="text-xs text-slate-400 font-mono">Tổng: {friendsList.length} thành viên</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3 font-medium">Tên người dùng</th>
                <th className="px-6 py-3 font-medium">Thời gian</th>
                <th className="px-6 py-3 font-medium">Nhiệm vụ xong</th>
                <th className="px-6 py-3 font-medium text-right">Hoa hồng nhận</th>
                <th className="px-6 py-3 font-medium text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {friendsList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-[10px] text-slate-300 flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    {item.username}
                  </td>
                  <td className="px-6 py-3.5 text-slate-400">{item.joinedDate}</td>
                  <td className="px-6 py-3.5 text-slate-300 font-mono">{item.tasksDone} nhiệm vụ</td>
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-emerald-400">
                    +{formatVND(item.commission)}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span className="text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
