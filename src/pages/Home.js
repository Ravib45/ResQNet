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
    Divider,
    Paper,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Alert,
    IconButton,
    Stack
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/animations.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Icons
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import InfoIcon from '@mui/icons-material/Info';
import MapIcon from '@mui/icons-material/Map';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Emergency scene with first responders - updated with better background
const heroBg = 'https://images.pexels.com/photos/4506226/pexels-photo-4506226.jpeg?auto=compress&cs=tinysrgb&w=1500';

// Emergency services images
const policeImg = 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=800';
const fireImg = 'https://images.pexels.com/photos/260367/pexels-photo-260367.jpeg?auto=compress&cs=tinysrgb&w=800';
const ambulanceImg = 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800';

const emergencyServices = [
    {
        id: 'police',
        title: 'Police Response',
        description: 'Immediate police assistance for emergencies, crimes in progress, and threats to public safety.',
        icon: <LocalPoliceIcon sx={{ fontSize: 40 }} />,
        color: '#1a237e',
        bgColor: '#e8eaf6',
        image: policeImg
    },
    {
        id: 'fire',
        title: 'Fire & Rescue',
        description: 'Emergency response to fires, hazardous situations, and rescue operations.',
        icon: <FireTruckIcon sx={{ fontSize: 40 }} />,
        color: '#b71c1c',
        bgColor: '#ffebee',
        image: fireImg
    },
    {
        id: 'medical',
        title: 'Medical Emergency',
        description: 'Rapid medical assistance for life-threatening conditions and injuries.',
        icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
        color: '#004d40',
        bgColor: '#e0f2f1',
        image: ambulanceImg
    }
];

const emergencySteps = [
    {
        number: 1,
        title: "Don't panic, we can help",
        description: "Try not to worry, ResQNet is here to help you.",
        icon: <InfoIcon />
    },
    {
        number: 2,
        title: "Stay safe and secure",
        description: "Move to a safe location if possible and follow safety instructions.",
        icon: <CheckCircleIcon />
    },
    {
        number: 3,
        title: "Contact ResQNet",
        description: "Our specialists will guide you through the next steps.",
        icon: <PhoneInTalkIcon />
    },
    {
        number: 4,
        title: "Help is on the way",
        description: "Emergency services will be dispatched to your location promptly.",
        icon: <LocationOnIcon />
    }
];

const benefitsList = [
    "Fast, Hassle-Free Service",
    "24/7 Emergency Response",
    "Fully Trained Responders",
    "GPS Location Tracking",
    "Real-time Status Updates"
];

// Updating to more impressive background images
const stepsBackgroundImg = 'https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=1500';
const offerBackgroundImg = 'https://images.pexels.com/photos/6156371/pexels-photo-6156371.jpeg?auto=compress&cs=tinysrgb&w=1500';
const servicesBackgroundImg = 'https://images.pexels.com/photos/1544946/pexels-photo-1544946.jpeg?auto=compress&cs=tinysrgb&w=1500';

const Home = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { currentUser, user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responseCount, setResponseCount] = useState(5842);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    useEffect(() => {
        const checkUserProfile = async () => {
            try {
                const authUser = currentUser || user;

                if (!authUser) {
                    console.log("No authenticated user found in Home component");
                    setLoading(false);
                    return;
                }

                try {
                    const userDoc = await getDoc(doc(db, 'users', authUser.uid));
                    if (!userDoc.exists()) {
                        console.log("User document doesn't exist");
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
            {/* Hero Section - Updated to match Wrong Fuel Rescue style */}
            <Box
                sx={{
                    position: 'relative',
                    minHeight: '90vh',
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pt: { xs: 8, md: 0 },
                    pb: { xs: 8, md: 0 },
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Typography
                                variant="h1"
                                sx={{
                                    color: 'white',
                                    fontWeight: '900',
                                    mb: 2,
                                    fontSize: isMobile ? '2.75rem' : '4.5rem',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                                    lineHeight: 1.1,
                                }}
                                data-aos="fade-right"
                            >
                                Need <Box component="span" sx={{ color: 'error.main' }}>Emergency</Box> Help?
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'white',
                                    mb: 4,
                                    fontSize: isMobile ? '1.2rem' : '1.5rem',
                                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                    opacity: 0.9,
                                    maxWidth: '90%',
                                }}
                                data-aos="fade-right"
                                data-aos-delay="200"
                            >
                                Don't panic, we can help! ResQNet connects you with emergency services fast.
                            </Typography>
                            <Button
                                component={Link}
                                to="/report-emergency"
                                variant="contained"
                                size="large"
                                color="error"
                                sx={{
                                    py: 2.5,
                                    px: 5,
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 15px rgba(211, 47, 47, 0.4)',
                                    mb: 3,
                                    textTransform: 'uppercase',
                                    '&:hover': {
                                        backgroundColor: '#c62828',
                                        boxShadow: '0 6px 20px rgba(211, 47, 47, 0.6)',
                                    }
                                }}
                                data-aos="zoom-in"
                                data-aos-delay="400"
                            >
                                Report Emergency Now
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Paper 
                                elevation={8} 
                                sx={{ 
                                    p: 4, 
                                    bgcolor: 'rgba(255,255,255,0.97)', 
                                    borderRadius: 3,
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    textAlign: 'center',
                                    transform: 'translateY(0)',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-10px)',
                                    }
                                }}
                                data-aos="fade-left"
                            >
                                <Typography variant="h6" gutterBottom color="error" sx={{ fontWeight: 'bold' }}>
                                    24/7 ASSISTANCE HOTLINE
                                </Typography>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    my: 2,
                                }}>
                                    <PhoneInTalkIcon sx={{ mr: 2, color: 'error.main', fontSize: 40 }} />
                                    <Button
                                        variant="contained"
                                        color="error"
                                        component="a"
                                        href="tel:112"
                                        onClick={(e) => {
                                            if (window.confirm('Are you sure you want to call 112? Only use for real emergencies.')) {
                                                return true;
                                            }
                                            e.preventDefault();
                                            return false;
                                        }}
                                        sx={{ 
                                            fontSize: { xs: '2rem', sm: '2.5rem' },
                                            fontWeight: 'bold',
                                            py: 1,
                                            px: 2,
                                            boxShadow: '0 4px 12px rgba(211,47,47,0.3)',
                                            '&:hover': {
                                                boxShadow: '0 6px 16px rgba(211,47,47,0.5)',
                                                transform: 'translateY(-2px)'
                                            },
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    >
                                        112
                                    </Button>
                                </Box>
                                <Divider sx={{ my: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        INDIA EMERGENCY
                                    </Typography>
                                </Divider>
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={6}>
                                        <Box sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Police
                                            </Typography>
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                component="a"
                                                href="tel:100"
                                                onClick={(e) => {
                                                    if (window.confirm('Are you sure you want to call 100 (Police)? Only use for real emergencies.')) {
                                                        return true;
                                                    }
                                                    e.preventDefault();
                                                    return false;
                                                }}
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    mt: 0.5,
                                                    '&:hover': {
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                                        transform: 'translateY(-1px)'
                                                    }
                                                }}
                                            >
                                                100
                                            </Button>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Ambulance
                                            </Typography>
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                component="a"
                                                href="tel:108"
                                                onClick={(e) => {
                                                    if (window.confirm('Are you sure you want to call 108 (Ambulance)? Only use for real emergencies.')) {
                                                        return true;
                                                    }
                                                    e.preventDefault();
                                                    return false;
                                                }}
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    mt: 0.5,
                                                    '&:hover': {
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                                        transform: 'translateY(-1px)'
                                                    }
                                                }}
                                            >
                                                108
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    For life-threatening emergencies, call 112 directly. Use ResQNet for all other emergency assistance.
                                </Alert>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Step-by-Step Process - Updated with better styling */}
            <Box sx={{ 
                py: 8, 
                bgcolor: 'transparent',
                backgroundImage: `linear-gradient(to right, rgba(25, 25, 112, 0.8), rgba(183, 28, 28, 0.8)), url(${stepsBackgroundImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                position: 'relative',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
                color: 'white'
            }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold', mb: 5, color: 'white', textShadow: '0 2px 5px rgba(0,0,0,0.3)' }}
                        data-aos="fade-up"
                    >
                        Emergency Response <Box component="span" sx={{ color: '#ff9e80' }}>Steps</Box>
                    </Typography>
                    <Grid container spacing={4}>
                        {emergencySteps.map((step, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                                <Paper
                                    elevation={8}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderTop: '5px solid #ff9e80',
                                        borderRadius: 2,
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        backdropFilter: 'blur(10px)',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                                            bgcolor: 'rgba(255,255,255,0.15)',
                                        },
                                    }}
                                >
                                    <Box 
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            bgcolor: '#ff9e80',
                                            color: '#1a237e',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2,
                                            fontSize: 24,
                                            fontWeight: 'bold',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        }}
                                    >
                                        {step.number}
                                    </Box>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                        {step.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* What We Offer */}
            <Box sx={{ 
                py: 8, 
                bgcolor: 'transparent',
                backgroundImage: `linear-gradient(to bottom right, rgba(0, 77, 64, 0.85), rgba(0, 0, 0, 0.9)), url(${offerBackgroundImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                position: 'relative',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
                color: 'white'
            }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold', mb: 1, color: 'white', textShadow: '0 2px 5px rgba(0,0,0,0.3)' }}
                        data-aos="fade-up"
                    >
                        What We <Box component="span" sx={{ color: '#ff9e80' }}>Offer</Box>
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        color="rgba(255,255,255,0.85)"
                        sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        ResQNet is India's leading emergency response platform, helping thousands of people each year get the assistance they need quickly and efficiently.
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6} data-aos="fade-right">
                            <Box sx={{ mb: 4 }}>
                                {benefitsList.map((benefit, index) => (
                                    <Box 
                                        key={index} 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            mb: 2,
                                            p: 2.5,
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            borderRadius: 2,
                                            backdropFilter: 'blur(8px)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                                            transition: 'all 0.3s ease',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            '&:hover': {
                                                transform: 'translateX(10px)',
                                                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                                                bgcolor: 'rgba(255,255,255,0.15)',
                                            }
                                        }}
                                    >
                                        <CheckCircleIcon sx={{ color: '#ff9e80', mr: 2, fontSize: 28 }} />
                                        <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1.05rem', color: 'white' }}>{benefit}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6} data-aos="fade-left">
                            <Paper elevation={8} sx={{ 
                                p: 4, 
                                borderRadius: 3,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                '&:hover': {
                                    transform: 'translateY(-10px)',
                                    boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
                                }
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <EngineeringIcon sx={{ fontSize: 40, color: '#ff9e80', mr: 2 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                                        You're in Good Hands
                                    </Typography>
                                </Box>
                                
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                        <Box sx={{ 
                                            bgcolor: 'rgba(0,0,0,0.2)', 
                                            p: 2, 
                                            borderRadius: 2,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                        }}>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9e80' }}>
                                                4.9
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Customer Rating
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                        <Box sx={{ 
                                            bgcolor: 'rgba(0,0,0,0.2)', 
                                            p: 2, 
                                            borderRadius: 2,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                        }}>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9e80' }}>
                                                {responseCount}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Rescues and counting
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                        <Box sx={{ 
                                            bgcolor: 'rgba(0,0,0,0.2)', 
                                            p: 2, 
                                            borderRadius: 2,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                        }}>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9e80' }}>
                                                15<Box component="span" sx={{ fontSize: '1rem' }}>min</Box>
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Average response time
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                
                                <Button
                                    component={Link}
                                    to="/features"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    sx={{ 
                                        mt: 'auto', 
                                        py: 1.5, 
                                        borderRadius: 2,
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        bgcolor: '#ff9e80',
                                        color: '#1a237e',
                                        '&:hover': {
                                            bgcolor: '#ffab91',
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                                        }
                                    }}
                                >
                                    Learn More About Our Services
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Emergency Services Section */}
            <Box sx={{ 
                py: 8, 
                bgcolor: 'transparent',
                backgroundImage: `linear-gradient(135deg, rgba(26, 35, 126, 0.85), rgba(183, 28, 28, 0.85)), url(${servicesBackgroundImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                position: 'relative',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
                color: 'white'
            }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold', mb: 1, color: 'white', textShadow: '0 2px 5px rgba(0,0,0,0.3)' }}
                        data-aos="fade-up"
                    >
                        Emergency <Box component="span" sx={{ color: '#ff9e80' }}>Services</Box>
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        color="rgba(255,255,255,0.85)"
                        sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        Connecting you with the right emergency service quickly and efficiently
                    </Typography>

                    <Grid container spacing={4}>
                        {emergencyServices.map((service, index) => (
                            <Grid item xs={12} md={4} key={service.id} data-aos="fade-up" data-aos-delay={index * 100}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        '&:hover': {
                                            transform: 'translateY(-15px) scale(1.02)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                        },
                                        position: 'relative',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 20,
                                            left: 20,
                                            zIndex: 2,
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            bgcolor: '#ff9e80',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#1a237e',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                        }}
                                    >
                                        {service.icon}
                                    </Box>
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={service.image}
                                        alt={service.title}
                                        sx={{
                                            transition: 'transform 0.5s',
                                            filter: 'brightness(0.7)',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                filter: 'brightness(0.9)',
                                            },
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, p: 3, color: 'white' }}>
                                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#ff9e80' }}>
                                            {service.title}
                                        </Typography>
                                        <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                                        <Typography variant="body1" paragraph sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                            {service.description}
                                        </Typography>
                                        <Button
                                            component={Link}
                                            to="/report-emergency"
                                            variant="contained"
                                            sx={{
                                                mt: 1,
                                                bgcolor: '#ff9e80',
                                                color: '#1a237e',
                                                '&:hover': { 
                                                    bgcolor: '#ffab91',
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
                                                },
                                                borderRadius: 2,
                                                py: 1.2,
                                                fontWeight: 'bold',
                                                transition: 'all 0.3s ease',
                                            }}
                                            endIcon={<ArrowForwardIcon />}
                                        >
                                            Request Now
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Call to Action */}
            <Box sx={{ 
                py: 8,
                backgroundImage: 'linear-gradient(135deg, #1a237e 0%, #b71c1c 100%)',
                color: 'white',
            }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={7} data-aos="fade-right">
                            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Emergency? We're Here to Help
                            </Typography>
                            <Typography variant="h6" paragraph sx={{ opacity: 0.9, mb: 4 }}>
                                Our 24/7 emergency service is just a click away. Fast, reliable assistance when you need it most.
                            </Typography>
                            <Button
                                component={Link}
                                to="/report-emergency"
                                variant="contained"
                                size="large"
                                sx={{
                                    py: 2.5,
                                    px: 5,
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    textTransform: 'uppercase',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                        transform: 'translateY(-5px)',
                                    },
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                                }}
                            >
                                Report Emergency
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={5} data-aos="fade-left">
                            <Paper 
                                elevation={6} 
                                sx={{
                                    p: 4, 
                                    borderRadius: 3,
                                    textAlign: 'center',
                                    transform: 'translateY(0)',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-10px)',
                                    },
                                }}
                            >
                                <Typography variant="h6" gutterBottom color="error" sx={{ fontWeight: 'bold' }}>
                                    24/7 ASSISTANCE HOTLINE
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
                                    <PhoneInTalkIcon sx={{ mr: 2, color: 'error.main', fontSize: 40 }} />
                                    <Button
                                        variant="contained"
                                        color="error"
                                        component="a"
                                        href="tel:112"
                                        onClick={(e) => {
                                            if (window.confirm('Are you sure you want to call 112? Only use for real emergencies.')) {
                                                return true;
                                            }
                                            e.preventDefault();
                                            return false;
                                        }}
                                        sx={{ 
                                            fontSize: { xs: '2rem', sm: '2.5rem' },
                                            fontWeight: 'bold',
                                            py: 1,
                                            px: 2,
                                            boxShadow: '0 4px 12px rgba(211,47,47,0.3)',
                                            '&:hover': {
                                                boxShadow: '0 6px 16px rgba(211,47,47,0.5)',
                                                transform: 'translateY(-2px)'
                                            },
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    >
                                        112
                                    </Button>
                                </Box>
                                <Divider sx={{ my: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        INDIA EMERGENCY
                                    </Typography>
                                </Divider>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={4}>
                                        <Box sx={{ p: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Police
                                            </Typography>
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                component="a"
                                                href="tel:100"
                                                onClick={(e) => {
                                                    if (window.confirm('Are you sure you want to call 100 (Police)? Only use for real emergencies.')) {
                                                        return true;
                                                    }
                                                    e.preventDefault();
                                                    return false;
                                                }}
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    mt: 0.5,
                                                    '&:hover': {
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                                        transform: 'translateY(-1px)'
                                                    }
                                                }}
                                            >
                                                100
                                            </Button>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box sx={{ p: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Fire
                                            </Typography>
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                component="a"
                                                href="tel:101"
                                                onClick={(e) => {
                                                    if (window.confirm('Are you sure you want to call 101 (Fire)? Only use for real emergencies.')) {
                                                        return true;
                                                    }
                                                    e.preventDefault();
                                                    return false;
                                                }}
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    mt: 0.5,
                                                    '&:hover': {
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                                        transform: 'translateY(-1px)'
                                                    }
                                                }}
                                            >
                                                101
                                            </Button>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box sx={{ p: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Ambulance
                                            </Typography>
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                component="a"
                                                href="tel:108"
                                                onClick={(e) => {
                                                    if (window.confirm('Are you sure you want to call 108 (Ambulance)? Only use for real emergencies.')) {
                                                        return true;
                                                    }
                                                    e.preventDefault();
                                                    return false;
                                                }}
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    mt: 0.5,
                                                    '&:hover': {
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                                        transform: 'translateY(-1px)'
                                                    }
                                                }}
                                            >
                                                108
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Typography variant="body1" sx={{ mt: 2, mb: 3, fontWeight: 'medium' }}>
                                    Remember: For life-threatening emergencies, always call emergency services directly.
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/features"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ 
                                        borderRadius: 2, 
                                        py: 1.5,
                                        borderColor: 'primary.main',
                                        color: 'primary.main',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            borderColor: 'primary.dark',
                                            bgcolor: 'rgba(0,0,0,0.04)',
                                        }
                                    }}
                                >
                                    Learn More About Our Services
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Home; 