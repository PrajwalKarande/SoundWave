import { useState, useEffect, useMemo } from 'react';
import {
    Play, Pause, Shuffle, Music, Loader2, Clock, Heart,
} from 'lucide-react';
import { getLikedSongs } from '../../Services/likedSongService';
import { usePlayer } from '../../Context/PlayerContext';
import { useLikedSongs } from '../../Context/LikedSongsContext';
import { useToast } from '../../Context/ToastContext';
import './LikedSongsPage.css';

const HEADER_GRADIENT = 'linear-gradient(to bottom, #be185d80 0%, #7c3aed50 55%, transparent 100%)';
const COVER_GRADIENT  = 'linear-gradient(135deg, #be185d 0%, #7c3aed 100%)';

const formatDuration = (seconds) => {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
};

const getArtistName = (artist) => {
    if (!artist) return 'Unknown Artist';
    if (typeof artist === 'string') return artist;
    if (Array.isArray(artist)) return artist.map(a => a.name || a).join(', ');
    return 'Unknown Artist';
};

export default function LikedSongsPage() {
    const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();
    const { toggleLike } = useLikedSongs();
    const toast = useToast();

    const [songs, setSongs]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        setLoading(true);
        getLikedSongs()
            .then(data => setSongs(data.songs || []))
            .catch(() => toast.error('Failed to load liked songs'))
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isPagePlaying = useMemo(
        () => songs.some(s => s._id === currentSong?._id) && isPlaying,
        [songs, currentSong, isPlaying]
    );

    const handlePlay = () => {
        if (!songs.length) return;
        if (currentSong?._id === songs[0]._id) { togglePlay(); return; }
        playSong(songs[0], songs, 0);
    };

    const handleShuffle = () => {
        if (!songs.length) return;
        const idx = Math.floor(Math.random() * songs.length);
        playSong(songs[idx], songs, idx);
    };

    const handleSongClick = (song, idx) => {
        if (currentSong?._id === song._id) togglePlay();
        else playSong(song, songs, idx);
    };

    const handleUnlike = async (e, song) => {
        e.stopPropagation();
        setRemovingId(song._id);
        await toggleLike(song._id, {
            onSuccess: () => {
                setSongs(prev => prev.filter(s => s._id !== song._id));
                toast.success('Removed from Liked Songs');
            },
            onError: () => toast.error('Failed to update liked status'),
        });
        setRemovingId(null);
    };

    if (loading) {
        return (
            <div className="relative min-h-full animate-pulse">
                <div style={{ background: HEADER_GRADIENT }}>
                    <div className="flex flex-col sm:flex-row items-end gap-6 p-6 pb-4">
                        <div className="w-44 h-44 shrink-0 rounded-xl bg-white/10" />
                        <div className="flex-1 min-w-0 pb-1 space-y-3">
                            <div className="h-3 w-16 bg-white/10 rounded" />
                            <div className="h-8 w-52 bg-white/10 rounded" />
                            <div className="h-3.5 w-28 bg-white/10 rounded" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-6 pb-5">
                        <div className="w-12 h-12 rounded-full bg-white/10" />
                        <div className="w-10 h-10 rounded-full bg-white/5" />
                    </div>
                </div>
                <div className="px-6 pt-4 space-y-1">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 py-2.5">
                            <div className="w-6 h-4 bg-white/5 rounded ml-2" />
                            <div className="w-9 h-9 rounded bg-white/5 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="h-3.5 w-36 bg-white/5 rounded" />
                            </div>
                            <div className="h-3 w-20 bg-white/5 rounded hidden sm:block" />
                            <div className="h-3 w-10 bg-white/10 rounded mr-4" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-full">
            <div style={{ background: HEADER_GRADIENT }}>
                <div className="flex flex-col sm:flex-row items-end gap-6 p-6 pb-4">
                    <div
                        className="w-44 h-44 shrink-0 rounded-xl flex items-center justify-center"
                        style={{
                            background: COVER_GRADIENT,
                            boxShadow: '0 10px 40px rgba(0,0,0,0.6), 0 0 60px rgba(190,24,93,0.3)',
                        }}
                    >
                        <Heart
                            size={72}
                            fill="white"
                            className="text-white"
                            style={{ opacity: 0.88, filter: 'drop-shadow(0 4px 18px rgba(255,255,255,0.25))' }}
                        />
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Playlist</p>
                        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
                            Liked Songs
                        </h1>
                        <p className="text-sm text-white/70">
                            {songs.length} {songs.length === 1 ? 'song' : 'songs'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 px-6 pb-5">
                    <button
                        onClick={handlePlay}
                        disabled={!songs.length}
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-40"
                        style={{
                            background: COVER_GRADIENT,
                            boxShadow: '0 6px 24px rgba(190,24,93,0.45)',
                        }}
                        aria-label={isPagePlaying ? 'Pause' : 'Play'}
                    >
                        {isPagePlaying
                            ? <Pause size={20} fill="white" className="text-white" />
                            : <Play  size={20} fill="white" className="text-white ml-0.5" />
                        }
                    </button>

                    <button
                        onClick={handleShuffle}
                        disabled={!songs.length}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40"
                        aria-label="Shuffle"
                    >
                        <Shuffle size={18} />
                    </button>
                </div>
            </div>

            {songs.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-muted-text/40">
                    <Heart size={36} />
                    <p className="text-sm">Songs you like will appear here</p>
                </div>
            ) : (
                <table className="w-full pb-8 border-collapse table-fixed">
                    <thead>
                        <tr>
                            <th className="w-10 px-2 sm:px-6 pb-3 text-left text-xs font-medium text-muted-text/40 uppercase tracking-wider">#</th>
                            <th className="px-3 pb-3 text-left text-xs font-medium text-muted-text/40 uppercase tracking-wider">Title</th>
                            <th className="hidden sm:table-cell px-3 pb-3 text-left text-xs font-medium text-muted-text/40 uppercase tracking-wider">Artist</th>
                            <th className="w-14 sm:w-20 px-2 sm:px-4 pb-3 text-right">
                                <Clock size={12} className="text-muted-text/40 ml-auto" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {songs.map((song, idx) => {
                            const isCurrent    = currentSong?._id === song._id;
                            const isRowPlaying = isCurrent && isPlaying;
                            return (
                                <tr
                                    key={song._id}
                                    className={`group cursor-pointer transition-colors ${
                                        isCurrent ? 'bg-rose-500/10' : 'hover:bg-white/5'
                                    }`}
                                    onClick={() => handleSongClick(song, idx)}
                                >
                                    <td className="w-10 px-2 sm:px-6 py-2.5">
                                        <div className="w-6 flex items-center justify-center">
                                            {isRowPlaying ? (
                                                <div className="ls-eq-wrap">
                                                    <span className="ls-eq-bar" style={{ height: '60%' }} />
                                                    <span className="ls-eq-bar" style={{ height: '100%', animationDelay: '0.2s' }} />
                                                    <span className="ls-eq-bar" style={{ height: '45%', animationDelay: '0.4s' }} />
                                                </div>
                                            ) : (
                                                <>
                                                    <span className={`text-sm group-hover:hidden ${isCurrent ? 'text-rose-400' : 'text-muted-text/50'}`}>
                                                        {idx + 1}
                                                    </span>
                                                    <Play size={13} fill="currentColor" className="hidden group-hover:block text-white/80" />
                                                </>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-3 py-2.5">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 shrink-0 rounded overflow-hidden bg-white/5">
                                                {song.coverImage
                                                    ? <img src={song.coverImage} alt={song.title} loading="lazy" className="w-full h-full object-cover" />
                                                    : <div className="w-full h-full flex items-center justify-center"><Music size={13} className="text-white/20" /></div>
                                                }
                                            </div>
                                            <p className={`text-sm font-medium truncate ${isCurrent ? 'text-rose-400' : 'text-primary-text'}`}>
                                                {song.title}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="hidden sm:table-cell px-3 py-2.5">
                                        <p className="text-sm text-muted-text/60 truncate">{getArtistName(song.artist)}</p>
                                    </td>

                                    <td className="px-2 sm:px-4 py-2.5 text-right whitespace-nowrap">
                                        <span className="text-xs text-muted-text/40 tabular-nums group-hover:hidden">
                                            {formatDuration(song.duration)}
                                        </span>
                                        <button
                                            className="hidden group-hover:inline-flex w-7 h-7 items-center justify-center rounded-full text-rose-400/60 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                                            onClick={(e) => handleUnlike(e, song)}
                                            disabled={removingId === song._id}
                                            aria-label="Remove from Liked Songs"
                                            title="Remove from Liked Songs"
                                        >
                                            {removingId === song._id
                                                ? <Loader2 size={13} className="animate-spin" />
                                                : <Heart size={13} fill="currentColor" />
                                            }
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
