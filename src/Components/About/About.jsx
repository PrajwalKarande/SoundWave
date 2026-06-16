import {
    Github,
    Music2,
    Server,
    Database,
    Shield,
    Zap,
    Search,
    List,
    Mic2,
    Users,
    Layout,
    Code2,
    Cloud,
    Package,
    Layers,
    Lock,
    ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const TECH_STACK = [
    { name: 'MongoDB',         category: 'Database',        color: '#4DB33D', Icon: Database },
    { name: 'Express.js',      category: 'Web Framework',   color: '#aaa',    Icon: Server   },
    { name: 'React',           category: 'UI Library',      color: '#61DAFB', Icon: Code2    },
    { name: 'Node.js',         category: 'Runtime',         color: '#83BA63', Icon: Package  },
    { name: 'TypeScript',      category: 'Type Safety',     color: '#3178C6', Icon: Code2    },
    { name: 'Tailwind CSS v4', category: 'Styling',         color: '#38BDF8', Icon: Layers   },
    { name: 'Vite',            category: 'Build Tool',      color: '#BD34FE', Icon: Zap      },
    { name: 'Cloudflare R2',   category: 'Object Storage',  color: '#F6821F', Icon: Cloud    },
    { name: 'JWT + Cookies',   category: 'Authentication',  color: '#06C9E0', Icon: Lock     },
];

const FEATURES = [
    { Icon: Music2,  label: 'Music Streaming',  desc: 'Custom player — play, pause, skip, seek & volume' },
    { Icon: List,    label: 'Playlists',         desc: 'Create and manage personal playlists with real-time sidebar sync' },
    { Icon: Mic2,    label: 'Artist Pages',      desc: 'Artist profiles with full discography and bio' },
    { Icon: Search,  label: 'Smart Search',      desc: 'Debounced, cached search — minimal API calls' },
    { Icon: Shield,  label: 'Auth System',       desc: 'JWT + HttpOnly cookies with role-based access control' },
    { Icon: Users,   label: 'Admin Panel',       desc: 'Full CRUD for songs, artists, and user management' },
    { Icon: Layout,  label: 'Responsive Design', desc: 'Resizable panels, mobile drawer, adaptive breakpoints' },
    { Icon: Zap,     label: 'Performance',       desc: 'Lazy loading, skeleton screens, code splitting & caching' },
];

const EQ_DELAYS = [0, 0.15, 0.3, 0.45, 0.6];

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="ab-page">
            <div className="ab-orb ab-orb-1" />
            <div className="ab-orb ab-orb-2" />

            <button
                onClick={() => navigate(-1)}
                className="ab-back-btn"
                aria-label="Go back"
            >
                <ArrowLeft size={16} />
                <span>Back</span>
            </button>

            <div className="ab-content">

                <section className="ab-hero">
                    <div className="ab-eq-wrap">
                        {EQ_DELAYS.map((delay, i) => (
                            <span
                                key={i}
                                className="ab-eq-bar"
                                style={{ animationDelay: `${delay}s` }}
                            />
                        ))}
                    </div>
                    <h1 className="ab-title">SoundWave</h1>
                    <p className="ab-subtitle">Full-Stack Music Streaming Platform</p>
                    <span className="ab-badge">MERN Stack · Hobby Project</span>
                </section>

                <div className="ab-card">
                    <p className="ab-about-text">
                        SoundWave is a full-stack music streaming platform built to explore real-world
                        MERN stack development. It features a complete audio player, playlist management,
                        artist pages, smart search, role-based authentication, and an admin panel —
                        all wrapped in a polished dark glassmorphic UI.
                    </p>
                </div>

                <section>
                    <h2 className="ab-section-title">Tech Stack</h2>
                    <div className="ab-stack-grid">
                        {TECH_STACK.map(({ name, category, color, Icon }, i) => (
                            <div
                                key={name}
                                className="ab-stack-card"
                                style={{ animationDelay: `${i * 0.04}s` }}
                            >
                                <div className="ab-stack-icon" style={{ color }}>
                                    <Icon size={20} />
                                </div>
                                <div className="ab-stack-text">
                                    <p className="ab-stack-name">{name}</p>
                                    <p className="ab-stack-cat">{category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="ab-section-title">Features</h2>
                    <div className="ab-features-grid">
                        {FEATURES.map(({ Icon, label, desc }, i) => (
                            <div
                                key={label}
                                className="ab-feature-card"
                                style={{ animationDelay: `${i * 0.04}s` }}
                            >
                                <Icon size={17} className="ab-feature-icon" />
                                <div>
                                    <p className="ab-feature-label">{label}</p>
                                    <p className="ab-feature-desc">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="ab-creator-card">
                    <div className="ab-creator-avatar">PK</div>
                    <div className="ab-creator-info">
                        <p className="ab-creator-name">Prajwal Karande</p>
                        <p className="ab-creator-role">Creator &amp; Developer</p>
                    </div>
                    <a
                        href="http://github.com/PrajwalKarande/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ab-github-btn"
                    >
                        <Github size={15} />
                        <span>GitHub</span>
                    </a>
                </div>

            </div>
        </div>
    );
}
