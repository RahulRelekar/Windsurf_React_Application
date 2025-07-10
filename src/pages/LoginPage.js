import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../actions/authActions';

const LoginPage = () => {
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [navigate, userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  return (
    <div className="login-page-wrapper">
      <div className="container login-container">
      <form className="login-form wow-login-form" onSubmit={handleSubmit}>
        <div className="login-logo">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="28" cy="28" r="28" fill="#007bff"/>
            <path d="M18 29.5L25 36.5L38 23.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="wow-login-title">Automated Project ID Tool</h2>
        <div className="wow-login-tagline">Empowering effortless project onboarding</div>
        <hr className="wow-login-divider" />
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group wow-password-group">
          <label htmlFor="password">Password</label>
          <div className="wow-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="wow-password-toggle"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="20" height="20" fill="none" stroke="#007bff" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="#007bff" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C5 19 1 12 1 12a21.8 21.8 0 0 1 5.06-7.94M9.53 9.53A3.001 3.001 0 0 0 12 15c2.21 0 4-1.79 4-4 0-.47-.08-.92-.22-1.34M15 15l2 2M9 9l-2-2"/></svg>
              )}
            </button>
          </div>
        </div>
        <button type="submit" className="btn wow-login-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      </div>
    </div>
  );
};

export default LoginPage;
