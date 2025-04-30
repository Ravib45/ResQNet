import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress,
  Card, CardContent, Grid, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, Snackbar, Alert, Fade
} from '@mui/material';
import { useLocation } from 'react-router-dom';

// Use the same localStorage key as in AdminPage
const LOCAL_STORAGE_KEY = 'resqnet_completed_reports';

const CompletedReportsPage = () => {
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
      } else {
        // For other formats
        date = new Date(timestamp);
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid date';
    }
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
        return <Chip label={status || 'Unknown'} size="small" />;
    }
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

  return (
    <Box sx={{ pt: 10, pb: 6, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Completed Emergency Reports
          </Typography>
          
          {/* Stats Card */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Card sx={{ bgcolor: '#e8f5e9' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Completed Reports
                  </Typography>
                  <Typography variant="h4" component="div" color="success.main">
                    {reports.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Reports Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : reports.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
              No completed emergency reports found.
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Reported By</TableCell>
                    <TableCell>Reported On</TableCell>
                    <TableCell>Completed On</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <Fade in={true} key={report.id} timeout={isRecentlyCompleted(report.id) ? 800 : 0}>
                      <TableRow 
                        hover
                        sx={isRecentlyCompleted(report.id) ? {
                          backgroundColor: 'rgba(46, 125, 50, 0.1)',
                          transition: 'background-color 1s ease'
                        } : {}}
                      >
                        <TableCell>{report.id.substring(0, 8)}...</TableCell>
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
                                sx={{ ml: 1, animation: 'pulse 2s infinite' }}
                              />
                            </Box>
                          ) : (
                            getCompletedDate(report)
                          )}
                        </TableCell>
                        <TableCell>{report.location || 'Unknown'}</TableCell>
                        <TableCell>{getStatusChip(report.status)}</TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => handleViewReport(report)}
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
        </Paper>
      </Container>
      
      {/* Report Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedReport && (
          <>
            <DialogTitle>
              Completed Emergency Report Details
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">ID</Typography>
                  <Typography variant="body1" gutterBottom>{selectedReport.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Typography variant="body1" gutterBottom>{getStatusChip(selectedReport.status)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Emergency Type</Typography>
                  <Typography variant="body1" gutterBottom>{formatEmergencyType(selectedReport.emergencyType)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Reported On</Typography>
                  <Typography variant="body1" gutterBottom>{formatDate(selectedReport.timestamp)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Reported By</Typography>
                  <Typography variant="body1" gutterBottom>{selectedReport.name || 'Anonymous'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Contact</Typography>
                  <Typography variant="body1" gutterBottom>{selectedReport.contactNumber || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                  <Typography variant="body1" gutterBottom>{selectedReport.location || 'Unknown'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedReport.description || 'No description provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Completed On</Typography>
                  <Typography variant="body1" gutterBottom color="success.main">
                    {getCompletedDate(selectedReport)}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {/* Add some animation styles */}
      <style jsx="true">{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default CompletedReportsPage; 