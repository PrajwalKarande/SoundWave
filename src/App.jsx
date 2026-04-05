import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Components/Common/Header/Header.jsx'
import Sidepanel from './Components/Common/Sidepanel/Sidepanel.jsx'
import Player from './Components/Player/Player.jsx'
import './App.css'


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <Header onMenuToggle={() => setSidebarOpen(prev => !prev)} />
      <div className='flex flex-row flex-1 min-h-0 m-1 gap-2 ml-2'>
        <Sidepanel isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} setSidebarOpen={setSidebarOpen} />
        <main className='flex-1 min-w-0 overflow-y-auto overflow-x-hidden hide-scrollbar bg-section-bg border border-accent/10 rounded-2xl'>
          <Outlet />
        </main>
        <Player />
      </div>
    </div>
  )
}

export default App

