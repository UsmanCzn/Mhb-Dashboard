import React, { useEffect, useMemo } from 'react';
import {
  Modal, Box, Typography, TextField, Grid, Button, Divider, Fade,
  Stack, Avatar, IconButton, InputAdornment
} from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { ServiceFactory } from 'services/index';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useSnackbar } from 'notistack';

const containerSx = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '92%', sm: 560 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
  overflow: 'hidden'
};
const bodySx = { p: { xs: 3, sm: 4 } };

const UpdateCreditBalance = ({ modalOpen, setModalOpen, setReload, prevData, brand }) => {
  const { cid } = useParams();
  const customerServices = ServiceFactory.get('customer');
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    creditBalance: Yup.number()
      .transform((val, orig) => {
        const raw = String(orig ?? '').trim();
        if (raw === '') return NaN; // let required handle empty
        return Number(raw);
      })
      .typeError('Enter a valid amount (e.g. -25, 10.50)')
      .required('Amount is required')
      .test('non-zero', 'Amount cannot be 0', (val) => typeof val === 'number' && val !== 0)
      .min(-1_000_000, 'Amount too small')
      .max(1_000_000, 'Amount too large'),
    expiryDate: Yup.mixed().required('Expiry Date is required'),
    comments: Yup.string().max(500, 'Comments cannot exceed 500 characters')
  });

  const formik = useFormik({
    enableReinitialize: false, // manage resets manually
    initialValues: {
      creditBalance: '',   // keep as string for controlled text input
      expiryDate: null,
      comments: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!brand?.id) {
        enqueueSnackbar('Brand id not found', { variant: 'error' });
        setSubmitting(false);
        return;
      }

      const amount = Number(String(values.creditBalance).trim());

      const payload = {
        id: prevData?.id,
        increaseBalanceAmount: amount, // negative = deduct; positive = add
        expiryDate: values.expiryDate?.toISOString?.() ?? values.expiryDate,
        walletComments: values.comments,
        brandId: Number(brand.id),
        customerId: Number(cid)
      };

      try {
        await customerServices.UpdateCreditBalance(payload);
        setReload?.((prev) => !prev);
        setModalOpen(false);
        enqueueSnackbar(
          amount > 0 ? 'Credit added successfully' : 'Credit deducted successfully',
          { variant: 'success' }
        );
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Failed to update credit balance', { variant: 'error' });
      } finally {
        setSubmitting(false);
      }
    }
  });

  // Default expiry to NEXT YEAR on open; reset amount/comments
  useEffect(() => {
    if (modalOpen) {
      formik.resetForm({
        values: {
          creditBalance: '',
          expiryDate: dayjs().add(1, 'year'),
          comments: prevData?.comments ?? ''
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, prevData?.comments]);

  const handleClose = () => setModalOpen(false);

  const amountIsZero = useMemo(() => {
    const val = String(formik.values.creditBalance).trim();
    if (val === '' || val === '-' || val === '+') return false; // let schema handle
    const num = Number(val);
    return !Number.isNaN(num) && num === 0;
  }, [formik.values.creditBalance]);

  return (
    <Modal open={modalOpen} onClose={handleClose} aria-labelledby="update-credit-balance-title" closeAfterTransition>
      <Fade in={modalOpen} timeout={200}>
        <Box sx={containerSx}>
          {/* Header */}
          <Box sx={{ px: { xs: 3, sm: 4 }, py: 2.5 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 40, height: 40 }}>
                  <AccountBalanceWalletOutlinedIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography id="update-credit-balance-title" variant="h6" fontWeight={700}>
                    Update Credit Balance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use a negative amount to deduct; positive to add.
                  </Typography>
                </Box>
              </Stack>
              <IconButton onClick={handleClose} aria-label="Close">
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
          </Box>

          <Divider />

          {/* Body */}
          <Box sx={bodySx} component="form" onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="creditBalance"
                  name="creditBalance"
                  fullWidth
                  label="Amount (+/-)"
                  variant="outlined"
                  required
                  type="number"
                  inputMode="decimal"
                  value={formik.values.creditBalance}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.creditBalance && Boolean(formik.errors.creditBalance)}
                  helperText={
                    (formik.touched.creditBalance && formik.errors.creditBalance) ||
                    'Example: -25 to deduct, 50 to add'
                  }
                  InputProps={{ startAdornment: <InputAdornment position="start">±</InputAdornment> }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Credit Balance Expiry"
                    value={formik.values.expiryDate}
                    onChange={(newValue) => formik.setFieldValue('expiryDate', newValue, true)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
                        helperText={formik.touched.expiryDate && formik.errors.expiryDate}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="comments"
                  name="comments"
                  label="Comments (optional)"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={formik.values.comments}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.comments && Boolean(formik.errors.comments)}
                  helperText={formik.touched.comments && formik.errors.comments}
                />
              </Grid>
            </Grid>

            <Stack direction="row" spacing={1.5} justifyContent="flex-end" mt={3}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                startIcon={<SaveRoundedIcon />}
                disabled={
                  !formik.isValid ||
                  formik.isSubmitting ||
                  String(formik.values.creditBalance).trim() === '' ||
                  amountIsZero
                }
              >
                Save
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default UpdateCreditBalance;
