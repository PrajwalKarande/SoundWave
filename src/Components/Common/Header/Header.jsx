import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContextProvider';
import logo from '../../../../public/logo.png';
import './Header.css';
import { Home, Search, Menu, User, LogOut } from 'lucide-react';
import SearchDropdown from './SearchDropdown';
import { songService } from '../../../Services/songService';
import { artistService } from '../../../Services/artistService';

function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery]         = useState('');
  const [isOpen, setIsOpen]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [results, setResults]     = useState({ songs: [], artists: [] });
  const [menuOpen, setMenuOpen]   = useState(false);
  const [history, setHistory]     = useState([]);
  const historyFetched            = useRef(false);

  const searchRef   = useRef(null);
  const menuRef     = useRef(null);
  const cacheRef    = useRef(new Map());
  const abortRef    = useRef(null);
  const debounceRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchHistory = useCallback(async () => {
    if (historyFetched.current || !user) return;
    historyFetched.current = true;
    try {
      const data = await songService.getSearchHistory();
      setHistory(data.songs ?? []);
    } catch {
    }
  }, [user]);

  const handleSongPlayedFromSearch = useCallback((song) => {
    setHistory(prev => [song, ...prev.filter(h => h._id !== song._id).slice(0, 19)]);
    songService.addSongToSearchHistory(song._id).catch(() => {});
  }, []);

  const handleRemoveHistoryItem = async (songId) => {
    setHistory(prev => prev.filter(h => h._id !== songId));
    try { await songService.removeSearchHistoryItem(songId); } catch { /* ignore */ }
  };

  const handleClearHistory = async () => {
    setHistory([]);
    try { await songService.clearSearchHistory(); } catch { /* ignore */ }
  };

  const runSearch = useCallback(async (q) => {
    if (cacheRef.current.has(q)) {
      setResults(cacheRef.current.get(q));
      setLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    try {
      const [songsRes, artistsRes] = await Promise.all([
        songService.search(q, signal),
        artistService.search(q, signal),
      ]);

      if (songsRes === null || artistsRes === null) return; // aborted

      const hit = { songs: songsRes.data ?? [], artists: artistsRes.data ?? [] };
      cacheRef.current.set(q, hit);
      setResults(hit);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setResults({ songs: [], artists: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => runSearch(query), 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, runSearch]);

  useEffect(() => {
    const onMouseDown = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') { setIsOpen(false); setMenuOpen(false); }
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const showDropdown = isOpen && (query.length >= 2 || history.length > 0);

  return (
    <header className="text-primary-text sticky top-0 z-50 mt-2 p-1">
      <div className="flex items-center justify-between px-2 md:px-6 py-1 gap-2">

        <div className='flex flex-row items-center lg:gap-2 md:gap-0 flex-1 min-w-0'>
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 shrink-0 text-muted-text hover:text-primary-text transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="flex items-center shrink-0 hover:opacity-80 transition-opacity lg:w-14 md:w-10">
            <img src={logo} alt="Soundwave" className="h-8 w-8" />
          </Link>

          <Link to="/home" className="p-2 rounded-full bg-primary-bg hover:bg-accent/80 text-primary-text">
            <Home size={24}/>
          </Link>

          <div
            ref={searchRef}
            className="relative w-32 sm:w-48 md:w-64 lg:w-1/2"
          >
            <search className={`px-3 py-2 flex flex-row items-center w-full bg-primary-bg border rounded-full gap-2 transition-colors ${
              isOpen && query.length >= 2
                ? 'border-accent/60 text-accent'
                : 'border-muted-text/30 text-accent hover:bg-accent/20 hover:border-accent/10 hover:border-2'
            }`}>
              <Search size={18} className="shrink-0 text-muted-text" />
              <input
                type='text'
                placeholder='Search songs, artists…'
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => { fetchHistory(); setIsOpen(true); }}
                className='focus:outline-none bg-transparent text-primary-text placeholder:text-muted-text flex-1 min-w-0 text-sm'
                aria-label="Search songs and artists"
                aria-expanded={showDropdown}
                aria-autocomplete="list"
                autoComplete="off"
              />
              {query.length > 0 && (
                <button
                  onClick={() => { setQuery(''); setIsOpen(false); }}
                  className="shrink-0 text-muted-text hover:text-primary-text transition-colors leading-none"
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </search>

            {showDropdown && (
              <SearchDropdown
                songs={results.songs}
                artists={results.artists}
                loading={loading}
                query={query}
                history={history}
                onSongPlayedFromSearch={handleSongPlayedFromSearch}
                onRemoveHistoryItem={handleRemoveHistoryItem}
                onClearHistory={handleClearHistory}
              />
            )}
          </div>
        </div>

        <div className="flex items-center shrink-0">
          {user ? (
            <div ref={menuRef} className="relative">
              {/* Avatar circle */}
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="w-9 h-9 rounded-full bg-accent flex items-center justify-center font-bold text-white text-sm select-none hover:opacity-85 active:scale-95 transition-all cursor-pointer"
                aria-label="Account menu"
                aria-expanded={menuOpen}
              >
                {user.username[0].toUpperCase()}
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="hd-menu">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="hd-menu-item"
                  >
                    <User size={13} className="shrink-0" />
                    <span>Your Profile</span>
                  </Link>
                  <div className="mx-3 border-t border-white/[0.07]" />
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    className="hd-menu-item w-full text-left"
                  >
                    <LogOut size={13} className="shrink-0" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Link to="/login" className="text-base md:text-xl font-semibold text-accent transition-colors">
                <span className="hover:bg-accent hover:text-primary-bg px-3 py-2 rounded-full ">Login</span>
              </Link>
              <Link to="/signup" className="text-base md:text-xl font-semibold text-accent  rounded-full transition-colors">
                <span className="hover:bg-accent hover:text-primary-bg px-3 py-2 rounded-full ">Sign-up</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;
