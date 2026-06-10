import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Music, Zap, Users, ChevronRight, Play } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../public/logo.png';
import './Landing.css';
import { useEffect, useState, useMemo, useRef } from 'react';
import api from '../../Services/api';
import { useAuth } from '../../Context/AuthContextProvider';

// Animated counter component
const AnimatedCounter = ({ target, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ songs: 100, artists: 30, users: 50 });
  const [introComplete, setIntroComplete] = useState(false);
  const landingRef = useRef(null);

  // Parallax scroll setup
  const { scrollYProgress } = useScroll({ container: landingRef });
  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const bgY3 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  // Compute once on mount so re-renders (e.g. stats load) don't re-randomize the bars
  const waveformBars = useMemo(() =>
    Array.from({ length: 40 }, () => ({
      height: Math.random() * 80 + 20,
      duration: Math.random() * 0.8 + 0.8,
    })),
    []
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userRes = await api.get('/stats');
        setStats({
          users: userRes.data.users,
          songs: userRes.data.songs,
          artists: userRes.data.artists,
        });
      } catch (err) {
        // Silently fail - use default stats if API fails
        console.log("Stats not available");
      }
    };
    fetchStats();
  }, []);
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="landing-page" ref={landingRef}>
      {/* Film grain overlay */}
      <div className="grain-overlay" />

      {/* Intro Splash Animation */}
      <AnimatePresence>
        {!introComplete && (
          <motion.div
            className="intro-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="intro-content"
              animate={{ y: [0, 0, -window.innerHeight / 2 + 40] }}
              transition={{
                times: [0, 0.6, 1],
                duration: 2.4,
                ease: 'easeInOut',
              }}
              onAnimationComplete={() => setIntroComplete(true)}
            >
              <motion.img
                src={logo}
                alt="SoundWave"
                className="intro-logo"
                initial={{ x: '-50vw', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="intro-title"
                initial={{ x: '50vw', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                SOUNDWAVE
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SoundWave Header */}
      <motion.header
        className="landing-header"
        initial={{ opacity: 0 }}
        animate={introComplete ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="landing-header-content">
          <Link to="/" className="landing-logo-section">
            <img src={logo} alt="SoundWave" className="landing-logo" />
            <span className="landing-title">SOUNDWAVE</span>
          </Link>

          <div className="landing-header-auth">
            {user ? (
              <div className="landing-user-info">
                <span className="landing-username">{user.username}</span>
                <motion.button
                  onClick={() => user.role === 'admin' ? navigate('/admin/dashboard') : navigate('/home')}
                  className="landing-btn landing-btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user.role === 'admin' ? 'Dashboard' : 'Home'}
                </motion.button>
              </div>
            ) : (
              <div className="landing-auth-buttons">
                <Link to="/login">
                  <motion.button
                    className="landing-btn landing-btn-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    className="landing-btn landing-btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        className="hero-section"
        initial="hidden"
        animate={introComplete ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Parallax background elements */}
        <motion.div className="bg-element bg-element-1" style={{ y: bgY1 }} variants={floatVariants} animate="animate" />
        <motion.div className="bg-element bg-element-2" style={{ y: bgY2 }} variants={floatVariants} animate="animate" />
        <motion.div className="bg-element bg-element-3" style={{ y: bgY3 }} variants={floatVariants} animate="animate" />

        <div className="hero-content">

          {/* Main heading */}
          <motion.h1 className="hero-title" variants={itemVariants}>
            <span className="text-gradient">Immerse Yourself</span>
            <br />
            <span className="text-gradient">in Pure Sound</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p className="hero-subtitle" variants={itemVariants}>
            Discover songs you love, create playlists, and lose yourself in the music.
            Your personal sound experience starts here.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className="cta-buttons" variants={itemVariants}>
            {user ? (
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/home')}
              >
                Continue Listening
                <ChevronRight size={20} />
              </motion.button>
            ) : (
              <>
                <Link to="/signup">
                  <motion.button
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Listening Free
                    <ChevronRight size={20} />
                  </motion.button>
                </Link>
              </>
            )}
          </motion.div>

          <motion.div
            className="now-playing-card"
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(6, 201, 224, 0.2)' }}
          >
            <div className="np-album-art">
              <motion.div
                className="np-vinyl"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
              />
              <div className="np-play-btn">
                <Play size={16} fill="white" />
              </div>
            </div>
            <div className="np-info">
              <span className="np-label">NOW PLAYING</span>
              <span className="np-track">Midnight Drive</span>
              <span className="np-artist">SoundWave Radio</span>
              <div className="np-progress">
                <motion.div
                  className="np-progress-fill"
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 12, ease: 'linear', repeat: Infinity }}
                />
              </div>
              <div className="np-time">
                <span>1:24</span>
                <span>3:45</span>
              </div>
            </div>
            <div className="np-visualizer">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="np-viz-bar"
                  animate={{ height: [8, 24 + Math.random() * 16, 8] }}
                  transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div className="waveform-container" variants={itemVariants}>
          {waveformBars.map((bar, i) => (
            <motion.div
              key={i}
              className="waveform-bar"
              animate={{
                height: [20, bar.height, 20],
              }}
              transition={{
                duration: bar.duration,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: i * 0.04,
              }}
            />
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="features-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.h2 className="section-title" variants={itemVariants}>
          The Rhythm of <span className="text-accent">SoundWave</span>
        </motion.h2>

        <motion.div className="features-grid" variants={containerVariants}>
          <motion.div
            className="feature-card"
            variants={itemVariants}
            whileHover={{
              y: -10,
              boxShadow: '0 20px 40px rgba(6, 201, 224, 0.15)',
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="feature-icon"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Music size={40} />
            </motion.div>
            <h3>Tracks You Love</h3>
            <p>Access our vast library of music across all genres</p>
          </motion.div>

          <motion.div
            className="feature-card"
            variants={itemVariants}
            whileHover={{
              y: -10,
              boxShadow: '0 20px 40px rgba(6, 201, 224, 0.15)',
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="feature-icon"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Zap size={40} />
            </motion.div>
            <h3>Lightning Fast</h3>
            <p>High-quality streaming with zero buffering. Play any song instantly.</p>
          </motion.div>

          <motion.div
            className="feature-card"
            variants={itemVariants}
            whileHover={{
              y: -10,
              boxShadow: '0 20px 40px rgba(6, 201, 224, 0.15)',
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="feature-icon"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Users size={40} />
            </motion.div>
            <h3>Curate & Craft</h3>
            <p>Build the perfect playlists and organize your library exactly how you like it.</p>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        className="stats-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.div className="stats-container" variants={containerVariants}>
          <motion.div className="stat-item" variants={itemVariants}>
            <h3><AnimatedCounter target={stats.songs} suffix="+" /></h3>
            <p>Songs</p>
          </motion.div>

          <motion.div className="stat-item" variants={itemVariants}>
            <h3><AnimatedCounter target={stats.users} suffix="+" /></h3>
            <p>Active Users</p>
          </motion.div>

          <motion.div className="stat-item" variants={itemVariants}>
            <h3><AnimatedCounter target={stats.artists} suffix="+" /></h3>
            <p>Artists</p>
          </motion.div>
        </motion.div>
      </motion.section>


      <motion.section
        className="final-cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.div className="final-cta-content" variants={itemVariants}>
          <h2>Ready to Experience Music Like Never Before?</h2>
          <p>{user ? 'Continue your music journey.' : 'Start your journey today.'}</p>

          {user ? (
            <motion.button
              className="btn btn-large"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/home')}
            >
              Continue Listening
              <ChevronRight size={22} />
            </motion.button>
          ) : (
            <Link to="/signup">
              <motion.button
                className="btn btn-large"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Listening Now
                <ChevronRight size={22} />
              </motion.button>
            </Link>
          )}
        </motion.div>

        <motion.div
          className="cta-bg-glow"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      </motion.section>

      <motion.footer
        className="landing-footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="footer-content">
          <div className="footer-section">
            <h4>SoundWave</h4>
            <p>Your personal music experience.</p>
          </div>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 SoundWave. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
};

