import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, Grid, Card, CardContent, CardMedia,
  Button, CircularProgress, Chip, Divider, CardActions
} from '@mui/material';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FireTruckIcon from '@mui/icons-material/FireTruck';

const AdminHomePage = () => {
  const [loading, setLoading] = useState(true);
  const [serviceStats, setServiceStats] = useState({
    police: { total: 0, pending: 0, recent: [] },
    medical: { total: 0, pending: 0, recent: [] },
    fire: { total: 0, pending: 0, recent: [] }
  });

  useEffect(() => {
    fetchServiceReports();
  }, []);

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
          allReports.push(report);
          
          if (report.status === 'pending') {
            pendingCount++;
          }
        }
      });
      
      // Get the 3 most recent reports
      const recentReports = allReports.slice(0, 3);
      
      console.log(`${type} reports:`, allReports.length, allReports);
      
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
        return <Chip label="Pending" color="warning" size="small" />;
      case 'in-progress':
        return <Chip label="In Progress" color="primary" size="small" />;
      case 'completed':
        return <Chip label="Completed" color="success" size="small" />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  const renderServiceCard = (title, iconComponent, color, bgImage, stats, linkTo) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="div"
        sx={{
          height: 140,
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
            opacity: 0.3,
          }
        }}
      >
        <Box sx={{ position: 'relative', textAlign: 'center', color: 'white' }}>
          {iconComponent}
          <Typography variant="h5" component="div" fontWeight="bold" sx={{ mt: 1 }}>
            {title}
          </Typography>
        </Box>
      </CardMedia>
      
      <CardContent>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Total Reports
            </Typography>
            <Typography variant="h5">
              {stats.total}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
            <Typography variant="h5" color="warning.main">
              {stats.pending}
            </Typography>
          </Grid>
        </Grid>
        
        <Typography variant="subtitle1" gutterBottom>
          Recent Reports
        </Typography>
        
        {stats.recent.length > 0 ? (
          stats.recent.map((report, index) => (
            <Box key={report.id} sx={{ mb: 1 }}>
              {index > 0 && <Divider sx={{ my: 1 }} />}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" noWrap sx={{ maxWidth: '60%' }}>
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
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
            No recent reports
          </Typography>
        )}
      </CardContent>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <CardActions>
        <Button 
          size="small" 
          color="primary" 
          component={Link} 
          to={linkTo}
          sx={{ ml: 'auto' }}
        >
          View All
        </Button>
      </CardActions>
    </Card>
  );

  const policeImage = "https://images.pexels.com/photos/4600666/pexels-photo-4600666.jpeg?auto=compress&cs=tinysrgb&w=1500";
  const medicalImage = "https://images.pexels.com/photos/6862365/pexels-photo-6862365.jpeg?auto=compress&cs=tinysrgb&w=1500";
  const fireImage = "https://images.pexels.com/photos/6012007/pexels-photo-6012007.jpeg?auto=compress&cs=tinysrgb&w=1500";

  return (
    <Box sx={{ pt: 10, pb: 6, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Emergency Services Overview
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
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