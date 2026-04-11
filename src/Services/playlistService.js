import api from "./api";

export const createPlaylist = async (name) => {
    try {
        const response = await api.post('/playlists', { name });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getPlaylist = async () => {
    try {
        const response = await api.get(`/playlists`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getPlaylistById = async (id) => {
    try {
        const response = await api.get(`/playlists/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addSongToPlaylist = async (playlistId, songId) => {
    try {
        const response = await api.post(`/playlists/${playlistId}/add`, { songId });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteSongFromPlaylist = async (playlistId, songId) => {
    try {
        const response = await api.delete(`/playlists/${playlistId}/remove`, { data: { songId } });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deletePlaylist = async (playlistId) => {
    try {
        const response = await api.delete(`/playlists/${playlistId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updatePlaylist = async (playlistId, name) => {
    try {
        const response = await api.put(`/playlists/${playlistId}`, { name });
        return response.data;
    } catch (error) {
        throw error;
    }
}
