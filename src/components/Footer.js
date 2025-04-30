import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => (
    <Box
        component="footer"
        sx={{
            bgcolor: '#003366',
            color: 'white',
            py: 3,
            textAlign: 'center',
            mt: 8,
            width: '100%',
            position: 'relative',
            zIndex: 10,
        }}
    >
        <Typography variant="body1" sx={{ mb: 1 }}>
            © 2025 Unified Emergency Responsive System (UERS). All rights reserved.
        </Typography>
        <Typography variant="body2">
            Designed for Hackathon Innovation.
        </Typography>
    </Box>
);

export default Footer; 