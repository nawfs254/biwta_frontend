import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f9', // Light background
        zIndex: 9999, // Ensure it overlays other content
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Spinner */}
      <CircularProgress size={60} sx={{ color: '#3498db' }} />
      
      {/* Loading Text */}
      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          color: '#3498db', // Blue color for the text
          fontWeight: 'bold',
          animation: 'fadeIn 1s ease-in-out', // Optional fade-in animation
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingPage;
