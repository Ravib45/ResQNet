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
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.95)' }} data-aos="fade-up">
                    <Typography variant="h4" align="center" fontWeight="bold" gutterBottom data-aos="fade-down">
                        Welcome Back
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

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
                                py: 1.2,
                                borderRadius: 2,
                                bgcolor: 'primary.main'
                            }}
                            data-aos="fade-up"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                        </Button>

                        <Box textAlign="center" mt={2} data-aos="fade-up">
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Don't have an account?{' '}
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={() => navigate('/register')}
                                    sx={{ fontWeight: 'bold' }}
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