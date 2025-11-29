import { Outlet } from 'react-router-dom'
import Header from './Components/Header/Header.jsx'
import Sidepanel from './Components/Sidepanel/Sidepanel.jsx'
import './App.css'


function App() {

  return (
    <>
      <Header />
      <main className='flex flex-row m-2'>
        <Sidepanel />
        <Outlet />
      </main>
    </>
  )
}

export default App
