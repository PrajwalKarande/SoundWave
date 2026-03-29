import { Outlet } from 'react-router-dom'
import Header from './Components/Common/Header/Header.jsx'
import Sidepanel from './Components/Common/Sidepanel/Sidepanel.jsx'
import './App.css'


function App() {

  return (
    <>
      <Header />
      <div className='flex flex-row m-2 items-start gap-1'>
        <Sidepanel />
        <main className='flex-1 w-full'>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default App
