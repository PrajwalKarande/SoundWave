import api from "./api";

export const createPlaylist = async (name) => {
    try {
        const response = await api.post('/playlists', { name });
        return response.data;
    } catch (error) {
        return response.data.message || response.message
    }
}

export const getPlaylist = async (id) => {
    try {
        const response = await api.get(`/playlists/${id}`);
        return response.data;
    } catch (error) {
        return response.data.message || response.message
    }
}

export const addSongToPlaylist = async (playlistId, songId) => {
    try {
        const response = await api.post(`/playlists/${playlistId}/add`, { songId });
        return response.data;
    }catch (error) {
        return response.data.message || response.message
    }
}

export const deleteSongFromPlaylist = async(playlistId, songId) => {
    try {
        const response = await api.delete(`/playlists/${playlistId}/remove`, { songId });
        return response.data;
    }catch (error) {
        return response.data.message || response.message
    }
}

export const deletePlaylist = async(playlistId) => {
    try {
        const response = await api.delete(`/playlists/${playlistId}`);
        return response.data;
    }catch (error) {
        return response.data.message || response.message
    }
}

export const updatePlaylist = async(playlistId, name) => {
    try {
        const response = await api.put(`/playlists/${playlistId}`, { name });
        return response.data;
    }catch (error) {
        return response.data.message || response.message
    }
}