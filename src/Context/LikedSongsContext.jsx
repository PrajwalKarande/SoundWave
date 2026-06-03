import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContextProvider';
import { getLikedSongIds, likeSong, unlikeSong } from '../Services/likedSongService';

const LikedSongsContext = createContext(null);

export function LikedSongsProvider({ children }) {
    const { user } = useAuth();
    const [likedIds, setLikedIds] = useState(new Set());

    useEffect(() => {
        if (!user) { setLikedIds(new Set()); return; }
        getLikedSongIds()
            .then(data => setLikedIds(new Set((data.ids || []).map(id => String(id)))))
            .catch(() => {});
    }, [user]);

    const isLiked = useCallback((songId) => likedIds.has(String(songId)), [likedIds]);

    // Optimistic toggle — reverts on API failure. Calls onSuccess(nowLiked) or onError(err).
    const toggleLike = useCallback(async (songId, { onSuccess, onError } = {}) => {
        const id = String(songId);
        const wasLiked = likedIds.has(id);

        setLikedIds(prev => {
            const next = new Set(prev);
            wasLiked ? next.delete(id) : next.add(id);
            return next;
        });

        try {
            wasLiked ? await unlikeSong(id) : await likeSong(id);
            onSuccess?.(!wasLiked);
        } catch (err) {
            setLikedIds(prev => {
                const next = new Set(prev);
                wasLiked ? next.add(id) : next.delete(id);
                return next;
            });
            onError?.(err);
        }
    }, [likedIds]);

    return (
        <LikedSongsContext.Provider value={{ isLiked, toggleLike, likedIds }}>
            {children}
        </LikedSongsContext.Provider>
    );
}

export const useLikedSongs = () => useContext(LikedSongsContext);
