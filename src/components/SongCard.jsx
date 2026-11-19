import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, Heart, Bookmark, Headphones } from 'lucide-react';
import { ArtworkImage } from './ArtworkImage';

export function SongCard({
  song,
  isPlaying,
  isCurrent,
  onPlay,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
}) {
  const { t } = useTranslation();

  return (
    <div
      onClick={onPlay}
      className={`group relative p-3 sm:p-4 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
        isCurrent
          ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-2 border-emerald-500 shadow-lg shadow-emerald-500/10'
          : 'bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800/70 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 hover:-translate-y-1'
      }`}
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-md mb-3">
        <ArtworkImage
          src={song.cover_url}
          alt={song.title}
          songId={song.id}
          title={song.title}
          size="lg"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Play overlay button */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${
            isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 transform transition hover:scale-110 active:scale-95"
            aria-label={isCurrent && isPlaying ? t('player.pause') : t('player.play')}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Genre tag badge */}
        {song.genre && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-md">
            {song.genre}
          </span>
        )}

        {/* Plays count badge */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/60 text-neutral-200 backdrop-blur-md flex items-center gap-1">
          <Headphones className="w-3 h-3" />
          <span>{song.plays || 0}</span>
        </div>
      </div>

      {/* Title & Artist */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3
            className={`font-semibold text-sm sm:text-base truncate ${
              isCurrent ? 'text-emerald-500 font-bold' : 'text-neutral-900 dark:text-neutral-100'
            }`}
            title={song.title}
          >
            {song.title}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate mt-0.5" title={song.artist}>
            {song.artist}
          </p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(song);
            }}
            className={`p-1.5 rounded-full transition-colors ${
              isLiked
                ? 'text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/40'
                : 'text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title={t('player.like')}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(song);
            }}
            className={`p-1.5 rounded-full transition-colors ${
              isSaved
                ? 'text-emerald-500 hover:text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                : 'text-neutral-400 hover:text-emerald-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title={t('player.save')}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
