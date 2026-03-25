// src/Components/Sidepanel/Sidepanel.jsx
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    Search,
    Library,
    PlusSquare,
    Heart,
} from 'lucide-react';
import { useAuth } from '../../Context/AuthContextProvider';

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

    return (
        <>
            {user ? (
                <aside className="bg-gray-950 text-white w-64 h-screen sticky top-0 p-2 flex flex-col rounded-2xl">
                    <nav className="flex-1 px-2 py-6">
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                                ? 'bg-gray-800 text-white'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-900'
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
                                                    ? 'bg-gray-800 text-white'
                                                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
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
                        <div className="mt-8 border-t border-gray-800 pt-4">
                            <div className="px-4 mb-2">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Playlists
                                </h3>
                            </div>
                            <ul className="space-y-1">
                                <li>
                                    <Link
                                        to="/playlist/1"
                                        className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        My Playlist #1
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/playlist/2"
                                        className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        Chill Vibes
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/playlist/3"
                                        className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
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
                    <div className="bg-gray-950 text-white w-70 h-screen sticky top-0 p-2 flex flex-col rounded-2xl">
                        <h1 className="p-2">Your mixes</h1>
                        <Link to="/signup">
                            <div className="flex flex-col p-6 text-left m-4 gap-2 bg-gray-900 rounded-2xl hover:bg-gray-800 cursor-pointer">
                                <h1>Amplify Your Experience</h1>
                                <i className="text-sm text-gray-400 mt-1">
                                    create your profile and evolve your personal Soundwave
                                </i>
                            </div>
                        </Link>
                        <br />
                        
                        <div className="relative px-2 group">
                            <span className='text-xs text-gray-500 cursor-default'>
                                About
                            </span>
                            <div className="absolute left-0 bottom-full mb-2 p-3 w-64 bg-blue-600 text-white text-xs rounded-lg shadow-lg hidden group-hover:block z-10">
                                This project is made to showcase skills and gain experience of full stack development.
                                <div className="absolute w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-blue-600 -bottom-2 left-4"></div>
                            </div>
                        </div>

                    </div>
                </>
            )}
        </>
    );
}

export default Sidepanel;