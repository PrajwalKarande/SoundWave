// src/Components/Header/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContextProvider';
import logo from '../../assets/logo.svg';
import './Header.css';

function Header() {
  const { user,logout } = useAuth();
  const navigate = useNavigate();
  

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">

        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Soundwave" className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">Soundwave</span>
        </Link>

        <div className="flex items-center space-x-4">
          {user? (
            <>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.username}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-white border border-gray-600 hover:bg-white hover:text-black rounded-full transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="px-6 py-2 text-sm font-semibold text-white rounded-full hover:bg-green-500 hover:text-black">
                    Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-6 py-2 text-sm font-semibold text-white rounded-full hover:bg-green-500 hover:text-black">
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