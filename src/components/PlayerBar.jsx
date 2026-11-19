import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  ListMusic,
  Maximize2,
  AlertTriangle,
} from 'lucide-react';
import { ArtworkImage } from './ArtworkImage';

function formatTime(secs) {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function PlayerBar({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  repeatMode,
  isShuffled,
  queue,
  playbackError,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onSetVolume,
  onToggleMute,
  onToggleRepeat,
  onToggleShuffle,
  onToggleQueue,
  isQueueOpen,
  isLiked,
  onToggleLike,
}) {
  const { t } = useTranslation();
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekVal, setSeekVal] = useState(0);

  if (!currentSong) {
    return null;
  }

  const progressPercent = duration ? ((isSeeking ? seekVal : currentTime) / duration) * 100 : 0;

  const handleSeekChange = (e) => {
    setIsSeeking(true);
    setSeekVal(Number(e.target.value));
  };

  const handleSeekEnd = (e) => {
    setIsSeeking(false);
    onSeek(Number(e.target.value));
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const repeatTooltip =
    repeatMode === 'one'
      ? t('player.repeat_one')
      : repeatMode === 'all'
      ? t('player.repeat_all')
      : t('player.repeat_off');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-200/80 dark:border-neutral-800/80 shadow-2xl transition-all">
      {/* Playback error banner */}
      {playbackError && (
        <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs py-1 px-4 text-center border-b border-amber-500/20 flex items-center justify-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{playbackError} ({t('player.audio_source_error')}: {currentSong.audio_url})</span>
        </div>
      )}

      {/* Main player layout */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 md:gap-6">
        {/* Left: Song Info */}
        <div className="flex items-center gap-3 min-w-0 w-1/4 sm:w-1/3 md:w-1/4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md shrink-0 border border-neutral-200 dark:border-neutral-800">
            <ArtworkImage
              src={currentSong.cover_url}
              alt={currentSong.title}
              songId={currentSong.id}
              title={currentSong.title}
              size="sm"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold truncate text-neutral-900 dark:text-neutral-100" title={currentSong.title}>
              {currentSong.title}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate" title={currentSong.artist}>
              {currentSong.artist || t('player.unknown_artist')}
            </p>
          </div>

          <button
            onClick={() => onToggleLike(currentSong)}
            className={`p-1.5 rounded-full transition-colors hidden sm:inline-flex ${
              isLiked
                ? 'text-rose-500 hover:text-rose-600'
                : 'text-neutral-400 hover:text-rose-500'
            }`}
            title={t('player.like')}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Center: Controls & Seekbar */}
        <div className="flex-1 max-w-xl flex flex-col items-center">
          {/* Controls */}
          <div className="flex items-center gap-3 sm:gap-5 mb-1">
            {/* Shuffle */}
            <button
              onClick={onToggleShuffle}
              className={`p-1.5 rounded-full transition-colors hidden sm:inline-flex ${
                isShuffled
                  ? 'text-emerald-500 hover:text-emerald-400 bg-emerald-500/10'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
              title={isShuffled ? t('player.shuffle_on') : t('player.shuffle_off')}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Prev */}
            <button
              onClick={onPrev}
              className="p-1.5 rounded-full text-neutral-700 dark:text-neutral-300 hover:text-emerald-500 transition-colors"
              title={t('player.prev')}
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={onTogglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
              title={isPlaying ? t('player.pause') : t('player.play')}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={onNext}
              className="p-1.5 rounded-full text-neutral-700 dark:text-neutral-300 hover:text-emerald-500 transition-colors"
              title={t('player.next')}
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            {/* Repeat */}
            <button
              onClick={onToggleRepeat}
              className={`p-1.5 rounded-full transition-colors hidden sm:inline-flex relative ${
                repeatMode !== 'off'
                  ? 'text-emerald-500 hover:text-emerald-400 bg-emerald-500/10'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
              title={repeatTooltip}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Progress / Seekbar */}
          <div className="w-full flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
            <span className="w-9 text-right shrink-0">
              {formatTime(isSeeking ? seekVal : currentTime)}
            </span>

            <div className="relative flex-1 group py-1.5 flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={isSeeking ? seekVal : currentTime}
                onChange={handleSeekChange}
                onMouseUp={handleSeekEnd}
                onTouchEnd={handleSeekEnd}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-neutral-200 dark:bg-neutral-800 transition-all group-hover:h-2"
                style={{
                  background: `linear-gradient(to right, #10b981 ${progressPercent}%, rgba(150,150,150,0.2) ${progressPercent}%)`,
                }}
              />
            </div>

            <span className="w-9 text-left shrink-0">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Soundwave, Queue, Volume */}
        <div className="flex items-center justify-end gap-3 w-1/4 sm:w-1/3 md:w-1/4">
          {/* Animated sound wave bars when playing */}
          {isPlaying && (
            <div className="hidden lg:flex items-end gap-0.5 h-4">
              <span className="w-0.5 bg-emerald-500 rounded-full animate-wave" style={{ animationDelay: '0ms' }}></span>
              <span className="w-0.5 bg-emerald-500 rounded-full animate-wave" style={{ animationDelay: '200ms' }}></span>
              <span className="w-0.5 bg-emerald-500 rounded-full animate-wave" style={{ animationDelay: '400ms' }}></span>
              <span className="w-0.5 bg-emerald-500 rounded-full animate-wave" style={{ animationDelay: '100ms' }}></span>
            </div>
          )}

          {/* Queue toggle */}
          <button
            onClick={onToggleQueue}
            className={`p-2 rounded-xl transition-colors relative ${
              isQueueOpen
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title={t('player.queue')}
          >
            <ListMusic className="w-5 h-5" />
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                {queue.length}
              </span>
            )}
          </button>

          {/* Volume control */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              title={isMuted ? t('player.unmute') : t('player.mute')}
            >
              <VolumeIcon className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => onSetVolume(Number(e.target.value))}
              className="w-16 sm:w-20 h-1.5 rounded-lg appearance-none cursor-pointer bg-neutral-200 dark:bg-neutral-800 accent-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
