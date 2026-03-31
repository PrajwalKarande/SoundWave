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
  getAll: async () => {
    console.log('Fetching songs from API...');
    try {
      const { data } = await api.get('/songs');
      return data.songs ?? data;
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Failed to fetch songs'));
    }
  },
};
