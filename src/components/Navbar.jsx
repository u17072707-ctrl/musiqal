import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  X,
  Sun,
  Moon,
  HeartHandshake,
  User,
  LogOut,
  ShieldAlert,
  Menu,
  Music,
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar({
  searchTerm,
  onSearchChange,
  onClearSearch,
  isDark,
  onToggleTheme,
  onOpenDonate,
  onOpenAuth,
  onOpenAdmin,
  user,
  isAuthenticated,
  isAdmin,
  onLogout,
  onToggleMobileMenu,
}) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label={t('app.menu')}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                {t('app.title')}
              </span>
              <span className="hidden sm:inline-block ml-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {t('app.pro')}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder={t('app.search_placeholder')}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-full text-xs sm:text-sm bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={onClearSearch}
                className="absolute right-3 p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Actions: Language, Theme Toggle, Donate, Admin, User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={isDark ? t('nav.light_mode') : t('nav.dark_mode')}
            aria-label={t('nav.toggle_theme')}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-neutral-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Donation Button */}
          <button
            onClick={onOpenDonate}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50 transition-colors"
            title={t('nav.donate_title')}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{t('nav.donate')}</span>
          </button>

          {/* Admin Panel button if admin */}
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors"
              title={t('nav.admin_title')}
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden md:inline">{t('nav.admin')}</span>
            </button>
          )}

          {/* User Auth / Profile Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-[120px]">
                  {user?.name || user?.phone || t('nav.user_fallback')}
                </span>
                <span className="text-[10px] text-emerald-500 font-medium">{t('nav.active_account')}</span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-neutral-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title={t('nav.logout_title')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white transition-all shadow-md shadow-emerald-500/20"
            >
              <User className="w-4 h-4" />
              <span>{t('nav.login')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
