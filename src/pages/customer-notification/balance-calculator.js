import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, IconButton, Box, TextField, Grid, Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AppleIcon from '@mui/icons-material/Apple';
import Knet from '../../assets/images/users/knet.png'
import { ServiceFactory } from 'services/index';
import { useSnackbar } from 'notistack';


const paymentMethods = [
    { id: 1, name: 'Knet', icon: Knet },
    // { id: 2, name: 'Apple Pay', icon: <AppleIcon /> },
  ];

export default function AddBalanceModal({ open, onClose ,brand, setIsPaymentUrlLoading}) {
  const [quantity, setQuantity] = useState(2);
  const[price ,setPrice]=useState(0)
  const subtotal = quantity * price;
  const [selectedPayment, setSelectedPayment] = useState(1);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);


  const handleQuantityChange = (delta) => {
    setQuantity((q) => Math.max(1, q + delta));
  };

  useEffect(() => {
    if (open && brand?.companyId) {
      CalculateBalance();
    }
  }, [open, brand?.companyId]);

  const handleCheckout = () => {
    console.log('Checking out with:', quantity, selectedPayment);
    onClose();
  };

  const brandService = ServiceFactory.get('brands');
  const CalculateBalance = async () => {
    try {
      const response = await brandService.GetNotificationBalanceToAddByCompany(brand?.companyId);
      const result = response?.data?.result;
      if (result?.creditPrice) {
        setPrice(result.creditPrice); // Update price from backend
      }
    } catch (error) {
      console.error('Failed to fetch notification price:', error);
    }
  };

  const handleAddBalance = async () => {
    setIsPaymentUrlLoading(true);
    const response = await brandService.GetNotificationBalanceToAddByCompany(brand?.companyId);
    if (response && response.data.result?.isManualOnly) {
        console.log(response);
        enqueueSnackbar(response.data.result?.message, {
            variant: 'error'
        });
    setIsPaymentUrlLoading(false);

    }
    else {
        handleConfirmBalance(subtotal,response.data.result?.productName,quantity);
      }
    // const response = await customerService.AddNotificationBalance(selectedBrand?.companyId);
    // if (response) {
    //     getNotificationBalance();
    // }
};

    const handleConfirmBalance = async (amount, productName, NotificationCount) => {
        setIsLoading(true);
        setIsPaymentUrlLoading(true)
        try {
        const res = await brandService.AddNotificationBalance(amount, brand?.companyId, productName, NotificationCount);
        setIsPaymentUrlLoading(false);
        if (res?.data?.result?.isSuccess && res?.data?.result?.paymentUrl) {
            // Redirect to the payment page
            window.location.href = res?.data?.result?.paymentUrl;
        } else {
            enqueueSnackbar('Something went wrong. Please try again.', { variant: 'error' });
        }
        } catch (error) {
        enqueueSnackbar('Failed to initiate payment.', { variant: 'error' });
        } finally {
        setIsLoading(false);
        }
    };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Add Balance</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Notification Price : {price.toFixed(3)} KD
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Quantity Selector */}
        <Box my={2}>
          <Typography variant="body2" gutterBottom>Select Quantity</Typography>
          <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => handleQuantityChange(-1)} disabled={isLoading}>
            <RemoveIcon />
            </IconButton>
            <TextField value={quantity} size="small" inputProps={{ readOnly: true }} />
            <IconButton onClick={() => handleQuantityChange(1)} disabled={isLoading}>
            <AddIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Payment Methods */}
        <Box mt={3}>
          <Typography variant="body2" gutterBottom>Payment Method</Typography>
          <Grid container spacing={2}>
            {paymentMethods.map((method) => (
              <Grid item xs={6} key={method.id}>
                <Paper
                  onClick={() => setSelectedPayment(method.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    border: selectedPayment === method.id ? '2px solid #1976d2' : '1px solid #ddd',
                    cursor: 'pointer',
                    borderRadius: 2,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                  {typeof method.icon === 'string' ? (
                    <img src={method.icon} alt={method.name} style={{ height: 24 }} />
                    ) : (
                    method.icon
                    )}

                    <Typography variant="body2">{method.name}</Typography>
                  </Box>
                  {selectedPayment === method.id && (
                    <CheckCircleIcon color="primary" fontSize="small" />
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Totals */}
        <Box mt={4}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">Subtotal</Typography>
            <Typography variant="body2">{subtotal.toFixed(3)} KD</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography fontWeight="bold">Total</Typography>
            <Typography fontWeight="bold">{subtotal.toFixed(3)} KD</Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleAddBalance}
        disabled={isLoading}
        >
        {isLoading ? 'Processing...' : `Checkout (${subtotal.toFixed(3)} KD)`}
        </Button>
        <Button variant="outlined" fullWidth onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
