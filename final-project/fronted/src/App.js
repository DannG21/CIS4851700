import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HabitDetail from './pages/HabitDetail';
import Profile from './pages/Profile';
import Statistics from './pages/Statistics';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';

import NavigationLayout from './components/Layout/NavigationLayout';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return null;
    }
    
    return user ? children : <Navigate to="/login" />;
};

const PrivateLayoutRoute = ({ children }) => {
    return (
        <PrivateRoute>
            <NavigationLayout>
                {children}
            </NavigationLayout>
        </PrivateRoute>
    );
};

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Private routes with navigation */}
                        <Route
                            path="/"
                            element={
                                <PrivateLayoutRoute>
                                    <Dashboard />
                                </PrivateLayoutRoute>
                            }
                        />
                        <Route
                            path="/habits/:id"
                            element={
                                <PrivateLayoutRoute>
                                    <HabitDetail />
                                </PrivateLayoutRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateLayoutRoute>
                                    <Profile />
                                </PrivateLayoutRoute>
                            }
                        />
                        <Route
                            path="/stats"
                            element={
                                <PrivateLayoutRoute>
                                    <Statistics />
                                </PrivateLayoutRoute>
                            }
                        />
                        <Route
                            path="/leaderboard"
                            element={
                                <PrivateLayoutRoute>
                                    <Leaderboard />
                                </PrivateLayoutRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <PrivateLayoutRoute>
                                    <Settings />
                                </PrivateLayoutRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;