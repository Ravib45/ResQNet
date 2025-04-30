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
    Badge
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

                {/* Emergency button for mobile */}
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
                                    mx: 2,
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 1,
                                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                                }}
                            >
                                <PhoneIcon sx={{ color: 'error.main', mr: 1 }} />
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    Emergency: <Box component="span" sx={{ color: 'error.main' }}>112</Box>
                                </Typography>
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
                                </Box>
                            )}

                            {/* Report Emergency Button */}
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
            
            {/* Toolbar spacer */}
            <Toolbar />
        </>
    );
};

export default Navbar;