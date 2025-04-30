import React, { useState, useEffect } from 'react';
import {
    Box, Button, Container, Paper, TextField, Typography, Alert, Divider, InputAdornment, Link, Checkbox,
    Grid, Stepper, Step, StepLabel, CircularProgress
} from '@mui/material';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import AOS from 'aos';
import 'aos/dist/aos.css';

const registerBg = 'https://images.pexels.com/photos/4506226/pexels-photo-4506226.jpeg?auto=compress&cs=tinysrgb&w=1500';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [recaptchaChecked, setRecaptchaChecked] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const steps = ['Personal Info', 'Account Setup', 'Verification'];

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        
        if (!recaptchaChecked) {
            setError('Please verify that you are not a robot.');
            setLoading(false);
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
            setLoading(false);
        }
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    // Form validation for enabling next button
    const isStepOneValid = firstName.trim() !== '' && lastName.trim() !== '';
    const isStepTwoValid = email.trim() !== '' && password.trim() !== '' && password.length >= 6;
    const isStepThreeValid = phone.trim() !== '' && recaptchaChecked;

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: undefined,
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${registerBg}) center/cover no-repeat`,
            py: 5,
        }}>
            <Container maxWidth="sm">
                <Paper 
                    elevation={6} 
                    sx={{ 
                        p: 4, 
                        borderRadius: 3, 
                        bgcolor: 'rgba(255,255,255,0.97)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        overflow: 'hidden'
                    }} 
                    data-aos="fade-up"
                >
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography 
                            variant="h4" 
                            fontWeight={800} 
                            gutterBottom 
                            data-aos="fade-down"
                            sx={{ 
                                background: 'linear-gradient(90deg, #1565c0, #b71c1c)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1
                            }}
                        >
                            Join ResQNet
                        </Typography>
                        <Typography 
                            variant="body1" 
                            color="text.secondary" 
                            sx={{ mb: 3 }}
                        >
                            Create your account to start using our emergency services
                        </Typography>
                    </Box>

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <form onSubmit={activeStep === 2 ? handleRegister : (e) => e.preventDefault()}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }} data-aos="fade-up">
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ mb: 3 }} data-aos="fade-up">
                                {success}
                            </Alert>
                        )}

                        {/* Step 1: Personal Information */}
                        {activeStep === 0 && (
                            <Box data-aos="fade-right">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="First Name"
                                            type="text"
                                            fullWidth
                                            required
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon color="action" />
                                                    </InputAdornment>
                                                )
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Last Name"
                                            type="text"
                                            fullWidth
                                            required
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon color="action" />
                                                    </InputAdornment>
                                                )
                                            }}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Step 2: Account Information */}
                        {activeStep === 1 && (
                            <Box data-aos="fade-right">
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
                                                <EmailIcon color="action" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    required
                                    margin="normal"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    helperText="Password must be at least 6 characters"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="action" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Box>
                        )}

                        {/* Step 3: Verification */}
                        {activeStep === 2 && (
                            <Box data-aos="fade-right">
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
                                                <PhoneIcon color="action" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Box sx={{ 
                                    my: 3, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    bgcolor: '#f5f5f5', 
                                    border: '1px solid #e0e0e0', 
                                    borderRadius: 2, 
                                    p: 2 
                                }}>
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
                                        <Typography variant="caption" color="text.secondary" display="block">Privacy - Terms</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
                                    By creating an account, I am agreeing to ResQNet's{' '}
                                    <Link href="#" color="primary" underline="hover">Terms of Service</Link> and{' '}
                                    <Link href="#" color="primary" underline="hover">Privacy Policy</Link>.
                                </Typography>
                            </Box>
                        )}

                        {/* Step navigation buttons */}
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            
                            {activeStep === steps.length - 1 ? (
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    disabled={!isStepThreeValid || loading}
                                    sx={{
                                        bgcolor: 'primary.main',
                                        fontWeight: 'bold',
                                        py: 1.5,
                                        px: 4,
                                        borderRadius: 2,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                                        '&:hover': {
                                            boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                                        }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={(activeStep === 0 && !isStepOneValid) || (activeStep === 1 && !isStepTwoValid)}
                                    sx={{
                                        bgcolor: 'primary.main',
                                        fontWeight: 'bold',
                                        py: 1.5,
                                        px: 4,
                                        borderRadius: 2
                                    }}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                OR
                            </Typography>
                        </Divider>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                                Already have an account?{' '}
                                <Link 
                                    component="button" 
                                    onClick={() => navigate('/login')} 
                                    underline="hover" 
                                    color="primary"
                                    sx={{ fontWeight: 'bold' }}
                                >
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