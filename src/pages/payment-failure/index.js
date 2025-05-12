import React from 'react';
import { Box, Card, Typography, Button } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
const PaymentFailure = () => {
    const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f9f9f9"
    >
      <Card sx={{ p: 4, minWidth: 300, maxWidth: 400, textAlign: 'center' }}>
        <CancelIcon sx={{ fontSize: 60, color: '#f44336', }} />
        <Typography variant="body1" fontWeight="bold" gutterBottom>
          Something went wrong, please try again!
        </Typography>

        <Button
          variant="contained"
          
          sx={{ 
            mt: 2,
            backgroundColor: '#f44336',
            '&:hover': {
              backgroundColor: '#d32f2f',
            },
          }}
          onClick={() => navigate('/customernotification')}
        >
          Go Back
        </Button>
      </Card>
    </Box>
  );
};

export default PaymentFailure;
