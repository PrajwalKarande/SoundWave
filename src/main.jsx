import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Signup from './Components/Signup/Signup.jsx'
import Login from './Components/Signup/Login.jsx'
import './index.css'
import { AuthContextProvider } from './Context/AuthContextProvider.jsx'
import { PlayerProvider } from './Context/PlayerContext.jsx'
import { Home } from './Components/Home/Home.jsx'
import { Landing } from './Components/Landing/Landing.jsx'
import AdminRoute from './Components/Admin/AdminRoute.jsx'
import AdminDashboard from './Components/Admin/AdminDashboard.jsx'
import AdminUploadSong from './Components/Admin/Song/AdminUploadSong.jsx'
import AddSong from './Components/Admin/Song/AddSong.jsx'
import AdminUploadArtist from './Components/Admin/Artist/AdminUploadArtist.jsx'
import AddArtist from './Components/Admin/Artist/AddArtist.jsx'
import UserManagement from './Components/Admin/UserManagement.jsx'

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
        element: <Home />
        //loader function needed to fetch songs and albums
      },
      {
        path: 'search',
        element: <div>Search Page - Coming Soon</div>
      },
      {
        path: 'library',
        element: <div>Your Library - Coming Soon</div>
      },
      {
        path: 'create-playlist',
        element: <div>Create Playlist - Coming Soon</div>
      },
      {
        path: 'liked-songs',
        element: <div>Liked Songs - Coming Soon</div>
      }
    ]
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: "/admin",
    element: <AdminRoute/>,
    children: [
      {
        path: "dashboard",
        element:<AdminDashboard />
      },
      {
        path: "manage",
        children:[
          {
            path: "songs",
            element:<AdminUploadSong />
          },
          {
            path:"songs/upload",
            element:<AddSong />
          },
          {
            path:"artists",
            element:<AdminUploadArtist />
          },
          {
            path:"artists/add",
            element:<AddArtist />
          },
          {
            path:"users",
            element:<UserManagement />
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
    <PlayerProvider>
      <AuthContextProvider>
        <StrictMode>
          <RouterProvider router={router} />
        </StrictMode>
      </AuthContextProvider>
    </PlayerProvider>
)

