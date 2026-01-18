import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  InputAdornment,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';

/* ----------------------------------
   Backend-aligned default state
-----------------------------------*/
const defaultState = {
  id: 0,
  percentageCommission: '',
  flatCommission: '',
  isEnabled: true,
  isKnetEnabled: true,
  isAplePayEnabled: true,
  isCCEnabled: true,
  isWalletEnabled: true,
  isCreditEnabled: false,
  isOtherPaymentEnabled: true,
};

const UpdateCommissionDialog = ({
  open,
  onClose,
  onSubmit,
  commissionData,
  brandId,
}) => {
  const [form, setForm] = useState(defaultState);

  /* ----------------------------------
     Prefill for UPDATE / RESET for CREATE
  -----------------------------------*/
  useEffect(() => {
    if (commissionData) {
      setForm({
        ...defaultState,
        ...commissionData,
      });
    } else {
      setForm(defaultState);
    }
  }, [commissionData, open]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ----------------------------------
     Submit payload (keys FIXED)
  -----------------------------------*/
  const handleSubmit = () => {
    const payload = {
      id: form.id || 0,
      brandId,
      percentageCommission: Number(form.percentageCommission),
      flatCommission: Number(form.flatCommission),
      isEnabled: form.isEnabled,
      isKnetEnabled: form.isKnetEnabled,
      isAplePayEnabled: form.isAplePayEnabled,
      isCCEnabled: form.isCCEnabled,
      isWalletEnabled: form.isWalletEnabled,
      isCreditEnabled:  false,
      isOtherPaymentEnabled: form.isOtherPaymentEnabled,
    };

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 600 }}>
        Update Commission
      </DialogTitle>

      <DialogContent dividers>
        {/* Enable Commission */}
        <FormControlLabel
          control={
            <Switch
              checked={form.isEnabled}
              onChange={(e) =>
                handleChange('isEnabled', e.target.checked)
              }
            />
          }
          label="Enable Commission"
          sx={{ mb: 3 }}
        />

        {/* Commission Inputs */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Commission %"
              value={form.percentageCommission}
              onChange={(e) =>
                handleChange('percentageCommission', e.target.value)
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">%</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Flat Commission"
              value={form.flatCommission}
              onChange={(e) =>
                handleChange('flatCommission', e.target.value)
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">KD</InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          color="text.secondary"
          mt={1}
          display="block"
        >
          (i) These commissions will apply on every successful order.
        </Typography>

        {/* Payment Methods */}
        <Typography variant="subtitle1" fontWeight={600} mt={4} mb={1}>
          Select Payment Methods
        </Typography>

        <Grid container spacing={2}>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isKnetEnabled}
                  onChange={(e) =>
                    handleChange('isKnetEnabled', e.target.checked)
                  }
                />
              }
              label="KNET"
            />
          </Grid>

          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isAplePayEnabled}
                  onChange={(e) =>
                    handleChange('isAplePayEnabled', e.target.checked)
                  }
                />
              }
              label="Apple Pay"
            />
          </Grid>

          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isCCEnabled}
                  onChange={(e) =>
                    handleChange('isCCEnabled', e.target.checked)
                  }
                />
              }
              label="Credit Card"
            />
          </Grid>

          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isWalletEnabled}
                  onChange={(e) =>
                    handleChange('isWalletEnabled', e.target.checked)
                  }
                />
              }
              label="Wallet"
            />
          </Grid>

          {/* <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isCreditEnabled}
                  onChange={(e) =>
                    handleChange('isCreditEnabled', e.target.checked)
                  }
                />
              }
              label="Credit"
            />
          </Grid> */}

          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isOtherPaymentEnabled}
                  onChange={(e) =>
                    handleChange('isOtherPaymentEnabled', e.target.checked)
                  }
                />
              }
              label="Other"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCommissionDialog;
