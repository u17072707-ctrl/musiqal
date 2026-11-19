import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  Disc3,
  Heart,
  Bookmark,
  History,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpDown,
  Music,
  Send,
  Loader2,
  AlertCircle,
  Play,
} from 'lucide-react';

// Custom Hooks
import { useTheme } from './hooks/useTheme';
import { useConfig } from './hooks/useConfig';
import { useGenres } from './hooks/useGenres';
import { useAuth } from './hooks/useAuth';
import { useFavorites } from './hooks/useFavorites';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useSongs } from './hooks/useSongs';
import { useDebounce } from './hooks/useDebounce';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HeroBanner } from './components/HeroBanner';
import { GenrePills } from './components/GenrePills';
import { SongCard } from './components/SongCard';
import { SongListItem } from './components/SongListItem';
import { PlayerBar } from './components/PlayerBar';
import { QueueDrawer } from './components/QueueDrawer';
import { AuthModal } from './components/AuthModal';
import { DonateModal } from './components/DonateModal';
import { AdminModal } from './components/AdminModal';
import { Toast } from './components/Toast';

export default function App() {
  const { t } = useTranslation();

  // Theme custom hook
  const { isDark, toggleTheme } = useTheme();

  // App configuration & genres custom hooks
  const { config } = useConfig();
  const { genres } = useGenres();

  // Authentication custom hook
  const {
    user,
    isAuthenticated,
    isAdmin,
    requestCode,
    verifyCode,
    loginAsAdmin,
    logout,
    setDemoSession,
  } = useAuth();

  // User favorites (likes, saved, history) custom hook
  const {
    likes,
    saved,
    history,
    isLiked,
    isSaved,
    toggleLike,
    toggleSave,
    addLocalHistory,
    refetchFavorites,
  } = useFavorites(isAuthenticated);

  // Audio player engine custom hook
  const {
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
    playSong,
    togglePlay,
    nextSong,
    prevSong,
    seek,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    addToQueue,
    removeFromQueue,
    clearQueue,
  } = useAudioPlayer();

  // Navigation & Filtering UI States
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortOption, setSortOption] = useState('popular');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modal & Drawer States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Debounced search query
  const debouncedSearch = useDebounce(searchTerm, 350);

  // Songs fetching custom hook
  const {
    songs,
    loading: songsLoading,
    error: songsError,
    refetch: refetchSongs,
    updateSongState,
  } = useSongs({
    query: debouncedSearch,
    genre: selectedGenre,
    sort: sortOption,
  });

  // Featured song for hero banner
  const featuredSong = useMemo(() => {
    if (songs && songs.length > 0) {
      return songs[0];
    }
    return null;
  }, [songs]);

  // Handler for playing a song
  const handlePlaySong = (song, playlist = null) => {
    const songQueue = playlist || (songs.length > 0 ? songs : [song]);
    playSong(song, songQueue);
    addLocalHistory(song);
  };

  // Like toggle handler
  const handleToggleLike = async (song) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      showToast(t('toasts.auth_required_like'), 'info');
      return;
    }

    try {
      const res = await toggleLike(song);
      updateSongState(song.id, { liked: res.liked });
      showToast(
        res.liked ? t('toasts.added_to_likes') : t('toasts.removed_from_likes'),
        'success'
      );
    } catch (err) {
      showToast(err.message || 'Xatolik yuz berdi', 'error');
    }
  };

  // Save toggle handler
  const handleToggleSave = async (song) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      showToast(t('toasts.auth_required_save'), 'info');
      return;
    }

    try {
      const res = await toggleSave(song);
      updateSongState(song.id, { saved: res.saved });
      showToast(
        res.saved ? t('toasts.added_to_saved') : t('toasts.removed_from_saved'),
        'success'
      );
    } catch (err) {
      showToast(err.message || 'Xatolik yuz berdi', 'error');
    }
  };

  // Current display songs based on activeTab
  const displaySongs = useMemo(() => {
    if (activeTab === 'likes') return likes;
    if (activeTab === 'saved') return saved;
    if (activeTab === 'history') return history;
    return songs;
  }, [activeTab, likes, saved, history, songs]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Navbar */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={() => setSearchTerm('')}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenDonate={() => setIsDonateModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        user={user}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onLogout={() => {
          logout();
          showToast(t('toasts.logged_out'), 'info');
        }}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'admin') {
              setIsAdminModalOpen(true);
            }
          }}
          likesCount={likes.length}
          savedCount={saved.length}
          historyCount={history.length}
          isAdmin={isAdmin}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          botUsername={config?.bot || 'cidid_bot'}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          onOpenAdminLogin={() => setIsAdminModalOpen(true)}
        />

        {/* Content Area */}
        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 min-w-0 transition-all ${
            currentSong ? 'pb-32 sm:pb-28' : 'pb-12'
          }`}
        >
          {/* TAB: BOSH SAHIFA (HOME) */}
          {activeTab === 'home' && (
            <>
              {/* Hero Featured Banner (Only shown if no active search) */}
              {!searchTerm && (
                <HeroBanner
                  featuredSong={featuredSong}
                  onPlayFeatured={(song) => handlePlaySong(song, songs)}
                  totalSongs={songs.length}
                  isPlaying={isPlaying && currentSong?.id === featuredSong?.id}
                />
              )}

              {/* Genre Pills Filter */}
              <div className="mb-6">
                <GenrePills
                  genres={genres}
                  selectedGenre={selectedGenre}
                  onSelectGenre={setSelectedGenre}
                />
              </div>

              {/* Controls bar: Title, Sort Dropdown, View Mode Toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <span>
                      {selectedGenre
                        ? t('home.genre_title', { genre: selectedGenre })
                        : searchTerm
                        ? t('home.search_title', { term: searchTerm })
                        : t('home.all_songs')}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold">
                      {songs.length}
                    </span>
                  </h2>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Sort Select */}
                  <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 shadow-sm">
                    <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="text-xs font-semibold bg-transparent text-neutral-700 dark:text-neutral-300 outline-none cursor-pointer"
                    >
                      <option value="popular">{t('home.sort_popular')}</option>
                      <option value="new">{t('home.sort_new')}</option>
                      <option value="plays">{t('home.sort_plays')}</option>
                      <option value="likes">{t('home.sort_likes')}</option>
                      <option value="title">{t('home.sort_title')}</option>
                    </select>
                  </div>

                  {/* Grid / List View Toggle */}
                  <div className="flex items-center bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-xl">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-neutral-900 text-emerald-500 shadow-sm'
                          : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                      }`}
                      title={t('home.view_grid')}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white dark:bg-neutral-900 text-emerald-500 shadow-sm'
                          : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                      }`}
                      title={t('home.view_list')}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {songsLoading && (
                <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                  <p className="text-sm">{t('home.loading')}</p>
                </div>
              )}

              {/* Error State */}
              {songsError && !songsLoading && (
                <div className="py-12 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-center max-w-md mx-auto">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
                  <p className="text-sm font-semibold mb-1">{t('home.error_title')}</p>
                  <p className="text-xs text-neutral-500 mb-4">{songsError}</p>
                  <button
                    onClick={refetchSongs}
                    className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors"
                  >
                    {t('home.retry')}
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!songsLoading && !songsError && songs.length === 0 && (
                <div className="py-20 text-center text-neutral-400">
                  <Music className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold text-base mb-1">{t('home.empty_title')}</p>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    {t('home.empty_desc')}
                  </p>
                </div>
              )}

              {/* Songs Grid View */}
              {!songsLoading && !songsError && viewMode === 'grid' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                  {songs.map((song) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      isPlaying={isPlaying}
                      isCurrent={currentSong?.id === song.id}
                      onPlay={() => handlePlaySong(song, songs)}
                      isLiked={isLiked(song.id) || song.liked}
                      isSaved={isSaved(song.id) || song.saved}
                      onToggleLike={handleToggleLike}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>
              )}

              {/* Songs List View */}
              {!songsLoading && !songsError && viewMode === 'list' && (
                <div className="space-y-1.5 bg-white dark:bg-neutral-900/60 p-2 sm:p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80">
                  {songs.map((song, idx) => (
                    <SongListItem
                      key={song.id}
                      index={idx}
                      song={song}
                      isPlaying={isPlaying}
                      isCurrent={currentSong?.id === song.id}
                      onPlay={() => handlePlaySong(song, songs)}
                      isLiked={isLiked(song.id) || song.liked}
                      isSaved={isSaved(song.id) || song.saved}
                      onToggleLike={handleToggleLike}
                      onToggleSave={handleToggleSave}
                      onAddToQueue={() => {
                        addToQueue(song);
                        showToast(t('toasts.added_to_queue', { title: song.title }), 'info');
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* TAB: JANRLAR (GENRES EXPLORER) */}
          {activeTab === 'genres' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-1">
                  {t('genres.title')}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {t('genres.description')}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {genres.map((g, idx) => (
                  <div
                    key={g}
                    onClick={() => {
                      setSelectedGenre(g);
                      setActiveTab('home');
                    }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-500/20 dark:via-teal-500/10 dark:to-cyan-500/20 border border-emerald-500/20 hover:border-emerald-500/40 cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-neutral-100">
                        {g}
                      </h3>
                      <span className="text-xs text-emerald-500 font-medium">
                        {t('genres.listen')}
                      </span>
                    </div>
                    <Disc3 className="w-8 h-8 text-emerald-500/40" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: YOQQANLAR / SAQLANGANLAR / TARIX */}
          {(activeTab === 'likes' || activeTab === 'saved' || activeTab === 'history') && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-1">
                  {activeTab === 'likes' && t('collections.likes_title')}
                  {activeTab === 'saved' && t('collections.saved_title')}
                  {activeTab === 'history' && t('collections.history_title')}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {activeTab === 'likes' && t('collections.likes_desc')}
                  {activeTab === 'saved' && t('collections.saved_desc')}
                  {activeTab === 'history' && t('collections.history_desc')}
                </p>
              </div>

              {!isAuthenticated ? (
                <div className="py-16 text-center max-w-sm mx-auto p-6 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base mb-1">{t('collections.auth_required_title')}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                    {t('collections.auth_required_desc')}
                  </p>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all"
                  >
                    {t('nav.login')}
                  </button>
                </div>
              ) : displaySongs.length === 0 ? (
                <div className="py-20 text-center text-neutral-400">
                  <Music className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold text-base mb-1">{t('collections.empty_title')}</p>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    {t('collections.empty_desc')}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 bg-white dark:bg-neutral-900/60 p-2 sm:p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80">
                  {displaySongs.map((song, idx) => (
                    <SongListItem
                      key={`${song.id}-${idx}`}
                      index={idx}
                      song={song}
                      isPlaying={isPlaying}
                      isCurrent={currentSong?.id === song.id}
                      onPlay={() => handlePlaySong(song, displaySongs)}
                      isLiked={isLiked(song.id)}
                      isSaved={isSaved(song.id)}
                      onToggleLike={handleToggleLike}
                      onToggleSave={handleToggleSave}
                      onAddToQueue={() => {
                        addToQueue(song);
                        showToast(t('toasts.added_to_queue', { title: song.title }), 'info');
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Sticky Bottom Audio Player Bar */}
      <PlayerBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        repeatMode={repeatMode}
        isShuffled={isShuffled}
        queue={queue}
        playbackError={playbackError}
        onTogglePlay={togglePlay}
        onNext={nextSong}
        onPrev={prevSong}
        onSeek={seek}
        onSetVolume={setVolume}
        onToggleMute={toggleMute}
        onToggleRepeat={toggleRepeat}
        onToggleShuffle={toggleShuffle}
        onToggleQueue={() => setIsQueueOpen(!isQueueOpen)}
        isQueueOpen={isQueueOpen}
        isLiked={currentSong ? isLiked(currentSong.id) : false}
        onToggleLike={handleToggleLike}
      />

      {/* Slide-out Queue Drawer */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        queue={queue}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlaySong={(song) => handlePlaySong(song, queue)}
        onRemoveFromQueue={removeFromQueue}
        onClearQueue={clearQueue}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginRequest={requestCode}
        onVerifyCode={async (phone, code, name) => {
          const res = await verifyCode(phone, code, name);
          if (res.success) {
            showToast(t('toasts.welcome'), 'success');
            refetchFavorites();
          }
          return res;
        }}
        onDemoLogin={() => {
          setDemoSession();
          showToast(t('toasts.demo_activated'), 'success');
        }}
        onAdminLogin={(u, p) => {
          const res = loginAsAdmin(u, p);
          if (res.success) {
            showToast("Xush kelibsiz, Ulug'bek! Administrator rejimi faollashdi.", 'success');
          }
          return res;
        }}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        botUsername={config?.bot || 'cidid_bot'}
      />

      {/* Donation Modal */}
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        config={config}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        onAdminLogin={(u, p) => {
          const res = loginAsAdmin(u, p);
          if (res.success) {
            showToast("Xush kelibsiz, Ulug'bek! Administrator rejimi faollashdi.", 'success');
          }
          return res;
        }}
        onAdminLogout={() => {
          logout();
          showToast("Admin sessiyasidan chiqildi", 'info');
          setIsAdminModalOpen(false);
        }}
        onSongAdded={() => {
          refetchSongs();
          showToast(t('toasts.song_added'), 'success');
        }}
        onSongDeleted={() => {
          refetchSongs();
          showToast(t('toasts.song_deleted'), 'info');
        }}
        onPlaySong={(song) => handlePlaySong(song, songs)}
      />
    </div>
  );
}
