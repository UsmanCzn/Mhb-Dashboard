import React, { useState, useEffect } from 'react';
import { Grid, Typography, Card, Box, Tabs, Tab, Button, TextField, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import { useNavigate, useParams } from '../../../node_modules/react-router-dom/dist/index';
import { ServiceFactory } from 'services/index';
import fileService from 'services/fileService';
import { useSnackbar } from 'notistack';
const AddEditApp = () => {
    const initialFormValues = {
        name: '',
        phoneNumber: '',
        CategoryName: '',
        endSubDate: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        brandsLimit: 2,
        branchesLimit: 2,
        notificationsLimit: 5,
        giftCardsLimit: 5,
        menuViewing: false,
        tableOrdering: false
    };
    const [tabValue, setTabValue] = useState(0);
    const [initialValues, setInitialValues] = useState(initialFormValues);
    const [logoFile, setLogoFile] = useState(null);
    const [logoUrl, setLogoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const userServices = ServiceFactory.get('users');
 
    const categories = ['Cafe', 'Restaurant'];
    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            setLoading(true);
            userServices
                .getCompanyById(id) // Replace with your service call to fetch the company by ID
                .then((res) => {
                    console.log(res.data.result);
                    const app = res.data.result;
                    setInitialValues({
                        name: app?.name || '',
                        phoneNumber: app?.adminUser?.phoneNumber || '',
                        CategoryName: app?.categoryName || '',
                        endSubDate: app.endSubscriptionDate ? app.endSubscriptionDate.split('T')[0] : '',
                        firstName: app?.adminUser?.name || '',
                        lastName: app?.adminUser?.surname || '',
                        email: app?.adminUser?.emailAddress || '',
                        password: app?.adminUser?.password || '',
                        menuViewing: false,
                        tableOrdering: false,
                        brandsLimit: app?.brandsLimit,
                        branchesLimit: app?.branchesLimit,
                        notificationsLimit: app?.notificationsLimit,
                        giftCardsLimit: app?.giftCardsLimit
                    });
                    setLogoUrl(app?.logoUrl);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    enqueueSnackbar('Failed to load company data', { variant: 'error' });
                });
        } else {
            setLoading(false);
        }
    }, [id]);
    // Initial values for the form

    // Validation schemas for each tab
    const validationSchemas = [
        Yup.object().shape({
            name: Yup.string().required('Company Name is required'),

            CategoryName: Yup.string().required('Category is required'),
            endSubDate: Yup.date().required('End subscription date is required'),
            brandsLimit: Yup.number().required('Field is required'),
            branchesLimit: Yup.number().required('Field is required')
            // notificationsLimit: Yup.number().required('Field is required'),
            // giftCardsLimit: Yup.number().required('Field is required')
        }),
        Yup.object().shape({}),
        // No validation for Settings tab
        Yup.object().shape({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            phoneNumber: Yup.number().required('Phone number is required')
        }),
        Yup.object().shape({}) // No validation for Logo tab
    ];
    const validationSchemasEdit = [
        Yup.object().shape({
            name: Yup.string().required('Company Name is required'),
            // phoneNumber: Yup.string().matches(/^\d+$/, 'Phone number must be numeric').required('Phone number is required'),
            CategoryName: Yup.string().required('Category is required'),
            endSubDate: Yup.date().required('End subscription date is required'),
            brandsLimit: Yup.number().required('Field is required'),
            branchesLimit: Yup.number().required('Field is required')
            // notificationsLimit: Yup.number().required('Field is required'),
            // giftCardsLimit: Yup.number().required('Field is required')
        }),
        Yup.object().shape({}),
        // No validation for Settings tab
        Yup.object().shape({}),
        Yup.object().shape({}) // No validation for Logo tab
    ];
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const handleNext = async (validateForm, setErrors, setTouched, values) => {
        // Mark all fields as touched
        const fieldsToTouch = Object.keys(values);
        const touchedFields = fieldsToTouch.reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});

        setTouched(touchedFields); // Mark all fields as touched

        // Validate the form
        const errors = await validateForm();

        if (Object.keys(errors).length === 0) {
            setTabValue((prev) => {
                if (id && prev === 1) {
                    // Skip Tab 2 (Admin Info) when `id` exists
                    return 2;
                }
                return prev + 1;
            });
        } else {
            setErrors(errors); // Display errors
        }
    };

    // Submit form (Create or Edit)
    const handleSubmit = async (values) => {
        // Prepare the payload
        const payload = {
            name: values.name,
            CategoryName: values.CategoryName,
            category: values.CategoryName,
            logoUrl: logoUrl,
            endSubscriptionDate: values.endSubDate,
            brandsLimit: values.brandsLimit || 0,
            branchesLimit: values.branchesLimit || 0,
            notificationsLimit: values.notificationsLimit || 0,
            giftCardsLimit: values.giftCardsLimit || 0,
            adminUser: id
                ? undefined // Skip adminUser for updates
                : {
                      userName: values.phoneNumber,
                      name: values.firstName,
                      surname: values.lastName,
                      password: values.password,
                      emailAddress: values.email,
                      phoneNumber: values.phoneNumber
                  }
        };

        try {
            setLoading(true);

            // Handle logo upload
            if (logoFile) {
                const uploadRes = await fileService.UploadCompanyLogoImage(logoFile);
                payload.logoUrl = uploadRes.data?.result;
                setLogoUrl(uploadRes.data?.result);
            }

            if (!id) {
                // Create new company
                if (!logoFile) {
                    enqueueSnackbar('Image is required', { variant: 'error' });
                    return;
                }
                await userServices.createCompany(payload);
                enqueueSnackbar('Company created successfully', { variant: 'success' });
            } else {
                // Edit existing company
                payload.id = id; // Use `id` from `useParams`
                await userServices.UpdateCompany(payload);
                enqueueSnackbar('Company updated successfully', { variant: 'success' });
            }

            setLoading(false);
            navigate('/apps'); // Redirect after success
        } catch (error) {
            setLoading(false);

            // Extract error message
            const errorMessage =
                error.response?.data?.error?.validationErrors?.[0]?.message || error.response?.data?.error?.message || 'An error occurred';

            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h4">{id ? 'Edit Company' : 'Create New Company'}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={!id ? validationSchemas[tabValue] : validationSchemasEdit[tabValue]}
                        onSubmit={handleSubmit}
                    >
                        {({
                            values,
                            handleChange,
                            handleBlur,
                            validateForm,
                            setErrors,
                            setTouched,
                            errors,
                            setFieldValue,
                            touched,
                            isSubmitting
                        }) => (
                            <Form>
                                <Box sx={{ flexGrow: 1 }}>
                                    {/* Tabs Header */}
                                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="form tabs">
                                        <Tab label="Basic Info" disabled={!id && tabValue !== 0} />
                                        <Tab label="Settings" disabled={!id && tabValue !== 1} />
                                        {!id && <Tab label="Admin Info" disabled={!id && tabValue !== 2} />}
                                        <Tab label="Logo" disabled={!id && tabValue !== 3} />
                                    </Tabs>

                                    {/* Tab Content */}
                                    <TabPanel value={tabValue} index={0}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Company Name"
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
                                                    label="Brands limit"
                                                    name="brandsLimit"
                                                    value={values.brandsLimit}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.brandsLimit && Boolean(errors.brandsLimit)}
                                                    helperText={touched.brandsLimit && errors.brandsLimit}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Stores Limit"
                                                    name="branchesLimit"
                                                    value={values.branchesLimit}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.branchesLimit && Boolean(errors.branchesLimit)}
                                                    helperText={touched.branchesLimit && errors.branchesLimit}
                                                />
                                            </Grid>
                                            {/* <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Notifications Limit"
                                                    name="notificationsLimit"
                                                    value={values.notificationsLimit}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.notificationsLimit && Boolean(errors.notificationsLimit)}
                                                    helperText={touched.notificationsLimit && errors.notificationsLimit}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Giftcards Limit"
                                                    name="giftCardsLimit"
                                                    value={values.giftCardsLimit}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.giftCardsLimit && Boolean(errors.giftCardsLimit)}
                                                    helperText={touched.giftCardsLimit && errors.giftCardsLimit}
                                                />
                                            </Grid> */}
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    select
                                                    fullWidth
                                                    label="Category"
                                                    name="CategoryName"
                                                    value={values.CategoryName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.CategoryName && Boolean(errors.CategoryName)}
                                                    helperText={touched.CategoryName && errors.CategoryName}
                                                >
                                                    {categories.map((category) => (
                                                        <MenuItem key={category} value={category}>
                                                            {category}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    type="date"
                                                    label="End Subscription Date"
                                                    name="endSubDate"
                                                    value={values.endSubDate}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    InputLabelProps={{ shrink: true }}
                                                    error={touched.endSubDate && Boolean(errors.endSubDate)}
                                                    helperText={touched.endSubDate && errors.endSubDate}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container justifyContent="flex-end" spacing={2} sx={{ p: 3 }}>
                                            {tabValue > 0 && (
                                                <Grid item>
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => setTabValue((prev) => prev - 1)}
                                                    >
                                                        Back
                                                    </Button>
                                                </Grid>
                                            )}
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleNext(validateForm, setErrors, setTouched, values)}
                                                >
                                                    {tabValue < validationSchemas.length - 1 ? 'Next' : 'Save'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>

                                    <TabPanel value={tabValue} index={1}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={values.menuViewing}
                                                            onChange={(event) => setFieldValue('menuViewing', event.target.checked)}
                                                        />
                                                    }
                                                    label="Menu Viewing"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={values.tableOrdering}
                                                            onChange={(event) => setFieldValue('tableOrdering', event.target.checked)}
                                                        />
                                                    }
                                                    label="Table Ordering"
                                                    sx={{ ml: 4 }}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container justifyContent="flex-end" spacing={2} sx={{ p: 3 }}>
                                            {tabValue > 0 && (
                                                <Grid item>
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => setTabValue((prev) => prev - 1)}
                                                    >
                                                        Back
                                                    </Button>
                                                </Grid>
                                            )}
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleNext(validateForm, setErrors, setTouched, values)}
                                                >
                                                    {tabValue < validationSchemas.length - 1 ? 'Next' : 'Save'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    {!id && (
                                        <TabPanel value={tabValue} index={2}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="First Name"
                                                        name="firstName"
                                                        value={values.firstName}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.firstName && Boolean(errors.firstName)}
                                                        helperText={touched.firstName && errors.firstName}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Last Name"
                                                        name="lastName"
                                                        value={values.lastName}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.lastName && Boolean(errors.lastName)}
                                                        helperText={touched.lastName && errors.lastName}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Email Address"
                                                        name="email"
                                                        type="email"
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.email && Boolean(errors.email)}
                                                        helperText={touched.email && errors.email}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Password"
                                                        name="password"
                                                        type="password"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.password && Boolean(errors.password)}
                                                        helperText={touched.password && errors.password}
                                                    />
                                                </Grid>
                                                {!id && (
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="Phone Number"
                                                            name="phoneNumber"
                                                            value={values.phoneNumber}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                                            helperText={touched.phoneNumber && errors.phoneNumber}
                                                        />
                                                    </Grid>
                                                )}
                                            </Grid>
                                            <Grid container justifyContent="flex-end" spacing={2} sx={{ p: 3 }}>
                                                {tabValue > 0 && (
                                                    <Grid item>
                                                        <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={() => setTabValue((prev) => prev - 1)}
                                                        >
                                                            Back
                                                        </Button>
                                                    </Grid>
                                                )}
                                                <Grid item>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleNext(validateForm, setErrors, setTouched, values)}
                                                    >
                                                        {tabValue < validationSchemas.length - 1 ? 'Next' : 'Save'}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>
                                    )}
                                    <TabPanel value={tabValue} index={id ? 2 : 3}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Typography variant="h6">Upload Logo</Typography>
                                                <Box
                                                    sx={{
                                                        width: '60%',
                                                        height: 200,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        mt: 2,
                                                        backgroundColor: '#eee',
                                                        ml: '20%'
                                                    }}
                                                >
                                                    {logoFile && (
                                                        <img
                                                            src={URL.createObjectURL(logoFile)}
                                                            alt="Logo Preview"
                                                            style={{
                                                                width: 100,
                                                                height: 70,
                                                                marginBottom: 10
                                                            }}
                                                        />
                                                    )}
                                                    {!logoFile && logoUrl && (
                                                        <img
                                                            src={logoUrl}
                                                            alt="Logo Preview"
                                                            style={{
                                                                width: 100,
                                                                height: 70,
                                                                marginBottom: 10
                                                            }}
                                                        />
                                                    )}
                                                    <CloudUploadOutlined style={{ fontSize: '26px', color: '#08c', marginBottom: 10 }} />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setLogoFile(e.currentTarget.files[0])}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Grid container justifyContent="flex-end" spacing={2} sx={{ p: 3 }}>
                                            {tabValue > 0 && (
                                                <Grid item>
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => setTabValue((prev) => prev - 1)}
                                                    >
                                                        Back
                                                    </Button>
                                                </Grid>
                                            )}
                                            <Grid item>
                                                <Button variant="contained" color="primary" type="submit">
                                                    Submit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AddEditApp;

// Helper TabPanel Component
const TabPanel = ({ children, value, index }) => {
    return value === index ? <Box sx={{ p: 3 }}>{children}</Box> : null;
};
