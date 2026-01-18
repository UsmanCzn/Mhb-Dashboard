import React from 'react';
import { Box, Card, Typography, Divider, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useLocation } from 'react-router-dom';

const TYPE_CONFIG = {
  Balance: {
    title: 'Balance Added Successfully',
    backUrl: '/customernotification',
  },
  Commission: {
    title: 'Commission Paid Successfully',
    backUrl: '/reports-invoices',
  },
  Plugin: {
    title: 'Plugin Enabled Successfully',
    backUrl: '/plugins',
  },
};

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const orderId = searchParams.get('orderid');
  const orderNumber = searchParams.get('orderNumber');
  const paymentId = searchParams.get('paymentId');
  const transactionId = searchParams.get('transactionId');
  const type = searchParams.get('Type');

  const config = TYPE_CONFIG[type] || {
    title: 'Payment Completed Successfully',
    backUrl: '/',
  };

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
          {config.title}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={2}
          my={2}
        >
          {orderId && (
            <Typography variant="body2">
              <strong>Order ID:</strong> {orderId}
            </Typography>
          )}
          {orderNumber && (
            <Typography variant="body2">
              <strong>Order Number:</strong> {orderNumber}
            </Typography>
          )}
          {paymentId && (
            <Typography variant="body2">
              <strong>Payment ID:</strong> {paymentId}
            </Typography>
          )}
          {transactionId && (
            <Typography variant="body2">
              <strong>Transaction ID:</strong> {transactionId}
            </Typography>
          )}
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
          onClick={() => navigate(config.backUrl)}
        >
          Go Back
        </Button>
      </Card>
    </Box>
  );
};

export default PaymentSuccess;
