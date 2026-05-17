import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music2, ListMusic, CalendarDays } from 'lucide-react';
import { useAuth } from '../../Context/AuthContextProvider';
import { usePlaylist } from '../../Context/PlaylistContext';
import './UserProfile.css';

const GRADIENT_COLORS = [
    '#7C3AED', '#DC2626', '#2563EB', '#059669',
    '#D97706', '#DB2777', '#0891B2', '#06C9E0',
    '#7C2D12', '#065F46', '#1E3A8A', '#831843',
];

const COVER_TINTS = [
    'bg-violet-900/60', 'bg-rose-900/60',   'bg-blue-900/60',
    'bg-emerald-900/60','bg-amber-900/60',   'bg-pink-900/60',
    'bg-cyan-900/60',   'bg-orange-900/60',
];

const SARCASTIC_ROLES = [
    'main character energy',
    'citizen of the aux cord',
    'professional playlist curator',
    'unhinged music listener',
    'vibing unironically',
];

function seedFromStr(str) {
    return str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

function formatJoinDate(dateStr) {
    if (!dateStr) return 'forever ago';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return 'forever ago';
        return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
        return 'forever ago';
    }
}

/* ── Playlist card ── */
function PlaylistCard({ playlist, index }) {
    const tint    = COVER_TINTS[index % COVER_TINTS.length];
    const count   = playlist.songs?.length ?? 0;

    return (
        <Link to={`/playlist/${playlist._id}`} className="up-card group">
            <div className={`up-cover ${tint}`}>
                {playlist.coverImage ? (
                    <img
                        src={playlist.coverImage}
                        alt={playlist.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Music2 size={26} className="text-white/25" />
                )}
            </div>
            <div className="mt-2.5 min-w-0">
                <p className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">
                    {playlist.name}
                </p>
                <p className="text-xs text-white/30 mt-0.5">
                    {count} {count === 1 ? 'song' : 'songs'}
                </p>
            </div>
        </Link>
    );
}

/* ── Skeleton ── */
function Skeleton() {
    return (
        <div className="relative min-h-full animate-pulse">
            <div className="h-72 bg-white/5" />
            <div className="px-6 pt-6 space-y-4">
                <div className="h-4 w-32 bg-white/5 rounded" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i}>
                            <div className="aspect-square bg-white/5 rounded-xl" />
                            <div className="mt-2 h-3 w-20 bg-white/5 rounded" />
                            <div className="mt-1.5 h-2.5 w-12 bg-white/5 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── Empty state ── */
function EmptyPlaylists() {
    return (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <Music2 size={28} className="text-white/20" />
            </div>
            <div>
                <p className="text-sm font-medium text-white/40">no playlists yet</p>
                <p className="text-xs text-white/20 mt-1">
                    the audacity of having zero playlists, bestie
                </p>
            </div>
        </div>
    );
}

/* ── Main component ── */
export default function UserProfile() {
    const { user, loading: authLoading } = useAuth();
    const { playlists, loading: playlistLoading } = usePlaylist();
    const navigate = useNavigate();

    const gradientColor = useMemo(() => {
        if (!user?._id) return '#06C9E0';
        return GRADIENT_COLORS[seedFromStr(user._id) % GRADIENT_COLORS.length];
    }, [user?._id]);

    const sarcasticRole = useMemo(() => {
        if (!user?.username) return SARCASTIC_ROLES[0];
        return SARCASTIC_ROLES[seedFromStr(user.username) % SARCASTIC_ROLES.length];
    }, [user?.username]);

    if (authLoading) return <Skeleton />;
    if (!user) { navigate('/login', { replace: true }); return null; }

    return (
        <div className="relative min-h-full">

            {/* ── Gradient header ── */}
            <div
                style={{
                    background: `linear-gradient(to bottom, ${gradientColor}cc 0%, ${gradientColor}55 52%, transparent 100%)`,
                }}
            >
                <div className="flex flex-col sm:flex-row items-end gap-6 p-6 pb-4">

                    {/* Avatar */}
                    <div
                        className="up-avatar"
                        style={{
                            background: `linear-gradient(135deg, ${gradientColor}88, ${gradientColor}22)`,
                            boxShadow:  `0 10px 40px rgba(0,0,0,0.6), 0 0 60px ${gradientColor}55`,
                        }}
                    >
                        <span className="up-avatar-letter">
                            {user.username[0].toUpperCase()}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 pb-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                            {sarcasticRole}
                        </p>
                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3 truncate">
                            {user.username}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-white/60 flex-wrap">
                            <span className="flex items-center gap-1.5">
                                <ListMusic size={13} className="text-white/35" />
                                {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CalendarDays size={13} className="text-white/35" />
                                surviving the algorithm since {formatJoinDate(user.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Playlist section ── */}
            <div className="px-6 pt-6 pb-10">

                {/* Section header */}
                <div className="mb-5">
                    <h2 className="text-sm font-semibold text-white/85">the playlist arc</h2>
                    <p className="text-xs text-white/28 mt-0.5">
                        {playlists.length === 0
                            ? 'no playlists detected. the silence is deafening.'
                            : `${playlists.length} playlist${playlists.length !== 1 ? 's' : ''} and counting, no cap`
                        }
                    </p>
                </div>

                {/* Grid */}
                {playlistLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i}>
                                <div className="aspect-square bg-white/5 rounded-xl" />
                                <div className="mt-2 h-3 w-20 bg-white/5 rounded" />
                                <div className="mt-1.5 h-2.5 w-12 bg-white/5 rounded" />
                            </div>
                        ))}
                    </div>
                ) : playlists.length === 0 ? (
                    <EmptyPlaylists />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {playlists.map((playlist, i) => (
                            <PlaylistCard key={playlist._id} playlist={playlist} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
