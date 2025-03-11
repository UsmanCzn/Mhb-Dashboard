import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    TextField,
    CardActions,
    Box
} from '@mui/material';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ServiceFactory } from 'services/index';
import { useBranches } from 'providers/branchesProvider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSnackbar } from 'notistack';

const CreateNotification = () => {
    const [selectedBrand, setselectedBrand] = useState({});
    const [customerGroup, setCustomerGroup] = useState([]);
    const filteredGroups = customerGroup.filter((e) => e.brandId === selectedBrand.id);
    const { branchesList } = useBranches();
    const filteredBranch = branchesList.filter((e) => e.brandId === selectedBrand.id);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const customerService = ServiceFactory.get('customer');

    const getCustomerGroups = async () => {
        const response = await customerService.GetCustomersGroups();
        if (response) {
            const tempGroup = response.data.result.data.data.filter((group) => group.type === 'Base');
            setCustomerGroup(tempGroup);
        }
    };
    const { brandsList } = useFetchBrandsList(false);
    useEffect(() => {
        getCustomerGroups();
    }, []);

    // Formik and Yup setup
    const formik = useFormik({
        initialValues: {
            notificationTitle: '',
            notificationMessage: '',
            notificationTitleNative: '',
            notificationMessageNative: '',
            notificationDate: null,
            notificationType: 0,
            notificationDate: new Date(),
            branchId: 0,
            Comments: '',
            customersGroups: []
        },
        validationSchema: Yup.object({
            notificationTitle: Yup.string().required('Required'),
            notificationMessage: Yup.string().required('Required'),
            notificationType: Yup.number().required('Required'),
            customersGroups: Yup.array().min(1, 'Please select at least one group').required('Required')
        }),
        onSubmit: async (values, { resetForm }) => {
            const payload = { ...values }; // Prepare your payload as needed
            try {
                const response = await customerService.CreateNotification(payload);
                if (response) {
                    resetForm();
                    enqueueSnackbar('Notifiction Request has been generated', {
                        variant: 'success'
                    });
                }
            } catch (error) {
                enqueueSnackbar(err?.response?.data?.error?.message, {
                    variant: 'error'
                });
            }
        }
    });
    useEffect(() => {
        if (brandsList[0]?.id) {
            setselectedBrand(brandsList[0]);
        }
    }, [brandsList]);
    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center" // Optional: Align items vertically
                                p={2} // Optional: Padding inside the box
                            >
                                <Typography fontSize={22} fontWeight={700}>
                                    Create Notifications Request
                                </Typography>
                                <Grid item xs={'auto'}>
                                    <FormControl>
                                        <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={selectedBrand}
                                            label={'Brand'}
                                            onChange={(event) => {
                                                setselectedBrand(event.target.value);
                                                formik.setFieldValue('customersGroups', []);
                                                formik.setFieldValue('branchId', 0);
                                            }}
                                        >
                                            {brandsList.map((row, index) => {
                                                return (
                                                    <MenuItem key={index} value={row}>
                                                        {row?.name}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Box>
                            <Grid container spacing={2} marginTop={1}>
                                {/* Notification Title */}
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        margin="dense"
                                        id="notificationTitle"
                                        name="notificationTitle"
                                        label="Notification Title"
                                        type="text"
                                        value={formik.values.notificationTitle}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.notificationTitle && Boolean(formik.errors.notificationTitle)}
                                        helperText={formik.touched.notificationTitle && formik.errors.notificationTitle}
                                    />
                                </Grid>

                                {/* Notification Native Title */}
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        margin="dense"
                                        id="notificationTitleNative"
                                        name="notificationTitleNative"
                                        label="Notification Native Title"
                                        type="text"
                                        value={formik.values.notificationTitleNative}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.notificationTitleNative && Boolean(formik.errors.notificationTitleNative)}
                                        helperText={formik.touched.notificationTitleNative && formik.errors.notificationTitleNative}
                                    />
                                </Grid>

                                {/* Customer Group */}
                                <Grid item xs={6}>
                                    <FormControl fullWidth sx={{ mt: 1 }}>
                                        <InputLabel>Customer Group</InputLabel>
                                        <Select
                                            fullWidth
                                            multiple
                                            id="customersGroups"
                                            name="customersGroups"
                                            value={formik.values.customersGroups}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.customersGroups && Boolean(formik.errors.customersGroups)}
                                        >
                                            {filteredGroups.map((group, index) => (
                                                <MenuItem key={index} value={group.id}>
                                                    {group.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {formik.touched.customersGroups && formik.errors.customersGroups ? (
                                            <Typography color="error">{formik.errors.customersGroups}</Typography>
                                        ) : null}
                                    </FormControl>
                                </Grid>

                                {/* Notification Type */}
                                <Grid item xs={6}>
                                    <FormControl fullWidth sx={{ mt: 1 }}>
                                        <InputLabel>Notification Type</InputLabel>
                                        <Select
                                            id="notificationType"
                                            name="notificationType"
                                            value={formik.values.notificationType}
                                            onChange={(e) => {
                                                formik.setFieldValue('notificationType', e.target.value);
                                                if (e.target.value === 0) formik.setFieldValue('branchId', 0);
                                            }}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.notificationType && Boolean(formik.errors.notificationType)}
                                        >
                                            <MenuItem value={0}>Home</MenuItem>
                                            {/* <MenuItem value={1}>Store</MenuItem> */}
                                        </Select>
                                        {formik.touched.notificationType && formik.errors.notificationType ? (
                                            <Typography color="error">{formik.errors.notificationType}</Typography>
                                        ) : null}
                                    </FormControl>
                                </Grid>

                                {/* Branch Selector */}
                                {formik.values.notificationType == 1 && (
                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Branch</InputLabel>
                                            <Select
                                                id="branchId"
                                                name="branchId"
                                                value={formik.values.branchId}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.branchId && Boolean(formik.errors.branchId)}
                                            >
                                                {filteredBranch.map((branch, index) => (
                                                    <MenuItem key={index} value={branch.id}>
                                                        {branch.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )}

                                {/* Notification Message */}
                                <Grid item xs={6}>
                                    <TextField
                                        id="notificationMessage"
                                        label="Notification Message"
                                        multiline
                                        fullWidth
                                        rows={4}
                                        value={formik.values.notificationMessage}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.notificationMessage && Boolean(formik.errors.notificationMessage)}
                                        helperText={formik.touched.notificationMessage && formik.errors.notificationMessage}
                                    />
                                </Grid>

                                {/* Notification Message Native */}
                                <Grid item xs={6}>
                                    <TextField
                                        id="notificationMessageNative"
                                        label="Notification Message Native"
                                        multiline
                                        fullWidth
                                        rows={4}
                                        value={formik.values.notificationMessageNative}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.notificationMessageNative && Boolean(formik.errors.notificationMessageNative)}
                                        helperText={formik.touched.notificationMessageNative && formik.errors.notificationMessageNative}
                                    />
                                </Grid>

                                {/* Comments */}
                                <Grid item xs={6}>
                                    <TextField
                                        id="Comments"
                                        label="Comments"
                                        multiline
                                        fullWidth
                                        rows={4}
                                        value={formik.values.Comments}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </form>
    );
};

export default CreateNotification;
