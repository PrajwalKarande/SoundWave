import { ChevronLeft, ChevronRight, Music, User, Play, Pause } from 'lucide-react';
import { useRef } from 'react';
import { usePlayer } from '../../Context/PlayerContext';
import { useAuth } from '../../Context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';

function SkeletonCard({ round }) {
  return (
    <div className="shrink-0 p-4 animate-pulse">
      <div className={`w-40 h-40 bg-white/5 mb-2 ${round ? 'rounded-full' : 'rounded-sm'}`} />
      <div className="h-3.5 w-28 bg-white/5 rounded mb-1.5" />
      <div className="h-3 w-20 bg-white/3 rounded" />
    </div>
  );
}

export default function HorizontalList({ title, items = [], type = 'song', loading = false }) {
  const scrollRef = useRef(null);
  const { playSong, togglePlay, currentSong, isPlaying } = usePlayer();
  const { user } = useAuth();
  const isSong = type === 'song';
  const safeItems = Array.isArray(items) ? items : [];
  const displayItems = isSong ? safeItems.slice(0, 10) : safeItems;
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 220;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleSongClick = (song, index) => {
    if(!user) {
      navigate('/login')
      return;
    }
    if (!isSong) return;
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      playSong(song, displayItems, index);
    }
  };

  if (!loading && displayItems.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between">
        {loading
          ? <div className="h-7 w-40 bg-white/5 rounded animate-pulse" />
          : <h2 className="text-2xl font-bold text-primary-text">{title}</h2>
        }
      </div>

      {loading ? (
        <div className="flex overflow-hidden p-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} round={!isSong} />
          ))}
        </div>
      ) : (
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide p-3 list-fade-in"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayItems.map((item, index) => {
          const isCurrentlyPlaying = isSong && currentSong?._id === item._id && isPlaying;
          return (
            <div
              key={item._id}
              className="shrink-0 w-fit group cursor-pointer p-4 rounded-lg transition-all duration-300 ease-out 
           hover:bg-white/5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] 
           hover:-translate-y-2 hover:scale-[1.02] 
           active:scale-[0.98] active:duration-75"
              onClick={() => {
                if(isSong)handleSongClick(item, index)
                else navigate(`/artist/${item._id}`)
              }}
            >
              <div className="relative">
                <div
                  className={`w-40 h-40 overflow-hidden mb-2 ${
                    isSong ? 'rounded-sm' : 'rounded-full'
                  }`}
                >
                  {item.coverImage || item.profileImageURL ? (
                    <img
                      src={item.coverImage || item.profileImageURL}
                      alt={item.title || item.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-section-bg flex items-center justify-center">
                      {isSong ? (
                        <Music size={40} className="text-muted-text" />
                      ) : (
                        <User size={40} className="text-muted-text" />
                      )}
                    </div>
                  )}
                </div>
                {isSong && (
                  <button
                    className={`absolute bottom-4 right-2 w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-black/40 transition-all duration-200 ${
                      isCurrentlyPlaying
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSongClick(item, index);
                    }}
                  >
                    {isCurrentlyPlaying ? <Pause size={18} fill="white" className="text-white" /> : <Play size={18} fill="white" className="text-white ml-0.5" />}
                  </button>
                )}
              </div>
              <p className="text-sm font-medium text-primary-text text-left group-hover:text-accent transition-colors hover:underline w-40 truncate">
                {item.title || item.name}
              </p>
              {isSong && item.artist?.[0]?.name && (
                <p className="text-xs text-muted-text text-left hover:underline w-40 truncate">
                  {typeof item.artist === 'string' ? item.artist : item.artist[0].name}
                </p>
              )}
            </div>
          );
        })}
      </div>
      )}
    </section>
  );
}

