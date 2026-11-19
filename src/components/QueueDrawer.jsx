import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Trash2, Play, Music } from 'lucide-react';
import { ArtworkImage } from './ArtworkImage';

export function QueueDrawer({
  isOpen,
  onClose,
  queue,
  currentSong,
  isPlaying,
  onPlaySong,
  onRemoveFromQueue,
  onClearQueue,
}) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col transition-transform duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            {t('player.queue_count', { count: queue.length })}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {queue.length > 0 && (
            <button
              onClick={onClearQueue}
              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t('player.clear')}
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Queue items list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {queue.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 py-12">
            <Music className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium text-sm">{t('player.empty_queue')}</p>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs">
              {t('player.empty_queue_desc')}
            </p>
          </div>
        ) : (
          queue.map((song, idx) => {
            const isCurrent = currentSong?.id === song.id;
            return (
              <div
                key={`${song.id}-${idx}`}
                className={`group flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-emerald-500/15 border border-emerald-500/30'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                }`}
              >
                <div
                  onClick={() => onPlaySong(song)}
                  className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                >
                  <ArtworkImage
                    src={song.cover_url}
                    alt={song.title}
                    songId={song.id}
                    title={song.title}
                    size="sm"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                  </div>
                </div>

                <div
                  onClick={() => onPlaySong(song)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <h4
                    className={`text-sm font-medium truncate ${
                      isCurrent ? 'text-emerald-500 font-semibold' : 'text-neutral-900 dark:text-neutral-100'
                    }`}
                  >
                    {song.title}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {song.artist}
                  </p>
                </div>

                <button
                  onClick={() => onRemoveFromQueue(idx)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove from queue"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
