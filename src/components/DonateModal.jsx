import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Heart, Copy, Check, CreditCard, ExternalLink } from 'lucide-react';

export function DonateModal({ isOpen, onClose, config }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const donate = config?.donate || {
    card: '8600 0000 0000 0000',
    owner: 'MusicUz',
    payme: '',
    click: '',
  };

  const handleCopyCard = () => {
    if (donate.card) {
      navigator.clipboard.writeText(donate.card.replace(/\s+/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 mb-3 animate-pulse-subtle">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{t('donate.title')}</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
            {t('donate.subtitle')}
          </p>
        </div>

        {/* Card presentation */}
        <div className="p-5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-800 text-white shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-white/10 rounded-full blur-xl"></div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-200" />
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-100">
                {t('donate.card_type')}
              </span>
            </div>
            <span className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded text-emerald-200">
              {t('donate.card_country')}
            </span>
          </div>

          <div className="mb-4">
            <p className="text-xs text-emerald-200 mb-1">{t('donate.copy_card')}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg sm:text-xl font-mono font-bold tracking-wider">
                {donate.card || '8600 0000 0000 0000'}
              </span>
              <button
                onClick={handleCopyCard}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95"
                title={t('donate.copy_card')}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-emerald-100">
            <div>
              <span className="block text-[10px] text-emerald-300">{t('donate.card_owner')}</span>
              <span className="font-semibold">{donate.owner || 'MusicUz'}</span>
            </div>
            {copied && (
              <span className="text-xs font-semibold text-emerald-200 animate-fade-in">
                {t('donate.copied')}
              </span>
            )}
          </div>
        </div>

        {/* Payment Buttons (Click / Payme) */}
        {(donate.payme || donate.click) && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {donate.payme && (
              <a
                href={donate.payme}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-semibold text-xs transition-colors"
              >
                <span>Payme</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {donate.click && (
              <a
                href={donate.click}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold text-xs transition-colors"
              >
                <span>Click</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        <button
          onClick={handleCopyCard}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>{t('donate.copied')}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{t('donate.copy_card')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
