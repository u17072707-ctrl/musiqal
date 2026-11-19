import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGenres = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getGenres();
      setGenres(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load genres:', err);
      setError(err.message || 'Janrlarni yuklab bo\'lmadi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  return { genres, loading, error, refetch: fetchGenres };
}
