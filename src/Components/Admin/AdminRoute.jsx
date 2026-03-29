import { Outlet } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContextProvider';
import Header from '../Common/Header/Header';
import Sidepanel from '../Common/Sidepanel/Sidepanel';

const AdminRoute = () => {
  const { loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-accent mb-4">Access Denied</h1>
          <p className="text-muted-text">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className='flex flex-row m-2 items-start gap-1'>
        <Sidepanel />
        <main className='flex-1 w-full rounded-2xl mr-2'>
          <Outlet />
        </main>
      </div>
    </>
  )
};

export default AdminRoute;