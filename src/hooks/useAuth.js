import { useState, useEffect, useCallback, useRef } from 'react';
import { api, getStoredToken, sessionManager } from '../services/api';

const TOKEN_KEY = 'musicuz_token';
const USER_KEY = 'musicuz_user';

export function useAuth() {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const kickCheckRef = useRef(null);

  // Sync user info if token exists
  const fetchCurrentUser = useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setInitialLoading(false);
      return;
    }

    // If logged in as local admin, keep user session intact
    if (currentToken.startsWith('admin_token_')) {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
      setInitialLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userData = await api.getMe();

      // Check if user has been blocked by admin
      if (userData?.phone && api.checkIsUserBlocked(userData.phone)) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken('');
        setUser(null);
        setError("Sizning hisobingiz administrator tomonidan bloklangan!");
        return;
      }

      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (err) {
      console.warn('Failed to fetch user with stored token:', err);
      // If token is invalid (401), clean up
      if (err.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken('');
        setUser(null);
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Check if current session was kicked by admin every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionManager.checkIfKicked()) {
        clearInterval(interval);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('musicuz_my_session_id');
        setToken('');
        setUser(null);
        setError('Administrator tomonidan tizimdan chiqarildingiz!');
      } else {
        sessionManager.updateLastActive();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Request SMS / Telegram code
  const requestCode = async (phone, mode = 'login') => {
    setError(null);

    // Pre-check if phone is blocked
    if (api.checkIsUserBlocked(phone)) {
      const blockedMsg = "Ushbu raqam administrator tomonidan bloklangan. Tizimga kirish taqiqlangan.";
      setError(blockedMsg);
      return { success: false, error: blockedMsg };
    }

    setLoading(true);
    try {
      const res = await api.requestCode(phone, mode);
      return { success: true, data: res };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message,
        needRegister: err.data?.detail?.needRegister,
        needBot: err.data?.detail?.needBot,
        bot: err.data?.detail?.bot,
      };
    } finally {
      setLoading(false);
    }
  };

  // Verify code and complete login
  const verifyCode = async (phone, code, name = '') => {
    setError(null);

    if (api.checkIsUserBlocked(phone)) {
      const blockedMsg = "Ushbu hisob administrator tomonidan bloklangan.";
      setError(blockedMsg);
      return { success: false, error: blockedMsg };
    }

    setLoading(true);
    try {
      const res = await api.verifyCode(phone, code, name);
      const receivedToken = res.token || res.access_token || (typeof res === 'string' ? res : '');
      if (receivedToken) {
        localStorage.setItem(TOKEN_KEY, receivedToken);
        setToken(receivedToken);
        if (res.user) {
          setUser(res.user);
          localStorage.setItem(USER_KEY, JSON.stringify(res.user));
          sessionManager.createSession(res.user);
        } else {
          // Fetch user profile
          const me = await api.getMe();
          setUser(me);
          localStorage.setItem(USER_KEY, JSON.stringify(me));
          sessionManager.createSession(me);
        }
      }
      return { success: true, data: res };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Dedicated Admin Login using credentials: username = "ulugbek", password = "19912008"
  const loginAsAdmin = (username, password) => {
    setError(null);
    const cleanUser = String(username || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    if (cleanUser === 'ulugbek' && cleanPass === '19912008') {
      const adminUser = {
        id: 'admin_ulugbek',
        name: "Ulug'bek",
        username: 'ulugbek',
        phone: '+998901991200',
        role: 'admin',
        is_admin: true,
      };
      const adminToken = 'admin_token_ulugbek_' + Date.now();
      localStorage.setItem(TOKEN_KEY, adminToken);
      localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
      setToken(adminToken);
      setUser(adminUser);
      sessionManager.createSession(adminUser);
      return { success: true, user: adminUser };
    } else {
      const err = "Login yoki parol noto'g'ri! Faqat administrator (ulugbek) kira oladi.";
      setError(err);
      return { success: false, error: err };
    }
  };

  // Update user name
  const updateName = async (newName) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await api.updateMe(newName);
      setUser((prev) => ({ ...prev, name: newName, ...updated }));
      localStorage.setItem(USER_KEY, JSON.stringify({ ...user, name: newName, ...updated }));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    sessionManager.removeMySession();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken('');
    setUser(null);
  };

  // Demo / Guest login for testing UI features without telegram bot
  const setDemoSession = (demoName = 'Test Foydalanuvchi') => {
    const demoToken = 'demo_user_token_' + Date.now();
    const demoUser = {
      id: 999,
      phone: '+998901234567',
      name: demoName,
      is_admin: false,
      role: 'user',
    };
    localStorage.setItem(TOKEN_KEY, demoToken);
    localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
    setToken(demoToken);
    setUser(demoUser);
  };

  return {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isAdmin: Boolean(user?.is_admin || user?.role === 'admin' || user?.username === 'ulugbek'),
    loading,
    initialLoading,
    error,
    setError,
    requestCode,
    verifyCode,
    loginAsAdmin,
    updateName,
    logout,
    setDemoSession,
    refreshUser: fetchCurrentUser,
  };
}
