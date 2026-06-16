import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getPlaylist } from '../Services/playlistService';
import { useAuth } from './AuthContextProvider';

const PlaylistContext = createContext(null);

export function PlaylistProvider({ children }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading]   = useState(true);

  const refreshPlaylists = useCallback(async () => {
    if (!user) { setPlaylists([]); setLoading(false); return; }
    setLoading(true);
    try {
      const data = await getPlaylist();
      setPlaylists(data.data || data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refreshPlaylists(); }, [refreshPlaylists]);

  const addPlaylist = useCallback((playlist) => {
    const item = playlist?.data || playlist;
    setPlaylists(prev => [item, ...prev]);
  }, []);

  const removePlaylist = useCallback((id) => {
    setPlaylists(prev => prev.filter(p => p._id !== id));
  }, []);

  const renamePlaylist = useCallback((id, name) => {
    setPlaylists(prev => prev.map(p => p._id === id ? { ...p, name } : p));
  }, []);

  return (
    <PlaylistContext.Provider value={{ playlists, loading, addPlaylist, removePlaylist, refreshPlaylists, renamePlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
}

export const usePlaylist = () => useContext(PlaylistContext);
