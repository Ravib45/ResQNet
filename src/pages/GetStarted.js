import React from 'react';
import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

const heroBg = 'https://images.pexels.com/photos/5721555/pexels-photo-5721555.jpeg?auto=compress&cs=tinysrgb&w=1500';

const GetStarted = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    React.useEffect(() => {
        AOS.init({ duration: 1000, once: true });
        // If user is already logged in, redirect to home
        if (currentUser) {
            navigate('/home');
        }
    }, [currentUser, navigate]);

    return (
        <Box sx={{ overflow: 'hidden' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    height: '80vh',
                    backgroundImage: `url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h1"
                                sx={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    mb: 2,
                                    fontSize: { xs: '2.5rem', md: '4rem' },
                                }}
                                data-aos="fade-right"
                            >
                                ResQNet
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'white',
                                    mb: 4,
                                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                                }}
                                data-aos="fade-right"
                                data-aos-delay="200"
                            >
                                Connecting Communities with Emergency Responders
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Action Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                borderRadius: 2,
                            }}
                            data-aos="fade-up"
                        >
                            <Typography variant="h4" gutterBottom>
                                Get Started
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Join our network of emergency responders and make a difference in your community.
                            </Typography>
                            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        bgcolor: '#e31837',
                                        '&:hover': { bgcolor: '#c1142f' },
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    component={Link}
                                    to="/register"
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderColor: '#e31837',
                                        color: '#e31837',
                                        '&:hover': {
                                            borderColor: '#c1142f',
                                            color: '#c1142f',
                                        },
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                    }}
                                >
                                    Register
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default GetStarted;