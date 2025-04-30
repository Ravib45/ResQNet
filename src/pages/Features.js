import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Tabs,
    Tab,
    Card,
    CardContent,
    CardMedia,
    Button,
    Divider,
    Collapse,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Snackbar,
    Alert,
    Modal
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link as RouterLink } from 'react-router-dom';
import '../styles/animations.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Service area data
const serviceAreas = [
    {
        id: 'police',
        name: 'Police Force',
        icon: <LocalPoliceIcon sx={{ fontSize: 40 }} />,
        color: '#003087',
        bgColor: '#e6f0ff',
        shortDescription: 'Law enforcement and crime prevention services',
        fullDescription: 'Our Police Force services provide immediate response to emergencies, crime prevention, investigation, and community safety initiatives. Officers are equipped with the latest technology to ensure quick and effective responses to all incidents.',
        features: [
            {
                title: 'Emergency Response',
                description: 'Immediate dispatch of police units to crime scenes and emergencies.',
                image: 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=800',
                details: [
                    'Rapid response to 911 calls',
                    'Trained officers available 24/7',
                    'Specialized units for different emergencies',
                    'Coordination with other emergency services'
                ]
            },
            {
                title: 'Crime Prevention',
                description: 'Community patrols and surveillance to prevent criminal activities.',
                image: 'https://images.pexels.com/photos/3489063/pexels-photo-3489063.jpeg?auto=compress&cs=tinysrgb&w=800',
                details: [
                    'Regular community patrols',
                    'Neighborhood watch programs',
                    'Public safety education',
                    'Crime prevention advice for businesses and homes'
                ]
            },
            {
                title: 'Investigation',
                description: 'Professional investigation of reported crimes with modern forensic techniques.',
                image: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=800',
                details: [
                    'Forensic evidence collection',
                    'Witness interviews and statements',
                    'Digital crime investigation',
                    'Case preparation for prosecution'
                ]
            }
        ],
        contactInfo: {
            emergency: '000',
            nonEmergency: '131 444',
            email: 'police@resqnet.org'
        },
        services: [
            'Emergency Response',
            'Criminal Investigation',
            'Traffic Management',
            'Community Policing',
            'Special Operations',
            'Public Safety Programs'
        ],
        locations: [
            {
                name: 'Central Police Station',
                address: '123 Main Street, Downtown',
                phone: '(03) 9876 5432'
            },
            {
                name: 'North District Police',
                address: '45 North Road, Northside',
                phone: '(03) 9832 1654'
            },
            {
                name: 'West Division Headquarters',
                address: '78 West Avenue, Westfield',
                phone: '(03) 9812 3456'
            }
        ]
    },
    {
        id: 'fire',
        name: 'Fire Station',
        icon: <FireTruckIcon sx={{ fontSize: 40 }} />,
        color: '#d32f2f',
        bgColor: '#ffebee',
        shortDescription: 'Fire fighting and rescue operations',
        fullDescription: 'Our Fire Stations provide 24/7 emergency response to fires, hazardous materials incidents, and rescue situations. Our firefighters are highly trained professionals equipped with advanced equipment to handle all types of fire emergencies.',
        features: [
            {
                title: 'Fire Suppression',
                description: 'Rapid response to fire emergencies with advanced equipment.',
                image: 'https://images.pexels.com/photos/923681/pexels-photo-923681.jpeg?auto=compress&cs=tinysrgb&w=800',
                details: [
                    'High-pressure hose systems',
                    'Aerial ladder operations',
                    'Specialized fire suppression agents',
                    'Building entry and search protocols'
                ]
            },
            {
                title: 'Rescue Operations',
                description: 'Specialized team for rescuing people from fire and hazardous situations.',
                image: 'https://images.pexels.com/photos/260367/pexels-photo-260367.jpeg?auto=compress&cs=tinysrgb&w=800',
                details: [
                    'Vehicle extrication',
                    'Confined space rescue',
                    'High-angle rescue operations',
                    'Water rescue capabilities'
                ]
            },
            {
                title: 'Fire Prevention',
                description: 'Education and inspection programs to prevent fires in communities.',
                image: 'https://images.pexels.com/photos/4201659/pexels-photo-4201659.jpeg?auto=compress&cs=tinysrgb&w=800',
                details: [
                    'Building safety inspections',
                    'Public education programs',
                    'Fire safety planning',
                    'Smoke alarm installation programs'
                ]
            }
        ],
        contactInfo: {
            emergency: '000',
            nonEmergency: '03 9662 2311',
            email: 'fire@resqnet.org'
        },
        services: [
            'Fire Suppression',
            'Technical Rescue',
            'Hazardous Materials Response',
            'Fire Prevention',
            'Public Education',
            'Disaster Response'
        ],
        locations: [
            {
                name: 'Central Fire Station',
                address: '456 Main Street, Downtown',
                phone: '(03) 9876 1234'
            },
            {
                name: 'East Side Fire Station',
                address: '89 East Boulevard, Eastfield',
                phone: '(03) 9854 7654'
            },
            {
                name: 'South County Fire Station',
                address: '12 South Road, Southside',
                phone: '(03) 9823 4567'
            }
        ]
    },
    {
        id: 'hospital',
        name: 'Hospital',
        icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
        color: '#2e7d32',
        bgColor: '#e8f5e9',
        shortDescription: 'Medical emergency and healthcare services',
        fullDescription: 'Our Hospital services provide emergency medical care, ambulance services, and specialized treatment for all medical emergencies. Our medical professionals are available 24/7 to handle any health crisis with state-of-the-art equipment and facilities.',
        features: [
            {
                title: 'Ambulance Service',
                description: 'Emergency medical transport with trained paramedics and life-saving equipment.',
                image: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=800',
                details: [
                    'Advanced life support ambulances',
                    'Trained paramedics and EMTs',
                    'Air ambulance capabilities',
                    'Rapid response to medical emergencies'
                ]
            },
            {
                title: 'Emergency Care',
                description: '24/7 emergency medical treatment for critical conditions and injuries.',
                image: 'https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg?auto=compress&cs=tinysrgb&w=800',
                details: [
                    'Trauma centers',
                    'Critical care specialists',
                    'Immediate treatment for injuries and illnesses',
                    'Emergency surgical capabilities'
                ]
            },
            {
                title: 'Medical Response',
                description: 'Rapid deployment of medical professionals to emergency situations.',
                image: 'https://images.pexels.com/photos/4167544/pexels-photo-4167544.jpeg?auto=compress&cs=tinysrgb&w=800',
                details: [
                    'Disaster medical response teams',
                    'On-site medical treatment',
                    'Triage capabilities for mass casualties',
                    'Coordination with police and fire services'
                ]
            }
        ],
        contactInfo: {
            emergency: '000',
            nonEmergency: '1800 020 103',
            email: 'hospital@resqnet.org'
        },
        services: [
            'Emergency Medicine',
            'Trauma Care',
            'Ambulance Services',
            'Critical Care',
            'Disaster Medical Response',
            'Telehealth Services'
        ],
        locations: [
            {
                name: 'City General Hospital',
                address: '789 Health Avenue, Downtown',
                phone: '(03) 9800 1234'
            },
            {
                name: 'North Community Hospital',
                address: '56 Wellness Road, Northside',
                phone: '(03) 9845 6543'
            },
            {
                name: 'East Medical Center',
                address: '23 Care Street, Eastfield',
                phone: '(03) 9834 5678'
            }
        ]
    }
];

const featuresBg = 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1500';

const Features = () => {
    const [selectedService, setSelectedService] = useState('police');
    const [expandedInfo, setExpandedInfo] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showLocations, setShowLocations] = useState(false);
    const [showAllServices, setShowAllServices] = useState(false);

    const handleServiceChange = (serviceId) => {
        setSelectedService(serviceId);
        setExpandedInfo(true); // Auto-expand info when a service is selected
    };

    const toggleExpandedInfo = () => {
        setExpandedInfo(!expandedInfo);
    };

    const handleLearnMore = (feature) => {
        setSelectedFeature(feature);
        setDialogOpen(true);
    };

    const handleEmergencyClick = () => {
        setSnackbarMessage('This would dial 000 in a real emergency. Always call 000 for genuine emergencies.');
        setShowSnackbar(true);
    };

    const handleViewServices = () => {
        setShowAllServices(true);
    };

    const handleViewLocations = () => {
        setShowLocations(true);
    };

    const currentService = serviceAreas.find(service => service.id === selectedService);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: '80%', md: '60%' },
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        outline: 'none',
        borderRadius: 2,
        maxHeight: '80vh',
        overflow: 'auto'
    };

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <Box sx={{
            pt: 10,
            pb: 6,
            minHeight: '100vh',
            background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url(${featuresBg}) center/cover no-repeat`,
            display: 'flex',
            alignItems: 'center',
        }}>
            <Container maxWidth="lg">
                <Paper elevation={6} sx={{ p: { xs: 2, md: 5 }, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.97)' }} data-aos="fade-up">
                    <Typography variant="h3" component="h1" gutterBottom align="center" className="fade-in" data-aos="fade-down">
                        Our Features
                    </Typography>
                    <Typography variant="h6" align="center" color="textSecondary" paragraph className="fade-in" data-aos="fade-up">
                        Comprehensive emergency response solutions for a safer community
                    </Typography>

                    {/* Service Selector - Bar Style */}
                    <Box
                        sx={{
                            mt: 6,
                            mb: 0,
                            boxShadow: 3,
                            borderRadius: 2,
                            overflow: 'hidden'
                        }}
                        className="scale-in"
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                p: 2,
                                bgcolor: 'grey.800',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <span>Choose Service Area</span>
                            <IconButton
                                size="small"
                                sx={{ color: 'white' }}
                                onClick={toggleExpandedInfo}
                            >
                                {expandedInfo ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </Typography>

                        <Grid container sx={{ height: '100%' }}>
                            {serviceAreas.map((service) => (
                                <Grid item xs={4} key={service.id} sx={{ height: '100%' }}>
                                    <Box
                                        onClick={() => handleServiceChange(service.id)}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            p: 3,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            bgcolor: selectedService === service.id ? service.bgColor : 'white',
                                            borderBottom: selectedService === service.id ? `4px solid ${service.color}` : '4px solid transparent',
                                            '&:hover': {
                                                bgcolor: service.bgColor,
                                                transform: 'translateY(-5px)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ color: service.color, mb: 1 }}>
                                            {service.icon}
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            align="center"
                                            sx={{
                                                color: service.color,
                                                fontWeight: selectedService === service.id ? 'bold' : 'normal'
                                            }}
                                        >
                                            {service.name}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Expanded Information Section */}
                        <Collapse in={expandedInfo}>
                            <Box
                                sx={{
                                    p: 3,
                                    bgcolor: currentService.bgColor,
                                    borderTop: `1px solid ${currentService.color}30`
                                }}
                            >
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={8}>
                                        <Typography variant="h5" gutterBottom sx={{ color: currentService.color, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box>{currentService.icon}</Box>
                                            {currentService.name}
                                        </Typography>
                                        <Typography paragraph>
                                            {currentService.fullDescription}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    color: currentService.color,
                                                    borderColor: currentService.color,
                                                    '&:hover': {
                                                        borderColor: currentService.color,
                                                        bgcolor: `${currentService.color}10`
                                                    }
                                                }}
                                                onClick={handleViewServices}
                                            >
                                                View All {currentService.name} Services
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    color: currentService.color,
                                                    borderColor: currentService.color,
                                                    '&:hover': {
                                                        borderColor: currentService.color,
                                                        bgcolor: `${currentService.color}10`
                                                    }
                                                }}
                                                onClick={handleViewLocations}
                                                startIcon={<LocationOnIcon />}
                                            >
                                                Find Locations
                                            </Button>
                                            <Button
                                                component={RouterLink}
                                                to="/report"
                                                variant="contained"
                                                sx={{
                                                    bgcolor: currentService.color,
                                                    '&:hover': {
                                                        bgcolor: `${currentService.color}dd`
                                                    }
                                                }}
                                            >
                                                Report Emergency
                                            </Button>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={2} sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Contact Information
                                            </Typography>
                                            <Box sx={{ mb: 1 }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Emergency:
                                                </Typography>
                                                <Button
                                                    variant="text"
                                                    color="error"
                                                    sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                                                    startIcon={<PhoneIcon />}
                                                    onClick={handleEmergencyClick}
                                                >
                                                    {currentService.contactInfo.emergency}
                                                </Button>
                                            </Box>
                                            <Box sx={{ mb: 1 }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Non-Emergency:
                                                </Typography>
                                                <Button
                                                    variant="text"
                                                    sx={{ color: 'text.primary' }}
                                                    startIcon={<PhoneIcon />}
                                                >
                                                    {currentService.contactInfo.nonEmergency}
                                                </Button>
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Email:
                                                </Typography>
                                                <Typography variant="body1">
                                                    <Button
                                                        variant="text"
                                                        sx={{ color: 'text.primary' }}
                                                        startIcon={<InfoIcon />}
                                                    >
                                                        {currentService.contactInfo.email}
                                                    </Button>
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Collapse>
                    </Box>

                    {/* Service Features */}
                    <Box sx={{ mt: 5, mb: 4 }}>
                        <Typography
                            variant="h4"
                            component="h2"
                            gutterBottom
                            sx={{
                                mb: 3,
                                color: currentService.color,
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1
                            }}
                            className="fade-in"
                        >
                            <Box sx={{ mr: 1 }}>{currentService.icon}</Box>
                            {currentService.name} Features
                        </Typography>

                        <Divider sx={{ mb: 5 }} />

                        <Grid container spacing={4} className="stagger-animation">
                            {currentService.features.map((feature, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Card
                                        className="hover-lift"
                                        sx={{
                                            height: '100%',
                                            border: `1px solid ${currentService.color}16`,
                                            '&:hover': {
                                                borderColor: currentService.color
                                            }
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={feature.image}
                                            alt={feature.title}
                                        />
                                        <CardContent>
                                            <Typography variant="h5" component="h3" gutterBottom>
                                                {feature.title}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                {feature.description}
                                            </Typography>
                                            <Button
                                                variant="text"
                                                color="primary"
                                                onClick={() => handleLearnMore(feature)}
                                                sx={{ mt: 2 }}
                                            >
                                                Learn More
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                            <Button
                                component={RouterLink}
                                to="/report"
                                variant="contained"
                                size="large"
                                sx={{
                                    px: 4,
                                    bgcolor: currentService.color,
                                    '&:hover': {
                                        bgcolor: currentService.color + 'dd'
                                    }
                                }}
                            >
                                Report an Emergency
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>

            {/* Feature Details Dialog */}
            {selectedFeature && (
                <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ bgcolor: currentService.bgColor, color: currentService.color }}>
                        {selectedFeature.title}
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <img
                                    src={selectedFeature.image}
                                    alt={selectedFeature.title}
                                    style={{ width: '100%', borderRadius: '8px' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" paragraph>
                                    {selectedFeature.description}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Key Services:
                                </Typography>
                                <List>
                                    {selectedFeature.details.map((detail, idx) => (
                                        <ListItem key={idx}>
                                            <ListItemIcon sx={{ color: currentService.color }}>
                                                <CheckCircleIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={detail} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>Close</Button>
                        <Button
                            component={RouterLink}
                            to="/report"
                            variant="contained"
                            sx={{ bgcolor: currentService.color }}
                        >
                            Request Service
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Snackbar for emergency number */}
            <Snackbar
                open={showSnackbar}
                autoHideDuration={6000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setShowSnackbar(false)}
                    severity="warning"
                    variant="filled"
                    icon={<WarningIcon />}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Services Modal */}
            <Modal
                open={showAllServices}
                onClose={() => setShowAllServices(false)}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ color: currentService.color, display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 1 }}>{currentService.icon}</Box>
                        All {currentService.name} Services
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                        {currentService.services.map((service, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        '&:hover': {
                                            boxShadow: 3,
                                            bgcolor: currentService.bgColor
                                        }
                                    }}
                                >
                                    <CheckCircleIcon sx={{ mr: 2, color: currentService.color }} />
                                    <Typography>{service}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setShowAllServices(false)}>Close</Button>
                        <Button
                            component={RouterLink}
                            to="/report"
                            variant="contained"
                            sx={{
                                ml: 2,
                                bgcolor: currentService.color,
                                '&:hover': {
                                    bgcolor: currentService.color + 'dd'
                                }
                            }}
                        >
                            Report Emergency
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Locations Modal */}
            <Modal
                open={showLocations}
                onClose={() => setShowLocations(false)}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ color: currentService.color, display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ mr: 1 }} />
                        {currentService.name} Locations
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                        {currentService.locations.map((location, index) => (
                            <Grid item xs={12} key={index}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        '&:hover': {
                                            boxShadow: 3,
                                            bgcolor: currentService.bgColor
                                        }
                                    }}
                                >
                                    <Typography variant="h6">{location.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {location.address}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <PhoneIcon sx={{ fontSize: 18, mr: 1, color: currentService.color }} />
                                        <Typography variant="body2">{location.phone}</Typography>
                                    </Box>
                                    <Button
                                        size="small"
                                        sx={{ mt: 1, color: currentService.color }}
                                    >
                                        Get Directions
                                    </Button>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setShowLocations(false)}>Close</Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default Features; 