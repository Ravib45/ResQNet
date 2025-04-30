import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, Grid, Card, CardContent,
  CircularProgress, Divider, useTheme, alpha
} from '@mui/material';
import { collection, query, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import StorageIcon from '@mui/icons-material/Storage';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import UpdateIcon from '@mui/icons-material/Update';

// Use the same localStorage key as in other pages
const LOCAL_STORAGE_KEY = 'resqnet_completed_reports';

const AdminDashboardPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    pendingReports: 0,
    completedReports: 0
  });

  useEffect(() => {
    fetchStats();
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

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get users count
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getCountFromServer(usersRef);
      const usersCount = usersSnapshot.data().count;
      
      // Get total reports count
      const reportsRef = collection(db, 'emergencyReports');
      const reportsSnapshot = await getCountFromServer(reportsRef);
      const reportsCount = reportsSnapshot.data().count;
      
      // Get completed reports from localStorage
      const completedReports = getCompletedReportsFromStorage();
      const completedCount = completedReports.length;
      
      // Calculate pending as total minus completed
      const pendingCount = reportsCount - completedCount;
      
      setStats({
        totalUsers: usersCount,
        totalReports: reportsCount,
        pendingReports: pendingCount,
        completedReports: completedCount
      });
      
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

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
              Admin Dashboard
            </Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : (
            <>
              <Typography 
                variant="h6" 
                sx={{ 
                  mt: 3, 
                  mb: 3, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 'bold' 
                }}
              >
                <AssignmentIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                System Overview
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                  <Card sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PeopleIcon sx={{ color: theme.palette.success.light, fontSize: 32, mr: 1 }} />
                        <Typography color="textSecondary" fontWeight="medium">
                          Total Users
                        </Typography>
                      </Box>
                      <Typography variant="h3" component="div" fontWeight="bold">
                        {stats.totalUsers}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                  <Card sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AssignmentIcon sx={{ color: theme.palette.primary.light, fontSize: 32, mr: 1 }} />
                        <Typography color="textSecondary" fontWeight="medium">
                          Total Reports
                        </Typography>
                      </Box>
                      <Typography variant="h3" component="div" fontWeight="bold">
                        {stats.totalReports}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                  <Card sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <HourglassEmptyIcon sx={{ color: theme.palette.warning.main, fontSize: 32, mr: 1 }} />
                        <Typography color="textSecondary" fontWeight="medium">
                          Pending Reports
                        </Typography>
                      </Box>
                      <Typography variant="h3" component="div" fontWeight="bold" color="warning.main">
                        {stats.pendingReports}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                  <Card sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 32, mr: 1 }} />
                        <Typography color="textSecondary" fontWeight="medium">
                          Completed Reports
                        </Typography>
                      </Box>
                      <Typography variant="h3" component="div" fontWeight="bold" color="success.main">
                        {stats.completedReports}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 'bold' 
                }}
              >
                <StorageIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                System Status
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    background: alpha(theme.palette.success.main, 0.05),
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CloudDoneIcon sx={{ color: theme.palette.success.main, fontSize: 32, mr: 1 }} />
                        <Typography color="textSecondary" fontWeight="medium">
                          Server Status
                        </Typography>
                      </Box>
                      <Typography variant="h5" component="div" color="success.main" fontWeight="bold">
                        Online
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    background: alpha(theme.palette.success.main, 0.05),
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <StorageIcon sx={{ color: theme.palette.success.main, fontSize: 32, mr: 1 }} />
                        <Typography color="textSecondary" fontWeight="medium">
                          Database
                        </Typography>
                      </Box>
                      <Typography variant="h5" component="div" color="success.main" fontWeight="bold">
                        Connected
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    background: alpha(theme.palette.primary.main, 0.05),
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <UpdateIcon sx={{ color: theme.palette.primary.main, fontSize: 32, mr: 1 }} />
                        <Typography color="textSecondary" fontWeight="medium">
                          Last Update
                        </Typography>
                      </Box>
                      <Typography variant="h5" component="div" fontWeight="bold">
                        {new Date().toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboardPage; 