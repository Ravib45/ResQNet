import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import EmergencyReport from './pages/EmergencyReport';
import Login from './pages/Login';
import Register from './pages/Register';
import GetStarted from './pages/GetStarted';
import Profile from './pages/Profile';
import AdminPage from './pages/AdminPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute, AdminRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { Box, CircularProgress, Typography, Paper, Container } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
    },
});

// Debug component for role checking
const RoleDiagnostic = () => {
    const { isAuthenticated, currentUser, userRole } = useAuth();

    return (
        <Container maxWidth="md" sx={{ pt: 12, pb: 6 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    User Role Diagnostic
                </Typography>
                <Typography variant="body1" paragraph>
                    This page shows your current authentication status and role information.
                </Typography>

                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Authentication Status</Typography>
                    <Typography variant="body1">
                        Authenticated: {isAuthenticated ? "Yes" : "No"}
                    </Typography>
                    <Typography variant="body1">
                        Current User: {currentUser?.email || "None"}
                    </Typography>
                    <Typography variant="body1">
                        User Role: {userRole || "None"}
                    </Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Dashboard Access</Typography>
                    <Typography variant="body1">
                        Regular user access to Home page.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

// Custom route component to handle root path redirects
const RootRedirect = () => {
    const { isAuthenticated, isAdmin, userRole } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Give auth context time to fully initialize
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [isAuthenticated, isAdmin, userRole]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Redirect based on authentication and role
    if (isAuthenticated) {
        // Check if user is admin
        if (isAdmin || userRole === 'admin') {
            console.log("Root redirect: Detected admin user, redirecting to admin page");
            window.location.href = '/admin';
            return null;
        }
        // For regular users
        console.log("Root redirect: Detected regular user, redirecting to home page");
        return <Navigate to="/home" />;
    }

    return <GetStarted />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        {/* Root Route with conditional redirect */}
                        <Route path="/" element={<RootRedirect />} />

                        {/* Diagnostic Route */}
                        <Route path="/role-check" element={<RoleDiagnostic />} />

                        {/* Admin Pages */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminPage />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <AdminRoute>
                                    <AdminUsersPage />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/dashboard"
                            element={
                                <AdminRoute>
                                    <AdminDashboardPage />
                                </AdminRoute>
                            }
                        />

                        {/* Public Routes */}
                        <Route path="/get-started" element={<GetStarted />} />
                        <Route
                            path="/login"
                            element={
                                <PublicOnlyRoute>
                                    <Login />
                                </PublicOnlyRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicOnlyRoute>
                                    <Register />
                                </PublicOnlyRoute>
                            }
                        />

                        {/* Protected Routes */}
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/about"
                            element={
                                <ProtectedRoute>
                                    <About />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/features"
                            element={
                                <ProtectedRoute>
                                    <Features />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/report-emergency"
                            element={
                                <ProtectedRoute>
                                    <EmergencyReport />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                    <Footer />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
