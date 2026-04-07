import { useState, useRef, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Components/Common/Header/Header.jsx'
import Sidepanel from './Components/Common/Sidepanel/Sidepanel.jsx'
import Player from './Components/Player/Player.jsx'
import './App.css'

const SIDEBAR_MIN = 320
const SIDEBAR_MAX = 400
const PLAYER_MIN  = 320
const PLAYER_MAX  = 400

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(256)
  const [playerWidth,  setPlayerWidth]  = useState(288)

  // Refs to the DOM nodes so we can mutate styles imperatively during drag
  const sidebarRef = useRef(null)
  const playerRef  = useRef(null)

  const startResize = useCallback((which, e) => {
    e.preventDefault()
    const startX = e.clientX
    const startW = which === 'sidebar' ? sidebarWidth : playerWidth

    // Disable pointer-events + text-selection on everything during drag
    document.body.style.cursor        = 'col-resize'
    document.body.style.userSelect    = 'none'
    document.body.style.pointerEvents = 'none'

    // Suppress CSS transition on the panel being resized
    const panelEl = which === 'sidebar' ? sidebarRef.current : playerRef.current
    panelEl?.classList.add('is-resizing')

    const onMove = (ev) => {
      const delta = ev.clientX - startX
      let w
      if (which === 'sidebar') {
        w = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, startW + delta))
        if (sidebarRef.current) {
          sidebarRef.current.style.width    = `${w}px`
          sidebarRef.current.style.minWidth = `${w}px`
        }
      } else {
        w = Math.min(PLAYER_MAX, Math.max(PLAYER_MIN, startW - delta))
        if (playerRef.current) {
          // outer panel
          playerRef.current.style.width = `${w}px`
          // inner panel + artwork — querySelector is fast on a small subtree
          const inner   = playerRef.current.querySelector('.player-panel-inner')
          const artwork = playerRef.current.querySelector('.player-artwork')
          if (inner)   inner.style.width = `${w}px`
          if (artwork) {
            const art = `${w - 78}px`
            artwork.style.width  = art
            artwork.style.height = art
          }
        }
      }
    }

    const onUp = (ev) => {
      document.body.style.cursor        = ''
      document.body.style.userSelect    = ''
      document.body.style.pointerEvents = ''
      panelEl?.classList.remove('is-resizing')
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup',   onUp)

      // Commit final value to React state once, triggering a single re-render
      const delta = ev.clientX - startX
      if (which === 'sidebar') {
        setSidebarWidth(Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, startW + delta)))
      } else {
        setPlayerWidth(Math.min(PLAYER_MAX, Math.max(PLAYER_MIN, startW - delta)))
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',   onUp)
  }, [sidebarWidth, playerWidth])

  return (
    <div className='h-screen flex flex-col overflow-hidden'>
      <Header onMenuToggle={() => setSidebarOpen(prev => !prev)} />
      <div className='flex flex-row flex-1 min-h-0 m-1 ml-2'>

        <Sidepanel
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          setSidebarOpen={setSidebarOpen}
          width={sidebarWidth}
          ref={sidebarRef}
        />

        {/* Sidebar resize handle */}
        <div
          className="hidden md:flex w-2 shrink-0 cursor-col-resize items-center justify-center group select-none"
          onMouseDown={(e) => startResize('sidebar', e)}
        >
          <div className="h-10 w-0.5 rounded-full bg-muted-text/20 group-hover:bg-accent/50 transition-colors duration-150 " />
        </div>

        <main className='flex-1 min-w-0 overflow-y-auto overflow-x-hidden hide-scrollbar bg-section-bg rounded-2xl'>
          <Outlet />
        </main>

        {/* Player resize handle */}
        <div
          className="hidden md:flex w-2 shrink-0 cursor-col-resize items-center justify-center group select-none"
          onMouseDown={(e) => startResize('player', e)}
        >
          <div className="h-10 w-0.5 rounded-full bg-muted-text/20 group-hover:bg-accent/50 transition-colors duration-150" />
        </div>

        <Player width={playerWidth} ref={playerRef} />

      </div>
    </div>
  )
}

export default App
