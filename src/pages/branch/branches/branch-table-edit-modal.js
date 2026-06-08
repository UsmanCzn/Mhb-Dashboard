import React, { useMemo, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    Switch,
    TextField
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import branchServices from 'services/branchServices';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Table name is required'),
    noOfSeats: Yup.number().min(0, 'Cannot be negative').required('Number of seats is required'),
    noOfChildSeats: Yup.number().min(0, 'Cannot be negative').required('Number of child seats is required')
});

const BranchTableEditModal = ({ open, onClose, tableData, onUpdated }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [submitting, setSubmitting] = useState(false);

    const initialValues = useMemo(
        () => ({
            name: tableData?.name || '',
            isAvailable: Boolean(tableData?.isAvailable),
            isHidden: Boolean(tableData?.isHidden),
            noOfSeats: Number(tableData?.noOfSeats ?? 0),
            noOfChildSeats: Number(tableData?.noOfChildSeats ?? 0)
        }),
        [tableData]
    );

    const handleSubmit = async (values) => {
        if (!tableData?.id) {
            enqueueSnackbar('Table id is missing for update', { variant: 'error' });
            return;
        }

        const payload = {
            id: Number(tableData.id),
            name: values.name,
            isAvailable: values.isAvailable,
            isHidden: values.isHidden,
            isTable: true,
            noOfSeats: Number(values.noOfSeats) || 0,
            noOfChildSeats: Number(values.noOfChildSeats) || 0,
            price: Number(tableData?.price ?? 0),
            tenantId: Number(tableData?.tenantId ?? 0),
            creationTime: tableData?.creationTime,
            deletionTime: tableData?.deletionTime,
            isDeleted: Boolean(tableData?.isDeleted),
            branchId: Number(tableData?.branchId ?? 0),
            branchName: tableData?.branchName || ''
        };

        try {
            setSubmitting(true);
            await branchServices.updateBranchTable(payload);
            enqueueSnackbar('Table updated successfully', { variant: 'success' });
            onClose();
            if (onUpdated) {
                onUpdated();
            }
        } catch (error) {
            const errorMessage =
                error?.response?.data?.error?.validationErrors?.[0]?.message ||
                error?.response?.data?.error?.message ||
                'Failed to update table';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Branch Table</DialogTitle>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
                {({ values, handleChange, handleBlur, handleSubmit, touched, errors, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Table Name"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.name && Boolean(errors.name)}
                                        helperText={touched.name && errors.name}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="No. of Seats"
                                        name="noOfSeats"
                                        value={values.noOfSeats}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.noOfSeats && Boolean(errors.noOfSeats)}
                                        helperText={touched.noOfSeats && errors.noOfSeats}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="No. of Child Seats"
                                        name="noOfChildSeats"
                                        value={values.noOfChildSeats}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.noOfChildSeats && Boolean(errors.noOfChildSeats)}
                                        helperText={touched.noOfChildSeats && errors.noOfChildSeats}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={values.isAvailable}
                                                onChange={(e) => setFieldValue('isAvailable', e.target.checked)}
                                            />
                                        }
                                        label="Is Available"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={values.isHidden}
                                                onChange={(e) => setFieldValue('isHidden', e.target.checked)}
                                            />
                                        }
                                        label="Is Hidden"
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button onClick={onClose} color="secondary" variant="outlined" disabled={submitting}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

export default BranchTableEditModal;
