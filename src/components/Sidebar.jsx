import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  Disc3,
  Heart,
  Bookmark,
  History,
  ShieldAlert,
  Send,
  X,
  Sparkles,
  Lock,
} from 'lucide-react';

export function Sidebar({
  activeTab,
  onSelectTab,
  likesCount = 0,
  savedCount = 0,
  historyCount = 0,
  isAdmin = false,
  isMobileOpen = false,
  onCloseMobile,
  botUsername = 'cidid_bot',
  onOpenAdmin,
  onOpenAdminLogin,
}) {
  const { t } = useTranslation();

  const menuItems = [
    {
      id: 'home',
      label: t('sidebar.home'),
      icon: Compass,
    },
    {
      id: 'genres',
      label: t('sidebar.genres'),
      icon: Disc3,
    },
    {
      id: 'likes',
      label: t('sidebar.likes'),
      icon: Heart,
      count: likesCount,
    },
    {
      id: 'saved',
      label: t('sidebar.saved'),
      icon: Bookmark,
      count: savedCount,
    },
    {
      id: 'history',
      label: t('sidebar.history'),
      icon: History,
      count: historyCount,
    },
  ];

  if (isAdmin) {
    menuItems.push({
      id: 'admin',
      label: t('sidebar.admin_panel'),
      icon: ShieldAlert,
    });
  }

  const navContent = (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
            {t('sidebar.my_music')}
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (item.id === 'admin' && onOpenAdmin) {
                    onOpenAdmin();
                  }
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {/* Telegram bot callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200/50 dark:from-neutral-900 dark:to-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400">
            <Send className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{t('sidebar.telegram_bot')}</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {t('sidebar.bot_description')}
          </p>
          <a
            href={`https://t.me/${botUsername || 'cidid_bot'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>@{botUsername || 'cidid_bot'}</span>
          </a>
        </div>

        {/* Discreet Admin Login entry if not admin, or Admin Badge if admin */}
        {isAdmin ? (
          <button
            onClick={() => {
              if (onOpenAdmin) onOpenAdmin();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-all shadow-sm"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Admin Panel (Ulug'bek)</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (onOpenAdminLogin) onOpenAdminLogin();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full text-center text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 py-1.5 flex items-center justify-center gap-1.5 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/40"
            title="Administrator kirish"
          >
            <Lock className="w-3 h-3" />
            <span>Admin kirish</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-neutral-200/80 dark:border-neutral-800/80 h-[calc(100vh-4rem)] sticky top-16 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md">
        {navContent}
      </aside>

      {/* Mobile drawer backdrop and panel */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCloseMobile}
          ></div>
          <div className="relative w-72 max-w-[80vw] h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-10 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <span className="font-bold text-emerald-500">{t('sidebar.mobile_menu_title')}</span>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{navContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
