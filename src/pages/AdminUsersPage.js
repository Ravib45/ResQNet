import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress,
  Card, CardContent, Grid, Button
} from '@mui/material';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    admin: 0,
    regular: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);
      
      const usersData = [];
      let adminCount = 0;
      let regularCount = 0;
      
      querySnapshot.forEach((doc) => {
        const userData = { id: doc.id, ...doc.data() };
        usersData.push(userData);
        
        // Count by role
        if (userData.isAdmin || userData.role === 'admin') {
          adminCount++;
        } else {
          regularCount++;
        }
      });
      
      setUsers(usersData);
      setStats({
        total: usersData.length,
        admin: adminCount,
        regular: regularCount
      });
      
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
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

  const getRoleChip = (user) => {
    if (user.isAdmin || user.role === 'admin') {
      return <Chip label="Admin" color="primary" size="small" />;
    }
    return <Chip label="User" color="default" size="small" />;
  };

  return (
    <Box sx={{ pt: 10, pb: 6, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            User Management
          </Typography>
          
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: '#e3f2fd' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Admin Users
                  </Typography>
                  <Typography variant="h4" component="div" color="primary.main">
                    {stats.admin}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: '#f1f8e9' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Regular Users
                  </Typography>
                  <Typography variant="h4" component="div" color="success.main">
                    {stats.regular}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Users Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : users.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
              No users found.
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Display Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.id.substring(0, 8)}...</TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>{user.displayName || 'N/A'}</TableCell>
                      <TableCell>{getRoleChip(user)}</TableCell>
                      <TableCell>{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          variant="outlined"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminUsersPage; 