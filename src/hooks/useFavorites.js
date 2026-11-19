import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useFavorites(isAuthenticated) {
  const [likes, setLikes] = useState([]);
  const [saved, setSaved] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) {
      setLikes([]);
      setSaved([]);
      setHistory([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [likesData, savedData, historyData] = await Promise.allSettled([
        api.getMeLikes(),
        api.getMeSaved(),
        api.getMeHistory(),
      ]);

      if (likesData.status === 'fulfilled' && Array.isArray(likesData.value)) {
        setLikes(likesData.value);
      }
      if (savedData.status === 'fulfilled' && Array.isArray(savedData.value)) {
        setSaved(savedData.value);
      }
      if (historyData.status === 'fulfilled' && Array.isArray(historyData.value)) {
        setHistory(historyData.value);
      }
    } catch (err) {
      console.warn('Failed to fetch user favorites/history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Check if a song is liked
  const isLiked = useCallback(
    (songId) => {
      return likes.some((s) => s.id === songId);
    },
    [likes]
  );

  // Check if a song is saved
  const isSaved = useCallback(
    (songId) => {
      return saved.some((s) => s.id === songId);
    },
    [saved]
  );

  // Toggle like
  const toggleLike = async (song) => {
    const currentlyLiked = isLiked(song.id);
    // Optimistic UI update
    if (currentlyLiked) {
      setLikes((prev) => prev.filter((s) => s.id !== song.id));
    } else {
      setLikes((prev) => [song, ...prev]);
    }

    try {
      const res = await api.toggleLike(song.id);
      return { success: true, liked: !currentlyLiked, data: res };
    } catch (err) {
      // Revert if API fails
      if (currentlyLiked) {
        setLikes((prev) => [song, ...prev]);
      } else {
        setLikes((prev) => prev.filter((s) => s.id !== song.id));
      }
      throw err;
    }
  };

  // Toggle save
  const toggleSave = async (song) => {
    const currentlySaved = isSaved(song.id);
    // Optimistic UI update
    if (currentlySaved) {
      setSaved((prev) => prev.filter((s) => s.id !== song.id));
    } else {
      setSaved((prev) => [song, ...prev]);
    }

    try {
      const res = await api.toggleSave(song.id);
      return { success: true, saved: !currentlySaved, data: res };
    } catch (err) {
      // Revert if API fails
      if (currentlySaved) {
        setSaved((prev) => [song, ...prev]);
      } else {
        setSaved((prev) => prev.filter((s) => s.id !== song.id));
      }
      throw err;
    }
  };

  const addLocalHistory = (song) => {
    setHistory((prev) => {
      const filtered = prev.filter((s) => s.id !== song.id);
      return [song, ...filtered].slice(0, 50);
    });
  };

  return {
    likes,
    saved,
    history,
    loading,
    error,
    isLiked,
    isSaved,
    toggleLike,
    toggleSave,
    addLocalHistory,
    refetchFavorites: fetchUserData,
  };
}
