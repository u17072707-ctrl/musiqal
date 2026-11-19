import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Phone, KeyRound, User, Send, ShieldCheck, Sparkles, AlertCircle, Lock, ShieldAlert } from 'lucide-react';

export function AuthModal({
  isOpen,
  onClose,
  onLoginRequest,
  onVerifyCode,
  onDemoLogin,
  onAdminLogin,
  onOpenAdmin,
  botUsername = 'cidid_bot',
}) {
  const { t } = useTranslation();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'admin'
  const [step, setStep] = useState(1); // 1: phone, 2: code
  const [phone, setPhone] = useState('+998');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  if (!isOpen) return null;

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!phone || phone.length < 9) {
      setErrorMsg("Iltimos, to'liq telefon raqamingizni kiriting");
      return;
    }

    setLoading(true);
    const result = await onLoginRequest(phone, mode);
    setLoading(false);

    if (result.success) {
      setStep(2);
      setInfoMsg('Tasdiqlash kodi Telegram bot yoki SMS orqali yuborildi!');
    } else {
      setErrorMsg(result.error || 'Kod yuborishda xatolik yuz berdi');
      if (result.needBot) {
        setInfoMsg(`Iltimos, avval Telegram botimizga (@${botUsername}) kiring va /start tugmasini bosing.`);
      }
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!code) {
      setErrorMsg('Iltimos, tasdiqlash kodini kiriting');
      return;
    }

    setLoading(true);
    const result = await onVerifyCode(phone, code, name);
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.error || "Kod noto'g'ri yoki hisobingiz bloklangan");
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!onAdminLogin) return;
    const res = onAdminLogin(adminUsername, adminPassword);
    if (res && res.success) {
      onClose();
      if (onOpenAdmin) onOpenAdmin();
    } else {
      setErrorMsg(res?.error || "Login yoki parol noto'g'ri! Faqat administrator kira oladi.");
    }
  };

  const handleDemo = () => {
    onDemoLogin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3 ${
              mode === 'admin'
                ? 'bg-amber-500/10 text-amber-500'
                : 'bg-emerald-500/10 text-emerald-500'
            }`}
          >
            {mode === 'admin' ? (
              <ShieldAlert className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === 'admin'
              ? 'Admin Kirish'
              : mode === 'login'
              ? t('auth.title_login')
              : t('auth.title_register')}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {mode === 'admin'
              ? "Administrator (Ulug'bek) boshqaruv tizimi"
              : t('auth.subtitle')}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        {step === 1 && (
          <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl mb-6">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {t('auth.login_tab')}
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {t('auth.register_tab')}
            </button>
            <button
              onClick={() => {
                setMode('admin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                mode === 'admin'
                  ? 'bg-white dark:bg-neutral-900 text-amber-600 dark:text-amber-400 shadow-sm font-bold'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        )}

        {/* Error / Info Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* ADMIN LOGIN FORM (Username: ulugbek, Password: 19912008) */}
        {mode === 'admin' ? (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                Admin Username
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-neutral-400 font-mono text-sm">@</span>
                <input
                  type="text"
                  placeholder="ulugbek"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-amber-500 focus:bg-white dark:focus:bg-neutral-950 outline-none transition-all font-medium"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                Admin Parol
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-amber-500 focus:bg-white dark:focus:bg-neutral-950 outline-none transition-all font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Admin sifatida kirish</span>
            </button>
          </form>
        ) : (
          /* USER LOGIN / REGISTER FORM */
          <>
            {/* Telegram Bot Helper Banner */}
            <div className="mb-5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                <Send className="w-3.5 h-3.5" />
                <span>{t('auth.telegram_hint')}</span>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400">
                Kodni olish uchun avval botimizga <span className="font-mono text-emerald-500">/start</span> yuboring:
              </p>
              <a
                href={`https://t.me/${botUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-500 hover:underline font-semibold"
              >
                t.me/{botUsername}
              </a>
            </div>

            {/* Step 1: Phone form */}
            {step === 1 ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                    {t('auth.phone_label')}
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="+998901234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-950 outline-none transition-all font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? '...' : t('auth.send_code')}
                </button>
              </form>
            ) : (
              /* Step 2: Code verification form */
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                    {t('auth.code_label')}
                  </label>
                  <div className="relative flex items-center">
                    <KeyRound className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="12345"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-950 outline-none transition-all tracking-widest font-mono text-center"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                      {t('auth.name_label')}
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Ali Valiyev"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-950 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? '...' : t('auth.verify_button')}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setCode('');
                  }}
                  className="w-full text-center text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 mt-2"
                >
                  {t('auth.back')}
                </button>
              </form>
            )}

            {/* Demo / Tester Account Option */}
            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-center">
              <button
                type="button"
                onClick={handleDemo}
                className="w-full py-2 px-4 rounded-xl border border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('auth.demo_button')}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
