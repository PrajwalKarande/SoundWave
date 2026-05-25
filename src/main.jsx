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
const UserProfile     = lazy(() => import('./Components/UserProfile/UserProfile.jsx'))

const BARS = [
  { delay: '0s',    dur: '0.80s' },
  { delay: '0.14s', dur: '0.95s' },
  { delay: '0.06s', dur: '0.72s' },
  { delay: '0.21s', dur: '0.88s' },
  { delay: '0.10s', dur: '0.82s' },
]

const LOADING_MSGS = [
  'adding songs to your personality...',
  'teaching the algorithm what taste is...',
  'buffering like your wifi at 2am...',
  'ur queue is loading, no cap',
  'manifesting your next banger rn',
  'the vibes are on their way bestie',
  'loading... as if you had somewhere to be',
  'gaslit by a slow connection, again',
]

const Loader = () => {
  const msg = LOADING_MSGS[Math.floor(Math.random() * LOADING_MSGS.length)]
  return (
    <div className="flex flex-col items-center justify-center min-h-64 w-full gap-3">
      <div className="flex items-end gap-[5px] h-[36px]">
        {BARS.map(({ delay, dur }, i) => (
          <div
            key={i}
            className="soundbar-bar"
            style={{ animationDelay: delay, animationDuration: dur }}
          />
        ))}
      </div>
      <p className="text-xs text-white/30 tracking-wide italic">{msg}</p>
    </div>
  )
}

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
    path: '/profile',
    element: <App />,
    children: [
      {
        index: true,
        element: wrap(<UserProfile />)
      }
    ]
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
            <RouterProvider router={router} />
        </ConfirmProvider>
        </PlaylistProvider>
      </AuthContextProvider>
    </PlayerProvider>
)
