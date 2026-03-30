// src/Components/Sidepanel/Sidepanel.jsx
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    Search,
    Library,
    PlusSquare,
    UserCog,
    Heart,
} from 'lucide-react';
import { useAuth } from '../../../Context/AuthContextProvider';

function Sidepanel() {
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/search', icon: Search, label: 'Search' },
        { path: '/library', icon: Library, label: 'Your Library' },
    ];

    const libraryItems = [
        { path: '/create-playlist', icon: PlusSquare, label: 'Create Playlist' },
        { path: '/liked-songs', icon: Heart, label: 'Liked Songs' },
    ];

    if (user?.role === 'admin') {
        return (
            <aside className="sidepanel-font bg-section-bg text-accent w-64 h-[calc(100vh-6rem)] sticky top-20 p-2 flex flex-col rounded-2xl">
                <nav className="flex-1 px-2 py-6">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/admin/dashboard"
                                className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard')
                                    ? 'bg-accent/20 text-accent'
                                    : 'text-muted-text hover:text-accent hover:bg-primary-bg/50'
                                    }`}
                            >
                                <Home size={24} />
                                <span className="font-semibold">Admin Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/manage/song"
                                className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/manage/song')
                                    ? 'bg-accent/20 text-accent'
                                    : 'text-muted-text hover:text-accent hover:bg-primary-bg/50'
                                    }`}
                            >
                                <PlusSquare size={24} />
                                <span className="font-semibold">Upload Song</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/manage/users"
                                className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/manage/users')
                                    ? 'bg-accent/20 text-accent'
                                    : 'text-muted-text hover:text-accent hover:bg-primary-bg/50'
                                    }`}
                            >
                                <UserCog size={24} />
                                <span className="font-semibold">User Management</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        );
    }

    return (
        <>
            {user ? (
                <aside className="sidepanel-font bg-section-bg text-accent w-64 h-[calc(100vh-6rem)] sticky top-20 p-2 flex flex-col rounded-2xl">
                    <nav className="flex-1 px-2 py-6">
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                                ? 'bg-accent/20 text-accent'
                                                : 'text-muted-text hover:text-accent hover:bg-primary-bg/50'
                                                }`}
                                        >
                                            <Icon size={24} />
                                            <span className="font-semibold">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Library Section */}
                        <div className="mt-8">
                            <ul className="space-y-2">
                                {libraryItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.path}>
                                            <Link
                                                to={item.path}
                                                className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                                    ? 'bg-accent/20 text-accent'
                                                    : 'text-muted-text hover:text-accent hover:bg-primary-bg/50'
                                                    }`}
                                            >
                                                <Icon size={24} />
                                                <span className="font-semibold">{item.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Playlists Section */}
                        <div className="mt-8 border-t border-muted-text/20 pt-4">
                            <div className="px-4 mb-2">
                                <h3 className="text-xs font-semibold text-muted-text uppercase tracking-wider">
                                    Playlists
                                </h3>
                            </div>
                            <ul className="space-y-1">
                                <li>
                                    <Link
                                        to="/playlist/1"
                                        className="block px-4 py-2 text-sm text-muted-text hover:text-accent transition-colors"
                                    >
                                        My Playlist #1
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/playlist/2"
                                        className="block px-4 py-2 text-sm text-muted-text hover:text-accent transition-colors"
                                    >
                                        Chill Vibes
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/playlist/3"
                                        className="block px-4 py-2 text-sm text-muted-text hover:text-accent transition-colors"
                                    >
                                        Workout Mix
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </aside>
            ) : (
                <>
                    <div className="sidepanel-font bg-section-bg text-accent w-70 h-[calc(100vh-6rem)] sticky top-20 p-2 flex flex-col rounded-2xl">
                        <h1 className="p-2">Your mixes</h1>
                        <Link to="/signup">
                            <div className="flex flex-col p-6 text-left m-4 gap-2 bg-primary-bg rounded-2xl hover:bg-accent transition-colors cursor-pointer">
                                <h1 className="text-primary-text">Amplify Your Experience</h1>
                                <i className="text-sm text-muted-text mt-1 hover:text-black transition-colors">
                                    create your profile and evolve your personal Soundwave
                                </i>
                            </div>
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}

export default Sidepanel;