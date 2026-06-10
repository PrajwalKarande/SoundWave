# 🎵 SoundWave — Frontend

<div align="center">

```
███████╗ ██████╗ ██╗   ██╗███╗   ██╗██████╗ ██╗    ██╗ █████╗ ██╗   ██╗███████╗
██╔════╝██╔═══██╗██║   ██║████╗  ██║██╔══██╗██║    ██║██╔══██╗██║   ██║██╔════╝
███████╗██║   ██║██║   ██║██╔██╗ ██║██║  ██║██║ █╗ ██║███████║██║   ██║█████╗  
╚════██║██║   ██║██║   ██║██║╚██╗██║██║  ██║██║███╗██║██╔══██║╚██╗ ██╔╝██╔══╝  
███████║╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝╚███╔███╔╝██║  ██║ ╚████╔╝ ███████╗
╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═╝  ╚═══╝  ╚══════╝
```

**A modern, full-featured music streaming experience built with React 19**

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-FF4154?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)

</div>

---

## Overview

SoundWave's frontend is a single-page application that delivers a Spotify-like listening experience. It features a persistent audio player, real-time queue management, artist browsing, playlist creation, and an admin dashboard — all wrapped in a smooth, animated UI.

## Features

- **Persistent Audio Player** — continuous playback across navigation with shuffle, repeat, and volume controls
- **Queue Management** — add, reorder, and clear the playback queue on the fly
- **Artist & Song Browsing** — search, discover, and stream songs with album art
- **Playlist CRUD** — create, edit, and delete personal playlists; add/remove songs
- **Recently Played** — tracks your last 10 played songs, synced with the server
- **Resizable Layout** — drag to resize the sidebar and player panel
- **Admin Dashboard** — manage songs, artists, and users (admin-only, guarded client & server-side)
- **Animated UI** — smooth page transitions and micro-interactions via Framer Motion
- **Lazy Loading** — all page-level components are code-split for fast initial load

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + JSX |
| Build Tool | Vite 7 |
| Styling | TailwindCSS 4 |
| Animation | Framer Motion 12 |
| Routing | React Router DOM 7 |
| HTTP Client | Axios (with credential cookies) |
| Icons | Lucide React |
| Linting | ESLint 9 flat config |

## Project Structure

```
Frontend - SoundWave/
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
└── src/
    ├── main.jsx              # App bootstrap + context provider nesting
    ├── App.jsx               # Route definitions
    ├── AppShell.jsx          # 3-panel resizable layout
    ├── index.css / App.css
    ├── assets/
    ├── Components/
    │   ├── About/
    │   ├── Admin/            # Admin dashboard panels
    │   ├── Artist/           # Artist detail, browse
    │   ├── Common/           # Shared UI (modals, loaders, etc.)
    │   ├── Home/             # Landing feed
    │   ├── Landing/          # Public landing page
    │   ├── NotFound/
    │   ├── Player/           # Bottom player bar + controls
    │   ├── Playlist/         # Playlist views
    │   ├── Signup/           # Auth forms
    │   └── UserProfile/
    ├── Context/
    │   ├── PlayerContext.jsx     # Audio engine + queue state
    │   ├── AuthContextProvider.jsx
    │   ├── PlaylistContext.jsx
    │   └── ConfirmContext.jsx    # Promise-based confirm dialog
    └── Services/
        ├── api.js                # Axios instance (withCredentials)
        ├── songService.js
        ├── artistService.js
        ├── playlistService.js
        └── userService.js
```

## Context Architecture

The provider nesting order matters — outer contexts are available to inner ones:

```
PlayerProvider
  └── AuthContextProvider
        └── PlaylistProvider
              └── ConfirmProvider
                    └── RouterProvider
```

| Context | Responsibility |
|---------|---------------|
| `PlayerContext` | Owns the `Audio` DOM object, queue, shuffle/repeat/volume state, localStorage persistence, and the 30s play-timer that marks songs as played |
| `AuthContext` | Session validation on mount, login/signup/logout, auto-redirect on 401 |
| `PlaylistContext` | Cached playlist list, add/remove/refresh |
| `ConfirmContext` | Imperative `confirm(message)` → Promise modal API |

## Getting Started

### Prerequisites

- Node.js 18+
- The [SoundWave backend](../Backend%20-%20Soundwave/) running on `http://localhost:3000`

### Install & Run

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Expose to local network (e.g. for mobile testing)
npm run dev:host
```

### Build for Production

```bash
npm run build     # Output to dist/
npm run preview   # Preview the production build locally
```

### Lint

```bash
npm run lint
```

## Configuration

The API base URL is hardcoded in `src/Services/api.js`:

```js
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, 
});
```

Update `baseURL` to point to your deployed backend when going to production.

## API Integration

All HTTP calls go through the shared Axios instance in `Services/api.js`. A response interceptor automatically redirects to `/login` on any `401 Unauthorized` response, keeping auth state consistent across all service modules.

| Service | Domain |
|---------|--------|
| `songService.js` | Stream, search, recently-played, mark-played |
| `artistService.js` | Browse, create, update, delete artists |
| `playlistService.js` | CRUD playlists, add/remove songs |
| `userService.js` | User management (admin) |

## Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start Vite dev server |
| `dev:host` | `vite --host` | Expose dev server to LAN |
| `build` | `vite build` | Production bundle |
| `preview` | `vite preview` | Preview production build |
| `lint` | `eslint .` | Run ESLint |
