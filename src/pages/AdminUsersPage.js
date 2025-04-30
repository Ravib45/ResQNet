import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress,
  Card, CardContent, Grid, Button, useTheme, alpha
} from '@mui/material';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AdminUsersPage = () => {
  const theme = useTheme();
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
      return <Chip 
        label="Admin" 
        color="primary" 
        size="small" 
        icon={<AdminPanelSettingsIcon />}
        sx={{ fontWeight: 'bold', pl: 0.5 }} 
      />;
    }
    return <Chip 
      label="User" 
      color="default" 
      size="small" 
      icon={<PersonIcon />}
      sx={{ fontWeight: 'bold', pl: 0.5 }} 
    />;
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
            <PeopleIcon sx={{ fontSize: 36, mr: 2, color: theme.palette.primary.main }} />
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
              User Management
            </Typography>
          </Box>
          
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                background: alpha(theme.palette.grey[500], 0.1),
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PeopleIcon sx={{ color: theme.palette.grey[800], fontSize: 32, mr: 1 }} />
                    <Typography color="textSecondary" fontWeight="medium">
                      Total Users
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {stats.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                background: alpha(theme.palette.primary.main, 0.1),
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AdminPanelSettingsIcon sx={{ color: theme.palette.primary.main, fontSize: 32, mr: 1 }} />
                    <Typography color="textSecondary" fontWeight="medium">
                      Admin Users
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div" fontWeight="bold" color="primary.main">
                    {stats.admin}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                background: alpha(theme.palette.success.main, 0.1),
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ color: theme.palette.success.main, fontSize: 32, mr: 1 }} />
                    <Typography color="textSecondary" fontWeight="medium">
                      Regular Users
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                    {stats.regular}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Users Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : users.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', p: 4, fontStyle: 'italic' }}>
              No users found.
            </Typography>
          ) : (
            <TableContainer 
              component={Paper} 
              elevation={3}
              sx={{ 
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    bgcolor: theme.palette.primary.main,
                  }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Display Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow 
                      key={user.id} 
                      hover
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.03),
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 'medium' }}>{user.id.substring(0, 8)}...</TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>{user.displayName || 'N/A'}</TableCell>
                      <TableCell>{getRoleChip(user)}</TableCell>
                      <TableCell>{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          variant="contained"
                          startIcon={<VisibilityIcon />}
                          sx={{ 
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          }}
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