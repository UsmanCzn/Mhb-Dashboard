/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Divider,
  Fade,
  Stack,
  Avatar,
  IconButton,
  InputAdornment
} from '@mui/material';
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

const UpdateWalletBalanceModal = ({ modalOpen, setModalOpen, setReload, prevData, brand }) => {
  const { cid } = useParams();
  const customerServices = ServiceFactory.get('customer');
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    walletBalance: Yup.number()
      .transform((val, orig) => {
        const raw = String(orig ?? '').trim();
        if (raw === '') return NaN;
        return Number(raw);
      })
      .typeError('Enter a valid amount (e.g. -25, 10.50)')
      .required('Amount is required')
      .test('non-zero', 'Amount cannot be 0', (val) => typeof val === 'number' && val !== 0)
      .min(-1_000_000, 'Amount too small')
      .max(1_000_000, 'Amount too large'),
    comments: Yup.string().max(500, 'Comments cannot exceed 500 characters')
  });

  const formik = useFormik({
    enableReinitialize: false,
    initialValues: {
      walletBalance: '',
      comments: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!brand?.id) {
        enqueueSnackbar('Brand id not found', { variant: 'error' });
        setSubmitting(false);
        return;
      }

      if (!prevData?.id) {
        enqueueSnackbar('Wallet base id not found', { variant: 'error' });
        setSubmitting(false);
        return;
      }

      const amount = Number(String(values.walletBalance).trim());
      const walletUser = prevData?.customerWallets?.find((item) => item?.isActive) || prevData?.customerWallets?.[0] || {};
      const resolvedName = walletUser?.userFullName || prevData?.userFullName || '';

      const payload = {
        id: 0,
        increaseBalanceAmount: amount,
        walletComments: values.comments,
        brandName: brand?.name || prevData?.brandName || '',
        userName: resolvedName,
        fullName: resolvedName,
        emailAddress: walletUser?.userDisplayEmail || '',
        phoneNumber: walletUser?.userDisplayPhone || '',
        isAct: false,
        isAccepted: false,
        customerId: Number(cid),
        brandId: Number(brand.id),
        customerWalletBaseId: Number(prevData?.id ?? 0),
        creationTime: new Date().toISOString()
      };

      try {
        await customerServices.AddByCompanyManagersync(payload);
        setReload?.((prev) => !prev);
        setModalOpen(false);
        enqueueSnackbar(
          'Wallet update request generated',
          { variant: 'success' }
        );
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Failed to generate wallet update request', { variant: 'error' });
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (modalOpen) {
      formik.resetForm({
        values: {
          walletBalance: '',
          comments: ''
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  const handleClose = () => setModalOpen(false);

  const amountIsZero = useMemo(() => {
    const val = String(formik.values.walletBalance).trim();
    if (val === '' || val === '-' || val === '+') return false;
    const num = Number(val);
    return !Number.isNaN(num) && num === 0;
  }, [formik.values.walletBalance]);

  return (
    <Modal open={modalOpen} onClose={handleClose} aria-labelledby="update-wallet-balance-title" closeAfterTransition>
      <Fade in={modalOpen} timeout={200}>
        <Box sx={containerSx}>
          <Box sx={{ px: { xs: 3, sm: 4 }, py: 2.5 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 40, height: 40 }}>
                  <AccountBalanceWalletOutlinedIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography id="update-wallet-balance-title" variant="h6" fontWeight={700}>
                    Update Wallet Balance
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

          <Box sx={bodySx} component="form" onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="walletBalance"
                  name="walletBalance"
                  fullWidth
                  label="Amount (+/-)"
                  variant="outlined"
                  required
                  type="number"
                  inputMode="decimal"
                  value={formik.values.walletBalance}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.walletBalance && Boolean(formik.errors.walletBalance)}
                  helperText={
                    (formik.touched.walletBalance && formik.errors.walletBalance) ||
                    'Example: -25 to deduct, 50 to add'
                  }
                  InputProps={{ startAdornment: <InputAdornment position="start">±</InputAdornment> }}
                />
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
                  String(formik.values.walletBalance).trim() === '' ||
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

export default UpdateWalletBalanceModal;
