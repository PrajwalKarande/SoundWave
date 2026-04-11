import { useState, useRef, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import AppShell from './AppShell.jsx'
import Player from './Components/Player/Player.jsx'
import './App.css'

const SIDEBAR_MINI = 52   // width of the icon-only collapsed bar
const SIDEBAR_MIN  = 280
const SIDEBAR_MAX  = 360
const PLAYER_MIN   = 320
const PLAYER_MAX   = 360

function App() {
  const [sidebarWidth,     setSidebarWidth]     = useState(256)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [playerWidth,      setPlayerWidth]      = useState(288)

  const sidebarRef = useRef(null)
  const playerRef  = useRef(null)

  const startResize = useCallback((which, e) => {
    e.preventDefault()
    const startX = e.clientX
    // When collapsed the visual width is SIDEBAR_MINI, use that as start point
    const startW = which === 'sidebar'
      ? (sidebarCollapsed ? SIDEBAR_MINI : sidebarWidth)
      : playerWidth

    document.body.style.cursor        = 'col-resize'
    document.body.style.userSelect    = 'none'
    document.body.style.pointerEvents = 'none'

    const panelEl = which === 'sidebar' ? sidebarRef.current : playerRef.current
    panelEl?.classList.add('is-resizing')

    const onMove = (ev) => {
      const delta = ev.clientX - startX
      if (which === 'sidebar') {
        const raw = startW + delta
        if (raw < SIDEBAR_MIN) {
          // Stay at mini bar width — no further shrinkage
          if (sidebarRef.current) {
            sidebarRef.current.style.width    = `${SIDEBAR_MINI}px`
            sidebarRef.current.style.minWidth = `${SIDEBAR_MINI}px`
          }
        } else {
          const w = Math.min(SIDEBAR_MAX, raw)
          if (sidebarRef.current) {
            sidebarRef.current.style.width    = `${w}px`
            sidebarRef.current.style.minWidth = `${w}px`
          }
        }
      } else {
        const w = Math.min(PLAYER_MAX, Math.max(PLAYER_MIN, startW - delta))
        if (playerRef.current) {
          playerRef.current.style.width = `${w}px`
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

      const delta = ev.clientX - startX
      if (which === 'sidebar') {
        const raw = startW + delta
        if (raw < SIDEBAR_MIN) {
          setSidebarCollapsed(true)
        } else {
          setSidebarCollapsed(false)
          setSidebarWidth(Math.min(SIDEBAR_MAX, raw))
        }
      } else {
        setPlayerWidth(Math.min(PLAYER_MAX, Math.max(PLAYER_MIN, startW - delta)))
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',   onUp)
  }, [sidebarWidth, sidebarCollapsed, playerWidth])

  return (
    <AppShell
      sidebarRef={sidebarRef}
      sidebarWidth={sidebarWidth}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
    >

      {/* Sidebar resize handle */}
      <div
        className="hidden md:flex w-2 shrink-0 cursor-col-resize items-center justify-center group select-none"
        onMouseDown={(e) => startResize('sidebar', e)}
      >
        <div className="h-10 w-0.5 rounded-full bg-muted-text/20 group-hover:bg-accent/50 transition-colors duration-150" />
      </div>

      <main className='flex-1 min-w-0 overflow-y-auto overflow-x-hidden hide-scrollbar bg-section-bg rounded-lg'>
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

    </AppShell>
  )
}

export default App
