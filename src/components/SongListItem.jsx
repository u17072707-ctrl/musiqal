import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Heart, Bookmark, Headphones, Plus } from 'lucide-react';
import { ArtworkImage } from './ArtworkImage';

export function SongListItem({
  song,
  index,
  isPlaying,
  isCurrent,
  onPlay,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
  onAddToQueue,
}) {
  const { t } = useTranslation();

  return (
    <div
      onClick={onPlay}
      className={`group flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl transition-all duration-200 cursor-pointer ${
        isCurrent
          ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-l-4 border-emerald-500'
          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
      }`}
    >
      {/* Index or Soundwave icon */}
      <div className="w-6 text-center text-xs font-semibold text-neutral-400 shrink-0">
        {isCurrent && isPlaying ? (
          <div className="flex items-end justify-center gap-0.5 h-4">
            <span className="w-1 bg-emerald-500 rounded-full animate-wave" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1 bg-emerald-500 rounded-full animate-wave" style={{ animationDelay: '200ms' }}></span>
            <span className="w-1 bg-emerald-500 rounded-full animate-wave" style={{ animationDelay: '400ms' }}></span>
          </div>
        ) : (
          <span className="group-hover:hidden">{index + 1}</span>
        )}
        <button
          className={`hidden group-hover:inline-flex p-1 rounded-full text-neutral-700 dark:text-neutral-200 hover:text-emerald-500 ${
            isCurrent && isPlaying ? '!hidden' : ''
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          aria-label={t('player.play')}
        >
          <Play className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Artwork */}
      <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 shadow-sm">
        <ArtworkImage
          src={song.cover_url}
          alt={song.title}
          songId={song.id}
          title={song.title}
          size="sm"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h4
          className={`font-medium text-sm truncate ${
            isCurrent ? 'text-emerald-500 font-semibold' : 'text-neutral-900 dark:text-neutral-100'
          }`}
        >
          {song.title}
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
          {song.artist}
        </p>
      </div>

      {/* Genre */}
      {song.genre && (
        <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 shrink-0">
          {song.genre}
        </span>
      )}

      {/* Plays */}
      <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-400 shrink-0 w-16 justify-end">
        <Headphones className="w-3.5 h-3.5" />
        <span>{song.plays || 0}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {onAddToQueue && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToQueue(song);
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-colors"
            title={t('player.add_to_queue')}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(song);
          }}
          className={`p-1.5 rounded-lg transition-colors ${
            isLiked
              ? 'text-rose-500'
              : 'text-neutral-400 hover:text-rose-500 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50'
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
          className={`p-1.5 rounded-lg transition-colors ${
            isSaved
              ? 'text-emerald-500'
              : 'text-neutral-400 hover:text-emerald-500 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50'
          }`}
          title={t('player.save')}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}
