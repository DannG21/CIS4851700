import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import HabitDetails from './pages/HabitDetails';
import Profile from './pages/Profile';
import Statistics from './pages/Statistics';
import NotFound from './pages/NotFound';
import Layout from './components/layout/Layout';
import { useAuth } from './hooks/useAuth';

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/habit/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <HabitDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <ProtectedRoute>
            <Layout>
              <Statistics />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;