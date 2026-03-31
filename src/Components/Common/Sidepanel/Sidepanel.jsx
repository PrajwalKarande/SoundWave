// src/Components/Sidepanel/Sidepanel.jsx
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    Search,
    Library,
    PlusSquare,
    UserCog,
    Heart,
    MicVocal,
    X
} from 'lucide-react';
import { useAuth } from '../../../Context/AuthContextProvider';

function Sidepanel({ isOpen, onClose }) {
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/home', icon: Home, label: 'Home' },
        { path: '/search', icon: Search, label: 'Search' },
        { path: '/library', icon: Library, label: 'Your Library' },
    ];

    const libraryItems = [
        { path: '/create-playlist', icon: PlusSquare, label: 'Create Playlist' },
        { path: '/liked-songs', icon: Heart, label: 'Liked Songs' },
    ];

    const adminItems = [
        { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
        { path: '/admin/manage/songs', icon: PlusSquare, label: 'Songs' },
        { path: '/admin/manage/users', icon: UserCog, label: 'Users' },
        { path: '/admin/manage/artists', icon: MicVocal, label: 'Artists' },
    ];

    const sidebarClasses = 'sidepanel-font bg-section-bg text-accent w-64 h-[calc(100vh-6rem)] p-2 flex flex-col rounded-2xl';

    const navContent = user?.role === 'admin' ? (
        <nav className="flex-1 px-2 py-6">
            <ul className="space-y-2">
                {adminItems.map(({ path, icon: Icon, label }) => (
                    <li key={path}>
                        <Link
                            to={path}
                            onClick={onClose}
                            className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${isActive(path)
                                ? 'bg-accent/20 text-accent'
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
        <nav className="flex-1 px-2 py-6">
            <ul className="space-y-2">
                {menuItems.map(({ path, icon: Icon, label }) => (
                    <li key={path}>
                        <Link
                            to={path}
                            onClick={onClose}
                            className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${isActive(path)
                                ? 'bg-accent/20 text-accent'
                                : 'text-muted-text hover:text-accent hover:bg-primary-bg/50'
                                }`}
                        >
                            <Icon size={24} />
                            <span className="font-semibold">{label}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="mt-8">
                <ul className="space-y-2">
                    {libraryItems.map(({ path, icon: Icon, label }) => (
                        <li key={path}>
                            <Link
                                to={path}
                                onClick={onClose}
                                className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${isActive(path)
                                    ? 'bg-accent/20 text-accent'
                                    : 'text-muted-text hover:text-accent hover:bg-primary-bg/50'
                                    }`}
                            >
                                <Icon size={24} />
                                <span className="font-semibold">{label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-8 border-t border-muted-text/20 pt-4">
                <div className="px-4 mb-2">
                    <h3 className="text-xs font-semibold text-muted-text uppercase tracking-wider">Playlists</h3>
                </div>
                <ul className="space-y-1">
                    {['My Playlist #1', 'Chill Vibes', 'Workout Mix'].map((name, i) => (
                        <li key={i}>
                            <Link
                                to={`/playlist/${i + 1}`}
                                onClick={onClose}
                                className="block px-4 py-2 text-sm text-muted-text hover:text-accent transition-colors"
                            >
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    ) : (
        <div className="p-2">
            <h1 className="p-2 text-primary-text">Your mixes</h1>
            <Link to="/signup" onClick={onClose}>
                <div className="flex flex-col p-6 text-left m-4 gap-2 bg-primary-bg rounded-2xl hover:bg-accent transition-colors cursor-pointer">
                    <h1 className="text-primary-text">Amplify Your Experience</h1>
                    <i className="text-sm text-muted-text mt-1 hover:text-primary-bg transition-colors">
                        create your profile and evolve your personal Soundwave
                    </i>
                </div>
            </Link>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className={`hidden md:flex sticky top-20 ${sidebarClasses}`}>
                {navContent}
            </aside>

            {/* Mobile overlay drawer */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 z-60">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-primary-bg/60"
                        onClick={onClose}
                    />
                    {/* Drawer panel */}
                    <aside className={`absolute left-2 top-2 bottom-2 ${sidebarClasses} overflow-y-auto`}>
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
        </>
    );
}

export default Sidepanel;
