import { useState } from 'react'
import Header from './Components/Common/Header/Header.jsx'
import Sidepanel from './Components/Common/Sidepanel/Sidepanel.jsx'

const AppShell = ({ sidebarRef, sidebarWidth = 256, sidebarCollapsed = false, onToggleSidebar, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <Header onMenuToggle={() => setSidebarOpen(prev => !prev)} />
      <div className='flex flex-row flex-1 min-h-0 m-1 ml-2'>
        <Sidepanel
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          setSidebarOpen={setSidebarOpen}
          width={sidebarWidth}
          collapsed={sidebarCollapsed}
          onToggle={onToggleSidebar}
          ref={sidebarRef}
        />
        {children}
      </div>
    </div>
  )
}

export default AppShell
