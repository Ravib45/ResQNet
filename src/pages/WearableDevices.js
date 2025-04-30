import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    Button,
    Switch,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Tooltip,
    Alert,
    CircularProgress
} from '@mui/material';
import WatchIcon from '@mui/icons-material/Watch';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import BluetoothConnectedIcon from '@mui/icons-material/BluetoothConnected';
import BluetoothDisabledIcon from '@mui/icons-material/BluetoothDisabled';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import FallDetectionIcon from '@mui/icons-material/Accessibility';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from 'react-router-dom';

const WearableDevices = () => {
    // Mock data for connected devices
    const [devices, setDevices] = useState([
        { 
            id: 1, 
            name: 'Apple Watch Series 8', 
            type: 'smartwatch',
            connected: true, 
            batteryLevel: 78,
            lastSync: '10 min ago',
            fallDetection: true,
            emergencyContactsEnabled: true,
            healthMonitoring: true
        },
        { 
            id: 2, 
            name: 'Fitbit Sense', 
            type: 'fitness tracker',
            connected: false, 
            batteryLevel: 45,
            lastSync: '2 hours ago',
            fallDetection: false,
            emergencyContactsEnabled: true,
            healthMonitoring: true
        }
    ]);

    // Mock health data
    const [healthData, setHealthData] = useState({
        heartRate: { current: 72, min: 58, max: 142, average: 78 },
        steps: { today: 6453, goal: 10000, week: 43250 },
        lastUpdated: new Date().toLocaleTimeString()
    });

    // Setting states
    const [loading, setLoading] = useState(false);
    const [pairing, setPairing] = useState(false);
    const [testAlertShown, setTestAlertShown] = useState(false);

    // Toggle device connection
    const toggleDeviceConnection = (deviceId) => {
        setDevices(devices => 
            devices.map(device => 
                device.id === deviceId ? {...device, connected: !device.connected} : device
            )
        );
    };

    // Toggle device setting
    const toggleDeviceSetting = (deviceId, setting) => {
        setDevices(devices => 
            devices.map(device => 
                device.id === deviceId ? {...device, [setting]: !device[setting]} : device
            )
        );
    };

    // Simulate health data update
    const updateHealthData = () => {
        // Simulate heart rate varying by +/- 5 bpm
        const currentHeartRate = healthData.heartRate.current + Math.floor(Math.random() * 11) - 5;
        // Simulate steps increasing by 50-150
        const currentSteps = healthData.steps.today + Math.floor(Math.random() * 101) + 50;
        
        setHealthData({
            heartRate: { 
                current: currentHeartRate,
                min: Math.min(healthData.heartRate.min, currentHeartRate),
                max: Math.max(healthData.heartRate.max, currentHeartRate),
                average: Math.round((healthData.heartRate.average + currentHeartRate) / 2)
            },
            steps: { 
                today: currentSteps,
                goal: healthData.steps.goal,
                week: healthData.steps.week + Math.floor(Math.random() * 101) + 50
            },
            lastUpdated: new Date().toLocaleTimeString()
        });
    };

    // Simulate fall detection test
    const testFallDetection = () => {
        setLoading(true);
        setTimeout(() => {
            setTestAlertShown(true);
            setLoading(false);
            setTimeout(() => {
                setTestAlertShown(false);
            }, 5000);
        }, 2000);
    };

    // Simulate adding a new device
    const addNewDevice = () => {
        setPairing(true);
        setTimeout(() => {
            setPairing(false);
            alert('This would open a setup wizard to pair a new wearable device');
        }, 2000);
    };

    // Update health data periodically
    useEffect(() => {
        const interval = setInterval(updateHealthData, 30000);
        return () => clearInterval(interval);
    }, [healthData]);

    return (
        <Box sx={{ py: 5, minHeight: '100vh' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                    Wearable Devices
                </Typography>

                {testAlertShown && (
                    <Alert 
                        severity="warning" 
                        sx={{ mb: 3, alignItems: 'center' }}
                        action={
                            <Button color="inherit" size="small" component={Link} to="/report-emergency">
                                REPORT EMERGENCY
                            </Button>
                        }
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <NotificationsActiveIcon sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                Fall detected! Are you OK? Emergency contacts will be notified in 30 seconds unless canceled.
                            </Typography>
                        </Box>
                    </Alert>
                )}

                <Grid container spacing={4}>
                    {/* Connected Devices Section */}
                    <Grid item xs={12} md={7}>
                        <Paper 
                            elevation={2} 
                            sx={{ 
                                p: 0, 
                                borderRadius: 2,
                                overflow: 'hidden',
                                height: '100%'
                            }}
                        >
                            <Box sx={{ 
                                bgcolor: 'primary.main', 
                                p: 2, 
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                    <WatchIcon sx={{ mr: 1 }} /> Connected Devices
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="secondary"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={addNewDevice}
                                    disabled={pairing}
                                >
                                    {pairing ? <CircularProgress size={24} color="inherit" /> : "Add Device"}
                                </Button>
                            </Box>
                            <List sx={{ p: 0 }}>
                                {devices.map((device) => (
                                    <React.Fragment key={device.id}>
                                        <ListItem 
                                            sx={{ 
                                                py: 2,
                                                bgcolor: device.connected ? 'rgba(46, 125, 50, 0.05)' : 'transparent',
                                                transition: 'background-color 0.3s ease'
                                            }}
                                        >
                                            <ListItemIcon>
                                                {device.connected ? 
                                                    <BluetoothConnectedIcon color="success" /> : 
                                                    <BluetoothDisabledIcon color="disabled" />
                                                }
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                                        {device.name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography variant="body2" color="text.secondary" component="span">
                                                            {device.type} • Last synced: {device.lastSync}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                            {device.batteryLevel < 20 ? 
                                                                <BatteryAlertIcon color="error" sx={{ mr: 0.5, fontSize: 18 }} /> : 
                                                                <BatteryFullIcon color="success" sx={{ mr: 0.5, fontSize: 18 }} />
                                                            }
                                                            <Typography variant="body2" color={device.batteryLevel < 20 ? "error.main" : "text.secondary"}>
                                                                Battery: {device.batteryLevel}%
                                                            </Typography>
                                                        </Box>
                                                    </>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Button
                                                        variant={device.connected ? "outlined" : "contained"}
                                                        color={device.connected ? "success" : "primary"}
                                                        size="small"
                                                        onClick={() => toggleDeviceConnection(device.id)}
                                                        sx={{ minWidth: 100 }}
                                                    >
                                                        {device.connected ? 'Connected' : 'Connect'}
                                                    </Button>
                                                    <Tooltip title="Device Settings">
                                                        <IconButton edge="end" disabled={!device.connected}>
                                                            <SettingsIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        
                                        {device.connected && (
                                            <Box sx={{ px: 2, pb: 2, bgcolor: 'rgba(46, 125, 50, 0.05)' }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={4}>
                                                        <Box sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'space-between',
                                                            bgcolor: 'background.paper',
                                                            borderRadius: 1,
                                                            p: 1
                                                        }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <FallDetectionIcon sx={{ color: 'primary.main', mr: 1 }} />
                                                                <Typography variant="body2">Fall Detection</Typography>
                                                            </Box>
                                                            <Switch 
                                                                size="small"
                                                                checked={device.fallDetection}
                                                                onChange={() => toggleDeviceSetting(device.id, 'fallDetection')}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4}>
                                                        <Box sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'space-between',
                                                            bgcolor: 'background.paper',
                                                            borderRadius: 1,
                                                            p: 1
                                                        }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <NotificationsActiveIcon sx={{ color: 'primary.main', mr: 1 }} />
                                                                <Typography variant="body2">Emergency Contacts</Typography>
                                                            </Box>
                                                            <Switch 
                                                                size="small"
                                                                checked={device.emergencyContactsEnabled}
                                                                onChange={() => toggleDeviceSetting(device.id, 'emergencyContactsEnabled')}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4}>
                                                        <Box sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'space-between',
                                                            bgcolor: 'background.paper',
                                                            borderRadius: 1,
                                                            p: 1
                                                        }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <HeartBrokenIcon sx={{ color: 'primary.main', mr: 1 }} />
                                                                <Typography variant="body2">Health Monitoring</Typography>
                                                            </Box>
                                                            <Switch 
                                                                size="small"
                                                                checked={device.healthMonitoring}
                                                                onChange={() => toggleDeviceSetting(device.id, 'healthMonitoring')}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                                {device.fallDetection && (
                                                    <Button
                                                        variant="outlined"
                                                        color="warning"
                                                        size="small"
                                                        sx={{ mt: 2 }}
                                                        onClick={testFallDetection}
                                                        disabled={loading}
                                                    >
                                                        {loading ? 
                                                            <CircularProgress size={24} color="inherit" /> : 
                                                            "Test Fall Detection"
                                                        }
                                                    </Button>
                                                )}
                                            </Box>
                                        )}
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Health Data Section */}
                    <Grid item xs={12} md={5}>
                        <Grid container spacing={3} direction="column">
                            <Grid item>
                                <Card elevation={2} sx={{ borderRadius: 2 }}>
                                    <CardHeader
                                        title="Heart Rate"
                                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                                        avatar={<Avatar sx={{ bgcolor: 'error.main' }}><HeartBrokenIcon /></Avatar>}
                                    />
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                            <Typography variant="h2" color="error.main" sx={{ fontWeight: 'bold' }}>
                                                {healthData.heartRate.current}
                                            </Typography>
                                            <Typography variant="h5" color="text.secondary" sx={{ alignSelf: 'flex-end', mb: 0.5, ml: 1 }}>
                                                BPM
                                            </Typography>
                                        </Box>
                                        <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                                            <Grid item xs={4}>
                                                <Typography variant="body2" color="text.secondary">Min</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                    {healthData.heartRate.min} BPM
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="body2" color="text.secondary">Average</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                    {healthData.heartRate.average} BPM
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="body2" color="text.secondary">Max</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                    {healthData.heartRate.max} BPM
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item>
                                <Card elevation={2} sx={{ borderRadius: 2 }}>
                                    <CardHeader
                                        title="Activity"
                                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                                        avatar={<Avatar sx={{ bgcolor: 'success.main' }}><DirectionsRunIcon /></Avatar>}
                                    />
                                    <CardContent>
                                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                <CircularProgress
                                                    variant="determinate"
                                                    value={100}
                                                    size={140}
                                                    thickness={4}
                                                    sx={{ color: 'grey.200', position: 'absolute' }}
                                                />
                                                <CircularProgress
                                                    variant="determinate"
                                                    value={(healthData.steps.today / healthData.steps.goal) * 100}
                                                    size={140}
                                                    thickness={4}
                                                    sx={{ color: 'success.main' }}
                                                />
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        bottom: 0,
                                                        right: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexDirection: 'column'
                                                    }}
                                                >
                                                    <Typography variant="h4" color="text.primary" sx={{ fontWeight: 'bold' }}>
                                                        {healthData.steps.today.toLocaleString()}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        of {healthData.steps.goal.toLocaleString()} steps
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                This Week: {healthData.steps.week.toLocaleString()} steps
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                Last Updated: {healthData.lastUpdated}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item>
                                <Card elevation={2} sx={{ borderRadius: 2 }}>
                                    <CardHeader
                                        title="Emergency Access"
                                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                                        avatar={<Avatar sx={{ bgcolor: 'error.main' }}><NotificationsActiveIcon /></Avatar>}
                                    />
                                    <CardContent>
                                        <Alert severity="info" sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <InfoIcon sx={{ mr: 1 }} />
                                                <Typography variant="body2">
                                                    When fall detection is triggered, ResQNet will automatically contact your emergency contacts and emergency services if needed.
                                                </Typography>
                                            </Box>
                                        </Alert>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            fullWidth
                                            component={Link}
                                            to="/report-emergency"
                                            sx={{
                                                py: 1.5,
                                                fontWeight: 'bold',
                                                borderRadius: 2,
                                                boxShadow: '0 4px 8px rgba(211, 47, 47, 0.3)',
                                            }}
                                        >
                                            SOS Emergency
                                        </Button>
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

export default WearableDevices; 