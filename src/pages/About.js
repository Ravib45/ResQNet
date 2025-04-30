import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Box, Divider, List, ListItem, ListItemIcon, ListItemText,
    Link, Paper, Grid, Card, CardContent, CardMedia, Button, Tabs, Tab, IconButton,
    useTheme, useMediaQuery
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BusinessIcon from '@mui/icons-material/Business';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link as RouterLink } from 'react-router-dom';

const aboutBg = 'https://images.pexels.com/photos/315938/pexels-photo-315938.jpeg?auto=compress&cs=tinysrgb&w=1500';

const serviceData = [
    {
        title: "Police Force",
        subtitle: "Law Enforcement Services",
        description: "The ResQNet Police Force provides law enforcement, crime prevention, and community safety services across the territory.",
        icon: <LocalPoliceIcon sx={{ fontSize: 48, color: "#003087" }} />,
        color: "#003087",
        stats: "2,200+ personnel",
        image: "https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=800",
        link: "/features"
    },
    {
        title: "Fire & Rescue",
        subtitle: "Fire Safety & Emergency Response",
        description: "Our Fire and Rescue Service provides fire suppression, prevention, and specialized rescue services to protect lives and property.",
        icon: <FireTruckIcon sx={{ fontSize: 48, color: "#d32f2f" }} />,
        color: "#d32f2f",
        stats: "600+ trained responders",
        image: "https://images.pexels.com/photos/8544623/pexels-photo-8544623.jpeg?auto=compress&cs=tinysrgb&w=800",
        link: "/features"
    },
    {
        title: "Emergency Service",
        subtitle: "Medical & Emergency Aid",
        description: "The Emergency Service provides critical medical care and disaster response during emergencies, storms, floods, and other crises.",
        icon: <LocalHospitalIcon sx={{ fontSize: 48, color: "#2e7d32" }} />,
        color: "#2e7d32",
        stats: "24/7 rapid response",
        image: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800",
        link: "/features"
    },
    {
        title: "Corporate Services",
        subtitle: "Administration & Support",
        description: "Our corporate services team provides the administrative backbone that enables all emergency response operations to function effectively.",
        icon: <BusinessIcon sx={{ fontSize: 48, color: "#616161" }} />,
        color: "#616161",
        stats: "Supporting all departments",
        image: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800",
        link: "/about"
    }
];

const volunteerInfo = {
    title: "Volunteer With Us",
    description: "Join our network of over 600 volunteers trained to provide fire, rescue, and emergency services across all regions. Make a difference in your community today.",
    image: "https://images.pexels.com/photos/6591154/pexels-photo-6591154.jpeg?auto=compress&cs=tinysrgb&w=800",
    points: [
        "Comprehensive training provided",
        "Flexible commitment options",
        "Serve your local community",
        "Develop valuable skills",
        "Join a dedicated team"
    ]
};

const priorities = [
    {
        title: "Our Mission",
        content: "To serve and protect communities through coordinated emergency response."
    },
    {
        title: "Our Vision",
        content: "A safer territory through innovation, cooperation, and community engagement."
    },
    {
        title: "Our Values",
        content: "Integrity, Excellence, Accountability, Respect, and Community."
    }
];

const About = () => {
    const [activeTab, setActiveTab] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ overflow: 'hidden' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    pt: 10,
                    pb: 6,
                    minHeight: '50vh',
                    background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url(${aboutBg}) center/cover no-repeat`,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', color: 'white' }}>
                        <Typography
                            variant="h2"
                            component="h1"
                            gutterBottom
                            sx={{ fontWeight: 'bold', fontSize: { xs: '2.5rem', md: '3.5rem' } }}
                            data-aos="fade-down"
                        >
                            About ResQNet
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{ maxWidth: '800px', mx: 'auto', mb: 4, fontSize: { xs: '1.2rem', md: '1.5rem' } }}
                            data-aos="fade-up"
                        >
                            Serving and protecting our communities through coordinated emergency response
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Paper elevation={0} sx={{ p: { xs: 2, md: 5 }, borderRadius: 2, bgcolor: 'background.paper' }} data-aos="fade-up">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6} data-aos="fade-right">
                            <Typography variant="h4" component="h2" gutterBottom color="primary.dark" sx={{ fontWeight: 'bold' }}>
                                Our People, Our Community
                            </Typography>
                            <Typography variant="body1" paragraph>
                                ResQNet is a large and diverse organization serving communities across the territory, covering everything from densely populated urban areas to remote communities and large regions of bushland. The population we serve is equally diverse, with many different nationalities and cultures living and working throughout the area.
                            </Typography>
                            <Typography variant="body1" paragraph>
                                We employ more than 2,200 people across each public safety stream, specifically the Police Force, Fire and Rescue Service, Emergency Service, and Corporate Services.
                            </Typography>
                            <Typography variant="body1" paragraph>
                                There are also over 600 volunteers trained to provide a fire, rescue and/or emergency service capability across all regions.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} data-aos="fade-left">
                            <Box
                                component="img"
                                src="https://images.pexels.com/photos/8942729/pexels-photo-8942729.jpeg?auto=compress&cs=tinysrgb&w=800"
                                alt="Diverse emergency service team"
                                sx={{
                                    width: '100%',
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    height: 'auto'
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 6 }} data-aos="fade-up" />

                    {/* Strategic Priorities Section */}
                    <Box sx={{ mb: 6 }} data-aos="fade-up">
                        <Typography variant="h4" component="h2" gutterBottom align="center" color="primary.dark" sx={{ fontWeight: 'bold', mb: 4 }}>
                            Our Strategic Priorities
                        </Typography>

                        <Grid container spacing={3}>
                            {priorities.map((priority, index) => (
                                <Grid item xs={12} md={4} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                                    <Card sx={{ height: '100%', borderTop: `4px solid ${theme.palette.primary.main}` }}>
                                        <CardContent>
                                            <Typography variant="h5" component="h3" gutterBottom color="primary.dark">
                                                {priority.title}
                                            </Typography>
                                            <Typography variant="body1">
                                                {priority.content}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 6 }} data-aos="fade-up" />

                    {/* Services Cards Section */}
                    <Box sx={{ mb: 6 }} data-aos="fade-up">
                        <Typography variant="h4" component="h2" gutterBottom align="center" color="primary.dark" sx={{ fontWeight: 'bold', mb: 4 }}>
                            Our Services
                        </Typography>

                        <Grid container spacing={3}>
                            {serviceData.map((service, index) => (
                                <Grid item xs={12} md={6} lg={3} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.3s',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: 6
                                            }
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="160"
                                            image={service.image}
                                            alt={service.title}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Box sx={{ mr: 2 }}>{service.icon}</Box>
                                                <Typography variant="h6" component="h3" sx={{ color: service.color, fontWeight: 'bold' }}>
                                                    {service.title}
                                                </Typography>
                                            </Box>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                {service.subtitle}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 2 }}>
                                                {service.description}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Typography variant="caption" fontWeight="bold" color="text.secondary">
                                                    {service.stats}
                                                </Typography>
                                                <Button
                                                    component={RouterLink}
                                                    to={service.link}
                                                    variant="text"
                                                    endIcon={<KeyboardArrowRightIcon />}
                                                    sx={{ color: service.color }}
                                                >
                                                    Learn More
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 6 }} data-aos="fade-up" />

                    {/* Volunteer Section */}
                    <Box sx={{ mb: 6 }} data-aos="fade-up">
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={5} data-aos="fade-right">
                                <Box
                                    component="img"
                                    src={volunteerInfo.image}
                                    alt="Volunteer opportunities"
                                    sx={{
                                        width: '100%',
                                        borderRadius: 2,
                                        boxShadow: 3
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={7} data-aos="fade-left">
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <VolunteerActivismIcon sx={{ fontSize: 40, mr: 2, color: theme.palette.primary.main }} />
                                    <Typography variant="h4" component="h2" color="primary.dark" sx={{ fontWeight: 'bold' }}>
                                        {volunteerInfo.title}
                                    </Typography>
                                </Box>
                                <Typography variant="body1" paragraph>
                                    {volunteerInfo.description}
                                </Typography>
                                <List>
                                    {volunteerInfo.points.map((point, index) => (
                                        <ListItem key={index} sx={{ py: 0.5 }}>
                                            <ListItemIcon>
                                                <CheckCircleIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary={point} />
                                        </ListItem>
                                    ))}
                                </List>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    component={RouterLink}
                                    to="/register"
                                    sx={{ mt: 2 }}
                                >
                                    Join Our Team
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 6 }} data-aos="fade-up" />

                    {/* UERS Info */}
                    <Box sx={{ mb: 3 }} data-aos="fade-up">
                        <Typography variant="h4" component="h2" gutterBottom align="center" color="primary.dark" sx={{ fontWeight: 'bold', mb: 4 }}>
                            Unified Emergency Response System (UERS)
                        </Typography>

                        <Typography variant="body1" paragraph>
                            The Unified Emergency Response System (UERS) is a next-generation platform designed to revolutionize how emergency services—Police, Fire, and Ambulance—coordinate and respond to crises. Our mission is to break down communication barriers, maximize interoperability, and ensure that every emergency receives the fastest, most effective response possible.
                        </Typography>

                        <Box sx={{ my: 3 }}>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                variant={isMobile ? "scrollable" : "fullWidth"}
                                scrollButtons="auto"
                                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                            >
                                <Tab label="Why Unified Response?" />
                                <Tab label="How It Works" />
                                <Tab label="Our Commitment" />
                            </Tabs>

                            <Box role="tabpanel" hidden={activeTab !== 0} sx={{ p: 2 }}>
                                <Typography variant="body1" paragraph>
                                    In traditional emergency management, each service often operates on its own communication system, leading to delays and confusion during multi-agency incidents. UERS leverages modern technology to unify these services, providing a single platform for real-time communication, resource sharing, and situational awareness.
                                </Typography>
                                <List>
                                    <ListItem><ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon><ListItemText primary="Seamless, real-time communication between police, fire, and ambulance services" /></ListItem>
                                    <ListItem><ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon><ListItemText primary="Centralized command and control for coordinated incident management" /></ListItem>
                                    <ListItem><ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon><ListItemText primary="Integrated Communication Control System (ICCS) for cross-agency interoperability" /></ListItem>
                                </List>
                            </Box>

                            <Box role="tabpanel" hidden={activeTab !== 1} sx={{ p: 2 }}>
                                <Typography variant="body1" paragraph>
                                    UERS integrates multiple communication channels and data sources, providing a holistic view of any incident. Commanders and responders can monitor the location and status of teams, allocate resources efficiently, and adapt strategies in real time. Our system is cloud-based, scalable, and designed for maximum security and reliability.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    By connecting all emergency services on a single platform, UERS ensures that the right resources are dispatched to the right place at the right time—regardless of jurisdictional boundaries. This not only saves lives but also protects responders and the community.
                                </Typography>
                            </Box>

                            <Box role="tabpanel" hidden={activeTab !== 2} sx={{ p: 2 }}>
                                <Typography variant="body1" paragraph>
                                    We are committed to:
                                </Typography>
                                <List>
                                    <ListItem><ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon><ListItemText primary="Upholding the dignity and safety of every individual in crisis" /></ListItem>
                                    <ListItem><ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon><ListItemText primary="Fostering a culture of mutual respect and collaboration across agencies" /></ListItem>
                                    <ListItem><ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon><ListItemText primary="Continuous improvement through training, review, and technology adoption" /></ListItem>
                                </List>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 6 }} data-aos="fade-up">
                        <Button
                            component={RouterLink}
                            to="/features"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ px: 4, py: 1.5 }}
                        >
                            Explore Our Features
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default About; 