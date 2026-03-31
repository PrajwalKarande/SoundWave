import { ChevronLeft, ChevronRight, Music, User } from 'lucide-react';
import { useRef } from 'react';

export default function HorizontalList({ title, items = [], type = 'song' }) {
  const scrollRef = useRef(null);
  const isSong = type === 'song';
  const displayItems = isSong ? items.slice(0, 10) : items;

  
  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 220;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (displayItems.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary-text">{title}</h2>
        <span className='h-[0.5px] bg-amber-600 w-2xl'></span>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full border border-amber-600 bg-section-bg hover:bg-muted-text/20 text-muted-text transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full border border-amber-600 bg-section-bg hover:bg-muted-text/20 text-muted-text transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayItems.map((item) => (
          <div
            key={item._id}
            className="shrink-0 w-fit group cursor-pointer hover:bg-[#2a2d3b] p-4 rounded-2xl transition-colors"
          >
            <div
              className={`w-40 h-40 overflow-hidden mb-2 ${
                isSong ? 'rounded-lg' : 'rounded-full'
              }`}
            >
              {item.coverImage || item.profileImageURL ? (
                <img
                  src={item.coverImage || item.profileImageURL}
                  alt={item.title || item.name}
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
            <p className="text-sm font-medium text-primary-text text-left group-hover:text-accent transition-colors">
              {item.title || item.name}
            </p>
            {isSong && item.artist[0].name && (
              <p className="text-xs text-muted-text text-left">
                {typeof item.artist === 'string' ? item.artist : item.artist[0].name}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
