import { motion } from 'framer-motion';
import { Music, Zap, Users, Play, ChevronRight, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Landing.css';
import { useEffect, useState } from 'react';
import api from '../../Services/api';
import { useAuth } from '../../Context/AuthContextProvider';

export const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ songs: 100, artists: 30, users: 50 });

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

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 0 20px rgba(255, 67, 19, 0)',
        '0 0 40px rgba(255, 67, 19, 0.6)',
        '0 0 20px rgba(255, 67, 19, 0)',
      ],
      transition: {
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="landing-page">
      {/* SoundWave Header */}
      <motion.header
        className="landing-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
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
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated background elements */}
        <motion.div className="bg-element bg-element-1" variants={floatVariants} animate="animate" />
        <motion.div className="bg-element bg-element-2" variants={floatVariants} animate="animate" />
        <motion.div className="bg-element bg-element-3" variants={floatVariants} animate="animate" />

        <div className="hero-content">
          {/* Logo and tagline */}
          <motion.div className="logo-section" variants={itemVariants}>
            <img src={logo} alt="SoundWave" className="hero-logo" />

          </motion.div>

          {/* Main heading */}
          <motion.h1 className="hero-title" variants={itemVariants}>
            <span className="text-gradient">Immerse Yourself</span>
            <br />
            in Pure Sound
          </motion.h1>

          {/* Subheading */}
          <motion.p className="hero-subtitle" variants={itemVariants}>
            Discover songs you love, create playlists, and lose yourself in the music.
            Your personal sound experience starts here.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className="cta-buttons" variants={itemVariants}>
            {user ? (
              <>
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/home')}
                >
                  Continue Listening
                  <ChevronRight size={20} />
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <motion.button
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started Now
                    <ChevronRight size={20} />
                  </motion.button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Animated play button */}
          <motion.div
            className="floating-play-btn"
            variants={pulseVariants}
            animate="animate"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play size={28} fill="currentColor" />
          </motion.div>
        </div>

        {/* Animated waveform visualization */}
        <motion.div className="waveform-container" variants={itemVariants}>
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="waveform-bar"
              animate={{
                height: [20, Math.random() * 100 + 20, 20],
              }}
              transition={{
                duration: Math.random() * 0.5 + 0.3,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
              style={{
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </motion.div>
      </motion.section>

      {/* Features Section */}
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
          {/* Feature 1 */}
          <motion.div
            className="feature-card"
            variants={itemVariants}
            whileHover={{
              y: -10,
              boxShadow: '0 20px 40px rgba(255, 67, 19, 0.15)',
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

          {/* Feature 2 */}
          <motion.div
            className="feature-card"
            variants={itemVariants}
            whileHover={{
              y: -10,
              boxShadow: '0 20px 40px rgba(255, 67, 19, 0.15)',
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

          {/* Feature 3 */}
          <motion.div
            className="feature-card"
            variants={itemVariants}
            whileHover={{
              y: -10,
              boxShadow: '0 20px 40px rgba(255, 67, 19, 0.15)',
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

      {/* Music Stats Section */}
      <motion.section
        className="stats-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.div className="stats-container" variants={containerVariants}>
          {/* Stat 1 */}
          <motion.div className="stat-item" variants={itemVariants}>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {stats.songs}+
              </motion.span>
            </motion.h3>
            <p>Songs</p>
          </motion.div>

          {/* Stat 2 */}
          <motion.div className="stat-item" variants={itemVariants}>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {stats.users}+
              </motion.span>
            </motion.h3>
            <p>Active Users</p>
          </motion.div>

          {/* Stat 3 */}
          <motion.div className="stat-item" variants={itemVariants}>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                24/7
              </motion.span>
            </motion.h3>
            <p>Uninterrupted Streaming</p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="testimonials-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.h2 className="section-title" variants={itemVariants}>
          What Users Love
        </motion.h2>

        <motion.div className="testimonials-grid" variants={containerVariants}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="testimonial-stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" className="star" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <p className="author-name">{testimonial.name}</p>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="final-cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.div className="final-cta-content" variants={itemVariants}>
          <h2>Ready to Experience Music Like Never Before?</h2>
          <p>{user ? 'Continue your music journey.' : 'Join millions of music lovers and start your journey today.'}</p>

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

        {/* Animated background gradient */}
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

      {/* Footer */}
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
          <p>&copy; 2025 SoundWave. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
};

// Testimonials data
const testimonials = [
  {
    rating: 5,
    text: 'SoundWave has completely changed how I discover music. The recommendations are spot-on and the quality is unmatched.',
    name: 'Sarah Johnson',
    role: 'Music Producer',
    avatar: 'SJ',
  },
  {
    rating: 5,
    text: 'Finally a streaming service that gets it. Fast, beautiful interface, and endless music options.',
    name: 'Alex Chen',
    role: 'Podcast Host',
    avatar: 'AC',
  },
  {
    rating: 5,
    text: 'The playlist sharing feature is amazing. My friends and I connect over music more than ever.',
    name: 'Maya Patel',
    role: 'Student',
    avatar: 'MP',
  },
  {
    rating: 5,
    text: 'Zero buffering, incredible sound quality. This is what streaming should be.',
    name: 'James Wilson',
    role: 'Audio Engineer',
    avatar: 'JW',
  },
];
