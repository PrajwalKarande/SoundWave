import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Play, Pause, Shuffle, Plus, Trash2,
  Loader2, Music, Search, X, CheckCircle2,
} from 'lucide-react';
import {
  getPlaylistById,
  addSongToPlaylist,
  deleteSongFromPlaylist,
} from '../../Services/playlistService';
import { songService } from '../../Services/songService';
import { usePlayer } from '../../Context/PlayerContext';
import './PlaylistPage.css';

const GRADIENT_COLORS = [
  '#7C3AED', '#DC2626', '#2563EB', '#059669',
  '#D97706', '#DB2777', '#0891B2', '#FF4313',
  '#7C2D12', '#065F46', '#1E3A8A', '#831843',
];

const formatDuration = (seconds) => {
  if (!seconds) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const getArtistName = (artist) => {
  if (!artist) return 'Unknown Artist';
  if (typeof artist === 'string') return artist;
  if (Array.isArray(artist)) return artist.map((a) => a.name || a).join(', ');
  return 'Unknown Artist';
};

export default function PlaylistPage() {
  const { id } = useParams();
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [allSongs, setAllSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [addingId, setAddingId] = useState(null);

  // Deterministic gradient colour per playlist ID
  const gradientColor = useMemo(() => {
    if (!id) return GRADIENT_COLORS[0];
    const sum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return GRADIENT_COLORS[sum % GRADIENT_COLORS.length];
  }, [id]);

  const fetchPlaylist = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPlaylistById(id);
      setPlaylist(data.data || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchPlaylist(); }, [fetchPlaylist]);

  const openAddModal = async () => {
    setShowAddModal(true);
    if (allSongs.length > 0) return;
    setSongsLoading(true);
    try {
      const data = await songService.getAll();
      setAllSongs(data.songs || data.data || data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSongsLoading(false);
    }
  };

  const handleRemoveSong = async (e, songId) => {
    e.stopPropagation();
    setRemovingId(songId);
    try {
      await deleteSongFromPlaylist(id, songId);
      setPlaylist((prev) => ({ ...prev, songs: prev.songs.filter((s) => s._id !== songId) }));
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddSong = async (song) => {
    if (addingId || inPlaylistIds.has(song._id)) return;
    setAddingId(song._id);
    try {
      await addSongToPlaylist(id, song._id);
      setPlaylist((prev) => ({ ...prev, songs: [...(prev.songs || []), song] }));
    } catch (err) {
      console.error(err);
    } finally {
      setAddingId(null);
    }
  };

  const handleSongClick = (song, idx) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      playSong(song, playlist.songs, idx);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-text">
        Playlist not found.
      </div>
    );
  }

  const songs = playlist.songs || [];
  const inPlaylistIds = new Set(songs.map((s) => s._id));
  const isPlaylistPlaying = songs.some((s) => s._id === currentSong?._id) && isPlaying;

  const filtered = allSongs.filter((s) =>
    s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getArtistName(s.artist).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-full">

      {/* ── Gradient bg ── */}
      <div
        className="absolute inset-x-0 top-0 h-80 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${gradientColor}bb 0%, ${gradientColor}33 55%, transparent 100%)`,
        }}
      />

      <div className="relative">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-end gap-6 p-6 pb-4">
          {/* Cover art */}
          <div
            className="w-44 h-44 shrink-0 rounded-xl overflow-hidden"
            style={{ boxShadow: `0 24px 64px ${gradientColor}55` }}
          >
            {playlist.coverImage ? (
              <img src={playlist.coverImage} alt={playlist.name} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${gradientColor}99, ${gradientColor}22)` }}
              >
                <Music size={52} className="text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pb-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Playlist</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2 truncate">
              {playlist.name}
            </h1>
            <p className="text-sm text-white/40">
              {songs.length} {songs.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center gap-3 px-6 pb-5">
          <button
            onClick={handlePlay}
            disabled={!songs.length}
            className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-40"
            style={{ boxShadow: `0 6px 24px ${gradientColor}55` }}
            aria-label={isPlaylistPlaying ? 'Pause' : 'Play'}
          >
            {isPlaylistPlaying
              ? <Pause size={20} fill="white" className="text-white" />
              : <Play size={20} fill="white" className="text-white ml-0.5" />
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

          <button
            onClick={openAddModal}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-accent hover:bg-accent/10 transition-all"
            aria-label="Add songs"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="mx-6 border-t border-white/8 mb-1" />

        {/* ── Song list ── */}
        {songs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-text/40">
            <Music size={36} />
            <p className="text-sm">No songs yet — hit + to add some</p>
          </div>
        ) : (
          <div className="pb-8">
            {songs.map((song, idx) => {
              const isCurrent = currentSong?._id === song._id;
              const isRowPlaying = isCurrent && isPlaying;
              return (
                <div
                  key={song._id}
                  className={`group flex items-center gap-3 px-6 py-2.5 cursor-pointer transition-colors ${
                    isCurrent ? 'bg-accent/8' : 'hover:bg-white/5'
                  }`}
                  onClick={() => handleSongClick(song, idx)}
                >
                  {/* Index / EQ / play indicator */}
                  <div className="w-6 flex items-center justify-center shrink-0">
                    {isRowPlaying ? (
                      <div className="pl-eq-wrap">
                        <span className="pl-eq-bar" style={{ height: '60%' }} />
                        <span className="pl-eq-bar" style={{ height: '100%', animationDelay: '0.2s' }} />
                        <span className="pl-eq-bar" style={{ height: '45%', animationDelay: '0.4s' }} />
                      </div>
                    ) : (
                      <>
                        <span className={`text-sm group-hover:hidden ${isCurrent ? 'text-accent' : 'text-muted-text/50'}`}>
                          {idx + 1}
                        </span>
                        <Play size={13} fill="currentColor" className="hidden group-hover:block text-white/80" />
                      </>
                    )}
                  </div>

                  {/* Cover */}
                  <div className="w-9 h-9 shrink-0 rounded overflow-hidden bg-white/5">
                    {song.coverImage
                      ? <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Music size={13} className="text-white/20" /></div>
                    }
                  </div>

                  {/* Title + artist */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isCurrent ? 'text-accent' : 'text-primary-text'}`}>
                      {song.title}
                    </p>
                    <p className="text-xs text-muted-text/60 truncate">{getArtistName(song.artist)}</p>
                  </div>

                  {/* Duration — hidden on hover to make room for delete */}
                  <span className="text-xs text-muted-text/40 tabular-nums shrink-0 group-hover:hidden">
                    {formatDuration(song.duration)}
                  </span>

                  {/* Delete button */}
                  <button
                    className="hidden group-hover:flex w-7 h-7 items-center justify-center rounded-full text-muted-text/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    onClick={(e) => handleRemoveSong(e, song._id)}
                    disabled={removingId === song._id}
                    aria-label="Remove from playlist"
                  >
                    {removingId === song._id
                      ? <Loader2 size={13} className="animate-spin" />
                      : <Trash2 size={13} />
                    }
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add Songs Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-[#141618] border border-white/10 rounded-2xl w-full max-w-md max-h-[78vh] flex flex-col shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <h2 className="text-sm font-semibold text-white">Add to playlist</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-muted-text/60 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/8 rounded-lg">
                <Search size={14} className="text-muted-text/50 shrink-0" />
                <input
                  type="text"
                  placeholder="Search songs…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-muted-text/40 focus:outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}>
                    <X size={12} className="text-muted-text/40 hover:text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-2">
              {songsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="animate-spin text-accent" size={22} />
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-center text-muted-text/40 text-sm py-8">No songs found</p>
              ) : (
                filtered.map((song) => {
                  const inPlaylist = inPlaylistIds.has(song._id);
                  const isAdding = addingId === song._id;
                  return (
                    <div
                      key={song._id}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${
                        inPlaylist ? 'opacity-40 cursor-default' : 'hover:bg-white/6 cursor-pointer'
                      }`}
                      onClick={() => handleAddSong(song)}
                    >
                      <div className="w-9 h-9 shrink-0 rounded overflow-hidden bg-white/5">
                        {song.coverImage
                          ? <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><Music size={13} className="text-white/20" /></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{song.title}</p>
                        <p className="text-xs text-muted-text/50 truncate">{getArtistName(song.artist)}</p>
                      </div>
                      <div className="shrink-0">
                        {isAdding ? (
                          <Loader2 size={15} className="animate-spin text-accent" />
                        ) : inPlaylist ? (
                          <CheckCircle2 size={15} className="text-accent/70" />
                        ) : (
                          <Plus size={15} className="text-muted-text/40 group-hover:text-accent transition-colors" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
