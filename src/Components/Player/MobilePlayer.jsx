import { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../../Context/PlayerContext';
import { useLikedSongs } from '../../Context/LikedSongsContext';
import { useToast } from '../../Context/ToastContext';
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1, Music, ChevronDown, Heart,
} from 'lucide-react';

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
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

export default function MobilePlayer() {
  const [open, setOpen] = useState(false);
  const prevSongIdRef = useRef(null);
  const dragStartY = useRef(null);
  const dragStarted = useRef(false);

  const {
    currentSong, isPlaying, currentTime, duration,
    isShuffled, repeatMode,
    togglePlay, seek, playNext, playPrev,
    toggleShuffle, cycleRepeat,
  } = usePlayer();

  // Auto-open full-screen when a new song is selected from null state
  useEffect(() => {
    if (currentSong && prevSongIdRef.current === null) {
      setOpen(true);
    }
    prevSongIdRef.current = currentSong?._id ?? null;
  }, [currentSong]);

  const { isLiked, toggleLike } = useLikedSongs();
  const toast = useToast();
  const liked = currentSong ? isLiked(currentSong._id) : false;

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentSong) return;
    await toggleLike(currentSong._id, {
      onSuccess: (nowLiked) => toast.success(nowLiked ? 'Added to Liked Songs' : 'Removed from Liked Songs'),
      onError: () => toast.error('Failed to update liked status'),
    });
  };

  if (!currentSong) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const artistName = getArtistName(currentSong.artist);
  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  // Seek handler — works for both mouse and touch
  const handleSeek = (e) => {
    e.stopPropagation();
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    seek(percent * duration);
  };

  // Swipe-to-dismiss — only initiated from the top drag-handle zone
  const onHandleTouchStart = (e) => {
    dragStartY.current = e.touches[0].clientY;
    dragStarted.current = false;
  };
  const onHandleTouchMove = (e) => {
    if (e.touches[0].clientY - dragStartY.current > 10) dragStarted.current = true;
  };
  const onHandleTouchEnd = (e) => {
    if (dragStarted.current && e.changedTouches[0].clientY - dragStartY.current > 80) {
      setOpen(false);
    }
    dragStarted.current = false;
  };

  return (
    <>
      {/* ── Mini bar ── */}
      <div
        className="min-[900px]:hidden fixed bottom-0 left-0 right-0 z-40 h-16 px-3 flex items-center gap-3 cursor-pointer select-none"
        style={{
          background: 'rgba(13, 15, 20, 0.93)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}
        onClick={() => setOpen(true)}
      >
        {/* Album cover */}
        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white/5">
          {currentSong.coverImage
            ? <img src={currentSong.coverImage} alt={currentSong.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"><Music size={16} className="text-white/30" /></div>
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate leading-tight">{currentSong.title}</p>
          <p className="text-xs text-white/45 truncate mt-0.5">{artistName}</p>
        </div>

        {/* Like */}
        <button
          className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform"
          style={{ color: liked ? '#f87171' : 'rgba(255,255,255,0.45)' }}
          onClick={handleLike}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <Heart size={20} fill={liked ? 'currentColor' : 'none'} strokeWidth={liked ? 2 : 1.5} />
        </button>

        {/* Play/Pause */}
        <button
          className="w-10 h-10 flex items-center justify-center text-white active:scale-90 transition-transform"
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying
            ? <Pause size={22} fill="currentColor" />
            : <Play size={22} fill="currentColor" style={{ marginLeft: '2px' }} />
          }
        </button>

        {/* Next */}
        <button
          className="w-10 h-10 flex items-center justify-center text-white/60 active:scale-90 transition-transform"
          onClick={(e) => { e.stopPropagation(); playNext(); }}
          aria-label="Next"
        >
          <SkipForward size={20} fill="currentColor" />
        </button>

        {/* Thin progress line at bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/8">
          <div
            className="h-full bg-accent transition-[width] duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Full-screen player sheet ── */}
      <div
        className={`min-[900px]:hidden fixed inset-0 z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
        style={{ background: '#0d0f14' }}
      >
        {/* Ambient blurred cover behind everything */}
        {currentSong.coverImage && (
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${currentSong.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(72px) saturate(1.5)',
              transform: 'scale(1.6)',
              opacity: 0.28,
            }}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(13,15,20,0.55) 0%, rgba(13,15,20,0.72) 100%)' }}
        />

        {/* Scrollable content */}
        <div
          className="relative flex flex-col h-full px-6 overflow-y-auto hide-scrollbar"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}
        >
          {/* Drag handle + header — swipe-to-dismiss zone */}
          <div
            onTouchStart={onHandleTouchStart}
            onTouchMove={onHandleTouchMove}
            onTouchEnd={onHandleTouchEnd}
          >
            {/* Visual pill handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Top bar */}
            <div className="flex items-center justify-between py-2 mb-1">
              <button
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white active:scale-95 transition-all"
                onClick={() => setOpen(false)}
                aria-label="Close player"
              >
                <ChevronDown size={28} />
              </button>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/35">Now Playing</p>
              <div className="w-10" />
            </div>
          </div>

          {/* Album artwork */}
          <div className="flex items-center justify-center py-6">
            <div
              className={`rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 ${
                isPlaying ? 'scale-100' : 'scale-[0.92]'
              }`}
              style={{
                width: 'min(74vw, 320px)',
                height: 'min(74vw, 320px)',
                boxShadow: currentSong.coverImage
                  ? '0 28px 80px rgba(0,0,0,0.65), 0 0 60px rgba(255,67,19,0.2)'
                  : '0 28px 80px rgba(0,0,0,0.5)',
              }}
            >
              {currentSong.coverImage
                ? <img src={currentSong.coverImage} alt={currentSong.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center bg-white/5"><Music size={64} className="text-white/20" /></div>
              }
            </div>
          </div>

          {/* Song info */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-white truncate leading-tight">{currentSong.title}</p>
              <p className="text-sm text-white/45 truncate mt-1">{artistName}</p>
            </div>
            <button
              className="w-11 h-11 flex items-center justify-center shrink-0 active:scale-90 transition-all"
              style={{ color: liked ? '#f87171' : 'rgba(255,255,255,0.35)' }}
              onClick={handleLike}
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              <Heart size={24} fill={liked ? 'currentColor' : 'none'} strokeWidth={liked ? 2 : 1.5} style={{ transition: 'all 0.2s ease' }} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div
              className="relative h-10 flex items-center cursor-pointer group"
              onClick={handleSeek}
            >
              <div className="w-full h-1 bg-white/15 rounded-full group-active:h-1.5 transition-all">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute w-3 h-3 rounded-full bg-white shadow-md top-1/2"
                  style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-white/35 tabular-nums -mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center justify-between mb-6">
            <button
              className={`w-11 h-11 flex items-center justify-center rounded-full active:scale-90 transition-all ${
                isShuffled ? 'text-accent' : 'text-white/40 hover:text-white'
              }`}
              onClick={toggleShuffle}
              aria-label="Shuffle"
            >
              <Shuffle size={21} />
            </button>

            <button
              className="w-12 h-12 flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition-all"
              onClick={playPrev}
              aria-label="Previous"
            >
              <SkipBack size={30} fill="currentColor" />
            </button>

            <button
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center active:scale-90 transition-transform shadow-xl"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying
                ? <Pause size={28} fill="#0d0f14" className="text-[#0d0f14]" />
                : <Play size={28} fill="#0d0f14" className="text-[#0d0f14]" style={{ marginLeft: '3px' }} />
              }
            </button>

            <button
              className="w-12 h-12 flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition-all"
              onClick={playNext}
              aria-label="Next"
            >
              <SkipForward size={30} fill="currentColor" />
            </button>

            <button
              className={`w-11 h-11 flex items-center justify-center rounded-full active:scale-90 transition-all ${
                repeatMode !== 'off' ? 'text-accent' : 'text-white/40 hover:text-white'
              }`}
              onClick={cycleRepeat}
              aria-label={`Repeat: ${repeatMode}`}
            >
              <RepeatIcon size={21} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
