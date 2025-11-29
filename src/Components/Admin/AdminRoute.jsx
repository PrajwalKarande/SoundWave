import { Outlet } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContextProvider';
import Header from '../Header/Header';

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
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
        <Header/>
        <Outlet/>
    </>
  )
};

export default AdminRoute;