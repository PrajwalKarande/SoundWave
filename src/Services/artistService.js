import api from './api';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extracts a human-readable error message from an Axios error response.
 * Falls back to `fallbackMessage` when nothing useful is found.
 */
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

  // Plain string message
  if (typeof payload === 'string' && payload.trim()) {
    return payload.trim();
  }

  // Last resorts
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
  getAll: async () => {
    try {
      const { data } = await api.get('/artists');
      return data.artists ?? data;
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
   * Deletes an artist by ID.
   * @param {string} artistId
   * @returns {Promise<void>}
   */
  delete: async (artistId) => {
    try {
      const { data } = await api.delete(`/artists/delete/${artistId}`);
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to delete artist'));
    }
  },
};