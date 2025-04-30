import React, { useState, useEffect } from 'react';
import {
    Box, Button, Container, Paper, TextField, Typography, Alert, CircularProgress, Divider, InputAdornment, Link
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import AOS from 'aos';
import 'aos/dist/aos.css';

const loginBg = 'https://images.pexels.com/photos/9003645/pexels-photo-9003645.jpeg?auto=compress&cs=tinysrgb&w=1500';

// Admin credentials
const ADMIN_CREDENTIALS = {
    email: 'admin@gmail.com',
    password: 'admin@123'
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginType, setLoginType] = useState('user'); // Just for UI, doesn't affect functionality
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log("Login attempt with email:", email);
        
        try {
            // First authenticate with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Firebase authentication successful:", userCredential.user.email);
            
            // Check if credentials match admin
            const isAdmin = 
                email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() && 
                password === ADMIN_CREDENTIALS.password;
            
            console.log("Is admin user?", isAdmin);
            
            if (isAdmin) {
                console.log("Admin login successful - storing admin role");
                
                // Store admin role in localStorage
                localStorage.setItem('userRole', 'admin');
                
                // Force navigation with page reload for admin
                window.location.href = '/admin';
            } else {
                console.log("Regular user login - storing user role");
                
                // Store regular user role
                localStorage.setItem('userRole', 'user');
                
                // Navigate to home
                navigate('/home');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message.replace('Firebase: ', ''));
            setLoading(false);
        }
    };

    // Helper function for admin login hint
    const handleAdminSelect = () => {
        setLoginType('admin');
        setEmail('');
    };

    // Helper function for user login
    const handleUserSelect = () => {
        setLoginType('user');
        setEmail('');
    };

    return (
        <Box sx={{
            pt: 10,
            pb: 6,
            minHeight: '100vh',
            background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url(${loginBg}) center/cover no-repeat`,
            display: 'flex',
            alignItems: 'center',
        }}>
            <Container maxWidth="sm">
                <Paper 
                    elevation={6} 
                    sx={{ 
                        p: 4, 
                        borderRadius: 3, 
                        bgcolor: 'rgba(255,255,255,0.97)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        overflow: 'hidden'
                    }} 
                    data-aos="fade-up"
                >
                    <Box sx={{ position: 'relative', mb: 4 }}>
                        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom data-aos="fade-down">
                            Welcome Back
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                    </Box>

                    {/* Login Type Options - Tabs Style */}
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            borderRadius: 2, 
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            mb: 3,
                            overflow: 'hidden'
                        }}
                    >
                        <Box 
                            onClick={handleUserSelect}
                            sx={{ 
                                flex: 1, 
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: loginType === 'user' ? 'primary.main' : 'background.paper',
                                color: loginType === 'user' ? 'white' : 'text.primary',
                                borderBottom: loginType === 'user' ? '3px solid #1565c0' : '3px solid transparent',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: loginType === 'user' ? 'primary.main' : 'rgba(0,0,0,0.04)',
                                }
                            }}
                        >
                            <PersonIcon sx={{ fontSize: 32, mb: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold">
                                User Login
                            </Typography>
                        </Box>
                        <Box 
                            onClick={handleAdminSelect}
                            sx={{ 
                                flex: 1, 
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: loginType === 'admin' ? 'primary.main' : 'background.paper',
                                color: loginType === 'admin' ? 'white' : 'text.primary',
                                borderBottom: loginType === 'admin' ? '3px solid #1565c0' : '3px solid transparent',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: loginType === 'admin' ? 'primary.main' : 'rgba(0,0,0,0.04)',
                                }
                            }}
                        >
                            <LockIcon sx={{ fontSize: 32, mb: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold">
                                Admin Login
                            </Typography>
                        </Box>
                    </Box>

                    {/* Standard Login Form */}
                    <form onSubmit={handleLogin}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }} data-aos="fade-up">
                                {error}
                            </Alert>
                        )}

                        <TextField
                            label="Email Address"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            type="email"
                            margin="normal"
                            placeholder={loginType === 'admin' ? "Enter Admin Email" : "Enter Your Email"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            data-aos="fade-up"
                        />

                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            type="password"
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            data-aos="fade-up"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: 2,
                                bgcolor: 'primary.main',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                                '&:hover': {
                                    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                                }
                            }}
                            data-aos="fade-up"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "LOGIN"}
                        </Button>

                        <Box textAlign="center" mt={3} data-aos="fade-up">
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?{' '}
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={() => navigate('/register')}
                                    sx={{ fontWeight: 'bold', color: 'primary.main' }}
                                >
                                    Register
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;