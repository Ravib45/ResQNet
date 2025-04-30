import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress,
  Card, CardContent, Grid, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, Snackbar, Alert, Stack
} from '@mui/material';
import { collection, query, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const AdminPage = () => {
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
      
      querySnapshot.forEach((doc) => {
        const reportData = { 
          id: doc.id,
          firestoreId: doc.id,
          ...doc.data() 
        };
        
        console.log("Fetched report:", reportData.id, "with data:", reportData);
        
        reportsData.push(reportData);
        
        // Count by status
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

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      setUpdatingReport(reportId);
      
      // Get the current report data first to ensure we maintain all fields
      const report = reports.find(r => r.id === reportId);
      if (!report) {
        throw new Error("Report not found");
      }
      
      // Use the Firestore document ID, not the report's internal ID
      const firestoreDocId = report.firestoreId || report.id;
      console.log("Firestore Document ID:", firestoreDocId);
      
      const reportRef = doc(db, 'emergencyReports', firestoreDocId);
      
      // Create update data with only the fields that should change
      const updateData = { 
        status: newStatus,
      };
      
      // Add completion timestamp if marking as completed
      if (newStatus === 'completed') {
        updateData.completedAt = new Date().toISOString();
      }
      
      console.log("Updating report with Firestore ID:", firestoreDocId, "with data:", updateData);
      
      // Update the document with only the changed fields
      await updateDoc(reportRef, updateData);
      
      // Update local state
      const updatedReports = reports.map(r => {
        if (r.id === reportId) {
          return { ...r, ...updateData };
        }
        return r;
      });
      
      setReports(updatedReports);
      
      // Update statistics
      const newStats = { ...stats };
      
      // Find current report to get its previous status
      if (report) {
        const oldStatus = report.status;
        
        // Decrement old status count
        if (oldStatus === 'pending') newStats.pending--;
        else if (oldStatus === 'in-progress') newStats.inProgress--;
        else if (oldStatus === 'completed') newStats.completed--;
        
        // Increment new status count
        if (newStatus === 'pending') newStats.pending++;
        else if (newStatus === 'in-progress') newStats.inProgress++;
        else if (newStatus === 'completed') newStats.completed++;
      }
      
      setStats(newStats);
      
      // Update selected report if in dialog
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport({ ...selectedReport, ...updateData });
      }
      
      // Show success dialog if report was marked as completed
      if (newStatus === 'completed') {
        setSuccessDialog({
          open: true,
          reportId: reportId
        });
      } else {
        // Otherwise just show a snackbar
        setSnackbar({
          open: true,
          message: `Report marked as ${newStatus}`,
          severity: 'success'
        });
      }
      
    } catch (error) {
      console.error("Error updating report status:", error, "for report ID:", reportId);
      setSnackbar({
        open: true,
        message: `Failed to update report status: ${error.message}`,
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

  const renderActionButtons = (report) => {
    const isUpdating = updatingReport === report.id;
    const reportFirestoreId = report.firestoreId || report.id;
    
    if (report.status === 'completed') {
      return (
        <Stack direction="row" spacing={1}>
          <Button 
            size="small" 
            variant="outlined"
            onClick={() => handleViewReport(report)}
          >
            View
          </Button>
        </Stack>
      );
    }
    
    return (
      <Stack direction="row" spacing={1}>
        <Button 
          size="small" 
          variant="outlined"
          onClick={() => handleViewReport(report)}
          disabled={isUpdating}
        >
          View
        </Button>
        <Button 
          size="small" 
          variant="contained"
          color="success"
          onClick={() => handleUpdateStatus(reportFirestoreId, 'completed')}
          disabled={isUpdating}
        >
          Service Provided
        </Button>
      </Stack>
    );
  };

  // Format emergencyType for display
  const formatEmergencyType = (type) => {
    if (!type) return 'Unknown';
    
    if (Array.isArray(type)) {
      return type.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ');
    }
    
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Add a function to find the report by ID
  const getReportById = (reportId) => {
    return reports.find(r => r.id === reportId);
  };

  return (
    <Box sx={{ pt: 10, pb: 6, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Emergency Reports Dashboard
          </Typography>
          
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Reports
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#fff8e1' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h4" component="div" color="warning.main">
                    {stats.pending}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#e3f2fd' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    In Progress
                  </Typography>
                  <Typography variant="h4" component="div" color="primary.main">
                    {stats.inProgress}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#e8f5e9' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h4" component="div" color="success.main">
                    {stats.completed}
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
              No emergency reports found.
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Reported By</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell>
                        {report.reportId ? 
                          report.reportId.substring(0, 8) + '...' : 
                          report.id.substring(0, 8) + '...'}
                      </TableCell>
                      <TableCell>{formatEmergencyType(report.emergencyType)}</TableCell>
                      <TableCell>{report.name || 'Anonymous'}</TableCell>
                      <TableCell>{formatDate(report.timestamp)}</TableCell>
                      <TableCell>{report.location || 'Unknown'}</TableCell>
                      <TableCell>{getStatusChip(report.status)}</TableCell>
                      <TableCell>
                        {renderActionButtons(report)}
                      </TableCell>
                    </TableRow>
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
              Emergency Report Details
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">ID</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedReport.reportId || selectedReport.id}
                  </Typography>
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
                {selectedReport.completedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">Completed On</Typography>
                    <Typography variant="body1" gutterBottom>{new Date(selectedReport.completedAt).toLocaleString()}</Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              {selectedReport.status !== 'completed' && (
                <Button 
                  color="success" 
                  variant="contained"
                  onClick={() => {
                    const firestoreId = selectedReport.firestoreId || selectedReport.id;
                    handleUpdateStatus(firestoreId, 'completed');
                    setDialogOpen(false);
                  }}
                  disabled={updatingReport === selectedReport.id}
                >
                  Mark Service Provided
                </Button>
              )}
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Service Provided Success Dialog */}
      <Dialog
        open={successDialog.open}
        onClose={() => setSuccessDialog({ open: false, reportId: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'success.light', color: 'white' }}>
          Service Provided Successfully
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: 'success.light', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 2
            }}>
              <Typography variant="h3" color="white">✓</Typography>
            </Box>
            <Typography variant="h6" gutterBottom align="center">
              Emergency Service Successfully Provided
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" paragraph>
              The emergency report has been marked as completed and moved to the Completed tab.
            </Typography>
            {successDialog.reportId && (
              <Box sx={{ mt: 2, width: '100%' }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Report Details:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        ID: {
                          (getReportById(successDialog.reportId)?.reportId || 
                          successDialog.reportId.substring(0, 8) + '...')
                        }
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Type: {getReportById(successDialog.reportId) && 
                              formatEmergencyType(getReportById(successDialog.reportId).emergencyType)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Reported By: {getReportById(successDialog.reportId)?.name || 'Anonymous'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Status: <Chip label="Completed" color="success" size="small" />
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            component={Link} 
            to={{ 
              pathname: "/admin/completed",
              state: { 
                fromServiceProvided: true,
                reportId: successDialog.reportId 
              }
            }} 
            color="primary"
            variant="outlined"
          >
            View in Completed Reports
          </Button>
          <Button 
            onClick={() => setSuccessDialog({ open: false, reportId: null })}
            variant="contained"
            color="primary"
          >
            Continue
          </Button>
        </DialogActions>
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
    </Box>
  );
};

export default AdminPage; 