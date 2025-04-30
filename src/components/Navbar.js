import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Container,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    useMediaQuery,
    useScrollTrigger,
    Slide,
    Fade,
    Badge,
    Tooltip
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import WatchIcon from '@mui/icons-material/Watch';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// Components
import AIEmergencyAssessment from './AIEmergencyAssessment';

// Hide navbar on scroll down
function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();
    
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

const Navbar = () => {
    const { isAuthenticated, currentUser, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:900px)');
    const open = Boolean(anchorEl);
    
    // Add state for wearable device menu
    const [wearableAnchorEl, setWearableAnchorEl] = useState(null);
    const wearableMenuOpen = Boolean(wearableAnchorEl);
    
    // Add state for AI Chatbot
    const [chatbotOpen, setChatbotOpen] = useState(false);
    
    // Mock data for connected wearable devices
    const [connectedDevices, setConnectedDevices] = useState([
        { id: 1, name: 'Apple Watch', connected: true, batteryLevel: 78 },
        { id: 2, name: 'Fitbit Sense', connected: false, batteryLevel: 45 }
    ]);

    // Mock health data from wearable devices
    const [healthData, setHealthData] = useState({
        heartRate: 72,
        steps: 6453,
        lastUpdated: new Date().toLocaleTimeString()
    });

    // Active route tracking
    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = async () => {
        try {
            handleClose();
            setMobileOpen(false);
            await signOut(auth);
            // Force navigation to GetStarted page and clear navigation history
            window.location.href = '/';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleWearableMenuOpen = (event) => {
        setWearableAnchorEl(event.currentTarget);
    };

    const handleWearableMenuClose = () => {
        setWearableAnchorEl(null);
    };

    const handleAddWearableDevice = () => {
        // This would open a modal to add a new device
        handleWearableMenuClose();
        // For now just display an alert
        alert('This feature would open a setup wizard to connect a new wearable device');
    };

    const toggleDeviceConnection = (deviceId) => {
        setConnectedDevices(devices => 
            devices.map(device => 
                device.id === deviceId ? {...device, connected: !device.connected} : device
            )
        );
    };

    // Function to simulate health data update
    const updateHealthData = () => {
        // Simulate heart rate varying by +/- 5 bpm
        const newHeartRate = healthData.heartRate + Math.floor(Math.random() * 11) - 5;
        // Simulate steps increasing by 50-150
        const newSteps = healthData.steps + Math.floor(Math.random() * 101) + 50;
        
        setHealthData({
            heartRate: newHeartRate,
            steps: newSteps,
            lastUpdated: new Date().toLocaleTimeString()
        });
    };

    // Update health data every 30 seconds
    useEffect(() => {
        const interval = setInterval(updateHealthData, 30000);
        return () => clearInterval(interval);
    }, [healthData]);

    // Handle opening chatbot
    const handleOpenChatbot = () => {
        setChatbotOpen(true);
    };

    // Handle closing chatbot
    const handleCloseChatbot = () => {
        setChatbotOpen(false);
    };

    // For admin users - menu items
    const adminMenuItems = [
        { label: 'Home', path: '/admin/home', icon: <HomeIcon /> },
        { label: 'Reports', path: '/admin', icon: <AssessmentIcon /> },
        { label: 'Completed', path: '/admin/completed', icon: <DoneAllIcon /> },
        { label: 'Users', path: '/admin/users', icon: <PeopleIcon /> },
        { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    ];

    // Base menu items for regular users
    const regularUserMenuItems = [
        { label: 'Home', path: '/home', icon: <HomeIcon /> },
        { label: 'About', path: '/about', icon: <InfoIcon /> },
        { label: 'Features', path: '/features', icon: <FeaturedPlayListIcon /> },
    ];

    // Use the appropriate menu items based on user role
    const menuItems = isAdmin ? adminMenuItems : regularUserMenuItems;

    const filteredMenuItems = menuItems.filter((item) => {
        if (isAuthenticated) return true;
        return false;
    });

    // Mobile drawer content
    const drawer = (
        <Box sx={{ width: 250 }} role="presentation">
            <Box sx={{ 
                p: 2, 
                bgcolor: 'primary.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                py: 3
            }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    ResQNet
                </Typography>
                {isAuthenticated && (
                    <Avatar 
                        sx={{ 
                            bgcolor: 'error.main', 
                            width: 40, 
                            height: 40,
                            mt: 1
                        }}
                    >
                        {currentUser?.email?.[0]?.toUpperCase()}
                    </Avatar>
                )}
            </Box>
            <Divider />
            <List>
                {filteredMenuItems.map((item) => (
                    <ListItem 
                        button 
                        key={item.label} 
                        component={Link} 
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        sx={{
                            bgcolor: isActive(item.path) ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                            borderLeft: isActive(item.path) ? '4px solid' : '4px solid transparent',
                            borderLeftColor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.08)',
                            }
                        }}
                    >
                        <Box sx={{ mr: 2, color: isActive(item.path) ? 'primary.main' : 'text.secondary' }}>
                            {item.icon}
                        </Box>
                        <ListItemText 
                            primary={item.label} 
                            primaryTypographyProps={{ 
                                fontWeight: isActive(item.path) ? 'bold' : 'normal',
                                color: isActive(item.path) ? 'primary.main' : 'inherit'
                            }}
                        />
                    </ListItem>
                ))}

                {/* Add AI Assessment button in mobile menu */}
                {!isAdmin && (
                    <ListItem 
                        button
                        onClick={handleOpenChatbot}
                        sx={{
                            bgcolor: 'rgba(25, 118, 210, 0.08)',
                            borderLeft: '4px solid',
                            borderLeftColor: 'primary.main',
                            mt: 1,
                            '&:hover': {
                                bgcolor: 'rgba(25, 118, 210, 0.12)',
                            }
                        }}
                    >
                        <Box sx={{ mr: 2, color: 'primary.main' }}>
                            <SmartToyIcon />
                        </Box>
                        <ListItemText 
                            primary="AI Emergency Assistant" 
                            primaryTypographyProps={{ 
                                fontWeight: 'medium',
                                color: 'primary.main'
                            }}
                            secondary="Get emergency assessment"
                        />
                    </ListItem>
                )}

                {/* Add Wearable Device item in mobile menu */}
                {isAuthenticated && !isAdmin && (
                    <>
                        <ListItem 
                            button 
                            component={Link} 
                            to="#" 
                            sx={{ 
                                borderLeft: '4px solid transparent',
                                mt: 1
                            }}
                        >
                            <Box sx={{ mr: 2, color: 'text.secondary' }}>
                                <WatchIcon />
                            </Box>
                            <ListItemText 
                                primary="Wearable Devices" 
                                secondary={`${connectedDevices.filter(d => d.connected).length} connected`}
                            />
                        </ListItem>
                        
                        {/* Health Data in Mobile */}
                        {connectedDevices.some(d => d.connected) && (
                            <Box sx={{ mx: 2, my: 1, p: 1.5, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Health Data
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <HeartBrokenIcon sx={{ color: 'error.main', mr: 0.5, fontSize: 18 }} />
                                        <Typography variant="body2">{healthData.heartRate} BPM</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <DirectionsRunIcon sx={{ color: 'success.main', mr: 0.5, fontSize: 18 }} />
                                        <Typography variant="body2">{healthData.steps.toLocaleString()} steps</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </>
                )}

                {/* Emergency button for mobile */}
                {!isAdmin && (
                <ListItem 
                    button 
                    component={Link}
                    to="/report-emergency"
                    onClick={() => setMobileOpen(false)}
                    sx={{ 
                        bgcolor: 'error.main', 
                        color: 'white',
                        my: 2,
                        mx: 2,
                        borderRadius: 1,
                        '&:hover': {
                            bgcolor: 'error.dark',
                        }
                    }}
                >
                    <Box sx={{ mr: 2 }}>
                        <WarningIcon />
                    </Box>
                    <ListItemText primary="Report Emergency" />
                </ListItem>
                )}
            </List>
            <Divider />
            <List>
                {isAuthenticated ? (
                    <ListItem button onClick={handleLogout}>
                        <Box sx={{ mr: 2, color: 'text.secondary' }}>
                            <LogoutIcon />
                        </Box>
                        <ListItemText primary="Logout" />
                    </ListItem>
                ) : (
                    <>
                        <ListItem 
                            button 
                            component={Link} 
                            to="/login"
                            onClick={() => setMobileOpen(false)}
                        >
                            <Box sx={{ mr: 2, color: 'text.secondary' }}>
                                <PersonIcon />
                            </Box>
                            <ListItemText primary="Login" />
                        </ListItem>
                        <ListItem 
                            button 
                            component={Link} 
                            to="/register"
                            onClick={() => setMobileOpen(false)}
                        >
                            <Box sx={{ mr: 2, color: 'text.secondary' }}>
                                <PersonIcon />
                            </Box>
                            <ListItemText primary="Register" />
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <HideOnScroll>
                <AppBar 
                    position="fixed" 
                    elevation={2}
                    sx={{ 
                        bgcolor: 'white', 
                        color: 'text.primary',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                    }}
                >
                    <Container maxWidth="lg">
                        <Toolbar sx={{ py: 0.5 }}>
                            {/* Mobile menu button */}
                            {isMobile && (
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ mr: 2 }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}

                            {/* Logo */}
                            <Typography
                                variant="h5"
                                component={Link}
                                to={isAuthenticated ? (isAdmin ? "/admin" : "/home") : "/"}
                                sx={{
                                    flexGrow: { xs: 1, md: 0 },
                                    textDecoration: 'none',
                                    color: 'primary.main',
                                    fontWeight: '700',
                                    letterSpacing: '0.5px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Box 
                                    component="span" 
                                    sx={{ 
                                        color: 'error.main',
                                        fontWeight: 800, 
                                        mr: 0.5 
                                    }}
                                >
                                    ResQ
                                </Box>
                                Net
                            </Typography>

                            {/* Emergency Phone */}
                            <Box
                                sx={{
                                    display: { xs: 'none', sm: 'flex' },
                                    alignItems: 'center',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 1,
                                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                                }}
                            >
                                <PhoneIcon sx={{ color: 'error.main', mr: 1 }} />
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    Emergency: 
                                </Typography>
                                <Button
                                    component="a"
                                    href="tel:112"
                                    onClick={(e) => {
                                        if (window.confirm('Are you sure you want to call 112? Only use for real emergencies.')) {
                                            return true;
                                        }
                                        e.preventDefault();
                                        return false;
                                    }}
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    sx={{
                                        minWidth: 'unset',
                                        py: 0.25,
                                        px: 1,
                                        ml: 0.5,
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 5px rgba(211,47,47,0.25)',
                                        '&:hover': {
                                            boxShadow: '0 4px 10px rgba(211,47,47,0.4)',
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                >
                                    112
                                </Button>
                            </Box>

                            {/* Desktop Navigation */}
                            {!isMobile && (
                                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, flexGrow: 1 }}>
                                    {filteredMenuItems.map((item) => (
                                        <Button
                                            key={item.label}
                                            component={Link}
                                            to={item.path}
                                            color="inherit"
                                            sx={{
                                                mx: 0.5,
                                                px: 2,
                                                py: 1,
                                                borderRadius: 1,
                                                position: 'relative',
                                                color: isActive(item.path) ? 'primary.main' : 'text.primary',
                                                fontWeight: isActive(item.path) ? 'bold' : 'normal',
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    bottom: '6px',
                                                    left: '10px',
                                                    right: '10px',
                                                    height: '3px',
                                                    borderRadius: '1.5px',
                                                    bgcolor: isActive(item.path) ? 'primary.main' : 'transparent',
                                                },
                                                '&:hover': {
                                                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                                                    '&::after': {
                                                        bgcolor: 'primary.main',
                                                        opacity: 0.5
                                                    }
                                                }
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                    
                                    {/* AI Assessment Button - show for all users except admins */}
                                    {!isAdmin && (
                                        <Tooltip title="AI Emergency Assessment">
                                            <Button
                                                color="primary"
                                                onClick={handleOpenChatbot}
                                                startIcon={<SmartToyIcon />}
                                                sx={{
                                                    mx: 0.5,
                                                    px: 2,
                                                    py: 1,
                                                    borderRadius: 1,
                                                    position: 'relative',
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        bottom: '6px',
                                                        left: '10px',
                                                        right: '10px',
                                                        height: '3px',
                                                        borderRadius: '1.5px',
                                                        bgcolor: 'transparent',
                                                    },
                                                    '&:hover': {
                                                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                                                        '&::after': {
                                                            bgcolor: 'primary.main',
                                                            opacity: 0.5
                                                        }
                                                    }
                                                }}
                                            >
                                                AI Assistant
                                            </Button>
                                        </Tooltip>
                                    )}
                                    
                                    {/* Add Wearable Devices Button - only show if authenticated */}
                                    {isAuthenticated && !isAdmin && (
                                        <Box sx={{ mx: 0.5 }}>
                                            <Button
                                                color="inherit"
                                                aria-controls={wearableMenuOpen ? 'wearable-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={wearableMenuOpen ? 'true' : undefined}
                                                onClick={handleWearableMenuOpen}
                                                startIcon={<WatchIcon />}
                                                endIcon={<MoreVertIcon fontSize="small" />}
                                                sx={{
                                                    borderRadius: 1,
                                                    position: 'relative',
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        bottom: '6px',
                                                        left: '10px',
                                                        right: '10px',
                                                        height: '3px',
                                                        borderRadius: '1.5px',
                                                        bgcolor: 'transparent',
                                                    },
                                                    '&:hover': {
                                                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                                                        '&::after': {
                                                            bgcolor: 'primary.main',
                                                            opacity: 0.5
                                                        }
                                                    }
                                                }}
                                            >
                                                Wearables
                                            </Button>
                                            <Menu
                                                id="wearable-menu"
                                                anchorEl={wearableAnchorEl}
                                                open={wearableMenuOpen}
                                                onClose={handleWearableMenuClose}
                                                MenuListProps={{
                                                    'aria-labelledby': 'wearable-button',
                                                }}
                                                PaperProps={{
                                                    elevation: 3,
                                                    sx: {
                                                        overflow: 'visible',
                                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.2))',
                                                        mt: 1.5,
                                                        borderRadius: 2,
                                                        minWidth: 280,
                                                    },
                                                }}
                                                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                                                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                                            >
                                                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        Connected Devices
                                                    </Typography>
                                                </Box>
                                                
                                                {/* Device List */}
                                                {connectedDevices.map((device) => (
                                                    <MenuItem key={device.id} sx={{ px: 2, py: 1.5 }}>
                                                        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <WatchIcon sx={{ mr: 1, color: device.connected ? 'success.main' : 'text.disabled' }} />
                                                                <Box>
                                                                    <Typography variant="body1">{device.name}</Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Battery: {device.batteryLevel}%
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                            <Button 
                                                                size="small"
                                                                variant={device.connected ? "outlined" : "contained"}
                                                                color={device.connected ? "success" : "primary"}
                                                                onClick={() => toggleDeviceConnection(device.id)}
                                                                sx={{ minWidth: 90 }}
                                                            >
                                                                {device.connected ? 'Connected' : 'Connect'}
                                                            </Button>
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                                
                                                {/* Add New Device */}
                                                <MenuItem onClick={handleAddWearableDevice} sx={{ px: 2, py: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                                                        <AddIcon sx={{ mr: 1 }} />
                                                        <Typography>Add New Device</Typography>
                                                    </Box>
                                                </MenuItem>
                                                
                                                <Divider />
                                                
                                                {/* Health Data */}
                                                <Box sx={{ px: 2, py: 1.5 }}>
                                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                        Health Data
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <HeartBrokenIcon sx={{ color: 'error.main', mr: 1 }} />
                                                            <Typography variant="body2">Heart Rate: <Box component="span" fontWeight="bold">{healthData.heartRate} BPM</Box></Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <DirectionsRunIcon sx={{ color: 'success.main', mr: 1 }} />
                                                            <Typography variant="body2">Steps Today: <Box component="span" fontWeight="bold">{healthData.steps.toLocaleString()}</Box></Typography>
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                        Last Updated: {healthData.lastUpdated}
                                                    </Typography>
                                                </Box>
                                                
                                                <Divider />
                                                
                                                {/* SOS Button */}
                                                <Box sx={{ p: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        fullWidth
                                                        size="large"
                                                        component={Link}
                                                        to="/report-emergency"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            borderRadius: 2,
                                                            py: 1,
                                                            boxShadow: '0 4px 8px rgba(211, 47, 47, 0.3)',
                                                        }}
                                                    >
                                                        SOS Emergency
                                                    </Button>
                                                </Box>
                                            </Menu>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Report Emergency Button */}
                            {!isAdmin && (
                            <Button
                                component={Link}
                                to="/report-emergency"
                                variant="contained"
                                color="error"
                                startIcon={<WarningIcon />}
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    borderRadius: 2,
                                    px: 2,
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 8px rgba(211, 47, 47, 0.3)',
                                    animation: isAuthenticated ? 'none' : 'pulse 2s infinite',
                                    '@keyframes pulse': {
                                        '0%': {
                                            boxShadow: '0 4px 8px rgba(211, 47, 47, 0.3)',
                                        },
                                        '50%': {
                                            boxShadow: '0 4px 16px rgba(211, 47, 47, 0.5)',
                                        },
                                        '100%': {
                                            boxShadow: '0 4px 8px rgba(211, 47, 47, 0.3)',
                                        },
                                    },
                                }}
                            >
                                Report Emergency
                            </Button>
                            )}

                            {/* Auth Section */}
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                {isAuthenticated ? (
                                    <>
                                        <IconButton
                                            onClick={handleMenu}
                                            size="small"
                                            aria-controls={open ? 'account-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            sx={{ 
                                                ml: 1,
                                                border: '2px solid',
                                                borderColor: 'primary.main' 
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    bgcolor: 'primary.main'
                                                }}
                                            >
                                                {currentUser?.email?.[0]?.toUpperCase()}
                                            </Avatar>
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            open={open}
                                            onClose={handleClose}
                                            onClick={handleClose}
                                            PaperProps={{
                                                elevation: 3,
                                                sx: {
                                                    overflow: 'visible',
                                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.2))',
                                                    mt: 1.5,
                                                    borderRadius: 2,
                                                    minWidth: 180,
                                                    '& .MuiAvatar-root': {
                                                        width: 32,
                                                        height: 32,
                                                        ml: -0.5,
                                                        mr: 1,
                                                    },
                                                },
                                            }}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        >
                                            {!isAdmin && (
                                                <MenuItem 
                                                    component={Link} 
                                                    to="/profile"
                                                    sx={{
                                                        py: 1.5,
                                                        '&:hover': {
                                                            bgcolor: 'rgba(0, 0, 0, 0.04)'
                                                        }
                                                    }}
                                                >
                                                    <PersonIcon sx={{ mr: 2 }} /> Profile
                                                </MenuItem>
                                            )}
                                            <MenuItem 
                                                onClick={handleLogout}
                                                sx={{
                                                    py: 1.5,
                                                    '&:hover': {
                                                        bgcolor: 'rgba(0, 0, 0, 0.04)'
                                                    }
                                                }}
                                            >
                                                <LogoutIcon sx={{ mr: 2 }} /> Logout
                                            </MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        <Button 
                                            color="primary" 
                                            component={Link} 
                                            to="/login"
                                            variant="outlined"
                                            sx={{ 
                                                display: { xs: 'none', sm: 'block' },
                                                borderRadius: 2,
                                                mr: 1
                                            }}
                                        >
                                            Login
                                        </Button>
                                        <Button 
                                            color="primary" 
                                            component={Link} 
                                            to="/register"
                                            variant="contained"
                                            sx={{ 
                                                display: { xs: 'none', sm: 'block' },
                                                borderRadius: 2
                                            }}
                                        >
                                            Register
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>
            
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: 250 
                    },
                }}
            >
                {drawer}
            </Drawer>
            
            {/* AI Emergency Assessment Chatbot */}
            <AIEmergencyAssessment 
                open={chatbotOpen} 
                onClose={handleCloseChatbot} 
            />
            
            {/* Toolbar spacer */}
            <Toolbar />
        </>
    );
};

export default Navbar;