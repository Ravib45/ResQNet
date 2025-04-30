import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, Grid, Card, CardContent, CardMedia,
  Button, CircularProgress, Chip, Divider, CardActions, useTheme, alpha
} from '@mui/material';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Same localStorage key used across the admin pages
const LOCAL_STORAGE_KEY = 'resqnet_completed_reports';

const AdminHomePage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [serviceStats, setServiceStats] = useState({
    police: { total: 0, pending: 0, recent: [] },
    medical: { total: 0, pending: 0, recent: [] },
    fire: { total: 0, pending: 0, recent: [] }
  });

  useEffect(() => {
    fetchServiceReports();
  }, []);

  // Get completed reports from localStorage
  const getCompletedReportsFromStorage = () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Error reading completed reports from localStorage:", e);
      return [];
    }
  };

  const fetchServiceReports = async () => {
    try {
      setLoading(true);
      
      // Fetch police reports
      const policeData = await fetchReportsByType('police');
      
      // Fetch medical reports
      const medicalData = await fetchReportsByType('medical');
      
      // Fetch fire reports
      const fireData = await fetchReportsByType('fire');
      
      setServiceStats({
        police: policeData,
        medical: medicalData,
        fire: fireData
      });
      
    } catch (error) {
      console.error("Error fetching service reports:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchReportsByType = async (type) => {
    try {
      const reportsRef = collection(db, 'emergencyReports');
      
      // Fetch all reports and filter client-side
      const q = query(
        reportsRef,
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      // Get completed reports from localStorage
      const completedReports = getCompletedReportsFromStorage();
      const completedReportIds = completedReports.map(report => report.id);
      
      let allReports = [];
      let pendingCount = 0;
      
      querySnapshot.forEach(doc => {
        const report = { id: doc.id, ...doc.data() };
        
        // Handle emergencyType being either an array or string
        const emergencyTypes = Array.isArray(report.emergencyType) 
          ? report.emergencyType 
          : [report.emergencyType];
        
        // Check if any of the emergency types match the current type
        if (emergencyTypes.some(et => et && et.toLowerCase().includes(type.toLowerCase()))) {
          // Check if report is completed (in localStorage)
          const isCompleted = completedReportIds.includes(report.id);
          
          // Update report status based on localStorage
          const updatedReport = {
            ...report,
            status: isCompleted ? 'completed' : 'pending'
          };
          
          allReports.push(updatedReport);
          
          // Count as pending only if not in completed reports
          if (!isCompleted) {
            pendingCount++;
          }
        }
      });
      
      // Get the 3 most recent reports
      const recentReports = allReports.slice(0, 3);
      
      return {
        total: allReports.length,
        pending: pendingCount,
        recent: recentReports
      };
    } catch (error) {
      console.error(`Error fetching ${type} reports:`, error);
      return {
        total: 0,
        pending: 0,
        recent: []
      };
    }
  };

  const formatEmergencyTypes = (types) => {
    if (!types) return 'Unknown';
    
    const typeArray = Array.isArray(types) ? types : [types];
    
    // Map emergency type values to readable labels
    const typeLabels = {
      'medical': 'Medical',
      'police': 'Police',
      'fire': 'Fire'
    };
    
    return typeArray
      .map(type => typeLabels[type] || type)
      .join(', ');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" sx={{ fontWeight: 'bold' }} />;
      case 'in-progress':
        return <Chip label="In Progress" color="primary" size="small" sx={{ fontWeight: 'bold' }} />;
      case 'completed':
        return <Chip label="Completed" color="success" size="small" sx={{ fontWeight: 'bold' }} />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  const renderServiceCard = (title, iconComponent, color, bgImage, stats, linkTo) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 28px rgba(0,0,0,0.18)'
        }
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 160,
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5,
          }
        }}
      >
        <Box sx={{ position: 'relative', textAlign: 'center', color: 'white' }}>
          {iconComponent}
          <Typography variant="h5" component="div" fontWeight="bold" sx={{ mt: 1, textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
            {title}
          </Typography>
        </Box>
      </CardMedia>
      
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Box sx={{ 
              p: 1.5, 
              bgcolor: alpha(theme.palette.primary.main, 0.1), 
              borderRadius: 2,
              textAlign: 'center' 
            }}>
              <Typography variant="body2" color="text.secondary" fontWeight="medium" gutterBottom>
                Total Reports
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.total}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ 
              p: 1.5, 
              bgcolor: alpha(theme.palette.warning.main, 0.1), 
              borderRadius: 2,
              textAlign: 'center' 
            }}>
              <Typography variant="body2" color="text.secondary" fontWeight="medium" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.pending}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <AssessmentIcon sx={{ mr: 1, color: color }} />
          Recent Reports
        </Typography>
        
        {stats.recent.length > 0 ? (
          stats.recent.map((report, index) => (
            <Box key={report.id} sx={{ mb: 1 }}>
              {index > 0 && <Divider sx={{ my: 1.5 }} />}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" noWrap sx={{ maxWidth: '60%', fontWeight: 'medium' }}>
                  {report.name || 'Anonymous'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(report.timestamp)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {report.location || 'Unknown location'}
                </Typography>
                {getStatusChip(report.status)}
              </Box>
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Type: {formatEmergencyTypes(report.emergencyType)}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', p: 2 }}>
            No recent reports
          </Typography>
        )}
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="medium" 
          variant="contained"
          color="primary" 
          component={Link} 
          to={linkTo}
          sx={{ 
            ml: 'auto', 
            borderRadius: 2,
            bgcolor: color,
            '&:hover': {
              bgcolor: alpha(color, 0.8)
            }
          }}
        >
          View All
        </Button>
      </CardActions>
    </Card>
  );

  // Better quality images
  const policeImage = "https://images.unsplash.com/photo-1543523195-ea140fe6b9bb?q=80&w=2070&auto=format&fit=crop";
  const medicalImage = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop";
  const fireImage = "https://images.unsplash.com/photo-1599692392262-37fa67248f04?q=80&w=2070&auto=format&fit=crop";

  // Dashboard background
  const dashboardBg = "https://images.unsplash.com/photo-1530882550103-1a50b9a4a6ae?q=80&w=2070&auto=format&fit=crop";

  return (
    <Box 
      sx={{ 
        pt: 10, 
        pb: 6, 
        minHeight: '100vh',
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${dashboardBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <DashboardIcon sx={{ fontSize: 36, mr: 2, color: theme.palette.primary.main }} />
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight="bold"
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Emergency Services Overview
            </Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : (
            <Grid container spacing={4} sx={{ mt: 2 }}>
              {/* Police Service Card */}
              <Grid item xs={12} md={4}>
                {renderServiceCard(
                  "Police Department",
                  <LocalPoliceIcon sx={{ fontSize: 48 }} />,
                  "#003087",
                  policeImage,
                  serviceStats.police,
                  "/admin?filter=police"
                )}
              </Grid>
              
              {/* Medical Service Card */}
              <Grid item xs={12} md={4}>
                {renderServiceCard(
                  "Medical Services",
                  <LocalHospitalIcon sx={{ fontSize: 48 }} />,
                  "#2e7d32",
                  medicalImage,
                  serviceStats.medical,
                  "/admin?filter=medical"
                )}
              </Grid>
              
              {/* Fire Service Card */}
              <Grid item xs={12} md={4}>
                {renderServiceCard(
                  "Fire Department",
                  <FireTruckIcon sx={{ fontSize: 48 }} />,
                  "#d32f2f",
                  fireImage,
                  serviceStats.fire,
                  "/admin?filter=fire"
                )}
              </Grid>
            </Grid>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminHomePage; 