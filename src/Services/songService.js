import api from './api';

const extractErrorMessage = (err, fallbackMessage) => {
  const status = err?.response?.status;
  const payload = err?.response?.data?.message;

  if (status === 400 && Array.isArray(payload) && payload.length > 0) {
    return payload
      .map((item) => {
        if (!item) return null;
        const prefix = item.field ? `${item.field}: ` : '';
        return `${prefix}${item.message ?? ''}`.trim();
      })
      .filter(Boolean)
      .join(', ');
  }

  if (Array.isArray(payload) && payload.length > 0) {
    return payload[0]?.message ?? payload[0]?.field ?? fallbackMessage;
  }

  if (typeof payload === 'string' && payload.trim()) {
    return payload.trim();
  }

  return err?.response?.data?.error ?? err?.message ?? fallbackMessage;
};

export const songService = {
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get('/songs', { params });
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to fetch songs'));
    }
  },

  markPlayed: async (songId) => {
    try {
      const { data } = await api.post(`/songs/${songId}/played`);
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to mark song as played'));
    }
  },

  getRecentlyPlayed: async () => {
    try {
      const { data } = await api.get('/songs/recently-played');
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to fetch recently played'));
    }
  },

  search: async (query, signal) => {
    try {
      const { data } = await api.get('/songs/search', {
        params: { q: query, limit: 4 },
        signal,
      });
      return data;
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return null;
      throw new Error(extractErrorMessage(err, 'Search failed'));
    }
  },
};
