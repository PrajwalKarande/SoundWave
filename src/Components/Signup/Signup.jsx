import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContextProvider';
import logo from '../../../public/logo.png';
import './signup.css';

function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();

  const validateEmail    = (email)    => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;
  const validateUsername = (username) => username.length >= 3;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    setFieldErrors({ ...fieldErrors, [name]: '' });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errors = { ...fieldErrors };
    if (name === 'email'    && value && !validateEmail(value))    errors.email    = 'Please enter a valid email address';
    if (name === 'password' && value && !validatePassword(value)) errors.password = 'Password must be at least 8 characters';
    if (name === 'username' && value && !validateUsername(value)) errors.username = 'Username must be at least 3 characters';
    setFieldErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const errors = {};
    if (!formData.username.trim())           errors.username = 'Username is required';
    else if (!validateUsername(formData.username)) errors.username = 'Username must be at least 3 characters';

    if (!formData.email.trim())              errors.email = 'Email is required';
    else if (!validateEmail(formData.email)) errors.email = 'Please enter a valid email address';

    if (!formData.password)                       errors.password = 'Password is required';
    else if (!validatePassword(formData.password)) errors.password = 'Password must be at least 6 characters';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const newUser = await signup(formData.email, formData.username, formData.password);
      if (newUser?.role === 'admin') navigate('/admin/dashboard');
      else navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Ambient orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-card">
        {/* Logo + EQ decoration */}
        <div className="auth-header">
          <div className="auth-eq-bars">
            {[0,1,2,3,4].map(i => <span key={i} className="auth-eq-bar" />)}
          </div>
          <img src={logo} alt="Soundwave" className="auth-logo" />
        </div>

        <h1 className="auth-title">Join the rhythm</h1>
        <p className="auth-subtitle">Create your account and start listening</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-username">Username</label>
            <input
              id="signup-username"
              type="text"
              name="username"
              placeholder="yourname"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`auth-input${fieldErrors.username ? ' auth-input--error' : ''}`}
              autoComplete="username"
            />
            {fieldErrors.username && <p className="auth-field-error">{fieldErrors.username}</p>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              placeholder="name@domain.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`auth-input${fieldErrors.email ? ' auth-input--error' : ''}`}
              autoComplete="email"
            />
            {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-password">Password</label>
            <div className="auth-input-wrap">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`auth-input${fieldErrors.password ? ' auth-input--error' : ''}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-pw-toggle"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password
              ? <p className="auth-field-error">{fieldErrors.password}</p>
              : <p className="auth-helper">Minimum 8 characters required</p>
            }
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? <span className="auth-spinner" /> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
