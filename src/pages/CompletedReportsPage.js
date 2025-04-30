import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress,
  Card, CardContent, Grid, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, Snackbar, Alert, Fade, useTheme, alpha
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

// Use the same localStorage key as in AdminPage
const LOCAL_STORAGE_KEY = 'resqnet_completed_reports';

const CompletedReportsPage = () => {
  const theme = useTheme();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  // Track newly completed reports for highlighting
  const [recentlyCompleted, setRecentlyCompleted] = useState([]);
  const location = useLocation();

  // Check if we just came from marking a report as completed
  useEffect(() => {
    // Extract any report ID passed through location state
    if (location.state && location.state.fromServiceProvided) {
      setSnackbar({
        open: true,
        message: 'Report has been marked as completed',
        severity: 'success'
      });
    }
  }, [location]);

  useEffect(() => {
    fetchCompletedReports();
  }, []);

  const fetchCompletedReports = () => {
    try {
      setLoading(true);
      
      // Get completed reports from localStorage
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      let completedReports = [];
      
      if (stored) {
        completedReports = JSON.parse(stored);
      }
      
      // Sort by completion date (newest first)
      completedReports.sort((a, b) => {
        const dateA = a.completedAt ? new Date(a.completedAt) : new Date(0);
        const dateB = b.completedAt ? new Date(b.completedAt) : new Date(0);
        return dateB - dateA;
      });
      
      const newlyCompleted = [];
      
      // Get current time for checking recently completed reports (within last hour)
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      // Mark reports completed in the last hour
      completedReports.forEach(report => {
        if (report.completedAt) {
          const completedTime = new Date(report.completedAt);
          if (completedTime > oneHourAgo) {
            newlyCompleted.push(report.id);
          }
        }
      });
      
      setReports(completedReports);
      setRecentlyCompleted(newlyCompleted);
      
    } catch (error) {
      console.error("Error fetching completed reports:", error);
      setSnackbar({
        open: true,
        message: 'Failed to load completed reports. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    try {
      let date;
      if (timestamp.toDate) {
        // For Firestore timestamps
        date = timestamp.toDate();
      } else if (typeof timestamp === 'string') {
        // For ISO string dates
        date = new Date(timestamp);
      } else if (timestamp.seconds && timestamp.nanoseconds) {
        // For Firestore timestamp objects
        date = new Date(timestamp.seconds * 1000);
      } else {
        // For other formats
        date = new Date(timestamp);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Error formatting date:", e, timestamp);
      return 'Invalid Date';
    }
  };

  // Get status chip - always show "Completed" in the Completed Reports page
  const getStatusChip = () => {
    // Always return a completed chip regardless of the actual status
    return <Chip 
      label="Completed" 
      color="success" 
      size="small"
      icon={<CheckCircleIcon />}
      sx={{ fontWeight: 'bold', pl: 0.5 }}
    />;
  };

  // Format emergencyType for display
  const formatEmergencyType = (type) => {
    if (!type) return 'Unknown';
    
    if (Array.isArray(type)) {
      return type.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ');
    }
    
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Get completed date in a readable format
  const getCompletedDate = (report) => {
    if (!report.completedAt) return 'Unknown';
    return formatDate(report.completedAt);
  };

  // Check if report was recently completed
  const isRecentlyCompleted = (reportId) => {
    return recentlyCompleted.includes(reportId);
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
            <DoneAllIcon sx={{ fontSize: 36, mr: 2, color: theme.palette.success.main }} />
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight="bold"
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Completed Emergency Reports
            </Typography>
          </Box>
          
          {/* Stats Card */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                background: alpha(theme.palette.success.main, 0.1),
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" fontWeight="medium" gutterBottom>
                      Total Completed Reports
                    </Typography>
                    <Typography variant="h3" component="div" fontWeight="bold" color="success.main">
                      {reports.length}
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ fontSize: 60, color: alpha(theme.palette.success.main, 0.3) }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Reports Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
              <CircularProgress size={60} thickness={4} color="success" />
            </Box>
          ) : reports.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              p: 6, 
              borderRadius: 3, 
              border: `2px dashed ${alpha(theme.palette.text.secondary, 0.2)}`,
              bgcolor: alpha(theme.palette.background.paper, 0.5),
            }}>
              <Typography variant="h6" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                No completed emergency reports found.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed reports will appear here after services have been provided.
              </Typography>
            </Box>
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
                    bgcolor: theme.palette.success.main,
                  }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reported By</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reported On</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Completed On</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <Fade in={true} key={report.id} timeout={isRecentlyCompleted(report.id) ? 800 : 0}>
                      <TableRow 
                        hover
                        sx={{
                          ...(isRecentlyCompleted(report.id) ? {
                            backgroundColor: alpha(theme.palette.success.light, 0.15),
                            transition: 'background-color 1s ease'
                          } : {}),
                          '&:nth-of-type(odd)': {
                            backgroundColor: isRecentlyCompleted(report.id) 
                              ? alpha(theme.palette.success.light, 0.15)
                              : alpha(theme.palette.success.main, 0.03),
                          },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 'medium' }}>{report.id.substring(0, 8)}...</TableCell>
                        <TableCell>{formatEmergencyType(report.emergencyType)}</TableCell>
                        <TableCell>{report.name || 'Anonymous'}</TableCell>
                        <TableCell>{formatDate(report.timestamp)}</TableCell>
                        <TableCell>
                          {isRecentlyCompleted(report.id) ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getCompletedDate(report)}
                              <Chip 
                                label="New" 
                                color="success" 
                                size="small" 
                                variant="outlined"
                                icon={<NewReleasesIcon />}
                                sx={{ 
                                  ml: 1, 
                                  fontWeight: 'bold',
                                  animation: 'pulse 1.5s infinite',
                                  '@keyframes pulse': {
                                    '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)' },
                                    '70%': { boxShadow: '0 0 0 6px rgba(76, 175, 80, 0)' },
                                    '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' }
                                  }
                                }}
                              />
                            </Box>
                          ) : (
                            getCompletedDate(report)
                          )}
                        </TableCell>
                        <TableCell>{report.location || 'Unknown'}</TableCell>
                        <TableCell>{getStatusChip()}</TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            variant="contained"
                            color="success"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewReport(report)}
                            sx={{ 
                              borderRadius: 2,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          {/* View Report Dialog */}
          <Dialog 
            open={dialogOpen} 
            onClose={() => setDialogOpen(false)}
            maxWidth="md"
            PaperProps={{
              sx: {
                borderRadius: 3,
                p: 1
              }
            }}
          >
            {selectedReport && (
              <>
                <DialogTitle sx={{ 
                  bgcolor: theme.palette.success.main, 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '12px 12px 0 0',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DoneAllIcon sx={{ mr: 1 }} />
                    Completed Report Details
                  </Box>
                  <Chip 
                    label="Completed" 
                    color="success" 
                    variant="outlined"
                    sx={{ 
                      color: 'white', 
                      borderColor: 'white',
                      fontWeight: 'bold',
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                    icon={<CheckCircleIcon />}
                  />
                </DialogTitle>
                
                <DialogContent dividers sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Report ID
                      </Typography>
                      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
                        {selectedReport.id}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Emergency Type
                      </Typography>
                      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
                        {formatEmergencyType(selectedReport.emergencyType)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Reported By
                      </Typography>
                      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
                        {selectedReport.name || 'Anonymous'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Contact Number
                      </Typography>
                      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
                        {selectedReport.phone || 'N/A'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Reported On
                      </Typography>
                      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
                        {formatDate(selectedReport.timestamp)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Completed On
                      </Typography>
                      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium', color: theme.palette.success.main }}>
                        {getCompletedDate(selectedReport)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
                        {selectedReport.location || 'Unknown'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Description
                      </Typography>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          mt: 1, 
                          bgcolor: alpha(theme.palette.background.paper, 0.5),
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="body1">
                          {selectedReport.description || 'No description provided.'}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </DialogContent>
                
                <DialogActions sx={{ p: 2 }}>
                  <Button 
                    startIcon={<CloseIcon />}
                    onClick={() => setDialogOpen(false)} 
                    variant="outlined"
                    color="inherit"
                    sx={{ borderRadius: 2 }}
                  >
                    Close
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
          
          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbar.severity} 
              variant="filled"
              sx={{ width: '100%', boxShadow: 3 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </Box>
  );
};

export default CompletedReportsPage; 