import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    Divider,
    Chip,
    Drawer,
    Tooltip,
    CircularProgress,
    Zoom,
    Fade
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
import HelpIcon from '@mui/icons-material/Help';
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
        detectedKeywords: []
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
    } 
    else if (text_lower.includes('fire') || 
             text_lower.includes('burning') || 
             text_lower.includes('smoke')) {
        response.severity = 'high';
        response.suggestedServices.push('fire');
        response.detectedKeywords.push('fire hazard');
        response.recommendation = 'This appears to be a fire emergency. Please evacuate immediately and call fire services.';
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
    }
    else if (text_lower.includes('break in') || 
             text_lower.includes('thief') || 
             text_lower.includes('stolen') || 
             text_lower.includes('robbery')) {
        response.severity = 'medium';
        response.suggestedServices.push('police');
        response.detectedKeywords.push('crime');
        response.recommendation = 'This appears to be a security or crime issue. Please contact the police to report the incident.';
    }
    else {
        response.severity = 'low';
        response.recommendation = 'Based on your description, I cannot identify an immediate emergency. Please provide more details about your situation.';
    }
    
    return response;
};

const AIEmergencyAssessment = ({ open, onClose }) => {
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            text: 'Hello! I\'m the ResQNet AI assistant. I can help you assess your emergency situation and recommend appropriate services. Please describe what\'s happening.', 
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
                return <WarningIcon />;
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
    
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 400 },
                    borderTopLeftRadius: { xs: 16, sm: 16 },
                    borderBottomLeftRadius: { xs: 0, sm: 16 },
                    overflow: 'hidden'
                }
            }}
        >
            {/* Header */}
            <Box sx={{ 
                p: 2, 
                bgcolor: 'primary.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SmartToyIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Emergency Assessment
                    </Typography>
                </Box>
                <IconButton 
                    color="inherit" 
                    onClick={onClose}
                    size="small"
                    sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.2)'
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            
            {/* Messages */}
            <Box sx={{ 
                flexGrow: 1, 
                overflowY: 'auto', 
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <List sx={{ width: '100%' }}>
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
                                        maxWidth: '80%',
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
                                                                        sx={{ minWidth: 'unset', borderRadius: 1 }}
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
                                                        onClick={onClose}
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
                        placeholder="Describe your emergency situation..."
                        variant="outlined"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        multiline
                        maxRows={3}
                        disabled={loading}
                        InputProps={{
                            sx: { borderRadius: 4, pr: 1 }
                        }}
                    />
                    <Zoom in={!!inputText.trim()}>
                        <IconButton 
                            color="primary" 
                            onClick={handleSendMessage}
                            disabled={loading}
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
                    </Zoom>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        For immediate assistance, call emergency services directly at 112
                    </Typography>
                    <Button 
                        component={Link} 
                        to="/ai-emergency-assessment" 
                        size="small" 
                        color="primary" 
                        onClick={onClose}
                    >
                        Advanced Assessment
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default AIEmergencyAssessment; 