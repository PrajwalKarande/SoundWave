import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Signup from './Components/Signup/Signup.jsx'
import Login from './Components/Signup/Login.jsx'
import './index.css'
import { AuthContextProvider } from './Context/AuthContextProvider.jsx'
import { Home } from './Components/Home/Home.jsx'
import AdminRoute from './Components/Admin/AdminRoute.jsx'
import AdminDashboard from './Components/Admin/AdminDashboard.jsx'
import AdminUploadSong from './Components/Admin/Song/AdminUploadSong.jsx'
import AdminUploadArtist from './Components/Admin/Artist/AdminUploadArtist.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
        //loader function needed to fetch songs and albums
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
        path: "upload",
        children:[
          {
            path: "song",
            element:<AdminUploadSong />
          },
          {
            path:"artist",
            element:<AdminUploadArtist />
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </AuthContextProvider>
)
