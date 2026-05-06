import api from './api';
const extractErrorMessage = (err, fallbackMessage) => {
  const status = err?.response?.status;
  const payload = err?.response?.data?.message;

  // 400 validation errors usually come as an array of { field, message } objects
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

  // Non-400 array payloads — just surface the first entry
  if (Array.isArray(payload) && payload.length > 0) {
    return payload[0]?.message ?? payload[0]?.field ?? fallbackMessage;
  }

  if (typeof payload === 'string' && payload.trim()) {
    return payload.trim();
  }

  return err?.response?.data?.error ?? err?.message ?? fallbackMessage;
};

// ---------------------------------------------------------------------------
// Artist Service
// ---------------------------------------------------------------------------

export const artistService = {
  /**
   * Fetches all artists.
   * @returns {Promise<Artist[]>}
   */
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get('/artists', { params });
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to fetch artists'));
    }
  },

  /**
   * Creates a new artist.
   * @param {{ name: string, bio: string, profileImageURL: string }} payload
   * @returns {Promise<Artist>}
   */
  create: async ({ name, bio, profileImageURL }) => {
    try {
      const { data } = await api.post('/artists/create', { name, bio, profileImageURL });
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to create artist'));
    }
  },

  /**
   * Fetches a single artist by ID (with populated songs).
   * @param {string} id
   * @returns {Promise<Artist>}
   */
  getById: async (id) => {
    try {
      const { data } = await api.get(`/artists/${id}`);
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to fetch artist'));
    }
  },

  /**
   * Deletes an artist by ID.
   * @param {string} artistId
   * @returns {Promise<void>}
   */
  update: async (artistId, payload) => {
    try {
      const { data } = await api.put(`/artists/update/${artistId}`, payload);
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to update artist'));
    }
  },

  delete: async (artistId) => {
    try {
      const { data } = await api.delete(`/artists/delete/${artistId}`);
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to delete artist'));
    }
  },

  search: async (query, signal) => {
    try {
      const { data } = await api.get('/artists/search', {
        params: { q: query, limit: 3 },
        signal,
      });
      return data;
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return null;
      throw new Error(extractErrorMessage(err, 'Search failed'));
    }
  },
};