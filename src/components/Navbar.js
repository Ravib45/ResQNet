import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Avatar
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
    const { isAuthenticated, currentUser, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            handleClose();
            await signOut(auth);
            // Force navigation to GetStarted page and clear navigation history
            window.location.href = '/';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // For admin users - minimal menu items
    const adminMenuItems = [
        { label: 'Home', path: '/admin/home', protected: true },
        { label: 'Reports', path: '/admin', protected: true },
        { label: 'Completed', path: '/admin/completed', protected: true },
        { label: 'Users', path: '/admin/users', protected: true },
        { label: 'Dashboard', path: '/admin/dashboard', protected: true },
    ];

    // Base menu items for regular users
    const regularUserMenuItems = [
        { label: 'Home', path: '/home', protected: true },
        { label: 'About', path: '/about', protected: true },
        { label: 'Features', path: '/features', protected: true },
        { label: 'Report', path: '/report-emergency', protected: true },
    ];

    // Use the appropriate menu items based on user role
    const menuItems = isAdmin ? adminMenuItems : regularUserMenuItems;

    const filteredMenuItems = menuItems.filter((item) => {
        if (item.protected && isAuthenticated) return true;
        return false;
    });

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to={isAuthenticated ? (isAdmin ? "/admin" : "/home") : "/"}
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'inherit',
                        fontWeight: 'bold'
                    }}
                >
                    ResQNet
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {filteredMenuItems.map((item) => (
                        <Button
                            key={item.label}
                            component={Link}
                            to={item.path}
                            color="inherit"
                        >
                            {item.label}
                        </Button>
                    ))}

                    {isAuthenticated ? (
                        <>
                            <IconButton
                                onClick={handleMenu}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: '#e31837'
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
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
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
                                    <MenuItem component={Link} to="/profile">
                                        <Avatar /> Profile
                                    </MenuItem>
                                )}
                                <MenuItem onClick={handleLogout}>
                                    <Avatar /> Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;