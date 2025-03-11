import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, MenuItem, Button, Grid, Typography, Box, Tabs, Tab, AppBar, Card, FormControlLabel, Switch } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CloudUploadOutlined } from '@ant-design/icons';
import { ServiceFactory } from 'services/index';
import brandServices from 'services/brandServices';
import fileService from 'services/fileService';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const FormComponent = () => {
    const initialValues = {
        brandName: '',
        brandNameNative: '',
        brandTimeZone: 1,
        company: '',
        contactEmail: '',
        currency: '',
        currencyDecimal: 0,
        emailAddress: '',
        facebookURL: '',
        initialCreditBalance: 0,
        initialCreditBalanceExpiry: null,
        initialCustomerBalance: 0,
        instagramURL: '',
        notificationBalance: 0,
        phoneNumber: '',
        points: 0,
        reportInterval: 1,
        secondaryLanguage: '',
        showFreeDrinkFeature: false,
        twitterURL: '',
        useQRCode: false,
        walletSubtitle: '',
        walletSubtitleNative: ''
    };
    const [initialFormValues, setInitialFormValues] = useState(initialValues); // State to store form values
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();
    const brandsService = ServiceFactory.get('brands');
    const userService = ServiceFactory.get('users');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { id } = useParams();
    const validationSchemas = [
        // Tab 0: Basic Info
        Yup.object({
            brandName: Yup.string().required('Brand Name is required'),
            company: Yup.string().required('Company is required'),
            currency: Yup.string().required('Currency is required'),
            currencyDecimal: Yup.number(),
            notificationBalance: Yup.number()
            // brandNameNative: Yup.string().required('Brand Name (Native) is required'),
            // secondaryLanguage: Yup.string().required('Secondary Language is required'),
            // phoneNumber: Yup.string().required('Phone Number is required'),
            // emailAddress: Yup.string().email('Invalid email format').required('Email Address is required'),

            // reportInterval: Yup.string().required('Report Interval is required'),
            // brandTimeZone: Yup.string().required('Brand Time Zone is required')
        }),
        // Tab 1: Rewards
        Yup.object({}),
        // Tab 2: Settings
        Yup.object({}),
        // Tab 3: Social Links
        Yup.object({
            // contactEmail: Yup.string().email('Invalid email format'),
            // facebookURL: Yup.string().url('Invalid URL'),
            // instagramURL: Yup.string().url('Invalid URL'),
            // twitterURL: Yup.string().url('Invalid URL')
        }),
        // Tab 4: Logo
        Yup.object({})
    ];
    const [tabValue, setTabValue] = useState(0);
    const [dateValue, setDateValue] = useState(new Date());
    const [companies, setCompanies] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [brand, setBrand] = useState();
    const [p1, setP1] = useState(null);
    useEffect(() => {
        getCompanies();
        getLanguages();
        getCurrencies();
    }, []);
    useEffect(() => {
        if (id) {
            getAllBrands();
        }
    }, [id, currencies]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const handleBackChange = (event, newValue) => {
        setTabValue((prev) => prev - 1);
    };
    const handleNext = async (validateForm, setTouched, isValid) => {
        const errors = await validateForm();
        if (Object.keys(errors).length === 0) {
            setTabValue((prev) => prev + 1); // Move to the next tab if no validation errors
        } else {
            setTouched(errors); // Mark all fields as touched to display validation errors
        }
    };

    const getCompanies = async () => {
        await userService
            .GetAllCompanies()
            .then((res) => {
                setCompanies(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.data);
            });
    };
    const getLanguages = async () => {
        await brandsService
            .getLanguages()
            .then((res) => {
                setLanguages(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.data);
            });
    };
    const getCurrencies = async () => {
        await brandsService
            .getCurrencies()
            .then((res) => {
                setCurrencies(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.data);
            });
    };
    const getAllBrands = async () => {
        setloading(true);

        try {
            const response = await brandServices.getAllBrands();
            const brands = response.data.result;
            const selectedBrand = brands.find((e) => e.id === +id); // Replace `id` with the actual route param or identifier
            // Populate the form fields with the selected brand data

            if (selectedBrand) {
                setBrand(selectedBrand);
                setloading(false);

                // Update the form values
                setInitialFormValues({
                    brandName: selectedBrand.name || '',
                    brandNameNative: selectedBrand.nativeName || '',
                    company: selectedBrand.companyId?.toString() || '',
                    secondaryLanguage: selectedBrand.applicationLanguage || '',
                    phoneNumber: selectedBrand.phoneNumber || '',
                    emailAddress: selectedBrand.emailAddress || '',
                    currency: currencies.find((e) => e.name === selectedBrand.currency)?.id || '',
                    currencyDecimal: selectedBrand.currencyDecimals || 0,
                    reportInterval: selectedBrand.reportInterval || 1,
                    brandTimeZone: selectedBrand.brandTimeZone || 1,
                    walletSubtitle: selectedBrand.walletSubTitle || '',
                    walletSubtitleNative: selectedBrand.walletSubTitleNative || '',
                    points: selectedBrand.pointsForWalletReplenishment || 0,
                    initialCustomerBalance: selectedBrand.initialCustomerBalance || 0,
                    initialCreditBalance: selectedBrand.freeItems || 0,
                    initialCreditBalanceExpiry: null,
                    contactEmail: selectedBrand.contactUsEmailAddress || '',
                    facebookURL: selectedBrand.socialFacebookUrl || '',
                    instagramURL: selectedBrand.socialInstaUrl || '',
                    twitterURL: selectedBrand.socialTwitterUrl || '',
                    useQRCode: false,
                    showFreeDrinkFeature: selectedBrand.showFreeDrinkFeature || false,
                    notificationBalance: selectedBrand.notificationBalance || 0
                });
            } else {
                enqueueSnackbar('Brand not found.', { variant: 'error' });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const createNewBrand = async (value) => {
        // Check if p1 (logo file) is provided
        if (!p1) {
            enqueueSnackbar('Please upload a brand logo before submitting.', {
                variant: 'error'
            });
            return; // Exit the function if logo is missing
        }

        const data = {}; // Initialize data if needed
        setloading(true);
        const payload = {
            ...data,
            brandManager: {
                userName: '',
                name: '',
                surname: '',
                password: '',
                address: '',
                emailAddress: '',
                phoneNumber: ''
            },

            aboutApplication: '',
            aboutApplicationNative: '',
            applicationLanguage: value?.secondaryLanguage,
            brandTimeZone: value?.brandTimeZone,
            companyId: value.company,
            contactUsEmailAddress: value?.contactEmail,
            currency: value.currency,
            currencyDecimals: value.currencyDecimal,
            currencyId: value.currency,
            emailAddress: '',
            faq: '',
            faqNative: '',
            freeItems: 0,
            initialCustomerBalance: value.initialCustomerBalance,
            logoUrl: '',
            minimumTopUpValue: 0,
            name: value.brandName,
            nativeName: value?.brandNameNative,
            // notificationBalance: value?.notificationBalance,
            phoneNumber: value?.phoneNumber,
            pointsForWalletReplenishment: value.points,
            privacyPolicy: '',
            privacyPolicyNative: '',
            reportInterval: value?.reportInterval,
            showFreeDrinkFeature: value?.showFreeDrinkFeature,
            socialFacebookUrl: value?.facebookURL,
            socialInstaUrl: value?.instagramURL,
            socialTwitterUrl: value?.twitterURL,
            termsAndConditions: '',
            termsAndConditionsNative: '',
            useTopUpValues: true,
            walletSubTitle: value?.walletSubtitle,
            walletSubTitleNative: value?.walletSubtitleNative
        };

        try {
            // Upload logo
            const logoResponse = await fileService.UploadBrandLogoImage(p1);
            payload.logoUrl = logoResponse.data?.result;

            // Create brand
            const brandResponse = await brandServices.createBrand(payload);
            setloading(false);
            enqueueSnackbar('Brand Created Successfully', {
                variant: 'success'
            });
            navigate('/brands');
            console.log(brandResponse?.data, 'Brand Created');
        } catch (error) {
            console.error(error.response?.data);
            if (error.response?.data) {
                enqueueSnackbar(
                    error?.response?.data?.error?.validationErrors?.[0]?.message ||
                        error.response?.data?.error?.message ||
                        'An error occurred while saving the Brand.',
                    {
                        variant: 'error'
                    }
                );
            }
        }
    };
    const updateBrand = async (value) => {
        // Check if logo file is provided
        setloading(true);
        const payload = {
            ...brand,
            ...value,
            brandManager: [
                {
                    ...value.brandManager
                }
            ],
            applicationLanguage: value?.secondaryLanguage,
            brandTimeZone: value?.brandTimeZone,
            companyId: value.company,
            contactUsEmailAddress: value?.contactEmail,
            notificationBalance: value?.notificationBalance,
            // currency: value.currency,
            currencyDecimals: value.currencyDecimal,
            currencyId: value.currency,
            initialCustomerBalance: value.initialCustomerBalance,
            pointsForWalletReplenishment: value.points,
            showFreeDrinkFeature: value?.showFreeDrinkFeature,
            socialFacebookUrl: value?.facebookURL,
            socialInstaUrl: value?.instagramURL,
            socialTwitterUrl: value?.twitterURL,
            walletSubTitle: value?.walletSubtitle,
            walletSubTitleNative: value?.walletSubtitleNative
        };

        try {
            // Upload logo
            if (p1) {
                const logoResponse = await fileService.UploadBrandLogoImage(p1);
                payload.logoUrl = logoResponse.data?.result;
            }
            // Update brand
            const brandResponse = await brandServices.UpdateBrand(payload);
            setloading(false);

            enqueueSnackbar('Brand Updated Successfully', {
                variant: 'success'
            });
            navigate('/brands'); // Redirect to the brands page after update
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.error?.validationErrors?.[0]?.message || 'An error occurred while saving the Brand.', {
                variant: 'error'
            });
            // console.error(error.response?.data);
            // enqueueSnackbar('Failed to update the brand. Please try again.', {
            //     variant: 'error'
            // });
        } finally {
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h4">{id ? 'Edit  Brand' : 'Create Brand'}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    {loading && (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    )}
                    <Formik
                        initialValues={initialFormValues}
                        validationSchema={validationSchemas[tabValue]}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            if (tabValue < validationSchemas.length - 1) {
                                setTabValue((prev) => prev + 1); // Move to the next tab on valid submit
                            } else {
                                console.log('Final Submit');
                                if (!id) {
                                    createNewBrand(values);
                                } else {
                                    updateBrand(values);
                                }
                            }
                        }}
                    >
                        {({ values, handleChange, errors, touched, validateForm, isValid, setFieldValue, setTouched }) => (
                            <Form>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                                        <Tab label="Basic Info" disabled={!id && tabValue !== 0} />
                                        <Tab label="Rewards" disabled={!id && tabValue !== 1} />
                                        <Tab label="Settings" disabled={!id && tabValue !== 2} />
                                        <Tab label="Social Links" disabled={!id && tabValue !== 3} />
                                        <Tab label="Logo" disabled={!id && tabValue !== 4} />
                                    </Tabs>
                                    {/* BASIC INFO START */}
                                    <TabPanel value={tabValue} index={0}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="brandName"
                                                    label="Brand Name*"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.brandName && Boolean(errors.brandName)}
                                                    helperText={touched.brandName && errors.brandName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="brandNameNative"
                                                    label="Brand Name (Native)"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.brandNameNative && Boolean(errors.brandNameNative)}
                                                    helperText={touched.brandNameNative && errors.brandNameNative}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="company"
                                                    label="Company*"
                                                    select
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.company && Boolean(errors.company)}
                                                    helperText={touched.company && errors.company}
                                                >
                                                    {companies.map((e) => (
                                                        <MenuItem key={e.id} value={e.id}>
                                                            {e.name}
                                                        </MenuItem>
                                                    ))}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="secondaryLanguage"
                                                    label="Secondary Language"
                                                    select
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.secondaryLanguage && Boolean(errors.secondaryLanguage)}
                                                    helperText={touched.secondaryLanguage && errors.secondaryLanguage}
                                                >
                                                    {languages.map((e) => (
                                                        <MenuItem key={e.name} value={e.name}>
                                                            {e.displayName}
                                                        </MenuItem>
                                                    ))}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="phoneNumber"
                                                    label="Phone Number"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                                    helperText={touched.phoneNumber && errors.phoneNumber}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="emailAddress"
                                                    label="Email Address"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.emailAddress && Boolean(errors.emailAddress)}
                                                    helperText={touched.emailAddress && errors.emailAddress}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="currency"
                                                    label="Currency*"
                                                    select
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.currency && Boolean(errors.currency)}
                                                    helperText={touched.currency && errors.currency}
                                                >
                                                    {currencies.map((e) => (
                                                        <MenuItem key={e.id} value={e.id}>
                                                            {e.name}
                                                        </MenuItem>
                                                    ))}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="currencyDecimal"
                                                    label="Currency Decimal"
                                                    fullWidth
                                                    type="number"
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.currencyDecimal && Boolean(errors.currencyDecimal)}
                                                    helperText={touched.currencyDecimal && errors.currencyDecimal}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="reportInterval"
                                                    label="Report Interval"
                                                    select
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.reportInterval && Boolean(errors.reportInterval)}
                                                    helperText={touched.reportInterval && errors.reportInterval}
                                                >
                                                    <MenuItem value="1">Weekly</MenuItem>
                                                    <MenuItem value="2">Monthly</MenuItem>
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="brandTimeZone"
                                                    label="Brand Time Zone"
                                                    select
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.brandTimeZone && Boolean(errors.brandTimeZone)}
                                                    helperText={touched.brandTimeZone && errors.brandTimeZone}
                                                >
                                                    <MenuItem value="1">GreenWich</MenuItem>
                                                    <MenuItem value="2">Universal 2</MenuItem>
                                                </Field>
                                            </Grid>
                                            {id && (
                                                <Grid item xs={12} sm={6}>
                                                    <Field
                                                        as={TextField}
                                                        name="notificationBalance"
                                                        label="Notification Balance"
                                                        fullWidth
                                                        type="number"
                                                        variant="outlined"
                                                        onChange={handleChange}
                                                        error={touched.notificationBalance && Boolean(errors.notificationBalance)}
                                                        helperText={touched.notificationBalance && errors.notificationBalance}
                                                    />
                                                </Grid>
                                            )}
                                            <Grid item xs={12} container justifyContent="flex-end">
                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleNext(validateForm, setTouched, isValid)}
                                                    disabled={!isValid}
                                                    sx={{ minWidth: '120px' }}
                                                >
                                                    Next
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    {/* BASIC INFO END */}
                                    {/* REWARD START */}
                                    <TabPanel value={tabValue} index={1}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="walletSubtitle"
                                                    label="Wallet Subtitle"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.walletSubtitle && Boolean(errors.walletSubtitle)}
                                                    helperText={touched.walletSubtitle && errors.walletSubtitle}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="walletSubtitleNative"
                                                    label="Wallet Subtitle (Native)"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.walletSubtitleNative && Boolean(errors.walletSubtitleNative)}
                                                    helperText={touched.walletSubtitleNative && errors.walletSubtitleNative}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="points"
                                                    label="Points"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.points && Boolean(errors.points)}
                                                    helperText={touched.points && errors.points}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="initialCustomerBalance"
                                                    label="Initial Customer Balance"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.initialCustomerBalance && Boolean(errors.initialCustomerBalance)}
                                                    helperText={touched.initialCustomerBalance && errors.initialCustomerBalance}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="initialCreditBalance"
                                                    label="Initial Credit Balance"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.initialCreditBalance && Boolean(errors.initialCreditBalance)}
                                                    helperText={touched.initialCreditBalance && errors.initialCreditBalance}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        label="Initial Credit Balance Expiry"
                                                        value={dateValue}
                                                        onChange={(newValue) => {
                                                            setDateValue(newValue);
                                                            setFieldValue('initialCreditBalanceExpiry', newValue);
                                                        }}
                                                        renderInput={(params) => <TextField fullWidth {...params} />}
                                                    />
                                                </LocalizationProvider>
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
                                    {/* REWARD END */}
                                    {/* SETTINGS  START */}
                                    <TabPanel value={tabValue} index={2}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={
                                                        <Field
                                                            as={Switch}
                                                            name="useQRCode"
                                                            checked={values.useQRCode}
                                                            onChange={handleChange}
                                                        />
                                                    }
                                                    label="Use QR Code"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Field
                                                            as={Switch}
                                                            name="showFreeDrinkFeature"
                                                            checked={values.showFreeDrinkFeature}
                                                            onChange={handleChange}
                                                        />
                                                    }
                                                    label="Free Drinks"
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
                                        {/* SETTING END */}
                                    </TabPanel>
                                    {/* SETTINGS END */}

                                    {/* Social Links Tab */}
                                    <TabPanel value={tabValue} index={3}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="contactEmail"
                                                    label="Contact Us Email Address"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.contactEmail && Boolean(errors.contactEmail)}
                                                    helperText={touched.contactEmail && errors.contactEmail}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="facebookURL"
                                                    label="Facebook URL"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.facebookURL && Boolean(errors.facebookURL)}
                                                    helperText={touched.facebookURL && errors.facebookURL}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="instagramURL"
                                                    label="Instagram URL"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.instagramURL && Boolean(errors.instagramURL)}
                                                    helperText={touched.instagramURL && errors.instagramURL}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field
                                                    as={TextField}
                                                    name="twitterURL"
                                                    label="Twitter URL"
                                                    fullWidth
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    error={touched.twitterURL && Boolean(errors.twitterURL)}
                                                    helperText={touched.twitterURL && errors.twitterURL}
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
                                    {/* SOCIAL END */}
                                    <TabPanel value={tabValue} index={4}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Grid container>
                                                    <Grid item xs={4}>
                                                        <Typography variant="h7">Upload Logo</Typography>
                                                    </Grid>
                                                    <Grid item xs={8} />

                                                    <Grid item xs={12}>
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
                                                            {!p1 && brand && brand.logoUrl && (
                                                                <img
                                                                    src={brand?.logoUrl}
                                                                    style={{
                                                                        width: 100,
                                                                        height: 70
                                                                    }}
                                                                    alt="img"
                                                                />
                                                            )}
                                                            <CloudUploadOutlined style={{ fontSize: '26px', color: '#08c' }} />

                                                            <input
                                                                type="file"
                                                                onChange={async (e) => {
                                                                    setP1(e.currentTarget.files[0]);
                                                                }}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
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
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        sx={{ minWidth: '120px' }} // Consistent button size
                                                    >
                                                        {tabValue === validationSchemas.length - 1 ? 'Submit' : 'Next'}{' '}
                                                        {/* Dynamically change label */}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>

                                    {/* Add other TabPanel components for the other tabs (Rewards, Settings, etc.) */}
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </Grid>
        </Grid>
    );
};

export default FormComponent;
