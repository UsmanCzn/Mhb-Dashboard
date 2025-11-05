import React from 'react';
import { Box, Card, Typography, Divider, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to extract query parameters
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      orderId: searchParams.get('orderid'),
      orderNumber: searchParams.get('orderNumber'),
      paymentId: searchParams.get('paymentId'),
      transactionId: searchParams.get('transactionId'),
      type: searchParams.get('Type'),
    };
  };

  const { orderId, orderNumber, paymentId, transactionId, type } = getQueryParams();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f9f9f9"
    >
      <Card sx={{ p: 4, minWidth: 400, maxWidth: 400, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {type ==='Balance' ? 'Balance Added Successfully':'Plugin Enabled Successfully'}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} my={2}>
        <Typography variant="body2">
          <strong>Order ID:</strong> {orderId}
        </Typography>
        <Typography variant="body2">
          <strong>Order Number:</strong> {orderNumber}
        </Typography>
        <Typography variant="body2">
          <strong>Payment ID:</strong> {paymentId}
        </Typography>
        <Typography variant="body2">
          <strong>Transaction ID:</strong> {transactionId}
        </Typography>
        </Box>


        <Button
          variant="contained"
          sx={{
            mt: 4,
            backgroundColor: '#4caf50',
            '&:hover': {
              backgroundColor: '#43a047',
            },
          }}
          onClick={() => navigate(type ==='Balance' ? '/customernotification':'/plugins')}
        >
          Go Back
        </Button>
      </Card>
    </Box>
  );
};

export default PaymentSuccess;
