import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContextProvider';
import Header from '../Common/Header/Header';
import Sidepanel from '../Common/Sidepanel/Sidepanel';

const AdminRoute = () => {
  const { loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin()) {
    navigate('/home')
  }

  return (
    <>
      <Header onMenuToggle={() => setSidebarOpen(prev => !prev)} />
      <div className='flex flex-row m-2 items-start gap-1'>
        <Sidepanel isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className='flex-1 min-w-0 w-full rounded-2xl mr-2'>
          <Outlet />
        </main>
      </div>
    </>
  )
};

export default AdminRoute;