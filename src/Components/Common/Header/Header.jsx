// src/Components/Header/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContextProvider';
import logo from '../../../assets/logo.png';
import './Header.css';
import { Home, Search, Menu } from 'lucide-react';

function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="text-primary-text sticky top-0 z-50 mt-2">
      <div className="flex items-center justify-between px-2 md:px-6 py-1 gap-2">

        <div className='flex flex-row items-center lg:gap-2 md:gap-0 flex-1 min-w-0'>
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 shrink-0 text-muted-text hover:text-primary-text transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>

          <Link to="/home" className="flex items-center shrink-0 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Soundwave" className="h-8 w-8" />
          </Link>

          <Link to="/home" className="flex items-center shrink-0 hover:opacity-80 transition-opacity p-2 rounded-full bg-primary-bg">
            <Home size={24} />
          </Link>

          <search className='px-3 py-2 flex flex-row items-center w-32 sm:w-48 md:w-64 lg:w-1/2 bg-primary-bg border border-muted-text/30 rounded-full gap-2 text-accent hover:bg-primary-bg/80'>
            <Search size={18} className="shrink-0 text-muted-text" />
            <input
              type='text'
              placeholder='Search'
              className='focus:outline-none bg-transparent text-primary-text placeholder:text-muted-text flex-1 min-w-0'
            />
          </search>
        </div>

        <div className="flex items-center shrink-0 space-x-2 md:space-x-4">
          {user ? (
            <>
              <p className="text-sm md:text-xl font-medium text-accent">{user.username}</p>
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
