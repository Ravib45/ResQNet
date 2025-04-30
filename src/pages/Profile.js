import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    Grid,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    IconButton,
    Alert,
    Snackbar,
    CircularProgress,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Profile = () => {
    const { currentUser, user } = useAuth();
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        displayName: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        emergencyContact: '',
        role: 'Emergency Responder',
        department: '',
        specialization: '',
        experience: ''
    });
    const [editData, setEditData] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        // For debugging
        console.log("Auth state:", { currentUser, user });

        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const authUser = currentUser || user;

                if (!authUser) {
                    console.log("No authenticated user found");
                    setLoading(false);
                    return;
                }

                console.log("Fetching data for user:", authUser.uid);
                const docRef = doc(db, 'users', authUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log("Found user data:", docSnap.data());
                    // Update profile data with firestore data
                    setProfileData(prevData => ({ ...prevData, ...docSnap.data() }));
                } else {
                    console.log("No user document exists, creating initial data");
                    // If no data exists (unlikely but possible)
                    const initialData = {
                        displayName: authUser.displayName || '',
                        email: authUser.email,
                        createdAt: new Date().toISOString(),
                        role: 'Emergency Responder'
                    };
                    await setDoc(docRef, initialData);
                    setProfileData(prevData => ({ ...prevData, ...initialData }));
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setSnackbar({
                    open: true,
                    message: 'Error loading profile data',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [currentUser, user]);

    const handleEditClick = () => {
        setEditData({ ...profileData });
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleSave = async () => {
        try {
            const authUser = currentUser || user;
            if (!authUser) {
                setSnackbar({
                    open: true,
                    message: 'Cannot save: No user is logged in',
                    severity: 'error'
                });
                return;
            }

            const docRef = doc(db, 'users', authUser.uid);
            const updatedData = {
                ...editData,
                updatedAt: new Date().toISOString()
            };
            await updateDoc(docRef, updatedData);
            setProfileData(updatedData);
            setOpenDialog(false);
            setSnackbar({
                open: true,
                message: 'Profile updated successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            setSnackbar({
                open: true,
                message: 'Error updating profile',
                severity: 'error'
            });
        }
    };

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    const ProfileListItem = ({ icon, primary, secondary, value }) => {
        if (!value) return null;

        return (
            <ListItem>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText
                    primary={primary}
                    secondary={secondary || value}
                />
            </ListItem>
        );
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    // Ensure we have the most current data
    const authUser = currentUser || user;
    const userEmail = profileData.email || (authUser ? authUser.email : '');

    const fullName = profileData.displayName ||
        `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() ||
        'User';

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {/* Header with avatar and basic info */}
                <Box sx={{
                    p: 4,
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#f5f5f5',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <Avatar
                        sx={{
                            width: 110,
                            height: 110,
                            bgcolor: '#e31837',
                            fontSize: '3rem',
                            boxShadow: 2
                        }}
                    >
                        {(profileData.firstName || userEmail)?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ ml: 3, flex: 1 }}>
                        <Typography variant="h4" fontWeight="medium" gutterBottom>
                            {fullName}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                            {profileData.role || 'Emergency Responder'}
                        </Typography>
                        {profileData.createdAt && (
                            <Typography variant="caption" color="textSecondary">
                                Member since: {new Date(profileData.createdAt).toLocaleDateString()}
                            </Typography>
                        )}
                    </Box>
                    <IconButton
                        onClick={handleEditClick}
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'primary.dark' },
                            p: 1.5
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                </Box>

                {/* Contact Information */}
                <Box sx={{ p: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'medium' }}>
                        Contact Information
                    </Typography>

                    <List>
                        <ProfileListItem
                            icon={<PersonIcon color="primary" />}
                            primary="Full Name"
                            value={fullName}
                        />
                        <ListItem>
                            <ListItemIcon>
                                <EmailIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Email Address"
                                secondary={userEmail}
                            />
                        </ListItem>
                        <ProfileListItem
                            icon={<PhoneIcon color="primary" />}
                            primary="Phone Number"
                            value={profileData.phoneNumber}
                        />
                        <ProfileListItem
                            icon={<HomeIcon color="primary" />}
                            primary="Address"
                            value={profileData.address}
                        />
                        <ProfileListItem
                            icon={<WorkIcon color="primary" />}
                            primary="Role"
                            value={profileData.role}
                        />
                    </List>
                </Box>
            </Paper>

            {/* Edit Dialog */}
            <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={editData.firstName || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={editData.lastName || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phoneNumber"
                                value={editData.phoneNumber || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={editData.address || ''}
                                onChange={handleChange}
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Emergency Contact"
                                name="emergencyContact"
                                value={editData.emergencyContact || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Department"
                                name="department"
                                value={editData.department || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Specialization"
                                name="specialization"
                                value={editData.specialization || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Experience"
                                name="experience"
                                value={editData.experience || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Profile; 