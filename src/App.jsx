import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Components/Common/Header/Header.jsx'
import Sidepanel from './Components/Common/Sidepanel/Sidepanel.jsx'
import './App.css'


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Header onMenuToggle={() => setSidebarOpen(prev => !prev)} />
      <div className='flex flex-row m-2 items-start gap-1'>
        <Sidepanel isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className='flex-1 min-w-0 w-full'>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default App
