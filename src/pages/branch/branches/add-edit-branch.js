import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    TextField,
    Grid,
    Button,
    MenuItem,
    Box,
    Typography,
    Tab,
    FormControlLabel,
    InputLabel,
    FormControl,
    Switch,
    Card,
    Select
} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import branchServices from 'services/branchServices';
import fileService from 'services/fileService';
import { ServiceFactory } from 'services/index';
import { useSnackbar } from 'notistack';
import BranchTimings from '../../../pages/branch/branchTimings/index';
const AddEditBranch = () => {
    const brandService = ServiceFactory.get('brands');
    const [tabValue, setTabValue] = useState('1');
    const [brands, setBrands] = useState([]);
    const [p1, setP1] = useState(null);
    const { id } = useParams();
    const [branch, setBranch] = useState({});
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleNext = async (validateForm, setTouched) => {
        const errors = await validateForm();
        if (Object.keys(errors).length === 0) {
            setTabValue((prev) => (parseInt(prev, 10) + 1).toString()); // Move to the next tab
        } else {
            setTouched(errors); // Show validation errors
        }
    };

    const handleBackChange = () => {
        setTabValue((prev) => (parseInt(prev, 10) - 1).toString()); // Move to the previous tab
    };

    const getBranch = async () => {
        setloading(true);
        try {
            const res = await branchServices.getBranchById(id);
            const branch = res?.data?.result;

            if (id) {
                setloading(false);
                setInitialValues((prev) => ({
                    ...branch,
                    acceptTime: branch?.acceptTime || '',
                    branchAddress: branch?.branchAddress || '',
                    branchPhoneNumber: branch?.branchPhoneNumber || '',
                    branchTimingsString: branch?.branchTimingsString || '',
                    branchTimingsStringNative: branch?.branchTimingsStringNative || '',
                    brandId: branch?.brandId || '',
                    closeTime: branch?.closeTime || '',
                    deliveryDistance: branch?.deliveryDistance || '',
                    DeliveryDistanceKM: branch?.deliveryDistanceKM,
                    deliveryFee: branch?.deliveryFee || '',
                    DeliveryFee: branch?.deliveryFee,
                    isCarService: branch?.isCarService || false,
                    isDelivery: branch?.isDelivery || false,
                    isPickup: branch?.isPickup || false,
                    logoUrl: branch?.logoUrl || '',
                    latitude: branch?.latitude || '',
                    longitude: branch?.longitude || '',
                    arrivalArea: branch?.arrivalArea || 0,
                    name: branch?.name || '',
                    nativeBranchAddress: branch?.nativeBranchAddress || '',
                    nativeName: branch?.nativeName || '',
                    openTime: branch?.openTime || '',
                    readyTime: branch?.readyTime || '',
                    UsedDeliverySystem: branch?.usedDeliverySystem || 1 // Patch the values dynamically
                }));
                setBranch(branch);
            }
        } catch (err) {
            console.error(err.response);
        }
    };
    const getBrands = async () => {
        await brandService
            .getAllBrands()
            .then((res) => {
                setBrands(res.data.result || []);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        getBrands();
        if (id) {
            getBranch();
        }
    }, [id]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const [initialValues, setInitialValues] = useState({
        acceptTime: 0,
        branchAddress: '',
        branchPhoneNumber: '',
        branchTimingsString: '',
        branchTimingsStringNative: '',
        brandId: '',
        closeTime: '',
        deliveryDistance: '',
        DeliveryDistanceKM: 0,
        deliveryFee: 0,
        DeliveryFee: 0,
        isCarService: false,
        isDelivery: false,
        isPickup: false,
        logoUrl: '',
        latitude: 0,
        longitude: 0,
        arrivalArea: 0,
        name: '',
        nativeBranchAddress: '',
        nativeName: '',
        openTime: '',
        readyTime: 0,
        UsedDeliverySystem: 1
    });
    const validationSchemas = {
        1: Yup.object().shape({
            name: Yup.string().required('Store Name is required'),
            // nativeName: Yup.string().required('Store Name (Native) is required'),
            brandId: Yup.string().required('Brand is required'),
            // branchPhoneNumber: Yup.number().required('Phone Number is required'),
            acceptTime: Yup.number().required('Accept Time is required').min(0),
            readyTime: Yup.number().required('Ready Time is required').min(0)
        }),
        2: Yup.object().shape({
            openTime: Yup.string().required('Opening Time is required'),
            closeTime: Yup.string().required('Closing Time is required')
            // .test('is-after-openTime', 'Closing Time must be after Opening Time', function (closeTime) {
            //     const { openTime } = this.parent;
            //     if (!openTime || !closeTime) return true; // Skip validation if either is missing

            //     return openTime < closeTime; // Ensure openTime is before closeTime
            // })
            // branchTimingsString: Yup.string().required('Working hours text is required'),
            // branchTimingsStringNative: Yup.string().required('Working hours text (Native) is required')
        }),
        3: Yup.object().shape({
            isPickup: Yup.boolean(),
            isCarService: Yup.boolean(),
            isDelivery: Yup.boolean(),
            DeliveryDistanceKM: Yup.number().when('isDelivery', {
                is: true,
                then: Yup.number().required('Delivery Distance is required')
            }),
            DeliveryFee: Yup.number().when('isDelivery', {
                is: true,
                then: Yup.number().required('Delivery Fee is required')
            }),
            UsedDeliverySystem: Yup.number().when('isDelivery', {
                is: true,
                then: Yup.number().required('Delivery System is required')
            })
        }),
        4: Yup.object().shape({
            // branchAddress: Yup.string().required('Address is required'),
            // nativeBranchAddress: Yup.string().required('Native Address is required'),
            latitude: Yup.number()
                .typeError('Latitude must be a decimal number')
                .required('Latitude is required')
                .test('is-decimal', 'Latitude must be in decimal format', (value) => /^\-?\d+(\.\d+)?$/.test(value?.toString())),
            longitude: Yup.number()
                .typeError('Longitude must be a decimal number')
                .required('Longitude is required')
                .test('is-decimal', 'Longitude must be in decimal format', (value) => /^\-?\d+(\.\d+)?$/.test(value?.toString())),
            arrivalArea: Yup.number().min(0, 'Cannot be negative')
        }),
        5: Yup.object().shape({
            // Add validation rules for the "Logo" tab if needed
        })
    };
    const formatDecimal = (value) => {
        console.log(typeof value, 'hjghgb');
        const temp = +value || 0;
        if (typeof temp === 'number') {
            // Check if the value includes a decimal point
            return temp % 1 === 0 ? `${temp.toFixed(2)}` : `${temp}`;
        }
        return temp; // Return as-is if not a number
    };
    const handleSubmit = async (values) => {
        let payload = {
            ...branch,
            ...values,
            deliveryFee: values?.DeliveryFee,
            deliveryDistanceKM: values?.DeliveryDistanceKM,
            latitude: formatDecimal(values?.latitude),
            longitude: formatDecimal(values?.longitude)
        };

        setloading(true);
        if (p1) {
            try {
                const logoResponse = await fileService.uploadBranchLogo(p1);
                payload.logoUrl = logoResponse.data?.result;
            } catch (err) {
                console.error(err);
            }
        } else if (!id && !p1) {
            enqueueSnackbar('Please Upload Image', {
                variant: 'error'
            });
            setloading(false);
            return;
        }

        try {
            if (id) {
                await branchServices.editBranch(payload);
                console.log('Branch updated successfully');
                setloading(false);
            } else {
                await branchServices.createBranch(payload);
                console.log('Branch created successfully');
                enqueueSnackbar('Branch created successfully', {
                    variant: 'success'
                });
            }
            setloading(false);
            navigate(`/locations?brandId=${initialValues.brandId}`);
        } catch (error) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error?.validationErrors?.[0]?.message || error.response?.data?.error?.message || 'An error occurred';

            enqueueSnackbar(errorMessage, { variant: 'error' });
            setloading(false);
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h4">{id ? 'Edit Store' : 'Create New Store'}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Card sx={{ padding: 0, margin: '3px 0' }}>
                    {loading && (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    )}
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchemas[tabValue]}
                        enableReinitialize
                        onSubmit={handleSubmit}
                    >
                        {({ values, handleChange, handleBlur, errors, touched, setFieldValue, validateForm, setTouched, isValid }) => {
                            <pre>{JSON.stringify(errors, null, 2)}</pre>;
                            return (
                                <Form>
                                    <TabContext value={tabValue}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                            <TabList onChange={handleTabChange}>
                                                <Tab
                                                    label="Basic Info"
                                                    value="1"
                                                    // disabled={id ? tabValue !== '1' && tabValue !== '6' : tabValue !== '1'}
                                                    disabled={!id && tabValue !== '1'}
                                                />
                                                <Tab label="Timings" value="2" disabled={!id && tabValue !== '2'} />
                                                <Tab label="Settings" value="3" disabled={!id && tabValue !== '3'} />
                                                <Tab label="Address" value="4" disabled={!id && tabValue !== '4'} />
                                                <Tab label="Logo" value="5" disabled={!id && tabValue !== '5'} />
                                                {id && <Tab label="Branch Schedule" value="6" disabled={false} />}
                                            </TabList>
                                        </Box>

                                        {/* Tab 1: Basic Info */}
                                        <TabPanel value="1">
                                            <Grid container spacing={3}>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Store Name"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="name"
                                                        value={values.name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.name && Boolean(errors.name)}
                                                        helperText={touched.name && errors.name}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Store Name (Native)"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="nativeName"
                                                        value={values.nativeName}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.nativeName && Boolean(errors.nativeName)}
                                                        helperText={touched.nativeName && errors.nativeName}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        select
                                                        label="Select Brand"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="brandId"
                                                        value={values.brandId}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.brandId && Boolean(errors.brandId)}
                                                        helperText={touched.brandId && errors.brandId}
                                                    >
                                                        {brands.map((brand) => (
                                                            <MenuItem key={brand.id} value={brand.id}>
                                                                {brand.name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Phone Number"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="branchPhoneNumber"
                                                        value={values.branchPhoneNumber}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.branchPhoneNumber && Boolean(errors.branchPhoneNumber)}
                                                        helperText={touched.branchPhoneNumber && errors.branchPhoneNumber}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Avg Order Accept Time In Minutes"
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        name="acceptTime"
                                                        value={values.acceptTime}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.acceptTime && Boolean(errors.acceptTime)}
                                                        helperText={touched.acceptTime && errors.acceptTime}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Avg Order Ready Time In Minutes"
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        name="readyTime"
                                                        value={values.readyTime}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.readyTime && Boolean(errors.readyTime)}
                                                        helperText={touched.readyTime && errors.readyTime}
                                                    />
                                                </Grid>
                                                <Grid item container justifyContent="flex-end" xs={12}>
                                                    <Button
                                                        variant="contained"
                                                        sx={{ minWidth: '120px' }}
                                                        onClick={() => handleNext(validateForm, setTouched)}
                                                        // disabled={!validationSchemas[1].isValidSync(values)} // Disable if the current tab's validation fails
                                                    >
                                                        Next
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>

                                        {/* Tab 2: Timings */}
                                        <TabPanel value="2">
                                            <Grid container spacing={3}>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Opening Time"
                                                        fullWidth
                                                        type="time"
                                                        variant="outlined"
                                                        name="openTime"
                                                        value={values.openTime}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.openTime && Boolean(errors.openTime)}
                                                        helperText={touched.openTime && errors.openTime}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Closing Time"
                                                        fullWidth
                                                        type="time"
                                                        variant="outlined"
                                                        name="closeTime"
                                                        value={values.closeTime}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.closeTime && Boolean(errors.closeTime)}
                                                        helperText={touched.closeTime && errors.closeTime}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Working hours Text"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="branchTimingsString"
                                                        value={values.branchTimingsString}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.branchTimingsString && Boolean(errors.branchTimingsString)}
                                                        helperText={touched.branchTimingsString && errors.branchTimingsString}
                                                    />
                                                </Grid>

                                                {/* Branch Timings String Native */}
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Working Hours Text (Native)"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="branchTimingsStringNative"
                                                        value={values.branchTimingsStringNative}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={
                                                            touched.branchTimingsStringNative && Boolean(errors.branchTimingsStringNative)
                                                        }
                                                        helperText={touched.branchTimingsStringNative && errors.branchTimingsStringNative}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={() => handleBackChange(validateForm, setTouched, isValid)}
                                                            disabled={tabValue === 0} // Disable Back button on the first tab
                                                            sx={{ minWidth: '120px' }} // Consistent button size
                                                        >
                                                            Back
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleNext(validateForm, setTouched, isValid)}
                                                            disabled={!isValid && tabValue < validationSchemas.length - 1} // Allow submission on the last tab
                                                            sx={{ minWidth: '120px' }} // Consistent button size
                                                        >
                                                            {tabValue === validationSchemas.length - 1 ? 'Submit' : 'Next'}{' '}
                                                            {/* Dynamically change label */}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>

                                        {/* Tab 3: Settings */}
                                        <TabPanel value="3">
                                            <Grid container spacing={2}>
                                                {/* Horizontal Toggles */}
                                                <Grid item xs={12}>
                                                    <Box display="flex" flexDirection="row" gap={2} alignItems="center">
                                                        {/* Enable Pickup */}
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    name="isPickup"
                                                                    checked={values.isPickup}
                                                                    onChange={(e) => setFieldValue('isPickup', e.target.checked)}
                                                                    size="small"
                                                                />
                                                            }
                                                            label="Enable Pickup"
                                                        />
                                                        {/* Enable Car Service */}
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    name="isCarService"
                                                                    checked={values.isCarService}
                                                                    onChange={(e) => setFieldValue('isCarService', e.target.checked)}
                                                                    size="small"
                                                                />
                                                            }
                                                            label="Enable Car Service"
                                                        />
                                                        {/* Enable Delivery */}
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    name="isDelivery"
                                                                    checked={values.isDelivery}
                                                                    onChange={(e) => setFieldValue('isDelivery', e.target.checked)}
                                                                    size="small"
                                                                />
                                                            }
                                                            label="Enable Delivery"
                                                        />
                                                    </Box>
                                                </Grid>

                                                {values.isDelivery && (
                                                    <>
                                                        {/* Delivery Distance KM */}
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Delivery Distance (KM)"
                                                                fullWidth
                                                                variant="outlined"
                                                                type="number"
                                                                name="DeliveryDistanceKM"
                                                                value={values.DeliveryDistanceKM}
                                                                onChange={handleChange}
                                                                error={touched.DeliveryDistanceKM && Boolean(errors.DeliveryDistanceKM)}
                                                                helperText={touched.DeliveryDistanceKM && errors.DeliveryDistanceKM}
                                                                size="small"
                                                            />
                                                        </Grid>

                                                        {/* Delivery Fee */}
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Delivery Fee"
                                                                fullWidth
                                                                variant="outlined"
                                                                type="number"
                                                                name="DeliveryFee"
                                                                value={values.DeliveryFee}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                error={touched.DeliveryFee && Boolean(errors.DeliveryFee)}
                                                                helperText={touched.DeliveryFee && errors.DeliveryFee}
                                                                size="small"
                                                            />
                                                        </Grid>

                                                        {/* Used Delivery System */}
                                                        <Grid item xs={12} sm={6}>
                                                            <FormControl fullWidth>
                                                                <InputLabel id="used-delivery-system-label" size="small">
                                                                    Used Delivery System
                                                                </InputLabel>
                                                                <Select
                                                                    labelId="used-delivery-system-label"
                                                                    id="used-delivery-system-select"
                                                                    value={values.UsedDeliverySystem}
                                                                    onBlur={handleBlur}
                                                                    onChange={(e) => setFieldValue('UsedDeliverySystem', e.target.value)}
                                                                    size="small"
                                                                >
                                                                    <MenuItem value={1}>Verdi</MenuItem>
                                                                    {/* Add more options as needed */}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                    </>
                                                )}

                                                {/* Navigation Buttons */}
                                                <Grid item xs={12} container justifyContent="flex-end" spacing={1}>
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={() => handleBackChange(validateForm, setTouched, isValid)}
                                                            disabled={tabValue === 3}
                                                            sx={{ minWidth: '100px', padding: '4px 8px' }}
                                                        >
                                                            Back
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleNext(validateForm, setTouched, isValid)}
                                                            disabled={!isValid && tabValue < validationSchemas.length - 1}
                                                            sx={{ minWidth: '100px', padding: '4px 8px' }}
                                                        >
                                                            {tabValue === validationSchemas.length - 1 ? 'Submit' : 'Next'}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>

                                        {/* Tab 4: Address */}
                                        <TabPanel value="4">
                                            <Grid container spacing={3}>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Address"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="branchAddress"
                                                        value={values.branchAddress}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.branchAddress && Boolean(errors.branchAddress)}
                                                        helperText={touched.branchAddress && errors.branchAddress}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Native Address"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="nativeBranchAddress"
                                                        value={values.nativeBranchAddress}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.nativeBranchAddress && Boolean(errors.nativeBranchAddress)}
                                                        helperText={touched.nativeBranchAddress && errors.nativeBranchAddress}
                                                    />
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Latitude"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="latitude"
                                                        value={values.latitude}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.latitude && Boolean(errors.latitude)}
                                                        helperText={touched.latitude && errors.latitude}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Longitude"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="longitude"
                                                        value={values.longitude}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.longitude && Boolean(errors.longitude)}
                                                        helperText={touched.longitude && errors.longitude}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Arrival Area (Meters)"
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        name="arrivalArea"
                                                        value={values.arrivalArea}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.arrivalArea && Boolean(errors.arrivalArea)}
                                                        helperText={touched.arrivalArea && errors.arrivalArea}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={() => handleBackChange(validateForm, setTouched, isValid)}
                                                            disabled={tabValue === 0} // Disable Back button on the first tab
                                                            sx={{ minWidth: '120px' }} // Consistent button size
                                                        >
                                                            Back
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleNext(validateForm, setTouched, isValid)}
                                                            disabled={!isValid && tabValue < validationSchemas.length - 1} // Allow submission on the last tab
                                                            sx={{ minWidth: '120px' }} // Consistent button size
                                                        >
                                                            {tabValue === validationSchemas.length - 1 ? 'Submit' : 'Next'}{' '}
                                                            {/* Dynamically change label */}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>

                                        {/* Tab 5: Logo */}
                                        <TabPanel value="5">
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <Typography>Upload Logo</Typography>
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            height: 200,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            backgroundColor: '#f0f0f0',
                                                            border: '1px dashed #ccc'
                                                        }}
                                                    >
                                                        {id && branch.logoUrl && (
                                                            <img
                                                                src={branch.logoUrl}
                                                                alt="Logo"
                                                                style={{ maxWidth: '100px', maxHeight: '100%' }}
                                                            />
                                                        )}
                                                        <input
                                                            type="file"
                                                            onChange={(e) => setP1(e.target.files[0])}
                                                            style={{ marginTop: 16 }}
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} container justifyContent="flex-end" gap={2}>
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={() => handleBackChange(validateForm, setTouched, isValid)}
                                                            disabled={tabValue === 0} // Disable Back button on the first tab
                                                            sx={{ minWidth: '120px' }} // Consistent button size
                                                        >
                                                            Back
                                                        </Button>
                                                    </Grid>
                                                    <Button variant="contained" sx={{ minWidth: '120px' }} type="submit">
                                                        Save
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>

                                        {/* Tab 6: Branch Schedule */}
                                        <TabPanel value="6">
                                            <BranchTimings />
                                        </TabPanel>
                                    </TabContext>
                                </Form>
                            );
                        }}
                    </Formik>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AddEditBranch;
