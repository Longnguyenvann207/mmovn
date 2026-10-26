import React, { useState } from 'react';
import { UserProfile } from '../types/mmo';
import { formatVND } from '../utils/format';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { CreditCard, Smartphone, Building2, Coins, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

interface WithdrawViewProps {
  user: UserProfile;
  onWithdraw: (amount: number, method: string, details: string) => boolean;
}

type PaymentMethod = 'momo' | 'bank' | 'card' | 'crypto';

interface CardReward {
  network: string;
  amount: number;
  pin: string;
  serial: string;
}

export const WithdrawView: React.FC<WithdrawViewProps> = ({ user, onWithdraw }) => {
  const [method, setMethod] = useState<PaymentMethod>('momo');
  
  // MoMo form
  const [momoPhone, setMomoPhone] = useState('0982334182');
  const [momoName, setMomoName] = useState(user.name.toUpperCase());
  const [momoAmount, setMomoAmount] = useState('50000');

  // Bank form
  const [selectedBank, setSelectedBank] = useState('Vietcombank');
  const [bankAccNumber, setBankAccNumber] = useState('1029384756');
  const [bankAccName, setBankAccName] = useState(user.name.toUpperCase());
  const [bankAmount, setBankAmount] = useState('50000');

  // Phone card form
  const [cardNetwork, setCardNetwork] = useState('Viettel');
  const [cardValue, setCardValue] = useState<number>(20000);
  const [issuedCard, setIssuedCard] = useState<CardReward | null>(null);

  // Crypto USDT form
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoNetwork, setCryptoNetwork] = useState('TRC20');
  const [cryptoAmount, setCryptoAmount] = useState('100000');

  // State feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ title: string; note: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const bankList = [
    'Vietcombank',
    'MB Bank',
    'Techcombank',
    'VPBank',
    'ACB',
    'BIDV',
    'Agribank',
    'TPBank',
  ];

  const phoneCardDenominations = [10000, 20000, 50000, 100000, 200000];

  const handleWithdrawMomo = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const amount = parseInt(momoAmount, 10);

    if (isNaN(amount) || amount < 50000) {
      setErrorMessage('Hạn mức rút tối thiểu qua Ví MoMo là 50.000₫.');
      return;
    }
    if (amount > user.balance) {
      setErrorMessage(`Số dư của bạn không đủ (${formatVND(user.balance)}). Hãy làm thêm nhiệm vụ!`);
      return;
    }
    if (!momoPhone.match(/^(0[3|5|7|8|9])+([0-9]{8})$/)) {
      setErrorMessage('Số điện thoại MoMo không hợp lệ (cần 10 chữ số).');
      return;
    }

    const success = onWithdraw(
      amount,
      'Ví MoMo',
      `SĐT MoMo: ${momoPhone} - Người nhận: ${momoName}`
    );

    if (success) {
      sound.playSuccess();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setSuccessInfo({
        title: 'Lệnh rút tiền MoMo đã được tiếp nhận!',
        note: `Hệ thống đang chuyển ${formatVND(amount)} tới số ${momoPhone} (${momoName}). Dự kiến hoàn tất trong 1 - 5 phút.`,
      });
    }
  };

  const handleWithdrawBank = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const amount = parseInt(bankAmount, 10);

    if (isNaN(amount) || amount < 50000) {
      setErrorMessage('Hạn mức rút tối thiểu qua Ngân hàng là 50.000₫.');
      return;
    }
    if (amount > user.balance) {
      setErrorMessage(`Số dư của bạn không đủ (${formatVND(user.balance)}).`);
      return;
    }
    if (bankAccNumber.trim().length < 6) {
      setErrorMessage('Vui lòng nhập đúng số tài khoản ngân hàng.');
      return;
    }

    const success = onWithdraw(
      amount,
      'Ngân hàng',
      `Ngân hàng ${selectedBank} - STK: ${bankAccNumber} - ${bankAccName}`
    );

    if (success) {
      sound.playSuccess();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setSuccessInfo({
        title: 'Lệnh rút tiền Ngân hàng đã tạo thành công!',
        note: `Đang chuyển khoản ${formatVND(amount)} vào STK ${bankAccNumber} (${selectedBank} - ${bankAccName}). Hệ thống xử lý tự động 24/7.`,
      });
    }
  };

  const handleWithdrawCard = () => {
    setErrorMessage(null);
    if (cardValue > user.balance) {
      setErrorMessage(`Số dư của bạn không đủ (${formatVND(user.balance)}). Cần ${formatVND(cardValue)} để đổi thẻ này.`);
      return;
    }

    // Generate random 13-digit pin and 14-digit serial
    const pin = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join('');
    const serial = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join('');

    const success = onWithdraw(
      cardValue,
      'Thẻ cào',
      `Đổi thẻ cào ${cardNetwork} ${formatVND(cardValue)} - Seri: ${serial}`
    );

    if (success) {
      sound.playSuccess();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setIssuedCard({
        network: cardNetwork,
        amount: cardValue,
        pin,
        serial,
      });
    }
  };

  const handleWithdrawCrypto = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const amount = parseInt(cryptoAmount, 10);
    if (isNaN(amount) || amount < 100000) {
      setErrorMessage('Hạn mức rút tối thiểu qua Crypto là 100.000₫ (~4 USDT).');
      return;
    }
    if (amount > user.balance) {
      setErrorMessage(`Số dư của bạn không đủ (${formatVND(user.balance)}).`);
      return;
    }
    if (!cryptoAddress.trim() || cryptoAddress.length < 20) {
      setErrorMessage('Vui lòng nhập chính xác địa chỉ ví USDT (TRC20/BEP20).');
      return;
    }

    const usdtEst = (amount / 25400).toFixed(2);
    const success = onWithdraw(
      amount,
      'Crypto USDT',
      `Rút ${usdtEst} USDT (${cryptoNetwork}) tới ví ${cryptoAddress.slice(0, 8)}...${cryptoAddress.slice(-6)}`
    );

    if (success) {
      sound.playSuccess();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setSuccessInfo({
        title: 'Lệnh rút USDT đã được gửi lên mạng lưới blockchain!',
        note: `Ước tính chuyển ${usdtEst} USDT (${cryptoNetwork}) đến ví của bạn sau khi qua 12 xác nhận khối.`,
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    sound.playTick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Wallet Balance Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs text-slate-400 font-medium">Số dư khả dụng để rút</div>
          <div className="text-3xl font-black text-emerald-400 font-mono tabular-nums mt-1">
            {formatVND(user.balance)}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>Đang chờ duyệt: <strong className="text-slate-300 font-mono">{formatVND(user.pendingBalance)}</strong></span>
            <span>·</span>
            <span>Phí giao dịch: <strong className="text-emerald-400">0₫ (Miễn phí 100%)</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
            <div className="text-[11px] text-slate-400">Hạn mức tối thiểu</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">10.000₫ (Thẻ cào)</div>
          </div>
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
            <div className="text-[11px] text-slate-400">Thời gian nhận tiền</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">1 - 5 Phút</div>
          </div>
        </div>
      </div>

      {/* Payment Method Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => { setMethod('momo'); setErrorMessage(null); setSuccessInfo(null); setIssuedCard(null); sound.playTick(); }}
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 transition-all ${
            method === 'momo'
              ? 'border-pink-500 bg-pink-950/30 text-white font-semibold shadow-sm'
              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className={`w-5 h-5 ${method === 'momo' ? 'text-pink-400' : 'text-slate-500'}`} />
          <div className="text-left">
            <div className="text-xs leading-none">Ví MoMo</div>
            <div className="text-[10px] text-slate-500 mt-1">Tối thiểu 50.000₫</div>
          </div>
        </button>

        <button
          onClick={() => { setMethod('bank'); setErrorMessage(null); setSuccessInfo(null); setIssuedCard(null); sound.playTick(); }}
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 transition-all ${
            method === 'bank'
              ? 'border-emerald-500 bg-emerald-950/30 text-white font-semibold shadow-sm'
              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className={`w-5 h-5 ${method === 'bank' ? 'text-emerald-400' : 'text-slate-500'}`} />
          <div className="text-left">
            <div className="text-xs leading-none">Ngân Hàng (VietQR)</div>
            <div className="text-[10px] text-slate-500 mt-1">Tất cả ngân hàng</div>
          </div>
        </button>

        <button
          onClick={() => { setMethod('card'); setErrorMessage(null); setSuccessInfo(null); setIssuedCard(null); sound.playTick(); }}
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 transition-all ${
            method === 'card'
              ? 'border-amber-500 bg-amber-950/30 text-white font-semibold shadow-sm'
              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className={`w-5 h-5 ${method === 'card' ? 'text-amber-400' : 'text-slate-500'}`} />
          <div className="text-left">
            <div className="text-xs leading-none">Thẻ Cào ĐT</div>
            <div className="text-[10px] text-slate-500 mt-1">Từ 10.000₫ (Ngay lập tức)</div>
          </div>
        </button>

        <button
          onClick={() => { setMethod('crypto'); setErrorMessage(null); setSuccessInfo(null); setIssuedCard(null); sound.playTick(); }}
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 transition-all ${
            method === 'crypto'
              ? 'border-teal-500 bg-teal-950/30 text-white font-semibold shadow-sm'
              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Coins className={`w-5 h-5 ${method === 'crypto' ? 'text-teal-400' : 'text-slate-500'}`} />
          <div className="text-left">
            <div className="text-xs leading-none">Crypto USDT</div>
            <div className="text-[10px] text-slate-500 mt-1">Mạng TRC20 / BEP20</div>
          </div>
        </button>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Modal / Card output */}
      {successInfo && (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">{successInfo.title}</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">{successInfo.note}</p>
          <button
            onClick={() => setSuccessInfo(null)}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      )}

      {/* Issued Phone Card Output */}
      {issuedCard && (
        <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              Đổi thẻ cào thành công!
            </div>
            <span className="text-xs text-amber-300 font-mono uppercase bg-amber-500/20 px-2 py-0.5 rounded">
              {issuedCard.network} · {formatVND(issuedCard.amount)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">MÃ NẠP PIN</div>
              <div className="font-mono font-bold text-base text-white tracking-widest mt-0.5">
                {issuedCard.pin}
              </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">SỐ SERI</div>
              <div className="font-mono font-medium text-sm text-slate-300 tracking-wider mt-0.5">
                {issuedCard.serial}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(`*100*${issuedCard.pin}#`)}
              className="flex-1 py-2 px-3 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Đã sao chép cú pháp nạp!' : 'Sao chép cú pháp nạp (*100*MÃ#)'}
            </button>
            <button
              onClick={() => setIssuedCard(null)}
              className="py-2 px-4 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Method 1: MoMo form */}
      {method === 'momo' && (
        <form onSubmit={handleWithdrawMomo} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-pink-400" />
            Rút tiền nhanh về Ví MoMo (Miễn phí rút)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Số điện thoại MoMo</label>
              <input
                type="text"
                value={momoPhone}
                onChange={(e) => setMomoPhone(e.target.value)}
                placeholder="Ví dụ: 0982334182"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Họ và tên chủ ví</label>
              <input
                type="text"
                value={momoName}
                onChange={(e) => setMomoName(e.target.value.toUpperCase())}
                placeholder="NGUYEN VAN A"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Số tiền muốn rút (VNĐ)</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
              {['50000', '100000', '200000', '500000', '1000000'].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setMomoAmount(val)}
                  className={`py-1.5 px-2 text-xs rounded border font-mono transition-colors ${
                    momoAmount === val
                      ? 'bg-pink-950/60 border-pink-500 text-pink-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {formatVND(parseInt(val, 10))}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={momoAmount}
              onChange={(e) => setMomoAmount(e.target.value)}
              min={50000}
              step={10000}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-pink-500 font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 rounded-xl transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              Xác nhận rút {formatVND(parseInt(momoAmount, 10) || 0)} về MoMo
            </button>
          </div>
        </form>
      )}

      {/* Method 2: Bank form */}
      {method === 'bank' && (
        <form onSubmit={handleWithdrawBank} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            Chuyển khoản Ngân Hàng Nội Địa (VietQR 24/7)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Chọn ngân hàng</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                {bankList.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Số tài khoản ngân hàng</label>
              <input
                type="text"
                value={bankAccNumber}
                onChange={(e) => setBankAccNumber(e.target.value)}
                placeholder="Nhập số tài khoản"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Tên chủ tài khoản (In hoa)</label>
              <input
                type="text"
                value={bankAccName}
                onChange={(e) => setBankAccName(e.target.value.toUpperCase())}
                placeholder="NGUYEN VAN A"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Số tiền muốn rút (VNĐ)</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
              {['50000', '100000', '200000', '500000', '2000000'].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setBankAmount(val)}
                  className={`py-1.5 px-2 text-xs rounded border font-mono transition-colors ${
                    bankAmount === val
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {formatVND(parseInt(val, 10))}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={bankAmount}
              onChange={(e) => setBankAmount(e.target.value)}
              min={50000}
              step={10000}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              Chuyển {formatVND(parseInt(bankAmount, 10) || 0)} tới {selectedBank}
            </button>
          </div>
        </form>
      )}

      {/* Method 3: Phone Card */}
      {method === 'card' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            Đổi thẻ cào điện thoại nhận mã tức thì (Viettel, Vina, Mobi)
          </h3>

          <div>
            <label className="block text-xs text-slate-400 mb-2 font-medium">1. Chọn nhà mạng</label>
            <div className="grid grid-cols-3 gap-3">
              {['Viettel', 'VinaPhone', 'MobiFone'].map((net) => (
                <button
                  key={net}
                  type="button"
                  onClick={() => { setCardNetwork(net); sound.playTick(); }}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                    cardNetwork === net
                      ? 'border-amber-500 bg-amber-950/40 text-amber-300 shadow-sm'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2 font-medium">2. Chọn mệnh giá thẻ</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {phoneCardDenominations.map((denom) => (
                <button
                  key={denom}
                  type="button"
                  onClick={() => { setCardValue(denom); sound.playTick(); }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    cardValue === denom
                      ? 'border-amber-400 bg-amber-950/50 text-white font-bold ring-1 ring-amber-400/40'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-mono text-sm tabular-nums font-bold">{formatVND(denom)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Trừ {formatVND(denom)} ví</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleWithdrawCard}
              className="w-full py-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              Đổi ngay thẻ {cardNetwork} {formatVND(cardValue)}
            </button>
          </div>
        </div>
      )}

      {/* Method 4: Crypto USDT */}
      {method === 'crypto' && (
        <form onSubmit={handleWithdrawCrypto} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-teal-400" />
            Rút USDT (Tỷ giá quy đổi: 1 USDT = 25.400₫)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Mạng lưới (Blockchain)</label>
              <select
                value={cryptoNetwork}
                onChange={(e) => setCryptoNetwork(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-teal-500"
              >
                <option value="TRC20">Tron (TRC20) - Phí thấp nhất</option>
                <option value="BEP20">BNB Smart Chain (BEP20)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Địa chỉ ví nhận USDT</label>
              <input
                type="text"
                value={cryptoAddress}
                onChange={(e) => setCryptoAddress(e.target.value)}
                placeholder="Ví dụ: TQ7... hoặc 0x..."
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">
              Số tiền muốn rút ({formatVND(parseInt(cryptoAmount, 10) || 0)} ≈ {(parseInt(cryptoAmount, 10) / 25400 || 0).toFixed(2)} USDT)
            </label>
            <input
              type="number"
              value={cryptoAmount}
              onChange={(e) => setCryptoAmount(e.target.value)}
              min={100000}
              step={50000}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              Rút {(parseInt(cryptoAmount, 10) / 25400 || 0).toFixed(2)} USDT về ví
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
