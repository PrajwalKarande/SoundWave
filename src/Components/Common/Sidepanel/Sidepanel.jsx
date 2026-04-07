// src/Components/Sidepanel/Sidepanel.jsx
import { forwardRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    Library,
    PlusSquare,
    UserCog,
    MicVocal,
    X,
    Loader2
} from 'lucide-react';
import { useAuth } from '../../../Context/AuthContextProvider';
import { CreatePlaylist } from '../../CreatePlaylist';
import { getPlaylist } from '../../../Services/playlistService';
import PlaylistSection from './PlaylistSection';

const Sidepanel = forwardRef(function Sidepanel({ isOpen, onClose, setSidebarOpen, width = 256 }, ref) {
    const location = useLocation();
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        setLoading(true);
        getPlaylist()
            .then(data => setPlaylists(data.data || data || []))
            .catch(err => console.error('Error fetching playlists:', err))
            .finally(() => setLoading(false));
    }, [user, refreshKey]);

    const handleCreated = () => {
        setShowCreatePlaylist(false);
        setRefreshKey(k => k + 1);
    };

    const adminItems = [
        { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
        { path: '/admin/manage/songs', icon: PlusSquare, label: 'Songs' },
        { path: '/admin/manage/users', icon: UserCog, label: 'Users' },
        { path: '/admin/manage/artists', icon: MicVocal, label: 'Artists' },
    ];

    const baseClasses = 'sidepanel-font bg-section-bg text-accent h-full p-2 flex flex-col rounded-2xl overflow-hidden';

    const navContent = user?.role === 'admin' ? (
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
                <div className='flex items-center gap-2'>
                    <Library size={20} />
                    <span className="font-semibold text-sm">Your Library</span>
                </div>
                <button
                    className='text-muted-text rounded-full hover:text-accent hover:bg-primary-bg/50 p-1 transition-colors'
                    onClick={() => setShowCreatePlaylist(true)}
                    title="New Playlist"
                >
                    <PlusSquare size={20} />
                </button>
            </div>

            {/* Playlist list — scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0 border-t border-muted-text/15 pt-3 hide-scrollbar">
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
                <div className="flex flex-col p-6 text-left m-4 gap-2 bg-primary-bg rounded-2xl hover:bg-accent transition-colors cursor-pointer">
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
            {/* Desktop sidebar — width driven by prop */}
            <aside
                ref={ref}
                className={`hidden md:flex ${baseClasses}`}
                style={{ width: `${width}px`, minWidth: `${width}px` }}
            >
                {navContent}
            </aside>

            {/* Mobile overlay drawer */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 z-60">
                    <div
                        className="absolute inset-0 bg-primary-bg/60"
                        onClick={onClose}
                    />
                    <aside className={`absolute left-2 top-2 bottom-2 w-64 ${baseClasses} overflow-y-auto`}>
                        <div className="flex justify-end px-2 pt-2">
                            <button
                                onClick={onClose}
                                className="p-1 text-muted-text hover:text-primary-text transition-colors"
                                aria-label="Close menu"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {navContent}
                    </aside>
                </div>
            )}

            {/* Create Playlist Modal */}
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
