import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Paper,
    useTheme,
    useMediaQuery,
    CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/animations.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Emergency scene with fire trucks and emergency responders
const heroBg = 'https://images.pexels.com/photos/923681/pexels-photo-923681.jpeg?auto=compress&cs=tinysrgb&w=1500';
const logo = 'https://img.icons8.com/color/96/000000/ambulance.png';

const quickLinks = [
    {
        title: 'Emergency Report',
        description: 'Report emergencies and get immediate assistance from nearby responders.',
        image: 'https://images.pexels.com/photos/4586714/pexels-photo-4586714.jpeg?auto=compress&cs=tinysrgb&w=600',
        link: '/report',
        button: 'Report Now'
    },
    {
        title: 'Safety Tips',
        description: 'Get essential tips for emergency and disaster preparedness.',
        image: 'https://images.pexels.com/photos/8942991/pexels-photo-8942991.jpeg?auto=compress&cs=tinysrgb&w=600',
        link: '/features',
        button: 'View Tips'
    },
    {
        title: 'Get Started',
        description: 'Join our network of responders and make a difference in your community.',
        image: 'https://images.pexels.com/photos/5988174/pexels-photo-5988174.jpeg?auto=compress&cs=tinysrgb&w=600',
        link: '/get-started',
        button: 'Join Now'
    }
];

const Home = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { currentUser, user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    useEffect(() => {
        console.log("Home page - Auth state:", { currentUser, user });

        const checkUserProfile = async () => {
            try {
                const authUser = currentUser || user;

                if (!authUser) {
                    console.log("No authenticated user found in Home component");
                    setLoading(false);
                    return;
                }

                console.log("Checking profile for user:", authUser.uid);

                try {
                    const userDoc = await getDoc(doc(db, 'users', authUser.uid));
                    if (!userDoc.exists()) {
                        console.log("User document doesn't exist, redirecting to get-started");
                        // Don't redirect immediately, just log for now
                    } else {
                        console.log("User document exists:", userDoc.data());
                    }
                } catch (error) {
                    console.error('Error checking user profile:', error);
                    setError("Error loading user profile. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        checkUserProfile();
    }, [currentUser, user, navigate]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    sx={{ mt: 2 }}
                >
                    Return to Start
                </Button>
            </Box>
        );
    }

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
                                    fontSize: isMobile ? '2.5rem' : '4rem',
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
                                    fontSize: isMobile ? '1.2rem' : '1.5rem',
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

            {/* Quick Links Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={4}>
                    {quickLinks.map((link, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                    },
                                }}
                                data-aos="fade-up"
                                data-aos-delay={index * 200}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={link.image}
                                    alt={link.title}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        {link.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        {link.description}
                                    </Typography>
                                    <Button
                                        component={Link}
                                        to={link.link}
                                        variant="contained"
                                        sx={{
                                            bgcolor: '#e31837',
                                            '&:hover': { bgcolor: '#c1142f' },
                                        }}
                                    >
                                        {link.button}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Emergency Report Section */}
            <Box
                sx={{
                    bgcolor: '#f5f5f5',
                    py: 8,
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h3"
                                sx={{ mb: 3 }}
                                data-aos="fade-right"
                            >
                                Report an Emergency
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ mb: 4, fontSize: '1.1rem' }}
                                data-aos="fade-right"
                                data-aos-delay="200"
                            >
                                Need immediate assistance? Report an emergency and get connected with nearby responders who can help.
                            </Typography>
                            <Button
                                component={Link}
                                to="/report"
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: '#e31837',
                                    '&:hover': { bgcolor: '#c1142f' },
                                    fontSize: '1.1rem',
                                    px: 4,
                                    py: 1.5,
                                }}
                                data-aos="fade-up"
                                data-aos-delay="400"
                            >
                                Report Emergency
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                src="https://images.pexels.com/photos/5721555/pexels-photo-5721555.jpeg?auto=compress&cs=tinysrgb&w=800"
                                alt="Emergency Response"
                                sx={{
                                    width: '100%',
                                    borderRadius: 2,
                                    boxShadow: 3,
                                }}
                                data-aos="fade-left"
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Home; 