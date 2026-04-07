import { Link, useLocation } from 'react-router-dom';
import { Music2 } from 'lucide-react';

// Subtle dark tints — one per playlist slot, cycling
const TINTS = [
  'bg-orange-950/70',
  'bg-indigo-950/70',
  'bg-teal-950/70',
  'bg-rose-950/70',
  'bg-amber-950/70',
  'bg-sky-950/70',
  'bg-violet-950/70',
  'bg-emerald-950/70',
];

export default function PlaylistSection({ playlists, onNavigate }) {
  const location = useLocation();

  if (!playlists?.length) {
    return (
      <p className="px-3 py-3 text-xs text-muted-text/50 italic">
        No playlists yet. Hit + to create one.
      </p>
    );
  }

  return (
    <ul className="space-y-0.5">
      {playlists.map((playlist, i) => {
        const isActive = location.pathname === `/playlist/${playlist._id}`;
        const tint = TINTS[i % TINTS.length];
        const songCount = playlist.songs?.length ?? playlist.songCount ?? null;

        return (
          <li key={playlist._id}>
            <Link
              to={`/playlist/${playlist._id}`}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-150 group ${
                isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-muted-text hover:bg-primary-bg/60 hover:text-primary-text'
              }`}
            >
              {/* Cover or icon */}
              <div
                className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center overflow-hidden ${tint} ${
                  isActive ? 'ring-1 ring-accent/40' : ''
                }`}
              >
                {playlist.coverImage ? (
                  <img
                    src={playlist.coverImage}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music2
                    size={15}
                    className={`transition-colors ${
                      isActive
                        ? 'text-accent'
                        : 'text-muted-text/60 group-hover:text-primary-text/70'
                    }`}
                  />
                )}
              </div>

              {/* Name + count */}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium truncate leading-tight transition-colors ${
                    isActive
                      ? 'text-accent'
                      : 'text-primary-text/90 group-hover:text-accent'
                  }`}
                >
                  {playlist.name}
                </p>
                {songCount !== null && (
                  <p className="text-xs text-muted-text/50 leading-tight mt-0.5">
                    {songCount} {songCount === 1 ? 'song' : 'songs'}
                  </p>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
