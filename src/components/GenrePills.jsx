import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

export function GenrePills({ genres = [], selectedGenre, onSelectGenre }) {
  const { t } = useTranslation();
  const isAllSelected = !selectedGenre;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      {/* All Genres Option */}
      <button
        onClick={() => onSelectGenre('')}
        className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
          isAllSelected
            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-[1.02]'
            : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>{t('genres.all')}</span>
      </button>

      {/* Individual Genres */}
      {genres.map((genre) => {
        const isSelected = selectedGenre === genre;
        return (
          <button
            key={genre}
            onClick={() => onSelectGenre(genre)}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
              isSelected
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-[1.02]'
                : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
}
