import React, { useEffect } from 'react';
import { Modal, Box, Typography, TextField, Grid, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { ServiceFactory } from 'services/index';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    overflow: 'scroll'
};

const UpdateCreditBalance = ({ modalOpen, setModalOpen, setReload, prevData }) => {
    const { cid } = useParams();
    const customerServices = ServiceFactory.get('customer');

    useEffect(() => {
        formik.setFieldValue('creditBalance', prevData?.creditBalance);
        formik.setFieldValue('expiryDate', prevData?.expiryDate || new Date());
        formik.setFieldValue('commnets', prevData?.commnets);
    }, [prevData]);
    const validationSchema = Yup.object().shape({
        creditBalance: Yup.number().required('Credit Balance is required').min(0.01, 'Credit Balance must be greater than zero'),
        expiryDate: Yup.date().required('Expiry Date is required').nullable(),
        comments: Yup.string().max(500, 'Comments cannot exceed 500 characters')
    });

    const formik = useFormik({
        initialValues: {
            creditBalance: prevData?.creditBalance || 0,
            expiryDate: prevData?.expiryDate || new Date(),
            comments: prevData?.comments || ''
        },
        // enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            const payload = {
                ...values,
                id: prevData?.id,
                increaseBalanceAmount: values.creditBalance,
                expiryDate: values.expiryDate,
                walletComments: values.comments,
                brandId: +prevData.brandId,
                customerId: +cid
            };

            try {
                await customerServices.UpdateCreditBalance(payload);
                setReload((prev) => !prev);
                setModalOpen(false);
               
            } catch (error) {
                console.error(error);
            }
        }
    });

    return (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <form onSubmit={formik.handleSubmit}>
                <Box sx={style}>
                    <Grid container spacing={4}>
                        <Grid item>
                            <Typography variant="h4">Update Credit Balance</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        id="creditBalance"
                                        fullWidth
                                        label="Credit Balance"
                                        variant="outlined"
                                        required
                                        type="number"
                                        {...formik.getFieldProps('creditBalance')}
                                        error={formik.touched.creditBalance && Boolean(formik.errors.creditBalance)}
                                        helperText={formik.touched.creditBalance && formik.errors.creditBalance}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Credit Balance Expiry"
                                            value={formik.values.expiryDate}
                                            onChange={(newValue) => formik.setFieldValue('expiryDate', newValue, true)}
                                            renderInput={(params) => (
                                                <TextField
                                                    fullWidth
                                                    {...params}
                                                    error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
                                                    helperText={formik.touched.expiryDate && formik.errors.expiryDate}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                id="comments"
                                label="Comments"
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                {...formik.getFieldProps('comments')}
                                error={formik.touched.comments && Boolean(formik.errors.comments)}
                                helperText={formik.touched.comments && formik.errors.comments}
                            />
                        </Grid>

                        {/* Footer */}
                        <Grid item xs={12}>
                            <Grid container justifyContent="flex-end" spacing={2}>
                                <Grid item>
                                    <Button variant="outlined" onClick={() => setModalOpen(false)}>
                                        Cancel
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button primary variant="contained" type="submit">
                                        Update Customer
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Modal>
    );
};

export default UpdateCreditBalance;
