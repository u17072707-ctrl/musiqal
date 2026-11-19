import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useSongs({ query = '', genre = '', sort = 'popular' } = {}) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSongs({ q: query, genre, sort });
      setSongs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load songs:', err);
      setError(err.message || 'Musiqalarni yuklab bo\'lmadi');
    } finally {
      setLoading(false);
    }
  }, [query, genre, sort]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  // Optimistic update for a song's liked/saved or plays state
  const updateSongState = useCallback((songId, updates) => {
    setSongs((prev) =>
      prev.map((song) => {
        if (song.id === songId) {
          return { ...song, ...updates };
        }
        return song;
      })
    );
  }, []);

  return {
    songs,
    loading,
    error,
    refetch: fetchSongs,
    updateSongState,
  };
}
