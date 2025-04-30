import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress,
  Card, CardContent, Grid, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, Snackbar, Alert, Stack, useTheme, alpha
} from '@mui/material';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import ReportIcon from '@mui/icons-material/Report';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import AssessmentIcon from '@mui/icons-material/Assessment';

const LOCAL_STORAGE_KEY = 'resqnet_completed_reports';

const AdminPage = () => {
  const theme = useTheme();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [updatingReport, setUpdatingReport] = useState(null);
  const [successDialog, setSuccessDialog] = useState({
    open: false,
    reportId: null
  });
  const [visuallyUpdated, setVisuallyUpdated] = useState({});
  const navigate = useNavigate();

  // Get completed reports from localStorage
  const getCompletedReports = () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Error reading from localStorage", e);
      return [];
    }
  };

  // Save a completed report to localStorage
  const saveCompletedReport = (report) => {
    try {
      const completedReports = getCompletedReports();
      const reportWithTimestamp = {
        ...report,
        status: 'completed',
        completedAt: new Date().toISOString()
      };
      
      // Check if already exists
      if (!completedReports.some(r => r.id === report.id)) {
        const updated = [...completedReports, reportWithTimestamp];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      
      return reportWithTimestamp;
    } catch (e) {
      console.error("Error saving to localStorage", e);
      return { ...report, status: 'completed' };
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const reportsRef = collection(db, 'emergencyReports');
      const q = query(reportsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const reportsData = [];
      let pending = 0;
      let inProgress = 0;
      let completed = 0;
      
      // Get locally completed reports
      const completedReports = getCompletedReports();
      const completedIds = new Set(completedReports.map(r => r.id));
      
      querySnapshot.forEach((doc) => {
        // Store both the Firestore document ID and the report's internal ID if it exists
        const reportData = { 
          id: doc.id,  // This is the Firestore document ID
          firestoreId: doc.id, // Store explicitly for clarity
          ...doc.data() 
        };
        
        // Check if report is in completed list
        if (completedIds.has(reportData.id)) {
          const completedReport = completedReports.find(r => r.id === reportData.id);
          reportData.status = 'completed';
          reportData.completedAt = completedReport.completedAt;
        }
        
        reportsData.push(reportData);
        
        // Count by status (after applying local completed status)
        if (reportData.status === 'pending') pending++;
        else if (reportData.status === 'in-progress') inProgress++;
        else if (reportData.status === 'completed') completed++;
      });
      
      setReports(reportsData);
      setStats({
        total: reportsData.length,
        pending,
        inProgress,
        completed
      });
      
    } catch (error) {
      console.error("Error fetching reports:", error);
      setSnackbar({
        open: true,
        message: 'Failed to load reports. Please try again.',
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

  const handleMarkAsCompleted = (reportId) => {
    try {
      setUpdatingReport(reportId);
      
      // Get the current report data
      const report = reports.find(r => r.id === reportId);
      if (!report) {
        throw new Error("Report not found");
      }
      
      // Mark as visually completed immediately
      setVisuallyUpdated(prev => ({
        ...prev,
        [reportId]: 'completed'
      }));
      
      // Save to localStorage with forced completed status
      const completedReport = saveCompletedReport({
        ...report,
        status: 'completed' // Force status to completed in both places
      });
      
      // Update local state
      const updatedReports = reports.map(r => {
        if (r.id === reportId) {
          return { 
            ...r, 
            status: 'completed',
            completedAt: completedReport.completedAt
          };
        }
        return r;
      });
      
      setReports(updatedReports);
      
      // Update statistics
      setStats(prev => ({
        ...prev,
        pending: prev.pending - (report.status === 'pending' ? 1 : 0),
        inProgress: prev.inProgress - (report.status === 'in-progress' ? 1 : 0),
        completed: prev.completed + 1
      }));
      
      // Update selected report if in dialog
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport({ 
          ...selectedReport, 
          status: 'completed',
          completedAt: completedReport.completedAt
        });
      }
      
      // Show success dialog
      setSuccessDialog({
        open: true,
        reportId: reportId
      });
      
    } catch (error) {
      // If error occurs, revert the visual update
      setVisuallyUpdated(prev => {
        const newState = { ...prev };
        delete newState[reportId];
        return newState;
      });
      
      console.error("Error marking report as completed:", error);
      setSnackbar({
        open: true,
        message: `Failed to mark as completed: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setUpdatingReport(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEffectiveStatus = (report) => {
    if (visuallyUpdated[report.id]) {
      return visuallyUpdated[report.id];
    }
    return report.status;
  };

  const getStatusChip = (report) => {
    const status = typeof report === 'string' ? report : getEffectiveStatus(report);
    
    switch (status) {
      case 'pending':
        return <Chip 
          label="Pending" 
          color="warning" 
          size="small" 
          icon={<PendingIcon />}
          sx={{ fontWeight: 'bold', pl: 0.5 }}
        />;
      case 'in-progress':
        return <Chip 
          label="In Progress" 
          color="primary" 
          size="small" 
          sx={{ fontWeight: 'bold' }}
        />;
      case 'completed':
        return <Chip 
          label="Completed" 
          color="success" 
          size="small" 
          icon={<CheckCircleIcon />}
          sx={{ fontWeight: 'bold', pl: 0.5 }}
        />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
  };

  const renderActionButtons = (report) => {
    const isUpdating = updatingReport === report.id;
    const effectiveStatus = getEffectiveStatus(report);
    
    if (effectiveStatus === 'completed') {
      return (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            size="small" 
            variant="outlined"
            color="primary"
            startIcon={<VisibilityIcon />}
            onClick={() => handleViewReport(report)}
            sx={{ borderRadius: 2 }}
          >
            View
          </Button>
        </Box>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button 
          size="small" 
          variant="outlined"
          color="primary"
          startIcon={<VisibilityIcon />}
          onClick={() => handleViewReport(report)}
          sx={{ borderRadius: 2 }}
        >
          View
        </Button>
        <Button 
          size="small" 
          variant="contained"
          color="success"
          startIcon={<DoneIcon />}
          onClick={() => handleMarkAsCompleted(report.id)}
          disabled={isUpdating}
          sx={{ borderRadius: 2 }}
        >
          Service Provided
        </Button>
      </Box>
    );
  };

  const formatEmergencyType = (type) => {
    if (!type) return 'Unknown';
    
    if (Array.isArray(type)) {
      return type.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ');
    }
    
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getReportById = (reportId) => {
    return reports.find(r => r.id === reportId);
  };

  const handleViewCompletedReports = () => {
    navigate('/completed-reports');
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialog({
      open: false,
      reportId: null
    });
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
            <AssessmentIcon sx={{ fontSize: 36, mr: 2, color: theme.palette.primary.main }} />
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
              Emergency Reports
            </Typography>
          </Box>
          
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
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
                    <ReportIcon sx={{ color: theme.palette.grey[700], fontSize: 32, mr: 1 }} />
                    <Typography color="textSecondary" fontWeight="medium">
                      Total Reports
                    </Typography>
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="bold">
                    {stats.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                background: alpha(theme.palette.warning.main, 0.1),
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PendingIcon sx={{ color: theme.palette.warning.main, fontSize: 32, mr: 1 }} />
                    <Typography color="textSecondary" fontWeight="medium">
                      Pending
                    </Typography>
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="bold" color="warning.main">
                    {stats.pending}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
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
                    <PendingIcon sx={{ color: theme.palette.primary.main, fontSize: 32, mr: 1 }} />
                    <Typography color="textSecondary" fontWeight="medium">
                      In Progress
                    </Typography>
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="bold" color="primary.main">
                    {stats.inProgress}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
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
                    <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 32, mr: 1 }} />
                    <Typography color="textSecondary" fontWeight="medium">
                      Completed
                    </Typography>
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="bold" color="success.main">
                    {stats.completed}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Reports Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
              <CircularProgress size={60} thickness={4} />
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
                No emergency reports found.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New emergency reports will appear here when submitted by users.
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
                  <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => {
                    const effectiveStatus = getEffectiveStatus(report);
                    return (
                      <TableRow 
                        key={report.id} 
                        hover
                        sx={{
                          bgcolor: effectiveStatus === 'completed' 
                            ? alpha(theme.palette.success.main, 0.05)
                            : 'inherit',
                          '&:nth-of-type(odd)': {
                            backgroundColor: effectiveStatus === 'completed'
                              ? alpha(theme.palette.success.light, 0.1)
                              : alpha(theme.palette.primary.main, 0.03),
                          },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 'medium' }}>
                          {report.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {formatEmergencyType(report.emergencyType)}
                        </TableCell>
                        <TableCell>
                          {report.name || 'Anonymous'}
                        </TableCell>
                        <TableCell>
                          {formatDate(report.timestamp)}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography noWrap>
                            {report.location || 'Unknown'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {getStatusChip(report)}
                        </TableCell>
                        <TableCell>
                          {renderActionButtons(report)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                <DialogTitle 
                  sx={{ 
                    bgcolor: getEffectiveStatus(selectedReport) === 'completed' ? theme.palette.success.main : theme.palette.primary.main,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '12px 12px 0 0',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ReportIcon sx={{ mr: 1 }} />
                    Emergency Report Details
                  </Box>
                  {getStatusChip(selectedReport)}
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
                    
                    {selectedReport.status === 'completed' && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Completed On
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium', color: theme.palette.success.main }}>
                          {formatDate(selectedReport.completedAt)}
                        </Typography>
                      </Grid>
                    )}
                    
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
                  
                  {getEffectiveStatus(selectedReport) !== 'completed' && (
                    <Button 
                      startIcon={<DoneIcon />}
                      onClick={() => {
                        handleMarkAsCompleted(selectedReport.id);
                        setDialogOpen(false);
                      }} 
                      variant="contained"
                      color="success"
                      sx={{ borderRadius: 2 }}
                    >
                      Mark as Completed
                    </Button>
                  )}
                </DialogActions>
              </>
            )}
          </Dialog>
          
          {/* Success Dialog */}
          <Dialog
            open={successDialog.open}
            onClose={handleCloseSuccessDialog}
            PaperProps={{
              sx: {
                borderRadius: 3,
                p: 1
              }
            }}
          >
            <DialogTitle 
              sx={{ 
                bgcolor: theme.palette.success.main, 
                color: 'white',
                borderRadius: '12px 12px 0 0',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <CheckCircleIcon sx={{ mr: 1 }} />
              Service Successfully Provided
            </DialogTitle>
            <DialogContent sx={{ pt: 3, pb: 2 }}>
              <Typography variant="body1">
                The emergency report has been marked as completed. Thank you for providing the service!
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button 
                onClick={handleCloseSuccessDialog}
                variant="outlined"
                color="success"
                sx={{ borderRadius: 2 }}
              >
                OK
              </Button>
            </DialogActions>
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

export default AdminPage; 