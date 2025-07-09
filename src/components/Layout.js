import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../actions/authActions';

const Layout = ({ children, title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h3>PID Tool</h3>
        <nav>
          <ul>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/users">User Management</NavLink></li>
            <li><NavLink to="/roles">Role Management</NavLink></li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <a href="#!" onClick={handleLogout}>Logout</a>
        </div>
      </aside>
      <main className="main-content">
        <header>
          <h1>{title}</h1>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;
