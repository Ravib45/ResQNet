import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    TextField,
    Button,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    Divider,
    CircularProgress,
    Card,
    CardContent,
    Alert,
    IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WarningIcon from '@mui/icons-material/Warning';
import HelpIcon from '@mui/icons-material/Help';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { Link } from 'react-router-dom';

// Mock AI analysis function (in a real app, this would call an API)
const analyzeEmergency = async (text) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple keyword-based analysis (would be NLP-based in a real implementation)
    const text_lower = text.toLowerCase();
    
    // Create response object
    const response = {
        severity: 'low',
        suggestedServices: [],
        recommendation: '',
        detectedKeywords: [],
        emergencyType: ''
    };
    
    // Check for emergency keywords
    if (text_lower.includes('heart attack') || 
        text_lower.includes('cardiac') || 
        text_lower.includes('chest pain') || 
        text_lower.includes('breathing')) {
        response.severity = 'high';
        response.suggestedServices.push('ambulance');
        response.detectedKeywords.push('cardiac symptoms', 'medical emergency');
        response.recommendation = 'This appears to be a medical emergency requiring immediate attention. Please call an ambulance right away.';
        response.emergencyType = 'Medical';
    } 
    else if (text_lower.includes('fire') || 
             text_lower.includes('burning') || 
             text_lower.includes('smoke')) {
        response.severity = 'high';
        response.suggestedServices.push('fire');
        response.detectedKeywords.push('fire hazard');
        response.recommendation = 'This appears to be a fire emergency. Please evacuate immediately and call fire services.';
        response.emergencyType = 'Fire';
    }
    else if (text_lower.includes('accident') || 
             text_lower.includes('crash') || 
             text_lower.includes('collision') ||
             text_lower.includes('car') && (text_lower.includes('hit') || text_lower.includes('damage'))) {
        response.severity = 'medium';
        response.suggestedServices.push('police');
        
        if (text_lower.includes('injured') || text_lower.includes('hurt') || text_lower.includes('bleeding')) {
            response.severity = 'high';
            response.suggestedServices.push('ambulance');
            response.detectedKeywords.push('injuries');
        }
        
        response.detectedKeywords.push('vehicle accident');
        response.recommendation = 'This appears to be a vehicle accident. Please ensure safety first and report to police.';
        response.emergencyType = 'Accident';
    }
    else if (text_lower.includes('injured') || 
             text_lower.includes('wound') || 
             text_lower.includes('bleeding') || 
             text_lower.includes('fell') || 
             text_lower.includes('fall')) {
        response.severity = 'medium';
        response.suggestedServices.push('ambulance');
        response.detectedKeywords.push('injury');
        response.recommendation = 'This appears to involve an injury. Please assess the severity and consider medical attention.';
        response.emergencyType = 'Injury';
    }
    else if (text_lower.includes('break in') || 
             text_lower.includes('thief') || 
             text_lower.includes('stolen') || 
             text_lower.includes('robbery')) {
        response.severity = 'medium';
        response.suggestedServices.push('police');
        response.detectedKeywords.push('crime');
        response.recommendation = 'This appears to be a security or crime issue. Please contact the police to report the incident.';
        response.emergencyType = 'Crime';
    }
    else {
        response.severity = 'low';
        response.recommendation = 'Based on your description, I cannot identify an immediate emergency. Please provide more details about your situation.';
        response.emergencyType = 'Unknown';
    }
    
    return response;
};

const AIEmergencyAssessmentPage = () => {
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            text: 'Hello! I\'m the ResQNet AI assistant. I can help you assess your emergency situation and recommend appropriate services. Please describe what\'s happening in detail.', 
            sender: 'ai', 
            timestamp: new Date() 
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [assessment, setAssessment] = useState(null);
    const messagesEndRef = useRef(null);
    
    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    
    const handleSendMessage = async () => {
        if (!inputText.trim()) return;
        
        // Add user message
        const userMessage = { 
            id: messages.length + 1, 
            text: inputText, 
            sender: 'user', 
            timestamp: new Date() 
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setLoading(true);
        
        try {
            // Process with AI
            const result = await analyzeEmergency(inputText);
            setAssessment(result);
            
            // Add AI response
            let responseText = 'Based on your description, ';
            
            if (result.severity === 'high') {
                responseText += 'this appears to be a serious emergency. ' + result.recommendation;
            } else if (result.severity === 'medium') {
                responseText += 'this situation requires attention. ' + result.recommendation;
            } else {
                responseText += result.recommendation;
            }
            
            const aiMessage = { 
                id: messages.length + 2, 
                text: responseText, 
                sender: 'ai', 
                timestamp: new Date(),
                assessment: result
            };
            
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error analyzing emergency:', error);
            
            // Add error message
            const errorMessage = { 
                id: messages.length + 2, 
                text: 'Sorry, I encountered an error analyzing your emergency. Please try again or directly contact emergency services if you need immediate help.', 
                sender: 'ai', 
                timestamp: new Date() 
            };
            
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    // Get severity color
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return 'error.main';
            case 'medium':
                return 'warning.main';
            case 'low':
                return 'success.main';
            default:
                return 'text.primary';
        }
    };
    
    // Get service icon
    const getServiceIcon = (service) => {
        switch (service) {
            case 'ambulance':
                return <LocalHospitalIcon />;
            case 'police':
                return <WarningIcon />;
            case 'fire':
                return <LocalFireDepartmentIcon />;
            default:
                return <HelpIcon />;
        }
    };
    
    // Get service name and number
    const getServiceInfo = (service) => {
        switch (service) {
            case 'ambulance':
                return { name: 'Ambulance', number: '108' };
            case 'police':
                return { name: 'Police', number: '100' };
            case 'fire':
                return { name: 'Fire', number: '101' };
            default:
                return { name: 'Emergency', number: '112' };
        }
    };
    
    // Emergency templates to help users get started
    const emergencyTemplates = [
        "I'm experiencing chest pain and difficulty breathing.",
        "There's a fire in my building, I see smoke.",
        "I've been in a car accident, there are people injured.",
        "Someone broke into my house and stole my belongings.",
        "I fell down the stairs and I think I broke my arm."
    ];
    
    const applyTemplate = (template) => {
        setInputText(template);
    };
    
    return (
        <Box sx={{ py: 4, minHeight: '100vh' }}>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                borderRadius: 3, 
                                overflow: 'hidden',
                                height: '75vh',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* Header */}
                            <Box sx={{ 
                                p: 2, 
                                bgcolor: 'primary.main', 
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <SmartToyIcon sx={{ mr: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    AI Emergency Assessment
                                </Typography>
                            </Box>
                            
                            {/* Messages */}
                            <Box sx={{ 
                                flexGrow: 1, 
                                overflowY: 'auto', 
                                p: 3,
                                bgcolor: 'background.default'
                            }}>
                                <List>
                                    {messages.map((message) => (
                                        <ListItem
                                            key={message.id}
                                            alignItems="flex-start"
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                                px: 0,
                                                py: 1
                                            }}
                                        >
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'flex-start',
                                                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                                                maxWidth: '80%'
                                            }}>
                                                <ListItemAvatar sx={{ minWidth: 40 }}>
                                                    <Avatar 
                                                        sx={{ 
                                                            bgcolor: message.sender === 'ai' ? 'primary.main' : 'secondary.main',
                                                            width: 32,
                                                            height: 32
                                                        }}
                                                    >
                                                        {message.sender === 'ai' ? <SmartToyIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <Paper
                                                    elevation={1}
                                                    sx={{
                                                        p: 2,
                                                        bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                                                        borderRadius: message.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                    }}
                                                >
                                                    <Typography variant="body1">
                                                        {message.text}
                                                    </Typography>
                                                    
                                                    {/* Display assessment results */}
                                                    {message.assessment && (
                                                        <Box sx={{ mt: 2 }}>
                                                            <Divider sx={{ my: 1 }} />
                                                            
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                                                                    Severity:
                                                                </Typography>
                                                                <Chip 
                                                                    label={message.assessment.severity.toUpperCase()}
                                                                    size="small"
                                                                    sx={{ 
                                                                        bgcolor: getSeverityColor(message.assessment.severity),
                                                                        color: 'white',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                />
                                                            </Box>
                                                            
                                                            {message.assessment.emergencyType && (
                                                                <Box sx={{ mb: 1 }}>
                                                                    <Typography variant="subtitle2" sx={{ mr: 1 }}>
                                                                        Type: {message.assessment.emergencyType}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            
                                                            {message.assessment.detectedKeywords.length > 0 && (
                                                                <Box sx={{ mb: 1 }}>
                                                                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                                                        Detected Keywords:
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                        {message.assessment.detectedKeywords.map((keyword, idx) => (
                                                                            <Chip 
                                                                                key={idx}
                                                                                label={keyword}
                                                                                size="small"
                                                                                variant="outlined"
                                                                                sx={{ fontSize: '0.7rem' }}
                                                                            />
                                                                        ))}
                                                                    </Box>
                                                                </Box>
                                                            )}
                                                            
                                                            {message.assessment.suggestedServices.length > 0 && (
                                                                <Box sx={{ mb: 1 }}>
                                                                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                                                        Suggested Services:
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                        {message.assessment.suggestedServices.map((service, idx) => {
                                                                            const serviceInfo = getServiceInfo(service);
                                                                            return (
                                                                                <Box 
                                                                                    key={idx} 
                                                                                    sx={{ 
                                                                                        display: 'flex', 
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'space-between',
                                                                                        p: 1,
                                                                                        bgcolor: 'background.default',
                                                                                        borderRadius: 1
                                                                                    }}
                                                                                >
                                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <Avatar sx={{ bgcolor: 'error.main', width: 24, height: 24, mr: 1 }}>
                                                                                            {getServiceIcon(service)}
                                                                                        </Avatar>
                                                                                        <Typography variant="body2">
                                                                                            {serviceInfo.name}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                    <Button
                                                                                        component="a"
                                                                                        href={`tel:${serviceInfo.number}`}
                                                                                        variant="contained"
                                                                                        color="error"
                                                                                        size="small"
                                                                                        onClick={(e) => {
                                                                                            if (window.confirm(`Are you sure you want to call ${serviceInfo.name} (${serviceInfo.number})? Only use for real emergencies.`)) {
                                                                                                return true;
                                                                                            }
                                                                                            e.preventDefault();
                                                                                            return false;
                                                                                        }}
                                                                                    >
                                                                                        Call {serviceInfo.number}
                                                                                    </Button>
                                                                                </Box>
                                                                            );
                                                                        })}
                                                                    </Box>
                                                                </Box>
                                                            )}
                                                            
                                                            {message.assessment.severity === 'high' && (
                                                                <Box sx={{ mt: 2 }}>
                                                                    <Button
                                                                        component={Link}
                                                                        to="/report-emergency"
                                                                        fullWidth
                                                                        variant="contained"
                                                                        color="error"
                                                                        sx={{ py: 1 }}
                                                                    >
                                                                        Report Emergency
                                                                    </Button>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    )}
                                                </Paper>
                                            </Box>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    mt: 0.5,
                                                    mx: 2,
                                                    color: 'text.secondary',
                                                    alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                                }}
                                            >
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </ListItem>
                                    ))}
                                    {loading && (
                                        <ListItem
                                            alignItems="flex-start"
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                px: 0,
                                                py: 1
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ListItemAvatar sx={{ minWidth: 40 }}>
                                                    <Avatar 
                                                        sx={{ 
                                                            bgcolor: 'primary.main',
                                                            width: 32,
                                                            height: 32
                                                        }}
                                                    >
                                                        <SmartToyIcon fontSize="small" />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <Box sx={{ display: 'flex', px: 2 }}>
                                                    <CircularProgress size={16} sx={{ mx: 0.5 }} />
                                                    <CircularProgress size={16} sx={{ mx: 0.5, animationDelay: '0.2s' }} />
                                                    <CircularProgress size={16} sx={{ mx: 0.5, animationDelay: '0.4s' }} />
                                                </Box>
                                            </Box>
                                        </ListItem>
                                    )}
                                    <div ref={messagesEndRef} />
                                </List>
                            </Box>
                            
                            {/* Input */}
                            <Box sx={{ 
                                p: 2, 
                                borderTop: '1px solid', 
                                borderColor: 'divider',
                                bgcolor: 'background.paper'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        fullWidth
                                        placeholder="Describe your emergency situation in detail..."
                                        variant="outlined"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        multiline
                                        rows={2}
                                        disabled={loading}
                                        InputProps={{
                                            sx: { borderRadius: 2 }
                                        }}
                                    />
                                    <IconButton 
                                        color="primary" 
                                        onClick={handleSendMessage}
                                        disabled={!inputText.trim() || loading}
                                        sx={{ 
                                            ml: 1, 
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '&:hover': {
                                                bgcolor: 'primary.dark'
                                            },
                                            '&.Mui-disabled': {
                                                bgcolor: 'action.disabledBackground',
                                                color: 'action.disabled'
                                            }
                                        }}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={2} direction="column">
                            <Grid item>
                                <Card elevation={2} sx={{ borderRadius: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Emergency Assessment Guide
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            Our AI assistant analyzes your emergency description to:
                                        </Typography>
                                        <List dense>
                                            <ListItem>
                                                <ListItemText 
                                                    primary="Assess emergency severity" 
                                                    secondary="Categorized as high, medium, or low"
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText 
                                                    primary="Identify emergency type" 
                                                    secondary="Medical, fire, accident, etc."
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText 
                                                    primary="Suggest appropriate services" 
                                                    secondary="Direct connections to relevant emergency services"
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText 
                                                    primary="Provide immediate recommendations" 
                                                    secondary="Guidance based on the emergency type and severity"
                                                />
                                            </ListItem>
                                        </List>
                                        <Alert severity="info" sx={{ mt: 2 }}>
                                            For critical emergencies, always call emergency services directly at 112.
                                        </Alert>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item>
                                <Card elevation={2} sx={{ borderRadius: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Example Descriptions
                                        </Typography>
                                        <Typography variant="body2" paragraph>
                                            Click on an example to use it:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {emergencyTemplates.map((template, index) => (
                                                <Button 
                                                    key={index} 
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => applyTemplate(template)}
                                                    sx={{ 
                                                        justifyContent: 'flex-start',
                                                        textTransform: 'none',
                                                        py: 1
                                                    }}
                                                >
                                                    {template}
                                                </Button>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item>
                                <Card elevation={2} sx={{ borderRadius: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
                                            Emergency Numbers
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Button
                                                    fullWidth
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
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    <Box sx={{ textAlign: 'center', width: '100%' }}>
                                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>112</Typography>
                                                        <Typography variant="caption">All Emergencies</Typography>
                                                    </Box>
                                                </Button>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="error"
                                                    component={Link}
                                                    to="/report-emergency"
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    <Box sx={{ textAlign: 'center', width: '100%' }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Report</Typography>
                                                        <Typography variant="caption">Emergency</Typography>
                                                    </Box>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AIEmergencyAssessmentPage; 