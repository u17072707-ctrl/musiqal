/**
 * API Service for MusicUz Backend
 * Backend URL is securely loaded from environment variables (VITE_API_BASE_URL).
 * Enhanced with persistent LocalStorage fallback for Admin features (Songs, Top Plays, Members & Blocking).
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://music-l8kd.onrender.com';

export const getBaseUrl = () => BASE_URL;

// Helper to get stored auth token
export const getStoredToken = () => {
  try {
    return localStorage.getItem('musicuz_token') || '';
  } catch {
    return '';
  }
};

// Helper to normalize cover images
export const normalizeCoverUrl = (coverUrl) => {
  if (!coverUrl) return '';
  if (coverUrl.startsWith('http://') || coverUrl.startsWith('https://') || coverUrl.startsWith('data:')) {
    return coverUrl;
  }
  if (coverUrl.startsWith('/')) {
    return `${BASE_URL}${coverUrl}`;
  }
  return `${BASE_URL}/${coverUrl}`;
};

// Common fetch wrapper with timeout
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const token = getStoredToken();

  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMsg = data?.detail?.error || data?.detail || data?.message || `So'rovda xatolik: ${response.status}`;
      const error = new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ==========================================
// Fallback Data & Persistent Storage Helpers
// ==========================================

const STORAGE_KEYS = {
  CUSTOM_SONGS: 'musicuz_custom_songs',
  DELETED_SONGS: 'musicuz_deleted_songs',
  SONG_PLAYS: 'musicuz_song_plays',
  USERS_LIST: 'musicuz_users_list',
};

export const DEFAULT_FALLBACK_SONGS = [
  {
    id: 12,
    title: "Yomg'ir",
    artist: "Malika Lo-Fi",
    genre: "Lo-Fi",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    cover_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
    plays: 14,
    created_at: "2026-11-07T07:32:58.935882",
    likes: 5,
    liked: false,
    saved: false,
  },
  {
    id: 11,
    title: "Neon",
    artist: "Aziz Beats",
    genre: "Electronic",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    cover_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",
    plays: 8,
    created_at: "2026-11-07T07:32:58.935882",
    likes: 3,
    liked: false,
    saved: false,
  },
  {
    id: 10,
    title: "Cho'l yo'li",
    artist: "Silk Road",
    genre: "Ethno",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    cover_url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&q=80",
    plays: 7,
    created_at: "2026-11-07T07:32:58.935882",
    likes: 4,
    liked: false,
    saved: false,
  },
  {
    id: 9,
    title: "Orzular",
    artist: "Sevara Pop",
    genre: "Pop",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    cover_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80",
    plays: 6,
    created_at: "2026-11-07T07:32:58.935882",
    likes: 2,
    liked: false,
    saved: false,
  },
  {
    id: 8,
    title: "Oqshom",
    artist: "Javlon Jazz",
    genre: "Jazz",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    cover_url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&q=80",
    plays: 4,
    created_at: "2026-11-07T07:32:58.935882",
    likes: 1,
    liked: false,
    saved: false,
  },
  {
    id: 7,
    title: "Ritm",
    artist: "DJ Toshkent",
    genre: "Electronic",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    cover_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80",
    plays: 5,
    created_at: "2026-11-07T07:32:58.935882",
    likes: 3,
    liked: false,
    saved: false,
  },
  {
    id: 6,
    title: "Sokin tong",
    artist: "Malika Lo-Fi",
    genre: "Lo-Fi",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    cover_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
    plays: 3,
    created_at: "2026-11-07T07:32:58.935882",
    likes: 1,
    liked: false,
    saved: false,
  },
  {
    id: 5,
    title: "Tog' qo'shig'i",
    artist: "Chimyon Band",
    genre: "Rock",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    cover_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80",
    plays: 4,
    created_at: "2026-11-07T07:32:58.935882",
    likes: 2,
    liked: false,
    saved: false,
  },
  {
    id: 4,
    title: "Bahor kelur",
    artist: "Lola Sound",
    genre: "Pop",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover_url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80",
    plays: 2,
    created_at: "2026-11-07T07:32:58.935882",
    likes: 0,
    liked: false,
    saved: false,
  },
  {
    id: 3,
    title: "Yulduzlar ostida",
    artist: "Nodir Wave",
    genre: "Chill",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&q=80",
    plays: 3,
    created_at: "2026-11-07T07:32:58.935882",
    likes: 1,
    liked: false,
    saved: false,
  },
  {
    id: 2,
    title: "Samarqand shamoli",
    artist: "Silk Road",
    genre: "Ethno",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80",
    plays: 5,
    created_at: "2026-11-07T07:32:58.935882",
    likes: 2,
    liked: false,
    saved: false,
  },
  {
    id: 1,
    title: "Tungi shahar",
    artist: "Aziz Beats",
    genre: "Electronic",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80",
    plays: 9,
    created_at: "2026-11-07T07:32:58.935882",
    likes: 4,
    liked: false,
    saved: false,
  },
];

export const DEFAULT_USERS = [
  {
    id: 1,
    name: "Jasur Karimov",
    phone: "+998901234567",
    username: "jasur_k",
    created_at: "2026-10-12",
    is_blocked: false,
  },
  {
    id: 2,
    name: "Sardor Aliyev",
    phone: "+998912345678",
    username: "sardor_a",
    created_at: "2026-10-18",
    is_blocked: false,
  },
  {
    id: 3,
    name: "Madina Usmanova",
    phone: "+998933456789",
    username: "madina_u",
    created_at: "2026-10-25",
    is_blocked: false,
  },
  {
    id: 4,
    name: "Bobur Mirzayev",
    phone: "+998944567890",
    username: "bobur_m",
    created_at: "2026-11-01",
    is_blocked: false,
  },
  {
    id: 5,
    name: "Nilufar Qosimova",
    phone: "+998975678901",
    username: "nilufar_q",
    created_at: "2026-11-05",
    is_blocked: true,
  },
];

function getStoredJson(key, defaultValue) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStoredJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save to localStorage (${key}):`, err);
  }
}

// API methods
export const api = {
  // Public Config & Genres
  getConfig: async () => {
    try {
      return await request('/api/config');
    } catch {
      return {
        bot: 'cidid_bot',
        name: 'MusicUz',
        title: 'Musiqa portali',
        version: '1.0.0',
      };
    }
  },

  getGenres: async () => {
    try {
      const data = await request('/api/genres');
      return Array.isArray(data) && data.length > 0 ? data : [
        { id: 1, name: 'Pop', icon: 'Sparkles', count: 4 },
        { id: 2, name: 'Electronic', icon: 'Zap', count: 3 },
        { id: 3, name: 'Lo-Fi', icon: 'Coffee', count: 2 },
        { id: 4, name: 'Ethno', icon: 'Globe', count: 2 },
        { id: 5, name: 'Rock', icon: 'Flame', count: 1 },
        { id: 6, name: 'Jazz', icon: 'Disc', count: 1 },
        { id: 7, name: 'Chill', icon: 'Moon', count: 1 },
      ];
    } catch {
      return [
        { id: 1, name: 'Pop', icon: 'Sparkles', count: 4 },
        { id: 2, name: 'Electronic', icon: 'Zap', count: 3 },
        { id: 3, name: 'Lo-Fi', icon: 'Coffee', count: 2 },
        { id: 4, name: 'Ethno', icon: 'Globe', count: 2 },
        { id: 5, name: 'Rock', icon: 'Flame', count: 1 },
        { id: 6, name: 'Jazz', icon: 'Disc', count: 1 },
        { id: 7, name: 'Chill', icon: 'Moon', count: 1 },
      ];
    }
  },

  // Songs with seamless LocalStorage synchronization
  getSongs: async (params = {}) => {
    let rawSongs = [];

    try {
      const query = new URLSearchParams();
      if (params.q) query.set('q', params.q);
      if (params.genre && params.genre !== 'All' && params.genre !== 'Barchasi') {
        query.set('genre', params.genre);
      }
      if (params.sort) query.set('sort', params.sort);
      const queryString = query.toString();

      const data = await request(`/api/songs${queryString ? `?${queryString}` : ''}`);
      if (Array.isArray(data) && data.length > 0) {
        rawSongs = data;
      } else {
        rawSongs = [...DEFAULT_FALLBACK_SONGS];
      }
    } catch (err) {
      console.warn('API getSongs failed, falling back to local dataset:', err);
      rawSongs = [...DEFAULT_FALLBACK_SONGS];
    }

    // Merge custom added songs
    const customSongs = getStoredJson(STORAGE_KEYS.CUSTOM_SONGS, []);
    const deletedSongIds = new Set(getStoredJson(STORAGE_KEYS.DELETED_SONGS, []));
    const songPlays = getStoredJson(STORAGE_KEYS.SONG_PLAYS, {});

    // Combine custom songs and base songs (deduplicating by ID)
    const combinedMap = new Map();
    // Put custom songs first
    customSongs.forEach((song) => {
      if (!deletedSongIds.has(song.id)) {
        combinedMap.set(song.id, {
          ...song,
          plays: songPlays[song.id] !== undefined ? Math.max(song.plays || 0, songPlays[song.id]) : (song.plays || 0),
        });
      }
    });

    // Add raw backend songs
    rawSongs.forEach((song) => {
      if (!deletedSongIds.has(song.id) && !combinedMap.has(song.id)) {
        combinedMap.set(song.id, {
          ...song,
          plays: songPlays[song.id] !== undefined ? Math.max(song.plays || 0, songPlays[song.id]) : (song.plays || 0),
        });
      }
    });

    let songs = Array.from(combinedMap.values());

    // Filter by search query if applicable
    if (params.q) {
      const term = params.q.toLowerCase().trim();
      songs = songs.filter(
        (s) =>
          s.title?.toLowerCase().includes(term) ||
          s.artist?.toLowerCase().includes(term) ||
          s.genre?.toLowerCase().includes(term)
      );
    }

    // Filter by genre
    if (params.genre && params.genre !== 'All' && params.genre !== 'Barchasi') {
      songs = songs.filter((s) => s.genre?.toLowerCase() === params.genre.toLowerCase());
    }

    // Sort songs
    if (params.sort === 'plays' || params.sort === 'popular') {
      songs.sort((a, b) => (b.plays || 0) - (a.plays || 0));
    } else if (params.sort === 'new') {
      songs.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (params.sort === 'likes') {
      songs.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (params.sort === 'title') {
      songs.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return songs;
  },

  recordPlay: async (songId) => {
    // 1. Immediately increment local play count in localStorage
    const songPlays = getStoredJson(STORAGE_KEYS.SONG_PLAYS, {});
    songPlays[songId] = (songPlays[songId] || 0) + 1;
    setStoredJson(STORAGE_KEYS.SONG_PLAYS, songPlays);

    // Also update custom songs if applicable
    const customSongs = getStoredJson(STORAGE_KEYS.CUSTOM_SONGS, []);
    const updatedCustom = customSongs.map((s) =>
      s.id === songId ? { ...s, plays: (s.plays || 0) + 1 } : s
    );
    setStoredJson(STORAGE_KEYS.CUSTOM_SONGS, updatedCustom);

    // 2. Try recording on server
    try {
      return await request(`/api/songs/${songId}/play`, { method: 'POST' });
    } catch (err) {
      console.warn('Server play recording skipped, saved locally:', err);
      return { success: true, plays: songPlays[songId] };
    }
  },

  toggleLike: (songId) => request(`/api/songs/${songId}/like`, { method: 'POST' }),

  toggleSave: (songId) => request(`/api/songs/${songId}/save`, { method: 'POST' }),

  // Auth
  requestCode: (phone, mode = 'login') =>
    request('/api/auth/request-code', {
      method: 'POST',
      body: JSON.stringify({ phone, mode }),
    }),

  verifyCode: (phone, code, name = '') =>
    request('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, code, name }),
    }),

  // User profile & personal library
  getMe: () => request('/api/me'),
  updateMe: (name) =>
    request('/api/me', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),
  getMeLikes: () => request('/api/me/likes'),
  getMeSaved: () => request('/api/me/saved'),
  getMeHistory: () => request('/api/me/history'),

  // ==========================================
  // Admin APIs (Qo'shiq qo'shish, o'chirish, statistika, foydalanuvchilar va bloklash)
  // ==========================================

  getAdminStats: async () => {
    // Fetch all active songs to calculate up-to-date accurate statistics
    const songs = await api.getSongs();
    const users = await api.adminGetUsers();

    const totalPlays = songs.reduce((sum, s) => sum + (s.plays || 0), 0);
    const blockedCount = users.filter((u) => u.is_blocked).length;

    // Sort songs by plays descending to accurately find top played tracks
    const sortedSongsByPlays = [...songs].sort((a, b) => (b.plays || 0) - (a.plays || 0));
    const topSong = sortedSongsByPlays[0] || null;

    return {
      total_songs: songs.length,
      songs: songs.length,
      total_plays: totalPlays,
      plays: totalPlays,
      total_users: users.length,
      users: users.length,
      blocked_users: blockedCount,
      top_song: topSong,
      top_songs: sortedSongsByPlays.slice(0, 10),
    };
  },

  adminAddSong: async (formDataOrData) => {
    let title = '';
    let artist = '';
    let genre = 'Pop';
    let audio_url = '';
    let cover_url = '';
    let plays = 0;

    if (formDataOrData instanceof FormData) {
      title = formDataOrData.get('title') || '';
      artist = formDataOrData.get('artist') || '';
      genre = formDataOrData.get('genre') || 'Pop';
      audio_url = formDataOrData.get('audio_url') || '';
      cover_url = formDataOrData.get('cover_url') || '';
      plays = Number(formDataOrData.get('plays') || 0);
    } else if (typeof formDataOrData === 'object') {
      title = formDataOrData.title || '';
      artist = formDataOrData.artist || '';
      genre = formDataOrData.genre || 'Pop';
      audio_url = formDataOrData.audio_url || '';
      cover_url = formDataOrData.cover_url || '';
      plays = Number(formDataOrData.plays || 0);
    }

    const newSong = {
      id: 'custom_' + Date.now(),
      title,
      artist,
      genre,
      audio_url,
      cover_url: cover_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80',
      plays: plays || 0,
      created_at: new Date().toISOString(),
      likes: 0,
      liked: false,
      saved: false,
    };

    // Save to LocalStorage custom songs
    const customSongs = getStoredJson(STORAGE_KEYS.CUSTOM_SONGS, []);
    customSongs.unshift(newSong);
    setStoredJson(STORAGE_KEYS.CUSTOM_SONGS, customSongs);

    // If initial plays specified, register in songPlays
    if (plays > 0) {
      const songPlays = getStoredJson(STORAGE_KEYS.SONG_PLAYS, {});
      songPlays[newSong.id] = plays;
      setStoredJson(STORAGE_KEYS.SONG_PLAYS, songPlays);
    }

    // Try posting to backend if reachable
    try {
      const isForm = formDataOrData instanceof FormData;
      await request('/api/admin/songs', {
        method: 'POST',
        body: isForm ? formDataOrData : JSON.stringify(formDataOrData),
      });
    } catch (err) {
      console.warn('Backend song add skipped or failed, saved locally:', err);
    }

    return newSong;
  },

  adminDeleteSong: async (songId) => {
    // 1. Add to deleted song IDs in LocalStorage
    const deletedIds = getStoredJson(STORAGE_KEYS.DELETED_SONGS, []);
    if (!deletedIds.includes(songId)) {
      deletedIds.push(songId);
      setStoredJson(STORAGE_KEYS.DELETED_SONGS, deletedIds);
    }

    // 2. Also remove from custom songs if present
    const customSongs = getStoredJson(STORAGE_KEYS.CUSTOM_SONGS, []);
    const filteredCustom = customSongs.filter((s) => s.id !== songId);
    setStoredJson(STORAGE_KEYS.CUSTOM_SONGS, filteredCustom);

    // 3. Try deleting on backend
    try {
      await request(`/api/admin/songs/${songId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Backend song delete skipped or failed, deleted locally:', err);
    }

    return { success: true };
  },

  adminGetUsers: async () => {
    // Try backend first
    try {
      const data = await request('/api/admin/users');
      if (Array.isArray(data) && data.length > 0) {
        // Sync with local blocked status if needed
        return data;
      }
    } catch {
      // Backend unavailable or 401
    }

    // Return stored users list from LocalStorage
    let users = getStoredJson(STORAGE_KEYS.USERS_LIST, null);
    if (!users || !Array.isArray(users) || users.length === 0) {
      users = [...DEFAULT_USERS];
      setStoredJson(STORAGE_KEYS.USERS_LIST, users);
    }
    return users;
  },

  adminBlockUser: async (userId) => {
    const users = await api.adminGetUsers();
    let updatedUser = null;

    const newUsers = users.map((u) => {
      if (u.id === userId || String(u.id) === String(userId)) {
        updatedUser = { ...u, is_blocked: !u.is_blocked };
        return updatedUser;
      }
      return u;
    });

    setStoredJson(STORAGE_KEYS.USERS_LIST, newUsers);

    // Try backend
    try {
      await request(`/api/admin/users/${userId}/block`, {
        method: 'POST',
      });
    } catch (err) {
      console.warn('Backend user block skipped or failed, updated locally:', err);
    }

    return updatedUser;
  },

  adminAddUser: async (userData) => {
    const users = await api.adminGetUsers();
    const newUser = {
      id: Date.now(),
      name: userData.name || 'Yangi foydalanuvchi',
      phone: userData.phone || '+998900000000',
      username: userData.username || `user_${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString().split('T')[0],
      is_blocked: false,
    };
    users.unshift(newUser);
    setStoredJson(STORAGE_KEYS.USERS_LIST, users);
    return newUser;
  },

  checkIsUserBlocked: (phoneOrUsername) => {
    if (!phoneOrUsername) return false;
    const users = getStoredJson(STORAGE_KEYS.USERS_LIST, DEFAULT_USERS);
    const cleanQuery = phoneOrUsername.toLowerCase().trim();
    return users.some(
      (u) =>
        (u.phone?.toLowerCase().trim() === cleanQuery ||
          u.username?.toLowerCase().trim() === cleanQuery) &&
        u.is_blocked
    );
  },

  // ==========================================
  // Active Sessions Management (Admin)
  // ==========================================
  adminGetActiveSessions: () => {
    try {
      const sessions = JSON.parse(localStorage.getItem('musicuz_active_sessions') || '[]');
      return sessions.sort((a, b) => new Date(b.loginAt) - new Date(a.loginAt));
    } catch { return []; }
  },

  adminKickSession: (sessionId) => {
    try {
      const sessions = JSON.parse(localStorage.getItem('musicuz_active_sessions') || '[]');
      const filtered = sessions.filter((s) => s.sessionId !== sessionId);
      localStorage.setItem('musicuz_active_sessions', JSON.stringify(filtered));
      const kicked = JSON.parse(localStorage.getItem('musicuz_kicked_sessions') || '[]');
      if (!kicked.includes(sessionId)) kicked.push(sessionId);
      localStorage.setItem('musicuz_kicked_sessions', JSON.stringify(kicked));
      return { success: true };
    } catch { return { success: false }; }
  },

  adminKickAllSessions: (excludeSessionId) => {
    try {
      const sessions = JSON.parse(localStorage.getItem('musicuz_active_sessions') || '[]');
      const kicked = JSON.parse(localStorage.getItem('musicuz_kicked_sessions') || '[]');
      sessions.forEach((s) => {
        if (s.sessionId !== excludeSessionId && !kicked.includes(s.sessionId)) {
          kicked.push(s.sessionId);
        }
      });
      const remaining = sessions.filter((s) => s.sessionId === excludeSessionId);
      localStorage.setItem('musicuz_active_sessions', JSON.stringify(remaining));
      localStorage.setItem('musicuz_kicked_sessions', JSON.stringify(kicked));
      return { success: true };
    } catch { return { success: false }; }
  },
};

// ==========================================
// Session Manager (tracks active logins)
// ==========================================
export const sessionManager = {
  _SESSIONS_KEY: 'musicuz_active_sessions',
  _MY_SESSION_KEY: 'musicuz_my_session_id',
  _KICKED_KEY: 'musicuz_kicked_sessions',

  createSession(user) {
    try {
      const sessions = JSON.parse(localStorage.getItem(this._SESSIONS_KEY) || '[]');
      const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      const session = {
        sessionId,
        userId: user.id,
        name: user.name || 'Foydalanuvchi',
        phone: user.phone || '',
        username: user.username || '',
        role: user.role || 'user',
        is_admin: user.is_admin || false,
        loginAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
      // Replace existing session for same user
      const filtered = sessions.filter((s) => String(s.userId) !== String(user.id));
      filtered.unshift(session);
      localStorage.setItem(this._SESSIONS_KEY, JSON.stringify(filtered));
      localStorage.setItem(this._MY_SESSION_KEY, sessionId);
      return sessionId;
    } catch { return null; }
  },

  updateLastActive() {
    try {
      const myId = localStorage.getItem(this._MY_SESSION_KEY);
      if (!myId) return;
      const sessions = JSON.parse(localStorage.getItem(this._SESSIONS_KEY) || '[]');
      const updated = sessions.map((s) =>
        s.sessionId === myId ? { ...s, lastActive: new Date().toISOString() } : s
      );
      localStorage.setItem(this._SESSIONS_KEY, JSON.stringify(updated));
    } catch {}
  },

  removeMySession() {
    try {
      const myId = localStorage.getItem(this._MY_SESSION_KEY);
      if (myId) {
        const sessions = JSON.parse(localStorage.getItem(this._SESSIONS_KEY) || '[]');
        const filtered = sessions.filter((s) => s.sessionId !== myId);
        localStorage.setItem(this._SESSIONS_KEY, JSON.stringify(filtered));
        localStorage.removeItem(this._MY_SESSION_KEY);
      }
    } catch {}
  },

  checkIfKicked() {
    try {
      const myId = localStorage.getItem(this._MY_SESSION_KEY);
      if (!myId) return false;
      const kicked = JSON.parse(localStorage.getItem(this._KICKED_KEY) || '[]');
      return kicked.includes(myId);
    } catch { return false; }
  },

  getMySessionId() {
    try { return localStorage.getItem(this._MY_SESSION_KEY) || null; } catch { return null; }
  },
};
