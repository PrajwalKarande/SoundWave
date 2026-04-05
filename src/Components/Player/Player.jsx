import { useEffect } from 'react';
import { usePlayer } from '../../Context/PlayerContext';
import './Player.css';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Music,
  ListMusic,
} from 'lucide-react';

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function Player() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    queue,
    queueIndex,
    togglePlay,
    seek,
    playNext,
    playPrev,
    playAtIndex,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
  } = usePlayer();

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Spacebar play/pause shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore spacebar if user is typing in an input/textarea
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scrolling
        if (currentSong) {
          togglePlay();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSong, togglePlay]);

  const handleSeek = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    seek(percent * duration);
  };

  const handleVolumeChange = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    setVolume(percent);
  };

  const artistName = currentSong
    ? typeof currentSong.artist === 'string'
      ? currentSong.artist
      : Array.isArray(currentSong.artist)
        ? currentSong.artist.map((a) => a.name || a).join(', ')
        : 'Unknown Artist'
    : '';

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  return (
    <div className={`player-panel ${currentSong ? 'player-panel--active' : ''}`}>
      <div className="player-panel-inner">
        {currentSong ? (
          <>
            {currentSong.coverImage && (
              <div
                className="player-bg-blur"
                style={{ backgroundImage: `url(${currentSong.coverImage})` }}
              />
            )}
            <div className="player-bg-overlay" />

            <div className="player-artwork-wrap">
              <div className={`player-artwork ${isPlaying ? 'player-artwork--playing' : ''}`}>
                {currentSong.coverImage ? (
                  <img
                    src={currentSong.coverImage}
                    alt={currentSong.title}
                    className="player-artwork-img"
                  />
                ) : (
                  <div className="player-artwork-placeholder">
                    <Music size={52} />
                  </div>
                )}
              </div>
            </div>

            <div className="player-info">
              <p className="player-title">{currentSong.title}</p>
              <p className="player-artist">{artistName}</p>
            </div>

            <div className="player-progress-section">
              <div className="player-progress-bar" onClick={handleSeek}>
                <div className="player-progress-track">
                  <div
                    className="player-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                  <div
                    className="player-progress-thumb"
                    style={{ left: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="player-times">
                <span className="player-time">{formatTime(currentTime)}</span>
                <span className="player-time">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="player-controls">
              <button
                className={`player-btn player-btn--sm ${isShuffled ? 'player-btn--active' : ''}`}
                onClick={toggleShuffle}
                title="Shuffle"
              >
                <Shuffle size={16} />
              </button>

              <button className="player-btn" onClick={playPrev} title="Previous">
                <SkipBack size={22} fill="currentColor" />
              </button>

              <button
                className="player-btn player-btn--play"
                onClick={togglePlay}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={22} fill="currentColor" />
                ) : (
                  <Play size={22} fill="currentColor" style={{ marginLeft: '2px' }} />
                )}
              </button>

              <button className="player-btn" onClick={playNext} title="Next">
                <SkipForward size={22} fill="currentColor" />
              </button>

              <button
                className={`player-btn player-btn--sm ${repeatMode !== 'off' ? 'player-btn--active' : ''}`}
                onClick={cycleRepeat}
                title={`Repeat: ${repeatMode}`}
              >
                <RepeatIcon size={16} />
              </button>
            </div>

            {/* Volume */}
            <div className="player-volume">
              <button className="player-btn player-btn--sm" onClick={toggleMute} title="Volume">
                {isMuted || volume === 0 ? (
                  <VolumeX size={16} />
                ) : volume < 0.5 ? (
                  <Volume1 size={16} />
                ) : (
                  <Volume2 size={16} />
                )}
              </button>
              <div className="player-volume-bar" onClick={handleVolumeChange}>
                <div className="player-volume-track">
                  <div
                    className="player-volume-fill"
                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                  <div
                    className="player-volume-thumb"
                    style={{ left: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Queue */}
            {queue.length > 1 && (
              <div className="player-queue">
                <div className="player-queue-header">
                  <ListMusic size={13} />
                  <span>Queue · {queue.length}</span>
                </div>
                <div className="player-queue-list">
                  {queue.map((song, i) => {
                    const isActive = i === queueIndex;
                    const qArtist = typeof song.artist === 'string'
                      ? song.artist
                      : Array.isArray(song.artist)
                        ? song.artist.map((a) => a.name || a).join(', ')
                        : '';
                    return (
                      <div
                        key={song._id || i}
                        className={`player-queue-item ${isActive ? 'player-queue-item--active' : ''}`}
                        onClick={() => playAtIndex(i)}
                      >
                        <div className="player-queue-cover">
                          {song.coverImage
                            ? <img src={song.coverImage} alt={song.title} className="player-queue-cover-img" />
                            : <Music size={13} />
                          }
                          {isActive && isPlaying && (
                            <div className="player-queue-eq">
                              <span /><span /><span />
                            </div>
                          )}
                        </div>
                        <div className="player-queue-info">
                          <p className="player-queue-title">{song.title}</p>
                          {qArtist && <p className="player-queue-artist">{qArtist}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
