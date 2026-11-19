import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  X,
  BarChart3,
  PlusCircle,
  List,
  Users,
  Trash2,
  Lock,
  Unlock,
  Music,
  Headphones,
  CheckCircle,
  AlertCircle,
  Upload,
  Crown,
  Flame,
  Search,
  Play,
  LogOut,
  ShieldAlert,
  UserCheck,
  UserX,
  Sparkles,
  Loader2,
  FolderOpen,
  FileAudio,
  Image as ImageIcon,
  Wifi,
  WifiOff,
  Link as LinkIcon,
  Clock,
  UserMinus,
  Users2,
} from 'lucide-react';
import { api, sessionManager } from '../services/api';
import { ArtworkImage } from './ArtworkImage';

export function AdminModal({
  isOpen,
  onClose,
  onSongAdded,
  onSongDeleted,
  isAdmin,
  onAdminLogin,
  onAdminLogout,
  onPlaySong,
}) {
  // Navigation tab: 'stats' | 'add' | 'songs' | 'users' | 'sessions'
  const [activeTab, setActiveTab] = useState('stats');

  // Login Gate State (for username "ulugbek" and password "19912008")
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [songsList, setSongsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Active sessions state
  const [sessionsList, setSessionsList] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // Leaderboard filter in Stats tab: 'top5' | 'top10' | 'all'
  const [rankingFilter, setRankingFilter] = useState('all');

  // Songs list search filter in Songs tab
  const [songSearch, setSongSearch] = useState('');

  // Users list search filter
  const [userSearch, setUserSearch] = useState('');

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('+998');
  const [showAddUser, setShowAddUser] = useState(false);

  // Form state for adding song
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('Pop');
  const [audioUrl, setAudioUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [initialPlays, setInitialPlays] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload mode for add song
  const [uploadMode, setUploadMode] = useState('url'); // 'url' | 'file'
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverBase64, setCoverBase64] = useState('');
  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Sample MP3s and Covers for quick fill
  const sampleTracks = [
    {
      title: "Yomg'irlar",
      artist: "Ulug'bek Rahmatullayev",
      genre: "Pop",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",
    },
    {
      title: "Tun sirlari",
      artist: "Toshkent Beat",
      genre: "Electronic",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80",
    },
    {
      title: "Bahor nafasi",
      artist: "Sevara Nazir",
      genre: "Ethno",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      cover: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&q=80",
    },
  ];

  const handleFillSample = (sample) => {
    setTitle(sample.title);
    setArtist(sample.artist);
    setGenre(sample.genre);
    setAudioUrl(sample.audio);
    setCoverUrl(sample.cover);
  };

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err) {
      console.warn('Failed to get admin stats:', err);
      setErrorMsg(err.message || "Admin statistikasini yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getSongs();
      setSongsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load songs for admin:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.adminGetUsers();
      setUsersList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSessions = useCallback(() => {
    setSessionsLoading(true);
    try {
      const data = api.adminGetActiveSessions();
      setSessionsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load sessions:', err);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !isAdmin) return;
    if (activeTab === 'stats') fetchStats();
    if (activeTab === 'songs') fetchSongs();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'sessions') fetchSessions();
  }, [isOpen, isAdmin, activeTab, fetchStats, fetchSongs, fetchUsers, fetchSessions]);

  // Filtered songs in Songs tab
  const filteredSongs = useMemo(() => {
    if (!songSearch.trim()) return songsList;
    const term = songSearch.toLowerCase().trim();
    return songsList.filter(
      (s) =>
        s.title?.toLowerCase().includes(term) ||
        s.artist?.toLowerCase().includes(term) ||
        s.genre?.toLowerCase().includes(term)
    );
  }, [songsList, songSearch]);

  // Filtered users in Users tab
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return usersList;
    const term = userSearch.toLowerCase().trim();
    return usersList.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.phone?.toLowerCase().includes(term) ||
        u.username?.toLowerCase().includes(term)
    );
  }, [usersList, userSearch]);

  // Leaderboard songs sorted by plays descending
  const leaderboardSongs = useMemo(() => {
    const list = [...(stats?.top_songs || songsList)].sort(
      (a, b) => (b.plays || 0) - (a.plays || 0)
    );
    if (rankingFilter === 'top5') return list.slice(0, 5);
    if (rankingFilter === 'top10') return list.slice(0, 10);
    return list;
  }, [stats?.top_songs, songsList, rankingFilter]);

  const maxPlays = useMemo(() => {
    if (!leaderboardSongs || leaderboardSongs.length === 0) return 1;
    return Math.max(...leaderboardSongs.map((s) => s.plays || 0), 1);
  }, [leaderboardSongs]);

  // Top #1 song
  const topSong = stats?.top_song || leaderboardSongs[0] || null;

  // Early return if modal is not open
  if (!isOpen) return null;

  // Handle Admin Login submission (username: ulugbek, password: 19912008)
  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (onAdminLogin) {
      const res = onAdminLogin(loginUsername, loginPassword);
      if (res && res.success) {
        setLoginUsername('');
        setLoginPassword('');
        setSuccessMsg("Xush kelibsiz, Ulug'bek! Admin panelga muvaffaqiyatli kirdingiz.");
        fetchStats();
      } else {
        setLoginError(res?.error || "Login yoki parol noto'g'ri!");
      }
    }
  };

  // 1. ADD SONG HANDLER
  const handleAddSong = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title || !artist || !audioUrl) {
      setErrorMsg('Qo\'shiq nomi, Ijrochi va Audio URL kiritilishi shart!');
      return;
    }

    try {
      setIsSubmitting(true);
      const newSongData = {
        title,
        artist,
        genre: genre || 'Pop',
        audio_url: audioUrl,
        cover_url: coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80',
        plays: Number(initialPlays) || 0,
      };

      await api.adminAddSong(newSongData);
      setSuccessMsg(`"${title}" qo'shig'i muvaffaqiyatli qo'shildi!`);
      setTitle('');
      setArtist('');
      setGenre('Pop');
      setAudioUrl('');
      setCoverUrl('');
      setInitialPlays('0');
      resetFileUpload();

      if (onSongAdded) onSongAdded();
      fetchSongs();
      fetchStats();
    } catch (err) {
      setErrorMsg(err.message || "Qo'shiqni qo'shishda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. DELETE SONG HANDLER
  const handleDeleteSong = async (songId, songTitle) => {
    if (!window.confirm(`Rostdan ham "${songTitle || "bu qo'shiq"}"ni o'chirmoqchimisiz?`)) {
      return;
    }
    try {
      await api.adminDeleteSong(songId);
      setSongsList((prev) => prev.filter((s) => s.id !== songId));
      setSuccessMsg(`"${songTitle || "Qo'shiq"}" muvaffaqiyatli o'chirildi`);
      if (onSongDeleted) onSongDeleted(songId);
      fetchStats();
    } catch (err) {
      setErrorMsg(err.message || "O'chirishda xatolik yuz berdi");
    }
  };

  // 3. BLOCK / UNBLOCK USER HANDLER
  const handleToggleBlockUser = async (user) => {
    try {
      const updated = await api.adminBlockUser(user.id);
      const isNowBlocked = updated?.is_blocked ?? !user.is_blocked;
      setSuccessMsg(
        isNowBlocked
          ? `"${user.name}" foydalanuvchisi muvaffaqiyatli bloklandi`
          : `"${user.name}" foydalanuvchisi blokdan chiqarildi`
      );
      fetchUsers();
      fetchStats();
    } catch (err) {
      setErrorMsg(err.message || "Foydalanuvchi holatini o'zgartirishda xatolik");
    }
  };

  // Add new member handler
  const handleAddNewUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserPhone.trim()) {
      setErrorMsg("Ism va telefon raqam kiritilishi shart");
      return;
    }

    try {
      await api.adminAddUser({
        name: newUserName.trim(),
        phone: newUserPhone.trim(),
      });
      setSuccessMsg(`"${newUserName}" a'zo sifatida qo'shildi`);
      setNewUserName('');
      setNewUserPhone('+998');
      setShowAddUser(false);
      fetchUsers();
      fetchStats();
    } catch (err) {
      setErrorMsg(err.message || "A'zo qo'shishda xatolik");
    }
  };

  // File upload handlers for Add Song
  const handleAudioFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFile(file);
    // Create temporary blob URL for playback
    const blobUrl = URL.createObjectURL(file);
    setAudioUrl(blobUrl);
  };

  const handleCoverFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    // Read as base64 for persistent storage
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target.result;
      setCoverBase64(base64);
      setCoverUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const resetFileUpload = () => {
    setAudioFile(null);
    setCoverFile(null);
    setCoverBase64('');
    if (audioInputRef.current) audioInputRef.current.value = '';
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  // Session kick handlers
  const handleKickSession = (session) => {
    if (!window.confirm(`"${session.name}" foydalanuvchisini tizimdan chiqarib yubormoqchimisiz?`)) return;
    const result = api.adminKickSession(session.sessionId);
    if (result?.success) {
      setSuccessMsg(`"${session.name}" tizimdan chiqarib yuborildi`);
      fetchSessions();
    } else {
      setErrorMsg("Chiqarib yuborishda xatolik");
    }
  };

  const handleKickAll = () => {
    if (!window.confirm("Admin (siz) dan tashqari barcha foydalanuvchilarni tizimdan chiqarmoqchimisiz?")) return;
    const mySessionId = sessionManager.getMySessionId();
    const result = api.adminKickAllSessions(mySessionId);
    if (result?.success) {
      setSuccessMsg("Barcha foydalanuvchilar tizimdan chiqarib yuborildi");
      fetchSessions();
    } else {
      setErrorMsg("Chiqarib yuborishda xatolik");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-3xl p-5 sm:p-7 shadow-2xl border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ============================================================ */}
        {/* IF NOT LOGGED IN AS ADMIN: DISPLAY ADMIN SECURITY LOGIN GATE */}
        {/* ============================================================ */}
        {!isAdmin ? (
          <div className="py-6 px-2 sm:px-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Faqat Administrator Kirishi Mumkin
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mb-6 leading-relaxed">
              Ushbu bo'lim himoyalangan. Admin boshqaruv panelini faqat hisob egasi ko'rishi va boshqarishi mumkin.
            </p>

            {loginError && (
              <div className="w-full max-w-sm mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLoginSubmit} className="w-full max-w-sm space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Foydalanuvchi nomi (Username)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-neutral-400 font-mono text-sm">@</span>
                  <input
                    type="text"
                    placeholder="ulugbek"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-amber-500 outline-none transition-all font-medium"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Maxfiy parol
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-amber-500 outline-none transition-all font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Admin sifatida kirish</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400">
              Kirish: Username: <span className="font-mono font-semibold text-amber-500">ulugbek</span> | Parol: <span className="font-mono font-semibold text-amber-500">19912008</span>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* LOGGED IN ADMIN DASHBOARD VIEW                               */
          /* ============================================================ */
          <>
            {/* Header with Admin status and Logout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pr-8">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-amber-500/10 text-amber-500">
                    <ShieldAlert className="w-5 h-5" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Admin Boshqaruv Markazi
                  </h2>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Platformani to'liq boshqarish: musiqalar, eng ko'p tinglanganlar va a'zolar
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Ulug'bek (Admin)</span>
                </div>

                {onAdminLogout && (
                  <button
                    onClick={() => {
                      onAdminLogout();
                      setSuccessMsg('');
                      setErrorMsg('');
                    }}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Admin rejimidan chiqish"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl mb-4 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  activeTab === 'stats'
                    ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>TOP Taronalar & Statistika</span>
              </button>

              <button
                onClick={() => setActiveTab('add')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  activeTab === 'add'
                    ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Qo'shiq qo'shish</span>
              </button>

              <button
                onClick={() => setActiveTab('songs')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  activeTab === 'songs'
                    ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Qo'shiqlar & O'chirish ({songsList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  activeTab === 'users'
                    ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>A'zolar & Bloklash ({usersList.length})</span>
              </button>
              <button
                onClick={() => { setActiveTab('sessions'); fetchSessions(); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  activeTab === 'sessions'
                    ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <Wifi className="w-4 h-4" />
                <span>Faol Sessiyalar ({sessionsList.length})</span>
              </button>
            </div>

            {/* Notification Alerts */}
            {errorMsg && (
              <div className="mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <button onClick={() => setErrorMsg('')} className="p-0.5 hover:opacity-75">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {successMsg && (
              <div className="mb-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
                <button onClick={() => setSuccessMsg('')} className="p-0.5 hover:opacity-75">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-neutral-400 shrink-0">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Ma'lumotlar yangilanmoqda...</span>
              </div>
            )}

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto pr-1">
              {/* ======================================================== */}
              {/* TAB 1: STATS & MOST PLAYED SONGS (TOP TARONALAR)         */}
              {/* ======================================================== */}
              {activeTab === 'stats' && (
                <div className="space-y-5">
                  {/* Summary metric cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Music className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">Jami taronalar</p>
                        <h3 className="text-lg font-bold">{stats?.total_songs ?? songsList.length}</h3>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                        <Headphones className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">Jami tinglashlar</p>
                        <h3 className="text-lg font-bold">{stats?.total_plays ?? stats?.plays ?? 0}</h3>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">Foydalanuvchilar</p>
                        <h3 className="text-lg font-bold">{stats?.total_users ?? usersList.length}</h3>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                        <UserX className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">Bloklangan a'zolar</p>
                        <h3 className="text-lg font-bold">{stats?.blocked_users ?? 0}</h3>
                      </div>
                    </div>
                  </div>

                  {/* SPOTLIGHT: 1-O'RIN - ENG KO'P TINGLANGAN QO'SHIQ */}
                  {topSong && (
                    <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 dark:border-amber-500/20 relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-md">
                            <ArtworkImage
                              src={topSong.cover_url}
                              alt={topSong.title}
                              songId={topSong.id}
                              title={topSong.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow">
                              <Crown className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                              <Flame className="w-3 h-3 text-amber-500" />
                              <span>1-O'rin — Eng ko'p tinglangan tarona</span>
                            </div>
                            <h3 className="text-lg font-extrabold tracking-tight truncate max-w-xs sm:max-w-md">
                              {topSong.title}
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {topSong.artist} • <span className="font-semibold text-emerald-500">{topSong.genre}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                          <div className="text-left sm:text-right">
                            <span className="text-2xl font-black text-amber-500">
                              {topSong.plays || 0}
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">
                              marta tinglandi
                            </span>
                          </div>

                          {onPlaySong && (
                            <button
                              onClick={() => onPlaySong(topSong)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Tinglab ko'rish</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Leaderboard Table / Rankings */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-500" />
                        <h4 className="text-sm font-bold">
                          Eng Ko'p Tinglangan Qo'shiqlar Reytingi
                        </h4>
                      </div>

                      <div className="flex items-center p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-[11px]">
                        <button
                          onClick={() => setRankingFilter('top5')}
                          className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                            rankingFilter === 'top5'
                              ? 'bg-white dark:bg-neutral-900 text-emerald-500 shadow-sm font-bold'
                              : 'text-neutral-500'
                          }`}
                        >
                          Top 5
                        </button>
                        <button
                          onClick={() => setRankingFilter('top10')}
                          className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                            rankingFilter === 'top10'
                              ? 'bg-white dark:bg-neutral-900 text-emerald-500 shadow-sm font-bold'
                              : 'text-neutral-500'
                          }`}
                        >
                          Top 10
                        </button>
                        <button
                          onClick={() => setRankingFilter('all')}
                          className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                            rankingFilter === 'all'
                              ? 'bg-white dark:bg-neutral-900 text-emerald-500 shadow-sm font-bold'
                              : 'text-neutral-500'
                          }`}
                        >
                          Barchasi ({leaderboardSongs.length})
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {leaderboardSongs.map((song, idx) => {
                        const playPercentage = Math.round(((song.plays || 0) / maxPlays) * 100);
                        const isTop1 = idx === 0;
                        const isTop2 = idx === 1;
                        const isTop3 = idx === 2;

                        return (
                          <div
                            key={song.id}
                            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                              isTop1
                                ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30'
                                : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200/70 dark:border-neutral-800'
                            }`}
                          >
                            {/* Rank Badge */}
                            <div className="w-7 text-center shrink-0">
                              {isTop1 ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black shadow-sm">
                                  1
                                </span>
                              ) : isTop2 ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-400 text-white text-xs font-black shadow-sm">
                                  2
                                </span>
                              ) : isTop3 ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black shadow-sm">
                                  3
                                </span>
                              ) : (
                                <span className="text-xs font-semibold text-neutral-400">
                                  #{idx + 1}
                                </span>
                              )}
                            </div>

                            {/* Cover */}
                            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-sm">
                              <ArtworkImage
                                src={song.cover_url}
                                alt={song.title}
                                songId={song.id}
                                title={song.title}
                                size="sm"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Info & Progress bar */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h5 className="text-xs sm:text-sm font-bold truncate">
                                  {song.title}
                                </h5>
                                <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 shrink-0">
                                  {song.plays || 0} tinglash
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-neutral-500 truncate">
                                  {song.artist} • <span className="text-neutral-400">{song.genre}</span>
                                </span>
                              </div>

                              {/* Popularity Progress Bar */}
                              <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full mt-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    isTop1
                                      ? 'bg-amber-500'
                                      : isTop2
                                      ? 'bg-emerald-500'
                                      : 'bg-emerald-400/80'
                                  }`}
                                  style={{ width: `${Math.max(playPercentage, 4)}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Play button */}
                            {onPlaySong && (
                              <button
                                onClick={() => onPlaySong(song)}
                                className="p-2 rounded-xl text-neutral-400 hover:text-emerald-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors shrink-0"
                                title="Tinglash"
                              >
                                <Play className="w-4 h-4 fill-current" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: ADD SONG (QO'SHIQ QO'SHISH)                       */}
              {/* ======================================================== */}
              {activeTab === 'add' && (
                <div className="space-y-4">
                  {/* Upload mode toggle */}
                  <div className="flex items-center gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs mb-2">
                    <button
                      type="button"
                      onClick={() => { setUploadMode('url'); setAudioFile(null); resetFileUpload(); }}
                      className={`flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg font-semibold transition-all ${
                        uploadMode === 'url'
                          ? 'bg-white dark:bg-neutral-900 text-emerald-600 shadow-sm'
                          : 'text-neutral-500'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>URL orqali</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setUploadMode('file'); setAudioUrl(''); setCoverUrl(''); }}
                      className={`flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg font-semibold transition-all ${
                        uploadMode === 'file'
                          ? 'bg-white dark:bg-neutral-900 text-blue-600 shadow-sm'
                          : 'text-neutral-500'
                      }`}
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Papkadan yuklash</span>
                    </button>
                  </div>
                  {/* Quick sample fillers */}
                  <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tezkor namunaviy qo'shiqlar (Tez to'ldirish uchun bosing):</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sampleTracks.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleFillSample(sample)}
                          className="px-2.5 py-1 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm"
                        >
                          + {sample.title} ({sample.artist})
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleAddSong} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                          Qo'shiq nomi *
                        </label>
                        <input
                          type="text"
                          placeholder="Masalan: Bahor kelur"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-emerald-500 outline-none transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                          Ijrochi / Muallif *
                        </label>
                        <input
                          type="text"
                          placeholder="Masalan: Ulug'bek Rahmatullayev"
                          value={artist}
                          onChange={(e) => setArtist(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-emerald-500 outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                          Janr
                        </label>
                        <select
                          value={genre}
                          onChange={(e) => setGenre(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-emerald-500 outline-none transition-all cursor-pointer"
                        >
                          <option value="Pop">Pop</option>
                          <option value="Electronic">Electronic</option>
                          <option value="Lo-Fi">Lo-Fi</option>
                          <option value="Ethno">Ethno</option>
                          <option value="Rock">Rock</option>
                          <option value="Jazz">Jazz</option>
                          <option value="Chill">Chill</option>
                          <option value="Hip-Hop">Hip-Hop</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                          Boshlang'ich tinglashlar soni (ixtiyoriy)
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          value={initialPlays}
                          onChange={(e) => setInitialPlays(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      {uploadMode === 'url' ? (
                        <>
                          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                            Audio URL (MP3 to&apos;g&apos;ridan-to&apos;g&apos;ri havola) *
                          </label>
                          <input
                            type="url"
                            placeholder="https://example.com/audio.mp3"
                            value={audioUrl}
                            onChange={(e) => setAudioUrl(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-emerald-500 outline-none font-mono text-xs transition-all"
                            required={uploadMode === 'url'}
                          />
                        </>
                      ) : (
                        <>
                          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                            <FileAudio className="w-3.5 h-3.5 inline mr-1" />
                            Audio fayl (MP3, WAV, OGG) *
                          </label>
                          <div
                            className="w-full px-3.5 py-3 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-blue-500 cursor-pointer transition-all flex items-center gap-3"
                            onClick={() => audioInputRef.current?.click()}
                          >
                            <FolderOpen className="w-5 h-5 text-blue-500 shrink-0" />
                            <div className="min-w-0">
                              {audioFile ? (
                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate">{audioFile.name}</p>
                              ) : (
                                <p className="text-xs text-neutral-400">Fayl tanlash uchun bosing...</p>
                              )}
                              <p className="text-[10px] text-neutral-400 mt-0.5">MP3, WAV, OGG</p>
                            </div>
                          </div>
                          <input
                            ref={audioInputRef}
                            type="file"
                            accept=".mp3,.wav,.ogg,audio/*"
                            onChange={handleAudioFileSelect}
                            className="hidden"
                            required={uploadMode === 'file' && !audioFile}
                          />
                          {audioFile && (
                            <p className="text-[10px] text-amber-500 mt-1">
                              ⚠ Fayl joriy sessiyada ishlaydi. Sahifa yangilansa audio URL qayta yuklanishi kerak.
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <div>
                      {uploadMode === 'url' ? (
                        <>
                          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                            Muqova rasm URL (Cover rasm)
                          </label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-emerald-500 outline-none font-mono text-xs transition-all"
                          />
                        </>
                      ) : (
                        <>
                          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                            <ImageIcon className="w-3.5 h-3.5 inline mr-1" />
                            Muqova rasm (JPG, PNG, WebP)
                          </label>
                          <div
                            className="w-full px-3.5 py-3 rounded-xl text-sm bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-blue-500 cursor-pointer transition-all flex items-center gap-3"
                            onClick={() => coverInputRef.current?.click()}
                          >
                            {coverBase64 ? (
                              <img src={coverBase64} alt="cover preview" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-blue-500 shrink-0" />
                            )}
                            <div className="min-w-0">
                              {coverFile ? (
                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate">{coverFile.name}</p>
                              ) : (
                                <p className="text-xs text-neutral-400">Muqova rasm tanlash...</p>
                              )}
                              <p className="text-[10px] text-neutral-400 mt-0.5">JPG, PNG, WebP</p>
                            </div>
                          </div>
                          <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCoverFileSelect}
                            className="hidden"
                          />
                        </>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isSubmitting ? "Saqlanmoqda..." : "Qo'shiqni saqlash va platformaga chiqarish"}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: SONGS LIST & DELETE (QO'SHIQLAR VA O'CHIRISH)     */}
              {/* ======================================================== */}
              {activeTab === 'songs' && (
                <div className="space-y-3">
                  {/* Search inside songs */}
                  <div className="relative flex items-center">
                    <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Qo'shiqlar orasidan qidirish..."
                      value={songSearch}
                      onChange={(e) => setSongSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredSongs.length === 0 ? (
                      <p className="text-xs text-neutral-400 text-center py-8">
                        Qo'shiq topilmadi.
                      </p>
                    ) : (
                      filteredSongs.map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-sm">
                              <ArtworkImage
                                src={song.cover_url}
                                alt={song.title}
                                songId={song.id}
                                title={song.title}
                                size="sm"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs sm:text-sm font-bold truncate">
                                {song.title}
                              </h4>
                              <p className="text-[11px] text-neutral-500 truncate">
                                {song.artist} • <span className="text-emerald-500 font-medium">{song.genre}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-neutral-400 font-mono bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg">
                              {song.plays || 0} tinglash
                            </span>

                            {onPlaySong && (
                              <button
                                onClick={() => onPlaySong(song)}
                                className="p-2 rounded-xl text-neutral-500 hover:text-emerald-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                title="Tinglash"
                              >
                                <Play className="w-4 h-4 fill-current" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteSong(song.id, song.title)}
                              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Qo'shiqni o'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: USERS & BLOCK MANAGEMENT (A'ZOLAR VA BLOKLASH)     */}
              {/* ======================================================== */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  {/* Search and Add User toggle */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 flex items-center">
                      <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="A'zoni ism yoki telefon raqami bo'yicha qidirish..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <button
                      onClick={() => setShowAddUser(!showAddUser)}
                      className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors shrink-0"
                    >
                      {showAddUser ? 'Bekor qilish' : "+ A'zo qo'shish"}
                    </button>
                  </div>

                  {/* Add user form */}
                  {showAddUser && (
                    <form
                      onSubmit={handleAddNewUser}
                      className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3 animate-fade-in"
                    >
                      <h5 className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                        Yangi foydalanuvchi / a'zo ro'yxatga olish:
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Ism va familiya"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-emerald-500"
                          required
                        />
                        <input
                          type="text"
                          placeholder="+998901234567"
                          value={newUserPhone}
                          onChange={(e) => setNewUserPhone(e.target.value)}
                          className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-emerald-500 font-mono"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        A'zo qo'shish
                      </button>
                    </form>
                  )}

                  {/* Members list with Block / Unblock actions */}
                  <div className="space-y-2">
                    {filteredUsers.length === 0 ? (
                      <p className="text-xs text-neutral-400 text-center py-8">
                        Foydalanuvchi topilmadi.
                      </p>
                    ) : (
                      filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                            u.is_blocked
                              ? 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20'
                              : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200/70 dark:border-neutral-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Avatar */}
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                                u.is_blocked
                                  ? 'bg-rose-500/10 text-rose-500'
                                  : 'bg-emerald-500/10 text-emerald-500'
                              }`}
                            >
                              {u.is_blocked ? (
                                <UserX className="w-5 h-5" />
                              ) : (
                                <UserCheck className="w-5 h-5" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-bold truncate">
                                  {u.name || 'Nomsiz foydalanuvchi'}
                                </h4>
                                {u.is_blocked ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 text-[10px] font-bold">
                                    Bloklangan
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">
                                    Faol
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-500 font-mono truncate">
                                {u.phone} {u.username ? `• @${u.username}` : ''}
                              </p>
                            </div>
                          </div>

                          {/* Block / Unblock Action Button */}
                          <button
                            onClick={() => handleToggleBlockUser(u)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                              u.is_blocked
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                                : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40'
                            }`}
                          >
                            {u.is_blocked ? (
                              <>
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Blokdan chiqarish</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Bloklash</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}


              {/* ======================================================== */}
              {/* TAB 5: ACTIVE SESSIONS (FAOL SESSIYALAR)                  */}
              {/* ======================================================== */}
              {activeTab === 'sessions' && (
                <div className="space-y-4">
                  {/* Header with counts and kick all button */}
                  <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <Wifi className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Hozir tizimda</p>
                        <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400">{sessionsList.length}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={fetchSessions}
                        className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-300 transition-all"
                      >
                        Yangilash
                      </button>
                      {sessionsList.filter(s => !s.is_admin).length > 0 && (
                        <button
                          onClick={handleKickAll}
                          className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-all shadow-sm shadow-rose-500/20 flex items-center gap-1.5"
                        >
                          <WifiOff className="w-3.5 h-3.5" />
                          <span>Barchasini chiqar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sessions list */}
                  {sessionsLoading ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-xs text-neutral-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Yuklanmoqda...</span>
                    </div>
                  ) : sessionsList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
                      <WifiOff className="w-10 h-10 mb-3 opacity-30" />
                      <p className="text-sm font-medium">Faol sessiya yo'q</p>
                      <p className="text-xs mt-1 opacity-70">Hech kim tizimga kirmagan</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sessionsList.map((session) => {
                        const loginTime = new Date(session.loginAt);
                        const lastActive = new Date(session.lastActive);
                        const minutesAgo = Math.floor((Date.now() - lastActive.getTime()) / 60000);
                        const isMe = session.sessionId === sessionManager.getMySessionId();

                        return (
                          <div
                            key={session.sessionId}
                            className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                              session.is_admin
                                ? 'bg-amber-500/5 border-amber-500/20'
                                : isMe
                                ? 'bg-blue-500/5 border-blue-500/20'
                                : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200/70 dark:border-neutral-800'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                session.is_admin ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                              }`}>
                                {session.is_admin ? <ShieldAlert className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-xs sm:text-sm font-bold truncate">{session.name}</h4>
                                  {session.is_admin && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold">Admin</span>
                                  )}
                                  {isMe && (
                                    <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[10px] font-bold">Siz</span>
                                  )}
                                  <span className="flex items-center gap-1 text-[10px] text-emerald-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                                    Faol ({minutesAgo < 1 ? 'Hozir' : minutesAgo + ' daq oldin'})
                                  </span>
                                </div>
                                <p className="text-[11px] text-neutral-500 font-mono truncate">
                                  {session.phone || session.username || session.userId}
                                </p>
                                <p className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3" />
                                  Kirdi: {loginTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })} — {loginTime.toLocaleDateString('uz-UZ')}
                                </p>
                              </div>
                            </div>

                            {/* Kick button */}
                            {!isMe && (
                              <button
                                onClick={() => handleKickSession(session)}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40"
                                title="Chiqarib yuborish"
                              >
                                <UserMinus className="w-3.5 h-3.5" />
                                <span>Chiqarib yuborish</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
