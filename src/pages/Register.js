import React, { useState, useEffect } from 'react';
import {
    Box, Button, Container, Paper, TextField, Typography, Alert, Divider, InputAdornment, Link, Checkbox
} from '@mui/material';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import AOS from 'aos';
import 'aos/dist/aos.css';

const registerBg = 'https://images.pexels.com/photos/5628246/pexels-photo-5628246.jpeg?auto=compress&cs=tinysrgb&w=1500';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [recaptchaChecked, setRecaptchaChecked] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!recaptchaChecked) {
            setError('Please verify that you are not a robot.');
            return;
        }
        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update user profile in Firebase Auth
            const displayName = `${firstName} ${lastName}`;
            await updateProfile(user, {
                displayName: displayName
            });

            // Store user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                displayName: displayName,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phone,
                role: 'Emergency Responder',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            setSuccess('Registration successful! Redirecting to home...');
            setTimeout(() => navigate('/home'), 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: undefined,
            background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url(${registerBg}) center/cover no-repeat`,
        }}>
            <Container maxWidth="xs">
                <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.95)' }} data-aos="fade-up">
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <img src="https://img.icons8.com/color/96/000000/ambulance.png" alt="logo" style={{ width: 56, marginBottom: 8 }} data-aos="fade-down" />
                        <Typography variant="h5" fontWeight={700} gutterBottom color="primary" data-aos="fade-down">Create Account</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} data-aos="fade-up">or</Divider>
                    <form onSubmit={handleRegister}>
                        <TextField
                            label="First Name"
                            type="text"
                            fullWidth
                            required
                            margin="normal"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="primary" />
                                    </InputAdornment>
                                )
                            }}
                            data-aos="fade-right"
                        />
                        <TextField
                            label="Last Name"
                            type="text"
                            fullWidth
                            required
                            margin="normal"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="primary" />
                                    </InputAdornment>
                                )
                            }}
                            data-aos="fade-right"
                        />
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            margin="normal"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="primary" />
                                    </InputAdornment>
                                )
                            }}
                            data-aos="fade-right"
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            margin="normal"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="primary" />
                                    </InputAdornment>
                                )
                            }}
                            data-aos="fade-right"
                        />
                        <TextField
                            label="Phone Number"
                            type="tel"
                            fullWidth
                            required
                            margin="normal"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PhoneIcon color="primary" />
                                    </InputAdornment>
                                )
                            }}
                            data-aos="fade-right"
                        />
                        <Box sx={{ my: 2, display: 'flex', alignItems: 'center', bgcolor: '#fff', border: '1px solid #d3d3d3', borderRadius: 1, p: 2 }} data-aos="fade-up">
                            <Checkbox
                                checked={recaptchaChecked}
                                onChange={e => setRecaptchaChecked(e.target.checked)}
                                sx={{ mr: 1 }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body2">I'm not a robot</Typography>
                                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" style={{ height: 24, marginTop: 2 }} />
                            </Box>
                            <Box sx={{ ml: 1 }}>
                                <Typography variant="caption" color="text.secondary">reCAPTCHA</Typography>
                                <Typography variant="caption" color="text.secondary">Privacy - Terms</Typography>
                            </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, mb: 2 }} data-aos="fade-up">
                            By creating an account, I am agreeing to ResQNet's{' '}
                            <Link href="#" color="primary" underline="hover">Terms of Service</Link> and{' '}
                            <Link href="#" color="primary" underline="hover">Privacy Policy</Link>.
                        </Typography>
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, fontWeight: 'bold', fontSize: '1.1rem' }} data-aos="fade-up">
                            Continue
                        </Button>
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2">
                                Already have an account?{' '}
                                <Link component="button" onClick={() => navigate('/login')} underline="hover" color="primary">
                                    Log in
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register; 