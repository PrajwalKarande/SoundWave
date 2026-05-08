import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, Shuffle, Music, Clock, User } from 'lucide-react';
import { artistService } from '../../Services/artistService';
import { usePlayer } from '../../Context/PlayerContext';
import './ArtistPage.css';

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

export default function ArtistPage() {
  const { id } = useParams();
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  const gradientColor = useMemo(() => {
    if (!id) return GRADIENT_COLORS[0];
    const sum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return GRADIENT_COLORS[sum % GRADIENT_COLORS.length];
  }, [id]);

  const fetchArtist = useCallback(async () => {
    setLoading(true);
    try {
      const data = await artistService.getById(id);
      setArtist(data.data || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchArtist(); }, [fetchArtist]);

  const songs = artist?.songs || [];
  const isArtistPlaying = songs.some((s) => s._id === currentSong?._id) && isPlaying;

  const handleSongClick = (song, idx) => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      playSong(song, songs, idx);
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

  /* ── Skeleton ── */
  if (loading) {
    return (
      <div className="relative min-h-full animate-pulse">
        <div
          style={{ background: `linear-gradient(to bottom, ${gradientColor}d0 0%, ${gradientColor}50 55%, transparent 100%)` }}
        >
          <div className="flex flex-col sm:flex-row items-end gap-6 p-6 pb-4">
            <div className="w-44 h-44 shrink-0 rounded-full bg-white/10" />
            <div className="flex-1 min-w-0 pb-1 space-y-3">
              <div className="h-3 w-16 bg-white/10 rounded" />
              <div className="h-8 w-52 bg-white/10 rounded" />
              <div className="h-3.5 w-32 bg-white/10 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 pb-5">
            <div className="w-12 h-12 rounded-full bg-white/10" />
            <div className="w-10 h-10 rounded-full bg-white/5" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="px-6 pt-4 space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <div className="w-6 h-4 bg-white/5 rounded ml-2" />
              <div className="w-9 h-9 rounded bg-white/5 shrink-0" />
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="h-3.5 w-36 bg-white/5 rounded" />
              </div>
              <div className="h-3 w-20 bg-white/5 rounded hidden sm:block" />
              <div className="h-3 w-10 bg-white/30 rounded mr-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-text">
        Artist not found.
      </div>
    );
  }

  return (
    <div className="relative min-h-full">

      {/* ── Header section with gradient background ── */}
      <div
        style={{
          background: `linear-gradient(to bottom, ${gradientColor}d0 0%, ${gradientColor}50 55%, transparent 100%)`,
        }}
      >
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-end gap-6 p-6 pb-4">
          {/* Profile image — round */}
          <div
            className="w-44 h-44 shrink-0 rounded-full overflow-hidden"
            style={{
              boxShadow: `0 10px 40px rgba(0,0,0,0.6), 0 0 60px ${gradientColor}60`,
            }}
          >
            {artist.profileImageURL ? (
              <img
                src={artist.profileImageURL}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${gradientColor}99, ${gradientColor}22)` }}
              >
                <User size={52} className="text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pb-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Artist</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2 truncate">
              {artist.name}
            </h1>
            <p className="text-sm text-white/80">
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
            aria-label={isArtistPlaying ? 'Pause' : 'Play'}
          >
            {isArtistPlaying
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
        </div>
      </div>

      {/* ── Song list ── */}
      {songs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-muted-text/40">
          <Music size={36} />
          <p className="text-sm">No songs available</p>
        </div>
      ) : (
        <table className="w-full pb-8 border-collapse">
          <thead>
            <tr>
              <th className="w-10 px-2 sm:px-6 pb-3 text-left text-xs font-medium text-muted-text/40 uppercase tracking-wider">#</th>
              <th className="px-3 pb-3 text-left text-xs font-medium text-muted-text/40 uppercase tracking-wider">Title</th>
              <th className="hidden sm:table-cell px-3 pb-3 text-left text-xs font-medium text-muted-text/40 uppercase tracking-wider">Artist</th>
              <th className="px-2 sm:px-4 pb-3 text-right">
                <Clock size={12} className="text-muted-text/40 ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, idx) => {
              const isCurrent = currentSong?._id === song._id;
              const isRowPlaying = isCurrent && isPlaying;
              return (
                <tr
                  key={song._id}
                  className={`group cursor-pointer transition-colors ${isCurrent ? 'bg-accent/8' : 'hover:bg-white/5'}`}
                  onClick={() => handleSongClick(song, idx)}
                >
                  {/* Index / EQ */}
                  <td className="w-10 px-2 sm:px-6 py-2.5">
                    <div className="w-6 flex items-center justify-center">
                      {isRowPlaying ? (
                        <div className="ar-eq-wrap">
                          <span className="ar-eq-bar" style={{ height: '60%' }} />
                          <span className="ar-eq-bar" style={{ height: '100%', animationDelay: '0.2s' }} />
                          <span className="ar-eq-bar" style={{ height: '45%', animationDelay: '0.4s' }} />
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
                  </td>

                  {/* Cover + Title */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 shrink-0 rounded overflow-hidden bg-white/5">
                        {song.coverImage
                          ? <img src={song.coverImage} alt={song.title} loading="lazy" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><Music size={13} className="text-white/20" /></div>
                        }
                      </div>
                      <p className={`text-sm font-medium truncate ${isCurrent ? 'text-accent' : 'text-primary-text'}`}>
                        {song.title}
                      </p>
                    </div>
                  </td>

                  {/* Artist */}
                  <td className="hidden sm:table-cell px-3 py-2.5">
                    <p className="text-sm text-muted-text/60 truncate">{getArtistName(song.artist)}</p>
                  </td>

                  {/* Duration */}
                  <td className="px-2 sm:px-4 py-2.5 text-right">
                    <span className="text-xs text-muted-text/40 tabular-nums">
                      {formatDuration(song.duration)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {/* ── About article ── */}
      {artist.bio && (
        <div className="px-6 py-8">
          <article className="max-w-lg bg-white/[0.03] border border-white/[0.06] rounded-2xl px-6 py-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/35 mb-3">About</h2>
            <p className="text-sm text-white/60 leading-relaxed">{artist.bio}</p>
          </article>
        </div>
      )}

    </div>
  );
}
