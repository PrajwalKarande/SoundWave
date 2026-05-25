import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../../Context/PlayerContext';
import { songService } from '../../../Services/songService';
import { artistService } from '../../../Services/artistService';
import './SearchDropdown.css';

const formatDuration = (seconds) => {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${m}:${s}`;
};

// Fallback icons as inline SVG
const MusicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
);
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);
const XSmallIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

function SkeletonRows({ count = 3 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="sd-skeleton">
      <div className="sd-skel-thumb" />
      <div className="sd-skel-lines">
        <div className="sd-skel-line" />
        <div className="sd-skel-line sd-skel-line--short" />
      </div>
    </div>
  ));
}

function SearchDropdown({ songs, artists, loading, query, history = [], onSongPlayedFromSearch, onRemoveHistoryItem, onClearHistory }) {
  const { playSong, appendToQueue } = usePlayer();
  const navigate = useNavigate();

  const hasSongs   = songs.length > 0;
  const hasArtists = artists.length > 0;
  const isEmpty    = !hasSongs && !hasArtists;
  const showHistory = query.length < 2 && history.length > 0;

  const buildRadioQueue = async (song, sourceList) => {
    const songId    = song._id;
    const artistId  = song.artist?.[0]?._id;
    const genres    = song.genre || [];

    try {
      const seenIds = new Set(sourceList.map(s => s._id));
      seenIds.add(songId);

      const [artistData, genreData] = await Promise.all([
        artistId ? artistService.getById(artistId) : Promise.resolve(null),
        genres.length > 0 ? songService.getByGenres(genres, 20) : Promise.resolve(null),
      ]);

      const pick = (pool, n) =>
        [...pool].sort(() => Math.random() - 0.5).slice(0, n);

      const artistSongs = pick(
        (artistData?.songs || []).filter(s => !seenIds.has(s._id)),
        5
      );
      artistSongs.forEach(s => seenIds.add(s._id));

      const genreSongs = pick(
        (genreData?.data || []).filter(s => !seenIds.has(s._id)),
        5
      );

      const toAdd = [...artistSongs, ...genreSongs];
      if (toAdd.length > 0) appendToQueue(toAdd, songId);
    } catch {
      // fail silently — the search queue still plays fine
    }
  };

  const handleSongClick = (song, sourceList) => {
    playSong(song, sourceList, sourceList.indexOf(song));
    onSongPlayedFromSearch?.(song);
    buildRadioQueue(song, sourceList);
  };

  const handleArtistClick = (artist) => {
    navigate(`/artist/${artist._id}`);
  };

  // Show history when input is focused but nothing typed yet
  if (showHistory) {
    return (
      <div className="sd-wrap" role="listbox" aria-label="Search history">
        <div className="sd-history-header">
          <p className="sd-section-title" style={{ margin: 0 }}>Recently played from search</p>
          <button className="sd-clear-btn" onClick={onClearHistory}>Clear all</button>
        </div>
        {history.map((song) => (
          <div key={song._id} className="sd-item sd-history-item">
            {song.coverImage
              ? <img src={song.coverImage} alt={song.title} className="sd-thumb" />
              : <span className="sd-thumb-fallback"><MusicIcon /></span>
            }
            <button
              className="sd-text sd-history-query"
              onClick={() => handleSongClick(song, history)}
            >
              <span className="sd-name">{song.title}</span>
              {song.artist?.length > 0 && (
                <span className="sd-sub">{song.artist.map(a => a.name).join(', ')}</span>
              )}
            </button>
            <button
              className="sd-remove-btn"
              onClick={(e) => { e.stopPropagation(); onRemoveHistoryItem(song._id); }}
              aria-label={`Remove ${song.title} from history`}
            >
              <XSmallIcon />
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="sd-wrap">
        <SkeletonRows count={4} />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="sd-wrap">
        <p className="sd-empty">No results for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="sd-wrap" role="listbox" aria-label="Search results">

      {hasSongs && (
        <>
          <p className="sd-section-title">Songs</p>
          {songs.map((song) => (
            <button
              key={song._id}
              className="sd-item"
              onClick={() => handleSongClick(song, songs)}
              role="option"
              aria-label={`Play ${song.title}`}
            >
              {song.coverImage
                ? <img src={song.coverImage} alt={song.title} className="sd-thumb" />
                : <span className="sd-thumb-fallback"><MusicIcon /></span>
              }
              <span className="sd-text">
                <span className="sd-name">{song.title}</span>
                {song.artist?.length > 0 && (
                  <span className="sd-sub">
                    {song.artist.map(a => a.name).join(', ')}
                  </span>
                )}
              </span>
              {song.duration && (
                <span className="sd-duration">{formatDuration(song.duration)}</span>
              )}
              <span className="sd-play-icon"><PlayIcon /></span>
            </button>
          ))}
        </>
      )}

      {hasSongs && hasArtists && <div className="sd-divider" />}

      {hasArtists && (
        <>
          <p className="sd-section-title">Artists</p>
          {artists.map((artist) => (
            <button
              key={artist._id}
              className="sd-item"
              onClick={() => handleArtistClick(artist)}
              role="option"
              aria-label={`View artist ${artist.name}`}
            >
              {artist.profileImageURL
                ? <img src={artist.profileImageURL} alt={artist.name} className="sd-thumb sd-thumb-artist" />
                : <span className="sd-thumb-fallback sd-thumb-fallback--artist"><UserIcon /></span>
              }
              <span className="sd-text">
                <span className="sd-name">{artist.name}</span>
                <span className="sd-sub">Artist</span>
              </span>
              <span className="sd-arrow"><ArrowIcon /></span>
            </button>
          ))}
        </>
      )}

    </div>
  );
}

export default SearchDropdown;
