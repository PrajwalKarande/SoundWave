import api from "./api";

export const likeSong = async (songId) => {
    const response = await api.post('/liked', { songId });
    return response.data;
};

export const unlikeSong = async (songId) => {
    const response = await api.delete(`/liked/${songId}`);
    return response.data;
};

export const getLikedSongs = async ({ cursor, limit = 50 } = {}) => {
    const params = new URLSearchParams({ limit });
    if (cursor) params.set('cursor', cursor);
    const response = await api.get(`/liked?${params}`);
    return response.data;
};

export const getLikedSongIds = async () => {
    const response = await api.get('/liked/ids');
    return response.data;
};
