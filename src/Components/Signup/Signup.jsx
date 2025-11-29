// src/components/Signup/Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContextProvider'
import logo from '../../assets/logo.svg';
import './signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // Username validation
  const validateUsername = (username) => {
    return username.length >= 3;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors when user types
    setError('');
    setFieldErrors({
      ...fieldErrors,
      [name]: '',
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errors = { ...fieldErrors };

    // Validate on blur
    if (name === 'email' && value && !validateEmail(value)) {
      errors.email = 'Please enter a valid email address';
    }
    if (name === 'password' && value && !validatePassword(value)) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (name === 'username' && value && !validateUsername(value)) {
      errors.username = 'Username must be at least 3 characters';
    }

    setFieldErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate all fields
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (!validateUsername(formData.username)) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await signup(formData.email, formData.username, formData.password);
      navigate('/'); // Redirect to home after successful signup
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    
      <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white">
        {/* Header with logo */}
        <header className="mb-8">
          <img src={logo} alt="Soundwave" className="h-12 mx-auto" />
        </header>

        {/* Signup Form */}
        <main className="bg-black rounded-lg shadow-lg p-12 w-screen">
          <h1 className="text-2xl mb-6 text-center font-sans font-bold">
            Join the rhythm, live the wave.
          </h1>

          {/* Global Error Message */}
          {error && (
            <div className="max-w-80 mx-auto mb-4 bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-80 mx-auto">
            {/* Username Field */}
            <div>
              <input
                type="text"
                name="username"
                placeholder="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 rounded border ${fieldErrors.username
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-700 focus:ring-green-500'
                  } bg-black text-white focus:outline-none focus:ring-2`}
              />
              {fieldErrors.username && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="name@domain.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 rounded border ${fieldErrors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-700 focus:ring-green-500'
                  } bg-black text-white focus:outline-none focus:ring-2`}
              />
              {fieldErrors.email && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 rounded border ${fieldErrors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-700 focus:ring-green-500'
                  } bg-black text-white focus:outline-none focus:ring-2`}
              />
              {fieldErrors.password && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">Minimum 8 characters required</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-sm text-gray-400 text-center">
            <p>Already have an account?</p>
            <Link
              to="/login"
              className="text-green-500 hover:underline font-medium"
            >
              Login
            </Link>
          </div>
        </main>
      </div>
  );
}

export default Signup;