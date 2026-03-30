// src/Components/Header/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContextProvider';
import logo from '../../../assets/logo.png';
import './Header.css';
import { Search } from 'lucide-react';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-section-bg text-primary-text sticky top-0 z-50 m-2 rounded-2xl">
      <div className="flex items-center justify-between px-6 py-3">

        <div className='flex flex-row items-center justify-center gap-10'>
          <Link to="/home" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Soundwave" className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight transition-all duration-300 text-accent hover:text-primary-text"
              style={{
                textShadow: 'none',
                transition: 'text-shadow 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.textShadow = `
      0 0 7px #ff4313,
      0 0 15px #ff4313,
      0 0 30px #ff4313,
      0 0 60px #ff4313,
      0 0 100px #ff4313
    `;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.textShadow = 'none';
                e.currentTarget.style.color = '';
              }}
            >
              SOUNDWAVE
            </span>
          </Link>

          <nav className='flex items-center space-x-4 font-bold'>
            <search className='px-4 py-2 w-fit h-fit flex flex-row items-center bg-primary-bg border border-muted-text/30 rounded-full gap-2 text-accent focus:border-accent hover:bg-primary-bg/80'>
              <Search size={24} />
              <input type='text' placeholder='Search' className='focus:outline-none bg-transparent text-primary-text placeholder:text-muted-text' />
            </search>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-xl font-medium text-accent">{user.username}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-lg font-semibold text-[#FF4313] rounded-full hover:text-[#F3F4F6] hover:bg-accent transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="px-4 py-2 text-xl font-semibold text-[#FF4313] rounded-full hover:text-[#F3F4F6] hover:bg-accent transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-4 py-2 text-xl font-semibold text-[#FF4313] rounded-full hover:text-[#F3F4F6] hover:bg-accent transition-colors">
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