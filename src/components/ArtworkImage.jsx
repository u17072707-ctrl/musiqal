import React, { useState } from 'react';
import { Music } from 'lucide-react';
import { normalizeCoverUrl } from '../services/api';

const GRADIENTS = [
  'from-emerald-500 to-teal-700',
  'from-indigo-500 to-purple-700',
  'from-pink-500 to-rose-700',
  'from-amber-500 to-orange-700',
  'from-cyan-500 to-blue-700',
  'from-violet-500 to-fuchsia-700',
];

export function ArtworkImage({
  src,
  alt = 'Cover',
  className = '',
  songId = 1,
  title = '',
  size = 'md',
}) {
  const [hasError, setHasError] = useState(false);
  const normalizedSrc = normalizeCoverUrl(src);

  // Consistent gradient based on song ID or title length
  const gradientIndex = Math.abs((songId || title.length || 0) % GRADIENTS.length);
  const gradientClass = GRADIENTS[gradientIndex];

  if (!normalizedSrc || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br ${gradientClass} text-white shadow-inner select-none ${className}`}
        title={alt}
      >
        <Music className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'} />
        {title && size === 'lg' && (
          <span className="text-[10px] uppercase font-bold tracking-wider mt-1 opacity-90 truncate max-w-[80%]">
            {title}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={normalizedSrc}
      alt={alt}
      className={`object-cover ${className}`}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}
