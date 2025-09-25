import React, { useEffect } from 'react';
import { Modal, Box, Typography, TextField, Grid, Button, Divider, Fade, Stack, Avatar, IconButton, InputAdornment } from '@mui/material';
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

const UpdateCreditBalance = ({ modalOpen, setModalOpen, setReload, prevData,brand }) => {
    const { cid } = useParams();
    const customerServices = ServiceFactory.get('customer');
    
    const { enqueueSnackbar } = useSnackbar();
    const validationSchema = Yup.object().shape({
        creditBalance: Yup.number()
            .transform((val, orig) => (orig === '' ? NaN : Number(orig)))
            .typeError('Enter a valid amount')
            .required('Credit Balance is required')
            .min(0.01, 'Credit Balance must be greater than zero'),
        expiryDate: Yup.mixed().required('Expiry Date is required'),
        comments: Yup.string().max(500, 'Comments cannot exceed 500 characters')
    });

    const formik = useFormik({
        enableReinitialize: false, // <- manage resets manually
        initialValues: {
            creditBalance: '', // always blank
            expiryDate: null, // <- stable, we'll set it on open
            comments: '' // comments will be set on open (from prevData)
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            const payload = {
                id: prevData?.id,
                increaseBalanceAmount: Number(values.creditBalance),
                expiryDate: values.expiryDate, // dayjs object (adapter will serialize)
                walletComments: values.comments,
                brandId: Number(brand?.id),
                customerId: Number(cid)
            };
            if(!brand){
                    enqueueSnackbar('Brand id not found', {
                        variant: 'error',
                      });
            }
            try {
                await customerServices.UpdateCreditBalance(payload);
                setReload?.((prev) => !prev);
                setModalOpen(false);
            } catch (error) {
                console.error(error);
            } finally {
                setSubmitting(false);
            }
        }
    });

    // Always default expiry to NEXT YEAR on open, ignore any previous date
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
                                        Adjust the customer’s credit amount and set an expiry.
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
                                    label="Credit Balance"
                                    variant="outlined"
                                    required
                                    type="text"
                                    inputMode="decimal"
                                    value={formik.values.creditBalance}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.creditBalance && Boolean(formik.errors.creditBalance)}
                                    helperText={formik.touched.creditBalance && formik.errors.creditBalance}
                                    InputProps={{ startAdornment: <InputAdornment position="start">+</InputAdornment> }}
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
                                
                                disabled={!formik.isValid || formik.isSubmitting || formik.values.creditBalance === ''}
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
