import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, Grid, Card, CardContent,
  CircularProgress, Divider
} from '@mui/material';
import { collection, query, getDocs, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase';

const AdminDashboardPage = () => {
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

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get users count
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getCountFromServer(usersRef);
      const usersCount = usersSnapshot.data().count;
      
      // Get reports counts
      const reportsRef = collection(db, 'emergencyReports');
      const reportsSnapshot = await getCountFromServer(reportsRef);
      const reportsCount = reportsSnapshot.data().count;
      
      // Get pending reports count
      const pendingReportsRef = query(reportsRef, where('status', '==', 'pending'));
      const pendingSnapshot = await getCountFromServer(pendingReportsRef);
      const pendingCount = pendingSnapshot.data().count;
      
      // Get completed reports count
      const completedReportsRef = query(reportsRef, where('status', '==', 'completed'));
      const completedSnapshot = await getCountFromServer(completedReportsRef);
      const completedCount = completedSnapshot.data().count;
      
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

  return (
    <Box sx={{ pt: 10, pb: 6, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                System Overview
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                  <Card sx={{ bgcolor: '#e8f5e9' }}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Users
                      </Typography>
                      <Typography variant="h3" component="div">
                        {stats.totalUsers}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                  <Card sx={{ bgcolor: '#e3f2fd' }}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Reports
                      </Typography>
                      <Typography variant="h3" component="div">
                        {stats.totalReports}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                  <Card sx={{ bgcolor: '#fff8e1' }}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Pending Reports
                      </Typography>
                      <Typography variant="h3" component="div" color="warning.main">
                        {stats.pendingReports}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                  <Card sx={{ bgcolor: '#e8f5e9' }}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Completed Reports
                      </Typography>
                      <Typography variant="h3" component="div" color="success.main">
                        {stats.completedReports}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                System Status
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Server Status
                      </Typography>
                      <Typography variant="h5" component="div" color="success.main">
                        Online
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Database
                      </Typography>
                      <Typography variant="h5" component="div" color="success.main">
                        Connected
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Last Update
                      </Typography>
                      <Typography variant="h5" component="div">
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