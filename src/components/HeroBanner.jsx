import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Sparkles, Music2, Radio, Headphones } from 'lucide-react';
import { ArtworkImage } from './ArtworkImage';

export function HeroBanner({ featuredSong, onPlayFeatured, totalSongs = 0, isPlaying = false }) {
  const { t } = useTranslation();

  if (!featuredSong) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-neutral-900 text-white p-6 sm:p-8 md:p-10 shadow-2xl mb-8">
      {/* Background glowing ambient orbs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Info & Call to Action */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('hero.badge')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
            {featuredSong.title}
          </h1>

          <p className="text-base sm:text-lg text-emerald-100 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
            <Radio className="w-4 h-4 text-emerald-300" />
            <span>{featuredSong.artist}</span>
            {featuredSong.genre && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-emerald-200 border border-white/10">
                {featuredSong.genre}
              </span>
            )}
          </p>

          <p className="text-xs sm:text-sm text-neutral-200 max-w-lg mb-6 opacity-90 line-clamp-2">
            {t('hero.description')}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={() => onPlayFeatured(featuredSong)}
              className="px-6 py-3 rounded-full bg-white text-neutral-950 font-bold hover:bg-emerald-50 active:scale-95 transition-all shadow-xl shadow-black/20 flex items-center gap-2 text-sm sm:text-base group"
            >
              <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              <span>{isPlaying ? t('hero.playing') : t('hero.listen_now')}</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/25 backdrop-blur-md border border-white/10 text-xs text-neutral-200">
              <Headphones className="w-4 h-4 text-emerald-300" />
              <span>{t('hero.plays_count', { count: featuredSong.plays || 0 })}</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/25 backdrop-blur-md border border-white/10 text-xs text-neutral-200">
              <Music2 className="w-4 h-4 text-teal-300" />
              <span>{t('hero.total_songs', { count: totalSongs })}</span>
            </div>
          </div>
        </div>

        {/* Right: Featured Artwork */}
        <div className="relative shrink-0 group">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
            <ArtworkImage
              src={featuredSong.cover_url}
              alt={featuredSong.title}
              songId={featuredSong.id}
              title={featuredSong.title}
              size="lg"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Glowing vinyl disc accent behind the cover */}
          <div className="absolute -right-3 top-3 bottom-3 w-12 rounded-r-2xl bg-black/70 border border-white/10 -z-10 group-hover:translate-x-3 transition-transform duration-500 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border border-white/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
