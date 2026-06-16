// src/Components/Sidepanel/Sidepanel.jsx
import { forwardRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    ArrowRightToLine,
    Library,
    PlusSquare,
    UserCog,
    MicVocal,
    X,
    Loader2,
    Music2,
    Info,
    Heart,
} from 'lucide-react';
import { useAuth } from '../../../Context/AuthContextProvider';
import { usePlaylist } from '../../../Context/PlaylistContext';
import { CreatePlaylist } from '../../Playlist/CreatePlaylist';
import PlaylistSection from './PlaylistSection';

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

const adminItems = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/manage/songs', icon: PlusSquare, label: 'Songs' },
    { path: '/admin/manage/users', icon: UserCog, label: 'Users' },
    { path: '/admin/manage/artists', icon: MicVocal, label: 'Artists' },
];

const Sidepanel = forwardRef(function Sidepanel(
    { isOpen, onClose, setSidebarOpen, width = 256, collapsed = false, onToggle },
    ref
) {
    const location = useLocation();
    const { user } = useAuth();
    const { playlists, loading, addPlaylist } = usePlaylist();
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleCreated = (result) => {
        setShowCreatePlaylist(false);
        addPlaylist(result);
    };

    const baseClasses = 'work-sans bg-section-bg text-accent h-full flex flex-col rounded-lg overflow-hidden';

    const miniBar = (
        <>
            <button
                onClick={onToggle}
                className="flex items-center justify-center py-3 shrink-0 text-accent hover:text-primary-text transition-colors"
                title="Expand sidebar"
            >
                <ArrowRightToLine size={20} />
            </button>

            <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col items-center gap-1 px-2 pb-1 py-1">
                {user?.role !== 'admin' && (
                    <Link
                        to="/liked"
                        title="Liked Songs"
                        onClick={onClose}
                        className={`w-9 h-9 shrink-0 rounded-lg overflow-hidden flex items-center justify-center ${isActive('/liked') ? 'ring-1 ring-rose-400/50' : ''}`}
                        style={{ background: 'linear-gradient(135deg, #be185d 0%, #7c3aed 100%)' }}
                    >
                        <Heart size={14} fill="white" className="text-white" />
                    </Link>
                )}
                {user?.role === 'admin'
                    ? adminItems.map(({ path, icon: Icon, label }) => (
                        <Link
                            key={path}
                            to={path}
                            title={label}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${isActive(path)
                                    ? 'text-accent bg-accent/10'
                                    : 'text-muted-text hover:text-accent hover:bg-primary-bg/50'
                                }`}
                        >
                            <Icon size={20} />
                        </Link>
                    ))
                    : playlists.map((playlist, i) => {
                        const tint = TINTS[i % TINTS.length];
                        return (
                            <Link
                                key={playlist._id}
                                to={`/playlist/${playlist._id}`}
                                onClick={onClose}
                                title={playlist.name}
                                className={`w-9 h-9 shrink-0 rounded-lg overflow-hidden flex items-center justify-center ${tint} ${isActive(`/playlist/${playlist._id}`) ? 'ring-1 ring-accent/40' : ''
                                    }`}
                            >
                                {playlist.coverImage ? (
                                    <img
                                        src={playlist.coverImage}
                                        alt={playlist.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Music2 size={14} className="text-muted-text/60" />
                                )}
                            </Link>
                        );
                    })
                }
            </div>

            <Link
                to="/about"
                title="About SoundWave"
                className={`w-9 h-9 mb-1 mx-auto flex items-center justify-center rounded-lg transition-colors ${
                    isActive('/about') ? 'text-accent bg-accent/10' : 'text-muted-text/30 hover:text-muted-text hover:bg-primary-bg/50'
                }`}
            >
                <Info size={16} />
            </Link>
        </>
    );

    const fullContent = user?.role === 'admin' ? (
        <nav className="flex-1 px-2 py-6">
            <ul className="space-y-2">
                {adminItems.map(({ path, icon: Icon, label }) => (
                    <li key={path}>
                        <Link
                            to={path}
                            onClick={onClose}
                            className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${isActive(path)
                                    ? 'text-accent'
                                    : 'text-muted-text hover:text-accent hover:bg-primary-bg/50'
                                }`}
                        >
                            <Icon size={24} />
                            <span className="font-semibold">{label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    ) : user ? (
        <div className="flex-1 flex flex-col min-h-0 px-2 py-3">
            {/* Library header */}
            <div className='flex justify-between items-center px-3 py-2 rounded-lg text-accent mb-1'>
                <button
                    onClick={onToggle}
                    className='flex items-center gap-2 hover:text-primary-text transition-colors'
                    title="Collapse sidebar"
                >
                    <Library size={24} />
                    <span className="font-semibold text-lg">Your Library</span>
                </button>
                <button
                    className='text-muted-text rounded-full hover:text-accent hover:bg-primary-bg/50 p-1 transition-colors'
                    onClick={() => setShowCreatePlaylist(true)}
                    title="New Playlist"
                >
                    <PlusSquare size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 border-t border-muted-text/15 pt-3 hide-scrollbar">
                <Link
                    to="/liked"
                    onClick={onClose}
                    className={`flex items-center gap-3 px-2 py-2 rounded-xl transition-all duration-150 mb-1 group ${
                        isActive('/liked')
                            ? 'bg-rose-500/10 text-rose-300'
                            : 'text-muted-text hover:bg-primary-bg/60 hover:text-primary-text'
                    }`}
                >
                    <div
                        className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #be185d 0%, #7c3aed 100%)' }}
                    >
                        <Heart size={15} fill="white" className="text-white" />
                    </div>
                    <p className={`text-lg font-medium truncate leading-tight transition-colors ${
                        isActive('/liked') ? 'text-rose-300' : 'text-primary-text/90 group-hover:text-accent'
                    }`}>
                        Liked Songs
                    </p>
                </Link>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin text-muted-text" size={20} />
                    </div>
                ) : (
                    <PlaylistSection playlists={playlists} onNavigate={onClose} />
                )}
            </div>
        </div>
    ) : (
        <div className="p-2">
            <Link to="/signup" onClick={onClose}>
                <div className="flex flex-col p-6 text-left m-4 gap-2 bg-primary-bg rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <h1 className="text-primary-text">Amplify Your Experience</h1>
                    <i className="text-sm text-muted-text mt-1 hover:text-primary-bg transition-colors">
                        create your profile and evolve your personal Soundwave :)
                    </i>
                </div>
            </Link>
        </div>
    );

    return (
        <>
            <aside
                ref={ref}
                className={`hidden md:flex ${baseClasses} transition-[width,min-width,padding] duration-200 ease-in-out`}
                style={collapsed
                    ? { width: '52px', minWidth: '52px', padding: '4px' }
                    : { width: `${width}px`, minWidth: `${width}px`, padding: '8px' }
                }
            >
                {collapsed ? miniBar : fullContent}
                {!collapsed && (
                    <div className="px-2 pb-1 border-t border-muted-text/10 pt-2">
                        <Link
                            to="/about"
                            onClick={onClose}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                                isActive('/about')
                                    ? 'text-accent'
                                    : 'text-muted-text/35 hover:text-muted-text hover:bg-primary-bg/30'
                            }`}
                        >
                            <Info size={13} />
                            <span>About SoundWave</span>
                        </Link>
                    </div>
                )}
            </aside>

            {isOpen && (
                <div className="md:hidden fixed inset-0 z-60">
                    <div
                        className="absolute inset-0 bg-primary-bg/60"
                        onClick={onClose}
                    />
                    <aside className={`absolute left-2 top-2 bottom-2 w-64 p-2 ${baseClasses} overflow-y-auto`}>
                        <div className="flex justify-end px-2 pt-2">
                            <button
                                onClick={onClose}
                                className="p-1 text-muted-text hover:text-primary-text transition-colors"
                                aria-label="Close menu"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {fullContent}
                        <div className="px-2 pb-2 border-t border-muted-text/10 pt-2 mt-auto">
                            <Link
                                to="/about"
                                onClick={onClose}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                                    isActive('/about')
                                        ? 'text-accent'
                                        : 'text-muted-text/35 hover:text-muted-text hover:bg-primary-bg/30'
                                }`}
                            >
                                <Info size={13} />
                                <span>About SoundWave</span>
                            </Link>
                        </div>
                    </aside>
                </div>
            )}

            {showCreatePlaylist && (
                <CreatePlaylist
                    onClose={() => setShowCreatePlaylist(false)}
                    onCreated={handleCreated}
                />
            )}
        </>
    );
});

export default Sidepanel;
