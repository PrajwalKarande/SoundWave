// src/Components/Header/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContextProvider';
import logo from '../../../assets/logo.png';
import './Header.css';
import { Search, Menu } from 'lucide-react';

function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-section-bg text-primary-text sticky top-0 z-50 m-2 rounded-2xl">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">

        <div className='flex flex-row items-center gap-3 md:gap-10'>
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 text-muted-text hover:text-primary-text transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>

          <Link to="/home" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Soundwave" className="h-8 w-8" />
            <span
              className="text-lg md:text-2xl font-bold tracking-tight transition-all duration-300 text-accent hover:text-primary-text"
              style={{ textShadow: 'none', transition: 'text-shadow 0.3s ease, color 0.3s ease' }}
              onMouseEnter={e => {
                e.currentTarget.style.textShadow = `
                  0 0 7px #ff4313, 0 0 15px #ff4313,
                  0 0 30px #ff4313, 0 0 60px #ff4313,
                  0 0 100px #ff4313`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.textShadow = 'none';
                e.currentTarget.style.color = '';
              }}
            >
              SOUNDWAVE
            </span>
          </Link>

          {/* Search — hidden on mobile */}
          <nav className='hidden md:flex items-center'>
            <search className='px-4 py-2 flex flex-row items-center bg-primary-bg border border-muted-text/30 rounded-full gap-2 text-accent focus:border-accent hover:bg-primary-bg/80'>
              <Search size={20} />
              <input
                type='text'
                placeholder='Search'
                className='focus:outline-none bg-transparent text-primary-text placeholder:text-muted-text w-40'
              />
            </search>
          </nav>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {user ? (
            <>
              <p className="hidden sm:block text-base md:text-xl font-medium text-accent">{user.username}</p>
              <button
                onClick={handleLogout}
                className="px-3 md:px-4 py-2 text-sm md:text-lg font-semibold text-[#FF4313] rounded-full hover:text-[#F3F4F6] hover:bg-accent transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="px-3 md:px-4 py-2 text-base md:text-xl font-semibold text-[#FF4313] rounded-full hover:text-[#F3F4F6] hover:bg-accent transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-3 md:px-4 py-2 text-base md:text-xl font-semibold text-[#FF4313] rounded-full hover:text-[#F3F4F6] hover:bg-accent transition-colors">
                  Sign-up
                </button>
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;
