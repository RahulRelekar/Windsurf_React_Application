import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RolesPage from './pages/RolesPage';
import UsersPage from './pages/UsersPage';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Layout title="Dashboard"><DashboardPage /></Layout>} />
        <Route path="/users" element={<Layout title="User Management"><UsersPage /></Layout>} />
        <Route path="/roles" element={<Layout title="Role Management"><RolesPage /></Layout>} />
      </Route>
    </Routes>
  );
}

export default App;

