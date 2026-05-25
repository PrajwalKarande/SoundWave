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

  delete: async (songId) => {
    try {
      const { data } = await api.delete(`/songs/${songId}`);
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to delete song'));
    }
  },

  update: async (songId, payload) => {
    try {
      const { data } = await api.put(`/songs/${songId}`, payload);
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to update song'));
    }
  },

  getRecommendations: async (params = {}) => {
    try {
      const { data } = await api.get('/songs/recommendations', { params });
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to fetch recommendations'));
    }
  },

  getTrending: async (params = {}) => {
    try {
      const { data } = await api.get('/songs/trending', { params });
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to fetch trending songs'));
    }
  },

  getByGenres: async (genres, limit = 20) => {
    try {
      const { data } = await api.get('/songs', {
        params: { genres: genres.join(','), limit },
      });
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to fetch songs by genre'));
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

  getSearchHistory: async () => {
    try {
      const { data } = await api.get('/songs/search-history');
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to fetch search history'));
    }
  },

  addSongToSearchHistory: async (songId) => {
    try {
      const { data } = await api.post(`/songs/search-history/${songId}`);
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to save search history'));
    }
  },

  clearSearchHistory: async () => {
    try {
      const { data } = await api.delete('/songs/search-history');
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to clear search history'));
    }
  },

  removeSearchHistoryItem: async (songId) => {
    try {
      const { data } = await api.delete(`/songs/search-history/${songId}`);
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to remove search history item'));
    }
  },
};
