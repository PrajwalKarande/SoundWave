import { useNavigate, Link } from 'react-router-dom';
import { Disc, Home, ArrowLeft, Music2, Headphones, MicVocal, Radio } from 'lucide-react';
import './NotFound.css';

/* Floating musical note glyphs — pure typographic decoration */
const NOTES = [
    { char: '♩', x: '7%',  y: '12%', size: '2.8rem', delay: '0s',   dur: '7s'  },
    { char: '♪', x: '88%', y: '8%',  size: '2rem',   delay: '1.4s', dur: '8.5s'},
    { char: '♫', x: '93%', y: '52%', size: '3.2rem', delay: '0.7s', dur: '9s'  },
    { char: '♬', x: '4%',  y: '62%', size: '2.4rem', delay: '2.1s', dur: '6.5s'},
    { char: '♩', x: '78%', y: '78%', size: '1.7rem', delay: '0.3s', dur: '10s' },
    { char: '♪', x: '18%', y: '83%', size: '2.6rem', delay: '1.9s', dur: '7.5s'},
    { char: '♫', x: '44%', y: '4%',  size: '1.9rem', delay: '1.1s', dur: '8s'  },
    { char: '♬', x: '62%', y: '88%', size: '3rem',   delay: '2.8s', dur: '11s' },
    { char: '♩', x: '32%', y: '6%',  size: '1.4rem', delay: '0.5s', dur: '6s'  },
    { char: '♬', x: '70%', y: '20%', size: '1.6rem', delay: '3.2s', dur: '9.5s'},
];

/* Scattered ambient icons */
const AMBIENT_ICONS = [
    { Icon: Music2,    x: '12%',  y: '30%', size: 22, delay: '0.4s' },
    { Icon: Headphones,x: '82%',  y: '35%', size: 20, delay: '1.5s' },
    { Icon: Radio,     x: '6%',   y: '48%', size: 18, delay: '2.2s' },
    { Icon: MicVocal,  x: '86%',  y: '70%', size: 20, delay: '0.9s' },
    { Icon: Music2,    x: '55%',  y: '92%', size: 16, delay: '1.7s' },
];

const EQ_DELAYS = Array.from({ length: 14 }, (_, i) => i * 0.11);

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="nf-page">

            {/* Floating note glyphs */}
            {NOTES.map(({ char, x, y, size, delay, dur }, i) => (
                <span
                    key={i}
                    className="nf-glyph"
                    style={{ left: x, top: y, fontSize: size, animationDelay: delay, animationDuration: dur }}
                >
                    {char}
                </span>
            ))}

            {/* Ambient lucide icons */}
            {AMBIENT_ICONS.map(({ Icon, x, y, size, delay }, i) => (
                <div
                    key={i}
                    className="nf-ambient-icon"
                    style={{ left: x, top: y, animationDelay: delay }}
                >
                    <Icon size={size} />
                </div>
            ))}

            {/* Gradient orbs */}
            <div className="nf-orb nf-orb-1" />
            <div className="nf-orb nf-orb-2" />
            <div className="nf-orb nf-orb-3" />

            {/* ── Center content ── */}
            <div className="nf-center">

                {/* Spinning vinyl disc */}
                <div className="nf-disc-shell">
                    <div className="nf-disc-ring nf-disc-ring-outer" />
                    <div className="nf-disc-ring nf-disc-ring-mid" />
                    <div className="nf-disc-core">
                        <Disc size={38} className="nf-disc-icon" />
                    </div>
                </div>

                {/* 404 */}
                <div className="nf-code-wrap">
                    <span className="nf-digit">4</span>
                    <span className="nf-digit nf-digit-zero">0</span>
                    <span className="nf-digit">4</span>
                </div>

                {/* Glitchy EQ bars — "broken signal" */}
                <div className="nf-eq-wrap">
                    {EQ_DELAYS.map((delay, i) => (
                        <span
                            key={i}
                            className="nf-eq-bar"
                            style={{ animationDelay: `${delay}s` }}
                        />
                    ))}
                </div>

                {/* Text */}
                <p className="nf-tagline">bestie, this ain't it</p>
                <p className="nf-body">
                    you deadass navigated to a page that doesn't exist.<br />
                    the url gaslit you. respectfully.
                </p>

                {/* Actions */}
                <div className="nf-actions">
                    <Link to="/home" className="nf-btn-primary">
                        <Home size={15} />
                        <span>get me outta here</span>
                    </Link>
                    <button onClick={() => navigate(-1)} className="nf-btn-ghost">
                        <ArrowLeft size={15} />
                        <span>undo that L</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
