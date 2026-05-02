import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import { Landing } from './Components/Landing/Landing.jsx'
import './index.css'
import { AuthContextProvider } from './Context/AuthContextProvider.jsx'
import { PlayerProvider } from './Context/PlayerContext.jsx'
import { ConfirmProvider } from './Context/ConfirmContext.jsx'
import { PlaylistProvider } from './Context/PlaylistContext.jsx'

const Home            = lazy(() => import('./Components/Home/Home.jsx'))
const Signup          = lazy(() => import('./Components/Signup/Signup.jsx'))
const Login           = lazy(() => import('./Components/Signup/Login.jsx'))
const PlaylistPage    = lazy(() => import('./Components/Playlist/PlaylistPage.jsx'))
const ArtistPage      = lazy(() => import('./Components/Artist/ArtistPage.jsx'))
const AdminRoute      = lazy(() => import('./Components/Admin/AdminRoute.jsx'))
const AdminDashboard  = lazy(() => import('./Components/Admin/AdminDashboard.jsx'))
const AdminUploadSong = lazy(() => import('./Components/Admin/Song/AdminUploadSong.jsx'))
const AddSong         = lazy(() => import('./Components/Admin/Song/AddSong.jsx'))
const AdminUploadArtist = lazy(() => import('./Components/Admin/Artist/AdminUploadArtist.jsx'))
const AddArtist       = lazy(() => import('./Components/Admin/Artist/AddArtist.jsx'))
const UserManagement  = lazy(() => import('./Components/Admin/UserManagement.jsx'))
const About           = lazy(() => import('./Components/About/About.jsx'))
const NotFound        = lazy(() => import('./Components/NotFound/NotFound.jsx'))

const Loader = () => (
  <div className="flex items-center justify-center min-h-64 w-full">
    <div className="w-5 h-5 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
  </div>
)

const wrap = (el) => <Suspense fallback={<Loader />}>{el}</Suspense>

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/home',
    element: <App />,
    children: [
      {
        index: true,
        element: wrap(<Home />)
      }
    ]
  },
  {
    path: '/playlist',
    element: <App />,
    children: [
      {
        path: ':id',
        element: wrap(<PlaylistPage />)
      }
    ]
  },
  {
    path: '/artist',
    element: <App />,
    children: [
      {
        path: ':id',
        element: wrap(<ArtistPage />)
      }
    ]
  },
  {
    path: '/about',
    element: wrap(<About />)
  },
  {
    path: '/signup',
    element: wrap(<Signup />)
  },
  {
    path: '/login',
    element: wrap(<Login />)
  },
  {
    path: "/admin",
    element: wrap(<AdminRoute />),
    children: [
      {
        path: "dashboard",
        element: wrap(<AdminDashboard />)
      },
      {
        path: "manage",
        children: [
          {
            path: "songs",
            element: wrap(<AdminUploadSong />)
          },
          {
            path: "songs/upload",
            element: wrap(<AddSong />)
          },
          {
            path: "artists",
            element: wrap(<AdminUploadArtist />)
          },
          {
            path: "artists/add",
            element: wrap(<AddArtist />)
          },
          {
            path: "users",
            element: wrap(<UserManagement />)
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: wrap(<NotFound />)
  }
])

createRoot(document.getElementById('root')).render(
    <PlayerProvider>
      <AuthContextProvider>
        <PlaylistProvider>
        <ConfirmProvider>
          <StrictMode>
            <RouterProvider router={router} />
          </StrictMode>
        </ConfirmProvider>
        </PlaylistProvider>
      </AuthContextProvider>
    </PlayerProvider>
)
