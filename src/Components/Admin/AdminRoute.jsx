import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContextProvider'
import AppShell from '../../AppShell.jsx'

const AdminRoute = () => {
  const { loading, isAdmin } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAdmin()) {
    navigate('/home')
    return null
  }

  return (
    <AppShell>
      <main className='flex-1 min-w-0 w-full overflow-y-auto hide-scrollbar rounded-2xl mr-2'>
        <Outlet />
      </main>
    </AppShell>
  )
}

export default AdminRoute
